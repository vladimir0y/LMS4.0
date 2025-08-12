# LMS Testing Guide

This document outlines the testing strategy and procedures for the LMS application, covering unit tests, manual verification, and performance/accessibility audits.

## 🧪 Testing Stack

- **Unit Testing**: Vitest + React Testing Library
- **Manual Testing**: Structured walkthrough guide
- **Performance & Accessibility**: Lighthouse audits

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run all unit tests
npm run test:run

# Start dev server for manual testing
npm run dev

# Run Lighthouse audit (requires dev server)
npm run lighthouse
```

## 🔬 Unit Testing

### Coverage Areas

Our unit tests cover:

1. **Progress Management** (`useProgress` hook)
   - localStorage persistence
   - Course-specific progress tracking
   - Completion state management
   - Error handling

2. **Lesson State** (`useLessonState` hook)
   - Active lesson tracking
   - Lesson data management
   - Context provider functionality

3. **Sequential Gating** (`LessonSidebar` component)
   - Lesson accessibility logic
   - Visual state indicators
   - User interaction handling
   - Keyboard navigation

4. **SCORM Integration** (`SCORMAdapter` component)
   - Event message handling
   - Completion detection
   - Multiple event types
   - Callback integration

5. **Data Integrity** (`courseManifest`)
   - Course structure validation
   - Data consistency checks
   - Required field verification

### Running Tests

```bash
# Run tests in watch mode
npm run test

# Run all tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Files Location

```
src/test/
├── components/
│   ├── LessonSidebar.test.tsx
│   └── SCORMAdapter.test.tsx
├── hooks/
│   ├── useProgress.test.tsx
│   └── useLessonState.test.tsx
├── data/
│   └── courseManifest.test.ts
└── setup.ts
```

## 📋 Manual Testing

### Prerequisites

1. Start development server: `npm run dev`
2. Open browser to `http://localhost:3000`

### Test Scenarios

Manual testing verifies three critical behaviors:

#### 1. Sequential Gating ✋
**Objective**: Users cannot skip ahead to future lessons

**Verification Steps**:
- Only first lesson is clickable initially
- Subsequent lessons are visually disabled (grayed out)
- Clicking disabled lessons has no effect
- Hover states show "not-allowed" cursor

#### 2. Progress Persistence 💾
**Objective**: Progress survives page refreshes

**Verification Steps**:
- Complete first lesson
- Verify completion icon appears
- Refresh the page
- Confirm completion status persists
- Verify unlocked lessons remain unlocked

#### 3. Auto-Advance 🎯
**Objective**: Completing lessons automatically unlocks the next

**Verification Steps**:
- Complete lesson → next lesson unlocks immediately
- No page refresh required
- Visual feedback is instant
- Works for entire lesson sequence

### Detailed Instructions

See [MANUAL_TEST_GUIDE.md](./MANUAL_TEST_GUIDE.md) for comprehensive step-by-step testing procedures.

## ⚡ Performance & Accessibility

### Lighthouse Audits

We use Lighthouse to ensure:
- **Performance Score** > 90
- **Accessibility Score** > 90

### Running Lighthouse

```bash
# Make sure dev server is running
npm run dev

# In another terminal, run Lighthouse audit
npm run lighthouse
```

### What Gets Tested

**Performance Metrics**:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Total Blocking Time (TBT)

**Accessibility Checks**:
- Color contrast ratios
- Keyboard navigation
- Screen reader compatibility
- ARIA labels and roles
- Focus management

### Lighthouse Output

The audit generates:
- Console output with pass/fail results
- Detailed HTML report saved as `lighthouse-report.html`
- Specific recommendations for improvements

## 🏗️ CI/CD Integration

### Automated Testing Pipeline

```bash
# Complete test suite
npm run test:run        # Unit tests
npm run build           # Build verification
npm run lighthouse      # Performance audit
```

### Quality Gates

All tests must pass before deployment:
- ✅ Unit test coverage
- ✅ Manual test scenarios verified
- ✅ Lighthouse scores > 90

## 🔧 Development Testing Workflow

### During Development

1. **Write feature** → **Write tests** → **Verify manually**
2. Run `npm run test` in watch mode
3. Use manual testing guide for integration verification
4. Run Lighthouse before commits

### Pre-Commit Checklist

- [ ] All unit tests passing
- [ ] Manual test scenarios verified
- [ ] Lighthouse scores meet thresholds
- [ ] No console errors in browser
- [ ] Keyboard navigation works

### Debugging Test Issues

**Unit Tests**:
```bash
# Run specific test file
npx vitest src/test/components/LessonSidebar.test.tsx

# Debug with console logs
npm run test -- --reporter=verbose
```

**Manual Testing**:
```javascript
// Browser console debugging
console.log('Progress:', localStorage.getItem('lms_progress_courseId'));
localStorage.clear(); // Reset for testing
```

**Lighthouse Issues**:
- Check console for JavaScript errors
- Verify all images have alt text
- Ensure proper heading hierarchy
- Test keyboard navigation

## 📊 Test Metrics & Goals

### Coverage Targets
- **Unit Test Coverage**: >85% line coverage
- **Manual Test Coverage**: 100% of core user flows
- **Performance Score**: >90 (Lighthouse)
- **Accessibility Score**: >90 (Lighthouse)

### Success Criteria

**Functional Requirements**:
- ✅ Sequential lesson gating works correctly
- ✅ Progress persists across browser sessions
- ✅ Auto-advance unlocks lessons immediately
- ✅ SCORM integration handles all event types
- ✅ Error states are handled gracefully

**Quality Requirements**:
- ✅ Fast load times (<3s First Contentful Paint)
- ✅ Accessible to users with disabilities
- ✅ Works across modern browsers
- ✅ Responsive design functions properly
- ✅ No JavaScript errors in production

## 🚨 Troubleshooting

### Common Issues

**Tests failing locally**:
1. Clear `node_modules` and reinstall
2. Check for version conflicts
3. Verify test environment setup

**Lighthouse failing**:
1. Ensure dev server is running
2. Close other browser tabs
3. Check for Chrome/Chromium installation

**Manual tests not working**:
1. Clear browser localStorage
2. Check browser console for errors
3. Verify correct course data loading

### Getting Help

- Check test output for specific error messages
- Review browser developer tools console
- Verify all dependencies are installed correctly
- Ensure proper Node.js version (>= 18)

---

## Summary

This comprehensive testing approach ensures the LMS application is:
- **Reliable**: Unit tests catch regressions
- **Usable**: Manual testing verifies user experience
- **Performant**: Lighthouse ensures fast load times
- **Accessible**: Automated accessibility checks

The testing strategy provides confidence that core learning management features work correctly and provide an excellent user experience.
