import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { trackEvent } from "../utils/analytics";

/**
 * Manages multi-parent child access: shared kids, co-parents, invites, activity log.
 * Child-centric model — access is per-child, not per-group.
 */
export function useChildAccess(userId, session) {
  const [childAccessMap, setChildAccessMap] = useState({});   // { childId: [{ userId, displayName, role, joinedAt }] }
  const [sharedKids, setSharedKids] = useState([]);            // Kids shared with this user (not created by them)
  const [pendingInvites, setPendingInvites] = useState([]);     // Active invites the user created
  const [activityLog, setActivityLog] = useState([]);           // Recent changes by co-parents
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastViewed, setLastViewed] = useState(() => {
    try { return localStorage.getItem("skeddo-activity-last-viewed") || null; } catch { return null; }
  });

  const getAuthHeaders = useCallback(() => {
    const token = session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [session]);

  /* ── Load child access data ── */
  useEffect(() => {
    if (!userId) return;

    async function load() {
      // 1. Get child_access rows for children this user has access to
      // First get my child IDs, then get all adults for those children
      const { data: myAccessRows } = await supabase
        .from("child_access")
        .select("child_id")
        .eq("user_id", userId);

      if (!myAccessRows || myAccessRows.length === 0) return;

      const myChildIds = myAccessRows.map((r) => r.child_id);

      // Now get all access rows for those children (to find co-parents)
      const { data: accessRows } = await supabase
        .from("child_access")
        .select("child_id, user_id, role, invited_by, joined_at")
        .in("child_id", myChildIds)
        .order("joined_at", { ascending: true });

      if (!accessRows) return;

      const accessMap = {};
      for (const childId of myChildIds) {
        const adults = accessRows.filter((r) => r.child_id === childId);
        // Fetch display names for all adults
        const userIds = adults.map((a) => a.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", userIds);

        const nameMap = {};
        (profiles || []).forEach((p) => { nameMap[p.id] = p.display_name; });

        accessMap[childId] = adults.map((a) => ({
          userId: a.user_id,
          displayName: nameMap[a.user_id] || "Unknown",
          role: a.role,
          joinedAt: a.joined_at,
          invitedBy: a.invited_by,
        }));
      }
      setChildAccessMap(accessMap);

      // 2. Load shared kids (kids this user didn't create but has access to)
      const sharedChildIds = accessRows
        .filter((r) => r.user_id === userId && r.role === "member")
        .map((r) => r.child_id);

      if (sharedChildIds.length > 0) {
        const { data: sharedKidsData } = await supabase
          .from("kids")
          .select("*")
          .in("id", sharedChildIds);
        setSharedKids(
          (sharedKidsData || []).map((row) => ({
            id: row.id,
            name: row.name,
            age: row.age,
            notes: row.notes || "",
            color: row.color || "",
            interests: row.interests || [],
            isShared: true,
          }))
        );
      }

      // 3. Load pending invites created by this user
      const { data: invites } = await supabase
        .from("child_invite")
        .select("*, kids(name)")
        .eq("created_by", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      setPendingInvites(invites || []);

      // 4. Load recent activity log for all accessible children
      if (myChildIds.length > 0) {
        const { data: logs } = await supabase
          .from("activity_log")
          .select("*")
          .in("child_id", myChildIds)
          .neq("user_id", userId)  // Only changes by others
          .order("created_at", { ascending: false })
          .limit(20);

        setActivityLog(logs || []);

        // Count unread
        if (lastViewed && logs) {
          const unread = logs.filter((l) => new Date(l.created_at) > new Date(lastViewed));
          setUnreadCount(unread.length);
        } else {
          setUnreadCount(logs?.length || 0);
        }
      }
    }

    load();
  }, [userId, lastViewed]);

  /* ── Get co-parents for a specific child ── */
  const getCoParents = useCallback(
    (childId) => (childAccessMap[childId] || []).filter((a) => a.userId !== userId),
    [childAccessMap, userId]
  );

  /* ── Create invite link ── */
  const createInvite = useCallback(
    async (childIdOrIds) => {
      // Support both single childId and array of childIds
      const body = Array.isArray(childIdOrIds)
        ? { childIds: childIdOrIds }
        : { childId: childIdOrIds };
      const res = await fetch("/api/invite-create", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      trackEvent("invite_coparent");
      // Add to pending invites
      if (data.invites) {
        setPendingInvites((prev) => [...data.invites, ...prev]);
      } else if (data.invite) {
        setPendingInvites((prev) => [data.invite, ...prev]);
      }
      return data;
    },
    [getAuthHeaders]
  );

  /* ── Revoke an invite ── */
  const revokeInvite = useCallback(
    async (inviteId) => {
      const res = await fetch("/api/invite-revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ inviteId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPendingInvites((prev) => prev.filter((i) => i.id !== inviteId));
      return data;
    },
    [getAuthHeaders]
  );

  /* ── Remove someone's access ── */
  const removeAccess = useCallback(
    async (childId, targetUserId) => {
      const { error } = await supabase
        .from("child_access")
        .delete()
        .eq("child_id", childId)
        .eq("user_id", targetUserId);

      if (error) throw error;

      // Update local state
      setChildAccessMap((prev) => ({
        ...prev,
        [childId]: (prev[childId] || []).filter((a) => a.userId !== targetUserId),
      }));
    },
    []
  );

  /* ── Mark activity as viewed ── */
  const markActivityViewed = useCallback(() => {
    const now = new Date().toISOString();
    setLastViewed(now);
    setUnreadCount(0);
    try { localStorage.setItem("skeddo-activity-last-viewed", now); } catch {}
  }, []);

  /* ── Dismiss a single activity notification ── */
  const dismissActivity = useCallback(
    async (entryId) => {
      if (!entryId) return;
      setActivityLog((prev) => prev.filter((e) => e.id !== entryId));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      await supabase.from("activity_log").delete().eq("id", entryId);
    },
    []
  );

  /* ── Dismiss all activity notifications ── */
  const dismissAllActivity = useCallback(
    async () => {
      const ids = activityLog.map((e) => e.id).filter(Boolean);
      if (ids.length === 0) return;
      setActivityLog([]);
      setUnreadCount(0);
      await supabase.from("activity_log").delete().in("id", ids);
    },
    [activityLog]
  );

  /* ── Log an activity (called when user adds/edits/removes a program) ── */
  const logActivity = useCallback(
    async (programId, childId, action, details = {}, userName = "") => {
      if (!userId || !childId) return;
      await supabase.from("activity_log").insert({
        program_id: programId,
        child_id: childId,
        user_id: userId,
        user_name: userName,
        action,
        details,
      });
    },
    [userId]
  );

  return {
    childAccessMap,
    sharedKids,
    pendingInvites,
    activityLog,
    unreadCount,
    getCoParents,
    createInvite,
    revokeInvite,
    removeAccess,
    markActivityViewed,
    dismissActivity,
    dismissAllActivity,
    logActivity,
  };
}
