"use client";

import axios from "axios";
import { toast } from "sonner";

export const useApplyJob = () => {
  const apply_job = async (job_id: string, teacher_id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_GO_APP_URL || 'https://api.tutorschool.in';
      const response = await axios.post(`${apiUrl}/admin/pub/job-applications`, {
        ja_job_id: job_id,
        ja_teacher_id: teacher_id,
        ja_status: "pending"
      });
      
      console.log(response.data);
      toast.success(response.data.message || "Application submitted successfully!");
      return { message: response.data.message, status: response.status };
    } catch (error: any) {
      console.error('Job application error:', error);
      const msg = error.response?.data?.message || "Something went wrong";
      const status = error.response?.status || 500;
      toast.error(msg);
      return { message: msg, status: status };
    }
  };

  return { apply_job };
};