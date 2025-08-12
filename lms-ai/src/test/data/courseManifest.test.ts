import { describe, it, expect } from 'vitest';
import { courseManifest, type Course } from '@/data/courseManifest';

describe('courseManifest', () => {
  it('should not be empty', () => {
    expect(courseManifest).toBeDefined();
    expect(courseManifest.length).toBeGreaterThan(0);
  });

  it('should have valid course structure', () => {
    courseManifest.forEach((course: Course) => {
      // Check required fields
      expect(course.id).toBeDefined();
      expect(course.title).toBeDefined();
      expect(course.description).toBeDefined();
      expect(course.lessons).toBeDefined();

      // Check types
      expect(typeof course.id).toBe('string');
      expect(typeof course.title).toBe('string');
      expect(typeof course.description).toBe('string');
      expect(Array.isArray(course.lessons)).toBe(true);

      // Check non-empty values
      expect(course.id.length).toBeGreaterThan(0);
      expect(course.title.length).toBeGreaterThan(0);
      expect(course.description.length).toBeGreaterThan(0);
      expect(course.lessons.length).toBeGreaterThan(0);
    });
  });

  it('should have unique course IDs', () => {
    const courseIds = courseManifest.map(course => course.id);
    const uniqueIds = [...new Set(courseIds)];
    expect(courseIds).toEqual(uniqueIds);
  });

  it('should have valid lesson structure', () => {
    courseManifest.forEach((course: Course) => {
      course.lessons.forEach(lesson => {
        // Check required fields
        expect(lesson.id).toBeDefined();
        expect(lesson.title).toBeDefined();
        expect(lesson.type).toBeDefined();
        expect(lesson.src).toBeDefined();

        // Check types
        expect(typeof lesson.id).toBe('string');
        expect(typeof lesson.title).toBe('string');
        expect(typeof lesson.type).toBe('string');
        expect(typeof lesson.src).toBe('string');

        // Check non-empty values
        expect(lesson.id.length).toBeGreaterThan(0);
        expect(lesson.title.length).toBeGreaterThan(0);
        expect(lesson.type.length).toBeGreaterThan(0);
        expect(lesson.src.length).toBeGreaterThan(0);
      });
    });
  });

  it('should have unique lesson IDs within each course', () => {
    courseManifest.forEach((course: Course) => {
      const lessonIds = course.lessons.map(lesson => lesson.id);
      const uniqueIds = [...new Set(lessonIds)];
      expect(lessonIds).toEqual(uniqueIds);
    });
  });

  it('should have valid lesson types', () => {
    const validTypes = ['video', 'scorm'];
    
    courseManifest.forEach((course: Course) => {
      course.lessons.forEach(lesson => {
        expect(validTypes).toContain(lesson.type);
      });
    });
  });

  it('should have valid source paths', () => {
    courseManifest.forEach((course: Course) => {
      course.lessons.forEach(lesson => {
        // Source should start with /
        expect(lesson.src).toMatch(/^\/\w+/);
        
        // Video lessons should have .mp4 extension
        if (lesson.type === 'video') {
          expect(lesson.src).toMatch(/\.mp4$/);
        }
        
        // SCORM lessons should have index.html or .html
        if (lesson.type === 'scorm') {
          expect(lesson.src).toMatch(/\.html$/);
        }
      });
    });
  });

  it('should have specific expected courses', () => {
    const expectedCourseIds = ['pwp-101', 'tm-201', 'com-301'];
    const actualCourseIds = courseManifest.map(course => course.id);
    
    expectedCourseIds.forEach(expectedId => {
      expect(actualCourseIds).toContain(expectedId);
    });
  });

  it('should have PWP-101 course with expected lessons', () => {
    const pwpCourse = courseManifest.find(course => course.id === 'pwp-101');
    expect(pwpCourse).toBeDefined();
    
    if (pwpCourse) {
      expect(pwpCourse.title).toBe('Intro to Personal Workplace Productivity');
      expect(pwpCourse.lessons).toHaveLength(4);
      
      const lessonIds = pwpCourse.lessons.map(lesson => lesson.id);
      expect(lessonIds).toEqual(['intro', 'content', 'practice', 'test-scorm']);
    }
  });

  it('should have TM-201 course with expected structure', () => {
    const tmCourse = courseManifest.find(course => course.id === 'tm-201');
    expect(tmCourse).toBeDefined();
    
    if (tmCourse) {
      expect(tmCourse.title).toBe('Advanced Time Management');
      expect(tmCourse.lessons.length).toBeGreaterThan(0);
      
      // Should have a mix of video and scorm lessons
      const videoLessons = tmCourse.lessons.filter(lesson => lesson.type === 'video');
      const scormLessons = tmCourse.lessons.filter(lesson => lesson.type === 'scorm');
      
      expect(videoLessons.length).toBeGreaterThan(0);
      expect(scormLessons.length).toBeGreaterThan(0);
    }
  });

  it('should have COM-301 course with expected structure', () => {
    const comCourse = courseManifest.find(course => course.id === 'com-301');
    expect(comCourse).toBeDefined();
    
    if (comCourse) {
      expect(comCourse.title).toBe('Communication Skills for Leaders');
      expect(comCourse.lessons.length).toBeGreaterThan(0);
      
      // Should be the course with the most lessons
      const maxLessons = Math.max(...courseManifest.map(c => c.lessons.length));
      expect(comCourse.lessons.length).toBe(maxLessons);
    }
  });

  it('should have consistent data format across all courses', () => {
    // All courses should follow the same pattern
    courseManifest.forEach((course: Course) => {
      // Title should not be too short or too long
      expect(course.title.length).toBeGreaterThanOrEqual(10);
      expect(course.title.length).toBeLessThan(100);
      
      // Description should be substantial
      expect(course.description.length).toBeGreaterThanOrEqual(20);
      expect(course.description.length).toBeLessThan(200);
      
      // Should have at least 3 lessons
      expect(course.lessons.length).toBeGreaterThanOrEqual(3);
      
      // Each lesson title should be reasonable length
      course.lessons.forEach(lesson => {
        expect(lesson.title.length).toBeGreaterThan(3);
        expect(lesson.title.length).toBeLessThan(50);
      });
    });
  });
});
