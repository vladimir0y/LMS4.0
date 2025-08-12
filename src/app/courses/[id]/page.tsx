import { courseManifest } from '@/data/courseManifest';
import { notFound } from 'next/navigation';

interface CoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Server component that fetches the course data based on the ID parameter
export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  
  // Find the course in the manifest
  const course = courseManifest.find((c) => c.id === id);
  
  // Return 404 if course not found
  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Course Title and Description */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {course.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl line-clamp-4">
            {course.description}
          </p>
        </header>

        {/* Two-column layout: responsive flex */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column: Lesson List (25% on desktop) */}
          <aside className="w-full md:w-1/4">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Lessons
              </h2>
              <nav className="space-y-2" role="navigation" aria-label="Course lessons">
                <ol className="space-y-2">
                  {course.lessons.map((lesson, index) => (
                    <li key={lesson.id}>
                      <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-left">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3" aria-hidden="true">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {lesson.type}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            </section>
          </aside>

          {/* Right column: Media Player (75% on desktop) */}
          <main className="w-full md:w-3/4">
            <section className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Media Player Header */}
              <header className="bg-gray-800 text-white p-4">
                <h3 className="text-lg font-semibold line-clamp-2">
                  {course.lessons[0]?.title || 'Select a lesson'}
                </h3>
                <p className="text-gray-300 text-sm capitalize">
                  {course.lessons[0]?.type || 'No lesson selected'}
                </p>
              </header>

              {/* Media Player Content */}
              <div className="aspect-video bg-gray-900 flex items-center justify-center" role="main">
                {course.lessons[0]?.type === 'video' ? (
                  <div className="text-center text-white">
                    <div className="mb-4">
                      <svg
                        className="w-16 h-16 mx-auto text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="Video content"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-300">Video Player</p>
                    <p className="text-sm text-gray-400 mt-2 line-clamp-1">
                      Source: {course.lessons[0]?.src}
                    </p>
                  </div>
                ) : course.lessons[0]?.type === 'scorm' ? (
                  <div className="text-center text-white">
                    <div className="mb-4">
                      <svg
                        className="w-16 h-16 mx-auto text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="SCORM content"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-300">SCORM Content</p>
                    <p className="text-sm text-gray-400 mt-2 line-clamp-1">
                      Source: {course.lessons[0]?.src}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-white">
                    <p className="text-gray-300">Select a lesson to begin</p>
                  </div>
                )}
              </div>

              {/* Media Player Controls */}
              <footer className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <nav className="flex space-x-2" role="navigation" aria-label="Lesson navigation">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Previous
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Next
                    </button>
                  </nav>
                  <div className="text-sm text-gray-600" role="status">
                    Lesson 1 of {course.lessons.length}
                  </div>
                </div>
              </footer>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for the page
export async function generateMetadata({ params }: CoursePageProps) {
  const { id } = await params;
  const course = courseManifest.find((c) => c.id === id);
  
  if (!course) {
    return {
      title: 'Course Not Found',
    };
  }

  return {
    title: `${course.title} | AI-Powered LMS`,
    description: course.description,
  };
}

// Generate static params for known courses (optional for better performance)
export async function generateStaticParams() {
  return courseManifest.map((course) => ({
    id: course.id,
  }));
}
