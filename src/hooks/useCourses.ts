import { useState, useEffect } from 'react';

export interface Course {
  c_id: string;
  c_name: string;
  c_desc: string;
  c_image: string;
  c_desc_video: string;
  c_total_time: number;
  c_participants: number;
  c_instructor_name: string;
  c_language: string;
  c_level: string;
  c_total_price: number;
  c_currency: string;
  c_discount: number;
  c_tax: number;
  c_active: boolean;
  c_rating: number;
  c_created_at: string;
  c_updated_at: string;
  c_target: string; // 'teacher' or 'learner'
}

interface CoursesResponse {
  courses: Course[];
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_GO_APP_URL}/admin/pub/course/`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`);
        }
        
        const data: CoursesResponse = await response.json();
        
        // Extract courses array from the response object
        const coursesArray = data.courses || [];
        
        // Filter only active courses
        const activeCourses = coursesArray.filter(course => course.c_active);
        setCourses(activeCourses);
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
};