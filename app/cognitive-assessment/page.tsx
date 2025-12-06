"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { CognitiveAssessmentFlow } from '@/components/CognitiveAssessmentFlow';
import { AUTH_COOKIE } from '@/lib/constants';

export default function CognitiveAssessmentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthAndPermissions = () => {
      if (typeof window === 'undefined') return;

      const jwtToken = Cookies.get(AUTH_COOKIE.JWT_TOKEN);
      const model = localStorage.getItem('model');

      // Check if user is authenticated
      if (!jwtToken) {
        // Not authenticated - redirect to learner sign in
        router.push('/auth?model=parent');
        return;
      }

      // Check if user is a learner/parent
      if (!model || !['Parent', 'Learner'].includes(model)) {
        // Not a learner - redirect to appropriate dashboard
        const dashboardPath = model?.toLowerCase() === 'teacher' || model?.toLowerCase() === 'tutor' 
          ? '/dashboard/teacher' 
          : '/dashboard/parent';
        router.push(dashboardPath);
        return;
      }

      // User is authenticated learner - allow access to assessment
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuthAndPermissions();
  }, [router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <CognitiveAssessmentFlow />
    </div>
  );
}