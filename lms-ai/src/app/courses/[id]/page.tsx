import { courseManifest } from '@/data/courseManifest';
import { notFound } from 'next/navigation';
import CoursePlayer from '@/components/CoursePlayer';

interface CoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Server component wrapper
export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  
  // Find the course in the manifest
  const course = courseManifest.find((c) => c.id === id);
  
  // Return 404 if course not found
  if (!course) {
    notFound();
  }

  return <CoursePlayer courseId={id} />;
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
