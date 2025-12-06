"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getDjangoAuthUrl } from "@/lib/utils";
import { STORAGE_KEY } from "@/lib/constants";

export interface TeacherDetailsPayload {
  // Basic info
  degree: string;
  class_field: string; // Changed to string to accept education level slugs
  university: string;
  current_status: string;
  teaching_mode: string;
  referral: string;
  // Location info
  area: string;
  latitude: number;
  longitude: number;
  pincode: string;
  state: string;
}

export const useCreateTeacherDetails = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createTeacherDetails = async (payload: TeacherDetailsPayload) => {
    setLoading(true);
    try {
      const authToken = Cookies.get("jwt_Token");
      
      if (!authToken) {
        toast.error("Authentication required. Please login again.");
        router.push("/auth?model=teacher");
        return;
      }

      const response = await axios.post(
        `${getDjangoAuthUrl()}/tutor/add-details/`,
        payload,
        { 
          headers: { 
            authorization: `bearer ${authToken}` 
          } 
        }
      );
      
      toast.success(response.data.message || "Details saved successfully");
      
      // Store/update user data in localStorage if returned by API
      if (response.data.tutor && typeof window !== 'undefined') {
        const tutor = response.data.tutor;
        
        // Update localStorage with the complete tutor data
        localStorage.setItem(STORAGE_KEY.MODEL, "Tutor");
        
        if (tutor.name) {
          localStorage.setItem(STORAGE_KEY.NAME, tutor.name);
        }
        
        if (tutor.email) {
          localStorage.setItem(STORAGE_KEY.EMAIL, tutor.email);
        }
        
        if (tutor.p_contact) {
          localStorage.setItem("Phone", tutor.p_contact);
        }
      }
      
      // Navigate to dashboard after successful submission
      router.push('/dashboard/teacher');
      
      return response.data;
    } catch (err: any) {
      console.error("Create teacher details error:", err);
      const message = err.response?.data?.message || 'Something went wrong, Please try again!';
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createTeacherDetails, loading };
};
