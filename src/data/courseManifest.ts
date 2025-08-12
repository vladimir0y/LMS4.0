export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Array<{
    id: string;
    title: string;
    type: string;
    src: string;
  }>;
}

export const courseManifest: Course[] = [
  {
    id: 'pwp-101',
    title: 'Intro to Personal Workplace Productivity',
    description: 'Boost your productivity with practical frameworks and exercises.',
    lessons: [
      { id: 'intro', title: 'Intro', type: 'video', src: '/pwp/intro.mp4' },
      { id: 'content', title: 'Content', type: 'scorm', src: '/pwp/content/index.html' },
      { id: 'practice', title: 'Practice', type: 'scorm', src: '/pwp/practice/index.html' },
      { id: 'test-scorm', title: 'SCORM API Test', type: 'scorm', src: '/test-scorm-content.html' }
    ]
  },
  {
    id: 'tm-201',
    title: 'Advanced Time Management',
    description: 'Master advanced techniques for managing your time effectively and maximizing productivity.',
    lessons: [
      { id: 'planning', title: 'Strategic Planning', type: 'video', src: '/tm/planning.mp4' },
      { id: 'priorities', title: 'Priority Matrix', type: 'scorm', src: '/tm/priorities/index.html' },
      { id: 'delegation', title: 'Effective Delegation', type: 'video', src: '/tm/delegation.mp4' },
      { id: 'workflow', title: 'Workflow Optimization', type: 'scorm', src: '/tm/workflow/index.html' }
    ]
  },
  {
    id: 'com-301',
    title: 'Communication Skills for Leaders',
    description: 'Develop essential communication skills to lead teams and drive results.',
    lessons: [
      { id: 'listening', title: 'Active Listening', type: 'video', src: '/com/listening.mp4' },
      { id: 'presentation', title: 'Presentation Skills', type: 'scorm', src: '/com/presentation/index.html' },
      { id: 'feedback', title: 'Giving Feedback', type: 'video', src: '/com/feedback.mp4' },
      { id: 'meetings', title: 'Meeting Management', type: 'scorm', src: '/com/meetings/index.html' },
      { id: 'conflict', title: 'Conflict Resolution', type: 'video', src: '/com/conflict.mp4' }
    ]
  }
];
