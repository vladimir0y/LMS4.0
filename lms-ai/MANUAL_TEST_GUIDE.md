# LMS Manual Testing Guide

This guide provides step-by-step instructions for manually testing the LMS application to verify:
1. **Sequential gating**: Users cannot skip ahead to later lessons
2. **Progress persistence**: Progress is saved across page refreshes  
3. **Auto-advance**: Lessons automatically enable the next lesson upon completion

## Prerequisites

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000`

## Test Scenario 1: Sequential Gating (Cannot Skip Ahead)

### Expected Behavior
- Only the first lesson should be clickable initially
- Subsequent lessons should be disabled (grayed out, unclickable)

### Steps to Test
1. Open the course page
2. Observe the lesson sidebar
3. Verify first lesson (Introduction) is:
   - ✅ Clickable (blue styling)
   - ✅ Has normal cursor on hover
   - ✅ Highlighted as active
4. Verify subsequent lessons (Basic Concepts, Advanced Topics, Final Assessment) are:
   - ✅ Grayed out (opacity-50)
   - ✅ Show "cursor-not-allowed" on hover
   - ✅ Do not respond to clicks
5. Try clicking disabled lessons - nothing should happen

### Pass Criteria
- ✅ First lesson is accessible
- ✅ All other lessons are visually disabled
- ✅ Disabled lessons do not respond to clicks
- ✅ No JavaScript errors in browser console

---

## Test Scenario 2: Progress Persistence (Survives Page Refresh)

### Expected Behavior
- Lesson completion status is saved to localStorage
- Progress is maintained after page refresh
- Previously completed lessons remain unlocked

### Steps to Test
1. Complete the first lesson by:
   - Clicking on "Introduction" lesson
   - If it's a video: wait for video to end or skip to completion
   - If it's SCORM: complete the SCORM activity
   - Verify completion icon (green checkmark) appears
2. Note which lessons are now unlocked (should include "Basic Concepts")
3. **Refresh the page** (F5 or Ctrl+R)
4. After page reload, verify:
   - ✅ "Introduction" still shows completion icon
   - ✅ "Basic Concepts" is still unlocked/clickable
   - ✅ "Advanced Topics" and "Final Assessment" remain locked

### Pass Criteria
- ✅ Completion status persists across refresh
- ✅ Unlocked lessons remain unlocked after refresh
- ✅ Locked lessons remain locked after refresh
- ✅ Green checkmark icons persist

---

## Test Scenario 3: Auto-Advance Works

### Expected Behavior
- Completing a lesson automatically unlocks the next lesson
- Progress indicators update in real-time
- No page refresh required for unlock

### Steps to Test

#### Part A: First Lesson Completion
1. Start with fresh state (clear localStorage if needed)
2. Click "Introduction" lesson
3. Complete the lesson (video/SCORM activity)
4. Immediately observe the sidebar:
   - ✅ "Introduction" gets completion icon
   - ✅ "Basic Concepts" becomes clickable (styling changes)
   - ✅ "Advanced Topics" remains locked

#### Part B: Second Lesson Completion  
1. Click "Basic Concepts" (should now be enabled)
2. Complete the lesson
3. Observe:
   - ✅ "Basic Concepts" gets completion icon
   - ✅ "Advanced Topics" becomes clickable
   - ✅ "Final Assessment" remains locked

#### Part C: Third Lesson Completion
1. Click "Advanced Topics" 
2. Complete the lesson
3. Observe:
   - ✅ "Advanced Topics" gets completion icon
   - ✅ "Final Assessment" becomes clickable

#### Part D: Final Lesson
1. Click "Final Assessment"
2. Complete the lesson
3. Observe:
   - ✅ "Final Assessment" gets completion icon
   - ✅ All lessons show completion

### Pass Criteria
- ✅ Each completion immediately unlocks next lesson
- ✅ No page refresh needed for auto-advance
- ✅ Visual feedback is instant
- ✅ Sequential unlocking works for entire course

---

## Test Scenario 4: Edge Cases & Error Handling

### Test 4.1: Browser Storage Issues
1. Open Developer Tools → Application → Local Storage
2. Clear all localStorage data
3. Refresh page
4. Verify app resets to initial state (only first lesson unlocked)

### Test 4.2: Keyboard Navigation
1. Use Tab key to navigate through lessons
2. Use Enter/Space to activate lessons
3. Verify disabled lessons cannot be activated via keyboard

### Test 4.3: Multiple Browser Tabs
1. Open course in two tabs
2. Complete lesson in first tab  
3. Refresh second tab
4. Verify progress syncs between tabs

---

## SCORM Testing Notes

If testing with SCORM content:

### SCORM Completion Triggers
The system listens for these SCORM events:
- `complete` event with any data
- `finish` event with `lessonStatus: 'completed'` or `'passed'`
- `datachange` event with `cmi.core.lesson_status` = `'completed'` or `'passed'`

### Manual SCORM Testing
1. Open browser Developer Tools → Console
2. Simulate SCORM completion by dispatching events:

```javascript
// Simulate SCORM completion
window.postMessage({
  type: 'scorm-event',
  eventType: 'complete',
  data: {
    lessonStatus: 'completed',
    timestamp: new Date().toISOString()
  }
}, '*');
```

---

## Troubleshooting

### Common Issues
1. **Lessons not unlocking**: Check browser console for JavaScript errors
2. **Progress not persisting**: Verify localStorage is enabled in browser
3. **SCORM not completing**: Check console for SCORM event messages
4. **Styling issues**: Verify Tailwind CSS is loaded

### Debug Commands
```javascript
// Check localStorage progress
console.log('Progress data:', localStorage.getItem('lms_progress_[courseId]'));

// Clear progress (for testing)
localStorage.clear();

// Check for React context errors
// Look for "used outside provider" errors in console
```

---

## Success Criteria Summary

✅ **Sequential Gating**: Only accessible lessons are clickable  
✅ **Progress Persistence**: Completion status survives page refresh  
✅ **Auto-Advance**: Completing lesson immediately unlocks next  
✅ **User Experience**: Smooth, intuitive interaction  
✅ **Error Handling**: Graceful degradation when issues occur  
✅ **Accessibility**: Keyboard navigation works properly

All tests should pass without JavaScript errors in the browser console.
