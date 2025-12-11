import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { getDjangoAuthUrl } from "@/lib/utils";
import { AUTH_COOKIE } from "@/lib/constants";

interface TutorMatch {
  tutor: {
    id: string;
    name: string;
    email: string;
    primary_contact: string;
    secondary_contact?: string;
    state: string;
    area: string;
    pincode: string;
    latitude: string;
    longitude: string;
    profile_pic?: string;
    introduction?: string;
    teaching_desc?: string;
    lesson_price: string;
    teaching_mode: "ONLINE" | "OFFLINE" | "BOTH";
    subscription_validity?: string;
    basic_done: boolean;
    location_done: boolean;
    later_onboarding_done: boolean;
    class_level?: string;
    current_status?: string;
    degree?: string;
    university?: string;
    referral?: string;
    created_at: string;
    updated_at: string;
    subjects: string;
  };
  match_details: {
    compatibility_score: number;
    reasoning: string;
    subject_explanation: string;
  };
}

interface AIMatchResponse {
  success: boolean;
  matches: TutorMatch[];
  processing_time_ms: number;
}

export default function useAITutorMatch() {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<TutorMatch[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAIMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get(AUTH_COOKIE.JWT_TOKEN);
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.get<AIMatchResponse>(
        `${getDjangoAuthUrl()}/learner/match-tutors/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setMatches(response.data.matches);
      } else {
        throw new Error("Failed to fetch matches");
      }
    } catch (err: any) {
      console.error("AI Match Error:", err);
      setError("You have to get our subscription to use this feature");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    matches,
    error,
    fetchAIMatches,
  };
}