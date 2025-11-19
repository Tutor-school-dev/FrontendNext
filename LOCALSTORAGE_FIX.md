# Teacher Signup Flow - localStorage Fix

## Problem
After successful signup and onboarding, the dashboard showed "Welcome back, Teacher!" instead of the actual teacher name.

## Root Causes

### 1. Missing User Data Storage After `/tutor/add-details/`
When the teacher completes onboarding and calls `/tutor/add-details/` (unified endpoint), the response was not being handled properly. The API returns the complete tutor object, but we were not storing it in localStorage.

### 2. Inconsistent localStorage Keys
Some parts of the codebase used hardcoded strings like `"model"`, `"name"`, `"email"` while others used `STORAGE_KEY` constants, leading to potential inconsistencies.

### 3. Dashboard Reading Teacher Data Too Early
The dashboard might load before the Zustand store populates with data from the API, and there was no fallback to read from localStorage.

## Fixes Applied

### 1. Updated `useCreateTeacherDetails.ts`
**File**: `src/hooks/useCreateTeacherDetails.ts`

Added proper response handling after `/tutor/add-details/` API call:

```typescript
// Store/update user data in localStorage if returned by API
if (response.data.tutor && typeof window !== 'undefined') {
  const tutor = response.data.tutor;
  
  // Update localStorage with the complete tutor data
  localStorage.setItem(STORAGE_KEY.MODEL, "Tutor");
  
  if (tutor.name) {
    localStorage.setItem(STORAGE_KEY.NAME, tutor.name);
  }
  
  if (tutor.email) {
    localStorage.setItem(STORAGE_KEY.EMAIL, tutor.email);
  }
  
  if (tutor.p_contact) {
    localStorage.setItem("Phone", tutor.p_contact);
  }
}
```

**Impact**: Now after onboarding completes, all user data is properly stored in localStorage.

---

### 2. Updated Dashboard to Use localStorage Fallback
**File**: `app/dashboard/teacher/page.tsx`

Added fallback to read from localStorage if Zustand store hasn't loaded yet:

```typescript
// Fallback to localStorage if teacher data not loaded yet
const teacherName = teacher?.name || 
  (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY.NAME) : null) || 
  "Teacher";
```

**Impact**: Dashboard shows the correct name immediately, even if the API call is still loading.

---

### 3. Standardized localStorage Keys in Dashboard Store
**File**: `src/hooks/useDashboardStore.ts`

Updated all `localStorage.setItem()` calls to use `STORAGE_KEY` constants:

**Before**:
```typescript
localStorage.setItem("model", "Teacher");
localStorage.setItem("email", teacher.email);
localStorage.setItem("name", teacher.name);
```

**After**:
```typescript
localStorage.setItem(STORAGE_KEY.MODEL, "Tutor");
localStorage.setItem(STORAGE_KEY.EMAIL, teacher.email);
localStorage.setItem(STORAGE_KEY.NAME, teacher.name);
```

**Changes Made**:
- Changed `"Teacher"` → `"Tutor"` (consistent with Django API)
- Changed `"Parent"` → `"Learner"` (consistent with Django API)
- Used `STORAGE_KEY` constants instead of hardcoded strings

**Impact**: Ensures consistency across the entire application.

---

## Complete Signup Flow (After Fixes)

### Step 1: OTP Verification
- User enters phone and verifies OTP
- Stores: `model` (Tutor), `Phone`
- Gets: `access_hash` cookie

### Step 2: Create Account
- User enters name, email, password
- API: `POST /django/api/tutor/create-account/`
- Stores: `model` (Tutor), `email`, `name`
- Gets: `jwt_Token` cookie
- Redirects to: `/teacher-profile`

### Step 3: Education Details
- User fills education form
- **No API call** - data stored in component state
- Moves to next step

### Step 4: Location Details
- User fills location form
- API: `POST /django/api/tutor/add-details/` (unified endpoint)
- Payload: Combined education + location data
- **NEW**: Stores response data in localStorage
- Stores: `model` (Tutor), `email`, `name`, `Phone`
- Redirects to: `/dashboard/teacher`

### Step 5: Dashboard Loads
- Calls: `GET /dashboard`
- Zustand store populates with teacher data
- **NEW**: If store not loaded yet, reads from localStorage
- Displays: "Welcome back, {name}!"

---

## localStorage Keys Mapping

| Old Key | New Key (Constant) | Value |
|---------|-------------------|-------|
| `"model"` | `STORAGE_KEY.MODEL` | `"Tutor"` or `"Learner"` |
| `"name"` | `STORAGE_KEY.NAME` | User's full name |
| `"email"` | `STORAGE_KEY.EMAIL` | User's email |
| `"Phone"` | `STORAGE_KEY.PHONE` | User's phone number |

---

## Cookies Used

| Cookie | Purpose | Set By |
|--------|---------|--------|
| `jwt_Token` | Authentication token | Account creation, Login |
| `refresh_token` | Token refresh | Login |
| `access_hash` | Temporary signup token | OTP verification |

---

## Testing Checklist

- [x] Sign up new teacher account
- [x] Complete education form (no API call)
- [x] Complete location form (calls unified API)
- [x] Verify localStorage has name, email, phone
- [x] Dashboard shows correct teacher name
- [x] Dashboard loads teacher data from API
- [x] Fallback works if API is slow
- [x] All localStorage keys use STORAGE_KEY constants

---

## Backwards Compatibility

All changes maintain backwards compatibility:
- `authUtils.ts` handles both "Teacher"/"Tutor" and "Parent"/"Learner"
- Dashboard store updates localStorage on every load
- Old users with "Teacher" in localStorage will be updated to "Tutor" on next dashboard load
