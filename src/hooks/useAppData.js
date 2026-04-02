import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "../lib/supabase";
import { STORAGE_KEY, uid } from "../constants/sampleData";
import { KID_COLORS } from "../constants/brand";
import { trackEvent } from "../utils/analytics";

/* ─── CURRENCY FORMATTER ─── */
export const fmt$ = (n) =>
  n === "TBD" ? "TBD" :
  Number(n || 0).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

/* ─── LOCAL STORAGE KEYS (fallback) ─── */
const ONBOARDED_KEY = "skeddo-onboarded";
const FAVORITES_KEY = "skeddo-favorites";
const PROFILE_KEY = "skeddo-profile";
const LAST_SYNCED_KEY = "skeddo_last_synced";

/* ─── FIELD MAPPING: localStorage (camelCase) ↔ Supabase (snake_case) ─── */
const programToDb = (p, userId) => ({
  id: p.id,
  user_id: userId,
  name: p.name,
  provider: p.provider || "",
  category: p.category || "Sports",
  status: p.status || "Exploring",
  cost: Number(p.cost) || 0,
  days: p.days || "",
  times: p.times || "",
  start_date: p.startDate || null,
  end_date: p.endDate || null,
  season_type: p.seasonType || "",
  camp_type: p.campType || "",
  age_min: p.ageMin != null ? Number(p.ageMin) : null,
  age_max: p.ageMax != null ? Number(p.ageMax) : null,
  location: p.location || "",
  neighbourhood: p.neighbourhood || "",
  registration_url: p.registrationUrl || "",
  notes: p.notes || "",
  rating: p.rating != null ? Number(p.rating) : null,
  review: p.review || "",
  kid_ids: p.kidIds || [],
  added_by: p.addedBy || userId,
  added_by_name: p.addedByName || "",
});

const programFromDb = (row) => ({
  id: row.id,
  name: row.name,
  provider: row.provider || "",
  category: row.category || "Sports",
  status: row.status || "Exploring",
  cost: Number(row.cost) || 0,
  days: row.days || "",
  times: row.times || "",
  startDate: row.start_date || "",
  endDate: row.end_date || "",
  seasonType: row.season_type || "",
  campType: row.camp_type || "",
  ageMin: row.age_min,
  ageMax: row.age_max,
  location: row.location || "",
  neighbourhood: row.neighbourhood || "",
  registrationUrl: row.registration_url || "",
  notes: row.notes || "",
  rating: row.rating != null ? Number(row.rating) : null,
  review: row.review || "",
  kidIds: row.kid_ids || [],
  addedBy: row.added_by || null,
  addedByName: row.added_by_name || "",
});

const kidToDb = (k, userId) => ({
  id: k.id,
  user_id: userId,
  name: k.name,
  age: k.age != null ? Number(k.age) : null,
  notes: k.notes || "",
  color: k.color || "",
  interests: k.interests || [],
  budget_goal: k.budgetGoal != null ? Number(k.budgetGoal) : null,
  birth_month: k.birthMonth || null,
  birth_year: k.birthYear || null,
});

const kidFromDb = (row) => ({
  id: row.id,
  name: row.name,
  age: row.age,
  notes: row.notes || "",
  color: row.color || "",
  interests: row.interests || [],
  budgetGoal: row.budget_goal || null,
  birthMonth: row.birth_month || null,
  birthYear: row.birth_year || null,
});

const profileToDb = (p, userId) => ({
  id: userId,
  display_name: p.displayName || "",
  postal_code: p.postalCode || "",
  budget_goal: Number(p.budgetGoal) || 0,
  plan: p.plan || "free",
  is_beta_user: p.isBetaUser || false,
  notify_registration: p.notifyRegistration !== false,
  notify_new_programs: p.notifyNewPrograms !== false,
  notify_weekly_summary: p.notifyWeeklySummary !== false,
  notify_upcoming_programs: p.notifyUpcomingPrograms !== false,
  notify_circle_activity: p.notifyCircleActivity !== false,
  notify_favourite_updates: p.notifyFavouriteUpdates !== false,
  notify_waitlist_alerts: p.notifyWaitlistAlerts !== false,
  notify_budget_milestones: p.notifyBudgetMilestones !== false,
  notify_circle_requests: p.notifyCircleRequests !== false,
  favorites: p._favorites || [],
  onboarded: true,
});

const profileFromDb = (row) => ({
  displayName: row.display_name || "",
  postalCode: row.postal_code || "",
  budgetGoal: row.budget_goal || "",
  plan: row.plan || "free",
  isBetaUser: row.is_beta_user || false,
  notifyRegistration: row.notify_registration !== false,
  notifyNewPrograms: row.notify_new_programs !== false,
  notifyWeeklySummary: row.notify_weekly_summary !== false,
  notifyUpcomingPrograms: row.notify_upcoming_programs !== false,
  notifyCircleActivity: row.notify_circle_activity !== false,
  notifyFavouriteUpdates: row.notify_favourite_updates !== false,
  notifyWaitlistAlerts: row.notify_waitlist_alerts !== false,
  notifyBudgetMilestones: row.notify_budget_milestones !== false,
  notifyCircleRequests: row.notify_circle_requests !== false,
});

/* ─── DIRECTORY CACHE for merging fresh catalog data into user programs ─── */
let _dirLookup = null;
const loadDirectoryLookup = () => {
  if (_dirLookup) return Promise.resolve(_dirLookup);
  return import("../data/programs.json").then((m) => {
    const map = {};
    for (const p of m.default) {
      const key = `${(p.name || "").toLowerCase()}|||${(p.provider || "").toLowerCase()}`;
      if (!map[key]) map[key] = p;
    }
    _dirLookup = map;
    return map;
  });
};

// Fields that belong to the catalog and should always reflect the latest programs.json
const CATALOG_FIELDS = [
  "days", "times", "seasonType", "campType",
  "ageMin", "ageMax", "location", "neighbourhood", "registrationUrl", "category",
  "name", "provider",
];

/* ─── HOOK ─── */
export function useAppData(userId) {
  const [programs, setPrograms] = useState([]);
  const [directoryLookup, setDirectoryLookup] = useState(null);
  const [kids, setKids] = useState([]);
  const [manualCosts, setManualCosts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("home");
  const [statusFilter, setStatusFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [kidFilter, setKidFilter] = useState(null);
  const [onboarded, setOnboarded] = useState(() => {
    try { return localStorage.getItem(ONBOARDED_KEY) === "true"; } catch { return false; }
  });
  const [favorites, setFavorites] = useState(() => {
    try { const s = localStorage.getItem(FAVORITES_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [profile, setProfile] = useState(() => {
    try { const s = localStorage.getItem(PROFILE_KEY); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [lastSynced, setLastSynced] = useState(() => {
    try { const t = localStorage.getItem(LAST_SYNCED_KEY); return t ? Number(t) : null; } catch { return null; }
  });

  const markSynced = useCallback(() => {
    const now = Date.now();
    setLastSynced(now);
    try { localStorage.setItem(LAST_SYNCED_KEY, String(now)); } catch {}
  }, []);

  // Track whether we're using Supabase or localStorage
  const usingSupabase = useRef(false);
  // Prevent save loops during initial load
  const initialLoadDone = useRef(false);

  /* ── Load directory lookup for catalog field merging ── */
  useEffect(() => {
    loadDirectoryLookup().then(setDirectoryLookup);
  }, []);

  /* ══════════════════════════════════════════════
     LOAD: Try Supabase first, fall back to localStorage
     ══════════════════════════════════════════════ */
  useEffect(() => {
    if (!userId) {
      // No user — load from localStorage only
      loadFromLocalStorage();
      return;
    }

    async function loadFromSupabase() {
      // Prevent auto-save from persisting empty state during reload
      initialLoadDone.current = false;
      try {
        // Load profile
        const { data: profileData, error: profileErr } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileErr && profileErr.code !== "PGRST116") {
          // PGRST116 = no rows found (not an error for us)
          console.warn("Supabase profile load error:", profileErr);
          throw profileErr;
        }

        // Load kids
        const { data: kidsData, error: kidsErr } = await supabase
          .from("kids")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: true });

        if (kidsErr) {
          console.warn("Supabase kids load error:", kidsErr);
          throw kidsErr;
        }

        // Load programs
        const { data: programsData, error: programsErr } = await supabase
          .from("user_programs")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: true });

        if (programsErr) {
          console.warn("Supabase programs load error:", programsErr);
          throw programsErr;
        }

        // Load manual costs
        const { data: costsData } = await supabase
          .from("manual_costs")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        setManualCosts((costsData || []).map((c) => ({
          id: c.id,
          description: c.description,
          amount: Number(c.amount),
          category: c.category,
          kidId: c.kid_id,
          date: c.date,
        })));

        usingSupabase.current = true;

        // If Supabase has data, use it
        if (profileData) {
          const prof = profileFromDb(profileData);
          setProfile(prof);
          setOnboarded(profileData.onboarded === true);
          setFavorites(profileData.favorites || []);

          // Also update localStorage as cache
          try {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(prof));
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(profileData.favorites || []));
            if (profileData.onboarded) localStorage.setItem(ONBOARDED_KEY, "true");
          } catch {}
        } else {
          // Profile row doesn't exist yet or has no extra fields
          // Check if localStorage has data to migrate up
          const localProfile = tryParseJson(localStorage.getItem(PROFILE_KEY), {});
          const localOnboarded = localStorage.getItem(ONBOARDED_KEY) === "true";
          const localFavorites = tryParseJson(localStorage.getItem(FAVORITES_KEY), []);

          if (localOnboarded && Object.keys(localProfile).length > 0) {
            // Migrate localStorage profile to Supabase
            await migrateProfileToSupabase(userId, localProfile, localFavorites);
            setProfile(localProfile);
            setOnboarded(true);
            setFavorites(localFavorites);
          }
        }

        // Set kids from Supabase
        const mappedKids = (kidsData || []).map(kidFromDb);
        if (mappedKids.length > 0) {
          setKids(mappedKids);
          // Ensure child_access rows exist for owner (needed for co-parent features)
          const kidIds = mappedKids.map((k) => k.id);
          const { data: existingAccess } = await supabase
            .from("child_access")
            .select("child_id")
            .eq("user_id", userId)
            .in("child_id", kidIds);
          const hasAccess = new Set((existingAccess || []).map((r) => r.child_id));
          for (const kid of mappedKids) {
            if (!hasAccess.has(kid.id)) {
              supabase.from("child_access")
                .insert({ child_id: kid.id, user_id: userId, role: "creator" })
                .then(({ error }) => { if (error) console.warn("child_access seed:", error.message); });
            }
          }
        } else {
          // Only migrate from localStorage if data belongs to this user
          const localData = tryParseJson(localStorage.getItem(STORAGE_KEY), {});
          const localUserId = localData._userId;
          if (localUserId === userId && localData.kids && localData.kids.length > 0) {
            setKids(localData.kids);
            await migrateKidsToSupabase(userId, localData.kids);
          } else {
            setKids([]);
          }
        }

        // Set programs from Supabase
        const mappedPrograms = (programsData || []).map(programFromDb);
        if (mappedPrograms.length > 0) {
          setPrograms(mappedPrograms);
        } else {
          const localData = tryParseJson(localStorage.getItem(STORAGE_KEY), {});
          const localUserId = localData._userId;
          if (localUserId === userId && localData.programs && localData.programs.length > 0) {
            setPrograms(localData.programs);
            await migrateProgramsToSupabase(userId, localData.programs);
          } else {
            setPrograms([]);
          }
        }

        markSynced();
        setLoaded(true);
        initialLoadDone.current = true;

      } catch (err) {
        console.warn("Falling back to localStorage:", err);
        usingSupabase.current = false;
        loadFromLocalStorage();
      }
    }

    loadFromSupabase();
  }, [userId]);

  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        setPrograms(d.programs || []);
        setKids(d.kids || []);
      }
    } catch {}
    setLoaded(true);
    initialLoadDone.current = true;
  }

  /* ══════════════════════════════════════════════
     AUTO-SAVE: Write to both Supabase and localStorage
     ══════════════════════════════════════════════ */

  // Save programs + kids to localStorage (always, as cache), tagged with userId
  useEffect(() => {
    if (!initialLoadDone.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ programs, kids, _userId: userId }));
    } catch {}
  }, [programs, kids, userId]);

  // Save favorites to localStorage + Supabase (debounced)
  const favoritesTimerRef = useRef(null);
  useEffect(() => {
    if (!initialLoadDone.current) return;
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {}
    // Debounce Supabase write
    if (usingSupabase.current && userId) {
      if (favoritesTimerRef.current) clearTimeout(favoritesTimerRef.current);
      favoritesTimerRef.current = setTimeout(() => {
        supabase
          .from("profiles")
          .update({ favorites })
          .eq("id", userId)
          .then(({ error }) => {
            if (error) console.warn("Failed to save favorites to Supabase:", error);
            else markSynced();
          });
      }, 500);
    }
    return () => { if (favoritesTimerRef.current) clearTimeout(favoritesTimerRef.current); };
  }, [favorites, userId]);

  // Save profile to localStorage + Supabase (debounced)
  const profileTimerRef = useRef(null);
  useEffect(() => {
    if (!initialLoadDone.current) return;
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {}
    // Debounce Supabase write
    if (usingSupabase.current && userId) {
      if (profileTimerRef.current) clearTimeout(profileTimerRef.current);
      profileTimerRef.current = setTimeout(() => {
        const dbProfile = {
          display_name: profile.displayName || "",
          postal_code: profile.postalCode || "",
          budget_goal: Number(profile.budgetGoal) || 0,
          plan: profile.plan || "free",
          notify_registration: profile.notifyRegistration !== false,
          notify_new_programs: profile.notifyNewPrograms !== false,
          notify_weekly_summary: profile.notifyWeeklySummary !== false,
          notify_upcoming_programs: profile.notifyUpcomingPrograms !== false,
          notify_circle_activity: profile.notifyCircleActivity !== false,
          notify_favourite_updates: profile.notifyFavouriteUpdates !== false,
          notify_waitlist_alerts: profile.notifyWaitlistAlerts !== false,
          notify_budget_milestones: profile.notifyBudgetMilestones !== false,
          notify_circle_requests: profile.notifyCircleRequests !== false,
        };
        supabase
          .from("profiles")
          .update(dbProfile)
          .eq("id", userId)
          .then(({ error }) => {
            if (error) console.warn("Failed to save profile to Supabase:", error);
            else markSynced();
          });
      }, 500);
    }
    return () => { if (profileTimerRef.current) clearTimeout(profileTimerRef.current); };
  }, [profile, userId]);

  /* ══════════════════════════════════════════════
     MIGRATION HELPERS: Push localStorage data to Supabase
     ══════════════════════════════════════════════ */

  async function migrateProfileToSupabase(uid, prof, favs) {
    try {
      await supabase
        .from("profiles")
        .update({
          display_name: prof.displayName || "",
          postal_code: prof.postalCode || "",
          budget_goal: Number(prof.budgetGoal) || 0,
          plan: prof.plan || "free",
          notify_registration: prof.notifyRegistration !== false,
          notify_new_programs: prof.notifyNewPrograms !== false,
          notify_weekly_summary: prof.notifyWeeklySummary !== false,
          notify_upcoming_programs: prof.notifyUpcomingPrograms !== false,
          notify_circle_activity: prof.notifyCircleActivity !== false,
          notify_favourite_updates: prof.notifyFavouriteUpdates !== false,
          notify_waitlist_alerts: prof.notifyWaitlistAlerts !== false,
          notify_budget_milestones: prof.notifyBudgetMilestones !== false,
          notify_circle_requests: prof.notifyCircleRequests !== false,
          favorites: favs || [],
          onboarded: true,
        })
        .eq("id", uid);
    } catch (err) {
      console.warn("Profile migration failed:", err);
    }
  }

  async function migrateKidsToSupabase(uid, localKids) {
    try {
      const rows = localKids.map((k) => kidToDb(k, uid));
      await supabase.from("kids").upsert(rows, { onConflict: "id" });
    } catch (err) {
      console.warn("Kids migration failed:", err);
    }
  }

  async function migrateProgramsToSupabase(uid, localPrograms) {
    try {
      const rows = localPrograms.map((p) => programToDb(p, uid));
      await supabase.from("user_programs").upsert(rows, { onConflict: "id" });
    } catch (err) {
      console.warn("Programs migration failed:", err);
    }
  }

  /* ══════════════════════════════════════════════
     FAVORITES
     ══════════════════════════════════════════════ */
  const toggleFavorite = useCallback((programId) => {
    setFavorites((prev) => {
      const removing = prev.includes(programId);
      trackEvent("toggle_favorite", { action: removing ? "unfavorite" : "favorite" });
      return removing ? prev.filter((id) => id !== programId) : [...prev, programId];
    });
  }, []);

  const isFavorite = useCallback(
    (programId) => favorites.includes(programId),
    [favorites]
  );

  /* ══════════════════════════════════════════════
     ONBOARDING
     ══════════════════════════════════════════════ */
  const completeOnboarding = useCallback(() => {
    setOnboarded(true);
    // Mark as beta user so they get Plus for life
    setProfile((prev) => ({ ...prev, isBetaUser: true }));
    try { localStorage.setItem(ONBOARDED_KEY, "true"); } catch {}
    if (usingSupabase.current && userId) {
      supabase.from("profiles").update({ onboarded: true, is_beta_user: true }).eq("id", userId)
        .then(({ error }) => { if (error) console.warn("Failed to save onboarded:", error); else markSynced(); });
    }
  }, [userId, markSynced]);

  /* ══════════════════════════════════════════════
     COMPUTED LISTS
     ══════════════════════════════════════════════ */

  // Merge each user-saved program with the latest catalog data from programs.json.
  // User-owned fields (status, kidIds, notes, cost, rating, review) are preserved;
  // catalog fields (dates, times, location, etc.) are refreshed from the directory.
  const mergedPrograms = useMemo(() => {
    if (!directoryLookup) return programs;
    return programs.map((userProg) => {
      const key = `${(userProg.name || "").toLowerCase()}|||${(userProg.provider || "").toLowerCase()}`;
      const dirProg = directoryLookup[key];
      if (!dirProg) return userProg;
      const freshCatalogFields = {};
      for (const field of CATALOG_FIELDS) {
        if (dirProg[field] !== undefined) freshCatalogFields[field] = dirProg[field];
      }
      return {
        ...userProg,
        ...freshCatalogFields,
        // Always keep the user's own fields
        id: userProg.id,
        status: userProg.status,
        kidIds: userProg.kidIds,
        notes: userProg.notes,
        cost: userProg.cost,
        rating: userProg.rating,
        review: userProg.review,
        addedBy: userProg.addedBy,
        addedByName: userProg.addedByName,
      };
    });
  }, [programs, directoryLookup]);

  const enrolledPrograms = useMemo(
    () => mergedPrograms.filter((p) => p.status === "Enrolled"), [mergedPrograms]
  );
  const waitlistPrograms = useMemo(
    () => mergedPrograms.filter((p) => p.status === "Waitlist"), [mergedPrograms]
  );
  const exploringPrograms = useMemo(
    () => mergedPrograms.filter((p) => p.status === "Exploring"), [mergedPrograms]
  );
  const totalCostEnrolled = useMemo(
    () => enrolledPrograms.reduce((sum, p) => sum + Number(p.cost || 0), 0), [enrolledPrograms]
  );
  const totalCostAll = useMemo(
    () => mergedPrograms.reduce((sum, p) => sum + Number(p.cost || 0), 0), [mergedPrograms]
  );

  const filteredPrograms = useMemo(() => {
    let list = mergedPrograms;
    if (kidFilter) list = list.filter((p) => (p.kidIds || []).includes(kidFilter));
    if (statusFilter !== "All") list = list.filter((p) => p.status === statusFilter);
    if (catFilter !== "All") list = list.filter((p) => p.category === catFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.provider || "").toLowerCase().includes(q) ||
        (p.location || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [mergedPrograms, kidFilter, statusFilter, catFilter, searchQuery]);

  /* ══════════════════════════════════════════════
     CRUD: Programs
     ══════════════════════════════════════════════ */
  const saveProgram = useCallback((form) => {
    const programId = form.id || uid();
    const program = { ...form, id: programId };

    setPrograms((prev) => {
      const existing = prev.find((p) => p.id === programId);
      if (!existing) {
        trackEvent("add_program", { program_name: program.name, provider: program.provider || "", status: program.status || "Exploring" });
      }
      if (existing) return prev.map((p) => (p.id === programId ? { ...p, ...program } : p));
      return [...prev, program];
    });

    // Save to Supabase
    if (usingSupabase.current && userId) {
      const row = programToDb(program, userId);
      supabase.from("user_programs").upsert(row, { onConflict: "id" })
        .then(({ error }) => { if (error) console.warn("Failed to save program:", error); else markSynced(); });
    }
  }, [userId, markSynced]);

  const deleteProgram = useCallback((id) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    if (usingSupabase.current && userId) {
      supabase.from("user_programs").delete().eq("id", id)
        .then(({ error }) => { if (error) console.warn("Failed to delete program:", error); else markSynced(); });
    }
  }, [userId, markSynced]);

  const cycleStatus = useCallback((id) => {
    const order = ["Enrolled", "Waitlist", "Exploring"];
    setPrograms((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const idx = order.indexOf(p.status);
        const next = order[(idx + 1) % order.length];
        trackEvent("change_status", { new_status: next });
        const updated = { ...p, status: next };
        // Save to Supabase
        if (usingSupabase.current && userId) {
          supabase.from("user_programs").update({ status: next }).eq("id", id)
            .then(({ error }) => { if (error) console.warn("Failed to cycle status:", error); else markSynced(); });
        }
        return updated;
      })
    );
  }, [userId, markSynced]);

  const setStatus = useCallback((id, status) => {
    setPrograms((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        trackEvent("change_status", { new_status: status });
        const updated = { ...p, status };
        if (usingSupabase.current && userId) {
          supabase.from("user_programs").update({ status }).eq("id", id)
            .then(({ error }) => { if (error) console.warn("Failed to set status:", error); else markSynced(); });
        }
        return updated;
      })
    );
  }, [userId, markSynced]);

  /* ══════════════════════════════════════════════
     CRUD: Kids
     ══════════════════════════════════════════════ */
  const saveKid = useCallback((form) => {
    const kidId = form.id || uid();
    const kid = { ...form, id: kidId };

    setKids((prev) => {
      const existing = prev.find((k) => k.id === kidId);
      if (!existing) {
        trackEvent("add_child", { child_name: kid.name });
      }
      // Auto-assign color for new kids if not already set
      if (!existing && !kid.color) {
        const usedColors = new Set(prev.map((k) => k.color));
        const available = KID_COLORS.find((c) => !usedColors.has(c.hex));
        kid.color = available ? available.hex : KID_COLORS[prev.length % KID_COLORS.length].hex;
      }
      // Save to Supabase AFTER color assignment so the DB gets the correct color
      if (usingSupabase.current && userId) {
        const row = kidToDb(kid, userId);
        supabase.from("kids").upsert(row, { onConflict: "id" })
          .then(({ error }) => {
            if (error) { console.warn("Failed to save kid:", error); return; }
            markSynced();
            // Ensure owner has a child_access row (required for co-parent features)
            if (!existing) {
              supabase.from("child_access")
                .insert({ child_id: kidId, user_id: userId, role: "creator" })
                .then(({ error: caErr }) => { if (caErr && caErr.code !== "23505") console.warn("Failed to create child_access:", caErr); });
            }
          });
      }
      if (existing) return prev.map((k) => (k.id === kidId ? { ...k, ...kid } : k));
      return [...prev, kid];
    });
  }, [userId, markSynced]);

  const deleteKid = useCallback((id) => {
    setKids((prev) => prev.filter((k) => k.id !== id));
    setPrograms((prev) => {
      const updated = prev.map((p) => ({
        ...p,
        kidIds: (p.kidIds || []).filter((kid) => kid !== id),
      }));
      // Sync cleaned kidIds to Supabase for affected programs
      if (usingSupabase.current && userId) {
        updated.forEach((p) => {
          const original = prev.find((op) => op.id === p.id);
          if (original && (original.kidIds || []).includes(id)) {
            supabase
              .from("user_programs")
              .update({ kid_ids: p.kidIds })
              .eq("id", p.id)
              .then(({ error }) => {
                if (error) console.warn("Failed to update program kidIds:", error);
              });
          }
        });
      }
      return updated;
    });
    if (usingSupabase.current && userId) {
      supabase.from("kids").delete().eq("id", id)
        .then(({ error }) => { if (error) console.warn("Failed to delete kid:", error); else markSynced(); });
    }
  }, [userId, markSynced]);

  /* ── Manual cost entries ── */
  const saveManualCost = useCallback((cost) => {
    const id = cost.id || uid();
    setManualCosts((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...cost, id };
        return updated;
      }
      return [{ ...cost, id }, ...prev];
    });
    if (usingSupabase.current && userId) {
      supabase.from("manual_costs").upsert({
        id,
        user_id: userId,
        kid_id: cost.kidId || null,
        description: cost.description,
        amount: cost.amount,
        category: cost.category || "Other",
        date: cost.date || null,
      }, { onConflict: "id" })
        .then(({ error }) => { if (error) console.warn("Failed to save manual cost:", error); else markSynced(); });
    }
  }, [userId, markSynced]);

  const deleteManualCost = useCallback((id) => {
    setManualCosts((prev) => prev.filter((c) => c.id !== id));
    if (usingSupabase.current && userId) {
      supabase.from("manual_costs").delete().eq("id", id)
        .then(({ error }) => { if (error) console.warn("Failed to delete manual cost:", error); else markSynced(); });
    }
  }, [userId, markSynced]);

  return {
    programs: mergedPrograms, kids, loaded, tab, setTab,
    statusFilter, setStatusFilter, catFilter, setCatFilter,
    searchQuery, setSearchQuery, kidFilter, setKidFilter,
    onboarded, completeOnboarding,
    enrolledPrograms, waitlistPrograms, exploringPrograms,
    totalCostEnrolled, totalCostAll, filteredPrograms,
    favorites, toggleFavorite, isFavorite,
    profile, setProfile, lastSynced,
    saveProgram, deleteProgram, cycleStatus, setStatus, saveKid, deleteKid,
    manualCosts, saveManualCost, deleteManualCost,
  };
}

/* ─── Helper ─── */
function tryParseJson(str, fallback) {
  try { return str ? JSON.parse(str) : fallback; } catch { return fallback; }
}
