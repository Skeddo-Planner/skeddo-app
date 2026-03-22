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
 *  2. IS_BETA = true                → treat everyone as Plus (beta period)
 *  3. isBetaUser = true             → lifetime Plus for beta testers (even after IS_BETA = false)
 *  4. profile.plan from Supabase    → actual plan enforcement (paid subscribers)
 *  5. Default: "free"
 *
 * Beta users who signed up during the beta period get Skeddo Plus for free, forever.
 * This is tracked via the `is_beta_user` flag on their Supabase profile.
 * When IS_BETA is flipped to false, their flag ensures they keep Plus access
 * without needing a paid subscription.
 */
export default function usePlanAccess(userPlan, isBetaUser) {
  return useMemo(() => {
    // 1. Check URL override for testing
    const testPlan = new URLSearchParams(window.location.search).get("testplan");
    const isTestMode = testPlan === "free" || testPlan === "plus";

    // 2. Resolve effective plan
    let effectivePlan;
    if (isTestMode) {
      effectivePlan = testPlan;
    } else if (IS_BETA) {
      // During beta: everyone gets Plus
      effectivePlan = "plus";
    } else if (isBetaUser) {
      // After beta: beta users keep Plus for life
      effectivePlan = "plus";
    } else {
      // After beta: use actual plan from Supabase (paid or free)
      effectivePlan = userPlan || "free";
    }

    const isPaid = effectivePlan === "plus";
    const maxPrograms = isPaid ? Infinity : 3;
    const maxKids = isPaid ? Infinity : 1;

    return {
      effectivePlan,
      isBeta: IS_BETA,
      isBetaUser: !!isBetaUser,
      isTestMode,
      isPaid,
      maxPrograms,
      maxKids,
      canUseAdvancedFilters: isPaid,
      canUseBudgetTracking: isPaid,
      canUseCircles: isPaid,
      canUseCoParent: isPaid,
      canExportCalendar: isPaid,

      /** Check if user can add another program */
      checkProgramLimit(currentCount) {
        if (isPaid) return { allowed: true, remaining: Infinity };
        const remaining = maxPrograms - currentCount;
        return { allowed: remaining > 0, remaining: Math.max(0, remaining) };
      },
    };
  }, [userPlan, isBetaUser]);
}
