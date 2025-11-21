import { useState, useEffect } from 'react';
import axios from 'axios';
import { getDjangoAuthUrl } from '../lib/utils';

export interface Tutor {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_picture?: string;
  profile_pic?: string;
  introduction?: string;
  teaching_desc?: string;
  lesson_price?: string;
  teaching_mode: 'ONLINE' | 'OFFLINE';
  current_status?: string;
  subjects: string[];
  university?: string;
  degree?: string;
  class_level?: string;
  area?: string;
  state?: string;
  experience_years?: string;
  rating?: number;
  total_reviews?: number;
}

export interface TutorListingResponse {
  tutors: Tutor[];
  total: number;
}

export interface TutorFilters {
  subject?: string[];
  mode_of_teaching?: 'ONLINE' | 'OFFLINE';
}

const useTutorListing = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const parseSubjects = (subjects: any): string[] => {
    if (Array.isArray(subjects)) {
      return subjects;
    } else if (typeof subjects === 'string') {
      try {
        // Handle string format like "['English', 'Maths', 'Chemistry']"
        if (subjects.startsWith('[') && subjects.endsWith(']')) {
          return JSON.parse(subjects.replace(/'/g, '"'));
        } else {
          // Handle comma-separated string
          return subjects.split(',').map(s => s.trim()).filter(s => s.length > 0);
        }
      } catch (e) {
        // Fallback to comma-separated parsing
        return subjects.split(',').map(s => s.trim()).filter(s => s.length > 0);
      }
    }
    return [];
  };

  const fetchTutors = async (filters?: TutorFilters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (filters?.subject && filters.subject.length > 0) {
        params.append('subject', filters.subject.join(','));
      }
      
      if (filters?.mode_of_teaching) {
        params.append('mode_of_teaching', filters.mode_of_teaching);
      }

      // Get auth token from cookies
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('jwt_Token='))
        ?.split('=')[1];

      const response = await axios.get<TutorListingResponse>(
        `${getDjangoAuthUrl()}/tutor/all${params.toString() ? `?${params.toString()}` : ''}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
          },
        }
      );

      // Normalize the tutor data
      const normalizedTutors = response.data.tutors.map(tutor => ({
        ...tutor,
        subjects: parseSubjects(tutor.subjects),
        lesson_price: tutor.lesson_price || '0',
        rating: tutor.rating || Math.floor(Math.random() * 2) + 4, // Mock rating 4-5
        total_reviews: tutor.total_reviews || Math.floor(Math.random() * 50) + 10, // Mock reviews
      }));

      setTutors(normalizedTutors);
      setTotal(response.data.total || normalizedTutors.length);
    } catch (err) {
      console.error('Error fetching tutors:', err);
      setError('Failed to fetch tutors. Please try again.');
      setTutors([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  return {
    tutors,
    loading,
    error,
    total,
    fetchTutors,
  };
};

export default useTutorListing;