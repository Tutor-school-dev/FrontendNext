"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDashboardStore } from "./useDashboardStore";
import { useApplyJob } from "./useApplyJob";
import { getDjangoAuthUrl } from "@/lib/utils";
import { USER_TYPE, getUserTypeDisplay, AUTH_COOKIE, STORAGE_KEY } from "@/lib/constants";
import type { GoogleAuthPayload, GoogleAuthResponse } from "@/types/auth";
import { isNewUserResponse, isExistingUserResponse } from "@/types/auth";

export const useTeacherGoogleLogin = (redirectFromJobListing?: string, job_id?: string) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { set_dashboard_data } = useDashboardStore();
  const { apply_job } = useApplyJob();

  const handleGoogleLogin = async (response: any) => {
    const token = response.credential;
    setLoading(true);

    try {
      const apiUrl = getDjangoAuthUrl();
      const endpoint = '/google/';
      
      const payload: GoogleAuthPayload = {
        id_token: token,
        user_type: USER_TYPE.TUTOR
      };
      
      const res = await axios.post<GoogleAuthResponse>(`${apiUrl}${endpoint}`, payload);

      const { data } = res;
      
      // Handle success message
      if ('message' in data) {
        toast.info(data.message);
      } else {
        toast.info("Google login successful!");
      }

      // Handle new user registration flow
      if (isNewUserResponse(data)) {
        Cookies.set(AUTH_COOKIE.ACCESS_HASH, data.access_hash, { expires: 1 });
        const displayModel = getUserTypeDisplay(data.user_type);
        localStorage.setItem(STORAGE_KEY.MODEL, displayModel);
        router.push(`/create-account?model=teacher`);
        return;
      }

      // Handle existing user
      if (isExistingUserResponse(data)) {
        // Set JWT token
        Cookies.set(AUTH_COOKIE.JWT_TOKEN, data.jwt_token, { expires: 7 });
        Cookies.set(AUTH_COOKIE.REFRESH_TOKEN, data.refresh, { expires: 7 });

        // Store user data
        const userData = data.user;
        const displayModel = getUserTypeDisplay(data.user_type);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY.MODEL, displayModel);
          localStorage.setItem(STORAGE_KEY.EMAIL, userData.email);
          localStorage.setItem(STORAGE_KEY.NAME, userData.name);
        }

        set_dashboard_data(userData, "teacher");

        // Apply for job if coming from job listing
        if (redirectFromJobListing === "fromJobListing" && job_id) {
          console.log("Applying job...", job_id, userData.id);
          const job_message = await apply_job(job_id, userData.id);
          set_dashboard_data(job_message, "job_message");
        }

        // Navigation logic
        if (data.go_to_dashboard) {
          const redirect = redirectFromJobListing === "fromJobListing" 
            ? `?redirectFromJobListing=${redirectFromJobListing}` 
            : '';
          
          router.push(`/dashboard/teacher${redirect}`);
          return;
        }

        // Check profile completion status
        const stepNames = {
          basic_done: userData.basic_done,
          location_done: userData.location_done
        };

        for (const [key, value] of Object.entries(stepNames)) {
          if (!value) {
            router.push(`/teacher-profile?step=${key}`);
            return;
          }
        }
      }

    } catch (err: any) {
      console.error('Google login error:', err);
      const message = err.response?.data?.message || err.dashboard_response?.data?.message || "Google login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFailure = (error: any) => {
    console.error("Google Login Failed:", error);
    toast.error("Google login failed. Please try again.");
  };

  return { handleGoogleLogin, handleFailure, loading };
};