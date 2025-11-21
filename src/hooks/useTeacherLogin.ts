"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDashboardStore } from "./useDashboardStore";
import { useApplyJob } from "./useApplyJob";
import { getDjangoAuthUrl } from "@/lib/utils";
import { AUTH_COOKIE, STORAGE_KEY } from "@/lib/constants";
import { processRedirectFlow, clearRedirectFlow } from "@/lib/redirectFlows";

export const useTeacherLogin = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { set_dashboard_data } = useDashboardStore();
  const { apply_job } = useApplyJob();

  const login = async (e: React.FormEvent, emailOrPhone: string, password: string) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const apiUrl = getDjangoAuthUrl();
      const response = await axios.post(`${apiUrl}/auth/tutor/login/`, {
        email: emailOrPhone,
        password: password
      });

      const { data } = response;
      
      // Set JWT token in cookies
      Cookies.set(AUTH_COOKIE.JWT_TOKEN, data.jwt_token, { expires: 7 });
      if (data.refresh) {
        Cookies.set(AUTH_COOKIE.REFRESH_TOKEN, data.refresh, { expires: 7 });
      }
      
      toast.success(data.message || "Login successful!");

      // Store user data in localStorage
      if (typeof window !== 'undefined' && data.tutor) {
        localStorage.setItem(STORAGE_KEY.MODEL, "Tutor");
        if (data.tutor.email) {
          localStorage.setItem(STORAGE_KEY.EMAIL, data.tutor.email);
        }
        if (data.tutor.name) {
          localStorage.setItem(STORAGE_KEY.NAME, data.tutor.name);
        }
      }

      // Store in dashboard state
      if (data.tutor) {
        set_dashboard_data(data.tutor, "teacher");
      }

      console.log('🔄 useTeacherLogin: Processing redirect flow...');
      // Process any pending redirect flow (e.g., job application)
      const redirectUrl = await processRedirectFlow(apply_job);
      console.log('🎯 useTeacherLogin: Redirecting to:', redirectUrl);
      router.push(redirectUrl);

    } catch (err: any) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};