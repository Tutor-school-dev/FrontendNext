"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDashboardStore } from "./useDashboardStore";
import { getDjangoAuthUrl } from "@/lib/utils";
import { mapUserTypeToAPI, getUserTypeDisplay, OTP_USE_CASE, AUTH_COOKIE, STORAGE_KEY } from "@/lib/constants";
import type { OTPVerifyPayload, OTPVerifyResponse } from "@/types/auth";
import { isNewUserResponse, isExistingUserResponse } from "@/types/auth";

export const useOTPVerify = () => {
  const [loading, setLoading] = useState(false);
  const [VerifyOTPLoading, setVerifyOTPLoading] = useState(false);
  const router = useRouter();
  const { set_dashboard_data } = useDashboardStore();

  // Simple method for create account flow
  const VerifyOTP = async (setOpen: (open: boolean) => void, phoneNumber: string, otp: string, model: string) => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setVerifyOTPLoading(true);
      const apiUrl = getDjangoAuthUrl();
      const endpoint = '/otp/verify/';
      
      // Map old model to new user_type
      const apiUserType = mapUserTypeToAPI(model);
      
      const payload: OTPVerifyPayload = {
        phone_number: phoneNumber,
        otp: otp,
        user_type: apiUserType,
        use_for: OTP_USE_CASE.LOGIN
      };

      const response = await axios.post<OTPVerifyResponse>(
        `${apiUrl}${endpoint}`,
        payload
      );
      
      const { data } = response;
      
      // Handle success message
      if ('message' in data) {
        toast.success(data.message);
      } else {
        toast.success("Verification successful!");
      }
      
      // Store phone number in localStorage
      localStorage.setItem(STORAGE_KEY.PHONE, phoneNumber);
      
      // Handle new user vs existing user based on response
      if (isNewUserResponse(data)) {
        // New user - store access_hash and redirect to onboarding
        Cookies.set(AUTH_COOKIE.ACCESS_HASH, data.access_hash, { expires: 1 });
        const displayModel = getUserTypeDisplay(data.user_type);
        localStorage.setItem(STORAGE_KEY.MODEL, displayModel);
        router.push(`/onboarding?model=${model}`);
      } else if (isExistingUserResponse(data)) {
        // Existing user - store tokens and redirect to dashboard
        Cookies.set(AUTH_COOKIE.JWT_TOKEN, data.jwt_token, { expires: 7 });
        Cookies.set(AUTH_COOKIE.REFRESH_TOKEN, data.refresh, { expires: 7 });
        
        const displayModel = getUserTypeDisplay(data.user_type);
        localStorage.setItem(STORAGE_KEY.MODEL, displayModel);
        
        // Store user data based on user_type
        const userData = data.user;
        if (userData.name) localStorage.setItem(STORAGE_KEY.NAME, userData.name);
        if (userData.email) localStorage.setItem(STORAGE_KEY.EMAIL, userData.email);
        
        set_dashboard_data(userData, data.user_type === 'tutor' ? 'teacher' : 'parent');
        
        router.push(data.user_type === 'tutor' ? '/dashboard/teacher' : '/dashboard/parent');
      }
      
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      const message = err.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(message);
    } finally {
      setVerifyOTPLoading(false);
    }
  };

  const verifyOTP = async (
    phoneNumber: string, 
    otp: string, 
    userType: 'teacher' | 'parent',
    isSignup: boolean = false,
    signupData?: any
  ) => {
    setLoading(true);
    try {
      const apiUrl = getDjangoAuthUrl();
      const endpoint = '/otp/verify/';
      
      // Map old userType to new API format
      const apiUserType = mapUserTypeToAPI(userType);
      
      const payload: OTPVerifyPayload = {
        phone_number: phoneNumber,
        otp: otp,
        user_type: apiUserType,
        use_for: isSignup ? OTP_USE_CASE.PHONE_VERIFICATION : OTP_USE_CASE.LOGIN
      };

      const response = await axios.post<OTPVerifyResponse>(`${apiUrl}${endpoint}`, payload);
      const { data } = response;

      // Handle success message
      if ('message' in data) {
        toast.success(data.message);
      } else {
        toast.success("Verification successful!");
      }

      // Handle new user registration flow (if access_hash is provided)
      if (isNewUserResponse(data)) {
        Cookies.set(AUTH_COOKIE.ACCESS_HASH, data.access_hash, { expires: 1 });
        const displayModel = getUserTypeDisplay(data.user_type);
        localStorage.setItem(STORAGE_KEY.MODEL, displayModel);
        const email = signupData?.email || '';
        router.push(`/create-account?model=${userType}&email=${email}`);
        return { success: true, needsRegistration: true };
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
          if (userData.email) {
            localStorage.setItem(STORAGE_KEY.EMAIL, userData.email);
          }
        }

        set_dashboard_data(userData, data.user_type === 'tutor' ? 'teacher' : 'parent');

        // Navigate based on user type and profile completion
        if (data.user_type === 'tutor') {
          // Check profile completion status for tutors
          if (data.go_to_dashboard) {
            router.push('/dashboard/teacher');
            return { success: true, redirected: true };
          }

          const stepNames = {
            basic_done: userData.basic_done,
            location_done: userData.location_done
          };

          for (const [key, value] of Object.entries(stepNames)) {
            if (!value) {
              router.push(`/teacher-profile?step=${key}`);
              return { success: true, redirected: true };
            }
          }
        } else {
          // Learner/Parent dashboard
          router.push('/dashboard/parent');
          return { success: true, redirected: true };
        }

        return { success: true, data: userData };
      }

      return { success: false, error: 'Unknown response format' };
    } catch (err: any) {
      console.error('OTP verification error:', err);
      const message = err.response?.data?.message || "OTP verification failed. Please try again.";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { 
    verifyOTP, 
    loading, 
    VerifyOTP, 
    VerifyOTPLoading 
  };
};
