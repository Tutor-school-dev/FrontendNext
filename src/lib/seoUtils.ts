import { Job } from "@/hooks/useJobListings";

/**
 * Generates an SEO-friendly slug from job data
 * Example: "job-listings-Math-Tutor-Class-12-CBSE-Delhi-110001"
 */
export function generateJobSlug(job: Job): string {
  const cleanText = (text: string) => {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters except spaces
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .slice(0, 100); // Limit length
  };

  const titleSlug = cleanText(job.subjects || 'Subject-Not-Specified');
  const locationSlug = cleanText(job.area);
  const gradeSlug = cleanText(`${job.grade}-${job.board}`);

  // Combine parts with meaningful separators
  const parts = [
    'job-listings',
    titleSlug,
    gradeSlug,
    locationSlug
  ].filter(part => part && part.length > 0);

  return parts.join('-');
}

/**
 * Generates the complete SEO-friendly URL for a job
 */
export function generateJobUrl(job: Job, baseUrl?: string): string {
  const domain = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://tutorschool.vercel.app');
  const slug = generateJobSlug(job);
  return `${domain}/${slug}?id=${job.id}`;
}

/**
 * Extracts job ID from URL parameters
 */
export function extractJobIdFromUrl(searchParams: URLSearchParams): string | null {
  return searchParams.get('id');
}

/**
 * Creates a job-specific page title for SEO
 */
export function generateJobPageTitle(job: Job): string {
  const cleanTitle = job.subjects || 'Job Details';
  return `${cleanTitle} - ${job.area} | TutorSchool`;
}

/**
 * Creates a job-specific meta description for SEO
 */
export function generateJobMetaDescription(job: Job): string {
  const cleanDesc = `${job.grade} ${job.board} - ${job.subjects || 'Subject not specified'}`;
  const truncatedDesc = cleanDesc.length > 120 
    ? cleanDesc.substring(0, 117) + '...' 
    : cleanDesc;
  
  return `${truncatedDesc} Apply for this ${job.mode_of_teaching || 'teaching'} position in ${job.area}. Posted by ${job.learner_name}.`;
}