"use client";

import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { getDjangoAuthUrl } from "@/lib/utils";
import { AUTH_COOKIE } from "@/lib/constants";

export interface AssessmentPayload {
  s2: {
    choice: string;
    confidence: number | null;
    reaction_time_ms: number | null;
    switch_count: number;
  };
  s3: {
    rule: string | null;
    corrections: number;
    time_ms: number | null;
  };
  s4: {
    is_correct: boolean | null;
    swap_count: number;
  };
  s5: {
    answer: string | null;
    explanation: string;
  };
  s6: {
    choice: string | null;
    reaction_time_ms: number | null;
  };
}

export interface AssessmentResponse {
  conservation_score: number;
  classification_score: number;
  seriation_score: number;
  reversibility_score: number;
  hypothetical_thinking_score: number;
  piaget_construct_score: number;
  piaget_stage: string;
  summary_points: string[];
}

export const useCognitiveAssessment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  const submitAssessment = async (payload: AssessmentPayload): Promise<AssessmentResponse | null> => {
    setLoading(true);
    setError(null);
    setAlreadyCompleted(false);

    try {
      const apiUrl = getDjangoAuthUrl();
      const token = Cookies.get(AUTH_COOKIE.JWT_TOKEN);
      
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.post(
        `${apiUrl}/learner/cognitive-assessment/`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data as AssessmentResponse;
    } catch (err: any) {
      console.error("Cognitive assessment error:", err);
      
      if (err.response?.status === 400 && err.response?.data?.detail === "Assessment already completed.") {
        setAlreadyCompleted(true);
        return null;
      }
      
      const message = err.response?.data?.message || err.response?.data?.detail || 'Failed to submit assessment';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitAssessment,
    loading,
    error,
    alreadyCompleted,
  };
};