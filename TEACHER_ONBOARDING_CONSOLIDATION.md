# Teacher Onboarding API Consolidation

## Overview
Consolidated teacher onboarding from 2 API calls (basic + location) into a single unified Django endpoint call.

## Changes Made

### 1. New Hook: `useCreateTeacherDetails.ts`
**File**: `src/hooks/useCreateTeacherDetails.ts`

**Purpose**: Calls the unified Django endpoint with combined basic + location data.

**Endpoint**: `POST /django/api/tutor/add-details/`

**Payload Structure**:
```typescript
{
  // Basic info
  degree: string;
  class: number;
  university: string;
  current_status: string;
  teaching_mode: string;
  referral: string;
  // Location info
  area: string;
  latitude: number;
  longitude: number;
  pincode: string;
  state: string;
}
```

**Features**:
- JWT authentication via `jwt_Token` cookie
- Error handling with toast notifications
- Automatic navigation to teacher dashboard on success
- TypeScript interface for type safety

---

### 2. Updated: `TeacherProfileContent.tsx`
**File**: `app/teacher-profile/TeacherProfileContent.tsx`

**Changes**:
- Added `EducationFormData` interface
- Added `educationData` state to store form data between steps
- Pass `educationData` and `setEducationData` to child components
- Education component receives `onDataChange` callback
- Location component receives `educationData` prop

**Data Flow**:
```
Education Component → Store Data → Location Component → API Call
```

---

### 3. Updated: `Education.tsx`
**File**: `app/teacher-profile/Education.tsx`

**Changes**:
- Added `onDataChange` prop to pass data to parent
- Removed API call from form submission
- Now just stores data and moves to next step
- Removed `useCreateTeacherBasic` hook usage
- Changed loading state to `false` (no API call)

**Old Flow**:
```
Submit Form → Call /onboarding/teacher/basic → Next Step
```

**New Flow**:
```
Submit Form → Store Data in Parent → Next Step
```

---

### 4. Updated: `Location.tsx`
**File**: `app/teacher-profile/Location.tsx`

**Changes**:
- Added `educationData` prop
- Added `useCreateTeacherDetails` hook
- Conditional logic: use old hook for settings page, new hook for onboarding
- Combine education + location data in submit handler
- Call unified endpoint with complete payload

**Old Flow (Onboarding)**:
```
Submit Form → Call /onboarding/teacher/location → Navigate
```

**New Flow (Onboarding)**:
```
Submit Form → Combine education + location data → Call /tutor/add-details/ → Navigate
```

**Settings Page Flow** (unchanged):
```
Submit Form → Call /onboarding/teacher/location → Navigate
```

---

## API Migration Summary

### Before
1. **Step 1**: User fills education form
   - API: `POST /onboarding/teacher/basic`
   - Payload: degree, class, university, current_status, teaching_mode, referral

2. **Step 2**: User fills location form
   - API: `POST /onboarding/teacher/location`
   - Payload: area, latitude, longitude, pincode, state

### After
1. **Step 1**: User fills education form
   - No API call - data stored in component state

2. **Step 2**: User fills location form
   - API: `POST /django/api/tutor/add-details/`
   - Payload: Combined education + location data

---

## Benefits

1. **Reduced API Calls**: 2 calls → 1 call
2. **Better UX**: User doesn't wait for API response between steps
3. **Atomic Operation**: All data saved together or none at all
4. **Consistency**: Matches Django API structure
5. **Backwards Compatibility**: Settings page still uses old location endpoint

---

## Testing Checklist

- [ ] Test teacher onboarding flow (new user)
- [ ] Verify education form submission (no API call)
- [ ] Verify location form submission (calls unified API)
- [ ] Check JWT token handling
- [ ] Test error handling (missing education data)
- [ ] Verify navigation to dashboard after success
- [ ] Test settings page location update (old flow)
- [ ] Verify TypeScript types compile correctly

---

## Notes

- The old hooks (`useCreateTeacherBasic`, `useUploadLocation`) are kept for potential backwards compatibility
- Settings page continues to use the old location endpoint
- The new unified endpoint expects all fields to be present
- Frontend now handles combining data from both steps before API call
