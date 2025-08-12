'use client';

import React, { useEffect } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { useLessonState, type Lesson } from '@/hooks/useLessonState';

interface LessonSidebarProps {
  lessons: Lesson[];
  courseId: string;
  onLessonSelect?: (lessonId: string, lesson: Lesson) => void;
}

const LessonSidebar: React.FC<LessonSidebarProps> = ({ 
  lessons, 
  courseId, 
  onLessonSelect 
}) => {
  const { isComplete } = useProgress();
  const { activeLesson, setActiveLesson, setActiveLessonData } = useLessonState();

  // Initialize with first lesson if no active lesson is set
  useEffect(() => {
    if (!activeLesson && lessons.length > 0) {
      setActiveLesson(lessons[0].id);
      setActiveLessonData(lessons[0]);
    }
  }, [activeLesson, lessons, setActiveLesson, setActiveLessonData]);

  const handleLessonClick = (lessonId: string, lesson: Lesson, index: number) => {
    // Check if the lesson is allowed (sequential gating)
    if (!isLessonAllowed(index)) {
      return; // Do nothing if lesson is disabled
    }

    setActiveLesson(lessonId);
    setActiveLessonData(lesson);
    onLessonSelect?.(lessonId, lesson);
  };

  const handleKeyDown = (event: React.KeyboardEvent, lessonId: string, lesson: Lesson, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLessonClick(lessonId, lesson, index);
    }
  };

  const isLessonAllowed = (index: number): boolean => {
    // First lesson is always allowed
    if (index === 0) return true;
    
    // Check if the previous lesson is complete
    const previousLesson = lessons[index - 1];
    return previousLesson ? isComplete(previousLesson.id) : false;
  };

  const renderCompletionIcon = (lessonId: string) => {
    if (isComplete(lessonId)) {
      return (
        <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center ml-2">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Lessons
      </h2>
      <nav className="space-y-2" role="navigation" aria-label="Course lessons">
        <ol className="space-y-2">
          {lessons.map((lesson, index) => {
            const isAllowed = isLessonAllowed(index);
            const isActive = activeLesson === lesson.id;
            
            return (
              <li key={lesson.id}>
                <button
                  className={`
                    w-full flex items-center p-3 rounded-lg transition-colors text-left
                    ${isActive 
                      ? 'bg-blue-50 border-2 border-blue-200' 
                      : 'hover:bg-gray-50 border-2 border-transparent'
                    }
                    ${isAllowed 
                      ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' 
                      : 'opacity-50 cursor-not-allowed'
                    }
                  `}
                  onClick={() => handleLessonClick(lesson.id, lesson, index)}
                  onKeyDown={(e) => handleKeyDown(e, lesson.id, lesson, index)}
                  disabled={!isAllowed}
                  aria-current={isActive ? 'page' : undefined}
                  aria-describedby={`lesson-${lesson.id}-type`}
                >
                  {/* Lesson Number */}
                  <div 
                    className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3
                      ${isActive
                        ? 'bg-blue-600 text-white'
                        : isAllowed
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }
                    `}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </div>
                  
                  {/* Lesson Content */}
                  <div className="flex-1 min-w-0">
                    <p 
                      className={`
                        text-sm font-medium line-clamp-2
                        ${isActive
                          ? 'text-blue-900'
                          : isAllowed
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }
                      `}
                    >
                      {lesson.title}
                    </p>
                    <p 
                      id={`lesson-${lesson.id}-type`}
                      className={`
                        text-xs capitalize
                        ${isActive
                          ? 'text-blue-700'
                          : isAllowed
                            ? 'text-gray-500'
                            : 'text-gray-400'
                        }
                      `}
                    >
                      {lesson.type}
                    </p>
                  </div>
                  
                  {/* Completion Icon */}
                  {renderCompletionIcon(lesson.id)}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </section>
  );
};

export default LessonSidebar;
