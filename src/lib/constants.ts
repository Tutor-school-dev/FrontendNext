/**
 * Authentication Constants for Django API Migration
 */

export const USER_TYPE = {
  TUTOR: 'tutor',
  LEARNER: 'learner',
} as const;

export const USER_TYPE_DISPLAY = {
  TUTOR: 'Tutor',
  LEARNER: 'Learner',
} as const;

export const OTP_USE_CASE = {
  PHONE_VERIFICATION: 'PHONE_VERIFICATION',
  LOGIN: 'LOGIN',
  RESET_PASSWORD: 'RESET_PASSWORD',
} as const;

export const AUTH_COOKIE = {
  JWT_TOKEN: 'jwt_Token',
  REFRESH_TOKEN: 'refresh_token',
  ACCESS_HASH: 'access_hash',
} as const;

export const STORAGE_KEY = {
  MODEL: 'model',
  EMAIL: 'email',
  NAME: 'name',
  PHONE: 'Phone',
} as const;

/**
 * Map old user type terminology to new Django API terminology
 */
export function mapUserTypeToAPI(model: string): 'tutor' | 'learner' {
  const normalized = model.toLowerCase();
  if (normalized === 'teacher' || normalized === 'tutor') {
    return USER_TYPE.TUTOR;
  }
  if (normalized === 'parent' || normalized === 'learner') {
    return USER_TYPE.LEARNER;
  }
  // Default fallback
  return USER_TYPE.TUTOR;
}

/**
 * Get display name for user type
 */
export function getUserTypeDisplay(userType: 'tutor' | 'learner'): string {
  return userType === USER_TYPE.TUTOR ? USER_TYPE_DISPLAY.TUTOR : USER_TYPE_DISPLAY.LEARNER;
}
