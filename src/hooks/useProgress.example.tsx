/**
 * Example usage of the useProgress context
 * 
 * This file demonstrates how to implement the progress context in your app
 */

import React from 'react';
import { ProgressProvider, useProgress } from './useProgress';
import { courseManifest } from '../data/courseManifest';

// Example: App layout with ProgressProvider
export const AppWithProgress: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the first course as default, or provide a specific courseId
  const defaultCourseId = courseManifest[0]?.id || 'default-course';
  
  return (
    <ProgressProvider courseId={defaultCourseId}>
      {children}
    </ProgressProvider>
  );
};

// Example: Lesson component that tracks completion
export const LessonComponent: React.FC<{ lessonId: string; title: string }> = ({ lessonId, title }) => {
  const { markComplete, isComplete } = useProgress();
  
  const handleLessonComplete = () => {
    markComplete(lessonId);
  };

  const completed = isComplete(lessonId);

  return (
    <div className={`lesson ${completed ? 'completed' : ''}`}>
      <h3>{title}</h3>
      <div>
        Status: {completed ? '✅ Completed' : '⏳ In Progress'}
      </div>
      {!completed && (
        <button onClick={handleLessonComplete}>
          Mark as Complete
        </button>
      )}
    </div>
  );
};

// Example: Course navigation with progress indicators (for a specific course)
export const CourseNavigation: React.FC<{ courseId: string }> = ({ courseId }) => {
  const { completedLessons, isComplete } = useProgress();
  const course = courseManifest.find(c => c.id === courseId);
  
  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <nav className="course-nav">
      <div>Progress: {completedLessons.length} / {course.lessons.length}</div>
      <ul>
        {course.lessons.map(lesson => (
          <li key={lesson.id} className={isComplete(lesson.id) ? 'completed' : 'incomplete'}>
            {lesson.title} {isComplete(lesson.id) ? '✅' : '○'}
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Example: Route guard component
export const RouteGuard: React.FC<{ 
  requiredLessons: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ requiredLessons, children, fallback }) => {
  const { isComplete } = useProgress();
  
  const allRequiredCompleted = requiredLessons.every(lessonId => isComplete(lessonId));
  
  if (!allRequiredCompleted) {
    return (
      <>
        {fallback || (
          <div>
            <h2>Prerequisites Required</h2>
            <p>Please complete the following lessons first:</p>
            <ul>
              {requiredLessons
                .filter(lessonId => !isComplete(lessonId))
                .map(lessonId => (
                  <li key={lessonId}>
                    {courseManifest.flatMap(c => c.lessons).find(l => l.id === lessonId)?.title || lessonId}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </>
    );
  }
  
  return <>{children}</>;
};

// Example: Admin panel for debugging progress
export const ProgressDebugPanel: React.FC = () => {
  const { completedLessons, clearProgress, markComplete } = useProgress();

  return (
    <div className="debug-panel" style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem' }}>
      <h4>Progress Debug Panel</h4>
      <div>
        <strong>Completed Lessons:</strong> {completedLessons.join(', ') || 'None'}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={clearProgress} style={{ marginRight: '0.5rem' }}>
          Clear All Progress
        </button>
        {courseManifest.flatMap(c => c.lessons).map(lesson => (
          <button
            key={lesson.id}
            onClick={() => markComplete(lesson.id)}
            style={{ margin: '0 0.25rem' }}
          >
            Complete {lesson.title}
          </button>
        ))}
      </div>
    </div>
  );
};
