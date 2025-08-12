'use client';

import React from 'react';
import Link from 'next/link';
import { ProgressProvider, useProgress } from '@/hooks/useProgress';

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
    <article className={`group relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 ease-out hover:-translate-y-2 ${className}`}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Course Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-right">
              <div className="text-2xl font-light text-gray-900 mb-1">{Math.round(progress)}%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Complete</div>
            </div>
          </div>
          
          <h3 className="text-2xl font-medium text-gray-900 mb-3 leading-tight">
            {course.title}
          </h3>
          <p className="text-gray-600 text-lg font-light leading-relaxed line-clamp-3">
            {course.description}
          </p>
        </header>
        
        {/* Progress and Stats */}
        <div className="mb-8">
          {/* Progress Bar - Apple style */}
          <div className="w-full bg-gray-100 rounded-full h-1 mb-4">
            <div 
              className="bg-blue-600 h-1 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
              role="progressbar" 
              aria-valuenow={progress} 
              aria-valuemin={0} 
              aria-valuemax={100}
            ></div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{totalLessons} chapters</span>
            <span>{completedLessons} completed</span>
          </div>
        </div>
        
        {/* Action Button */}
        <footer>
          <Link href={`/courses/${course.id}`}>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-full text-lg transition-all duration-200 ease-out hover:scale-[1.02] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              {progress === 100 ? 'Review Course' : progress > 0 ? 'Continue Learning' : 'Start Learning'}
            </button>
          </Link>
        </footer>
      </div>
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
