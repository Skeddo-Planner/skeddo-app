import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { trackEvent } from "../utils/analytics";

/**
 * Manages all Circles state: circles, memberships, feed, bookmarks, referrals.
 */
export function useCircles(userId, session) {
  const [circles, setCircles] = useState([]);          // user's circles with member counts
  const [pendingRequests, setPendingRequests] = useState([]); // pending join requests (for owner)
  const [activeFeed, setActiveFeed] = useState([]);     // feed for the active circle
  const [bookmarks, setBookmarks] = useState(new Set());
  const [bookmarkedActivities, setBookmarkedActivities] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [referralCode, setReferralCode] = useState(null); // user's permanent referral code
  const [referralUrl, setReferralUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  // Social proof map for Discover tab: { "name|||provider" → [{ sharedByName }] }
  const [circleSocialProof, setCircleSocialProof] = useState({});

  const getAuthHeaders = useCallback(() => {
    const token = session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [session]);

  /* ── Load circles + pending requests on mount ── */
  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    async function load() {
      setLoading(true);
      try {
        // Get user's circle memberships (approved + pending)
        const { data: memberships } = await supabase
          .from("circle_memberships")
          .select("circle_id, role, status, circles(id, name, emoji, created_by, invite_code)")
          .eq("user_id", userId)
          .in("status", ["approved", "pending"]);

        if (memberships) {
          const approvedCircles = memberships
            .filter((m) => m.status === "approved" && m.circles)
            .map((m) => ({
              id: m.circles.id,
              name: m.circles.name,
              emoji: m.circles.emoji,
              createdBy: m.circles.created_by,
              inviteCode: m.circles.invite_code,
              role: m.role,
            }));

          // Get member counts + new activity counts in parallel
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
          await Promise.all(approvedCircles.map(async (c) => {
            const [memberRes, activityRes] = await Promise.all([
              supabase.from("circle_memberships").select("*", { count: "exact", head: true }).eq("circle_id", c.id).eq("status", "approved"),
              supabase.from("shared_activities").select("*", { count: "exact", head: true }).eq("circle_id", c.id).gte("shared_at", weekAgo),
            ]);
            c.memberCount = memberRes.count || 0;
            c.newCount = activityRes.count || 0;
          }));

          setCircles(approvedCircles);

          // Build social proof map: all shares across all circles (excluding own)
          const circleIds = approvedCircles.map((c) => c.id);
          if (circleIds.length > 0) {
            const { data: allShares } = await supabase
              .from("shared_activities")
              .select("activity_name, provider_name, shared_by_name, shared_by")
              .in("circle_id", circleIds)
              .neq("shared_by", userId);
            const proofMap = {};
            for (const share of (allShares || [])) {
              const key = `${(share.activity_name || "").toLowerCase()}|||${(share.provider_name || "").toLowerCase()}`;
              if (!proofMap[key]) proofMap[key] = [];
              if (!proofMap[key].some((s) => s.sharedByName === share.shared_by_name)) {
                proofMap[key].push({ sharedByName: share.shared_by_name });
              }
            }
            setCircleSocialProof(proofMap);
          }
        }

        // Get pending requests for circles this user owns
        const ownedCircleIds = (memberships || [])
          .filter((m) => m.role === "owner" && m.circles)
          .map((m) => m.circles.id);

        if (ownedCircleIds.length > 0) {
          const { data: pendingRaw } = await supabase
            .from("circle_memberships")
            .select("id, circle_id, user_id, joined_at")
            .eq("status", "pending")
            .in("circle_id", ownedCircleIds);

          // Resolve names for pending requests
          if (pendingRaw && pendingRaw.length > 0) {
            const pendingUserIds = pendingRaw.map((p) => p.user_id);
            const pendingCircleIds = [...new Set(pendingRaw.map((p) => p.circle_id))];
            const [{ data: pendingProfiles }, { data: pendingCircles }] = await Promise.all([
              supabase.from("profiles").select("id, display_name").in("id", pendingUserIds),
              supabase.from("circles").select("id, name").in("id", pendingCircleIds),
            ]);
            const pNameMap = {};
            (pendingProfiles || []).forEach((p) => { pNameMap[p.id] = p.display_name; });
            const cNameMap = {};
            (pendingCircles || []).forEach((c) => { cNameMap[c.id] = c.name; });
            setPendingRequests(pendingRaw.map((p) => ({
              ...p,
              displayName: pNameMap[p.user_id] || "Someone",
              circleName: cNameMap[p.circle_id] || "your circle",
            })));
          } else {
            setPendingRequests([]);
          }
        } else {
          setPendingRequests([]);
        }

        // Load bookmarks (IDs + full activity details)
        const { data: bm } = await supabase
          .from("circle_bookmarks")
          .select("shared_activity_id")
          .eq("user_id", userId);
        const bmIds = (bm || []).map((b) => b.shared_activity_id);
        setBookmarks(new Set(bmIds));
        if (bmIds.length > 0) {
          const { data: bmActivities } = await supabase
            .from("shared_activities")
            .select("*")
            .in("id", bmIds);
          setBookmarkedActivities(bmActivities || []);
        } else {
          setBookmarkedActivities([]);
        }

        // Load referral code from profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("referral_code")
          .eq("id", userId)
          .single();
        if (profileData?.referral_code) {
          setReferralCode(profileData.referral_code);
          setReferralUrl(`https://skeddo.ca/invite/${profileData.referral_code}`);
        }

        // Load referrals (conversions)
        const { data: refs } = await supabase
          .from("referrals")
          .select("*")
          .eq("referrer_id", userId)
          .order("created_at", { ascending: false });
        setReferrals(refs || []);
      } catch (err) {
        console.error("useCircles load error:", err);
      }
      setLoading(false);
    }

    load();
  }, [userId]);

  /* ── Load feed for a specific circle ── */
  const loadFeed = useCallback(async (circleId) => {
    try {
      const { data, error } = await supabase
        .from("shared_activities")
        .select("*, activity_flags(id)")
        .eq("circle_id", circleId)
        .order("shared_at", { ascending: false });

      if (error) {
        console.warn("Failed to load circle feed:", error);
        return activeFeed; // return current feed on error
      }

      setActiveFeed(data || []);
      return data || [];
    } catch (err) {
      console.warn("loadFeed error:", err);
      return activeFeed;
    }
  }, [activeFeed]);

  /* ── Create a circle ── */
  const createCircle = useCallback(async (name, emoji) => {
    const res = await fetch("/api/circles-create", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ name, emoji }),
    });
    let data;
    try { data = await res.json(); } catch { data = { error: "Server returned an invalid response. Please try again." }; }
    if (!res.ok) throw new Error(data.error || "Failed to create circle");
    trackEvent("create_circle", { circle_name: name });
    // Add to local state
    setCircles((prev) => [...prev, {
      id: data.circle.id,
      name: data.circle.name,
      emoji: data.circle.emoji,
      createdBy: data.circle.created_by,
      inviteCode: data.circle.invite_code,
      role: "owner",
      memberCount: 1,
      newCount: 0,
    }]);
    return data;
  }, [getAuthHeaders]);

  /* ── Join a circle via invite code ── */
  const joinCircle = useCallback(async (inviteCode) => {
    const res = await fetch("/api/circles-join", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ inviteCode }),
    });
    let data;
    try { data = await res.json(); } catch { data = { error: "Server returned an invalid response. Please try again." }; }
    if (!res.ok) throw new Error(data.error || "Failed to join circle");
    return data;
  }, [getAuthHeaders]);

  /* ── Approve/decline a pending member ── */
  const handleMemberRequest = useCallback(async (membershipId, action) => {
    const res = await fetch("/api/circles-approve", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ membershipId, action }),
    });
    let data;
    try { data = await res.json(); } catch { data = { error: "Server returned an invalid response. Please try again." }; }
    if (!res.ok) throw new Error(data.error || "Failed to process request");
    setPendingRequests((prev) => prev.filter((r) => r.id !== membershipId));
    return data;
  }, [getAuthHeaders]);

  /* ── Leave a circle ── */
  const leaveCircle = useCallback(async (circleId, newOwnerId) => {
    const res = await fetch("/api/circles-leave", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ circleId, newOwnerId }),
    });
    let data;
    try { data = await res.json(); } catch { data = { error: "Server returned an invalid response. Please try again." }; }
    if (!res.ok) throw new Error(data.error || "Failed to leave circle");
    setCircles((prev) => prev.filter((c) => c.id !== circleId));
    return data;
  }, [getAuthHeaders]);

  /* ── Remove a member ── */
  const removeMember = useCallback(async (circleId, targetUserId) => {
    const res = await fetch("/api/circles-remove", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ circleId, targetUserId }),
    });
    let data;
    try { data = await res.json(); } catch { data = { error: "Server returned an invalid response. Please try again." }; }
    if (!res.ok) throw new Error(data.error || "Failed to remove member");
    return data;
  }, [getAuthHeaders]);

  /* ── Share activities to a circle ── */
  const shareActivities = useCallback(async (circleId, activities, displayName) => {
    const res = await fetch("/api/circles-share", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ circleId, activities, displayName }),
    });
    let data;
    try { data = await res.json(); } catch { data = { error: "Server returned an invalid response. Please try again." }; }
    if (!res.ok) throw new Error(data.error || "Failed to share activities");
    // Refresh feed
    await loadFeed(circleId);
    return data;
  }, [getAuthHeaders, loadFeed]);

  /* ── Bookmark/unbookmark a shared activity ── */
  const toggleBookmark = useCallback(async (sharedActivityId, activityData) => {
    const wasBookmarked = bookmarks.has(sharedActivityId);
    // Optimistic update for bookmarks Set
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(sharedActivityId)) next.delete(sharedActivityId);
      else next.add(sharedActivityId);
      return next;
    });
    // Optimistic update for bookmarkedActivities list
    if (wasBookmarked) {
      setBookmarkedActivities((prev) => prev.filter((a) => a.id !== sharedActivityId));
    } else if (activityData) {
      setBookmarkedActivities((prev) => [...prev, activityData]);
    } else {
      // Fetch activity details if not provided
      const { data } = await supabase.from("shared_activities").select("*").eq("id", sharedActivityId).single();
      if (data) setBookmarkedActivities((prev) => [...prev, data]);
    }
    // Sync with Supabase
    try {
      if (wasBookmarked) {
        await supabase.from("circle_bookmarks").delete().eq("user_id", userId).eq("shared_activity_id", sharedActivityId);
      } else {
        await supabase.from("circle_bookmarks").insert({ user_id: userId, shared_activity_id: sharedActivityId });
      }
    } catch {
      // Revert on error
      setBookmarks((prev) => {
        const next = new Set(prev);
        if (wasBookmarked) next.add(sharedActivityId);
        else next.delete(sharedActivityId);
        return next;
      });
      if (wasBookmarked && activityData) {
        setBookmarkedActivities((prev) => [...prev, activityData]);
      } else {
        setBookmarkedActivities((prev) => prev.filter((a) => a.id !== sharedActivityId));
      }
    }
  }, [userId, bookmarks]);

  /* ── Flag a shared activity (refreshes feed after) ── */
  const flagActivity = useCallback(async (sharedActivityId, reason, circleId) => {
    const res = await fetch("/api/circles-flag", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ sharedActivityId, reason }),
    });
    let data;
    try { data = await res.json(); } catch { data = { error: "Server returned an invalid response. Please try again." }; }
    if (!res.ok) throw new Error(data.error || "Failed to flag activity");
    // Refresh feed to show flagged state
    if (circleId) await loadFeed(circleId);
    return data;
  }, [getAuthHeaders, loadFeed]);

  /* ── Delete a shared activity (only by the sharer) ── */
  const deleteSharedActivity = useCallback(async (sharedActivityId, circleId) => {
    // Optimistic: remove from feed immediately
    setActiveFeed((prev) => prev.filter((item) => item.id !== sharedActivityId));
    try {
      const res = await fetch("/api/circles-share", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ sharedActivityId }),
      });
      let data;
      try { data = await res.json(); } catch { data = { error: "Server returned an invalid response. Please try again." }; }
      if (!res.ok) {
        // Revert optimistic update on failure
        if (circleId) await loadFeed(circleId);
        throw new Error(data.error || "Failed to remove shared activity");
      }
      return data;
    } catch (err) {
      // Revert on network error
      if (circleId) await loadFeed(circleId);
      throw err;
    }
  }, [getAuthHeaders, loadFeed]);

  /* ── Get or create the user's permanent referral link ── */
  const ensureReferralCode = useCallback(async () => {
    if (referralCode) return { referralCode, referralUrl };
    const res = await fetch("/api/referral-create", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    });
    let data;
    try { data = await res.json(); } catch { data = { error: "Server returned an invalid response. Please try again." }; }
    if (!res.ok) throw new Error(data.error || "Failed to create referral code");
    setReferralCode(data.referralCode);
    setReferralUrl(data.referralUrl);
    return data;
  }, [getAuthHeaders, referralCode, referralUrl]);

  /* ── Get members of a circle ── */
  const getMembers = useCallback(async (circleId) => {
    const { data: memberships } = await supabase
      .from("circle_memberships")
      .select("user_id, role, status, joined_at")
      .eq("circle_id", circleId)
      .eq("status", "approved");

    if (!memberships || memberships.length === 0) return [];

    // Fetch display names separately (profiles join can fail with RLS)
    const userIds = memberships.map((m) => m.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", userIds);

    const nameMap = {};
    (profiles || []).forEach((p) => { nameMap[p.id] = p.display_name; });

    return memberships.map((m) => ({
      userId: m.user_id,
      displayName: nameMap[m.user_id] || "Member",
      role: m.role,
      joinedAt: m.joined_at,
    }));
  }, []);

  /* ── Refresh pending requests (call when returning to home screen) ── */
  const refreshPending = useCallback(async () => {
    if (!userId) return;
    const { data: owned } = await supabase
      .from("circles")
      .select("id, name")
      .eq("created_by", userId);
    const ownedIds = (owned || []).map((c) => c.id);
    if (ownedIds.length > 0) {
      const { data: pendingRaw } = await supabase
        .from("circle_memberships")
        .select("id, circle_id, user_id, joined_at")
        .eq("status", "pending")
        .in("circle_id", ownedIds);
      if (pendingRaw && pendingRaw.length > 0) {
        const pIds = pendingRaw.map((p) => p.user_id);
        const { data: pProfiles } = await supabase.from("profiles").select("id, display_name").in("id", pIds);
        const pMap = {};
        (pProfiles || []).forEach((p) => { pMap[p.id] = p.display_name; });
        const cMap = {};
        (owned || []).forEach((c) => { cMap[c.id] = c.name; });
        setPendingRequests(pendingRaw.map((p) => ({
          ...p,
          displayName: pMap[p.user_id] || "Someone",
          circleName: cMap[p.circle_id] || "your circle",
        })));
      } else {
        setPendingRequests([]);
      }
    } else {
      setPendingRequests([]);
    }
  }, [userId]);

  const membersRecruited = referrals.filter((r) => r.status === "converted").length;
  const freeMonthsEarned = referrals.reduce((sum, r) => sum + (r.status === "converted" ? r.reward_months : 0), 0);

  return {
    circles,
    pendingRequests,
    activeFeed,
    bookmarks,
    bookmarkedActivities,
    referrals,
    referralCode,
    referralUrl,
    circleSocialProof,
    membersRecruited,
    freeMonthsEarned,
    loading,
    createCircle,
    joinCircle,
    handleMemberRequest,
    leaveCircle,
    removeMember,
    shareActivities,
    loadFeed,
    toggleBookmark,
    flagActivity,
    deleteSharedActivity,
    ensureReferralCode,
    getMembers,
    refreshPending,
    pendingCount: pendingRequests.length,
  };
}
