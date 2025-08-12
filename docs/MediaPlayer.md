# MediaPlayer Component

The MediaPlayer component is a React component designed to handle different types of learning content (video, SCORM) with automatic completion tracking and lesson progression.

## Features

✅ **Multi-format Support**: Handles video and SCORM content types
✅ **Automatic Completion**: Tracks lesson completion via video `ended` event or SCORM `LMSFinish` calls  
✅ **Auto-advancement**: Automatically advances to the next lesson after completion
✅ **SCORM API**: Built-in SCORM 1.2 API implementation for tracking  
✅ **Progress Integration**: Uses the existing progress context for persistence  
✅ **Responsive Design**: Tailwind CSS styling with responsive layout

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `lesson` | `Lesson` | ✅ | Current lesson object with id, title, type, and src |
| `courseId` | `string` | ✅ | Course identifier for progress tracking |
| `lessons` | `Lesson[]` | ✅ | Array of all course lessons for navigation |
| `onLessonChange` | `(lesson: Lesson) => void` | ❌ | Callback when lesson changes |

## Usage

### Basic Usage

```tsx
import { MediaPlayer } from '@/components';
import { ProgressProvider } from '@/hooks/useProgress';
import { LessonStateProvider } from '@/hooks/useLessonState';

function CoursePage() {
  const lesson = {
    id: 'intro',
    title: 'Introduction',
    type: 'video',
    src: '/videos/intro.mp4'
  };

  return (
    <ProgressProvider courseId="course-101">
      <LessonStateProvider>
        <MediaPlayer 
          lesson={lesson}
          courseId="course-101"
          lessons={allLessons}
        />
      </LessonStateProvider>
    </ProgressProvider>
  );
}
```

### With Lesson Selection

```tsx
import { MediaPlayer } from '@/components';
import { useLessonState } from '@/hooks/useLessonState';

function CourseContent({ lessons, courseId }) {
  const { activeLessonData, setActiveLessonData } = useLessonState();
  const currentLesson = activeLessonData || lessons[0];

  return (
    <MediaPlayer 
      lesson={currentLesson}
      courseId={courseId}
      lessons={lessons}
      onLessonChange={(lesson) => setActiveLessonData(lesson)}
    />
  );
}
```

## Content Types

### Video Content

For video lessons, the component renders an HTML5 video element:

```tsx
// Video lesson format
const videoLesson = {
  id: 'intro-video',
  title: 'Introduction Video', 
  type: 'video',
  src: '/videos/intro.mp4'
};
```

**Completion trigger**: Video `ended` event

### SCORM Content  

For SCORM lessons, the component renders an iframe with SCORM API support:

```tsx
// SCORM lesson format
const scormLesson = {
  id: 'interactive-module',
  title: 'Interactive Module',
  type: 'scorm', 
  src: '/scorm/module/index.html'
};
```

**Completion triggers**:
- SCORM API `LMSFinish()` call
- SCORM API `LMSSetValue('cmi.core.lesson_status', 'completed')` call

## SCORM API Support

The component provides a built-in SCORM 1.2 API implementation:

```javascript
// Available SCORM API methods
API.LMSInitialize()
API.LMSFinish() // Triggers completion
API.LMSGetValue(element)
API.LMSSetValue(element, value) // lesson_status='completed' triggers completion
API.LMSCommit()
API.LMSGetLastError()
API.LMSGetErrorString()
API.LMSGetDiagnostic()
```

## Auto-advancement

When a lesson is completed:

1. Progress is marked as complete via `markComplete(lessonId)`
2. A completion indicator is shown for 2 seconds
3. If a next lesson exists, the component automatically advances
4. The lesson state and active lesson data are updated
5. The optional `onLessonChange` callback is triggered

## Integration with Existing Hooks

### Progress Hook
- Uses `markComplete()` to track lesson completion
- Uses `isComplete()` to check lesson status
- Persists progress to localStorage per course

### Lesson State Hook  
- Uses `setActiveLesson()` to update active lesson ID
- Uses `setActiveLessonData()` to update active lesson object
- Manages current lesson state across components

## Styling

The component uses Tailwind CSS classes for styling:

- **Video**: `w-full h-auto` for responsive video
- **SCORM**: `w-full h-[70vh]` for iframe dimensions  
- **Completion indicator**: Green success styling
- **Lesson info**: Gray background with lesson details

## Error Handling

- **Unsupported content types**: Shows error message
- **SCORM API errors**: Graceful fallbacks with console logging
- **Cross-origin iframe issues**: Handles security restrictions
- **Invalid lesson data**: Validates props and shows appropriate messages

## Accessibility

- Video controls are enabled by default
- Iframe has proper title attributes
- Keyboard navigation supported
- Screen reader compatible markup
- Focus management for lesson transitions

## Browser Support

- **Video**: All modern browsers with HTML5 video support
- **SCORM**: All browsers with iframe support
- **localStorage**: Required for progress persistence
- **ES6+**: Modern JavaScript features used throughout
