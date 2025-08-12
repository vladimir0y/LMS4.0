'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { useLessonState, type Lesson } from '@/hooks/useLessonState';

interface MediaPlayerProps {
  lesson: Lesson;
  courseId?: string; // Made optional since it's not used in the component logic
  lessons: Lesson[];
  onLessonChange?: (lesson: Lesson) => void;
}

// Type for SCORM postMessage events
interface SCORMEvent {
  type: 'scorm-event';
  eventType: 'initialize' | 'finish' | 'complete' | 'commit' | 'datachange';
  data: {
    lessonStatus?: string;
    score?: string;
    suspendData?: string;
    sessionTime?: string;
    element?: string;
    value?: string;
    timestamp?: string;
    [key: string]: unknown;
  };
}

interface SCORMAPIInterface {
  LMSInitialize: (param: string) => string;
  LMSFinish: (param: string) => string;
  LMSGetValue: (element: string) => string;
  LMSSetValue: (element: string, value: string) => string;
  LMSCommit: (param: string) => string;
  LMSGetLastError: () => string;
  LMSGetErrorString: (errorCode: string) => string;
  LMSGetDiagnostic: (errorCode: string) => string;
}

interface SCORMAPIWindow extends Window {
  API?: SCORMAPIInterface;
  API_1484_11?: SCORMAPIInterface;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({
  lesson,
  courseId, // eslint-disable-line @typescript-eslint/no-unused-vars
  lessons,
  onLessonChange
}) => {
  const { markComplete, isComplete } = useProgress();
  const { setActiveLesson, setActiveLessonData } = useLessonState();
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lessonCompleted = useRef(false);

  // Find current lesson index
  const currentLessonIndex = lessons.findIndex(l => l.id === lesson.id);
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null;
  const isLessonComplete = isComplete(lesson.id);

  // Handle lesson completion
  const handleLessonComplete = useCallback(() => {
    if (!lessonCompleted.current) {
      lessonCompleted.current = true;
      markComplete(lesson.id);
      
      // Auto-advance to next lesson if exists
      if (nextLesson) {
        setTimeout(() => {
          setActiveLesson(nextLesson.id);
          setActiveLessonData(nextLesson);
          onLessonChange?.(nextLesson);
          lessonCompleted.current = false;
        }, 2000); // 2 second delay for better UX
      }
    }
  }, [lesson.id, nextLesson, markComplete, setActiveLesson, setActiveLessonData, onLessonChange]);

  // Video event handlers
  const handleVideoEnded = useCallback(() => {
    handleLessonComplete();
  }, [handleLessonComplete]);

  // SCORM completion handler (called from SCORM content)
  const handleSCORMComplete = useCallback(() => {
    handleLessonComplete();
  }, [handleLessonComplete]);

  // Set up SCORM API and postMessage listener for SCORM content
  useEffect(() => {
    if (lesson.type === 'scorm' && typeof window !== 'undefined') {
      // Load and inject SCORM API into window
      const injectSCORMAPI = () => {
        const script = document.createElement('script');
        script.src = '/scorm-api.js';
        script.onload = () => {
          console.log('SCORM API script loaded');
          
          // Ensure API is available globally for iframe content
          const scormWindow = window as SCORMAPIWindow;
          if (scormWindow.API) {
            console.log('SCORM API is ready and available globally');
          }
        };
        script.onerror = (error) => {
          console.error('Failed to load SCORM API script:', error);
        };
        
        // Check if script is already loaded
        const existingScript = document.querySelector('script[src="/scorm-api.js"]');
        if (!existingScript) {
          document.head.appendChild(script);
        }
      };

      // Set up postMessage listener for SCORM events from iframe
      const handleSCORMMessage = (event: MessageEvent<SCORMEvent>) => {
        // Only process SCORM events
        if (event.data?.type !== 'scorm-event') return;

        const { eventType, data } = event.data;
        console.log('SCORM Event received:', eventType, data);

        switch (eventType) {
          case 'initialize':
            console.log('SCORM: Lesson initialized at', data.timestamp);
            break;
            
          case 'complete':
            console.log('SCORM: Lesson completed with status:', data.lessonStatus);
            handleSCORMComplete();
            break;
            
          case 'finish':
            console.log('SCORM: Session finished. Session time:', data.sessionTime);
            if (data.lessonStatus === 'completed' || data.lessonStatus === 'passed') {
              handleSCORMComplete();
            }
            break;
            
          case 'commit':
            console.log('SCORM: Data committed. Session time:', data.sessionTime);
            break;
            
          case 'datachange':
            console.log('SCORM: Data changed -', data.element, ':', data.value);
            // Handle completion status changes
            if (data.element === 'cmi.core.lesson_status' && 
                (data.value === 'completed' || data.value === 'passed')) {
              handleSCORMComplete();
            }
            break;
            
          default:
            console.log('SCORM: Unknown event type:', eventType);
        }
      };

      // Inject SCORM API and set up message listener
      injectSCORMAPI();
      window.addEventListener('message', handleSCORMMessage);

      return () => {
        // Cleanup
        window.removeEventListener('message', handleSCORMMessage);
        
        // Remove SCORM API script if needed
        const existingScript = document.querySelector('script[src="/scorm-api.js"]');
        if (existingScript) {
          existingScript.remove();
        }
        
        // Clean up global API
        const scormWindow = window as SCORMAPIWindow;
        delete scormWindow.API;
        delete scormWindow.API_1484_11;
      };
    }
  }, [lesson.type, lesson.id, handleSCORMComplete]);

  // Reset completion tracking when lesson changes
  useEffect(() => {
    lessonCompleted.current = false;
  }, [lesson.id]);

  // Handle iframe load for SCORM content
  const handleIframeLoad = useCallback(() => {
    if (lesson.type === 'scorm' && iframeRef.current?.contentWindow) {
      console.log('SCORM iframe loaded for lesson:', lesson.title);
      
      try {
        // Try to inject SCORM API into iframe if it doesn't have access to parent
        const iframeWindow = iframeRef.current.contentWindow as SCORMAPIWindow;
        const parentWindow = window as SCORMAPIWindow;
        
        // Ensure parent API is loaded before injecting
        if (parentWindow.API && (!iframeWindow.API && !iframeWindow.API_1484_11)) {
          iframeWindow.API = parentWindow.API;
          iframeWindow.API_1484_11 = parentWindow.API_1484_11;
          console.log('SCORM API successfully injected into iframe');
        } else if (!parentWindow.API) {
          console.log('Parent SCORM API not yet loaded, iframe will use postMessage');
        }
      } catch (error) {
        // Cross-origin restrictions may prevent direct injection
        // The iframe content can still communicate via postMessage
        console.log('Direct API injection blocked (likely cross-origin), using postMessage:', error);
      }
    }
  }, [lesson.type, lesson.title]);

  const renderContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <video
            ref={videoRef}
            controls
            src={lesson.src}
            className="w-full h-auto"
            onEnded={handleVideoEnded}
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        );

      case 'scorm':
        return (
          <div className="relative w-full h-[70vh]">
            <iframe
              ref={iframeRef}
              src={lesson.src}
              className="w-full h-full border-0"
              title={lesson.title}
              onLoad={handleIframeLoad}
              allow="fullscreen"
              sandbox="allow-scripts allow-same-origin allow-forms allow-downloads"
            />
          </div>
        );

      default:
        return (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Unsupported content type: {lesson.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="media-player">
      {/* Lesson Status Indicator */}
      {isLessonComplete && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-green-800 font-medium">Lesson completed!</span>
            {nextLesson && (
              <span className="text-green-600 ml-2">
                Advancing to &ldquo;{nextLesson.title}&rdquo; in a moment...
              </span>
            )}
          </div>
        </div>
      )}

      {/* Media Content */}
      {renderContent()}

      {/* Lesson Info */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{lesson.title}</h3>
            <p className="text-sm text-gray-600 capitalize">
              {lesson.type} content
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Lesson {currentLessonIndex + 1} of {lessons.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;
