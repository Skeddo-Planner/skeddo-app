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
  const [catFilter, setCatFilter] = useState("All");
  const [seasonFilter, setSeasonFilter] = useState("All");
  const [neighbourhood, setNeighbourhood] = useState("All");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [costRange, setCostRange] = useState(0);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showFilters, setShowFilters] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [regStatusFilter, setRegStatusFilter] = useState("All");

  const { dataVersion, lastCheckedLabel, isStale, isChecking, checkForUpdates } =
    useDataFreshness();

  // Extract unique neighbourhoods from dataset
  const neighbourhoods = useMemo(() => {
    const set = new Set();
    allDirectoryPrograms.forEach((p) => {
      if (p.neighbourhood) set.add(p.neighbourhood);
    });
    return Array.from(set).sort();
  }, []);

  // Set of already-added program names (for marking duplicates)
  const addedNames = useMemo(() => {
    const set = new Set();
    (programs || []).forEach((p) => set.add(p.name?.toLowerCase()));
    return set;
  }, [programs]);

  // Filtered results
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const range = COST_RANGES[costRange];
    const minAge = ageMin ? Number(ageMin) : null;
    const maxAge = ageMax ? Number(ageMax) : null;

    return allDirectoryPrograms.filter((p) => {
      // Registration status filter
      if (regStatusFilter !== "All" && getRegistrationStatus(p) !== regStatusFilter) return false;
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
      // Category
      if (catFilter !== "All" && p.category !== catFilter) return false;
      // Season type
      if (seasonFilter !== "All" && p.campType !== seasonFilter) return false;
      // Neighbourhood
      if (neighbourhood !== "All" && p.neighbourhood !== neighbourhood)
        return false;
      // Age range
      if (minAge != null && p.ageMax != null && p.ageMax < minAge) return false;
      if (maxAge != null && p.ageMin != null && p.ageMin > maxAge) return false;
      // Cost range
      if (range) {
        const cost = p.cost || 0;
        if (range.max === 0 && cost !== 0) return false;
        if (range.max !== 0 && range.min > 0) {
          if (cost < range.min || cost > range.max) return false;
        }
      }
      return true;
    });
  }, [search, catFilter, seasonFilter, neighbourhood, ageMin, ageMax, costRange, showFavoritesOnly, favorites, regStatusFilter]);

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
          {/* Registration status chips */}
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
            REGISTRATION STATUS
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            {[{ key: "All", label: "All", color: C.seaGreen }, ...REGISTRATION_STATUSES].map((st) => (
              <button
                key={st.key}
                className="chip-btn"
                onClick={() => {
                  setRegStatusFilter(st.key === "All" ? "All" : st.key);
                  setVisibleCount(PAGE_SIZE);
                }}
                style={{
                  ...s.filterChip,
                  fontSize: 12,
                  background: regStatusFilter === st.key ? (st.color || C.seaGreen) : "transparent",
                  color: regStatusFilter === st.key ? C.cream : C.muted,
                  borderColor: regStatusFilter === st.key ? (st.color || C.seaGreen) : C.border,
                }}
              >
                {st.icon ? `${st.icon} ` : ""}{st.label}
              </button>
            ))}
          </div>

          {/* Category chips */}
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
            CATEGORY
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            {["All", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                className="chip-btn"
                onClick={() => {
                  setCatFilter(cat);
                  setVisibleCount(PAGE_SIZE);
                }}
                style={{
                  ...s.filterChip,
                  fontSize: 12,
                  background: catFilter === cat ? C.blue : "transparent",
                  color: catFilter === cat ? C.cream : C.muted,
                  borderColor: catFilter === cat ? C.blue : C.border,
                }}
              >
                {cat !== "All" && (CAT_EMOJI[cat] || "") + " "}
                {cat}
              </button>
            ))}
          </div>

          {/* Season type chips */}
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
            SEASON TYPE
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            {["All", ...SEASON_TYPES].map((st) => (
              <button
                key={st}
                className="chip-btn"
                onClick={() => {
                  setSeasonFilter(st);
                  setVisibleCount(PAGE_SIZE);
                }}
                style={{
                  ...s.filterChip,
                  fontSize: 12,
                  background: seasonFilter === st ? C.olive : "transparent",
                  color: seasonFilter === st ? C.cream : C.muted,
                  borderColor: seasonFilter === st ? C.olive : C.border,
                }}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Neighbourhood dropdown */}
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
            NEIGHBOURHOOD
          </div>
          <select
            style={{ ...s.input, marginBottom: 14 }}
            value={neighbourhood}
            onChange={(e) => {
              setNeighbourhood(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
          >
            <option value="All">All Neighbourhoods</option>
            {neighbourhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

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

          {/* Cost range dropdown */}
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
            COST
          </div>
          <select
            style={s.input}
            value={costRange}
            onChange={(e) => {
              setCostRange(Number(e.target.value));
              setVisibleCount(PAGE_SIZE);
            }}
          >
            {COST_RANGES.map((r, i) => (
              <option key={i} value={i}>
                {r.label}
              </option>
            ))}
          </select>
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
        {(search || catFilter !== "All" || seasonFilter !== "All" || neighbourhood !== "All" || ageMin || ageMax || costRange !== 0 || showFavoritesOnly || sortBy !== "relevance" || regStatusFilter !== "All") && (
          <button
            onClick={() => {
              setSearch("");
              setCatFilter("All");
              setSeasonFilter("All");
              setNeighbourhood("All");
              setAgeMin("");
              setAgeMax("");
              setCostRange(0);
              setShowFavoritesOnly(false);
              setSortBy("relevance");
              setRegStatusFilter("All");
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
