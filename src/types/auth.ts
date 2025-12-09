/**
 * TypeScript types for Django Authentication API
 */

export type UserType = 'tutor' | 'learner';
export type OTPUseCase = 'PHONE_VERIFICATION' | 'LOGIN' | 'RESET_PASSWORD';

// OTP Request API
export interface OTPRequestPayload {
  phone_number: string;
  user_type?: UserType;
  use_for?: OTPUseCase;
}

export interface OTPRequestResponse {
  message: string;
  expires_at: string;
  phone_number: string;
  otp: string;
}

// OTP Verify API
export interface OTPVerifyPayload {
  phone_number: string;
  otp: string;
  user_type?: UserType;
  use_for?: OTPUseCase;
}

export interface OTPVerifyNewUserResponse {
  message: string;
  access_hash: string;
  user_type: UserType;
}

export interface OTPVerifyExistingUserResponse {
  jwt_token: string;
  refresh: string;
  user_type: UserType;
  user: any; // User structure depends on user_type (teacher or parent fields)
  go_to_dashboard: boolean;
  go_to_quiz?: boolean;
}

export type OTPVerifyResponse = OTPVerifyNewUserResponse | OTPVerifyExistingUserResponse;

// Google Auth API
export interface GoogleAuthPayload {
  id_token: string;
  user_type: UserType;
}

export interface GoogleAuthNewUserResponse {
  message: string;
  access_hash: string;
  user_type: UserType;
}

export interface GoogleAuthExistingUserResponse {
  message: string;
  jwt_token: string;
  refresh: string;
  user_type: UserType;
  user: any; // User structure depends on user_type
  go_to_dashboard: boolean;
  model: string;
}

export type GoogleAuthResponse = GoogleAuthNewUserResponse | GoogleAuthExistingUserResponse;

// Type guards
export function isNewUserResponse(
  response: OTPVerifyResponse | GoogleAuthResponse
): response is OTPVerifyNewUserResponse | GoogleAuthNewUserResponse {
  return 'access_hash' in response;
}

export function isExistingUserResponse(
  response: OTPVerifyResponse | GoogleAuthResponse
): response is OTPVerifyExistingUserResponse | GoogleAuthExistingUserResponse {
  return 'jwt_token' in response;
}
