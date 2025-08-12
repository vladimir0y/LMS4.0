# SCORM API Implementation

This document describes the SCORM (Sharable Content Object Reference Model) implementation for the AI-Powered LMS system.

## Overview

The system includes a comprehensive SCORM 1.2 API wrapper that enables legacy SCORM content to communicate with the React-based LMS via postMessage events. This implementation provides backward compatibility while maintaining modern architecture principles.

## Components

### 1. SCORM API Shim (`/public/scorm-api.js`)

The lightweight SCORM API wrapper that provides:
- Full SCORM 1.2 API compliance
- SCORM 2004 compatibility (`API_1484_11`)
- postMessage communication with parent window
- Automatic initialization for iframe environments
- Error handling and validation
- Session time tracking

#### Key Features:
- **Global API Exposure**: Makes `window.API` and `window.API_1484_11` available to SCORM content
- **postMessage Communication**: Sends events to parent React app for lesson completion tracking
- **Data Model Support**: Complete SCORM 1.2 data model implementation
- **Auto-initialization**: Automatically initializes when loaded in an iframe context

### 2. Enhanced MediaPlayer Component (`/src/components/MediaPlayer.tsx`)

Updated to support the new SCORM API system:
- Dynamic SCORM API script injection
- postMessage event listener for SCORM events
- Improved iframe API injection with fallback to postMessage
- Enhanced error handling and logging

#### Event Types Handled:
- `initialize`: SCORM session started
- `complete`: Lesson marked as complete
- `finish`: SCORM session terminated
- `commit`: Data committed to LMS
- `datachange`: SCORM data model changes

### 3. Enhanced SCORM Adapter (`/src/components/SCORMAdapter.tsx`)

Advanced SCORM tracking component that provides:
- Detailed event tracking and logging
- Progress monitoring callbacks
- Score tracking
- Bookmark/location tracking
- Suspend data management

## Usage

### Basic Implementation

For SCORM lessons in the course manifest, simply set the lesson type to 'scorm':

```javascript
{
  id: 'lesson-scorm-1',
  title: 'Interactive SCORM Content',
  type: 'scorm',
  src: '/test-scorm-content.html'
}
```

The MediaPlayer will automatically:
1. Load the SCORM API script
2. Set up postMessage listeners
3. Handle completion events
4. Track progress

### Advanced Implementation with SCORMAdapter

For detailed tracking and custom event handling:

```tsx
import SCORMAdapter from '@/components/SCORMAdapter';

function CoursePlayer() {
  const handleProgress = (data) => {
    console.log('SCORM Progress:', data);
    // Custom progress tracking
  };

  const handleComplete = () => {
    console.log('Lesson completed!');
    // Custom completion handling
  };

  return (
    <div>
      <MediaPlayer lesson={lesson} lessons={lessons} />
      <SCORMAdapter 
        lessonId={lesson.id}
        onComplete={handleComplete}
        onProgress={handleProgress}
      />
    </div>
  );
}
```

## SCORM API Methods

The implementation provides all standard SCORM 1.2 API methods:

### Core Methods
- `LMSInitialize(parameter)`: Initialize the SCORM session
- `LMSFinish(parameter)`: Terminate the SCORM session
- `LMSGetValue(element)`: Get data from the SCORM data model
- `LMSSetValue(element, value)`: Set data in the SCORM data model
- `LMSCommit(parameter)`: Commit data to the LMS

### Error Handling
- `LMSGetLastError()`: Get the last error code
- `LMSGetErrorString(errorCode)`: Get error description
- `LMSGetDiagnostic(errorCode)`: Get diagnostic information

## Data Model Support

The API supports the complete SCORM 1.2 data model including:

### Core Elements
- `cmi.core.student_id`: Student identifier
- `cmi.core.student_name`: Student name
- `cmi.core.lesson_status`: Lesson completion status
- `cmi.core.lesson_location`: Bookmark location
- `cmi.core.score.raw`: Raw score
- `cmi.core.session_time`: Session duration
- `cmi.core.total_time`: Cumulative time

### Extended Elements
- `cmi.suspend_data`: Suspend/resume data
- `cmi.launch_data`: Launch parameters
- `cmi.comments`: Student comments
- `cmi.objectives`: Learning objectives
- `cmi.interactions`: Learner interactions
- `cmi.student_preference`: Student preferences

## PostMessage Events

The SCORM API communicates with the parent React application via postMessage:

### Event Structure
```javascript
{
  type: 'scorm-event',
  eventType: 'complete' | 'initialize' | 'finish' | 'commit' | 'datachange',
  data: {
    lessonStatus?: string,
    score?: string,
    suspendData?: string,
    sessionTime?: string,
    element?: string,
    value?: string,
    timestamp?: string
  }
}
```

### Event Types
1. **initialize**: Session started
2. **complete**: Lesson completed (triggers React completion)
3. **finish**: Session ended
4. **commit**: Data committed
5. **datachange**: Data model value changed

## Testing

A test SCORM content file is provided at `/public/test-scorm-content.html` which demonstrates:
- SCORM API detection and initialization
- Data model manipulation
- Completion tracking
- Score setting
- Suspend data management
- Visual progress indication

### Testing the Implementation

1. Start the development server
2. Navigate to a course with SCORM content
3. Open browser dev tools to see SCORM communication logs
4. Interact with the SCORM content to test completion tracking

## Cross-Origin Considerations

The implementation handles cross-origin scenarios:
- **Same-origin**: Direct API injection into iframe
- **Cross-origin**: Fallback to postMessage communication
- **Hybrid**: API injection with postMessage backup

## Error Handling

Comprehensive error handling includes:
- API availability validation
- Parameter validation
- Data model compliance checking
- Network communication error handling
- Graceful fallbacks for cross-origin restrictions

## Browser Compatibility

The implementation is compatible with:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills)
- Mobile browsers
- Iframe environments

## Security

Security considerations addressed:
- Origin validation for postMessage events
- Safe script injection
- Sandbox attribute support for iframes
- XSS prevention in data handling

## Performance

Optimizations include:
- Lazy loading of SCORM API script
- Efficient event listener management
- Memory leak prevention
- Minimal overhead for non-SCORM content

## Migration from Legacy Systems

To migrate existing SCORM content:
1. No changes required to SCORM content
2. Update course manifest to use new structure
3. Test with provided test content
4. Monitor browser console for any API issues

The implementation maintains full backward compatibility with existing SCORM 1.2 content while providing modern postMessage-based communication with the React parent application.
