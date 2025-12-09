"use client";

import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { getDjangoAuthUrl } from "@/lib/utils";
import { AUTH_COOKIE } from "@/lib/constants";

export interface AssessmentPayload {
  question1_conservation: {
    rt_band: number;         // Reaction Time Band (0, 1, 2)
    h_band: number;          // Hover Time Band (0, 1, 2) 
    ac: number;              // Answer Change Count (0, 1, 2+)
    correctness: boolean;    // Is answer correct
  };
  question2_classification: {
    corr_band: number;       // Corrections Band (0, 1, 2)
    idle_band: number;       // Idle Time Band (0, 1, 2)
    t_band: number;          // Time Band (0, 1, 2)
  };
  question3_seriation: {
    s_band: number;          // Swaps Band (0, 1, 2)
    m_band: number;          // Misplacement Band (0, 1, 2)
    tp_band: number;         // Time to First Correct Band (0, 1, 2)
    t_band: number;          // Total Time Band (0, 1, 2)
  };
  question4_reversibility: {
    rt_band: number;         // Reaction Time Band (0, 1, 2)
    h_band: number;          // Hover Time Band (0, 1, 2)
    ac: number;              // Answer Change Count (0, 1, 2+)
    correctness: boolean;    // Is answer correct
  };
  question5_hypothetical: {
    rt_band: number;         // Reaction Time Band (0, 1, 2)
    h_band: number;          // Hover Time Band (0, 1, 2)
    ac: number;              // Answer Change Count (0, 1, 2+)
  };
}

export interface CognitiveParameter {
  raw_score: number;        // 0-10 from formula calculation
  band: string;            // "B1", "B2", "B3", "B4", "B5"
  score_range: string;     // "0–20", "21–40", etc.
  label: string;           // "Very Low", "Emerging", "Developing", "Proficient", "Advanced"
  interpretation: string;   // "Needs intensive scaffolding...", etc.
  final_score: number;     // 10, 30, 50, 70, or 90
}

export interface AssessmentResponse {
  confidence: CognitiveParameter;
  working_memory: CognitiveParameter;
  anxiety: CognitiveParameter;
  precision: CognitiveParameter;
  error_correction_ability: CognitiveParameter;
  impulsivity: CognitiveParameter;
  working_memory_load_handling: CognitiveParameter;
  processing_speed: CognitiveParameter;
  exploratory_nature: CognitiveParameter;
  final_summary: string;   // Paragraph for direct rendering
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