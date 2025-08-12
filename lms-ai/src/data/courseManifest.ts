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
    id: 'powerpoint-simulator',
    title: 'PowerPoint Software Simulator',
    description: 'Master PowerPoint through interactive simulations and hands-on practice. Learn essential presentation skills with real software simulation.',
    lessons: [
      { id: 'intro', title: 'Introduction to PowerPoint', type: 'scorm', src: '/pwp/Intro/index_lms.html' },
      { id: 'content', title: 'PowerPoint Content Creation', type: 'scorm', src: '/pwp/Content/index_lms.html' },
      { id: 'practice1', title: 'PowerPoint Practice Session', type: 'scorm', src: '/pwp/Practice1/index_lms.html' }
    ]
  }
];
