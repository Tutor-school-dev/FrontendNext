import Cookies from "js-cookie";
import { AUTH_COOKIE, STORAGE_KEY } from "./constants";

/**
 * Check if user is authenticated by verifying JWT token presence
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = Cookies.get(AUTH_COOKIE.JWT_TOKEN);
  return !!token;
}

/**
 * Get current user model from localStorage
 */
export function getUserModel(): string | null {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem(STORAGE_KEY.MODEL);
}

/**
 * Get current user info from localStorage
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  const model = localStorage.getItem(STORAGE_KEY.MODEL);
  const email = localStorage.getItem(STORAGE_KEY.EMAIL);
  const name = localStorage.getItem(STORAGE_KEY.NAME);
  
  if (!model) return null;
  
  return { model, email, name };
}

/**
 * Check if user is authenticated as a tutor (teacher)
 * Handles both old (Teacher) and new (Tutor) model values
 */
export function isTeacherAuthenticated(): boolean {
  if (!isAuthenticated()) return false;
  
  const model = getUserModel()?.toLowerCase();
  return model === "teacher" || model === "tutor";
}

/**
 * Check if user is authenticated as a learner (parent)
 * Handles both old (Parent) and new (Learner) model values
 */
export function isParentAuthenticated(): boolean {
  if (!isAuthenticated()) return false;
  
  const model = getUserModel()?.toLowerCase();
  return model === "parent" || model === "learner";
}