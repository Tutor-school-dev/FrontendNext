"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export interface Job {
  id: number;
  created_at: string;
  learner_name: string;
  learner_phone: string;
  learner_email: string | null;
  grade: string;
  board: string;
  state: string;
  area: string;
  subjects?: string;
  mode_of_teaching?: string;
}

export interface JobFilters {
  mode_of_teaching?: string;
  subjects?: string[];
  radius?: number;
  latitude?: number;
  longitude?: number;
}

export function useJobListings(filters?: JobFilters) {
  const [jobsData, setJobsData] = useState<Job[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchJobs = async (customFilters?: JobFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const activeFilters = customFilters || filters || {};
      const params = new URLSearchParams();
      
      if (activeFilters.mode_of_teaching) {
        params.append('mode_of_teaching', activeFilters.mode_of_teaching);
      }
      
      if (activeFilters.subjects && activeFilters.subjects.length > 0) {
        params.append('subjects', activeFilters.subjects.join(','));
      }
      
      if (activeFilters.radius !== undefined) {
        params.append('radius', activeFilters.radius.toString());
      }
      
      if (activeFilters.latitude !== undefined) {
        params.append('latitude', activeFilters.latitude.toString());
      }
      
      if (activeFilters.longitude !== undefined) {
        params.append('longitude', activeFilters.longitude.toString());
      }
      
      const queryString = params.toString();
      const url = `https://stagingapi.tutorschool.in/api/admin_app/jobs/${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get(url);
      setJobsData(response.data || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError(err as Error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return { jobsData, loading, error, refetch: fetchJobs };
}