'use client';

import { useState } from 'react';
import { courseManifest } from '@/data/courseManifest';
import { notFound } from 'next/navigation';
import { ProgressProvider } from '@/hooks/useProgress';
import LessonSidebar from '@/components/LessonSidebar';
import MediaPlayer from '@/components/MediaPlayer';
import SCORMAdapter from '@/components/SCORMAdapter';

interface CoursePlayerProps {
  courseId: string;
}

// Client component for interactive course player
export default function CoursePlayer({ courseId }: CoursePlayerProps) {
  const course = courseManifest.find((c) => c.id === courseId);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  
  if (!course) {
    notFound();
  }

  const currentLesson = course.lessons[currentLessonIndex];

  const handleLessonSelect = (lessonId: string) => {
    const lessonIndex = course.lessons.findIndex(l => l.id === lessonId);
    if (lessonIndex !== -1) {
      setCurrentLessonIndex(lessonIndex);
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleLessonComplete = () => {
    // Auto-advance to next lesson when current lesson is completed
    if (currentLessonIndex < course.lessons.length - 1) {
      setTimeout(() => {
        setCurrentLessonIndex(currentLessonIndex + 1);
      }, 1000); // Small delay for better UX
    }
  };

  return (
    <ProgressProvider courseId={courseId}>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Course Header - Apple style */}
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-light text-gray-900 mb-3 tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
              {course.description}
            </p>
          </header>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Lesson Navigation */}
            <aside className="w-full lg:w-1/4">
              <LessonSidebar
                lessons={course.lessons.map(lesson => ({
                  id: lesson.id,
                  title: lesson.title,
                  type: lesson.type,
                  src: lesson.src
                }))}
                courseId={courseId}
                onLessonSelect={handleLessonSelect}
              />
            </aside>

            {/* Main Content Area - Player */}
            <main className="w-full lg:w-3/4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Player Header */}
                <header className="bg-gray-900 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-medium mb-1">
                        {currentLesson.title}
                      </h2>
                      <p className="text-gray-300 text-sm capitalize">
                        {currentLesson.type} • Lesson {currentLessonIndex + 1} of {course.lessons.length}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        {Math.round(((currentLessonIndex + 1) / course.lessons.length) * 100)}% Complete
                      </div>
                    </div>
                  </div>
                </header>

                {/* Player Content */}
                <div className="relative">
                  <SCORMAdapter
                    lesson={currentLesson}
                    onComplete={handleLessonComplete}
                  >
                    <MediaPlayer
                      lesson={currentLesson}
                      onComplete={handleLessonComplete}
                    />
                  </SCORMAdapter>
                </div>

                {/* Player Controls */}
                <footer className="p-6 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handlePrevious}
                      disabled={currentLessonIndex === 0}
                      className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>

                    <div className="text-sm text-gray-500">
                      Lesson {currentLessonIndex + 1} of {course.lessons.length}
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={currentLessonIndex === course.lessons.length - 1}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full font-medium text-sm transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Next
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </footer>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProgressProvider>
  );
}
