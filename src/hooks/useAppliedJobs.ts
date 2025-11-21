"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { getDjangoAuthUrl } from "@/lib/utils";

export interface AppliedJob {
  id: string;
  tutor: string;
  applied_at: string;
  status: string;
  learner: {
    id: string;
    name: string;
    email: string;
    primary_contact: string;
    state: string;
    area: string;
    pincode: string;
    grade: string;
    board: string;
    guardian_name: string;
    subjects: string | string[];
    budget: string;
    preferred_mode: string;
    created_at: string;
  };
}

export interface AppliedJobsResponse {
  applications: AppliedJob[];
}

export const useAppliedJobs = () => {
  const [applications, setApplications] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      const djangoUrl = getDjangoAuthUrl();
      const authToken = Cookies.get("jwt_Token");

      if (!authToken) {
        toast.error("Authentication required. Please login again.");
        return;
      }

      const response = await axios.get<AppliedJobsResponse>(
        `${djangoUrl}/tutor/applied-jobs/`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      // Normalize subjects to always be an array
      const normalizedApplications = (response.data.applications || []).map(app => ({
        ...app,
        learner: {
          ...app.learner,
          subjects: typeof app.learner.subjects === 'string' 
            ? app.learner.subjects.split(',').map(s => s.trim())
            : Array.isArray(app.learner.subjects) 
            ? app.learner.subjects 
            : []
        }
      }));

      setApplications(normalizedApplications);
    } catch (err: any) {
      console.error("Fetch applied jobs error:", err);
      toast.error(
        err.response?.data?.message || "Failed to fetch applied jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    applications,
    loading,
    fetchAppliedJobs,
  };
};
