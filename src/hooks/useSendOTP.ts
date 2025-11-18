"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getDjangoAuthUrl } from "@/lib/utils";
import { mapUserTypeToAPI, OTP_USE_CASE } from "@/lib/constants";
import type { OTPRequestPayload, OTPRequestResponse } from "@/types/auth";

export const useSendOTP = () => {
  const [loading, setLoading] = useState(false);

  const SendOTP = async (phoneNumber: string, setOpen: (open: boolean) => void, model: string) => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      toast.error("Please enter valid Phone Number or Register via Google");
      return;
    }

    try {
      setLoading(true);
      const apiUrl = getDjangoAuthUrl();
      const endpoint = '/otp/request/';
      
      // Map old model terminology to new API format
      const apiUserType = mapUserTypeToAPI(model);
      
      const payload: OTPRequestPayload = {
        phone_number: phoneNumber,
        user_type: apiUserType,
        use_for: OTP_USE_CASE.LOGIN
      };

      const response = await axios.post<OTPRequestResponse>(
        `${apiUrl}${endpoint}`,
        payload
      );
      
      setOpen(true);
      toast.success(response.data.message);
      
      // Log OTP for development with enhanced visibility
      if (process.env.NODE_ENV !== 'production') {
        const otp = response.data.otp;
        console.log(`🔑 ${model.toUpperCase()} OTP for phone ${phoneNumber}: ${otp}`);
        console.log(`%c OTP: ${otp} `, 'background: #4CAF50; color: white; font-size: 16px; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
        console.log(`Expires at: ${response.data.expires_at}`);
        
        // Also show OTP in a toast for development
        setTimeout(() => {
          toast.info(`Development OTP: ${otp}`, {
            duration: 10000,
          });
        }, 1000);
      }
    } catch (err: any) {
      console.error('Send OTP error:', err);
      const message = err.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(message);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return { SendOTP, loading };
};