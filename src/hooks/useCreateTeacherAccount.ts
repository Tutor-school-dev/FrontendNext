"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getDjangoAuthUrl } from "@/lib/utils";
import { AUTH_COOKIE, STORAGE_KEY, getUserTypeDisplay, USER_TYPE } from "@/lib/constants";

export const useCreateTeacherAccount = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const apiUrl = getDjangoAuthUrl();
      const access_hash = Cookies.get(AUTH_COOKIE.ACCESS_HASH);
      
      if (!access_hash) {
        toast.error("Session expired. Please try again.");
        router.push("/auth?model=teacher");
        return;
      }

      const response = await axios.post(`${apiUrl}/tutor/create-account/`, { 
        ...values, 
        access_hash: access_hash 
      });
      
      Cookies.set(AUTH_COOKIE.JWT_TOKEN, response.data.jwt_token, { expires: 7 });
      Cookies.remove(AUTH_COOKIE.ACCESS_HASH); // Remove access hash after successful account creation
      
      toast.success('Tutor account created successfully');
      
      // Store user data
      if (typeof window !== 'undefined') {
        const displayModel = getUserTypeDisplay(USER_TYPE.TUTOR);
        localStorage.setItem(STORAGE_KEY.MODEL, displayModel);
        localStorage.setItem(STORAGE_KEY.EMAIL, values.email);
        localStorage.setItem(STORAGE_KEY.NAME, values.name);
      }
      
      router.push('/teacher-profile');
    } catch (err: any) {
      console.error("Create teacher account error:", err);
      const message = err.response?.data?.message || 'Something went wrong, Please try again!';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { onSubmit, loading };
};