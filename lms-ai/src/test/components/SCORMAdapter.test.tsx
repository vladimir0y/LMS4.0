import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import SCORMAdapter from '@/components/SCORMAdapter';
import React from 'react';

describe('SCORMAdapter Component', () => {
  const mockOnComplete = vi.fn();
  const mockOnProgress = vi.fn();
  const lessonId = 'test-lesson-1';

  beforeEach(() => {
    mockOnComplete.mockClear();
    mockOnProgress.mockClear();
    // Clear console.log mock
    vi.clearAllMocks();
  });

  const renderSCORMAdapter = (props = {}) => {
    return render(
      <SCORMAdapter
        onComplete={mockOnComplete}
        onProgress={mockOnProgress}
        lessonId={lessonId}
        {...props}
      />
    );
  };

  const createSCORMMessage = (eventType: string, data: any = {}) => {
    return {
      data: {
        type: 'scorm-event',
        eventType,
        data: {
          timestamp: new Date().toISOString(),
          ...data
        }
      }
    };
  };

  it('renders without crashing', () => {
    renderSCORMAdapter();
    // SCORMAdapter doesn't render anything visible
  });

  it('sets up message listener on mount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    renderSCORMAdapter();
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('removes message listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderSCORMAdapter();
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('ignores non-SCORM messages', () => {
    renderSCORMAdapter();
    
    // Send a non-SCORM message
    const event = new MessageEvent('message', {
      data: { type: 'other-event', someData: 'test' }
    });
    
    window.dispatchEvent(event);
    
    expect(mockOnComplete).not.toHaveBeenCalled();
    expect(mockOnProgress).not.toHaveBeenCalled();
  });

  it('handles initialize event', () => {
    renderSCORMAdapter();
    
    const message = createSCORMMessage('initialize', {
      timestamp: '2023-01-01T10:00:00Z'
    });
    
    window.dispatchEvent(new MessageEvent('message', message));
    
    expect(mockOnProgress).toHaveBeenCalledWith({
      timestamp: '2023-01-01T10:00:00Z'
    });
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('handles complete event', () => {
    renderSCORMAdapter();
    
    const message = createSCORMMessage('complete', {
      lessonStatus: 'completed'
    });
    
    window.dispatchEvent(new MessageEvent('message', message));
    
    expect(mockOnProgress).toHaveBeenCalledWith(expect.objectContaining({
      lessonStatus: 'completed'
    }));
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('handles finish event with completed status', () => {
    renderSCORMAdapter();
    
    const message = createSCORMMessage('finish', {
      lessonStatus: 'completed',
      sessionTime: '00:15:30'
    });
    
    window.dispatchEvent(new MessageEvent('message', message));
    
    expect(mockOnProgress).toHaveBeenCalledWith(expect.objectContaining({
      lessonStatus: 'completed',
      sessionTime: '00:15:30'
    }));
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('handles finish event with passed status', () => {
    renderSCORMAdapter();
    
    const message = createSCORMMessage('finish', {
      lessonStatus: 'passed',
      sessionTime: '00:20:15'
    });
    
    window.dispatchEvent(new MessageEvent('message', message));
    
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('does not trigger completion for finish event with incomplete status', () => {
    renderSCORMAdapter();
    
    const message = createSCORMMessage('finish', {
      lessonStatus: 'incomplete',
      sessionTime: '00:05:00'
    });
    
    window.dispatchEvent(new MessageEvent('message', message));
    
    expect(mockOnProgress).toHaveBeenCalled();
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('handles commit event', () => {
    renderSCORMAdapter();
    
    const message = createSCORMMessage('commit', {
      sessionTime: '00:10:45'
    });
    
    window.dispatchEvent(new MessageEvent('message', message));
    
    expect(mockOnProgress).toHaveBeenCalledWith(expect.objectContaining({
      sessionTime: '00:10:45'
    }));
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('handles datachange event with lesson status completion', () => {
    renderSCORMAdapter();
    
    const message = createSCORMMessage('datachange', {
      element: 'cmi.core.lesson_status',
      value: 'completed'
    });
    
    window.dispatchEvent(new MessageEvent('message', message));
    
    expect(mockOnProgress).toHaveBeenCalledWith(expect.objectContaining({
      element: 'cmi.core.lesson_status',
      value: 'completed'
    }));
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('handles datachange event with lesson status passed', () => {
    renderSCORMAdapter();
    
    const message = createSCORMMessage('datachange', {
      element: 'cmi.core.lesson_status',
      value: 'passed'
    });
    
    window.dispatchEvent(new MessageEvent('message', message));
    
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('does not trigger completion for incomplete lesson status in datachange', () => {
    renderSCORMAdapter();
    
    const message = createSCORMMessage('datachange', {
      element: 'cmi.core.lesson_status',
      value: 'incomplete'
    });
    
    window.dispatchEvent(new MessageEvent('message', message));
    
    expect(mockOnProgress).toHaveBeenCalled();
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('handles score updates in datachange', () => {
    renderSCORMAdapter();
    
    const message = createSCORMMessage('datachange', {
      element: 'cmi.core.score.raw',
      value: '85'
    });
    
    window.dispatchEvent(new MessageEvent('message', message));
    
    expect(mockOnProgress).toHaveBeenCalledWith(expect.objectContaining({
      element: 'cmi.core.score.raw',
      value: '85'
    }));
  });

  it('handles location updates in datachange', () => {
    renderSCORMAdapter();
    
    const message = createSCORMMessage('datachange', {
      element: 'cmi.core.lesson_location',
      value: 'page-5'
    });
    
    window.dispatchEvent(new MessageEvent('message', message));
    
    expect(mockOnProgress).toHaveBeenCalledWith(expect.objectContaining({
      element: 'cmi.core.lesson_location',
      value: 'page-5'
    }));
  });

  it('handles suspend data updates in datachange', () => {
    renderSCORMAdapter();
    
    const message = createSCORMMessage('datachange', {
      element: 'cmi.suspend_data',
      value: 'user-progress-data'
    });
    
    window.dispatchEvent(new MessageEvent('message', message));
    
    expect(mockOnProgress).toHaveBeenCalledWith(expect.objectContaining({
      element: 'cmi.suspend_data',
      value: 'user-progress-data'
    }));
  });

  it('handles unknown event types gracefully', () => {
    renderSCORMAdapter();
    
    const message = createSCORMMessage('unknown-event', {
      someData: 'test'
    });
    
    window.dispatchEvent(new MessageEvent('message', message));
    
    expect(mockOnProgress).toHaveBeenCalledWith(expect.objectContaining({
      someData: 'test'
    }));
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('works without optional callbacks', () => {
    render(<SCORMAdapter lessonId={lessonId} />);
    
    const message = createSCORMMessage('complete', {
      lessonStatus: 'completed'
    });
    
    // Should not throw error when callbacks are not provided
    expect(() => {
      window.dispatchEvent(new MessageEvent('message', message));
    }).not.toThrow();
  });

  it('calls onProgress for all event types', () => {
    renderSCORMAdapter();
    
    const eventTypes = ['initialize', 'complete', 'finish', 'commit', 'datachange'];
    
    eventTypes.forEach((eventType, index) => {
      const message = createSCORMMessage(eventType, {
        testData: `test-${index}`
      });
      
      window.dispatchEvent(new MessageEvent('message', message));
    });
    
    expect(mockOnProgress).toHaveBeenCalledTimes(eventTypes.length);
  });

  it('handles multiple rapid events correctly', () => {
    renderSCORMAdapter();
    
    // Send multiple events in quick succession
    for (let i = 0; i < 5; i++) {
      const message = createSCORMMessage('commit', {
        sequenceNumber: i
      });
      
      window.dispatchEvent(new MessageEvent('message', message));
    }
    
    expect(mockOnProgress).toHaveBeenCalledTimes(5);
  });

  it('handles events with minimal data', () => {
    renderSCORMAdapter();
    
    const message = {
      data: {
        type: 'scorm-event',
        eventType: 'initialize',
        data: {} // Empty data object
      }
    };
    
    window.dispatchEvent(new MessageEvent('message', message));
    
    expect(mockOnProgress).toHaveBeenCalledWith({});
  });
});
