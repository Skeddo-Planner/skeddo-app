import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "../lib/supabase";
import { STORAGE_KEY, uid } from "../constants/sampleData";

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
  kid_ids: p.kidIds || [],
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
  kidIds: row.kid_ids || [],
});

const kidToDb = (k, userId) => ({
  id: k.id,
  user_id: userId,
  name: k.name,
  age: k.age != null ? Number(k.age) : null,
  notes: k.notes || "",
});

const kidFromDb = (row) => ({
  id: row.id,
  name: row.name,
  age: row.age,
  notes: row.notes || "",
});

const profileToDb = (p, userId) => ({
  id: userId,
  display_name: p.displayName || "",
  postal_code: p.postalCode || "",
  budget_goal: Number(p.budgetGoal) || 0,
  plan: p.plan || "free",
  notify_registration: p.notifyRegistration !== false,
  notify_new_programs: p.notifyNewPrograms !== false,
  notify_weekly_summary: p.notifyWeeklySummary !== false,
  favorites: p._favorites || [],
  onboarded: true,
});

const profileFromDb = (row) => ({
  displayName: row.display_name || "",
  postalCode: row.postal_code || "",
  budgetGoal: row.budget_goal || "",
  plan: row.plan || "free",
  notifyRegistration: row.notify_registration !== false,
  notifyNewPrograms: row.notify_new_programs !== false,
  notifyWeeklySummary: row.notify_weekly_summary !== false,
});

/* ─── HOOK ─── */
export function useAppData(userId) {
  const [programs, setPrograms] = useState([]);
  const [kids, setKids] = useState([]);
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
        } else {
          // Check localStorage for kids to migrate
          const localData = tryParseJson(localStorage.getItem(STORAGE_KEY), {});
          if (localData.kids && localData.kids.length > 0) {
            setKids(localData.kids);
            // Migrate kids to Supabase
            await migrateKidsToSupabase(userId, localData.kids);
          }
        }

        // Set programs from Supabase
        const mappedPrograms = (programsData || []).map(programFromDb);
        if (mappedPrograms.length > 0) {
          setPrograms(mappedPrograms);
        } else {
          // Check localStorage for programs to migrate
          const localData = tryParseJson(localStorage.getItem(STORAGE_KEY), {});
          if (localData.programs && localData.programs.length > 0) {
            setPrograms(localData.programs);
            // Migrate programs to Supabase
            await migrateProgramsToSupabase(userId, localData.programs);
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

  // Save programs + kids to localStorage (always, as cache)
  useEffect(() => {
    if (!initialLoadDone.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ programs, kids }));
    } catch {}
  }, [programs, kids]);

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
    setFavorites((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId]
    );
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
    try { localStorage.setItem(ONBOARDED_KEY, "true"); } catch {}
    if (usingSupabase.current && userId) {
      supabase.from("profiles").update({ onboarded: true }).eq("id", userId)
        .then(({ error }) => { if (error) console.warn("Failed to save onboarded:", error); else markSynced(); });
    }
  }, [userId]);

  /* ══════════════════════════════════════════════
     COMPUTED LISTS
     ══════════════════════════════════════════════ */
  const enrolledPrograms = useMemo(
    () => programs.filter((p) => p.status === "Enrolled"), [programs]
  );
  const waitlistPrograms = useMemo(
    () => programs.filter((p) => p.status === "Waitlist"), [programs]
  );
  const exploringPrograms = useMemo(
    () => programs.filter((p) => p.status === "Exploring"), [programs]
  );
  const totalCostEnrolled = useMemo(
    () => enrolledPrograms.reduce((sum, p) => sum + Number(p.cost || 0), 0), [enrolledPrograms]
  );
  const totalCostAll = useMemo(
    () => programs.reduce((sum, p) => sum + Number(p.cost || 0), 0), [programs]
  );

  const filteredPrograms = useMemo(() => {
    let list = programs;
    if (kidFilter) list = list.filter((p) => (p.kidIds || []).includes(kidFilter));
    if (statusFilter !== "All") list = list.filter((p) => p.status === statusFilter);
    if (catFilter !== "All") list = list.filter((p) => p.category === catFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.provider.toLowerCase().includes(q) ||
        (p.location || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [programs, kidFilter, statusFilter, catFilter, searchQuery]);

  /* ══════════════════════════════════════════════
     CRUD: Programs
     ══════════════════════════════════════════════ */
  const saveProgram = useCallback((form) => {
    const programId = form.id || uid();
    const program = { ...form, id: programId };

    setPrograms((prev) => {
      const existing = prev.find((p) => p.id === programId);
      if (existing) return prev.map((p) => (p.id === programId ? { ...p, ...program } : p));
      return [...prev, program];
    });

    // Save to Supabase
    if (usingSupabase.current && userId) {
      const row = programToDb(program, userId);
      supabase.from("user_programs").upsert(row, { onConflict: "id" })
        .then(({ error }) => { if (error) console.warn("Failed to save program:", error); else markSynced(); });
    }
  }, [userId]);

  const deleteProgram = useCallback((id) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    if (usingSupabase.current && userId) {
      supabase.from("user_programs").delete().eq("id", id)
        .then(({ error }) => { if (error) console.warn("Failed to delete program:", error); else markSynced(); });
    }
  }, [userId]);

  const cycleStatus = useCallback((id) => {
    const order = ["Enrolled", "Waitlist", "Exploring"];
    setPrograms((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const idx = order.indexOf(p.status);
        const next = order[(idx + 1) % order.length];
        const updated = { ...p, status: next };
        // Save to Supabase
        if (usingSupabase.current && userId) {
          supabase.from("user_programs").update({ status: next }).eq("id", id)
            .then(({ error }) => { if (error) console.warn("Failed to cycle status:", error); else markSynced(); });
        }
        return updated;
      })
    );
  }, [userId]);

  /* ══════════════════════════════════════════════
     CRUD: Kids
     ══════════════════════════════════════════════ */
  const saveKid = useCallback((form) => {
    const kidId = form.id || uid();
    const kid = { ...form, id: kidId };

    setKids((prev) => {
      const existing = prev.find((k) => k.id === kidId);
      if (existing) return prev.map((k) => (k.id === kidId ? { ...k, ...kid } : k));
      return [...prev, kid];
    });

    // Save to Supabase
    if (usingSupabase.current && userId) {
      const row = kidToDb(kid, userId);
      supabase.from("kids").upsert(row, { onConflict: "id" })
        .then(({ error }) => { if (error) console.warn("Failed to save kid:", error); else markSynced(); });
    }
  }, [userId]);

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
  }, [userId]);

  return {
    programs, kids, loaded, tab, setTab,
    statusFilter, setStatusFilter, catFilter, setCatFilter,
    searchQuery, setSearchQuery, kidFilter, setKidFilter,
    onboarded, completeOnboarding,
    enrolledPrograms, waitlistPrograms, exploringPrograms,
    totalCostEnrolled, totalCostAll, filteredPrograms,
    favorites, toggleFavorite, isFavorite,
    profile, setProfile, lastSynced,
    saveProgram, deleteProgram, cycleStatus, saveKid, deleteKid,
  };
}

/* ─── Helper ─── */
function tryParseJson(str, fallback) {
  try { return str ? JSON.parse(str) : fallback; } catch { return fallback; }
}
