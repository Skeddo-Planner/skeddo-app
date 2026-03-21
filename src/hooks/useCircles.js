import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

/**
 * Manages all Circles state: circles, memberships, feed, bookmarks, referrals.
 */
export function useCircles(userId, session) {
  const [circles, setCircles] = useState([]);          // user's circles with member counts
  const [pendingRequests, setPendingRequests] = useState([]); // pending join requests (for owner)
  const [activeFeed, setActiveFeed] = useState([]);     // feed for the active circle
  const [bookmarks, setBookmarks] = useState(new Set());
  const [referrals, setReferrals] = useState([]);
  const [referralCode, setReferralCode] = useState(null); // user's permanent referral code
  const [referralUrl, setReferralUrl] = useState(null);
  const [loading, setLoading] = useState(true);

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

          // Get member counts for each circle
          for (const c of approvedCircles) {
            const { count } = await supabase
              .from("circle_memberships")
              .select("*", { count: "exact", head: true })
              .eq("circle_id", c.id)
              .eq("status", "approved");
            c.memberCount = count || 0;

            // Get new activity count (last 7 days)
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
            const { count: newCount } = await supabase
              .from("shared_activities")
              .select("*", { count: "exact", head: true })
              .eq("circle_id", c.id)
              .gte("shared_at", weekAgo);
            c.newCount = newCount || 0;
          }

          setCircles(approvedCircles);
        }

        // Get pending requests for circles this user owns
        const ownedCircleIds = (memberships || [])
          .filter((m) => m.role === "owner" && m.circles)
          .map((m) => m.circles.id);

        if (ownedCircleIds.length > 0) {
          const { data: pending } = await supabase
            .from("circle_memberships")
            .select("id, circle_id, user_id, joined_at, circles(name), profiles(display_name)")
            .eq("status", "pending")
            .in("circle_id", ownedCircleIds);
          setPendingRequests(pending || []);
        } else {
          setPendingRequests([]);
        }

        // Load bookmarks
        const { data: bm } = await supabase
          .from("circle_bookmarks")
          .select("shared_activity_id")
          .eq("user_id", userId);
        setBookmarks(new Set((bm || []).map((b) => b.shared_activity_id)));

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
    const { data } = await supabase
      .from("shared_activities")
      .select("*, activity_flags(id)")
      .eq("circle_id", circleId)
      .order("shared_at", { ascending: false });

    setActiveFeed(data || []);
    return data || [];
  }, []);

  /* ── Create a circle ── */
  const createCircle = useCallback(async (name, emoji) => {
    const res = await fetch("/api/circles-create", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ name, emoji }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
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
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  }, [getAuthHeaders]);

  /* ── Approve/decline a pending member ── */
  const handleMemberRequest = useCallback(async (membershipId, action) => {
    const res = await fetch("/api/circles-approve", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ membershipId, action }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
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
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
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
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  }, [getAuthHeaders]);

  /* ── Share activities to a circle ── */
  const shareActivities = useCallback(async (circleId, activities) => {
    const res = await fetch("/api/circles-share", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ circleId, activities }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    // Refresh feed
    await loadFeed(circleId);
    return data;
  }, [getAuthHeaders, loadFeed]);

  /* ── Bookmark/unbookmark a shared activity ── */
  const toggleBookmark = useCallback(async (sharedActivityId) => {
    // Optimistic update using functional state
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(sharedActivityId)) next.delete(sharedActivityId);
      else next.add(sharedActivityId);
      return next;
    });
    // Sync with Supabase
    const wasBookmarked = bookmarks.has(sharedActivityId);
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
    }
  }, [userId, bookmarks]);

  /* ── Flag a shared activity (refreshes feed after) ── */
  const flagActivity = useCallback(async (sharedActivityId, reason, circleId) => {
    const res = await fetch("/api/circles-flag", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ sharedActivityId, reason }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    // Refresh feed to show flagged state
    if (circleId) await loadFeed(circleId);
    return data;
  }, [getAuthHeaders, loadFeed]);

  /* ── Get or create the user's permanent referral link ── */
  const ensureReferralCode = useCallback(async () => {
    if (referralCode) return { referralCode, referralUrl };
    const res = await fetch("/api/referral-create", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setReferralCode(data.referralCode);
    setReferralUrl(data.referralUrl);
    return data;
  }, [getAuthHeaders, referralCode, referralUrl]);

  /* ── Get members of a circle ── */
  const getMembers = useCallback(async (circleId) => {
    const { data } = await supabase
      .from("circle_memberships")
      .select("user_id, role, status, joined_at, profiles(display_name)")
      .eq("circle_id", circleId)
      .eq("status", "approved");
    return (data || []).map((m) => ({
      userId: m.user_id,
      displayName: m.profiles?.display_name || "Unknown",
      role: m.role,
      joinedAt: m.joined_at,
    }));
  }, []);

  /* ── Refresh pending requests (call when returning to home screen) ── */
  const refreshPending = useCallback(async () => {
    if (!userId) return;
    // Get circles this user owns
    const { data: owned } = await supabase
      .from("circles")
      .select("id")
      .eq("created_by", userId);
    const ownedIds = (owned || []).map((c) => c.id);
    if (ownedIds.length > 0) {
      const { data: pending } = await supabase
        .from("circle_memberships")
        .select("id, circle_id, user_id, joined_at, circles(name), profiles(display_name)")
        .eq("status", "pending")
        .in("circle_id", ownedIds);
      setPendingRequests(pending || []);
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
    referrals,
    referralCode,
    referralUrl,
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
    ensureReferralCode,
    getMembers,
    refreshPending,
    pendingCount: pendingRequests.length,
  };
}
