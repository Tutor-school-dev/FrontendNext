import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDashboardStore } from "./useDashboardStore";
import { getDjangoAuthUrl } from "@/lib/utils";
import { USER_TYPE, getUserTypeDisplay, AUTH_COOKIE, STORAGE_KEY } from "@/lib/constants";
import type { GoogleAuthPayload, GoogleAuthResponse } from "@/types/auth";
import { isNewUserResponse, isExistingUserResponse } from "@/types/auth";

export const useParentGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { set_dashboard_data } = useDashboardStore();

  const handleGoogleLogin = async (response: any) => {
    const token = response.credential;
    setLoading(true);

    try {
      const apiUrl = getDjangoAuthUrl();
      const endpoint = '/auth/google/';
      
      const payload: GoogleAuthPayload = {
        id_token: token,
        user_type: USER_TYPE.LEARNER
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
        toast.info("Account creation required. Please complete registration.");
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
          localStorage.setItem(STORAGE_KEY.NAME, userData.name);
        }

        set_dashboard_data(userData, "parent");

        // Navigate to cognitive assessment (will redirect to dashboard if already completed)
        router.push('/cognitive-assessment');
      }

    } catch (err: any) {
      console.error('Google login error:', err);
      const message = err.response?.data?.message || "Google login failed. Please try again.";
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