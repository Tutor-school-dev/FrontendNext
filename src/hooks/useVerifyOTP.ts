"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getDjangoAuthUrl } from "@/lib/utils";
import { mapUserTypeToAPI, getUserTypeDisplay, OTP_USE_CASE, AUTH_COOKIE, STORAGE_KEY } from "@/lib/constants";
import type { OTPVerifyPayload, OTPVerifyResponse } from "@/types/auth";
import { isNewUserResponse } from "@/types/auth";

export const useVerifyOTP = () => {
  const [VerifyOTPLoading, setVerifyOTPLoading] = useState(false);
  const router = useRouter();

  const VerifyOTP = async (
    setOpen: (open: boolean) => void, 
    phoneNumber: string, 
    otp: string, 
    model: string
  ) => {
    try {
      setVerifyOTPLoading(true);
      const apiUrl = getDjangoAuthUrl();
      const endpoint = '/auth/otp/verify/';
      
      // Map old model to new user_type
      const apiUserType = mapUserTypeToAPI(model);
      
      const payload: OTPVerifyPayload = {
        phone_number: phoneNumber,
        otp: otp,
        user_type: apiUserType,
        use_for: OTP_USE_CASE.PHONE_VERIFICATION
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
      
      // Only handle new user flow (for create account)
      if (isNewUserResponse(data)) {
        Cookies.set(AUTH_COOKIE.ACCESS_HASH, data.access_hash, { expires: 1 });
        const displayModel = getUserTypeDisplay(data.user_type);
        localStorage.setItem(STORAGE_KEY.MODEL, displayModel);
        
        setOpen(false);
        router.push(`/create-account?model=${model}&phone=${phoneNumber}`);
      } else {
        toast.error('Account already exists. Please login instead.');
        setOpen(false);
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
      
      if (message === 'Invalid otp') return;
      setOpen(false);
    } finally {
      setVerifyOTPLoading(false);
    }
  };

  return { VerifyOTP, VerifyOTPLoading };
};