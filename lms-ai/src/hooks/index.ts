/**
 * Hooks index - Re-export all custom hooks for easier imports
 */

export { 
  ProgressProvider, 
  useProgress, 
  type ProgressContextType, 
  type ProgressProviderProps 
} from './useProgress';

export {
  LessonStateProvider,
  useLessonState,
  type LessonStateContextType,
  type LessonStateProviderProps,
  type Lesson
} from './useLessonState';
