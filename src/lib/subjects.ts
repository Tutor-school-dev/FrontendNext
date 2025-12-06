/**
 * Subject Constants for TutorSchool Platform
 * List of subjects as defined by the backend API
 */

export const SUBJECTS = [
  'Mathematics',
  'Physics', 
  'Chemistry',
  'English',
  'Hindi',
  'Social Studies',
  'Biology',
  'Computer Science',
  'Accountancy',
  'Business Studies',
  'Economics',
  'History',
  'Geography',
  'Political Science',
  'Statistics'
] as const;

export type Subject = typeof SUBJECTS[number];

// Helper functions
export function getAllSubjects(): readonly string[] {
  return SUBJECTS;
}

export function isValidSubject(subject: string): subject is Subject {
  return SUBJECTS.includes(subject as Subject);
}

// Get subjects suitable for different education levels
export function getSubjectsForEducationLevel(educationLevel: string): string[] {
  const level = educationLevel.toLowerCase();
  
  // Primary level subjects
  if (level.includes('primary')) {
    return ['Mathematics', 'English', 'Hindi', 'Social Studies'];
  }
  
  // Secondary level subjects  
  if (level.includes('secondary') && !level.includes('senior')) {
    return ['Mathematics', 'English', 'Hindi', 'Social Studies', 'Biology', 'Physics', 'Chemistry'];
  }
  
  // Senior Secondary Science
  if (level.includes('senior_secondary_stream_science')) {
    return ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'];
  }
  
  // Senior Secondary Commerce
  if (level.includes('senior_secondary_stream_commerce')) {
    return ['Mathematics', 'English', 'Accountancy', 'Business Studies', 'Economics'];
  }
  
  // Senior Secondary Arts/Humanities
  if (level.includes('senior_secondary_stream_arts') || level.includes('humanities')) {
    return ['English', 'Hindi', 'History', 'Geography', 'Political Science', 'Economics'];
  }
  
  // UG Commerce
  if (level.includes('ug_commerce')) {
    return ['Accountancy', 'Business Studies', 'Economics', 'Statistics', 'Mathematics'];
  }
  
  // For all other levels, return all subjects
  return [...SUBJECTS];
}