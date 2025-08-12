import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, renderHook, act, screen } from '@testing-library/react';
import { ProgressProvider, useProgress } from '@/hooks/useProgress';
import React from 'react';

describe('useProgress Hook', () => {
  const courseId = 'test-course-123';
  
  beforeEach(() => {
    // Reset localStorage mock before each test
    global.localStorageMock.getItem.mockClear();
    global.localStorageMock.setItem.mockClear();
    global.localStorageMock.removeItem.mockClear();
  });

  const renderUseProgress = (courseId: string) => {
    return renderHook(() => useProgress(), {
      wrapper: ({ children }) => (
        <ProgressProvider courseId={courseId}>
          {children}
        </ProgressProvider>
      ),
    });
  };

  it('should throw error when used outside ProgressProvider', () => {
    // Suppress console error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useProgress());
    }).toThrow('useProgress must be used within a ProgressProvider');
    
    consoleSpy.mockRestore();
  });

  it('should initialize with empty completed lessons array', () => {
    global.localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderUseProgress(courseId);
    
    expect(result.current.completedLessons).toEqual([]);
    expect(global.localStorageMock.getItem).toHaveBeenCalledWith(`lms_progress_${courseId}`);
  });

  it('should load existing progress from localStorage', () => {
    const savedProgress = ['lesson1', 'lesson2'];
    global.localStorageMock.getItem.mockReturnValue(JSON.stringify(savedProgress));
    
    const { result } = renderUseProgress(courseId);
    
    // Wait for useEffect to complete
    expect(result.current.completedLessons).toEqual(savedProgress);
  });

  it('should handle corrupted localStorage data gracefully', () => {
    global.localStorageMock.getItem.mockReturnValue('invalid-json');
    
    const { result } = renderUseProgress(courseId);
    
    expect(result.current.completedLessons).toEqual([]);
  });

  it('should handle non-array data in localStorage', () => {
    global.localStorageMock.getItem.mockReturnValue(JSON.stringify({ invalid: 'data' }));
    
    const { result } = renderUseProgress(courseId);
    
    expect(result.current.completedLessons).toEqual([]);
  });

  it('should mark lesson as complete', () => {
    global.localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderUseProgress(courseId);
    
    act(() => {
      result.current.markComplete('lesson1');
    });
    
    expect(result.current.completedLessons).toContain('lesson1');
    expect(result.current.isComplete('lesson1')).toBe(true);
  });

  it('should save progress to localStorage when lesson is completed', async () => {
    global.localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderUseProgress(courseId);
    
    await act(async () => {
      result.current.markComplete('lesson1');
      // Allow time for useEffect to trigger
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(global.localStorageMock.setItem).toHaveBeenCalledWith(
      `lms_progress_${courseId}`,
      JSON.stringify(['lesson1'])
    );
  });

  it('should not duplicate completed lessons', () => {
    global.localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderUseProgress(courseId);
    
    act(() => {
      result.current.markComplete('lesson1');
      result.current.markComplete('lesson1'); // Try to add the same lesson again
    });
    
    expect(result.current.completedLessons).toEqual(['lesson1']);
  });

  it('should handle invalid lesson IDs gracefully', () => {
    const { result } = renderUseProgress(courseId);
    
    // Should not throw and should not modify state
    act(() => {
      result.current.markComplete('');
      result.current.markComplete(null as any);
      result.current.markComplete(undefined as any);
    });
    
    expect(result.current.completedLessons).toEqual([]);
  });

  it('should return correct completion status', () => {
    global.localStorageMock.getItem.mockReturnValue(JSON.stringify(['lesson1', 'lesson2']));
    
    const { result } = renderUseProgress(courseId);
    
    expect(result.current.isComplete('lesson1')).toBe(true);
    expect(result.current.isComplete('lesson2')).toBe(true);
    expect(result.current.isComplete('lesson3')).toBe(false);
  });

  it('should handle invalid lesson IDs in isComplete', () => {
    const { result } = renderUseProgress(courseId);
    
    expect(result.current.isComplete('')).toBe(false);
    expect(result.current.isComplete(null as any)).toBe(false);
    expect(result.current.isComplete(undefined as any)).toBe(false);
  });

  it('should clear all progress', async () => {
    global.localStorageMock.getItem.mockReturnValue(JSON.stringify(['lesson1', 'lesson2']));
    
    const { result } = renderUseProgress(courseId);
    
    await act(async () => {
      result.current.clearProgress();
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.completedLessons).toEqual([]);
    expect(global.localStorageMock.removeItem).toHaveBeenCalledWith(`lms_progress_${courseId}`);
  });

  it('should use different storage keys for different courses', () => {
    const course1 = 'course1';
    const course2 = 'course2';
    
    global.localStorageMock.getItem.mockReturnValue(null);
    
    const { result: result1 } = renderUseProgress(course1);
    const { result: result2 } = renderUseProgress(course2);
    
    act(() => {
      result1.current.markComplete('lesson1');
      result2.current.markComplete('lesson2');
    });
    
    // Different courses should have independent progress
    expect(result1.current.isComplete('lesson1')).toBe(true);
    expect(result1.current.isComplete('lesson2')).toBe(false);
    expect(result2.current.isComplete('lesson1')).toBe(false);
    expect(result2.current.isComplete('lesson2')).toBe(true);
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage.setItem to throw an error
    global.localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });
    
    global.localStorageMock.getItem.mockReturnValue(null);
    const { result } = renderUseProgress(courseId);
    
    // Should not throw error
    act(() => {
      result.current.markComplete('lesson1');
    });
    
    // State should still be updated even if localStorage fails
    expect(result.current.completedLessons).toContain('lesson1');
  });
});
