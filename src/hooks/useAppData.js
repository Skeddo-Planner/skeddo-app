import { useState, useEffect, useCallback, useMemo } from "react";
import { STORAGE_KEY, uid } from "../constants/sampleData";

/* ─── CURRENCY FORMATTER ─── */
export const fmt$ = (n) =>
  Number(n || 0).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

/* ─── ONBOARDING KEY ─── */
const ONBOARDED_KEY = "skeddo-onboarded";

/* ─── HOOK ─── */
export function useAppData() {
  const [programs, setPrograms] = useState([]);
  const [kids, setKids] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("home");
  const [statusFilter, setStatusFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [onboarded, setOnboarded] = useState(() => {
    try {
      return localStorage.getItem(ONBOARDED_KEY) === "true";
    } catch {
      return false;
    }
  });

  /* ── Load from localStorage on mount ── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        setPrograms(d.programs || []);
        setKids(d.kids || []);
      } else {
        setPrograms([]);
      }
    } catch {
      setPrograms([]);
    }
    setLoaded(true);
  }, []);

  /* ── Auto-save when programs or kids change ── */
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ programs, kids })
      );
    } catch {
      /* storage full — silently fail */
    }
  }, [programs, kids, loaded]);

  /* ── Persist onboarded flag ── */
  const completeOnboarding = useCallback(() => {
    setOnboarded(true);
    try {
      localStorage.setItem(ONBOARDED_KEY, "true");
    } catch {}
  }, []);

  /* ── Computed lists ── */
  const enrolledPrograms = useMemo(
    () => programs.filter((p) => p.status === "Enrolled"),
    [programs]
  );
  const waitlistPrograms = useMemo(
    () => programs.filter((p) => p.status === "Waitlist"),
    [programs]
  );
  const exploringPrograms = useMemo(
    () => programs.filter((p) => p.status === "Exploring"),
    [programs]
  );

  const totalCostEnrolled = useMemo(
    () => enrolledPrograms.reduce((sum, p) => sum + Number(p.cost || 0), 0),
    [enrolledPrograms]
  );
  const totalCostAll = useMemo(
    () => programs.reduce((sum, p) => sum + Number(p.cost || 0), 0),
    [programs]
  );

  const filteredPrograms = useMemo(() => {
    let list = programs;
    if (statusFilter !== "All") {
      list = list.filter((p) => p.status === statusFilter);
    }
    if (catFilter !== "All") {
      list = list.filter((p) => p.category === catFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.provider.toLowerCase().includes(q) ||
          (p.location || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [programs, statusFilter, catFilter, searchQuery]);

  /* ── CRUD: Programs ── */
  const saveProgram = useCallback((form) => {
    setPrograms((prev) => {
      const existing = prev.find((p) => p.id === form.id);
      if (existing) {
        return prev.map((p) => (p.id === form.id ? { ...p, ...form } : p));
      }
      return [...prev, { ...form, id: form.id || uid() }];
    });
  }, []);

  const deleteProgram = useCallback((id) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const cycleStatus = useCallback((id) => {
    const order = ["Enrolled", "Waitlist", "Exploring"];
    setPrograms((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const idx = order.indexOf(p.status);
        const next = order[(idx + 1) % order.length];
        return { ...p, status: next };
      })
    );
  }, []);

  /* ── CRUD: Kids ── */
  const saveKid = useCallback((form) => {
    setKids((prev) => {
      const existing = prev.find((k) => k.id === form.id);
      if (existing) {
        return prev.map((k) => (k.id === form.id ? { ...k, ...form } : k));
      }
      return [...prev, { ...form, id: form.id || uid() }];
    });
  }, []);

  const deleteKid = useCallback((id) => {
    setKids((prev) => prev.filter((k) => k.id !== id));
    // Also remove this kid from any program's kidIds
    setPrograms((prev) =>
      prev.map((p) => ({
        ...p,
        kidIds: (p.kidIds || []).filter((kid) => kid !== id),
      }))
    );
  }, []);

  return {
    // State
    programs,
    kids,
    loaded,
    tab,
    setTab,
    statusFilter,
    setStatusFilter,
    catFilter,
    setCatFilter,
    searchQuery,
    setSearchQuery,
    onboarded,
    completeOnboarding,

    // Computed
    enrolledPrograms,
    waitlistPrograms,
    exploringPrograms,
    totalCostEnrolled,
    totalCostAll,
    filteredPrograms,

    // CRUD
    saveProgram,
    deleteProgram,
    cycleStatus,
    saveKid,
    deleteKid,
  };
}
