import { useMemo } from "react";

/**
 * Master switch: set to `false` when billing goes live.
 * While true, all users get Plus-level access (beta period).
 */
const IS_BETA = true;

/**
 * Centralized plan access hook — single source of truth for feature gating.
 *
 * Priority:
 *  1. URL param ?testplan=free|plus  → overrides everything (for founder testing)
 *  2. IS_BETA = true                → treat everyone as Plus
 *  3. profile.plan from Supabase    → actual plan enforcement
 */
export default function usePlanAccess(userPlan) {
  return useMemo(() => {
    // 1. Check URL override for testing
    const testPlan = new URLSearchParams(window.location.search).get("testplan");
    const isTestMode = testPlan === "free" || testPlan === "plus";

    // 2. Resolve effective plan
    let effectivePlan;
    if (isTestMode) {
      effectivePlan = testPlan;
    } else if (IS_BETA) {
      effectivePlan = "plus";
    } else {
      effectivePlan = userPlan || "free";
    }

    const isPaid = effectivePlan === "plus";
    const maxPrograms = isPaid ? Infinity : 3;

    return {
      effectivePlan,
      isBeta: IS_BETA,
      isTestMode,
      isPaid,
      maxPrograms,
      canUseAdvancedFilters: isPaid,
      canUseBudgetTracking: isPaid,
      canUseCircles: isPaid,
      canUseCoParent: isPaid,

      /** Check if user can add another program */
      checkProgramLimit(currentCount) {
        if (isPaid) return { allowed: true, remaining: Infinity };
        const remaining = maxPrograms - currentCount;
        return { allowed: remaining > 0, remaining: Math.max(0, remaining) };
      },
    };
  }, [userPlan]);
}
