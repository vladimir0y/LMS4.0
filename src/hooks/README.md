# useProgress Hook

A React context hook for managing lesson completion progress with localStorage persistence.

## Features

- ✅ Persists lesson completion to localStorage keyed by course ID
- ✅ Provides `markComplete(lessonId)` and `isComplete(lessonId)` helper functions
- ✅ Supports multiple courses with isolated progress tracking
- ✅ TypeScript support with full type safety
- ✅ Handles localStorage errors gracefully
- ✅ Provides progress clearing functionality
- ✅ SSR-safe with proper window checks

## Quick Start

### 1. Wrap your app with the ProgressProvider

```tsx
import { ProgressProvider } from './hooks/useProgress';
import { courseManifest } from './data/courseManifest';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider courseId={courseManifest.id}>
      {children}
    </ProgressProvider>
  );
}
```

### 2. Use the progress functions in your components

```tsx
import { useProgress } from './hooks/useProgress';

export const LessonComponent = ({ lessonId }: { lessonId: string }) => {
  const { markComplete, isComplete } = useProgress();
  
  const handleComplete = () => {
    markComplete(lessonId);
  };

  return (
    <div>
      <p>Status: {isComplete(lessonId) ? 'Completed' : 'In Progress'}</p>
      <button onClick={handleComplete}>Mark Complete</button>
    </div>
  );
};
```

## API Reference

### ProgressProvider Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | ✅ | Child components to wrap |
| `courseId` | `string` | ✅ | Unique identifier for the course |

### useProgress Hook Returns

| Function/Property | Type | Description |
|------------------|------|-------------|
| `markComplete` | `(lessonId: string) => void` | Mark a lesson as completed |
| `isComplete` | `(lessonId: string) => boolean` | Check if a lesson is completed |
| `completedLessons` | `string[]` | Array of completed lesson IDs |
| `clearProgress` | `() => void` | Clear all progress for the current course |

## Usage Examples

### Basic Lesson Completion

```tsx
const { markComplete, isComplete } = useProgress();

// Mark lesson as complete
markComplete('intro');

// Check if lesson is complete
const completed = isComplete('intro'); // true
```

### Progress Tracking

```tsx
const { completedLessons } = useProgress();

console.log(`Completed ${completedLessons.length} lessons`);
// Output: "Completed 2 lessons"
```

### Route Guards

```tsx
const RouteGuard = ({ requiredLessons, children }) => {
  const { isComplete } = useProgress();
  
  const canAccess = requiredLessons.every(id => isComplete(id));
  
  return canAccess ? children : <div>Complete prerequisites first!</div>;
};

// Usage
<RouteGuard requiredLessons={['intro', 'basics']}>
  <AdvancedLesson />
</RouteGuard>
```

### Course Navigation with Progress

```tsx
const CourseNav = () => {
  const { isComplete, completedLessons } = useProgress();
  
  return (
    <nav>
      <div>Progress: {completedLessons.length}/3</div>
      {courseManifest.lessons.map(lesson => (
        <div key={lesson.id}>
          {lesson.title} {isComplete(lesson.id) ? '✅' : '○'}
        </div>
      ))}
    </nav>
  );
};
```

## LocalStorage Structure

Progress data is stored in localStorage with the following structure:

- **Key**: `lms_progress_{courseId}`
- **Value**: JSON array of completed lesson IDs

Example:
```
Key: "lms_progress_pwp-101"
Value: ["intro", "content"]
```

## Error Handling

The hook gracefully handles various error scenarios:

- **localStorage unavailable**: Falls back to in-memory state
- **Corrupted data**: Resets to empty progress
- **Invalid lesson IDs**: Logs warnings and ignores invalid inputs
- **JSON parsing errors**: Resets to empty progress

## TypeScript Support

Full TypeScript support with exported interfaces:

```tsx
import { ProgressContextType, ProgressProviderProps } from './hooks/useProgress';

const customHook = (): ProgressContextType => {
  return useProgress();
};
```

## Multi-Course Support

Each course maintains isolated progress by using unique course IDs:

```tsx
// Course 1 progress
<ProgressProvider courseId="course-1">
  <Course1Content />
</ProgressProvider>

// Course 2 progress (separate from course 1)
<ProgressProvider courseId="course-2">
  <Course2Content />
</ProgressProvider>
```

## Testing

The hook can be easily tested by providing a mock courseId:

```tsx
import { render } from '@testing-library/react';
import { ProgressProvider } from './hooks/useProgress';

const TestComponent = () => {
  const { markComplete, isComplete } = useProgress();
  // Test logic here
};

test('progress tracking', () => {
  render(
    <ProgressProvider courseId="test-course">
      <TestComponent />
    </ProgressProvider>
  );
  // Assertions
});
```
