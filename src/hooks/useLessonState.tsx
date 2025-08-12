'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Lesson {
  id: string;
  title: string;
  type: string;
  src: string;
}

interface LessonStateContextType {
  activeLesson: string | null;
  setActiveLesson: (lessonId: string) => void;
  activeLessonData: Lesson | null;
  setActiveLessonData: (lesson: Lesson | null) => void;
}

const LessonStateContext = createContext<LessonStateContextType | undefined>(undefined);

interface LessonStateProviderProps {
  children: ReactNode;
  initialLessonId?: string;
}

export const LessonStateProvider: React.FC<LessonStateProviderProps> = ({ 
  children, 
  initialLessonId = null 
}) => {
  const [activeLesson, setActiveLesson] = useState<string | null>(initialLessonId);
  const [activeLessonData, setActiveLessonData] = useState<Lesson | null>(null);

  const value: LessonStateContextType = {
    activeLesson,
    setActiveLesson,
    activeLessonData,
    setActiveLessonData,
  };

  return (
    <LessonStateContext.Provider value={value}>
      {children}
    </LessonStateContext.Provider>
  );
};

export const useLessonState = (): LessonStateContextType => {
  const context = useContext(LessonStateContext);
  
  if (context === undefined) {
    throw new Error('useLessonState must be used within a LessonStateProvider');
  }
  
  return context;
};

// Export types for external use
export type { LessonStateContextType, LessonStateProviderProps, Lesson };
