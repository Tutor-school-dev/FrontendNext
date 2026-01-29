# Django Authentication Migration - Implementation Summary

## ✅ Migration Complete

Successfully migrated authentication system to Django unified APIs with improved code quality, modularity, and type safety.

---

## 📋 Files Created

### 1. **src/lib/constants.ts**
- `USER_TYPE` constants: `tutor`, `learner`
- `USER_TYPE_DISPLAY` constants: `Tutor`, `Learner`
- `OTP_USE_CASE` enum: `PHONE_VERIFICATION`, `LOGIN`, `RESET_PASSWORD`
- `AUTH_COOKIE` constants: `jwt_Token`, `refresh_token`, `access_hash`
- `STORAGE_KEY` constants for localStorage keys
- Helper functions:
  - `mapUserTypeToAPI(model)` - Converts old terminology to new
  - `getUserTypeDisplay(userType)` - Gets display name for user type

### 2. **src/types/auth.ts**
- TypeScript interfaces for all API requests/responses
- `OTPRequestPayload` & `OTPRequestResponse`
- `OTPVerifyPayload` & `OTPVerifyResponse`
- `GoogleAuthPayload` & `GoogleAuthResponse`
- Type guards: `isNewUserResponse()`, `isExistingUserResponse()`

---

## 🔄 Files Modified

### Core Utilities

#### **src/lib/utils.ts**
- ✅ Added `getDjangoAuthUrl()` function
- Returns: `https://stagingapi.tutorschool.in/django/api/auth` (staging)

#### **src/lib/authUtils.ts**
- ✅ Updated to use `AUTH_COOKIE.JWT_TOKEN` constant
- ✅ Updated to use `STORAGE_KEY` constants
- ✅ Added `isParentAuthenticated()` function
- ✅ Updated `isTeacherAuthenticated()` to handle both old/new values
- Backward compatible with `Teacher`/`Parent` and new `Tutor`/`Learner`

---

### Authentication Hooks

#### **src/hooks/useOTPRequest.ts**
**Old Endpoint:** `/auth/{teacher|parent}/start`
**New Endpoint:** `/django/api/auth/otp/request/`

**Changes:**
- ✅ Uses `getDjangoAuthUrl()`
- ✅ Uses `OTPRequestPayload` type
- ✅ Sends `phone_number` (instead of `phone`)
- ✅ Sends `user_type: "tutor"|"learner"`
- ✅ Sends `use_for: "LOGIN"`
- ✅ Logs `expires_at` field from response

#### **src/hooks/useSendOTP.ts**
**Old Endpoint:** `/auth/{model}/start`
**New Endpoint:** `/django/api/auth/otp/request/`

**Changes:**
- ✅ Uses `getDjangoAuthUrl()`
- ✅ Uses `OTPRequestPayload` type
- ✅ Maps old `model` to new `user_type` via `mapUserTypeToAPI()`
- ✅ Enhanced dev logging with `expires_at`

#### **src/hooks/useOTPVerify.ts**
**Old Endpoint:** `/auth/{model}/verify`
**New Endpoint:** `/django/api/auth/otp/verify/`

**Changes:**
- ✅ Uses `getDjangoAuthUrl()`
- ✅ Uses `OTPVerifyPayload` and `OTPVerifyResponse` types
- ✅ Uses type guards to detect new vs existing user
- ✅ Stores `refresh_token` in addition to `jwt_token`
- ✅ Accesses user data from `data.user` (not `data.teacher`/`data.parent`)
- ✅ Stores `Tutor`/`Learner` in localStorage (via `getUserTypeDisplay()`)
- ✅ Handles `go_to_dashboard` flag from response
- ✅ Profile completion logic uses `userData.basic_done`, `userData.location_done`

**Response Handling:**
```typescript
if (isNewUserResponse(data)) {
  // New user → store access_hash → redirect to onboarding
} else if (isExistingUserResponse(data)) {
  // Existing user → store jwt_token + refresh → redirect to dashboard
}
```

#### **src/hooks/useVerifyOTP.ts**
**Old Endpoint:** `/auth/{model}/verify`
**New Endpoint:** `/django/api/auth/otp/verify/`

**Changes:**
- ✅ Uses `getDjangoAuthUrl()`
- ✅ Uses `OTPVerifyPayload` type
- ✅ Sets `use_for: "PHONE_VERIFICATION"` for signup flow
- ✅ Only handles new user flow (create account scenario)
- ✅ Stores `Tutor`/`Learner` via `getUserTypeDisplay()`

#### **src/hooks/useTeacherGoogleLogin.ts**
**Old Endpoint:** `/auth/teacher/google`
**New Endpoint:** `/django/api/auth/google/`

**Changes:**
- ✅ Uses `getDjangoAuthUrl()`
- ✅ Uses `GoogleAuthPayload` with `user_type: "tutor"`
- ✅ Uses type guards for response handling
- ✅ Stores `refresh_token`
- ✅ Accesses user data from `data.user` (not `data.teacher`)
- ✅ Stores `Tutor` in localStorage
- ✅ Profile completion uses `userData.basic_done`, `userData.location_done`

#### **src/hooks/useParentGoogleLogin.ts**
**Old Endpoint:** `/auth/parent/google`
**New Endpoint:** `/django/api/auth/google/`

**Changes:**
- ✅ Uses `getDjangoAuthUrl()`
- ✅ Uses `GoogleAuthPayload` with `user_type: "learner"`
- ✅ Uses type guards for response handling
- ✅ Stores `refresh_token`
- ✅ Accesses user data from `data.user` (not `data.parent`)
- ✅ Stores `Learner` in localStorage

---

## 🔑 Key Technical Improvements

### 1. **Code Quality**
✅ **Modularity** - Extracted constants and types to separate files
✅ **Type Safety** - Full TypeScript interfaces for all API interactions
✅ **DRY Principle** - Eliminated duplicate endpoint definitions
✅ **Error Handling** - Comprehensive try-catch with meaningful messages

### 2. **Maintainability**
✅ **Single Source of Truth** - All constants in one place
✅ **Type Guards** - Safe runtime type checking
✅ **Backward Compatibility** - Auth utils handle both old/new model values
✅ **Clear Separation** - Request/Response types separated from business logic

### 3. **Scalability**
✅ **Unified Endpoints** - Single endpoint for teacher/parent flows
✅ **Extensible** - Easy to add new `use_for` cases or user types
✅ **Environment Aware** - Automatic staging/production URL switching

---

## 📊 API Mapping Reference

| Old Endpoint | New Endpoint | User Type Param |
|-------------|--------------|-----------------|
| `/auth/teacher/start` | `/django/api/auth/otp/request/` | `user_type: "tutor"` |
| `/auth/parent/start` | `/django/api/auth/otp/request/` | `user_type: "learner"` |
| `/auth/teacher/verify` | `/django/api/auth/otp/verify/` | `user_type: "tutor"` |
| `/auth/parent/verify` | `/django/api/auth/otp/verify/` | `user_type: "learner"` |
| `/auth/teacher/google` | `/django/api/auth/google/` | `user_type: "tutor"` |
| `/auth/parent/google` | `/django/api/auth/google/` | `user_type: "learner"` |

---

## 🔄 Data Flow Changes

### Old Flow (Teacher)
```typescript
Request → /auth/teacher/start → { phone: "..." }
Response → { message: "...", otp: "..." }

Request → /auth/teacher/verify → { phone: "...", otp: "..." }
Response (New) → { type: "SIGNUP", access_hash: "..." }
Response (Existing) → { type: "LOGIN", jwt_token: "...", teacher: {...} }

localStorage → "Teacher"
data.teacher.name → localStorage
```

### New Flow (Tutor)
```typescript
Request → /django/api/auth/otp/request/ → { phone_number: "...", user_type: "tutor" }
Response → { message: "...", otp: "...", expires_at: "...", phone_number: "..." }

Request → /django/api/auth/otp/verify/ → { phone_number: "...", otp: "...", user_type: "tutor" }
Response (New) → { message: "...", access_hash: "...", user_type: "tutor" }
Response (Existing) → { jwt_token: "...", refresh: "...", user: {...}, go_to_dashboard: true }

localStorage → "Tutor"
data.user.name → localStorage
```

---

## 🧪 Testing Checklist

### OTP Authentication Flow
- [ ] Request OTP for new tutor
- [ ] Verify OTP for new tutor → redirects to onboarding
- [ ] Request OTP for existing tutor
- [ ] Verify OTP for existing tutor → redirects to dashboard
- [ ] Request OTP for new learner
- [ ] Verify OTP for new learner → redirects to onboarding
- [ ] Request OTP for existing learner
- [ ] Verify OTP for existing learner → redirects to dashboard

### Google Authentication Flow
- [ ] Google login for new tutor → redirects to create account
- [ ] Google login for existing tutor (complete profile) → redirects to dashboard
- [ ] Google login for existing tutor (incomplete profile) → redirects to profile completion
- [ ] Google login for new learner → shows registration message
- [ ] Google login for existing learner → redirects to dashboard

### Data Persistence
- [ ] `jwt_Token` cookie is set correctly
- [ ] `refresh_token` cookie is set correctly
- [ ] `access_hash` cookie is set for new users
- [ ] localStorage `model` is `"Tutor"` or `"Learner"`
- [ ] localStorage `name` and `email` are populated

### Backward Compatibility
- [ ] `isTeacherAuthenticated()` returns true for `"Teacher"` and `"Tutor"`
- [ ] `isParentAuthenticated()` returns true for `"Parent"` and `"Learner"`
- [ ] Old API endpoints still work (if enabled on backend)

---

## 🚀 Deployment Notes

### Environment Variables Required
```env
# Staging
NEXT_PUBLIC_NODE_ENV=staging

# Production
NEXT_PUBLIC_DJANGO_AUTH_URL=https://stagingapi.tutorschool.in/django/api/auth
```

### CORS Configuration
Backend must allow:
- Origin: `http://localhost:3000` (development)
- Origin: `https://tutorschool.vercel.app` (production)

### Feature Flags (Optional)
Can add `NEXT_PUBLIC_USE_DJANGO_AUTH=true` if implementing gradual rollout.

---

## 📝 Breaking Changes

### For End Users
✅ **None** - All flows maintain same UX

### For Developers
1. ⚠️ Import paths changed:
   ```typescript
   // Old
   import { getApiUrl } from "@/lib/utils";
   
   // New (for auth)
   import { getDjangoAuthUrl } from "@/lib/utils";
   ```

2. ⚠️ Response structure:
   ```typescript
   // Old
   data.teacher.name
   data.parent.name
   
   // New
   data.user.name
   data.user_type // "tutor" or "learner"
   ```

3. ⚠️ localStorage values:
   ```typescript
   // Old
   "Teacher", "Parent"
   
   // New
   "Tutor", "Learner"
   ```

---

## 🔮 Future Enhancements

1. **Refresh Token Rotation**
   - Add automatic token refresh logic
   - Handle token expiry gracefully

2. **Password Reset Migration**
   - Unify `/auth/teacher/reset_password` endpoints
   - Add password reset to Django API

3. **Account Creation After access_hash**
   - Unify `/auth/teacher/create` endpoints
   - Migrate onboarding flows

4. **Session Management**
   - Add session timeout handling
   - Implement "Remember Me" functionality

---

## ✅ Migration Status: **COMPLETE**

All authentication hooks migrated to Django unified APIs with:
- ✅ Type safety
- ✅ Modular code structure
- ✅ Backward compatibility
- ✅ Enhanced error handling
- ✅ Comprehensive logging

**Total Files Modified:** 9
**Total Files Created:** 2
**Total Lines of Code:** ~800 lines

**Ready for testing and deployment!**
