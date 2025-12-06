# Copilot Instructions for TutorSchool

## Project Overview
- **Type:** Next.js 15 + React + TypeScript AI-powered tutor matching platform
- **Architecture:** App Router with dual authentication flows (Tutor/Learner)
- **UI:** shadcn/ui + Radix UI components, Tailwind CSS
- **Backend Integration:** Django REST API with JWT authentication and environment-based routing
- **Package Manager:** Uses Bun (bun.lockb present) but npm/yarn commands also work
- **Build Tool:** Next.js native build system (no Vite despite earlier references)

## Project Structure
```
app/                     # Next.js App Router pages
├── auth/               # Authentication flows
├── dashboard/          # Role-specific dashboards (teacher/, parent/)  
├── onboarding/         # Multi-step user onboarding
├── tutor-search/       # Search and filtering pages
└── [slug]/            # Dynamic routing for tutor profiles
src/
├── components/         # Reusable UI components
│   ├── auth/          # Authentication-specific components
│   ├── providers/     # Context providers (Query, Theme, GoogleAuth)
│   ├── ui/           # shadcn/ui primitives (DO NOT edit directly)
│   └── city/         # Location-specific components
├── hooks/             # Custom React hooks for API integration
├── lib/               # Utilities and constants
└── types/            # TypeScript type definitions
```

## Critical Architecture Patterns

### Authentication & API Integration
- **Dual Backend Support:** Environment-based API routing (`staging` vs `production`)
- **JWT Token Management:** Uses `js-cookie` with `AUTH_COOKIE` constants in `src/lib/constants.ts`
- **User Types:** `Tutor`/`Learner` (mapped from legacy `Teacher`/`Parent`)
- **State Persistence:** Combines cookies (tokens) + localStorage (user metadata)

**Example API Hook Pattern:**
```typescript
// All API hooks follow this pattern in src/hooks/
const response = await axios.post(`${getDjangoAuthUrl()}/auth/tutor/login/`, payload);
Cookies.set(AUTH_COOKIE.JWT_TOKEN, data.jwt_token, { expires: 7 });
localStorage.setItem(STORAGE_KEY.MODEL, "Tutor");
```

### State Management Strategy  
- **Global State:** Zustand store (`useDashboardStore`) for user session data
- **Server State:** TanStack Query for API data fetching and caching
- **Form State:** React Hook Form + Zod validation
- **Navigation:** `useRouter` with redirect flow handling via `src/lib/redirectFlows.ts`

### Component Composition Patterns
- **Page Components:** Live in `app/` directory, handle routing and layout
- **Feature Components:** In `src/components/`, compose smaller UI components
- **Authentication Guards:** Wrap protected routes with `AuthGuard` component
- **Provider Nesting:** QueryClient > ThemeProvider > GoogleAuthProvider > TooltipProvider

## Environment & Configuration
- **API Routing:** `NEXT_PUBLIC_NODE_ENV=staging` switches to staging backend
- **Google OAuth:** Requires `NEXT_PUBLIC_CLIENT_ID` environment variable  
- **Base URL:** `NEXT_PUBLIC_GO_APP_URL` for production API endpoint
- **Type Safety:** `noImplicitAny: false` allows gradual TypeScript adoption

## Developer Workflows
```bash
npm run dev          # Development server with hot reload
npm run build        # Production build (type checking enabled)
npm run start        # Start production server  
npm run lint         # ESLint with Next.js configuration
npm run preview      # Alias for npm run start

# Alternative with Bun (faster)
bun dev              # Development server
bun install          # Install dependencies
```

## Key Integration Points
- **Django API:** All authentication endpoints route through `getDjangoAuthUrl()`
- **Google Maps:** Leaflet integration for tutor location services
- **Payment Flow:** Razor pay integration for subscription management
- **File Handling:** PDF generation and display for profiles/documents

## Migration Context
- Recently migrated from Go backend to unified Django API
- Legacy terminology (`Teacher`/`Parent`) mapped to new (`Tutor`/`Learner`)
- Backward compatibility maintained in authentication utilities
- See `DJANGO_AUTH_MIGRATION.md` for detailed migration patterns

## Code Quality & Build Settings
- **TypeScript:** `noImplicitAny: false` allows gradual TypeScript adoption
- **Build:** Type checking and ESLint enabled for production (`ignoreBuildErrors: false`)
- **Performance:** Optimized imports for lucide-react, AVIF/WebP image formats
- **Redirects:** `/apply` → `/auth?model=teacher` (permanent redirect)

## References
- See `README.md` for setup and editing instructions
- See `tailwind.config.ts` and `next.config.ts` for build and styling config
- See migration docs: `DJANGO_AUTH_MIGRATION.md`, `TEACHER_ONBOARDING_CONSOLIDATION.md`

---

If you are unsure about a pattern, prefer following the structure of existing files in the relevant directory.
