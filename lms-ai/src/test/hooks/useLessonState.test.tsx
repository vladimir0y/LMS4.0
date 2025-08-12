import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { LessonStateProvider, useLessonState, type Lesson } from '@/hooks/useLessonState';
import React from 'react';

describe('useLessonState Hook', () => {
  const mockLesson: Lesson = {
    id: 'lesson1',
    title: 'Test Lesson',
    type: 'video',
    src: '/test.mp4'
  };

  const renderUseLessonState = (initialLessonId?: string) => {
    return renderHook(() => useLessonState(), {
      wrapper: ({ children }) => (
        <LessonStateProvider initialLessonId={initialLessonId}>
          {children}
        </LessonStateProvider>
      ),
    });
  };

  it('should throw error when used outside LessonStateProvider', () => {
    // Suppress console error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useLessonState());
    }).toThrow('useLessonState must be used within a LessonStateProvider');
    
    consoleSpy.mockRestore();
  });

  it('should initialize with null active lesson by default', () => {
    const { result } = renderUseLessonState();
    
    expect(result.current.activeLesson).toBe(null);
    expect(result.current.activeLessonData).toBe(null);
  });

  it('should initialize with provided initial lesson ID', () => {
    const initialLessonId = 'intro-lesson';
    const { result } = renderUseLessonState(initialLessonId);
    
    expect(result.current.activeLesson).toBe(initialLessonId);
    expect(result.current.activeLessonData).toBe(null);
  });

  it('should set active lesson', () => {
    const { result } = renderUseLessonState();
    
    act(() => {
      result.current.setActiveLesson('lesson1');
    });
    
    expect(result.current.activeLesson).toBe('lesson1');
  });

  it('should set active lesson data', () => {
    const { result } = renderUseLessonState();
    
    act(() => {
      result.current.setActiveLessonData(mockLesson);
    });
    
    expect(result.current.activeLessonData).toEqual(mockLesson);
  });

  it('should update both lesson ID and data independently', () => {
    const { result } = renderUseLessonState();
    
    act(() => {
      result.current.setActiveLesson('lesson1');
      result.current.setActiveLessonData(mockLesson);
    });
    
    expect(result.current.activeLesson).toBe('lesson1');
    expect(result.current.activeLessonData).toEqual(mockLesson);
  });

  it('should allow setting lesson data to null', () => {
    const { result } = renderUseLessonState();
    
    act(() => {
      result.current.setActiveLessonData(mockLesson);
    });
    
    expect(result.current.activeLessonData).toEqual(mockLesson);
    
    act(() => {
      result.current.setActiveLessonData(null);
    });
    
    expect(result.current.activeLessonData).toBe(null);
  });

  it('should handle multiple lesson switches', () => {
    const { result } = renderUseLessonState();
    
    const lesson1 = { ...mockLesson, id: 'lesson1', title: 'Lesson 1' };
    const lesson2 = { ...mockLesson, id: 'lesson2', title: 'Lesson 2' };
    
    act(() => {
      result.current.setActiveLesson('lesson1');
      result.current.setActiveLessonData(lesson1);
    });
    
    expect(result.current.activeLesson).toBe('lesson1');
    expect(result.current.activeLessonData).toEqual(lesson1);
    
    act(() => {
      result.current.setActiveLesson('lesson2');
      result.current.setActiveLessonData(lesson2);
    });
    
    expect(result.current.activeLesson).toBe('lesson2');
    expect(result.current.activeLessonData).toEqual(lesson2);
  });

  it('should maintain state consistency across re-renders', () => {
    const { result, rerender } = renderUseLessonState();
    
    act(() => {
      result.current.setActiveLesson('lesson1');
      result.current.setActiveLessonData(mockLesson);
    });
    
    rerender();
    
    expect(result.current.activeLesson).toBe('lesson1');
    expect(result.current.activeLessonData).toEqual(mockLesson);
  });

  it('should handle different lesson types correctly', () => {
    const { result } = renderUseLessonState();
    
    const videoLesson: Lesson = {
      id: 'video1',
      title: 'Video Lesson',
      type: 'video',
      src: '/video.mp4'
    };
    
    const scormLesson: Lesson = {
      id: 'scorm1',
      title: 'SCORM Lesson',
      type: 'scorm',
      src: '/scorm/index.html'
    };
    
    act(() => {
      result.current.setActiveLessonData(videoLesson);
    });
    
    expect(result.current.activeLessonData?.type).toBe('video');
    
    act(() => {
      result.current.setActiveLessonData(scormLesson);
    });
    
    expect(result.current.activeLessonData?.type).toBe('scorm');
  });
});
