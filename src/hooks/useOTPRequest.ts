"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getDjangoAuthUrl } from "@/lib/utils";
import { mapUserTypeToAPI, OTP_USE_CASE } from "@/lib/constants";
import type { OTPRequestPayload, OTPRequestResponse } from "@/types/auth";

export const useOTPRequest = () => {
  const [loading, setLoading] = useState(false);

  const requestOTP = async (
    phoneNumber: string, 
    userType: 'teacher' | 'parent',
    isSignup: boolean = false
  ) => {
    setLoading(true);
    try {
      const apiUrl = getDjangoAuthUrl();
      const endpoint = '/auth/otp/request/';
      
      // Map old terminology to new API format
      const apiUserType = mapUserTypeToAPI(userType);
      
      const payload: OTPRequestPayload = {
        phone_number: phoneNumber,
        user_type: apiUserType,
        use_for: isSignup ? OTP_USE_CASE.PHONE_VERIFICATION : OTP_USE_CASE.LOGIN
      };

      const response = await axios.post<OTPRequestResponse>(
        `${apiUrl}${endpoint}`, 
        payload
      );

      toast.success(response.data.message || "OTP sent successfully!");
      
      // Log OTP for development
      if (process.env.NODE_ENV !== 'production' && response.data.otp) {
        console.log(`OTP for testing: ${response.data.otp}`);
        console.log(`Expires at: ${response.data.expires_at}`);
      }
      
      return true;
    } catch (err: any) {
      console.error('OTP request error:', err);
      const message = err.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { requestOTP, loading };
};