"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function DashboardPage() {
  const router = useRouter();
  
  useEffect(() => {
    const jwtToken = Cookies.get('jwt_Token');
    const userModel = localStorage.getItem('model');
    
    if (!jwtToken) {
      router.push('/auth');
      return;
    }

    // Route based on user type
    if (userModel === 'Tutor' || userModel === 'Teacher') {
      router.push('/dashboard/teacher');
    } else if (userModel === 'Learner' || userModel === 'Parent') {
      router.push('/dashboard/parent');
    } else {
      // If no model found, redirect to auth to establish user type
      router.push('/auth');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold mb-2">Loading Dashboard</h1>
        <p className="text-gray-600">Redirecting to your personalized dashboard...</p>
      </div>
    </div>
  );
}