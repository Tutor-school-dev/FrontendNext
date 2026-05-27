import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDashboardStore } from "./useDashboardStore";
import { getApiUrl } from "@/lib/utils";
import { AUTH_COOKIE, STORAGE_KEY } from "@/lib/constants";

export const useParentLogin = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { set_dashboard_data } = useDashboardStore();

  const login = async (e: React.FormEvent, phoneNumber: string, password: string) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const apiUrl = getApiUrl();
      const response = await axios.post(`${apiUrl}/auth/parent/login`, {
        phone_number: phoneNumber,
        password: password
      });

      const { data } = response;
      
      // Set JWT token in cookies
      Cookies.set(AUTH_COOKIE.JWT_TOKEN, data.jwt_token, { expires: 7 });
      
      toast.success(data.message || "Login successful!");

      // Store user data in localStorage and store
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY.MODEL, "Learner");
        localStorage.setItem(STORAGE_KEY.EMAIL, data.parent.email);
        localStorage.setItem(STORAGE_KEY.NAME, data.parent.name);
      }

      set_dashboard_data(data.parent, "parent");

      // Navigate through info collection before cognitive assessment
      router.push('/onboarding?model=parent');

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