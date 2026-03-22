import { useState, useMemo, useEffect } from "react";
import { C, CATEGORIES, CAT_EMOJI, SEASON_TYPES, DAY_LENGTHS } from "../constants/brand";
import { s } from "../styles/shared";
import EmptyState from "../components/EmptyState";
import PromoBanner from "../components/PromoBanner";
import { SkeletonList } from "../components/SkeletonCard";
import KidFilterBar from "../components/KidFilterBar";
import { useDataFreshness } from "../hooks/useDataFreshness";
import { supabase } from "../lib/supabase";
import fallbackPrograms from "../data/programs.json";
import {
  REGISTRATION_STATUSES,
  getRegistrationStatus,
  isMunicipalProvider,
  sortPrograms,
  fmtDate,
  PAGE_SIZE,
} from "../utils/helpers";
import { computeEligibility, getEligibilityLabel } from "../utils/ageEligibility";

/* ─── City → Neighbourhood groupings ─── */
const CITY_NEIGHBOURHOODS = [
  {
    city: "Vancouver",
    neighbourhoods: [
      "Cambie", "Coal Harbour", "Commercial Drive", "Downtown",
      "Dunbar-Southlands", "Fairview", "Grandview-Woodland", "Hastings-Sunrise",
      "Kensington-Cedar Cottage", "Kerrisdale", "Killarney", "Kitsilano",
      "Main Street", "Marpole", "Mount Pleasant", "Point Grey",
      "Renfrew-Collingwood", "Riley Park", "Shaughnessy", "Strathcona",
      "Sunset", "University Endowment Lands", "West End", "West Point Grey",
      "Yaletown",
    ],
  },
  {
    city: "Burnaby",
    neighbourhoods: [
      "Burnaby Heights", "Capitol Hill", "Cariboo", "Central Park",
      "Deer Lake", "Edmonds", "Metrotown", "SFU / UniverCity",
      "South Slope", "Sperling-Duthie",
    ],
  },
  {
    city: "North Vancouver",
    neighbourhoods: [
      "Central Lonsdale", "Deep Cove", "Delbrook", "Lower Capilano",
      "Lower Lonsdale", "Lynn Creek", "Lynn Valley", "Maplewood", "Seymour",
    ],
  },
  {
    city: "West Vancouver",
    neighbourhoods: ["Ambleside", "British Properties", "Gleneagles"],
  },
  {
    city: "Richmond",
    neighbourhoods: [
      "Broadmoor", "City Centre", "East Cambie", "Ironwood",
      "Sea Island", "South Arm", "Steveston", "Thompson",
    ],
  },
  {
    city: "New Westminster",
    neighbourhoods: ["Downtown New West", "Moody Park", "Queens Park", "Queensborough"],
  },
  { city: "Surrey", neighbourhoods: ["South Surrey"] },
  {
    city: "Coquitlam",
    neighbourhoods: ["Burquitlam", "Central Coquitlam", "Maillardville"],
  },
  { city: "Port Coquitlam", neighbourhoods: ["Central Port Coquitlam"] },
  { city: "Maple Ridge", neighbourhoods: ["Town Centre"] },
  { city: "Pitt Meadows", neighbourhoods: ["Central Pitt Meadows"] },
  { city: "Squamish", neighbourhoods: ["Squamish"] },
  { city: "Bowen Island", neighbourhoods: ["Bowen Island"] },
];

const ALL_NEIGHBOURHOODS = CITY_NEIGHBOURHOODS.flatMap((c) => c.neighbourhoods);

const COST_RANGES = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Free", min: 0, max: 0 },
  { label: "Under $100", min: 0.01, max: 100 },
  { label: "$100 - $250", min: 100, max: 250 },
  { label: "$250 - $500", min: 250, max: 500 },
  { label: "$500+", min: 500, max: Infinity },
];

const PROGRAM_LENGTHS = [
  { key: "full-week", label: "Full Week (5 days)" },
  { key: "partial-week", label: "Partial Week (2–4 days)" },
  { key: "multi-week", label: "Multi-Week" },
];

function getProgramLength(p) {
  const sd = p.startDate, ed = p.endDate;
  if (!sd || !ed) return "full-week"; // default assumption
  const days = Math.round((new Date(ed) - new Date(sd)) / 86400000) + 1;
  if (days <= 1) return "partial-week";
  if (days <= 4) return "partial-week";
  if (days <= 5) return "full-week";
  return "multi-week";
}

const SORT_OPTIONS = [
  { key: "relevance", label: "Relevance" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "starting-soon", label: "Starting Soon" },
  { key: "az", label: "A-Z" },
];

/* ─── Directory Card (no status, different from ProgramCard) ─── */
function DirectoryCard({ program, alreadyAdded, onTap, favorited, onToggleFavorite, regStatus, eligibility }) {
  const statusInfo = REGISTRATION_STATUSES.find((s) => s.key === regStatus) || REGISTRATION_STATUSES[0];
  const isApprox = !isMunicipalProvider(program.provider) && typeof program.cost === "number" && program.cost > 0;
  return (
    <div
      className="skeddo-card"
      style={{
        background: C.white,
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 10,
        border: `1px solid ${C.border}`,
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => onTap(program)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${program.name}`}
    >
      {/* Favorite heart button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(program.id);
        }}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 20,
          lineHeight: 1,
          padding: 10,
          zIndex: 2,
          minWidth: 40,
          minHeight: 40,
          color: favorited ? C.olive : "#9CA3AF",
          transition: "color 0.15s ease, transform 0.15s ease",
        }}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      >
        {favorited ? "\u2764\uFE0F" : "\u2661"}
      </button>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          paddingRight: 28,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={s.cardCategory}>
            {CAT_EMOJI[program.category] || ""} {program.category}
          </div>
          <div style={s.cardName}>{program.name}</div>
          <div style={s.cardProvider}>{program.provider}</div>
          {program.confirmed2026 === false && (
            <div
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 10,
                fontWeight: 600,
                color: "#B8860B",
                background: "#B8860B14",
                padding: "3px 8px",
                borderRadius: 6,
                marginTop: 4,
                display: "inline-block",
              }}
            >
              2026 not yet confirmed — dates & prices are estimates based on prior year
            </div>
          )}
        </div>
        {alreadyAdded && (
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              background: C.seaGreen + "18",
              color: C.seaGreen,
              padding: "3px 8px",
              borderRadius: 6,
              whiteSpace: "nowrap",
            }}
          >
            Added
          </span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 8,
          paddingTop: 8,
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={s.cardMeta}>
          {program.startDate && (
            <span style={program.confirmed2026 === false ? { fontStyle: "italic", color: "#B8860B" } : undefined}>
              {(() => {
                const s = new Date(program.startDate + "T00:00:00");
                const e = program.endDate ? new Date(program.endDate + "T00:00:00") : null;
                const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                const est = program.confirmed2026 === false ? " (est.)" : "";
                if (!e || program.startDate === program.endDate) return fmtDate(program.startDate) + est;
                if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear())
                  return `${mo[s.getMonth()]} ${s.getDate()} – ${e.getDate()}, ${s.getFullYear()}${est}`;
                if (s.getFullYear() === e.getFullYear())
                  return `${mo[s.getMonth()]} ${s.getDate()} – ${mo[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}${est}`;
                return `${fmtDate(program.startDate)} – ${fmtDate(program.endDate)}${est}`;
              })()}
            </span>
          )}
          {program.startDate && program.days && <span> &middot; </span>}
          {program.days && <span>{program.days}</span>}
          {program.startTime && program.endTime && (
            <span style={program.confirmed2026 === false ? { fontStyle: "italic", color: "#B8860B" } : undefined}>
              {" "}
              &middot; {program.startTime}-{program.endTime}{program.confirmed2026 === false ? " (est.)" : ""}
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 16,
            color: C.ink,
          }}
        >
          {program.earlyBirdCost != null && program.earlyBirdDeadline && new Date(program.earlyBirdDeadline) >= new Date()
            ? <><span>${Number(program.earlyBirdCost).toLocaleString()}</span><span style={{ fontSize: 11, color: C.muted, textDecoration: "line-through", marginLeft: 4 }}>${Number(program.cost).toLocaleString()}</span></>
            : program.cost === "TBD" ? "TBD" : program.cost ? (isApprox ? "~$" : "$") + Number(program.cost).toLocaleString() : "Free"
          }
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 6,
          marginTop: 6,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {program.earlyBirdCost != null && program.earlyBirdDeadline && new Date(program.earlyBirdDeadline) >= new Date() && (
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              background: "#FFF8E1",
              color: "#B8860B",
              padding: "2px 8px",
              borderRadius: 10,
            }}
          >
            {"\uD83D\uDC26"} Early Bird
          </span>
        )}
        {(program.ageMin != null || program.ageMax != null) && (
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              background: C.blue + "14",
              color: C.blue,
              padding: "2px 8px",
              borderRadius: 10,
            }}
          >
            {program.ageMin != null && program.ageMax != null
              ? `Ages ${program.ageMin}-${program.ageMax}`
              : program.ageMin != null
                ? `Ages ${program.ageMin}+`
                : `Up to ${program.ageMax}`}
          </span>
        )}
        {program.neighbourhood && (
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              background: C.lilac + "18",
              color: C.lilac,
              padding: "2px 8px",
              borderRadius: 10,
            }}
          >
            {program.neighbourhood}
          </span>
        )}
        {program.campType && (
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              background: C.olive + "18",
              color: C.olive,
              padding: "2px 8px",
              borderRadius: 10,
            }}
          >
            {program.campType}
          </span>
        )}
        {program.dayLength && (
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              background: C.seaGreen + "18",
              color: C.seaGreen,
              padding: "2px 8px",
              borderRadius: 10,
            }}
          >
            {program.dayLength}
          </span>
        )}
        {/* Eligibility badge for borderline programs */}
        {eligibility && eligibility.eligibilityTier === "borderline" && (
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              background: "rgba(244, 162, 97, 0.10)",
              color: "#F4A261",
              padding: "2px 8px",
              borderRadius: 10,
            }}
          >
            {eligibility.label}
          </span>
        )}
        {eligibility && eligibility.eligibilityTier === "eligible" && (
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              background: "rgba(45, 159, 111, 0.10)",
              color: "#2D9F6F",
              padding: "2px 8px",
              borderRadius: 10,
            }}
          >
            {eligibility.label}
          </span>
        )}
        {/* Registration status badge */}
        <span
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 10,
            fontWeight: 700,
            background: statusInfo.color + "18",
            color: statusInfo.color,
            padding: "2px 8px",
            borderRadius: 10,
          }}
        >
          {statusInfo.icon} {statusInfo.label}
          {regStatus === "opening-soon" && program.registrationDateLabel && (
            <span style={{ fontWeight: 400 }}> &mdash; {program.registrationDateLabel}</span>
          )}
        </span>
        {program.spotsRemaining && (() => {
          const isFull = program.spotsRemaining.toLowerCase().startsWith("full");
          const match = program.spotsRemaining.match(/^(\d+)\s+of\s+(\d+)/);
          const spotsLeft = match ? parseInt(match[1], 10) : null;
          const isLow = spotsLeft !== null && spotsLeft <= 5;
          const color = isFull ? "#D32F2F" : isLow ? "#E65100" : C.blue;
          const asOf = program.spotsUpdatedAt ? (() => {
            const d = new Date(program.spotsUpdatedAt);
            const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            const fmt = d.toLocaleString("en-US", { timeZone: "America/Vancouver", hour: "numeric", minute: "2-digit", hour12: true, month: "short", day: "numeric" });
            const parts = fmt.split(", ");
            const datePart = parts[0];
            const timePart = (parts[1] || "").replace(/:00 /, " ").toLowerCase();
            return ` (as of ${datePart} at ${timePart} PDT)`;
          })() : "";
          return (
            <span
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                background: color + "18",
                color,
                padding: "2px 8px",
                borderRadius: 10,
              }}
            >
              {isFull ? "⛔ " : isLow ? "🔥 " : ""}{program.spotsRemaining}
              <span style={{ fontWeight: 400 }}>{asOf}</span>
            </span>
          );
        })()}
      </div>
    </div>
  );
}

export default function DiscoverTab({
  programs,
  kids,
  favorites,
  toggleFavorite,
  isFavorite,
  onAddToSchedule,
  onOpenDirectoryDetail,
  planAccess,
  kidFilter,
  onKidFilter,
}) {
  /* ─── Use programs.json + user-submitted programs from Supabase ─── */
  const [userSubmitted, setUserSubmitted] = useState([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const [showDiscoverBanner, setShowDiscoverBanner] = useState(true);
  const isPaid = planAccess.isPaid;
  const canUseAdvancedFilters = planAccess.canUseAdvancedFilters;

  /* Local toast for upgrade prompts */
  const [filterToast, setFilterToast] = useState(null);
  const showFilterToast = (msg) => { setFilterToast(msg); setTimeout(() => setFilterToast(null), 2500); };

  useEffect(() => {
    async function loadUserSubmitted() {
      setIsLoadingPrograms(true);
      try {
        const { data } = await supabase
          .from("directory_programs")
          .select("*")
          .eq("user_submitted", true);
        if (data && data.length > 0) {
          setUserSubmitted(data.map((row) => ({
            id: `usub-${row.id}`,
            name: row.name,
            provider: row.provider || "",
            category: row.category || "General",
            campType: row.camp_type || "",
            scheduleType: row.schedule_type || "",
            ageMin: row.age_min,
            ageMax: row.age_max,
            startDate: row.start_date || "",
            endDate: row.end_date || "",
            days: row.days || "",
            startTime: row.start_time || "",
            endTime: row.end_time || "",
            cost: row.cost != null ? Number(row.cost) : "",
            indoorOutdoor: row.indoor_outdoor || "",
            neighbourhood: row.neighbourhood || "",
            address: row.address || "",
            lat: row.lat,
            lng: row.lng,
            enrollmentStatus: row.enrollment_status || "Open",
            registrationUrl: row.registration_url || "",
            description: row.description || "",
            tags: row.tags || [],
            activityType: row.activity_type || "",
            confirmed2026: true,
            priceVerified: false,
            userSubmitted: true,
          })));
        }
      } catch {}
      setIsLoadingPrograms(false);
    }
    loadUserSubmitted();
  }, []);

  // Merge static JSON + user-submitted from Supabase (dedup by name+provider)
  const allDirectoryPrograms = useMemo(() => {
    if (userSubmitted.length === 0) return fallbackPrograms;
    const existing = new Set(fallbackPrograms.map((p) => `${p.name}|||${p.provider}`.toLowerCase()));
    const newOnes = userSubmitted.filter((p) => !existing.has(`${p.name}|||${p.provider}`.toLowerCase()));
    return [...fallbackPrograms, ...newOnes];
  }, [userSubmitted]);

  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState(new Set());       // empty = all
  const [selectedSeasons, setSelectedSeasons] = useState(new Set()); // empty = all
  const [selectedHoods, setSelectedHoods] = useState(new Set());     // empty = all
  const [expandedCities, setExpandedCities] = useState(new Set());
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [selectedCosts, setSelectedCosts] = useState(new Set());     // empty = all
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showFilters, setShowFilters] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedRegStatuses, setSelectedRegStatuses] = useState(new Set(["open", "opening-soon"])); // default: show programs users can register for now or very soon
  const [selectedProviders, setSelectedProviders] = useState(new Set());
  const [providerSearch, setProviderSearch] = useState("");
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState(new Set());
  const [showActivityTypeDropdown, setShowActivityTypeDropdown] = useState(false);
  const [showHoodPanel, setShowHoodPanel] = useState(false);
  const [selectedLengths, setSelectedLengths] = useState(new Set());
  const [selectedDayLengths, setSelectedDayLengths] = useState(new Set());
  const [showBorderline, setShowBorderline] = useState(true);

  const { dataVersion, lastCheckedLabel, isStale, isChecking, checkForUpdates } =
    useDataFreshness();

  // Compute unique providers (sorted alphabetically)
  const allProviders = useMemo(() => {
    return [...new Set(allDirectoryPrograms.map((p) => p.provider))].sort((a, b) =>
      a.localeCompare(b, "en", { sensitivity: "base" })
    );
  }, [allDirectoryPrograms]);

  // Compute activity types available for the currently selected categories
  const availableActivityTypes = useMemo(() => {
    const types = new Set();
    allDirectoryPrograms.forEach((p) => {
      if (selectedCats.size === 0 || selectedCats.has(p.category)) {
        if (p.activityType) types.add(p.activityType);
      }
    });
    return [...types].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
  }, [selectedCats, allDirectoryPrograms]);

  // When categories change, prune any selected activity types that are no longer available
  useEffect(() => {
    setSelectedActivityTypes((prev) => {
      if (prev.size === 0) return prev;
      const validTypes = new Set(availableActivityTypes);
      const pruned = new Set([...prev].filter((t) => validTypes.has(t)));
      return pruned.size === prev.size ? prev : pruned;
    });
  }, [availableActivityTypes]);

  // Generic multi-select toggle helper
  const toggleInSet = (setter, value) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      setVisibleCount(PAGE_SIZE);
      return next;
    });
  };

  // Neighbourhood helpers
  const toggleHood = (hood) => {
    setSelectedHoods((prev) => {
      const next = new Set(prev);
      if (next.has(hood)) next.delete(hood);
      else next.add(hood);
      setVisibleCount(PAGE_SIZE);
      return next;
    });
  };

  const toggleCity = (cityObj) => {
    setSelectedHoods((prev) => {
      const next = new Set(prev);
      const allSelected = cityObj.neighbourhoods.every((n) => next.has(n));
      if (allSelected) {
        // Deselect all in this city
        cityObj.neighbourhoods.forEach((n) => next.delete(n));
      } else {
        // Select all in this city
        cityObj.neighbourhoods.forEach((n) => next.add(n));
      }
      setVisibleCount(PAGE_SIZE);
      return next;
    });
  };

  const toggleCityExpand = (city) => {
    setExpandedCities((prev) => {
      const next = new Set(prev);
      if (next.has(city)) next.delete(city);
      else next.add(city);
      return next;
    });
  };

  // Set of already-added program names (for marking duplicates)
  const addedNames = useMemo(() => {
    const set = new Set();
    (programs || []).forEach((p) => set.add(p.name?.toLowerCase()));
    return set;
  }, [programs]);

  // Filtered results
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const minAge = ageMin ? Number(ageMin) : null;
    const maxAge = ageMax ? Number(ageMax) : null;

    // Pre-compute selected cost ranges for matching
    const costRanges = selectedCosts.size > 0
      ? [...selectedCosts].map((i) => COST_RANGES[i])
      : null;

    return allDirectoryPrograms.filter((p) => {
      // Registration status filter (multi-select)
      if (selectedRegStatuses.size > 0 && !selectedRegStatuses.has(getRegistrationStatus(p))) return false;
      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(p.id)) return false;
      // Search
      if (q) {
        const haystack = [p.name, p.provider, p.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // Category (multi-select)
      if (selectedCats.size > 0 && !selectedCats.has(p.category)) return false;
      // Activity type (multi-select, context-aware from category)
      if (selectedActivityTypes.size > 0 && !selectedActivityTypes.has(p.activityType)) return false;
      // Provider (multi-select)
      if (selectedProviders.size > 0 && !selectedProviders.has(p.provider)) return false;
      // Season type (multi-select)
      if (selectedSeasons.size > 0 && !selectedSeasons.has(p.campType)) return false;
      // Neighbourhood (multi-select)
      if (selectedHoods.size > 0 && !selectedHoods.has(p.neighbourhood))
        return false;
      // Age range
      if (minAge != null && p.ageMax != null && p.ageMax < minAge) return false;
      if (maxAge != null && p.ageMin != null && p.ageMin > maxAge) return false;
      // Cost range (multi-select: match ANY selected range)
      if (costRanges) {
        if (p.cost === "TBD") return true; // Show TBD programs in any price filter
        const cost = typeof p.cost === "number" ? p.cost : 0;
        const matchesAny = costRanges.some((range) => {
          if (range.max === 0) return cost === 0; // "Free"
          if (range.min === 0 && range.max === Infinity) return true; // "Any price" (shouldn't be in multi-select, but safe)
          return cost >= range.min && cost <= range.max;
        });
        if (!matchesAny) return false;
      }
      // Program length filter
      if (selectedLengths.size > 0 && !selectedLengths.has(getProgramLength(p))) return false;
      // Day length filter
      if (selectedDayLengths.size > 0 && (!p.dayLength || !selectedDayLengths.has(p.dayLength))) return false;
      return true;
    });
  }, [search, selectedCats, selectedSeasons, selectedHoods, ageMin, ageMax, selectedCosts, showFavoritesOnly, favorites, selectedRegStatuses, selectedProviders, selectedActivityTypes, selectedLengths, selectedDayLengths]);

  // Sort after filtering
  const sortedFiltered = useMemo(
    () => sortPrograms(filtered, sortBy),
    [filtered, sortBy]
  );

  // Get the selected kid (for eligibility filtering)
  const selectedKid = useMemo(
    () => kidFilter ? (kids || []).find((k) => k.id === kidFilter) : null,
    [kidFilter, kids]
  );

  // Compute eligibility for each program when a kid with birth info is selected
  const eligibilityMap = useMemo(() => {
    if (!selectedKid || !selectedKid.birthMonth || !selectedKid.birthYear) return null;
    const map = new Map();
    sortedFiltered.forEach((p) => {
      const startDate = p.startDate || new Date().toISOString().split("T")[0];
      const result = computeEligibility(
        selectedKid.birthMonth, selectedKid.birthYear,
        p.ageMin, p.ageMax, startDate
      );
      const label = getEligibilityLabel(
        selectedKid.name, selectedKid.birthMonth, selectedKid.birthYear,
        p.ageMin, p.ageMax, startDate
      );
      map.set(p.id, { ...result, label });
    });
    return map;
  }, [selectedKid, sortedFiltered]);

  // Apply eligibility filtering — hide ineligible, optionally hide borderline
  const eligibilityFiltered = useMemo(() => {
    if (!eligibilityMap) return sortedFiltered;
    return sortedFiltered.filter((p) => {
      const elig = eligibilityMap.get(p.id);
      if (!elig || elig.eligibilityTier === null) return true; // no age data — show
      if (elig.eligibilityTier === "ineligible") return false; // hide
      if (elig.eligibilityTier === "borderline" && !showBorderline) return false;
      return true;
    });
  }, [sortedFiltered, eligibilityMap, showBorderline]);

  const visiblePrograms = eligibilityFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < eligibilityFiltered.length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <h2 style={s.pageTitle}>Discover</h2>
        <p
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 13,
            color: C.muted,
            marginTop: 2,
          }}
        >
          {isLoadingPrograms
            ? "Loading programs..."
            : `Browse ${allDirectoryPrograms.length.toLocaleString()} programs in Vancouver`}
        </p>
      </div>

      {showDiscoverBanner && !isPaid && (
        <PromoBanner type="upgrade-discover" onDismiss={() => setShowDiscoverBanner(false)} />
      )}

      {/* Search bar */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 16,
            color: C.muted,
            pointerEvents: "none",
          }}
        >
          &#x1F50D;
        </span>
        <input
          style={s.searchBox}
          type="text"
          placeholder="Search programs, providers..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
        />
      </div>

      {/* Kid filter bar for age eligibility */}
      <KidFilterBar kids={kids} kidFilter={kidFilter} onKidFilter={onKidFilter} />

      {/* Show borderline toggle — only when a kid with birth info is selected */}
      {selectedKid && selectedKid.birthMonth && selectedKid.birthYear && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
            padding: "8px 12px",
            background: "rgba(244, 162, 97, 0.08)",
            borderRadius: 10,
          }}
        >
          <label
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 14,
              color: C.ink,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              flex: 1,
            }}
          >
            <input
              type="checkbox"
              checked={showBorderline}
              onChange={() => setShowBorderline((v) => !v)}
              style={{ accentColor: "#F4A261", width: 16, height: 16 }}
            />
            Show borderline camps
          </label>
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 12,
              color: C.muted,
            }}
          >
            Filtering for {selectedKid.name}
          </span>
        </div>
      )}

      {/* Data freshness banner */}
      <div
        onClick={!isChecking ? checkForUpdates : undefined}
        role="button"
        tabIndex={0}
        aria-label={isChecking ? "Checking for updates" : "Check for program data updates"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 12,
          padding: "6px 12px",
          borderRadius: 8,
          background: isStale ? C.olive + "12" : C.seaGreen + "0A",
          cursor: isChecking ? "default" : "pointer",
          transition: "all 0.2s",
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: isStale ? C.olive : C.muted,
            lineHeight: 1,
            display: "inline-block",
            animation: isChecking ? "skeddo-spin 1s linear infinite" : "none",
          }}
        >
          ↻
        </span>
        <span
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: isStale ? C.olive : C.muted,
          }}
        >
          {isChecking
            ? "Checking for updates..."
            : isStale
              ? `Data updated: ${dataVersion} · Tap to check for updates`
              : `Data updated: ${dataVersion} · Checked ${lastCheckedLabel}`}
        </span>
      </div>
      <style>{`
        @keyframes skeddo-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Sort chips */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 10,
            fontWeight: 700,
            color: C.muted,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          SORT BY
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            paddingBottom: 4,
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className="chip-btn"
              onClick={() => {
                setSortBy(opt.key);
                setVisibleCount(PAGE_SIZE);
              }}
              aria-label={`Sort by ${opt.label}`}
              aria-pressed={sortBy === opt.key}
              style={{
                ...s.filterChip,
                fontSize: 12,
                whiteSpace: "nowrap",
                flexShrink: 0,
                background: sortBy === opt.key ? C.seaGreen : "transparent",
                color: sortBy === opt.key ? C.cream : C.muted,
                borderColor: sortBy === opt.key ? C.seaGreen : C.border,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Favorites chip + Toggle filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        <button
          className="chip-btn"
          onClick={() => {
            setShowFavoritesOnly((v) => !v);
            setVisibleCount(PAGE_SIZE);
          }}
          aria-label={showFavoritesOnly ? "Show all programs" : "Show only favorited programs"}
          aria-pressed={showFavoritesOnly}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            background: showFavoritesOnly ? C.olive : "transparent",
            color: showFavoritesOnly ? C.cream : C.muted,
            border: `1.5px solid ${showFavoritesOnly ? C.olive : C.border}`,
            borderRadius: 10,
            padding: "6px 14px",
            cursor: "pointer",
            transition: "all 0.12s ease",
          }}
        >
          {showFavoritesOnly ? "\u2764\uFE0F" : "\u2661"} Favorites
          {favorites.length > 0 && ` (${favorites.length})`}
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          aria-label={showFilters ? "Hide filter panel" : "Show filter panel"}
          aria-expanded={showFilters}
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          color: C.seaGreen,
          background: "none",
          border: `1.5px solid ${C.seaGreen}`,
          borderRadius: 10,
          padding: "6px 14px",
          cursor: "pointer",
        }}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}{" "}
        {showFilters ? "\u25B2" : "\u25BC"}
      </button>
      </div>

      {showFilters && (
        <div
          style={{
            background: C.white,
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
            border: `1px solid ${C.border}`,
          }}
        >
          {/* Registration status chips (multi-select) */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              REGISTRATION STATUS{selectedRegStatuses.size > 0 ? ` (${selectedRegStatuses.size})` : ""}
            </div>
            {selectedRegStatuses.size > 0 && (
              <button
                onClick={() => { setSelectedRegStatuses(new Set()); setVisibleCount(PAGE_SIZE); }}
                aria-label="Clear registration status filters"
                style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: C.danger, background: "none", border: "none", cursor: "pointer" }}
              >
                Clear
              </button>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            {REGISTRATION_STATUSES.map((st) => {
              const isActive = selectedRegStatuses.has(st.key);
              return (
                <button
                  key={st.key}
                  className="chip-btn"
                  onClick={() => toggleInSet(setSelectedRegStatuses, st.key)}
                  aria-label={`Filter by registration status: ${st.label}`}
                  aria-pressed={isActive}
                  style={{
                    ...s.filterChip,
                    fontSize: 12,
                    background: isActive ? st.color : "transparent",
                    color: isActive ? C.cream : C.muted,
                    borderColor: isActive ? st.color : C.border,
                  }}
                >
                  {st.icon} {st.label}
                </button>
              );
            })}
          </div>

          {/* Category chips (multi-select) */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              CATEGORY{selectedCats.size > 0 ? ` (${selectedCats.size})` : ""}
            </div>
            {selectedCats.size > 0 && (
              <button
                onClick={() => { setSelectedCats(new Set()); setVisibleCount(PAGE_SIZE); }}
                aria-label="Clear category filters"
                style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: C.danger, background: "none", border: "none", cursor: "pointer" }}
              >
                Clear
              </button>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCats.has(cat);
              return (
                <button
                  key={cat}
                  className="chip-btn"
                  onClick={() => toggleInSet(setSelectedCats, cat)}
                  aria-label={`Filter by category: ${cat}`}
                  aria-pressed={isActive}
                  style={{
                    ...s.filterChip,
                    fontSize: 12,
                    background: isActive ? C.blue : "transparent",
                    color: isActive ? C.cream : C.muted,
                    borderColor: isActive ? C.blue : C.border,
                  }}
                >
                  {(CAT_EMOJI[cat] || "") + " "}{cat}
                </button>
              );
            })}
          </div>

          {/* Activity type dropdown (context-aware from selected categories) */}
          {availableActivityTypes.length > 0 && (
            <div onClick={!canUseAdvancedFilters ? () => showFilterToast("Upgrade to Skeddo Plus for advanced filters") : undefined}>
            <div style={!canUseAdvancedFilters ? { pointerEvents: "none", opacity: 0.4 } : undefined}>
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.muted,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  ACTIVITY TYPE{selectedActivityTypes.size > 0 ? ` (${selectedActivityTypes.size})` : ""}
                  {!canUseAdvancedFilters && <span style={{ marginLeft: 6, fontSize: 9, background: C.seaGreen, color: "#fff", borderRadius: 4, padding: "1px 5px", fontWeight: 700, letterSpacing: 0, textTransform: "none", pointerEvents: "auto", opacity: 1 }}>Plus</span>}
                  {selectedCats.size > 0 && (
                    <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                      {" "}&mdash; filtered by selected categories
                    </span>
                  )}
                </div>
                {selectedActivityTypes.size > 0 && (
                  <button
                    onClick={() => { setSelectedActivityTypes(new Set()); setVisibleCount(PAGE_SIZE); }}
                    aria-label="Clear activity type filters"
                    style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: C.danger, background: "none", border: "none", cursor: "pointer" }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div style={{ position: "relative", marginBottom: 14 }}>
                <button
                  onClick={() => setShowActivityTypeDropdown(!showActivityTypeDropdown)}
                  aria-label="Select activity types"
                  aria-expanded={showActivityTypeDropdown}
                  style={{
                    width: "100%",
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 13,
                    color: selectedActivityTypes.size > 0 ? C.ink : C.muted,
                    background: C.white,
                    border: `1.5px solid ${showActivityTypeDropdown ? C.blue : C.border}`,
                    borderRadius: 10,
                    padding: "10px 12px",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                    {selectedActivityTypes.size === 0
                      ? "All activity types"
                      : [...selectedActivityTypes].join(", ")}
                  </span>
                  <span style={{ fontSize: 10, marginLeft: 8, color: C.muted }}>
                    {showActivityTypeDropdown ? "\u25B2" : "\u25BC"}
                  </span>
                </button>
                {showActivityTypeDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      background: C.white,
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 10,
                      marginTop: 4,
                      maxHeight: 200,
                      overflowY: "auto",
                      zIndex: 20,
                      boxShadow: "0 4px 12px rgba(27,36,50,0.1)",
                    }}
                  >
                    {availableActivityTypes.map((at) => {
                      const isActive = selectedActivityTypes.has(at);
                      return (
                        <div
                          key={at}
                          role="option"
                          aria-selected={isActive}
                          onClick={() => { toggleInSet(setSelectedActivityTypes, at); setVisibleCount(PAGE_SIZE); }}
                          style={{
                            fontFamily: "'Barlow', sans-serif",
                            fontSize: 13,
                            padding: "9px 12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            background: isActive ? `${C.blue}10` : "transparent",
                            color: isActive ? C.ink : C.muted,
                            borderBottom: `1px solid ${C.border}`,
                          }}
                        >
                          <span style={{ width: 18, textAlign: "center", fontSize: 14, color: C.blue }}>
                            {isActive ? "\u2713" : ""}
                          </span>
                          {at}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
            </div>
            </div>
          )}

          {/* Provider searchable multi-select */}
          <div onClick={!canUseAdvancedFilters ? () => showFilterToast("Upgrade to Skeddo Plus for advanced filters") : undefined}>
          <div style={!canUseAdvancedFilters ? { pointerEvents: "none", opacity: 0.4 } : undefined}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              PROVIDER{selectedProviders.size > 0 ? ` (${selectedProviders.size})` : ""}
              {!canUseAdvancedFilters && <span style={{ marginLeft: 6, fontSize: 9, background: C.seaGreen, color: "#fff", borderRadius: 4, padding: "1px 5px", fontWeight: 700, letterSpacing: 0, textTransform: "none", pointerEvents: "auto", opacity: 1 }}>Plus</span>}
            </div>
            {selectedProviders.size > 0 && (
              <button
                onClick={() => { setSelectedProviders(new Set()); setVisibleCount(PAGE_SIZE); }}
                aria-label="Clear provider filters"
                style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: C.danger, background: "none", border: "none", cursor: "pointer" }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Selected providers as removable chips */}
          {selectedProviders.size > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              {[...selectedProviders].sort().map((prov) => (
                <button
                  key={prov}
                  className="chip-btn"
                  onClick={() => toggleInSet(setSelectedProviders, prov)}
                  aria-label={`Remove provider filter: ${prov}`}
                  style={{
                    ...s.filterChip,
                    fontSize: 11,
                    background: C.seaGreen,
                    color: C.cream,
                    borderColor: C.seaGreen,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {prov} <span style={{ fontSize: 13, lineHeight: 1 }}>&times;</span>
                </button>
              ))}
            </div>
          )}

          {/* Provider search input + dropdown */}
          <div style={{ position: "relative", marginBottom: 14 }}>
            <input
              style={{
                ...s.input,
                fontSize: 13,
                paddingLeft: 32,
              }}
              placeholder="Search providers..."
              value={providerSearch}
              onChange={(e) => {
                setProviderSearch(e.target.value);
                setShowProviderDropdown(true);
              }}
              onFocus={() => setShowProviderDropdown(true)}
              onBlur={() => setTimeout(() => setShowProviderDropdown(false), 200)}
            />
            <span
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 14,
                color: C.muted,
                pointerEvents: "none",
              }}
            >
              &#x1F50D;
            </span>
            {showProviderDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  maxHeight: 180,
                  overflowY: "auto",
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  boxShadow: "0 4px 12px rgba(27,36,50,0.08)",
                  zIndex: 20,
                  marginTop: 4,
                }}
              >
                {allProviders
                  .filter((prov) =>
                    prov.toLowerCase().includes(providerSearch.toLowerCase().trim())
                  )
                  .slice(0, 30)
                  .map((prov) => {
                    const isSelected = selectedProviders.has(prov);
                    return (
                      <div
                        key={prov}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          toggleInSet(setSelectedProviders, prov);
                        }}
                        role="option"
                        aria-selected={isSelected}
                        style={{
                          padding: "8px 12px",
                          fontFamily: "'Barlow', sans-serif",
                          fontSize: 13,
                          color: isSelected ? C.seaGreen : C.ink,
                          fontWeight: isSelected ? 700 : 400,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          borderBottom: `1px solid ${C.border}`,
                          background: isSelected ? C.seaGreen + "08" : "transparent",
                        }}
                      >
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 3,
                            border: `2px solid ${isSelected ? C.seaGreen : C.border}`,
                            background: isSelected ? C.seaGreen : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            color: C.white,
                            flexShrink: 0,
                          }}
                        >
                          {isSelected ? "✓" : ""}
                        </span>
                        {prov}
                      </div>
                    );
                  })}
                {allProviders.filter((prov) =>
                  prov.toLowerCase().includes(providerSearch.toLowerCase().trim())
                ).length === 0 && (
                  <div
                    style={{
                      padding: "12px",
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: 13,
                      color: C.muted,
                      textAlign: "center",
                    }}
                  >
                    No providers found
                  </div>
                )}
              </div>
            )}
          </div>
          </div>
          </div>

          {/* Season type chips (multi-select) */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              SEASON TYPE{selectedSeasons.size > 0 ? ` (${selectedSeasons.size})` : ""}
            </div>
            {selectedSeasons.size > 0 && (
              <button
                onClick={() => { setSelectedSeasons(new Set()); setVisibleCount(PAGE_SIZE); }}
                aria-label="Clear season type filters"
                style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: C.danger, background: "none", border: "none", cursor: "pointer" }}
              >
                Clear
              </button>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            {SEASON_TYPES.map((st) => {
              const isActive = selectedSeasons.has(st);
              return (
                <button
                  key={st}
                  className="chip-btn"
                  onClick={() => toggleInSet(setSelectedSeasons, st)}
                  aria-label={`Filter by season type: ${st}`}
                  aria-pressed={isActive}
                  style={{
                    ...s.filterChip,
                    fontSize: 12,
                    background: isActive ? C.olive : "transparent",
                    color: isActive ? C.cream : C.muted,
                    borderColor: isActive ? C.olive : C.border,
                  }}
                >
                  {st}
                </button>
              );
            })}
          </div>

          {/* Program length filter */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              PROGRAM LENGTH{selectedLengths.size > 0 ? ` (${selectedLengths.size})` : ""}
            </div>
            {selectedLengths.size > 0 && (
              <button
                onClick={() => { setSelectedLengths(new Set()); setVisibleCount(PAGE_SIZE); }}
                aria-label="Clear program length filters"
                style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: C.danger, background: "none", border: "none", cursor: "pointer" }}
              >
                Clear
              </button>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            {PROGRAM_LENGTHS.map((pl) => {
              const isActive = selectedLengths.has(pl.key);
              return (
                <button
                  key={pl.key}
                  className="chip-btn"
                  onClick={() => toggleInSet(setSelectedLengths, pl.key)}
                  aria-label={`Filter by program length: ${pl.label}`}
                  aria-pressed={isActive}
                  style={{
                    ...s.filterChip,
                    fontSize: 12,
                    background: isActive ? C.olive : "transparent",
                    color: isActive ? C.cream : C.muted,
                    borderColor: isActive ? C.olive : C.border,
                  }}
                >
                  {pl.label}
                </button>
              );
            })}
          </div>

          {/* Day Length filter */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              DAY LENGTH{selectedDayLengths.size > 0 ? ` (${selectedDayLengths.size})` : ""}
            </div>
            {selectedDayLengths.size > 0 && (
              <button
                onClick={() => { setSelectedDayLengths(new Set()); setVisibleCount(PAGE_SIZE); }}
                aria-label="Clear day length filters"
                style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: C.danger, background: "none", border: "none", cursor: "pointer" }}
              >
                Clear
              </button>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            {DAY_LENGTHS.map((dl) => {
              const isActive = selectedDayLengths.has(dl);
              return (
                <button
                  key={dl}
                  className="chip-btn"
                  onClick={() => toggleInSet(setSelectedDayLengths, dl)}
                  aria-label={`Filter by day length: ${dl}`}
                  aria-pressed={isActive}
                  style={{
                    ...s.filterChip,
                    fontSize: 12,
                    background: isActive ? C.olive : "transparent",
                    color: isActive ? C.cream : C.muted,
                    borderColor: isActive ? C.olive : C.border,
                  }}
                >
                  {dl}
                </button>
              );
            })}
          </div>

          {/* Neighbourhood multi-select by city */}
          <div onClick={!canUseAdvancedFilters ? () => showFilterToast("Upgrade to Skeddo Plus for advanced filters") : undefined}>
          <div style={!canUseAdvancedFilters ? { pointerEvents: "none", opacity: 0.4 } : undefined}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              NEIGHBOURHOODS{selectedHoods.size > 0 ? ` (${selectedHoods.size} selected)` : ""}
              {!canUseAdvancedFilters && <span style={{ marginLeft: 6, fontSize: 9, background: C.seaGreen, color: "#fff", borderRadius: 4, padding: "1px 5px", fontWeight: 700, letterSpacing: 0, textTransform: "none", pointerEvents: "auto", opacity: 1 }}>Plus</span>}
            </div>
            {selectedHoods.size > 0 && (
              <button
                onClick={() => {
                  setSelectedHoods(new Set());
                  setVisibleCount(PAGE_SIZE);
                }}
                aria-label="Clear neighbourhood filters"
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.danger,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={() => setShowHoodPanel(!showHoodPanel)}
            aria-label={showHoodPanel ? "Collapse neighbourhood filter" : "Expand neighbourhood filter"}
            aria-expanded={showHoodPanel}
            style={{
              width: "100%",
              fontFamily: "'Barlow', sans-serif",
              fontSize: 13,
              color: selectedHoods.size > 0 ? C.ink : C.muted,
              background: C.white,
              border: `1.5px solid ${showHoodPanel ? C.blue : C.border}`,
              borderRadius: 10,
              padding: "10px 12px",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: showHoodPanel ? 6 : 14,
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
              {selectedHoods.size === 0
                ? "All neighbourhoods"
                : `${selectedHoods.size} neighbourhood${selectedHoods.size !== 1 ? "s" : ""} selected`}
            </span>
            <span style={{ fontSize: 10, marginLeft: 8, color: C.muted }}>
              {showHoodPanel ? "\u25B2" : "\u25BC"}
            </span>
          </button>
          {showHoodPanel && <div
            style={{
              background: C.cream,
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              marginBottom: 14,
              overflow: "hidden",
            }}
          >
            {CITY_NEIGHBOURHOODS.map((cityObj) => {
              const isExpanded = expandedCities.has(cityObj.city);
              const selectedInCity = cityObj.neighbourhoods.filter((n) => selectedHoods.has(n)).length;
              const allInCitySelected = selectedInCity === cityObj.neighbourhoods.length;
              const someInCitySelected = selectedInCity > 0 && !allInCitySelected;

              return (
                <div key={cityObj.city}>
                  {/* City header row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 12px",
                      borderBottom: `1px solid ${C.border}`,
                      cursor: "pointer",
                    }}
                    onClick={() => toggleCityExpand(cityObj.city)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} ${cityObj.city} neighbourhoods`}
                  >
                    {/* Expand/collapse arrow */}
                    <span
                      style={{
                        fontSize: 10,
                        color: C.muted,
                        transition: "transform 0.15s",
                        transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                        display: "inline-block",
                      }}
                    >
                      ▶
                    </span>

                    {/* City name */}
                    <span
                      style={{
                        flex: 1,
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.ink,
                      }}
                    >
                      {cityObj.city}
                      {someInCitySelected && (
                        <span style={{ color: C.muted, fontWeight: 400 }}>
                          {" "}({selectedInCity}/{cityObj.neighbourhoods.length})
                        </span>
                      )}
                    </span>

                    {/* Select All / Deselect All button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCity(cityObj);
                      }}
                      aria-label={allInCitySelected ? `Deselect all ${cityObj.city} neighbourhoods` : `Select all ${cityObj.city} neighbourhoods`}
                      style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        color: allInCitySelected ? C.danger : C.seaGreen,
                        background: allInCitySelected ? C.dangerBg : C.seaGreen + "12",
                        border: "none",
                        borderRadius: 6,
                        padding: "3px 8px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {allInCitySelected ? "Deselect All" : "Select All"}
                    </button>
                  </div>

                  {/* Expanded neighbourhood list */}
                  {isExpanded && (
                    <div style={{ padding: "4px 12px 4px 28px" }}>
                      {cityObj.neighbourhoods.sort().map((hood) => {
                        const isSelected = selectedHoods.has(hood);
                        return (
                          <label
                            key={hood}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "6px 0",
                              cursor: "pointer",
                              fontFamily: "'Barlow', sans-serif",
                              fontSize: 13,
                              color: isSelected ? C.ink : C.muted,
                              fontWeight: isSelected ? 600 : 400,
                            }}
                          >
                            <span
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: 4,
                                border: `2px solid ${isSelected ? C.seaGreen : C.border}`,
                                background: isSelected ? C.seaGreen : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                color: C.white,
                                flexShrink: 0,
                                transition: "all 0.12s",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                toggleHood(hood);
                              }}
                            >
                              {isSelected ? "✓" : ""}
                            </span>
                            <span onClick={(e) => { e.preventDefault(); toggleHood(hood); }}>
                              {hood}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>}
          </div>
          </div>

          {/* Age range */}
          <div
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color: C.muted,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            AGE RANGE
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <input
              style={s.input}
              type="number"
              placeholder="Min age"
              value={ageMin}
              onChange={(e) => {
                setAgeMin(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
            />
            <input
              style={s.input}
              type="number"
              placeholder="Max age"
              value={ageMax}
              onChange={(e) => {
                setAgeMax(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
            />
          </div>

          {/* Cost range chips (multi-select) */}
          <div onClick={!canUseAdvancedFilters ? () => showFilterToast("Upgrade to Skeddo Plus for advanced filters") : undefined}>
          <div style={!canUseAdvancedFilters ? { pointerEvents: "none", opacity: 0.4 } : undefined}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              COST{selectedCosts.size > 0 ? ` (${selectedCosts.size})` : ""}
              {!canUseAdvancedFilters && <span style={{ marginLeft: 6, fontSize: 9, background: C.seaGreen, color: "#fff", borderRadius: 4, padding: "1px 5px", fontWeight: 700, letterSpacing: 0, textTransform: "none", pointerEvents: "auto", opacity: 1 }}>Plus</span>}
            </div>
            {selectedCosts.size > 0 && (
              <button
                onClick={() => { setSelectedCosts(new Set()); setVisibleCount(PAGE_SIZE); }}
                aria-label="Clear cost filters"
                style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: C.danger, background: "none", border: "none", cursor: "pointer" }}
              >
                Clear
              </button>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            {COST_RANGES.slice(1).map((r, i) => {
              const idx = i + 1; // skip "Any price" (index 0)
              const isActive = selectedCosts.has(idx);
              return (
                <button
                  key={idx}
                  className="chip-btn"
                  onClick={() => toggleInSet(setSelectedCosts, idx)}
                  aria-label={`Filter by cost: ${r.label}`}
                  aria-pressed={isActive}
                  style={{
                    ...s.filterChip,
                    fontSize: 12,
                    background: isActive ? C.lilac : "transparent",
                    color: isActive ? C.cream : C.muted,
                    borderColor: isActive ? C.lilac : C.border,
                  }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
          </div>
          </div>
        </div>
      )}

      {/* Results count + clear filters */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: C.muted,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {filtered.length.toLocaleString()} program
          {filtered.length !== 1 && "s"} found
        </span>
        {(search || selectedCats.size > 0 || selectedSeasons.size > 0 || selectedHoods.size > 0 || ageMin || ageMax || selectedCosts.size > 0 || showFavoritesOnly || sortBy !== "relevance" || selectedProviders.size > 0 || selectedActivityTypes.size > 0 || selectedDayLengths.size > 0 || !(selectedRegStatuses.size === 2 && selectedRegStatuses.has("open") && selectedRegStatuses.has("opening-soon"))) && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedCats(new Set());
              setSelectedSeasons(new Set());
              setSelectedHoods(new Set());
              setAgeMin("");
              setAgeMax("");
              setSelectedCosts(new Set());
              setShowFavoritesOnly(false);
              setSortBy("relevance");
              setSelectedRegStatuses(new Set(["open", "opening-soon", "likely-coming-soon"]));
              setSelectedProviders(new Set());
              setSelectedActivityTypes(new Set());
              setSelectedLengths(new Set());
              setSelectedDayLengths(new Set());
              setProviderSearch("");
              setVisibleCount(PAGE_SIZE);
            }}
            aria-label="Clear all filters"
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              color: C.danger,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Result count and active filter note */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
      }}>
        <span style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: C.muted,
        }}>
          {eligibilityFiltered.length.toLocaleString()} program{eligibilityFiltered.length !== 1 ? "s" : ""}
        </span>
        {selectedRegStatuses.size > 0 && selectedRegStatuses.size < REGISTRATION_STATUSES.length && (
          <span style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 10,
            fontWeight: 700,
            color: C.olive,
            background: C.olive + "14",
            padding: "2px 8px",
            borderRadius: 6,
          }}>
            Filtered by registration status
          </span>
        )}
      </div>

      {/* Program cards */}
      {isLoadingPrograms && <SkeletonList count={6} />}
      {!isLoadingPrograms && filtered.length === 0 && (
        <EmptyState
          icon={"\uD83D\uDD0D"}
          message="No programs match your search. Try broadening your filters."
        />
      )}
      {!isLoadingPrograms && visiblePrograms.map((p) => (
        <DirectoryCard
          key={p.id}
          program={p}
          alreadyAdded={addedNames.has(p.name?.toLowerCase())}
          favorited={isFavorite(p.id)}
          onToggleFavorite={toggleFavorite}
          onTap={onOpenDirectoryDetail}
          regStatus={getRegistrationStatus(p)}
          eligibility={eligibilityMap ? eligibilityMap.get(p.id) : null}
        />
      ))}

      {/* Load more */}
      {hasMore && (
        <button
          onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
          aria-label={`Load more programs, ${eligibilityFiltered.length - visibleCount} remaining`}
          style={{
            width: "100%",
            fontFamily: "'Barlow', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: C.seaGreen,
            background: C.white,
            border: `1.5px solid ${C.seaGreen}`,
            borderRadius: 12,
            padding: "12px 16px",
            cursor: "pointer",
            marginTop: 8,
            marginBottom: 8,
            transition: "all 0.15s",
          }}
        >
          Load more ({eligibilityFiltered.length - visibleCount} remaining)
        </button>
      )}

      {/* Filter upgrade toast */}
      {filterToast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: 90,
            left: "50%",
            transform: "translateX(-50%)",
            background: C.ink,
            color: C.cream,
            fontFamily: "'Barlow', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            padding: "12px 20px",
            borderRadius: 10,
            boxShadow: "0 4px 16px rgba(27,36,50,0.2)",
            zIndex: 9999,
            animation: "fadeIn 0.2s ease",
            whiteSpace: "nowrap",
          }}
        >
          {filterToast}
        </div>
      )}
    </div>
  );
}
