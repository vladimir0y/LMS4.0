'use client';

import React, { useEffect } from 'react';

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

interface SCORMAdapterProps {
  onComplete?: () => void;
  onProgress?: (data: SCORMEvent['data']) => void;
  lessonId?: string;
}

/**
 * Enhanced SCORM Adapter component for sophisticated SCORM tracking
 * This component integrates with the new postMessage-based SCORM API system
 * and provides detailed tracking capabilities
 */
const SCORMAdapter: React.FC<SCORMAdapterProps> = ({ onComplete, onProgress, lessonId }) => {
  useEffect(() => {
    console.log('Enhanced SCORM Adapter loaded for lesson:', lessonId);
    
    // Enhanced postMessage listener for detailed SCORM tracking
    const handleSCORMMessage = (event: MessageEvent<SCORMEvent>) => {
      // Only process SCORM events
      if (event.data?.type !== 'scorm-event') return;

      const { eventType, data } = event.data;
      console.log('SCORMAdapter: Received event:', eventType, data);

      // Call onProgress callback for all events
      onProgress?.(data);

      switch (eventType) {
        case 'initialize':
          console.log('SCORMAdapter: Lesson initialized at', data.timestamp);
          break;
          
        case 'complete':
          console.log('SCORMAdapter: Lesson completed with status:', data.lessonStatus);
          onComplete?.();
          break;
          
        case 'finish':
          console.log('SCORMAdapter: Session finished. Session time:', data.sessionTime);
          if (data.lessonStatus === 'completed' || data.lessonStatus === 'passed') {
            onComplete?.();
          }
          break;
          
        case 'commit':
          console.log('SCORMAdapter: Data committed. Session time:', data.sessionTime);
          break;
          
        case 'datachange':
          console.log('SCORMAdapter: Data changed -', data.element, ':', data.value);
          
          // Track completion status changes
          if (data.element === 'cmi.core.lesson_status' && 
              (data.value === 'completed' || data.value === 'passed')) {
            onComplete?.();
          }
          
          // Track scoring changes
          if (data.element === 'cmi.core.score.raw') {
            console.log('SCORMAdapter: Score updated to:', data.value);
          }
          
          // Track location changes (bookmarking)
          if (data.element === 'cmi.core.lesson_location') {
            console.log('SCORMAdapter: Location updated to:', data.value);
          }
          
          // Track suspend data changes
          if (data.element === 'cmi.suspend_data') {
            console.log('SCORMAdapter: Suspend data updated');
          }
          break;
          
        default:
          console.log('SCORMAdapter: Unknown event type:', eventType);
      }
    };

    // Listen for postMessage events from SCORM content
    window.addEventListener('message', handleSCORMMessage);

    return () => {
      window.removeEventListener('message', handleSCORMMessage);
    };
  }, [onComplete, onProgress, lessonId]);

  return null; // This component doesn't render anything
};

export default SCORMAdapter;
