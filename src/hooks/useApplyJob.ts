"use client";

import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { AUTH_COOKIE } from "@/lib/constants";

export const useApplyJob = () => {
  const apply_job = async (job_id: string) => {
    try {
      console.log('🎯 useApplyJob: Starting job application for job_id:', job_id);
      
      // Get JWT token from cookies
      const jwt_Token = Cookies.get(AUTH_COOKIE.JWT_TOKEN);
      
      console.log('🔑 useApplyJob: JWT Token present:', !!jwt_Token);
      
      if (!jwt_Token) {
        toast.error("Please login to apply for jobs");
        return { message: "Unauthorized", status: 401 };
      }

      const response = await axios.post(
        "https://stagingapi.tutorschool.in/api/admin_app/job-apply/",
        { job_listing_id: job_id },
        {
          headers: {
            Authorization: `Bearer ${jwt_Token}`
          }
        }
      );
      
      toast.success("🎉 Application submitted! Our team will contact you soon", {
        duration: 2500,
      });
      return { message: response.data.message, status: response.status };
    } catch (error: any) {
      const msg = error.response?.data?.message || "Something went wrong";
      const status = error.response?.status || 500;
      toast.error(msg);
      return { message: msg, status: status };
    }
  };

  return { apply_job };
};