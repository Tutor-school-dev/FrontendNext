import { redirect } from 'next/navigation';

// Redirect old tutor-search route to new format
export default function TutorSearchResults() {
  // Redirect to default city (Bengaluru) with "all" areas
  redirect('/bengaluru/tutors-in-all');
}