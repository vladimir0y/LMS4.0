import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LessonSidebar from '@/components/LessonSidebar';
import { ProgressProvider } from '@/hooks/useProgress';
import { LessonStateProvider } from '@/hooks/useLessonState';
import { type Lesson } from '@/hooks/useLessonState';
import React from 'react';

describe('LessonSidebar Component', () => {
  const mockLessons: Lesson[] = [
    { id: 'lesson1', title: 'Introduction', type: 'video', src: '/intro.mp4' },
    { id: 'lesson2', title: 'Basic Concepts', type: 'scorm', src: '/basic/index.html' },
    { id: 'lesson3', title: 'Advanced Topics', type: 'video', src: '/advanced.mp4' },
    { id: 'lesson4', title: 'Final Assessment', type: 'scorm', src: '/assessment/index.html' },
  ];

  const courseId = 'test-course';

  const renderLessonSidebar = (lessons: Lesson[] = mockLessons, onLessonSelect?: ReturnType<typeof vi.fn>) => {
    return render(
      <ProgressProvider courseId={courseId}>
        <LessonStateProvider>
          <LessonSidebar 
            lessons={lessons} 
            courseId={courseId} 
            onLessonSelect={onLessonSelect}
          />
        </LessonStateProvider>
      </ProgressProvider>
    );
  };

  beforeEach(() => {
    global.localStorageMock.getItem.mockClear();
    global.localStorageMock.setItem.mockClear();
    global.localStorageMock.removeItem.mockClear();
    global.localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders all lessons', () => {
    renderLessonSidebar();
    
    mockLessons.forEach(lesson => {
      expect(screen.getByText(lesson.title)).toBeInTheDocument();
      expect(screen.getAllByText(lesson.type)).toHaveLength(
        mockLessons.filter(l => l.type === lesson.type).length
      );
    });
  });

  it('shows lesson numbers correctly', () => {
    renderLessonSidebar();
    
    const lessonNumbers = screen.getAllByText(/^[1-4]$/);
    expect(lessonNumbers).toHaveLength(4);
  });

  it('first lesson is always clickable', () => {
    renderLessonSidebar();
    
    const firstLessonButton = screen.getByRole('button', { name: /Introduction video/i });
    expect(firstLessonButton).not.toHaveAttribute('disabled');
    expect(firstLessonButton).not.toHaveClass('cursor-not-allowed');
  });

  it('subsequent lessons are disabled initially (sequential gating)', () => {
    renderLessonSidebar();
    
    const secondLessonButton = screen.getByRole('button', { name: /Basic Concepts scorm/i });
    const thirdLessonButton = screen.getByRole('button', { name: /Advanced Topics video/i });
    const fourthLessonButton = screen.getByRole('button', { name: /Final Assessment scorm/i });
    
    expect(secondLessonButton).toHaveAttribute('disabled');
    expect(thirdLessonButton).toHaveAttribute('disabled');
    expect(fourthLessonButton).toHaveAttribute('disabled');
    
    expect(secondLessonButton).toHaveClass('cursor-not-allowed');
    expect(thirdLessonButton).toHaveClass('cursor-not-allowed');
    expect(fourthLessonButton).toHaveClass('cursor-not-allowed');
  });

  it('enables next lesson when previous is completed', () => {
    // Mock that lesson1 is completed
    global.localStorageMock.getItem.mockReturnValue(JSON.stringify(['lesson1']));
    
    renderLessonSidebar();
    
    const firstLessonButton = screen.getByRole('button', { name: /Introduction video/i });
    const secondLessonButton = screen.getByRole('button', { name: /Basic Concepts scorm/i });
    const thirdLessonButton = screen.getByRole('button', { name: /Advanced Topics video/i });
    
    expect(firstLessonButton).not.toHaveAttribute('disabled');
    expect(secondLessonButton).not.toHaveAttribute('disabled');
    expect(thirdLessonButton).toHaveAttribute('disabled'); // Still disabled
  });

  it('shows completion icons for completed lessons', () => {
    global.localStorageMock.getItem.mockReturnValue(JSON.stringify(['lesson1', 'lesson2']));
    
    renderLessonSidebar();
    
    // Check for checkmark SVGs (completion icons)
    const checkmarks = screen.getAllByRole('button').filter(button => {
      return button.querySelector('svg[viewBox="0 0 20 20"]');
    });
    
    // Should have completion icons for the completed lessons
    expect(checkmarks.length).toBeGreaterThan(0);
  });

  it('calls onLessonSelect when a lesson is clicked', async () => {
    const user = userEvent.setup();
    const onLessonSelect = vi.fn();
    
    renderLessonSidebar(mockLessons, onLessonSelect);
    
    const firstLessonButton = screen.getByRole('button', { name: /Introduction video/i });
    await user.click(firstLessonButton);
    
    expect(onLessonSelect).toHaveBeenCalledWith('lesson1', mockLessons[0]);
  });

  it('does not call onLessonSelect for disabled lessons', async () => {
    const user = userEvent.setup();
    const onLessonSelect = vi.fn();
    
    renderLessonSidebar(mockLessons, onLessonSelect);
    
    const secondLessonButton = screen.getByRole('button', { name: /Basic Concepts scorm/i });
    await user.click(secondLessonButton);
    
    expect(onLessonSelect).not.toHaveBeenCalled();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    const onLessonSelect = vi.fn();
    
    renderLessonSidebar(mockLessons, onLessonSelect);
    
    const firstLessonButton = screen.getByRole('button', { name: /Introduction video/i });
    
    // Test Enter key
    firstLessonButton.focus();
    await user.keyboard('{Enter}');
    
    expect(onLessonSelect).toHaveBeenCalledWith('lesson1', mockLessons[0]);
    
    onLessonSelect.mockClear();
    
    // Test Space key
    firstLessonButton.focus();
    await user.keyboard(' ');
    
    expect(onLessonSelect).toHaveBeenCalledWith('lesson1', mockLessons[0]);
  });

  it('keyboard navigation does not work for disabled lessons', async () => {
    const user = userEvent.setup();
    const onLessonSelect = vi.fn();
    
    renderLessonSidebar(mockLessons, onLessonSelect);
    
    const secondLessonButton = screen.getByRole('button', { name: /Basic Concepts scorm/i });
    
    secondLessonButton.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    
    expect(onLessonSelect).not.toHaveBeenCalled();
  });

  it('highlights active lesson correctly', () => {
    renderLessonSidebar();
    
    // First lesson should be active by default
    const firstLessonButton = screen.getByRole('button', { name: /Introduction video/i });
    expect(firstLessonButton).toHaveClass('bg-blue-50', 'border-blue-200');
    expect(firstLessonButton).toHaveAttribute('aria-current', 'page');
  });

  it('handles empty lessons array gracefully', () => {
    renderLessonSidebar([]);
    
    expect(screen.getByText('Lessons')).toBeInTheDocument();
    // Should not crash and should render empty navigation
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles single lesson correctly', () => {
    const singleLesson = [mockLessons[0]];
    renderLessonSidebar(singleLesson);
    
    const lessonButton = screen.getByRole('button', { name: /Introduction video/i });
    expect(lessonButton).not.toHaveAttribute('disabled');
    expect(lessonButton).toHaveClass('bg-blue-50'); // Should be active
  });

  it('updates active lesson styling when lesson changes', async () => {
    const user = userEvent.setup();
    
    // Mock first lesson as completed to enable second lesson
    global.localStorageMock.getItem.mockReturnValue(JSON.stringify(['lesson1']));
    
    renderLessonSidebar();
    
    const firstLessonButton = screen.getByRole('button', { name: /Introduction video/i });
    const secondLessonButton = screen.getByRole('button', { name: /Basic Concepts scorm/i });
    
    // Initially first lesson is active
    expect(firstLessonButton).toHaveClass('bg-blue-50');
    expect(firstLessonButton).toHaveAttribute('aria-current', 'page');
    
    // Click second lesson
    await user.click(secondLessonButton);
    
    // Now second lesson should be active
    expect(secondLessonButton).toHaveClass('bg-blue-50');
    expect(secondLessonButton).toHaveAttribute('aria-current', 'page');
    
    // First lesson should no longer be active
    expect(firstLessonButton).not.toHaveClass('bg-blue-50');
    expect(firstLessonButton).not.toHaveAttribute('aria-current');
  });

  it('has proper accessibility attributes', () => {
    renderLessonSidebar();
    
    // Check for proper ARIA labels and roles
    expect(screen.getByRole('navigation', { name: /course lessons/i })).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button, index) => {
      expect(button).toHaveAttribute('aria-describedby', `lesson-${mockLessons[index].id}-type`);
    });
  });
});
