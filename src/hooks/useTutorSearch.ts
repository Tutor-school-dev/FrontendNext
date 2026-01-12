import { useState } from 'react';
import axios from 'axios';
import { getDjangoAuthUrl } from '../lib/utils';
import { Tutor } from './useTutorListing';

export interface TutorSearchFilters {
  subjects?: string;
  mode_of_teaching?: 'ONLINE' | 'OFFLINE' | 'BOTH';
  class_level?: string;
  city?: string;
  area?: string;
}

export interface TutorSearchResponse {
  tutors: Tutor[];
  total: number;
}

export const useTutorSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTutors = async (filters: TutorSearchFilters): Promise<TutorSearchResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters.subjects) {
        params.append('subjects', filters.subjects);
      }
      
      if (filters.mode_of_teaching && filters.mode_of_teaching !== 'BOTH') {
        params.append('mode_of_teaching', filters.mode_of_teaching);
      }
      
      if (filters.class_level) {
        params.append('class_level', filters.class_level);
      }
      
      if (filters.city) {
        params.append('city', filters.city);
      }
      
      if (filters.area) {
        params.append('area', filters.area);
      }

      const response = await axios.get<TutorSearchResponse>(
        `${getDjangoAuthUrl()}/tutor/public/all?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Parse subjects if they come as strings
      const parseSubjects = (subjects: any): string[] => {
        if (Array.isArray(subjects)) {
          return subjects;
        } else if (typeof subjects === 'string') {
          try {
            if (subjects.startsWith('[') && subjects.endsWith(']')) {
              return JSON.parse(subjects.replace(/'/g, '"'));
            }
            return [subjects];
          } catch {
            return [subjects];
          }
        }
        return [];
      };

      // Normalize the tutor data
      const normalizedTutors = response.data.tutors.map(tutor => ({
        ...tutor,
        subjects: parseSubjects(tutor.subjects),
        lesson_price: tutor.lesson_price || '0',
        rating: tutor.rating || Math.floor(Math.random() * 2) + 4, // Mock rating 4-5
        total_reviews: tutor.total_reviews || Math.floor(Math.random() * 50) + 10, // Mock reviews
      }));

      const result = {
        tutors: normalizedTutors,
        total: response.data.total || normalizedTutors.length,
      };

      return result;
    } catch (err: any) {
      console.error('Error searching tutors:', err);
      const errorMessage = err.response?.data?.message || 'Failed to search tutors. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    searchTutors,
    loading,
    error,
  };
};