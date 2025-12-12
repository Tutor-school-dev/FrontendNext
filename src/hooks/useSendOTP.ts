"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getDjangoAuthUrl } from "@/lib/utils";
import { mapUserTypeToAPI, OTP_USE_CASE } from "@/lib/constants";
import type { OTPRequestPayload, OTPRequestResponse } from "@/types/auth";

export const useSendOTP = () => {
  const [loading, setLoading] = useState(false);

  const SendOTP = async (
    phoneNumber: string, 
    setOpen: (open: boolean) => void, 
    model: string,
    isSignup: boolean = false,
    onOTPReceived?: (otp: string) => void
  ) => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      toast.error("Please enter valid Phone Number or Register via Google");
      return;
    }

    try {
      setLoading(true);
      const apiUrl = getDjangoAuthUrl();
      const endpoint = '/auth/otp/request/';
      
      // Map old model terminology to new API format
      const apiUserType = mapUserTypeToAPI(model);
      
      const payload: OTPRequestPayload = {
        phone_number: phoneNumber,
        user_type: apiUserType,
        use_for: isSignup ? OTP_USE_CASE.PHONE_VERIFICATION : OTP_USE_CASE.LOGIN
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
        
        // Auto-fill OTP in staging environment
        const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV;
        const apiUrl = getDjangoAuthUrl();
        const isStaging = nodeEnv === 'staging' || apiUrl.includes('stagingapi.tutorschool.in');
        
        console.log('🔍 OTP Auto-fill Debug:', {
          nodeEnv,
          apiUrl,
          isStaging,
          hasOTPCallback: !!onOTPReceived,
          model
        });
        
        if (isStaging && onOTPReceived) {
          console.log('✅ Triggering OTP auto-fill for staging...');
          setTimeout(() => {
            onOTPReceived(otp);
            toast.success('OTP auto-filled for staging!', { duration: 3000 });
          }, 1500);
        } else if (!isStaging) {
          console.log('❌ Not staging environment, skipping auto-fill');
        } else if (!onOTPReceived) {
          console.log('❌ No OTP callback provided, skipping auto-fill');
        }
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