"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { validateAndCleanAuth } from "@/lib/authUtils";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectAuthenticatedUsers?: boolean;
}

export default function AuthGuard({ children, redirectAuthenticatedUsers = false }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAuth = () => {
      // First, validate and clean any stale auth data
      validateAndCleanAuth();
      
      const jwtToken = Cookies.get("jwt_Token");
      const model = localStorage.getItem("model");
      
      console.log("AuthGuard check:", { jwtToken: !!jwtToken, model, redirectAuthenticatedUsers });
      
      // Only redirect if user has both valid JWT token and model
      if (jwtToken && model && redirectAuthenticatedUsers) {
        // User is logged in and we're on an auth page, redirect to dashboard
        const dashboardPath = model.toLowerCase() === "parent" || model.toLowerCase() === "learner" 
          ? "/dashboard/parent" 
          : "/dashboard/teacher";
        console.log("AuthGuard redirecting to:", dashboardPath);
        router.push(dashboardPath);
      }
    };

    checkAuth();
  }, [router, redirectAuthenticatedUsers]);

  return <>{children}</>;
}