'use client';

import React from 'react';
import { ProgressProvider } from '@/hooks/useProgress';

interface MultiCourseProgressProviderProps {
  children: React.ReactNode;
  courseIds: string[];
}

const MultiCourseProgressProvider: React.FC<MultiCourseProgressProviderProps> = ({ 
  children, 
  courseIds 
}) => {
  // For now, we'll wrap with the first course's progress provider
  // In a real app, you'd want a more sophisticated multi-course progress system
  const primaryCourseId = courseIds[0] || 'default';
  
  return (
    <ProgressProvider courseId={primaryCourseId}>
      {children}
    </ProgressProvider>
  );
};

export default MultiCourseProgressProvider;
