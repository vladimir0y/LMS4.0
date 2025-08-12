'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ProgressContextType {
  markComplete: (lessonId: string) => void;
  isComplete: (lessonId: string) => boolean;
  completedLessons: string[];
  clearProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

interface ProgressProviderProps {
  children: ReactNode;
  courseId: string;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children, courseId }) => {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate localStorage key based on course ID
  const getStorageKey = (courseId: string): string => `lms_progress_${courseId}`;

  // Load progress from localStorage on mount and course ID change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storageKey = getStorageKey(courseId);
        const savedProgress = localStorage.getItem(storageKey);
        
        if (savedProgress) {
          const parsedProgress = JSON.parse(savedProgress);
          // Ensure the parsed data is an array of strings
          if (Array.isArray(parsedProgress) && parsedProgress.every(item => typeof item === 'string')) {
            setCompletedLessons(parsedProgress);
          } else {
            // If data is corrupted, reset to empty array
            setCompletedLessons([]);
          }
        } else {
          setCompletedLessons([]);
        }
      } catch (error) {
        console.warn('Failed to load progress from localStorage:', error);
        setCompletedLessons([]);
      }
      setIsInitialized(true);
    }
  }, [courseId]);

  // Save progress to localStorage whenever completedLessons changes
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      try {
        const storageKey = getStorageKey(courseId);
        localStorage.setItem(storageKey, JSON.stringify(completedLessons));
      } catch (error) {
        console.warn('Failed to save progress to localStorage:', error);
      }
    }
  }, [completedLessons, courseId, isInitialized]);

  const markComplete = (lessonId: string): void => {
    if (!lessonId || typeof lessonId !== 'string') {
      console.warn('Invalid lessonId provided to markComplete:', lessonId);
      return;
    }

    setCompletedLessons(prev => {
      // Only add if not already completed
      if (!prev.includes(lessonId)) {
        return [...prev, lessonId];
      }
      return prev;
    });
  };

  const isComplete = (lessonId: string): boolean => {
    if (!lessonId || typeof lessonId !== 'string') {
      console.warn('Invalid lessonId provided to isComplete:', lessonId);
      return false;
    }

    return completedLessons.includes(lessonId);
  };

  const clearProgress = (): void => {
    setCompletedLessons([]);
    if (typeof window !== 'undefined') {
      try {
        const storageKey = getStorageKey(courseId);
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.warn('Failed to clear progress from localStorage:', error);
      }
    }
  };

  const value: ProgressContextType = {
    markComplete,
    isComplete,
    completedLessons,
    clearProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  
  return context;
};

// Export types for external use
export type { ProgressContextType, ProgressProviderProps };
