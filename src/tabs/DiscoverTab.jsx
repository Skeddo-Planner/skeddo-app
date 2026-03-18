import { useState, useMemo } from "react";
import { C, CATEGORIES, CAT_EMOJI, SEASON_TYPES } from "../constants/brand";
import { s } from "../styles/shared";
import EmptyState from "../components/EmptyState";
import { useDataFreshness } from "../hooks/useDataFreshness";
import allDirectoryPrograms from "../data/programs.json";

/* ─── Compute registration status from dates + enrollment field ─── */
const REGISTRATION_STATUSES = [
  { key: "open", label: "Open for Registration", color: "#3A9E6A", icon: "✓" },
  { key: "opening-soon", label: "Opening Soon", color: "#2A5F8A", icon: "◷" },
  { key: "full", label: "Full / Waitlist", color: "#B89A2A", icon: "●" },
  { key: "in-progress", label: "In Progress", color: "#C87FA0", icon: "▶" },
  { key: "completed", label: "Completed", color: "#8A9A8E", icon: "✗" },
];

function getRegistrationStatus(program) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = program.startDate ? new Date(program.startDate + "T00:00:00") : null;
  const end = program.endDate ? new Date(program.endDate + "T00:00:00") : null;

  // If the program has ended, it's completed
  if (end && end < today) return "completed";

  // If the program has started but not ended, it's in progress
  if (start && start <= today) return "in-progress";

  // Program hasn't started yet — check enrollment status
  if (program.enrollmentStatus === "Full") return "full";
  if (program.enrollmentStatus === "Coming Soon") return "opening-soon";

  // Default: open for registration
  return "open";
}

/* ─── City → Neighbourhood groupings ─── */
const CITY_NEIGHBOURHOODS = [
  {
    city: "Vancouver",
    neighbourhoods: [
      "Downtown", "Dunbar-Southlands", "Fairview", "Grandview-Woodland",
      "Hastings-Sunrise", "Kensington-Cedar Cottage", "Kerrisdale", "Killarney",
      "Kitsilano", "Marpole", "Mount Pleasant", "Renfrew-Collingwood",
      "Riley Park", "Strathcona", "Sunset", "West End", "West Point Grey",
    ],
  },
  { city: "North Vancouver", neighbourhoods: ["North Vancouver"] },
  { city: "West Vancouver", neighbourhoods: ["West Vancouver"] },
  { city: "Burnaby", neighbourhoods: ["Burnaby"] },
  { city: "Richmond", neighbourhoods: ["Richmond"] },
  { city: "New Westminster", neighbourhoods: ["New Westminster"] },
  { city: "Greater Vancouver", neighbourhoods: ["Greater Vancouver"] },
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

const SORT_OPTIONS = [
  { key: "relevance", label: "Relevance" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "starting-soon", label: "Starting Soon" },
  { key: "az", label: "A-Z" },
];

const PAGE_SIZE = 50;

/* ─── Sort helper ─── */
function sortPrograms(programs, sortKey) {
  if (sortKey === "relevance") return programs;
  const sorted = [...programs];
  switch (sortKey) {
    case "price-asc":
      sorted.sort((a, b) => (a.cost || 0) - (b.cost || 0));
      break;
    case "price-desc":
      sorted.sort((a, b) => (b.cost || 0) - (a.cost || 0));
      break;
    case "starting-soon":
      sorted.sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : Infinity;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : Infinity;
        return dateA - dateB;
      });
      break;
    case "az":
      sorted.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", "en", { sensitivity: "base" })
      );
      break;
    default:
      break;
  }
  return sorted;
}

/* ─── Directory Card (no status, different from ProgramCard) ─── */
function DirectoryCard({ program, alreadyAdded, onTap, favorited, onToggleFavorite, regStatus }) {
  const statusInfo = REGISTRATION_STATUSES.find((s) => s.key === regStatus) || REGISTRATION_STATUSES[0];
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
          padding: 4,
          zIndex: 2,
          color: favorited ? C.olive : C.border,
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
          {program.days && <span>{program.days}</span>}
          {program.startTime && program.endTime && (
            <span>
              {" "}
              &middot; {program.startTime}-{program.endTime}
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 16,
            color: C.ink,
          }}
        >
          {program.cost ? "$" + Number(program.cost).toLocaleString() : "Free"}
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
        {program.ageMin != null && program.ageMax != null && (
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
            Ages {program.ageMin}-{program.ageMax}
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
        </span>
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
}) {
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
  const [selectedRegStatuses, setSelectedRegStatuses] = useState(new Set(["open", "opening-soon"])); // default: show registrable programs

  const { dataVersion, lastCheckedLabel, isStale, isChecking, checkForUpdates } =
    useDataFreshness();

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
        const cost = p.cost || 0;
        const matchesAny = costRanges.some((range) => {
          if (range.max === 0) return cost === 0; // "Free"
          if (range.min === 0 && range.max === Infinity) return true; // "Any price" (shouldn't be in multi-select, but safe)
          return cost >= range.min && cost <= range.max;
        });
        if (!matchesAny) return false;
      }
      return true;
    });
  }, [search, selectedCats, selectedSeasons, selectedHoods, ageMin, ageMax, selectedCosts, showFavoritesOnly, favorites, selectedRegStatuses]);

  // Sort after filtering
  const sortedFiltered = useMemo(
    () => sortPrograms(filtered, sortBy),
    [filtered, sortBy]
  );

  const visiblePrograms = sortedFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < sortedFiltered.length;

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
          Browse {allDirectoryPrograms.length.toLocaleString()} programs in
          Vancouver
        </p>
      </div>

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

      {/* Data freshness banner */}
      <div
        onClick={!isChecking ? checkForUpdates : undefined}
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

          {/* Neighbourhood multi-select by city */}
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
            </div>
            {selectedHoods.size > 0 && (
              <button
                onClick={() => {
                  setSelectedHoods(new Set());
                  setVisibleCount(PAGE_SIZE);
                }}
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
          <div
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
            </div>
            {selectedCosts.size > 0 && (
              <button
                onClick={() => { setSelectedCosts(new Set()); setVisibleCount(PAGE_SIZE); }}
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
        {(search || selectedCats.size > 0 || selectedSeasons.size > 0 || selectedHoods.size > 0 || ageMin || ageMax || selectedCosts.size > 0 || showFavoritesOnly || sortBy !== "relevance" || !(selectedRegStatuses.size === 2 && selectedRegStatuses.has("open") && selectedRegStatuses.has("opening-soon"))) && (
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
              setSelectedRegStatuses(new Set(["open", "opening-soon"]));
              setVisibleCount(PAGE_SIZE);
            }}
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

      {/* Program cards */}
      {filtered.length === 0 && (
        <EmptyState
          icon={"\uD83D\uDD0D"}
          message="No programs match your search. Try broadening your filters."
        />
      )}
      {visiblePrograms.map((p) => (
        <DirectoryCard
          key={p.id}
          program={p}
          alreadyAdded={addedNames.has(p.name?.toLowerCase())}
          favorited={isFavorite(p.id)}
          onToggleFavorite={toggleFavorite}
          onTap={onOpenDirectoryDetail}
          regStatus={getRegistrationStatus(p)}
        />
      ))}

      {/* Load more */}
      {hasMore && (
        <button
          onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
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
          Load more ({sortedFiltered.length - visibleCount} remaining)
        </button>
      )}
    </div>
  );
}
