# City & Locality Management Guide

This document explains how to manage cities and localities in the TutorSchool platform for production deployment.

## Overview

The TutorSchool platform uses a city-based routing system where each city and locality has its own dedicated landing page. The system is controlled through the `CITY_DATA` configuration in `src/lib/cityData.ts`.

## Current Status

**Active Cities & Localities:**
- ✅ **Bengaluru** (Karnataka)
  - ✅ HSR Layout

**Inactive Cities:** All other cities are commented out and will return 404 errors.

## File Structure

### Primary Configuration File
- `src/lib/cityData.ts` - Main configuration for all cities and their areas

### Related Files
- `app/locations/[city]/page.tsx` - City landing pages
- `app/tutors-in-[city]/page.tsx` - Tutor listings by city
- `src/components/city/` - City-specific UI components

## How to Activate a New City

### Step 1: Enable in City Data
In `src/lib/cityData.ts`, find the commented city and uncomment it:

```typescript
// Change this:
// mumbai: {
//   name: "Mumbai",
//   slug: "mumbai",
//   state: "Maharashtra",
//   areas: [
//     // { name: "Bandra", slug: "bandra" },
//     // { name: "Andheri", slug: "andheri" },
//   ],
// },

// To this:
mumbai: {
  name: "Mumbai",
  slug: "mumbai",
  state: "Maharashtra",
  areas: [
    { name: "Bandra", slug: "bandra" },
    { name: "Andheri", slug: "andheri" },
    // Add more areas as needed
  ],
},
```

### Step 2: Configure Areas (Optional)
You can control which areas within a city are active by commenting/uncommenting individual areas:

```typescript
areas: [
  { name: "Bandra", slug: "bandra" },           // Active
  // { name: "Andheri", slug: "andheri" },      // Inactive
  { name: "Powai", slug: "powai" },             // Active
],
```

### Step 3: Test the Changes
1. Save the file
2. Restart the development server: `npm run dev`
3. Visit the new city page: `http://localhost:3000/locations/mumbai`
4. Check tutor listings: `http://localhost:3000/tutors-in-mumbai`

## How to Activate a New Locality/Area

### Within an Existing Active City
Simply uncomment the area in the city's `areas` array:

```typescript
bengaluru: {
  name: "Bengaluru",
  slug: "bengaluru",
  state: "Karnataka",
  areas: [
    { name: "HSR Layout", slug: "hsr-layout" },
    { name: "Koramangala", slug: "koramangala" },  // Newly activated
  ],
},
```

### Adding a Completely New Area
Add a new area object to the city's `areas` array:

```typescript
areas: [
  { name: "HSR Layout", slug: "hsr-layout" },
  { name: "New Area Name", slug: "new-area-name" },  // New area
],
```

**Important:** Ensure the slug follows the format:
- Use lowercase letters
- Replace spaces with hyphens
- No special characters
- Example: "JP Nagar" → "jp-nagar"

## How to Deactivate Cities/Areas

### Deactivate an Entire City
Comment out the entire city object:

```typescript
// mumbai: {
//   name: "Mumbai",
//   slug: "mumbai",
//   state: "Maharashtra",
//   areas: [...],
// },
```

### Deactivate Specific Areas
Comment out individual areas within a city:

```typescript
areas: [
  { name: "HSR Layout", slug: "hsr-layout" },
  // { name: "Koramangala", slug: "koramangala" },  // Deactivated
],
```

## URL Structure

The system generates the following URL patterns:

- **City Landing Page:** `/locations/{city-slug}`
  - Example: `/locations/bengaluru`
- **Tutor Listings:** `/tutors-in-{city-slug}`
  - Example: `/tutors-in-bengaluru`
- **Area-specific:** `/locations/{city-slug}/{area-slug}`
  - Example: `/locations/bengaluru/hsr-layout`

## Production Deployment Considerations

### Performance Impact
- Each active city/area generates static pages at build time
- More cities = longer build times
- Monitor build performance in CI/CD

### SEO Requirements
- Each city/area should have sufficient tutor content
- Avoid activating areas with no tutors (empty pages hurt SEO)
- Consider local demand before activation

### Content Requirements
- Ensure tutor data exists for new cities/areas
- Update city-specific content and metadata
- Verify all components work with new city data

## Testing Checklist

Before activating a new city/area in production:

- [ ] City slug is unique and follows naming conventions
- [ ] All areas have valid slugs (lowercase, hyphenated)
- [ ] Pages render correctly in development
- [ ] No TypeScript errors
- [ ] Build completes successfully: `npm run build`
- [ ] API endpoints return data for the new city/area
- [ ] SEO metadata is properly configured

## Rollback Process

If you need to quickly deactivate a problematic city:

1. Comment out the city in `src/lib/cityData.ts`
2. Commit and deploy the change
3. The city pages will return 404 immediately

## Support

For technical issues or questions about city activation:
- Check build logs for errors
- Verify API connectivity for new cities
- Test with development data before production
- Monitor analytics after activation

---

**Last Updated:** December 2024
**Current Active Cities:** Bengaluru (HSR Layout only)