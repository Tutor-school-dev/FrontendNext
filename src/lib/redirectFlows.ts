/**
 * Redirect Flow Management System
 * Handles different login sources and their specific post-login actions
 */

export enum RedirectSource {
  JOB_LISTING = "job_listing",
  DASHBOARD = "dashboard",
  PROFILE = "profile",
  SUBSCRIPTION = "subscription",
  GENERAL = "general"
}

export interface RedirectFlowData {
  source: RedirectSource;
  jobId?: string;
  returnUrl?: string;
  metadata?: Record<string, any>;
}

const REDIRECT_FLOW_KEY = "pendingRedirectFlow";

/**
 * Save redirect flow data to localStorage before redirecting to auth
 */
export function saveRedirectFlow(data: RedirectFlowData): void {
  if (typeof window === 'undefined') return;
  
  try {
    console.log('💾 Saving redirect flow:', data);
    localStorage.setItem(REDIRECT_FLOW_KEY, JSON.stringify(data));
    console.log('✅ Redirect flow saved successfully');
  } catch (error) {
    console.error("❌ Failed to save redirect flow:", error);
  }
}

/**
 * Get pending redirect flow data
 */
export function getRedirectFlow(): RedirectFlowData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(REDIRECT_FLOW_KEY);
    console.log('📖 Getting redirect flow from localStorage:', data);
    
    if (!data) {
      console.log('ℹ️ No redirect flow data found in localStorage');
      return null;
    }
    
    const parsed = JSON.parse(data) as RedirectFlowData;
    console.log('✅ Parsed redirect flow:', parsed);
    return parsed;
  } catch (error) {
    console.error("❌ Failed to get redirect flow:", error);
    return null;
  }
}

/**
 * Clear redirect flow data after processing
 */
export function clearRedirectFlow(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(REDIRECT_FLOW_KEY);
  } catch (error) {
    console.error("Failed to clear redirect flow:", error);
  }
}

/**
 * Generate auth URL with redirect flow parameters
 */
export function generateAuthUrl(userType: 'teacher' | 'parent', data: RedirectFlowData): string {
  const params = new URLSearchParams();
  params.set('model', userType);
  params.set('redirectSource', data.source);
  
  if (data.jobId) {
    params.set('jobId', data.jobId);
  }
  
  if (data.returnUrl) {
    params.set('returnUrl', data.returnUrl);
  }
  
  return `/auth?${params.toString()}`;
}

/**
 * Process redirect flow after successful login
 * Returns the URL to navigate to
 */
export async function processRedirectFlow(
  applyJobFn?: (jobId: string) => Promise<any>
): Promise<string> {
  const flow = getRedirectFlow();
  
  console.log('🔄 Processing redirect flow:', flow);
  
  if (!flow) {
    // No pending flow, go to default dashboard
    console.log('ℹ️ No pending redirect flow, going to default dashboard');
    return '/dashboard/teacher';
  }
  
  try {
    console.log('✅ Found redirect flow:', {
      source: flow.source,
      jobId: flow.jobId,
      returnUrl: flow.returnUrl,
      hasApplyJobFn: !!applyJobFn
    });
    
    switch (flow.source) {
      case RedirectSource.JOB_LISTING:
        if (flow.jobId && applyJobFn) {
          console.log('📝 Applying for job:', flow.jobId);
          // Apply for the job
          await applyJobFn(flow.jobId);
          console.log('✅ Job application successful');
          clearRedirectFlow();
          return '/dashboard/teacher';
        } else {
          console.warn('⚠️ Job listing flow but missing jobId or applyJobFn:', {
            jobId: flow.jobId,
            hasApplyJobFn: !!applyJobFn
          });
        }
        break;
        
      case RedirectSource.SUBSCRIPTION:
        clearRedirectFlow();
        return '/dashboard/teacher/subscription';
        
      case RedirectSource.PROFILE:
        clearRedirectFlow();
        return '/teacher-profile';
        
      case RedirectSource.DASHBOARD:
        clearRedirectFlow();
        return flow.returnUrl || '/dashboard/teacher';
        
      default:
        clearRedirectFlow();
        return '/dashboard/teacher';
    }
  } catch (error) {
    console.error("Failed to process redirect flow:", error);
    clearRedirectFlow();
  }
  
  return '/dashboard/teacher';
}

/**
 * Check if user should be redirected after login based on query params
 */
export function extractRedirectFlowFromParams(searchParams: URLSearchParams): RedirectFlowData | null {
  const source = searchParams.get('redirectSource');
  const jobId = searchParams.get('jobId');
  const returnUrl = searchParams.get('returnUrl');
  
  if (!source) return null;
  
  return {
    source: source as RedirectSource,
    jobId: jobId || undefined,
    returnUrl: returnUrl || undefined,
  };
}
