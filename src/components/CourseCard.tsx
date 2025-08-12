'use client';

import React from 'react';
import { ProgressProvider, useProgress } from '@/hooks/useProgress';
import ProgressBar from './ProgressBar';

interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Array<{
    id: string;
    title: string;
    type: string;
    src: string;
  }>;
}

interface CourseCardProps {
  course: Course;
  className?: string;
}

// Inner component that uses the progress hook
const CourseCardContent: React.FC<CourseCardProps> = ({ course, className = '' }) => {
  const { isComplete } = useProgress();
  
  // Calculate progress based on completed lessons
  const completedLessons = course.lessons.filter(lesson => isComplete(lesson.id)).length;
  const totalLessons = course.lessons.length;
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  
  return (
    <article className={`card-shadow bg-card rounded-xl p-6 border border-border hover:shadow-card-hover transition-all duration-300 ease-out hover:-translate-y-1 ${className}`}>
      {/* Course Header */}
      <header className="mb-4">
        <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-foreground/70 text-sm leading-relaxed line-clamp-3">
          {course.description}
        </p>
      </header>
      
      {/* Course Stats */}
      <div className="mb-4 flex items-center justify-between text-xs text-foreground/60" role="status" aria-label="Course statistics">
        <span>{totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'}</span>
        <span>{completedLessons} completed</span>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Course progress: ${Math.round(progress)}%`}>
        <ProgressBar 
          progress={progress}
          variant={progress === 100 ? 'success' : 'default'}
          size="md"
          showPercentage={false}
        />
      </div>
      
      {/* Course Actions */}
      <footer className="flex items-center justify-between">
        <div className="text-sm" aria-live="polite">
          {progress === 100 ? (
            <span className="text-brand-success font-medium">✓ Completed</span>
          ) : progress > 0 ? (
            <span className="text-brand-primary font-medium">Continue Learning</span>
          ) : (
            <span className="text-foreground/70 font-medium">Start Course</span>
          )}
        </div>
        <button 
          className="bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          onClick={() => {
            // This would typically navigate to the course page
            // For now, we'll just log the action
            console.log(`Navigate to course: ${course.id}`);
          }}
          aria-describedby={`course-${course.id}-status`}
        >
          {progress === 100 ? 'Review' : progress > 0 ? 'Continue' : 'Start'}
        </button>
      </footer>
    </article>
  );
};

// Main component that wraps content with ProgressProvider
const CourseCard: React.FC<CourseCardProps> = ({ course, className = '' }) => {
  return (
    <ProgressProvider courseId={course.id}>
      <CourseCardContent course={course} className={className} />
    </ProgressProvider>
  );
};

export default CourseCard;
