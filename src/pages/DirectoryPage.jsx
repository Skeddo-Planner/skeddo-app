import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { C, CATEGORIES, CAT_EMOJI } from "../constants/brand";
import useIsDesktop from "../hooks/useIsDesktop";
import usePageMeta from "../hooks/usePageMeta";
import FilterDrawer from "../components/FilterDrawer";
import FilterOptions from "../components/FilterOptions";
import {
  REGISTRATION_STATUSES,
  getRegistrationStatus,
  sortPrograms,
  calcCostPerHour,
} from "../utils/helpers";

/* ─── Filter constants (shared with DiscoverTab) ─── */

const COST_RANGES = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Free", min: 0, max: 0 },
  { label: "Inquire for pricing", min: -1, max: -1 },
  { label: "Under $100", min: 0.01, max: 100 },
  { label: "$100 - $250", min: 100, max: 250 },
  { label: "$250 - $500", min: 250, max: 500 },
  { label: "$500+", min: 500, max: Infinity },
];

const COST_PER_HOUR_RANGES = [
  { label: "Any $/hr", min: 0, max: Infinity },
  { label: "Under $5/hr", min: 0.01, max: 5 },
  { label: "$5 - $10/hr", min: 5, max: 10 },
  { label: "$10 - $15/hr", min: 10, max: 15 },
  { label: "$15 - $20/hr", min: 15, max: 20 },
  { label: "$20+/hr", min: 20, max: Infinity },
];

const SORT_OPTIONS = [
  { key: "relevance", label: "Relevance" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "az", label: "A-Z" },
];

const SUMMER_WEEKS = [
  { id: "w1", label: "Week 1", dateRange: "Jun 29 \u2013 Jul 3", monday: new Date(2026, 5, 29), friday: new Date(2026, 6, 3), statHolidays: [2], note: "Canada Day Jul 1" },
  { id: "w2", label: "Week 2", dateRange: "Jul 6 \u2013 Jul 10", monday: new Date(2026, 6, 6), friday: new Date(2026, 6, 10), statHolidays: [] },
  { id: "w3", label: "Week 3", dateRange: "Jul 13 \u2013 Jul 17", monday: new Date(2026, 6, 13), friday: new Date(2026, 6, 17), statHolidays: [] },
  { id: "w4", label: "Week 4", dateRange: "Jul 20 \u2013 Jul 24", monday: new Date(2026, 6, 20), friday: new Date(2026, 6, 24), statHolidays: [] },
  { id: "w5", label: "Week 5", dateRange: "Jul 27 \u2013 Jul 31", monday: new Date(2026, 6, 27), friday: new Date(2026, 6, 31), statHolidays: [] },
  { id: "w6", label: "Week 6", dateRange: "Aug 3 \u2013 Aug 7", monday: new Date(2026, 7, 3), friday: new Date(2026, 7, 7), statHolidays: [0], note: "BC Day Aug 3" },
  { id: "w7", label: "Week 7", dateRange: "Aug 10 \u2013 Aug 14", monday: new Date(2026, 7, 10), friday: new Date(2026, 7, 14), statHolidays: [] },
  { id: "w8", label: "Week 8", dateRange: "Aug 17 \u2013 Aug 21", monday: new Date(2026, 7, 17), friday: new Date(2026, 7, 21), statHolidays: [] },
  { id: "w9", label: "Week 9", dateRange: "Aug 24 \u2013 Aug 28", monday: new Date(2026, 7, 24), friday: new Date(2026, 7, 28), statHolidays: [] },
  { id: "w10", label: "Week 10", dateRange: "Aug 31 \u2013 Sep 4", monday: new Date(2026, 7, 31), friday: new Date(2026, 8, 4), statHolidays: [], note: "Last week before school" },
];

const CITY_NEIGHBOURHOODS = [
  { city: "Vancouver", neighbourhoods: ["Arbutus Ridge","Cambie","Chinatown","Coal Harbour","Commercial Drive","Downtown","Dunbar","Dunbar-Southlands","East Vancouver","Fairview","Fraserview","Grandview-Woodland","Granville Island","Hastings Park","Hastings-Sunrise","Kensington-Cedar Cottage","Kerrisdale","Killarney","Kitsilano","Main Street","Marpole","Mount Pleasant","Oakridge","Point Grey","Renfrew-Collingwood","Riley Park","Shaughnessy","South Cambie","South Vancouver","Stanley Park","Strathcona","Sunset","UBC","University Endowment Lands","Victoria-Fraserview","West End","West Point Grey","Yaletown"] },
  { city: "Burnaby", neighbourhoods: ["Brentwood","Burnaby Heights","Burnaby Mountain","Capitol Hill","Cariboo","Central Park","Deer Lake","Edmonds","Kensington","Lougheed","Metrotown","North Burnaby","SFU / UniverCity","South Slope","Sperling-Duthie"] },
  { city: "North Vancouver", neighbourhoods: ["Central Lonsdale","Deep Cove","Delbrook","Dollarton","Heights","Lower Capilano","Lower Lonsdale","Lynn Creek","Lynn Valley","Maplewood","Mount Seymour","Seymour","Upper Lonsdale"] },
  { city: "West Vancouver", neighbourhoods: ["Ambleside","British Properties","Gleneagles","West Vancouver"] },
  { city: "Richmond", neighbourhoods: ["Aberdeen","Bridgeport","Broadmoor","City Centre","East Cambie","East Richmond","Ironwood","Sea Island","South Arm","Steveston","Thompson"] },
  { city: "New Westminster", neighbourhoods: ["Downtown New West","Downtown New Westminster","Moody Park","Queens Park","Queensborough"] },
  { city: "Surrey", neighbourhoods: ["Cloverdale","Fleetwood","Green Timbers","Guildford","Newton","Panorama","South Surrey","Surrey City Centre","Whalley"] },
  { city: "Coquitlam", neighbourhoods: ["Burquitlam","Central Coquitlam","Maillardville"] },
  { city: "Port Coquitlam", neighbourhoods: ["Central Port Coquitlam","Port Coquitlam"] },
  { city: "Port Moody", neighbourhoods: ["Ioco","Port Moody"] },
  { city: "Maple Ridge", neighbourhoods: ["Maple Ridge","Town Centre"] },
  { city: "Delta", neighbourhoods: ["Delta","North Delta"] },
  { city: "Langley", neighbourhoods: ["Langley"] },
  { city: "White Rock", neighbourhoods: ["White Rock"] },
  { city: "Squamish", neighbourhoods: ["Squamish"] },
];

function programOverlapsWeek(program, weekMonday, weekFriday) {
  if (!program.startDate) return false;
  const pStart = new Date(program.startDate + "T00:00:00");
  const pEnd = program.endDate ? new Date(program.endDate + "T00:00:00") : pStart;
  return pStart <= weekFriday && pEnd >= weekMonday;
}

function FilterChip({ label, count, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 5,
      padding: "6px 12px", borderRadius: 20,
      border: active ? `1.5px solid ${C.ink}` : "1.5px solid rgba(27,36,50,0.15)",
      background: active ? C.ink : "#FFFFFF",
      color: active ? "#FFFFFF" : C.ink,
      fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: active ? 600 : 500,
      cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
      boxShadow: active ? "none" : "0 1px 3px rgba(27,36,50,0.04)",
      minHeight: 36,
    }}>
      {label}
      {count > 0 && (
        <span style={{
          background: active ? "#FFF" : C.seaGreen, color: active ? C.ink : "#fff",
          fontSize: 9, fontWeight: 700, width: 16, height: 16, borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{count}</span>
      )}
    </button>
  );
}

/**
 * Public directory pages for SEO.
 * These pages expose program data publicly so Google can crawl it.
 *
 * Routes:
 *   /camps                       — Main directory (browse by category, area, provider)
 *   /camps/category/:slug        — Category page
 *   /camps/area/:slug            — Area (city) page
 *   /camps/provider/:slug        — Provider page
 */

// Lazy-load the directory index (split from main bundle)
let _dirData = null;
function useDirectoryData() {
  const [data, setData] = useState(_dirData);
  useEffect(() => {
    if (_dirData) return;
    import("../data/directory-index.json").then((m) => {
      _dirData = m.default;
      setData(m.default);
    });
  }, []);
  return data;
}

// Lazy-load all programs from the slim Vercel Blob (same source as the in-app Discover tab)
const PROGRAMS_BLOB_URL = import.meta.env.VITE_PROGRAMS_URL || null;
let _cachedAllPrograms = null;
function useAllPrograms() {
  const [programs, setPrograms] = useState(_cachedAllPrograms || []);
  const [loading, setLoading] = useState(!_cachedAllPrograms);
  useEffect(() => {
    if (_cachedAllPrograms) return;
    if (!PROGRAMS_BLOB_URL) { setLoading(false); return; }
    fetch(PROGRAMS_BLOB_URL)
      .then((r) => r.json())
      .then((data) => { _cachedAllPrograms = data; setPrograms(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  return { programs, loading };
}

const PAGE_SIZE = 30;

// ── Shared styles ──
const font = "'Barlow', sans-serif";
const headFont = "'Poppins', sans-serif";

const pageWrap = (isDesktop) => ({
  background: C.cream,
  minHeight: "100dvh",
  fontFamily: font,
});

const container = (isDesktop) => ({
  maxWidth: 1100,
  margin: "0 auto",
  padding: isDesktop ? "0 48px 60px" : "0 20px 60px",
});

const heroStyle = (isDesktop) => ({
  background: "linear-gradient(135deg, #1B2432 0%, #2D9F6F 100%)",
  padding: isDesktop ? "48px 48px 40px" : "32px 20px 28px",
  color: "#fff",
});

const heroTitle = (isDesktop) => ({
  fontFamily: headFont,
  fontSize: isDesktop ? 36 : 26,
  fontWeight: 800,
  lineHeight: 1.2,
  marginBottom: 10,
  color: "#fff",
});

const heroSub = {
  fontSize: 16,
  lineHeight: 1.6,
  opacity: 0.9,
  maxWidth: 640,
  marginBottom: 0,
};

const sectionTitle = {
  fontFamily: headFont,
  fontSize: 22,
  fontWeight: 700,
  color: C.ink,
  marginBottom: 16,
  marginTop: 36,
};

const cardGrid = (isDesktop) => ({
  display: "grid",
  gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "repeat(2, 1fr)",
  gap: 12,
});

const card = {
  background: C.white,
  borderRadius: 12,
  padding: "16px 18px",
  boxShadow: "0 2px 8px rgba(27,36,50,0.07)",
  textDecoration: "none",
  color: C.ink,
  transition: "box-shadow 0.15s",
  display: "block",
};

const cardTitle = {
  fontFamily: font,
  fontSize: 15,
  fontWeight: 700,
  color: C.ink,
  marginBottom: 4,
  lineHeight: 1.3,
};

const cardMeta = {
  fontSize: 13,
  color: "#4A6FA5",
  lineHeight: 1.5,
};

const pillStyle = {
  display: "inline-block",
  background: "rgba(45,159,111,0.1)",
  color: C.seaGreen,
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 20,
  padding: "3px 10px",
  marginRight: 6,
  marginBottom: 6,
};

const ctaBox = (isDesktop) => ({
  background: "linear-gradient(135deg, #1B2432 0%, #2D9F6F 100%)",
  borderRadius: 16,
  padding: isDesktop ? "36px 40px" : "28px 20px",
  textAlign: "center",
  marginTop: 40,
});

const ctaTitle = {
  fontFamily: headFont,
  fontSize: 22,
  fontWeight: 700,
  color: "#fff",
  marginBottom: 10,
};

const ctaText = {
  fontSize: 15,
  color: "rgba(255,255,255,0.85)",
  lineHeight: 1.6,
  marginBottom: 20,
  maxWidth: 500,
  margin: "0 auto 20px",
};

const ctaBtn = {
  display: "inline-block",
  fontFamily: font,
  fontSize: 16,
  fontWeight: 700,
  color: C.ink,
  background: "#fff",
  borderRadius: 10,
  padding: "14px 32px",
  textDecoration: "none",
  cursor: "pointer",
};

const breadcrumb = {
  fontSize: 13,
  color: "rgba(255,255,255,0.7)",
  marginBottom: 12,
};

const breadcrumbLink = {
  color: "rgba(255,255,255,0.7)",
  textDecoration: "none",
};

// ── Shared Components ──

function SiteHeader({ isDesktop, onNavigate }) {
  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: C.white,
      borderBottom: "0.5px solid rgba(27,36,50,0.08)",
      padding: isDesktop ? "0 48px" : "0 16px",
      height: 56,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <img
          src="/skeddo-logo-dark.png"
          alt="Skeddo"
          style={{ height: 36, width: "auto", borderRadius: 8 }}
        />
      </Link>
      <nav style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Link to="/camps" style={{
          fontFamily: font,
          fontSize: 14,
          fontWeight: 600,
          color: C.ink,
          textDecoration: "none",
          padding: "8px 12px",
        }}>
          Browse Camps
        </Link>
        {/* Blog/Guides link hidden until posts are refined
        <Link to="/blog" style={{
          fontFamily: font,
          fontSize: 14,
          fontWeight: 600,
          color: C.ink,
          textDecoration: "none",
          padding: "8px 12px",
        }}>
          Guides
        </Link>
        */}
        <a
          href="/signin"
          onClick={(e) => { e.preventDefault(); onNavigate("signin"); }}
          style={{
            fontFamily: font,
            fontSize: 14,
            fontWeight: 600,
            color: C.seaGreen,
            background: "transparent",
            border: `1.5px solid ${C.seaGreen}`,
            borderRadius: 8,
            padding: "8px 16px",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Log In
        </a>
        <a
          href="/signup"
          onClick={(e) => { e.preventDefault(); onNavigate("signup"); }}
          style={{
            fontFamily: font,
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            background: C.seaGreen,
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Get Started Free
        </a>
      </nav>
    </header>
  );
}

function SiteFooter({ isDesktop }) {
  return (
    <footer style={{
      textAlign: "center",
      fontSize: 12,
      color: "#4A6FA5",
      padding: isDesktop ? "32px 48px" : "24px 20px",
      borderTop: `1px solid ${C.border}`,
      marginTop: 40,
    }}>
      <nav style={{ display: "flex", justifyContent: "center", gap: isDesktop ? 24 : 16, marginBottom: 10, flexWrap: "wrap" }}>
        <Link to="/camps" style={{ color: "#4A6FA5", textDecoration: "none", fontWeight: 600 }}>Browse Camps</Link>
        <Link to="/about" style={{ color: "#4A6FA5", textDecoration: "none", fontWeight: 600 }}>About</Link>
        <Link to="/privacy" style={{ color: "#4A6FA5", textDecoration: "none", fontWeight: 600 }}>Privacy & Terms</Link>
        <Link to="/help" style={{ color: "#4A6FA5", textDecoration: "none", fontWeight: 600 }}>Help & Contact</Link>
      </nav>
      <p>Made by Mended with Gold Inc. · Vancouver, BC</p>
    </footer>
  );
}

function CTASection({ isDesktop }) {
  return (
    <div style={ctaBox(isDesktop)}>
      <h2 style={ctaTitle}>Ready to plan your kids' summer?</h2>
      <p style={ctaText}>
        Sign up for free to save this to your planner, compare costs, and coordinate with other families.
      </p>
      <Link to="/signup" style={ctaBtn}>Get Started — It's Free</Link>
    </div>
  );
}

function ProgramTable({ programs, isDesktop, showProvider = true, onSelectProgram }) {
  if (!programs || programs.length === 0) return null;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: font,
        fontSize: 14,
      }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${C.border}`, textAlign: "left" }}>
            <th style={{ padding: "10px 12px", fontWeight: 700, color: C.ink }}>Program</th>
            {showProvider && <th style={{ padding: "10px 12px", fontWeight: 700, color: C.ink }}>Provider</th>}
            <th style={{ padding: "10px 12px", fontWeight: 700, color: C.ink }}>Ages</th>
            <th style={{ padding: "10px 12px", fontWeight: 700, color: C.ink }}>Price</th>
            {isDesktop && <th style={{ padding: "10px 12px", fontWeight: 700, color: C.ink }}>Schedule</th>}
            {isDesktop && <th style={{ padding: "10px 12px", fontWeight: 700, color: C.ink }}>Area</th>}
          </tr>
        </thead>
        <tbody>
          {programs.map((p, i) => (
            <tr
              key={i}
              style={{ borderBottom: `1px solid ${C.border}`, cursor: onSelectProgram ? "pointer" : "default" }}
              onClick={() => onSelectProgram?.(p)}
              onMouseEnter={(e) => { if (onSelectProgram) e.currentTarget.style.background = "#F8F9FA"; }}
              onMouseLeave={(e) => { if (onSelectProgram) e.currentTarget.style.background = ""; }}
            >
              <td style={{ padding: "10px 12px", color: C.ink, fontWeight: 600 }}>{p.name}</td>
              {showProvider && <td style={{ padding: "10px 12px", color: "#4A6FA5" }}>{p.provider}</td>}
              <td style={{ padding: "10px 12px", color: "#4A6FA5" }}>
                {p.ageMin != null ? `${p.ageMin}\u2013${p.ageMax}` : "\u2014"}
              </td>
              <td style={{ padding: "10px 12px", color: C.ink }}>
                {p.cost != null ? `$${p.cost}` : "See provider"}
              </td>
              {isDesktop && (
                <td style={{ padding: "10px 12px", color: "#4A6FA5" }}>
                  {p.dayLength || "\u2014"}
                </td>
              )}
              {isDesktop && (
                <td style={{ padding: "10px 12px", color: "#4A6FA5" }}>
                  {p.neighbourhood || p.city || "\u2014"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatsRow({ items, isDesktop }) {
  return (
    <div style={{
      display: "flex",
      gap: isDesktop ? 32 : 16,
      flexWrap: "wrap",
      marginTop: 16,
    }}>
      {items.map(([label, value], i) => (
        <div key={i}>
          <div style={{ fontSize: isDesktop ? 28 : 22, fontWeight: 800, color: "#fff" }}>{value}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Page: Main Directory (/camps) ──

function DirectoryHome({ data, isDesktop, onNavigate }) {
  const { programs: allPrograms, loading: programsLoading } = useAllPrograms();
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Full filter state (matching DiscoverTab)
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState(new Set());
  const [selectedActivityTypes, setSelectedActivityTypes] = useState(new Set());
  const [selectedHoods, setSelectedHoods] = useState(new Set());
  const [expandedCities, setExpandedCities] = useState(new Set());
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [selectedCosts, setSelectedCosts] = useState(new Set());
  const [costFilterMode, setCostFilterMode] = useState("total");
  const [selectedCostPerHour, setSelectedCostPerHour] = useState(new Set());
  const [selectedProviders, setSelectedProviders] = useState(new Set());
  const [providerSearch, setProviderSearch] = useState("");
  const [selectedRegStatuses, setSelectedRegStatuses] = useState(new Set(["open", "coming-soon", "upcoming", "likely-coming-soon"]));
  const [selectedWeeks, setSelectedWeeks] = useState(new Set());
  const [durationMin, setDurationMin] = useState(0);
  const [durationMax, setDurationMax] = useState(10);
  const [sortBy, setSortBy] = useState("relevance");
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const resultsRef = useRef(null);

  // Derived data
  const allProviders = useMemo(() => {
    return [...new Set(allPrograms.map((p) => p.provider))].sort((a, b) =>
      a.localeCompare(b, "en", { sensitivity: "base" })
    );
  }, [allPrograms]);

  const availableActivityTypes = useMemo(() => {
    const types = new Set();
    allPrograms.forEach((p) => {
      if (selectedCats.size === 0 || selectedCats.has(p.category)) {
        if (p.activityType) types.add(p.activityType);
      }
    });
    return [...types].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
  }, [selectedCats, allPrograms]);

  useEffect(() => {
    setSelectedActivityTypes((prev) => {
      if (prev.size === 0) return prev;
      const validTypes = new Set(availableActivityTypes);
      const pruned = new Set([...prev].filter((t) => validTypes.has(t)));
      return pruned.size === prev.size ? prev : pruned;
    });
  }, [availableActivityTypes]);

  const toggleInSet = (setter, value) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      setVisibleCount(PAGE_SIZE);
      return next;
    });
  };

  const toggleHood = (hood) => {
    setSelectedHoods((prev) => {
      const next = new Set(prev);
      if (next.has(hood)) next.delete(hood); else next.add(hood);
      setVisibleCount(PAGE_SIZE);
      return next;
    });
  };
  const toggleCity = (cityObj) => {
    setSelectedHoods((prev) => {
      const next = new Set(prev);
      const allSelected = cityObj.neighbourhoods.every((n) => next.has(n));
      if (allSelected) cityObj.neighbourhoods.forEach((n) => next.delete(n));
      else cityObj.neighbourhoods.forEach((n) => next.add(n));
      setVisibleCount(PAGE_SIZE);
      return next;
    });
  };
  const toggleCityExpand = (city) => {
    setExpandedCities((prev) => {
      const next = new Set(prev);
      if (next.has(city)) next.delete(city); else next.add(city);
      return next;
    });
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCats(new Set());
    setSelectedActivityTypes(new Set());
    setSelectedHoods(new Set());
    setAgeMin("");
    setAgeMax("");
    setSelectedCosts(new Set());
    setSelectedCostPerHour(new Set());
    setCostFilterMode("total");
    setSelectedProviders(new Set());
    setProviderSearch("");
    setSelectedRegStatuses(new Set(["open", "coming-soon", "upcoming", "likely-coming-soon"]));
    setSelectedWeeks(new Set());
    setDurationMin(0);
    setDurationMax(10);
    setSortBy("relevance");
    setVisibleCount(PAGE_SIZE);
  };

  const totalActiveFilters = useMemo(() => {
    let count = 0;
    if (selectedCats.size > 0) count++;
    if (ageMin || ageMax) count++;
    if (selectedCosts.size > 0 || selectedCostPerHour.size > 0) count++;
    if (selectedHoods.size > 0) count++;
    if (selectedRegStatuses.size > 0 && !(selectedRegStatuses.size === 4 && selectedRegStatuses.has("open") && selectedRegStatuses.has("coming-soon") && selectedRegStatuses.has("upcoming") && selectedRegStatuses.has("likely-coming-soon"))) count++;
    if (durationMin > 0 || durationMax < 10) count++;
    if (selectedActivityTypes.size > 0) count++;
    if (selectedProviders.size > 0) count++;
    if (sortBy !== "relevance") count++;
    if (search) count++;
    if (selectedWeeks.size > 0) count++;
    return count;
  }, [selectedCats, ageMin, ageMax, selectedCosts, selectedCostPerHour, selectedHoods, selectedRegStatuses, durationMin, durationMax, selectedActivityTypes, selectedProviders, sortBy, search, selectedWeeks]);

  // Filter programs (matching DiscoverTab logic)
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const minAge = ageMin ? Number(ageMin) : null;
    const maxAge = ageMax ? Number(ageMax) : null;
    const costRanges = selectedCosts.size > 0
      ? [...selectedCosts].map((i) => COST_RANGES[i])
      : null;
    const cphRanges = selectedCostPerHour.size > 0
      ? [...selectedCostPerHour].map((i) => COST_PER_HOUR_RANGES[i])
      : null;

    return allPrograms.filter((p) => {
      // Week filter
      if (selectedWeeks.size > 0) {
        const matchesAnyWeek = [...selectedWeeks].some((wId) => {
          const week = SUMMER_WEEKS.find((w) => w.id === wId);
          return week && programOverlapsWeek(p, week.monday, week.friday);
        });
        if (!matchesAnyWeek) return false;
      }
      // Status
      if (selectedRegStatuses.size > 0 && !selectedRegStatuses.has(getRegistrationStatus(p))) return false;
      // Search
      if (q) {
        const haystack = [p.name, p.provider, p.neighbourhood, p.activityType].filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // Category
      if (selectedCats.size > 0 && !selectedCats.has(p.category)) return false;
      if (selectedActivityTypes.size > 0 && !selectedActivityTypes.has(p.activityType)) return false;
      // Provider
      if (selectedProviders.size > 0 && !selectedProviders.has(p.provider)) return false;
      // Neighbourhood
      if (selectedHoods.size > 0 && !selectedHoods.has(p.neighbourhood)) return false;
      // Age
      if (minAge != null && p.ageMax != null && p.ageMax < minAge) return false;
      if (maxAge != null && p.ageMin != null && p.ageMin > maxAge) return false;
      // Cost
      if (costRanges) {
        const cost = typeof p.cost === "number" ? p.cost : null;
        if (!costRanges.some((range) => {
          if (range.min === -1 && range.max === -1) return cost === null;
          if (range.max === 0) return cost === 0;
          if (range.min === 0 && range.max === Infinity) return true;
          if (cost === null) return false;
          return cost >= range.min && cost <= range.max;
        })) return false;
      }
      if (cphRanges) {
        const cph = calcCostPerHour(p);
        if (!cphRanges.some((range) => {
          if (range.min === 0 && range.max === Infinity) return true;
          if (cph === null) return false;
          return cph >= range.min && cph <= range.max;
        })) return false;
      }
      // Duration
      if (durationMin > 0 || durationMax < 10) {
        const dur = p.durationPerDay;
        if (dur == null) return durationMin === 0;
        if (dur < durationMin || dur > durationMax) return false;
      }
      return true;
    });
  }, [allPrograms, search, selectedCats, selectedActivityTypes, selectedHoods, ageMin, ageMax, selectedCosts, selectedCostPerHour, selectedRegStatuses, selectedProviders, selectedWeeks, durationMin, durationMax]);

  // Sort
  const sortedPrograms = useMemo(() => {
    if (sortBy !== "relevance") return sortPrograms(filtered, sortBy);
    const statusOrder = { "open": 0, "coming-soon": 1, "upcoming": 2, "likely-coming-soon": 3, "full-waitlist": 4, "in-progress": 5, "completed": 6 };
    return [...filtered].sort((a, b) => {
      const aStatus = statusOrder[getRegistrationStatus(a)] ?? 6;
      const bStatus = statusOrder[getRegistrationStatus(b)] ?? 6;
      if (aStatus !== bStatus) return aStatus - bStatus;
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [filtered, sortBy]);

  const visiblePrograms = sortedPrograms.slice(0, visibleCount);
  const hasMore = visibleCount < sortedPrograms.length;

  usePageMeta({
    title: "Browse Kids Camps & Programs in Vancouver | Skeddo",
    description: `Browse ${data?.totalPrograms?.toLocaleString() || "6,700"}+ kids camps, classes, and summer programs across Vancouver and the Lower Mainland. Filter by age, category, and neighbourhood.`,
    canonical: "https://skeddo.ca/camps",
  });

  // JSON-LD structured data for SEO
  useEffect(() => {
    if (!data) return;
    const topCats = [...data.categories].sort((a, b) => b.programCount - a.programCount).slice(0, 8);
    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Kids Camps & Programs in Vancouver",
        description: `Browse ${data.totalPrograms}+ kids activities across ${data.totalAreas} areas from ${data.totalProviders}+ providers.`,
        numberOfItems: data.totalPrograms,
        itemListElement: topCats.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${c.name} Programs`,
          url: `https://skeddo.ca/camps/category/${c.slug}`,
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Skeddo",
        url: "https://skeddo.ca",
        description: "Kids' camps and activities planner for Vancouver and the Lower Mainland.",
        publisher: { "@type": "Organization", name: "Mended with Gold Inc." },
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Skeddo",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        description: "Free family planner for kids' camps and activities in Vancouver and the Lower Mainland. Browse programs, track registrations, and manage your budget.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
        author: { "@type": "Organization", name: "Mended with Gold Inc.", url: "https://skeddo.ca" },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is Skeddo?",
            acceptedAnswer: { "@type": "Answer", text: "Skeddo is a free family planner that helps parents in Vancouver and the Lower Mainland browse kids' camps and activities, track registrations and waitlists, and manage their budget across all their children." },
          },
          {
            "@type": "Question",
            name: "How much does Skeddo cost?",
            acceptedAnswer: { "@type": "Answer", text: "Skeddo is completely free for families. There are no hidden fees or premium tiers." },
          },
          {
            "@type": "Question",
            name: "What areas does Skeddo cover?",
            acceptedAnswer: { "@type": "Answer", text: "Skeddo covers kids' activities and summer programs from 150+ providers across Vancouver, Burnaby, North Vancouver, West Vancouver, Richmond, New Westminster, Coquitlam, and the rest of the Lower Mainland." },
          },
          {
            "@type": "Question",
            name: "How many programs are listed on Skeddo?",
            acceptedAnswer: { "@type": "Answer", text: `Skeddo lists over ${data.totalPrograms.toLocaleString()} kids' programs including summer camps, sports, arts, STEM, and multi-activity camps from ${data.totalProviders}+ local providers.` },
          },
        ],
      },
    ];
    const scripts = schemas.map((s, i) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(s);
      script.id = `directory-jsonld-${i}`;
      document.head.appendChild(script);
      return script;
    });
    return () => { scripts.forEach(s => s.remove()); };
  }, [data]);

  if (!data) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;

  const inputStyle = {
    fontFamily: font, fontSize: 14, padding: "10px 12px",
    borderRadius: 10, border: `1.5px solid ${C.border}`,
    background: C.white, color: C.ink, outline: "none",
    width: 70, textAlign: "center",
  };

  return (
    <div style={pageWrap(isDesktop)}>
      <SiteHeader isDesktop={isDesktop} onNavigate={onNavigate} />

      {/* Hero with search */}
      <div style={heroStyle(isDesktop)}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1 style={heroTitle(isDesktop)}>
            Browse {data.totalPrograms.toLocaleString()}+ Kids Camps &amp; Programs
          </h1>
          <p style={heroSub}>
            Find summer camps, classes, and activities for kids across Vancouver and the Lower Mainland.
          </p>

          {/* Search bar in hero */}
          <div style={{ marginTop: 20, display: "flex", gap: 8, maxWidth: 600 }}>
            <input
              type="text"
              placeholder="Search camps, providers, activities..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
              style={{
                flex: 1, fontFamily: font, fontSize: 15, padding: "12px 16px",
                borderRadius: 10, border: "none", outline: "none",
                background: "rgba(255,255,255,0.95)", color: C.ink,
              }}
            />
          </div>
        </div>
      </div>

      <div style={container(isDesktop)}>
        {/* Filter chips — matching DiscoverTab */}
        <div ref={resultsRef} style={{
          display: "flex", gap: 6, overflowX: "auto", padding: "16px 0 8px",
          scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch",
          ...(isDesktop ? { flexWrap: "wrap" } : {}),
        }}>
          <FilterChip label="Week" count={selectedWeeks.size} active={selectedWeeks.size > 0} onClick={() => setActiveDrawer("week")} />
          <FilterChip label="Category" count={selectedCats.size + selectedActivityTypes.size} active={selectedCats.size > 0 || selectedActivityTypes.size > 0} onClick={() => setActiveDrawer("category")} />
          <FilterChip label="Age" count={ageMin || ageMax ? 1 : 0} active={!!(ageMin || ageMax)} onClick={() => setActiveDrawer("age")} />
          <FilterChip label="Cost" count={selectedCosts.size + selectedCostPerHour.size} active={selectedCosts.size > 0 || selectedCostPerHour.size > 0} onClick={() => setActiveDrawer("cost")} />
          <FilterChip label="Provider" count={selectedProviders.size} active={selectedProviders.size > 0} onClick={() => setActiveDrawer("provider")} />
          <FilterChip label="Area" count={selectedHoods.size} active={selectedHoods.size > 0} onClick={() => setActiveDrawer("neighbourhood")} />
          <FilterChip label="Duration" count={durationMin > 0 || durationMax < 10 ? 1 : 0} active={durationMin > 0 || durationMax < 10} onClick={() => setActiveDrawer("duration")} />
          <FilterChip label="Status" count={selectedRegStatuses.size > 0 && !(selectedRegStatuses.size === 4 && selectedRegStatuses.has("open") && selectedRegStatuses.has("coming-soon") && selectedRegStatuses.has("upcoming") && selectedRegStatuses.has("likely-coming-soon")) ? selectedRegStatuses.size : 0} active={selectedRegStatuses.size > 0 && !(selectedRegStatuses.size === 4 && selectedRegStatuses.has("open") && selectedRegStatuses.has("coming-soon") && selectedRegStatuses.has("upcoming") && selectedRegStatuses.has("likely-coming-soon"))} onClick={() => setActiveDrawer("status")} />
          <FilterChip label="Sort" active={sortBy !== "relevance"} onClick={() => setActiveDrawer("sort")} />
          {totalActiveFilters > 0 && (
            <button onClick={clearAllFilters} style={{
              background: "none", border: "none", color: C.olive,
              fontFamily: font, fontSize: 13, fontWeight: 600,
              cursor: "pointer", whiteSpace: "nowrap", padding: "6px 8px",
            }}>Clear all</button>
          )}
        </div>

        {/* Results count */}
        <div style={{ fontSize: 14, color: "#4A6FA5", fontWeight: 600, marginBottom: 12 }}>
          {programsLoading ? "Loading programs..." : `${sortedPrograms.length.toLocaleString()} programs found`}
        </div>

        {/* Program cards */}
        {!programsLoading && visiblePrograms.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: isDesktop ? "1fr 1fr 1fr" : "1fr",
            gap: 12,
          }}>
            {visiblePrograms.map((p, i) => {
              const regStatus = getRegistrationStatus(p);
              const statusInfo = REGISTRATION_STATUSES.find((s) => s.key === regStatus) || REGISTRATION_STATUSES[0];
              return (
                <div
                  key={p.id || i}
                  onClick={() => setSelectedProgram(p)}
                  style={{
                    background: C.white, borderRadius: 14, padding: "16px 18px",
                    boxShadow: "0 2px 8px rgba(27,36,50,0.07)",
                    cursor: "pointer",
                    transition: "box-shadow 0.15s, transform 0.15s",
                    display: "flex", flexDirection: "column", gap: 6,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(27,36,50,0.13)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(27,36,50,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {/* Category + status row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#4A6FA5", textTransform: "uppercase", letterSpacing: 0.8 }}>
                      {p.category}
                    </div>
                    {regStatus !== "open" && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: statusInfo.color || C.muted }}>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: headFont, fontSize: 15, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 13, color: "#4A6FA5" }}>{p.provider}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 13, color: C.ink, marginTop: 2 }}>
                    {p.cost != null && (
                      <span style={{ fontWeight: 700, color: C.seaGreen }}>${Number(p.cost).toLocaleString()}</span>
                    )}
                    {p.ageMin != null && (
                      <span>Ages {p.ageMin}&ndash;{p.ageMax}</span>
                    )}
                    {(p.neighbourhood || p.city) && (
                      <span style={{ color: "#4A6FA5" }}>{p.neighbourhood || p.city}</span>
                    )}
                  </div>
                  {(p.dayLength || p.days) && (
                    <div style={{ fontSize: 12, color: "#4A6FA5" }}>
                      {p.dayLength}{p.days ? ` \u00B7 ${p.days}` : ""}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              style={{
                fontFamily: font, fontSize: 15, fontWeight: 700,
                color: C.seaGreen, background: C.white,
                border: `1.5px solid ${C.seaGreen}`, borderRadius: 10,
                padding: "12px 32px", cursor: "pointer",
              }}
            >
              Load More ({(sortedPrograms.length - visibleCount).toLocaleString()} remaining)
            </button>
          </div>
        )}

        {/* No results */}
        {!programsLoading && sortedPrograms.length === 0 && totalActiveFilters > 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#4A6FA5" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>&#x1F50D;</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No programs match your filters</div>
            <div style={{ fontSize: 14, marginBottom: 16 }}>Try broadening your search or clearing some filters.</div>
            <button onClick={clearAllFilters} style={{
              fontFamily: font, fontSize: 14, fontWeight: 700,
              color: C.seaGreen, background: "none",
              border: `1.5px solid ${C.seaGreen}`, borderRadius: 8,
              padding: "8px 20px", cursor: "pointer",
            }}>Clear All Filters</button>
          </div>
        )}

        {/* CTA — sign up to save */}
        <div style={{
          background: `linear-gradient(135deg, ${C.seaGreen}12, #4A6FA512)`,
          border: `1.5px solid ${C.seaGreen}25`,
          borderRadius: 16, padding: "24px 20px", textAlign: "center",
          marginTop: 32, marginBottom: 24,
        }}>
          <h3 style={{ fontFamily: headFont, fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
            Found something you like?
          </h3>
          <p style={{ fontSize: 15, color: "#4A6FA5", lineHeight: 1.6, marginBottom: 16, maxWidth: 480, margin: "0 auto 16px" }}>
            Create a free account to save programs, track registrations, and manage your family's schedule and budget.
          </p>
          <button
            onClick={() => onNavigate("signup")}
            style={{
              fontFamily: font, fontSize: 15, fontWeight: 700,
              color: "#fff", background: C.seaGreen,
              border: "none", borderRadius: 10,
              padding: "12px 32px", cursor: "pointer",
            }}
          >
            Get Started Free
          </button>
        </div>

        {/* Planning Guides */}
        {/* Planning Resources widget hidden until blog posts are refined */}
      </div>

      {/* ─── Filter Drawers ─── */}

      {/* Week Drawer */}
      <FilterDrawer open={activeDrawer === "week"} onClose={() => setActiveDrawer(null)} title="Week"
        onClear={() => { setSelectedWeeks(new Set()); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {SUMMER_WEEKS.map((week) => {
            const isSelected = selectedWeeks.has(week.id);
            return (
              <div key={week.id} onClick={() => toggleInSet(setSelectedWeeks, week.id)} style={{
                padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
                cursor: "pointer", borderRadius: 10,
                background: isSelected ? C.ink + "08" : "transparent",
                borderBottom: `1px solid ${C.border}`,
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 4,
                  border: `2px solid ${isSelected ? C.seaGreen : C.border}`,
                  background: isSelected ? C.seaGreen : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: "#fff", flexShrink: 0,
                }}>{isSelected ? "\u2713" : ""}</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: font, fontSize: 15, fontWeight: isSelected ? 600 : 400, color: C.ink,
                  }}>
                    {week.label}: {week.dateRange}
                  </div>
                  {week.note && (
                    <div style={{ fontFamily: font, fontSize: 12, color: C.blue, marginTop: 2 }}>
                      {week.note}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </FilterDrawer>

      {/* Sort Drawer */}
      <FilterDrawer open={activeDrawer === "sort"} onClose={() => setActiveDrawer(null)} title="Sort by">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => { setSortBy(opt.key); setVisibleCount(PAGE_SIZE); setActiveDrawer(null); }}
              style={{
                padding: "12px 16px", borderRadius: 10, border: "none",
                background: sortBy === opt.key ? C.ink : "transparent",
                color: sortBy === opt.key ? "#fff" : C.ink,
                fontFamily: font, fontSize: 15, fontWeight: sortBy === opt.key ? 600 : 400,
                textAlign: "left", cursor: "pointer", minHeight: 44,
                display: "flex", alignItems: "center", gap: 10,
              }}
            >
              {sortBy === opt.key && <span>{"\u2713"}</span>}
              {opt.label}
            </button>
          ))}
        </div>
      </FilterDrawer>

      {/* Category Drawer */}
      <FilterDrawer open={activeDrawer === "category"} onClose={() => setActiveDrawer(null)} title="Category"
        onClear={() => { setSelectedCats(new Set()); setSelectedActivityTypes(new Set()); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        {(() => {
          const catTypeMap = {};
          allPrograms.forEach((p) => {
            if (!p.category || !p.activityType || p.activityType === "General") return;
            if (!catTypeMap[p.category]) catTypeMap[p.category] = {};
            catTypeMap[p.category][p.activityType] = (catTypeMap[p.category][p.activityType] || 0) + 1;
          });
          return CATEGORIES.map((cat) => {
            const isCatSelected = selectedCats.has(cat);
            const subTypes = catTypeMap[cat] ? Object.entries(catTypeMap[cat]).sort((a, b) => b[1] - a[1]) : [];
            const activeSubCount = subTypes.filter(([t]) => selectedActivityTypes.has(t)).length;
            return (
              <div key={cat} style={{ borderBottom: `1px solid ${C.border}` }}>
                <div onClick={() => toggleInSet(setSelectedCats, cat)} style={{
                  padding: "12px 14px", display: "flex", alignItems: "center", gap: 10,
                  cursor: "pointer", background: isCatSelected ? C.ink + "08" : "transparent",
                }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: 4,
                    border: `2px solid ${isCatSelected ? C.seaGreen : C.border}`,
                    background: isCatSelected ? C.seaGreen : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, color: "#fff", flexShrink: 0,
                  }}>{isCatSelected ? "\u2713" : ""}</span>
                  <span style={{ fontFamily: font, fontSize: 15, fontWeight: isCatSelected ? 600 : 400, color: C.ink, flex: 1 }}>
                    {CAT_EMOJI[cat] || ""} {cat}
                  </span>
                  {activeSubCount > 0 && (
                    <span style={{ background: C.seaGreen, color: "#fff", fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {activeSubCount}
                    </span>
                  )}
                  {subTypes.length > 0 && (
                    <span style={{ fontSize: 12, color: C.muted, transition: "transform 0.15s", transform: isCatSelected ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>{"\u25B6"}</span>
                  )}
                </div>
                {isCatSelected && subTypes.length > 0 && (
                  <div style={{ padding: "0 0 8px 44px" }}>
                    {subTypes.map(([type, count]) => {
                      const isTypeSelected = selectedActivityTypes.has(type);
                      return (
                        <div key={type} onClick={() => toggleInSet(setSelectedActivityTypes, type)} style={{
                          padding: "8px 12px", display: "flex", alignItems: "center", gap: 8,
                          cursor: "pointer", borderRadius: 8,
                          background: isTypeSelected ? C.seaGreen + "10" : "transparent",
                        }}>
                          <span style={{
                            width: 16, height: 16, borderRadius: 3,
                            border: `2px solid ${isTypeSelected ? C.seaGreen : C.border}`,
                            background: isTypeSelected ? C.seaGreen : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, color: "#fff", flexShrink: 0,
                          }}>{isTypeSelected ? "\u2713" : ""}</span>
                          <span style={{ fontFamily: font, fontSize: 14, color: isTypeSelected ? C.ink : C.muted, fontWeight: isTypeSelected ? 600 : 400, flex: 1 }}>
                            {type}
                          </span>
                          <span style={{ fontFamily: font, fontSize: 12, color: C.muted }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          });
        })()}
      </FilterDrawer>

      {/* Age Drawer */}
      <FilterDrawer open={activeDrawer === "age"} onClose={() => setActiveDrawer(null)} title="Age Range"
        onClear={() => { setAgeMin(""); setAgeMax(""); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        <div style={{ padding: "8px 0 16px" }}>
          <div style={{ fontFamily: font, fontSize: 14, color: C.muted, marginBottom: 12 }}>
            Show programs suitable for children aged:
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: font, fontSize: 12, color: C.muted, marginBottom: 4 }}>Min age</div>
              <input type="number" min="0" max="18" value={ageMin}
                onChange={(e) => { setAgeMin(e.target.value); setVisibleCount(PAGE_SIZE); }}
                placeholder="Any"
                style={inputStyle} />
            </div>
            <span style={{ fontFamily: font, fontSize: 16, color: C.muted, marginTop: 16 }}>&ndash;</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: font, fontSize: 12, color: C.muted, marginBottom: 4 }}>Max age</div>
              <input type="number" min="0" max="18" value={ageMax}
                onChange={(e) => { setAgeMax(e.target.value); setVisibleCount(PAGE_SIZE); }}
                placeholder="Any"
                style={inputStyle} />
            </div>
          </div>
        </div>
      </FilterDrawer>

      {/* Cost Drawer */}
      <FilterDrawer open={activeDrawer === "cost"} onClose={() => setActiveDrawer(null)} title="Cost"
        onClear={() => { setSelectedCosts(new Set()); setSelectedCostPerHour(new Set()); setCostFilterMode("total"); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        <div style={{ display: "flex", background: C.ink + "0A", borderRadius: 10, padding: 3, marginBottom: 12 }}>
          {[{ id: "total", l: "Total cost" }, { id: "perHour", l: "$/hr" }].map((m) => (
            <button key={m.id} onClick={() => {
              setCostFilterMode(m.id);
              if (m.id === "total") setSelectedCostPerHour(new Set());
              else setSelectedCosts(new Set());
            }} style={{
              flex: 1, padding: "7px 12px", borderRadius: 8, border: "none",
              background: costFilterMode === m.id ? C.seaGreen + "18" : "transparent",
              color: costFilterMode === m.id ? C.seaGreen : C.muted,
              fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>{m.l}</button>
          ))}
        </div>
        {costFilterMode === "total" ? (
          <FilterOptions
            options={COST_RANGES.slice(1).map((r, i) => ({ id: i + 1, label: r.label }))}
            selected={selectedCosts}
            onToggle={(id) => toggleInSet(setSelectedCosts, id)}
          />
        ) : (
          <FilterOptions
            options={COST_PER_HOUR_RANGES.slice(1).map((r, i) => ({ id: i + 1, label: r.label }))}
            selected={selectedCostPerHour}
            onToggle={(id) => toggleInSet(setSelectedCostPerHour, id)}
          />
        )}
      </FilterDrawer>

      {/* Provider Drawer */}
      <FilterDrawer open={activeDrawer === "provider"} onClose={() => setActiveDrawer(null)} title="Provider"
        onClear={() => { setSelectedProviders(new Set()); setProviderSearch(""); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        <>
          {selectedProviders.size > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {[...selectedProviders].sort().map((prov) => (
                <button key={prov} onClick={() => toggleInSet(setSelectedProviders, prov)} style={{
                  fontFamily: font, fontSize: 14, fontWeight: 600,
                  background: C.ink, color: "#fff", border: "none", borderRadius: 20,
                  padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                }}>
                  {prov} <span style={{ fontSize: 14, lineHeight: 1 }}>&times;</span>
                </button>
              ))}
            </div>
          )}
          <div style={{ position: "relative", marginBottom: 12 }}>
            <input style={{
              fontFamily: font, fontSize: 14, padding: "10px 12px 10px 32px",
              borderRadius: 10, border: `1.5px solid ${C.border}`,
              background: C.white, color: C.ink, outline: "none", width: "100%", boxSizing: "border-box",
            }}
              placeholder="Search providers..."
              value={providerSearch}
              onChange={(e) => setProviderSearch(e.target.value)} />
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: C.muted, pointerEvents: "none" }}>
              &#x1F50D;
            </span>
          </div>
          <div style={{ maxHeight: 400, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
            {allProviders
              .filter((prov) => prov.toLowerCase().includes(providerSearch.toLowerCase().trim()))
              .map((prov) => {
                const isSelected = selectedProviders.has(prov);
                return (
                  <div key={prov} onClick={() => toggleInSet(setSelectedProviders, prov)}
                    role="option" aria-selected={isSelected}
                    style={{
                      padding: "10px 12px", fontFamily: font, fontSize: 14,
                      color: isSelected ? C.ink : C.muted, fontWeight: isSelected ? 600 : 400,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                      borderBottom: `1px solid ${C.border}`, background: isSelected ? C.ink + "08" : "transparent",
                    }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: 4,
                      border: `2px solid ${isSelected ? C.seaGreen : C.border}`,
                      background: isSelected ? C.seaGreen : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, color: C.white, flexShrink: 0,
                    }}>{isSelected ? "\u2713" : ""}</span>
                    {prov}
                  </div>
                );
              })}
            {allProviders.filter((prov) => prov.toLowerCase().includes(providerSearch.toLowerCase().trim())).length === 0 && (
              <div style={{ padding: 12, fontFamily: font, fontSize: 14, color: C.muted, textAlign: "center" }}>
                No providers found
              </div>
            )}
          </div>
        </>
      </FilterDrawer>

      {/* Neighbourhood Drawer */}
      <FilterDrawer open={activeDrawer === "neighbourhood"} onClose={() => setActiveDrawer(null)} title="Neighbourhoods"
        onClear={() => { setSelectedHoods(new Set()); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        <div style={{ background: C.cream, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          {CITY_NEIGHBOURHOODS.map((cityObj) => {
            const isExpanded = expandedCities.has(cityObj.city);
            const selectedInCity = cityObj.neighbourhoods.filter((n) => selectedHoods.has(n)).length;
            const allInCitySelected = selectedInCity === cityObj.neighbourhoods.length;
            const someInCitySelected = selectedInCity > 0 && !allInCitySelected;
            return (
              <div key={cityObj.city}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 12px", borderBottom: `1px solid ${C.border}`, cursor: "pointer",
                }} onClick={() => toggleCityExpand(cityObj.city)} role="button" tabIndex={0}
                  aria-expanded={isExpanded} aria-label={`${isExpanded ? "Collapse" : "Expand"} ${cityObj.city} neighbourhoods`}>
                  <span style={{ fontSize: 11, color: C.muted, transition: "transform 0.15s", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>{"\u25B6"}</span>
                  <span style={{ flex: 1, fontFamily: font, fontSize: 14, fontWeight: 600, color: C.ink }}>
                    {cityObj.city}
                    {someInCitySelected && <span style={{ color: C.muted, fontWeight: 400 }}> ({selectedInCity}/{cityObj.neighbourhoods.length})</span>}
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); toggleCity(cityObj); }}
                    aria-label={allInCitySelected ? `Deselect all ${cityObj.city}` : `Select all ${cityObj.city}`}
                    style={{
                      fontFamily: font, fontSize: 11, fontWeight: 700,
                      color: allInCitySelected ? C.danger : C.seaGreen,
                      background: allInCitySelected ? C.dangerBg : C.seaGreen + "12",
                      border: "none", borderRadius: 6, padding: "3px 8px", cursor: "pointer", whiteSpace: "nowrap",
                    }}>
                    {allInCitySelected ? "Deselect All" : "Select All"}
                  </button>
                </div>
                {isExpanded && (
                  <div style={{ padding: "4px 12px 4px 28px" }}>
                    {cityObj.neighbourhoods.sort().map((hood) => {
                      const isSelected = selectedHoods.has(hood);
                      return (
                        <label key={hood} style={{
                          display: "flex", alignItems: "center", gap: 8, padding: "6px 0", cursor: "pointer",
                          fontFamily: font, fontSize: 14,
                          color: isSelected ? C.ink : C.muted, fontWeight: isSelected ? 600 : 400,
                        }}>
                          <span style={{
                            width: 18, height: 18, borderRadius: 4,
                            border: `2px solid ${isSelected ? C.seaGreen : C.border}`,
                            background: isSelected ? C.seaGreen : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, color: C.white, flexShrink: 0, transition: "all 0.12s",
                          }} onClick={(e) => { e.preventDefault(); toggleHood(hood); }}>
                            {isSelected ? "\u2713" : ""}
                          </span>
                          <span onClick={(e) => { e.preventDefault(); toggleHood(hood); }}>{hood}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </FilterDrawer>

      {/* Status Drawer */}
      <FilterDrawer open={activeDrawer === "status"} onClose={() => setActiveDrawer(null)} title="Registration Status"
        onClear={() => { setSelectedRegStatuses(new Set()); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        <FilterOptions
          options={REGISTRATION_STATUSES.map((st) => ({ id: st.key, label: `${st.icon} ${st.label}` }))}
          selected={selectedRegStatuses}
          onToggle={(id) => toggleInSet(setSelectedRegStatuses, id)}
        />
      </FilterDrawer>

      {/* Duration Drawer */}
      <FilterDrawer open={activeDrawer === "duration"} onClose={() => setActiveDrawer(null)} title="Duration (hours per day)"
        onClear={() => { setDurationMin(0); setDurationMax(10); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        <div style={{ padding: "8px 0 16px" }}>
          <div style={{ fontFamily: font, fontSize: 16, color: C.ink, fontWeight: 700, textAlign: "center", marginBottom: 16 }}>
            {durationMin === 0 && durationMax === 10 ? "Any duration" : `${durationMin}h \u2013 ${durationMax}h per day`}
          </div>
          <div style={{ padding: "0 4px" }}>
            <div style={{ fontFamily: font, fontSize: 14, color: C.muted, marginBottom: 6 }}>Minimum: {durationMin}h</div>
            <input type="range" min="0" max="10" step="0.5" value={durationMin}
              onChange={(e) => { const v = parseFloat(e.target.value); setDurationMin(Math.min(v, durationMax)); setVisibleCount(PAGE_SIZE); }}
              style={{ width: "100%", accentColor: C.seaGreen }} />
            <div style={{ fontFamily: font, fontSize: 14, color: C.muted, marginBottom: 6, marginTop: 14 }}>Maximum: {durationMax}h</div>
            <input type="range" min="0" max="10" step="0.5" value={durationMax}
              onChange={(e) => { const v = parseFloat(e.target.value); setDurationMax(Math.max(v, durationMin)); setVisibleCount(PAGE_SIZE); }}
              style={{ width: "100%", accentColor: C.seaGreen }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: font, fontSize: 12, color: C.muted, marginTop: 4, padding: "0 2px" }}>
            <span>0h</span><span>2h</span><span>4h</span><span>6h</span><span>8h</span><span>10h</span>
          </div>
          <div style={{ fontFamily: font, fontSize: 13, color: C.muted, marginTop: 16, lineHeight: 1.5 }}>
            Duration includes before-care and after-care hours when available. Programs without time data are shown when minimum is 0.
          </div>
        </div>
      </FilterDrawer>

      {/* Program detail modal */}
      {selectedProgram && <PublicProgramDetail program={selectedProgram} onClose={() => setSelectedProgram(null)} onNavigate={onNavigate} />}

      <SiteFooter isDesktop={isDesktop} />
    </div>
  );
}

// ── Page: Category Detail (/camps/category/:slug) ──

function CategoryPage({ data, slug, isDesktop, onNavigate }) {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const category = useMemo(() => {
    if (!data) return null;
    return data.categories.find((c) => c.slug === slug);
  }, [data, slug]);

  usePageMeta({
    title: category ? `${category.name} Camps & Programs for Kids in Vancouver | Skeddo` : undefined,
    description: category ? `Browse ${category.programCount.toLocaleString()} ${category.name.toLowerCase()} programs for kids across the Lower Mainland from ${category.providers.length} providers.` : undefined,
    canonical: category ? `https://skeddo.ca/camps/category/${slug}` : undefined,
  });

  if (!data) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  if (!category) return <NotFound isDesktop={isDesktop} onNavigate={onNavigate} />;

  return (
    <div style={pageWrap(isDesktop)}>
      <SiteHeader isDesktop={isDesktop} onNavigate={onNavigate} />

      <div style={heroStyle(isDesktop)}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={breadcrumb}>
            <Link to="/camps" style={breadcrumbLink}>Camps</Link>
            {" / "}
            <span style={{ color: "#fff" }}>{category.name}</span>
          </div>
          <h1 style={heroTitle(isDesktop)}>
            {category.name} Camps &amp; Programs for Kids
          </h1>
          <p style={heroSub}>
            Browse {category.programCount.toLocaleString()} {category.name.toLowerCase()} programs for kids
            across {category.cities.length} areas in the Lower Mainland,
            from {category.providers.length} local providers.
          </p>
          <StatsRow items={[
            ["Programs", category.programCount.toLocaleString()],
            ["Providers", `${category.providers.length}`],
            ["Areas", `${category.cities.length}`],
          ]} isDesktop={isDesktop} />
        </div>
      </div>

      <div style={container(isDesktop)}>
        {/* Activity types */}
        {category.activityTypes.length > 0 && (
          <>
            <h2 style={sectionTitle}>Activity Types</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {category.activityTypes.slice(0, 20).map((t) => (
                <span key={t} style={pillStyle}>{t}</span>
              ))}
            </div>
          </>
        )}

        {/* Quick facts */}
        <h2 style={sectionTitle}>Quick Facts</h2>
        <div style={{ ...cardGrid(isDesktop), gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)" }}>
          <div style={card}>
            <div style={{ fontSize: 13, color: "#4A6FA5", marginBottom: 4 }}>Age Range</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>
              {category.ageMin != null ? `${category.ageMin}–${category.ageMax}` : "Various"}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 13, color: "#4A6FA5", marginBottom: 4 }}>Price Range</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>
              {category.costMin != null ? `$${category.costMin}–$${category.costMax}` : "Varies"}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 13, color: "#4A6FA5", marginBottom: 4 }}>Providers</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>{category.providers.length}</div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 13, color: "#4A6FA5", marginBottom: 4 }}>Programs</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>{category.programCount.toLocaleString()}</div>
          </div>
        </div>

        {/* Sample programs */}
        <h2 style={sectionTitle}>Sample Programs</h2>
        <ProgramTable programs={category.samplePrograms} isDesktop={isDesktop} showProvider={true} onSelectProgram={setSelectedProgram} />
        <p style={{ fontSize: 14, color: "#4A6FA5", marginTop: 12 }}>
          Showing {category.samplePrograms.length} of {category.programCount.toLocaleString()} programs.
          Sign up to browse and filter all programs.
        </p>
        {selectedProgram && <PublicProgramDetail program={selectedProgram} onClose={() => setSelectedProgram(null)} onNavigate={onNavigate} />}

        {/* Providers in this category */}
        <h2 style={sectionTitle}>Providers Offering {category.name}</h2>
        <div style={cardGrid(isDesktop)}>
          {(() => {
            const catProviders = data.providers
              .filter(p => p.categories.includes(category.name))
              .slice(0, 12);
            return catProviders.map((p) => (
              <Link key={p.slug} to={`/camps/provider/${p.slug}`} style={card}>
                <div style={cardTitle}>{p.name}</div>
                <div style={cardMeta}>{p.programCount} programs</div>
              </Link>
            ));
          })()}
        </div>

        {/* Areas with this category */}
        <h2 style={sectionTitle}>Areas with {category.name} Programs</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {category.cities.map((city) => {
            const area = data.areas.find(a => a.name === city);
            return area ? (
              <Link key={city} to={`/camps/area/${area.slug}`} style={{ ...pillStyle, textDecoration: "none" }}>
                {city}
              </Link>
            ) : (
              <span key={city} style={pillStyle}>{city}</span>
            );
          })}
        </div>

        <CTASection isDesktop={isDesktop} />
      </div>

      <SiteFooter isDesktop={isDesktop} />
    </div>
  );
}

// ── Page: Area Detail (/camps/area/:slug) ──

function AreaPage({ data, slug, isDesktop, onNavigate }) {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const area = useMemo(() => {
    if (!data) return null;
    return data.areas.find((a) => a.slug === slug);
  }, [data, slug]);

  usePageMeta({
    title: area ? `Kids Camps & Programs in ${area.name} | Skeddo` : undefined,
    description: area ? `Browse ${area.programCount.toLocaleString()} kids programs in ${area.name}. Find camps, classes, and activities from ${area.providers.length} local providers.` : undefined,
    canonical: area ? `https://skeddo.ca/camps/area/${slug}` : undefined,
  });

  if (!data) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  if (!area) return <NotFound isDesktop={isDesktop} onNavigate={onNavigate} />;

  return (
    <div style={pageWrap(isDesktop)}>
      <SiteHeader isDesktop={isDesktop} onNavigate={onNavigate} />

      <div style={heroStyle(isDesktop)}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={breadcrumb}>
            <Link to="/camps" style={breadcrumbLink}>Camps</Link>
            {" / "}
            <span style={{ color: "#fff" }}>{area.name}</span>
          </div>
          <h1 style={heroTitle(isDesktop)}>
            Kids Camps &amp; Programs in {area.name}
          </h1>
          <p style={heroSub}>
            Browse {area.programCount.toLocaleString()} camps and activities for kids
            in {area.name} from {area.providers.length} local providers.
          </p>
          <StatsRow items={[
            ["Programs", area.programCount.toLocaleString()],
            ["Providers", `${area.providers.length}`],
            ["Neighbourhoods", `${area.neighbourhoods.length}`],
          ]} isDesktop={isDesktop} />
        </div>
      </div>

      <div style={container(isDesktop)}>
        {/* Neighbourhoods */}
        {area.neighbourhoods.length > 0 && (
          <>
            <h2 style={sectionTitle}>Neighbourhoods in {area.name}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {area.neighbourhoods.sort().map((n) => (
                <span key={n} style={pillStyle}>{n}</span>
              ))}
            </div>
          </>
        )}

        {/* Categories in this area */}
        <h2 style={sectionTitle}>Categories in {area.name}</h2>
        <div style={cardGrid(isDesktop)}>
          {area.categories.slice(0, 12).map((cat) => {
            const catObj = data.categories.find(c => c.name === cat);
            return catObj ? (
              <Link key={cat} to={`/camps/category/${catObj.slug}`} style={card}>
                <div style={cardTitle}>{cat}</div>
                <div style={cardMeta}>{catObj.programCount.toLocaleString()} programs total</div>
              </Link>
            ) : (
              <div key={cat} style={card}>
                <div style={cardTitle}>{cat}</div>
              </div>
            );
          })}
        </div>

        {/* Sample programs */}
        <h2 style={sectionTitle}>Sample Programs in {area.name}</h2>
        <ProgramTable programs={area.samplePrograms} isDesktop={isDesktop} showProvider={true} onSelectProgram={setSelectedProgram} />
        <p style={{ fontSize: 14, color: "#4A6FA5", marginTop: 12 }}>
          Showing {area.samplePrograms.length} of {area.programCount.toLocaleString()} programs.
          Sign up to browse and filter all programs.
        </p>
        {selectedProgram && <PublicProgramDetail program={selectedProgram} onClose={() => setSelectedProgram(null)} onNavigate={onNavigate} />}

        {/* Providers */}
        <h2 style={sectionTitle}>Providers in {area.name}</h2>
        <div style={cardGrid(isDesktop)}>
          {(() => {
            const areaProviders = data.providers
              .filter(p => p.cities.includes(area.name))
              .slice(0, 18);
            return areaProviders.map((p) => (
              <Link key={p.slug} to={`/camps/provider/${p.slug}`} style={card}>
                <div style={cardTitle}>{p.name}</div>
                <div style={cardMeta}>
                  {p.programCount} programs · {p.categories.slice(0, 2).join(", ")}
                </div>
              </Link>
            ));
          })()}
        </div>

        <CTASection isDesktop={isDesktop} />
      </div>

      <SiteFooter isDesktop={isDesktop} />
    </div>
  );
}

// ── Page: Provider Detail (/camps/provider/:slug) ──

function ProviderPage({ data, slug, isDesktop, onNavigate }) {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const provider = useMemo(() => {
    if (!data) return null;
    return data.providers.find((p) => p.slug === slug);
  }, [data, slug]);

  const cityStr = provider?.cities?.length > 0 ? ` in ${provider.cities[0]}` : "";
  usePageMeta({
    title: provider ? `${provider.name} -- Kids Camps & Programs${cityStr} | Skeddo` : undefined,
    description: provider ? `Browse ${provider.programCount.toLocaleString()} kids programs from ${provider.name}${cityStr}. See schedules, prices, and ages.` : undefined,
    canonical: provider ? `https://skeddo.ca/camps/provider/${slug}` : undefined,
  });

  if (!data) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  if (!provider) return <NotFound isDesktop={isDesktop} onNavigate={onNavigate} />;

  return (
    <div style={pageWrap(isDesktop)}>
      <SiteHeader isDesktop={isDesktop} onNavigate={onNavigate} />

      <div style={heroStyle(isDesktop)}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={breadcrumb}>
            <Link to="/camps" style={breadcrumbLink}>Camps</Link>
            {" / "}
            <span style={{ color: "#fff" }}>{provider.name}</span>
          </div>
          <h1 style={heroTitle(isDesktop)}>{provider.name}</h1>
          <p style={heroSub}>
            {provider.programCount.toLocaleString()} kids camps and programs
            {provider.cities.length > 0 ? ` in ${provider.cities.join(", ")}` : ""}.
            {provider.categories.length > 0 ? ` Categories: ${provider.categories.slice(0, 4).join(", ")}.` : ""}
          </p>
          <StatsRow items={[
            ["Programs", provider.programCount.toLocaleString()],
            ["Categories", `${provider.categories.length}`],
            ...(provider.cities.length > 0 ? [["Locations", `${provider.cities.length}`]] : []),
          ]} isDesktop={isDesktop} />
        </div>
      </div>

      <div style={container(isDesktop)}>
        {/* Quick facts */}
        <h2 style={sectionTitle}>At a Glance</h2>
        <div style={{ ...cardGrid(isDesktop), gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)" }}>
          <div style={card}>
            <div style={{ fontSize: 13, color: "#4A6FA5", marginBottom: 4 }}>Ages</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>
              {provider.ageMin != null ? `${provider.ageMin}–${provider.ageMax}` : "Various"}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 13, color: "#4A6FA5", marginBottom: 4 }}>Price Range</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>
              {provider.costMin != null ? `$${provider.costMin}–$${provider.costMax}` : "Varies"}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 13, color: "#4A6FA5", marginBottom: 4 }}>Locations</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>
              {provider.cities.length > 0 ? provider.cities.join(", ") : "Various"}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 13, color: "#4A6FA5", marginBottom: 4 }}>Neighbourhoods</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>
              {provider.neighbourhoods.length || "—"}
            </div>
          </div>
        </div>

        {/* Categories */}
        <h2 style={sectionTitle}>Program Categories</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {provider.categories.map((cat) => {
            const catObj = data.categories.find(c => c.name === cat);
            return catObj ? (
              <Link key={cat} to={`/camps/category/${catObj.slug}`} style={{ ...pillStyle, textDecoration: "none" }}>
                {cat}
              </Link>
            ) : (
              <span key={cat} style={pillStyle}>{cat}</span>
            );
          })}
        </div>

        {/* Neighbourhoods */}
        {provider.neighbourhoods.length > 0 && (
          <>
            <h2 style={sectionTitle}>Neighbourhoods</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {provider.neighbourhoods.sort().map((n) => (
                <span key={n} style={pillStyle}>{n}</span>
              ))}
            </div>
          </>
        )}

        {/* Sample programs */}
        <h2 style={sectionTitle}>Sample Programs</h2>
        <ProgramTable programs={provider.samplePrograms} isDesktop={isDesktop} showProvider={false} onSelectProgram={setSelectedProgram} />
        <p style={{ fontSize: 14, color: "#4A6FA5", marginTop: 12 }}>
          Showing {provider.samplePrograms.length} of {provider.programCount.toLocaleString()} programs.
          Sign up to browse and filter all {provider.name} programs.
        </p>
        {selectedProgram && <PublicProgramDetail program={selectedProgram} onClose={() => setSelectedProgram(null)} onNavigate={onNavigate} />}

        {/* Areas */}
        {provider.cities.length > 0 && (
          <>
            <h2 style={sectionTitle}>Available In</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {provider.cities.map((city) => {
                const area = data.areas.find(a => a.name === city);
                return area ? (
                  <Link key={city} to={`/camps/area/${area.slug}`} style={{ ...pillStyle, textDecoration: "none" }}>
                    {city}
                  </Link>
                ) : (
                  <span key={city} style={pillStyle}>{city}</span>
                );
              })}
            </div>
          </>
        )}

        <CTASection isDesktop={isDesktop} />
      </div>

      <SiteFooter isDesktop={isDesktop} />
    </div>
  );
}

// ── 404 ──

function NotFound({ isDesktop, onNavigate }) {
  useEffect(() => {
    document.title = "Page Not Found | Skeddo";
  }, []);

  return (
    <div style={pageWrap(isDesktop)}>
      <SiteHeader isDesktop={isDesktop} onNavigate={onNavigate} />
      <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center", padding: "0 20px" }}>
        <h1 style={{ fontFamily: headFont, fontSize: 28, color: C.ink, marginBottom: 12 }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: 16, color: "#4A6FA5", lineHeight: 1.6, marginBottom: 24 }}>
          We couldn't find that page. Try browsing our camp directory instead.
        </p>
        <Link to="/camps" style={{
          display: "inline-block",
          fontFamily: font,
          fontSize: 16,
          fontWeight: 700,
          color: "#fff",
          background: C.seaGreen,
          borderRadius: 10,
          padding: "14px 32px",
          textDecoration: "none",
        }}>
          Browse Camps
        </Link>
      </div>
      <SiteFooter isDesktop={isDesktop} />
    </div>
  );
}

/** Read-only program detail for unauthenticated users */
function PublicProgramDetail({ program, onClose, onNavigate }) {
  const p = program;
  const fmtDollars = (v) => v != null ? `$${Number(v).toLocaleString()}` : null;

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(27,36,50,0.4)", zIndex: 200,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        animation: "fadeBg 0.2s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#fff", borderRadius: "20px 20px 0 0",
        padding: "24px 20px 32px", width: "100%", maxWidth: 600,
        maxHeight: "88vh", overflowY: "auto",
        animation: "slideIn 0.25s cubic-bezier(0.22, 0.61, 0.36, 1)",
        position: "relative",
      }}>
        <button onClick={onClose} aria-label="Close" style={{
          position: "absolute", top: 16, right: 16, background: "none",
          border: "none", fontSize: 22, color: "#4A6FA5", cursor: "pointer",
          padding: 8, minWidth: 40, minHeight: 40,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 8, lineHeight: 1, zIndex: 1,
        }}>&times;</button>

        {/* Category */}
        <div style={{
          fontFamily: font, fontSize: 11, fontWeight: 700,
          color: "#4A6FA5", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2,
        }}>
          {p.category}
        </div>

        {/* Name */}
        <h3 style={{
          fontFamily: headFont, fontSize: 22, color: C.ink,
          lineHeight: 1.2, marginBottom: 4, paddingRight: 40,
        }}>
          {p.name}
        </h3>

        {/* Provider */}
        <div style={{ fontFamily: font, fontSize: 14, color: "#4A6FA5", marginBottom: 16 }}>
          {p.provider}
        </div>

        {/* Description */}
        {p.description && (
          <p style={{ fontFamily: font, fontSize: 14, color: C.ink, lineHeight: 1.7, marginBottom: 16 }}>
            {p.description}
          </p>
        )}

        {/* Details grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {fmtDollars(p.cost) && (
            <div>
              <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: "#4A6FA5", textTransform: "uppercase", letterSpacing: 1 }}>Price</div>
              <div style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: C.ink, marginTop: 2 }}>{fmtDollars(p.cost)}</div>
              {p.costNote && <div style={{ fontSize: 12, color: "#4A6FA5" }}>{p.costNote}</div>}
            </div>
          )}
          {(p.ageMin != null || p.ageMax != null) && (
            <div>
              <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: "#4A6FA5", textTransform: "uppercase", letterSpacing: 1 }}>Ages</div>
              <div style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: C.ink, marginTop: 2 }}>{p.ageMin}&ndash;{p.ageMax} years</div>
            </div>
          )}
          {p.days && (
            <div>
              <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: "#4A6FA5", textTransform: "uppercase", letterSpacing: 1 }}>Days</div>
              <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.ink, marginTop: 2 }}>{p.days}</div>
            </div>
          )}
          {(p.startTime || p.endTime) && (
            <div>
              <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: "#4A6FA5", textTransform: "uppercase", letterSpacing: 1 }}>Time</div>
              <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.ink, marginTop: 2 }}>{p.startTime}&ndash;{p.endTime}</div>
            </div>
          )}
          {p.startDate && (
            <div>
              <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: "#4A6FA5", textTransform: "uppercase", letterSpacing: 1 }}>Dates</div>
              <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.ink, marginTop: 2 }}>
                {p.startDate}{p.endDate ? ` \u2013 ${p.endDate}` : ""}
              </div>
            </div>
          )}
          {(p.neighbourhood || p.city) && (
            <div>
              <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: "#4A6FA5", textTransform: "uppercase", letterSpacing: 1 }}>Area</div>
              <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.ink, marginTop: 2 }}>
                {p.neighbourhood || p.city}
              </div>
            </div>
          )}
        </div>

        {/* Registration link */}
        {p.registrationUrl && (
          <a
            href={p.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block", width: "100%", textAlign: "center",
              fontFamily: font, fontSize: 15, fontWeight: 700,
              color: "#fff", background: C.seaGreen, border: "none",
              borderRadius: 10, padding: "14px 16px",
              textDecoration: "none", marginBottom: 10,
            }}
          >
            View Registration Page
          </a>
        )}

        {/* Sign up CTA */}
        <div style={{
          background: `${C.seaGreen}08`, borderRadius: 12,
          padding: "14px 16px", textAlign: "center",
          border: `1px solid ${C.seaGreen}20`,
        }}>
          <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 6 }}>
            Save this to your planner
          </div>
          <div style={{ fontFamily: font, fontSize: 13, color: "#4A6FA5", marginBottom: 10 }}>
            Track registrations, compare costs, and coordinate with your family.
          </div>
          <button
            onClick={() => { onClose(); onNavigate("signup"); }}
            style={{
              fontFamily: font, fontSize: 14, fontWeight: 700,
              color: C.seaGreen, background: "none",
              border: `1.5px solid ${C.seaGreen}`, borderRadius: 8,
              padding: "8px 20px", cursor: "pointer",
            }}
          >
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Router Component ──

export default function DirectoryPage({ onNavigate }) {
  const data = useDirectoryData();
  const isDesktop = useIsDesktop();
  const params = useParams();

  // Determine which sub-page based on URL params
  const { type, slug } = params;

  if (!type) {
    return <DirectoryHome data={data} isDesktop={isDesktop} onNavigate={onNavigate} />;
  }

  switch (type) {
    case "category":
      return <CategoryPage data={data} slug={slug} isDesktop={isDesktop} onNavigate={onNavigate} />;
    case "area":
      return <AreaPage data={data} slug={slug} isDesktop={isDesktop} onNavigate={onNavigate} />;
    case "provider":
      return <ProviderPage data={data} slug={slug} isDesktop={isDesktop} onNavigate={onNavigate} />;
    default:
      return <NotFound isDesktop={isDesktop} onNavigate={onNavigate} />;
  }
}
