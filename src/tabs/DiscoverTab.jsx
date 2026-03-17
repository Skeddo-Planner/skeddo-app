import { useState, useMemo } from "react";
import { C, CATEGORIES, CAT_EMOJI, SEASON_TYPES } from "../constants/brand";
import { s } from "../styles/shared";
import EmptyState from "../components/EmptyState";
import allDirectoryPrograms from "../data/programs.json";

const COST_RANGES = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Free", min: 0, max: 0 },
  { label: "Under $100", min: 0.01, max: 100 },
  { label: "$100 - $250", min: 100, max: 250 },
  { label: "$250 - $500", min: 250, max: 500 },
  { label: "$500+", min: 500, max: Infinity },
];

const PAGE_SIZE = 50;

/* ─── Directory Card (no status, different from ProgramCard) ─── */
function DirectoryCard({ program, alreadyAdded, onTap }) {
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
      }}
      onClick={() => onTap(program)}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
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
      </div>
    </div>
  );
}

export default function DiscoverTab({
  programs,
  kids,
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
  }, [search, catFilter, seasonFilter, neighbourhood, ageMin, ageMax, costRange]);

  const visiblePrograms = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

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

      {/* Toggle filters */}
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
          marginBottom: 12,
        }}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}{" "}
        {showFilters ? "\u25B2" : "\u25BC"}
      </button>

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
        {(search || catFilter !== "All" || seasonFilter !== "All" || neighbourhood !== "All" || ageMin || ageMax || costRange !== 0) && (
          <button
            onClick={() => {
              setSearch("");
              setCatFilter("All");
              setSeasonFilter("All");
              setNeighbourhood("All");
              setAgeMin("");
              setAgeMax("");
              setCostRange(0);
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
          onTap={onOpenDirectoryDetail}
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
          Load more ({filtered.length - visibleCount} remaining)
        </button>
      )}
    </div>
  );
}
