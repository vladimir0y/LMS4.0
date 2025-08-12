'use client';

import React from 'react';
import { MediaPlayer } from '@/components';
import { useProgress } from '@/hooks/useProgress';
import { LessonStateProvider, useLessonState, type Lesson } from '@/hooks/useLessonState';

interface MediaPlayerExampleProps {
  courseId: string;
  lessons: Lesson[];
}

/**
 * Example component showing how to integrate MediaPlayer
 * This would typically be part of your course page
 */
const MediaPlayerContent: React.FC<MediaPlayerExampleProps> = ({ courseId, lessons }) => {
  const { activeLessonData, setActiveLessonData, setActiveLesson } = useLessonState();
  const { isComplete } = useProgress();
  
  // Default to first lesson if none selected
  const currentLesson = activeLessonData || lessons[0];

  const handleLessonSelect = (lesson: Lesson) => {
    setActiveLesson(lesson.id);
    setActiveLessonData(lesson);
  };

  if (!currentLesson) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No lessons available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Lesson Sidebar */}
      <div className="w-full md:w-1/4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Lessons
          </h2>
          <nav className="space-y-2">
            {lessons.map((lesson, index) => {
              const completed = isComplete(lesson.id);
              const active = lesson.id === currentLesson.id;
              
              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson)}
                  className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                    active 
                      ? 'bg-blue-100 border-2 border-blue-300' 
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                    completed 
                      ? 'bg-green-100 text-green-600'
                      : active
                      ? 'bg-blue-100 text-blue-600'  
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {completed ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {lesson.title}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {lesson.type}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Media Player */}
      <div className="w-full md:w-3/4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-800 text-white p-4">
            <h3 className="text-lg font-semibold">
              {currentLesson.title}
            </h3>
            <p className="text-gray-300 text-sm capitalize">
              {currentLesson.type} content
            </p>
          </div>
          
          <div className="p-6">
            <MediaPlayer
              lesson={currentLesson}
              courseId={courseId}
              lessons={lessons}
              onLessonChange={handleLessonSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MediaPlayerExample: React.FC<MediaPlayerExampleProps> = (props) => {
  return (
    <LessonStateProvider>
      <MediaPlayerContent {...props} />
    </LessonStateProvider>
  );
};

export default MediaPlayerExample;
