import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the API URL based on the environment
 * If NEXT_PUBLIC_NODE_ENV is 'staging', use the staging backend
 * Otherwise use the production/default backend
 */
export function getApiUrl(): string {
  const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV || 'production';
  
  console.log('Environment check:', {
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    NODE_ENV: process.env.NODE_ENV,
    resolvedEnv: nodeEnv,
    isStaging: nodeEnv === 'staging'
  });
  
  if (nodeEnv === 'staging') {
    console.log('Using staging API:', 'https://stagingapi.tutorschool.in');
    console.warn('CORS Note: Make sure the staging backend at https://stagingapi.tutorschool.in allows origin: http://localhost:3000');
    return 'https://stagingapi.tutorschool.in';
  }
  
  // Default to production API
  const prodUrl = process.env.NEXT_PUBLIC_GO_APP_URL || 'https://api.tutorschool.in';
  console.log('Using production API:', prodUrl);
  return prodUrl;
}

/**
 * Get the main app URL based on environment
 */
export function getAppUrl(): string {
  const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV || 'production';
  
  if (nodeEnv === 'staging') {
    return 'https://stagingapi.tutorschool.in';
  }
  
  // Default to production API
  return process.env.NEXT_PUBLIC_APP_URL || 'https://api.tutorschool.in';
}

/**
 * Get the Django API base URL
 * Used for new Django endpoints (auth, tutor, learner, etc.)
 */
export function getDjangoAuthUrl(): string {
  const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV || 'production';
  
  if (nodeEnv === 'staging') {
    console.log('Using Django API (staging):', 'https://stagingapi.tutorschool.in/api');
    return 'https://stagingapi.tutorschool.in/api';
  }
  
  // Default to production Django API
  const prodUrl = process.env.NEXT_PUBLIC_DJANGO_AUTH_URL || 'https://api.tutorschool.in/api';
  console.log('Using Django API (production):', prodUrl);
  return prodUrl;
}
