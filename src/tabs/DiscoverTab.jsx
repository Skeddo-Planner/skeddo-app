import { useState, useMemo, useEffect, useRef } from "react";
import { C, CATEGORIES, CAT_EMOJI, SEASON_TYPES, DAY_LENGTHS } from "../constants/brand";
import { s } from "../styles/shared";
import EmptyState from "../components/EmptyState";
import PromoBanner from "../components/PromoBanner";
import { SkeletonList } from "../components/SkeletonCard";
import KidFilterBar from "../components/KidFilterBar";
import FilterDrawer from "../components/FilterDrawer";
import FilterOptions from "../components/FilterOptions";
import { useDataFreshness } from "../hooks/useDataFreshness";
import useIsDesktop from "../hooks/useIsDesktop";
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
  { key: "partial-week", label: "Partial Week (2\u20134 days)" },
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

/* ─── FilterChip — small pill button for horizontal chip bar ─── */
function FilterChip({ label, icon, count, active, onClick, locked, onLocked }) {
  return (
    <button onClick={() => {
      if (locked) { if (onLocked) onLocked(); return; }
      onClick();
    }} style={{
      display: "flex", alignItems: "center", gap: 5,
      padding: "6px 12px", borderRadius: 20,
      border: active ? `1.5px solid ${C.ink}` : "1.5px solid rgba(27,36,50,0.15)",
      background: active ? C.ink : "#FFFFFF",
      color: active ? "#FFFFFF" : C.ink,
      fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: active ? 600 : 500,
      cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
      boxShadow: active ? "none" : "0 1px 3px rgba(27,36,50,0.04)",
      minHeight: 36,
    }}>
      {icon && <span style={{ fontSize: 12 }}>{icon}</span>}
      {label}
      {locked && <span style={{ fontSize: 10 }}>🔒</span>}
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

/* ─── Directory Card ─── */
function DirectoryCard({ program, alreadyAdded, onTap, favorited, onToggleFavorite, regStatus, eligibility }) {
  const statusInfo = REGISTRATION_STATUSES.find((s) => s.key === regStatus) || REGISTRATION_STATUSES[0];
  const isApprox = !isMunicipalProvider(program.provider) && typeof program.cost === "number" && program.cost > 0;

  // Category-based accent color for left border
  const catColors = {
    "Sports": C.seaGreen,
    "Arts": C.lilac,
    "STEM": C.blue,
    "Nature": "#2D9F6F",
    "Music": "#9B59B6",
    "Academic": "#3498DB",
    "Cooking": C.olive,
  };
  const accent = catColors[program.category] || C.seaGreen;

  return (
    <div
      className="skeddo-card"
      style={{
        background: C.white,
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 10,
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${accent}`,
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

      {/* Category header */}
      <div style={{
        fontFamily: "'Barlow', sans-serif",
        fontSize: 10,
        fontWeight: 700,
        color: accent,
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: 4,
      }}>
        {CAT_EMOJI[program.category] || ""} {program.category}
      </div>

      {/* Name + provider + status */}
      <div style={{ paddingRight: 28 }}>
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 15,
          fontWeight: 700,
          color: C.ink,
          lineHeight: 1.3,
          marginBottom: 2,
        }}>{program.name}</div>
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 12,
          color: C.muted,
          marginBottom: 4,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}>
          <span>{program.provider}</span>
          {alreadyAdded && (
            <span style={{
              fontSize: 10, fontWeight: 700,
              background: C.seaGreen + "18", color: C.seaGreen,
              padding: "2px 8px", borderRadius: 6,
            }}>Added</span>
          )}
          <span style={{
            fontSize: 10, fontWeight: 700,
            background: statusInfo.color + "18", color: statusInfo.color,
            padding: "2px 8px", borderRadius: 10,
          }}>
            {statusInfo.icon} {statusInfo.label}
            {(regStatus === "coming-soon" || regStatus === "upcoming") && program.registrationDateLabel && (
              <span style={{ fontWeight: 400 }}> &mdash; {program.registrationDateLabel}</span>
            )}
            {(regStatus === "coming-soon" || regStatus === "upcoming") && program.registrationDate && !program.registrationDateLabel && (
              <span style={{ fontWeight: 400 }}> &mdash; Reg. opens {fmtDate(program.registrationDate)}</span>
            )}
          </span>
        </div>
        {program.confirmed2026 === false && (
          <div style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 600,
            color: "#B8860B", background: "#B8860B14",
            padding: "3px 8px", borderRadius: 6, marginBottom: 4, display: "inline-block",
          }}>
            2026 not yet confirmed — dates & prices are estimates based on prior year
          </div>
        )}
      </div>

      {/* Meta row: dates, days, times */}
      <div style={{
        fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted, marginTop: 6,
      }}>
        {program.startDate && (
          <span style={program.confirmed2026 === false ? { fontStyle: "italic", color: "#B8860B" } : undefined}>
            {(() => {
              const s = new Date(program.startDate + "T00:00:00");
              const e = program.endDate ? new Date(program.endDate + "T00:00:00") : null;
              const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
              const est = program.confirmed2026 === false ? " (est.)" : "";
              if (!e || program.startDate === program.endDate) return fmtDate(program.startDate) + est;
              if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear())
                return `${mo[s.getMonth()]} ${s.getDate()} \u2013 ${e.getDate()}, ${s.getFullYear()}${est}`;
              if (s.getFullYear() === e.getFullYear())
                return `${mo[s.getMonth()]} ${s.getDate()} \u2013 ${mo[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}${est}`;
              return `${fmtDate(program.startDate)} \u2013 ${fmtDate(program.endDate)}${est}`;
            })()}
          </span>
        )}
        {program.startDate && program.days && <span> &middot; </span>}
        {program.days && <span>{program.days}</span>}
        {program.startTime && program.endTime && (
          <span style={program.confirmed2026 === false ? { fontStyle: "italic", color: "#B8860B" } : undefined}>
            {" "}&middot; {program.startTime}-{program.endTime}{program.confirmed2026 === false ? " (est.)" : ""}
          </span>
        )}
      </div>

      {/* Bottom row: badges + price */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", flex: 1 }}>
          {program.earlyBirdCost != null && program.earlyBirdDeadline && new Date(program.earlyBirdDeadline) >= new Date() && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, background: "#FFF8E1", color: "#B8860B", padding: "2px 8px", borderRadius: 10 }}>
              {"\uD83D\uDC26"} Early Bird
            </span>
          )}
          {(program.ageMin != null || program.ageMax != null) && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, background: C.blue + "14", color: C.blue, padding: "2px 8px", borderRadius: 10 }}>
              {program.ageMin != null && program.ageMax != null
                ? `Ages ${program.ageMin}-${program.ageMax}`
                : program.ageMin != null ? `Ages ${program.ageMin}+` : `Up to ${program.ageMax}`}
            </span>
          )}
          {program.neighbourhood && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, background: C.lilac + "18", color: C.lilac, padding: "2px 8px", borderRadius: 10 }}>
              {program.neighbourhood}
            </span>
          )}
          {program.campType && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, background: C.olive + "18", color: C.olive, padding: "2px 8px", borderRadius: 10 }}>
              {program.campType}
            </span>
          )}
          {program.dayLength && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, background: C.seaGreen + "18", color: C.seaGreen, padding: "2px 8px", borderRadius: 10 }}>
              {program.dayLength}
            </span>
          )}
          {eligibility && eligibility.eligibilityTier === "borderline" && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, background: "rgba(244, 162, 97, 0.10)", color: "#F4A261", padding: "2px 8px", borderRadius: 10 }}>
              {eligibility.label}
            </span>
          )}
          {eligibility && eligibility.eligibilityTier === "eligible" && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, background: "rgba(45, 159, 111, 0.10)", color: "#2D9F6F", padding: "2px 8px", borderRadius: 10 }}>
              {eligibility.label}
            </span>
          )}
          {program.spotsRemaining && (() => {
            const isFull = program.spotsRemaining.toLowerCase().startsWith("full");
            const match = program.spotsRemaining.match(/^(\d+)\s+of\s+(\d+)/);
            const spotsLeft = match ? parseInt(match[1], 10) : null;
            const isLow = spotsLeft !== null && spotsLeft <= 5;
            const color = isFull ? "#D32F2F" : isLow ? "#E65100" : C.blue;
            const asOf = program.spotsUpdatedAt ? (() => {
              const d = new Date(program.spotsUpdatedAt);
              const fmt = d.toLocaleString("en-US", { timeZone: "America/Vancouver", hour: "numeric", minute: "2-digit", hour12: true, month: "short", day: "numeric" });
              const parts = fmt.split(", ");
              const datePart = parts[0];
              const timePart = (parts[1] || "").replace(/:00 /, " ").toLowerCase();
              return ` (as of ${datePart} at ${timePart} PDT)`;
            })() : "";
            return (
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, background: color + "18", color, padding: "2px 8px", borderRadius: 10 }}>
                {isFull ? "\u26D4 " : isLow ? "\uD83D\uDD25 " : ""}{program.spotsRemaining}
                <span style={{ fontWeight: 400 }}>{asOf}</span>
              </span>
            );
          })()}
        </div>
        <div style={{
          fontFamily: "'Poppins', sans-serif", fontSize: 16, color: C.ink,
          fontWeight: 700, whiteSpace: "nowrap", marginLeft: 8,
        }}>
          {program.earlyBirdCost != null && program.earlyBirdDeadline && new Date(program.earlyBirdDeadline) >= new Date()
            ? <><span>${Number(program.earlyBirdCost).toLocaleString()}</span><span style={{ fontSize: 11, color: C.muted, textDecoration: "line-through", marginLeft: 4 }}>${Number(program.cost).toLocaleString()}</span></>
            : program.cost === "TBD" ? "TBD" : program.cost ? (isApprox ? "~$" : "$") + Number(program.cost).toLocaleString() : "Free"
          }
        </div>
      </div>
    </div>
  );
}

/* ─── Desktop category browse row — horizontal scrollable cards per category ─── */
function CategoryBrowseRow({ category, programs, onTap, isFavorite, toggleFavorite, addedNames }) {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 330, behavior: "smooth" });
  };
  if (programs.length === 0) return null;
  const emoji = CAT_EMOJI[category] || "";
  const catColors = {
    "Sports": C.seaGreen, "Arts": C.lilac, "STEM": C.blue, "Nature": "#2D9F6F",
    "Music": "#9B59B6", "Academic": "#3498DB", "Cooking": C.olive, "Outdoor": "#2D9F6F",
  };
  const accent = catColors[category] || C.seaGreen;

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>{emoji}</span>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>{category}</h3>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, fontWeight: 500 }}>
            {programs.length} program{programs.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => scroll(-1)} aria-label={`Scroll ${category} left`} style={{
            width: 32, height: 32, borderRadius: 16, border: "1.5px solid rgba(27,36,50,0.15)",
            background: "#FFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button onClick={() => scroll(1)} aria-label={`Scroll ${category} right`} style={{
            width: 32, height: 32, borderRadius: 16, border: "1.5px solid rgba(27,36,50,0.15)",
            background: "#FFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="desktop-category-scroll"
        style={{
          display: "flex", gap: 14, overflowX: "auto", paddingBottom: 4,
          scrollbarWidth: "none", msOverflowStyle: "none",
        }}
      >
        {programs.slice(0, 20).map((p) => {
          const favorited = isFavorite(p.id);
          return (
            <div
              key={p.id}
              className="skeddo-card desktop-browse-card"
              style={{
                background: C.white,
                borderRadius: 14,
                padding: "14px 16px",
                border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${accent}`,
                cursor: "pointer",
                width: 300,
                minWidth: 300,
                flexShrink: 0,
                transition: "box-shadow 0.2s, transform 0.15s",
              }}
              onClick={() => onTap(p)}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${p.name}`}
            >
              {/* Category */}
              <div style={{
                fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700,
                color: accent, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4,
              }}>
                {emoji} {category}
              </div>
              {/* Name */}
              <div style={{
                fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 700,
                color: C.ink, lineHeight: 1.3, marginBottom: 2,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{p.name}</div>
              {/* Provider */}
              <div style={{
                fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted, marginBottom: 6,
              }}>{p.provider}</div>
              {/* Date + time */}
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted, marginBottom: 6 }}>
                {p.startDate && (() => {
                  const sd = new Date(p.startDate + "T00:00:00");
                  const ed = p.endDate ? new Date(p.endDate + "T00:00:00") : null;
                  const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                  if (!ed) return `${mo[sd.getMonth()]} ${sd.getDate()}`;
                  if (sd.getMonth() === ed.getMonth()) return `${mo[sd.getMonth()]} ${sd.getDate()}\u2013${ed.getDate()}`;
                  return `${mo[sd.getMonth()]} ${sd.getDate()} \u2013 ${mo[ed.getMonth()]} ${ed.getDate()}`;
                })()}
                {p.startTime && p.endTime && ` \u00B7 ${p.startTime}-${p.endTime}`}
              </div>
              {/* Bottom row: badges + price */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(p.ageMin != null || p.ageMax != null) && (
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, background: C.blue + "14", color: C.blue, padding: "2px 8px", borderRadius: 10 }}>
                      {p.ageMin != null && p.ageMax != null ? `Ages ${p.ageMin}-${p.ageMax}` : p.ageMin != null ? `Ages ${p.ageMin}+` : `Up to ${p.ageMax}`}
                    </span>
                  )}
                  {p.neighbourhood && (
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, background: C.lilac + "18", color: C.lilac, padding: "2px 8px", borderRadius: 10 }}>
                      {p.neighbourhood}
                    </span>
                  )}
                </div>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: C.ink }}>
                  {p.cost === "TBD" ? "TBD" : p.cost ? "$" + Number(p.cost).toLocaleString() : "Free"}
                </span>
              </div>
            </div>
          );
        })}
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
  onOpenAddProgram,
}) {
  /* ─── Use programs.json + user-submitted programs from Supabase ─── */
  const [userSubmitted, setUserSubmitted] = useState([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const [showDiscoverBanner, setShowDiscoverBanner] = useState(true);
  const isPaid = planAccess.isPaid;
  const canUseAdvancedFilters = planAccess.canUseAdvancedFilters;
  const isDesktop = useIsDesktop();

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
  const [activeDrawer, setActiveDrawer] = useState(null);
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

  // Clear all filters helper
  const clearAllFilters = () => {
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
  };

  // Count total active filters for summary
  const totalActiveFilters = useMemo(() => {
    let count = 0;
    if (selectedCats.size > 0) count++;
    if (ageMin || ageMax) count++;
    if (selectedCosts.size > 0) count++;
    if (selectedHoods.size > 0) count++;
    if (selectedSeasons.size > 0) count++;
    if (selectedRegStatuses.size > 0 && !(selectedRegStatuses.size === 2 && selectedRegStatuses.has("open") && selectedRegStatuses.has("opening-soon"))) count++;
    if (selectedLengths.size > 0) count++;
    if (selectedDayLengths.size > 0) count++;
    if (selectedActivityTypes.size > 0) count++;
    if (selectedProviders.size > 0) count++;
    if (showFavoritesOnly) count++;
    if (sortBy !== "relevance") count++;
    if (search) count++;
    return count;
  }, [selectedCats, ageMin, ageMax, selectedCosts, selectedHoods, selectedSeasons, selectedRegStatuses, selectedLengths, selectedDayLengths, selectedActivityTypes, selectedProviders, showFavoritesOnly, sortBy, search]);

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
  const isAllKids = kidFilter === "all-kids";
  const selectedKid = useMemo(
    () => (kidFilter && !isAllKids) ? (kids || []).find((k) => k.id === kidFilter) : null,
    [kidFilter, isAllKids, kids]
  );

  // Kids with birth info (for "All Kids Together" mode)
  const kidsWithBirth = useMemo(
    () => (kids || []).filter((k) => k.birthMonth && k.birthYear),
    [kids]
  );

  // Compute eligibility for each program when a kid with birth info is selected
  const eligibilityMap = useMemo(() => {
    if (isAllKids && kidsWithBirth.length > 0) {
      // "All Kids Together" — program must be eligible for ALL kids
      const map = new Map();
      sortedFiltered.forEach((p) => {
        const startDate = p.startDate || new Date().toISOString().split("T")[0];
        let worstTier = "eligible";
        const labels = [];
        for (const kid of kidsWithBirth) {
          const result = computeEligibility(kid.birthMonth, kid.birthYear, p.ageMin, p.ageMax, startDate);
          if (result.eligibilityTier === "ineligible") { worstTier = "ineligible"; break; }
          if (result.eligibilityTier === "borderline") {
            worstTier = "borderline";
            labels.push(getEligibilityLabel(kid.name, kid.birthMonth, kid.birthYear, p.ageMin, p.ageMax, startDate));
          }
        }
        map.set(p.id, { eligibilityTier: p.ageMin == null && p.ageMax == null ? null : worstTier, label: labels.join("; ") || (worstTier === "eligible" ? "All kids eligible" : "") });
      });
      return map;
    }
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
  }, [isAllKids, kidsWithBirth, selectedKid, sortedFiltered]);

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
        {!isDesktop && <h2 style={s.pageTitle}>Discover</h2>}
        {!isDesktop && (
          <>
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
                : `Browse ${allDirectoryPrograms.length.toLocaleString()} programs in the Lower Mainland`}
            </p>
            <div
              onClick={!isChecking ? checkForUpdates : undefined}
              role="button"
              tabIndex={0}
              aria-label={isChecking ? "Checking for updates" : "Check for program data updates"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginTop: 2,
                cursor: isChecking ? "default" : "pointer",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: isStale ? C.olive : C.muted,
                  lineHeight: 1,
                  display: "inline-block",
                  animation: isChecking ? "skeddo-spin 1s linear infinite" : "none",
                }}
              >⟳</span>
              <span
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  color: isStale ? C.olive : C.muted,
                  opacity: 0.7,
                }}
              >
                {isChecking
                  ? "Checking for updates..."
                  : isStale
                    ? `Data updated: ${dataVersion} · Tap to refresh`
                    : `Data updated: ${dataVersion}`}
              </span>
            </div>
            <style>{`
              @keyframes skeddo-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </>
        )}
      </div>

      {showDiscoverBanner && !isPaid && (
        <PromoBanner type="upgrade-discover" onDismiss={() => setShowDiscoverBanner(false)} />
      )}

      {/* Search bar — enhanced layout on desktop */}
      <div style={{
        ...(isDesktop ? { display: "flex", alignItems: "center", gap: 16, marginBottom: 12 } : { position: "relative", marginBottom: 12 }),
      }}>
        <div style={isDesktop ? { flex: 1, maxWidth: 440, position: "relative" } : { position: "relative" }}>
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
        {isDesktop && (
          <>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.ink }}>
                Browse <strong style={{ color: C.seaGreen }}>{allDirectoryPrograms.length.toLocaleString()}</strong> programs in the Lower Mainland
              </span>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>
                Updated {dataVersion}
              </span>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button
                onClick={() => setActiveDrawer("sort")}
                style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 20,
                  border: sortBy !== "relevance" ? `1.5px solid ${C.ink}` : "1.5px solid rgba(27,36,50,0.15)",
                  background: sortBy !== "relevance" ? C.ink : "#FFF",
                  color: sortBy !== "relevance" ? "#FFF" : C.ink,
                  fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: sortBy !== "relevance" ? 600 : 500,
                  cursor: "pointer",
                }}
              >
                Sort
              </button>
              <button
                onClick={() => { setShowFavoritesOnly(!showFavoritesOnly); setVisibleCount(PAGE_SIZE); }}
                style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 20,
                  border: showFavoritesOnly ? `1.5px solid ${C.olive}` : "1.5px solid rgba(27,36,50,0.15)",
                  background: showFavoritesOnly ? C.olive + "14" : "#FFF",
                  color: showFavoritesOnly ? C.olive : C.ink,
                  fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: showFavoritesOnly ? 600 : 500,
                  cursor: "pointer",
                }}
              >
                {showFavoritesOnly ? "\u2764\uFE0F" : "\u2661"} Favorites ({favorites.length})
              </button>
            </div>
          </>
        )}
      </div>

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

      {/* Row 1: All Programs, Sort, Favorites */}
      <div style={{ padding: "10px 0 0", display: "flex", gap: 6, alignItems: "center" }}>
        <button
          onClick={clearAllFilters}
          style={{
            padding: "6px 14px", borderRadius: 20,
            border: totalActiveFilters === 0 ? "none" : "1.5px solid rgba(27,36,50,0.15)",
            background: totalActiveFilters === 0 ? C.ink : "#FFF",
            color: totalActiveFilters === 0 ? "#FFF" : C.ink,
            fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: totalActiveFilters === 0 ? 700 : 500,
            cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
          }}
        >All Programs</button>
        {!isDesktop && (
          <>
            <FilterChip label="Sort" active={sortBy !== "relevance"} onClick={() => setActiveDrawer("sort")} />
            <FilterChip label={`♡ ${favorites.length}`} active={showFavoritesOnly} onClick={() => { setShowFavoritesOnly(!showFavoritesOnly); setVisibleCount(PAGE_SIZE); }} />
          </>
        )}
      </div>

      {/* Row 2: Filter chips */}
      <div style={{ padding: "6px 0 0", overflowX: "auto", display: "flex", gap: 6, alignItems: "center", scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}>
        <FilterChip label="Status" count={selectedRegStatuses.size} active={selectedRegStatuses.size > 0} onClick={() => setActiveDrawer("status")} />
        {kids && kids.length > 0 && (
          <FilterChip label="Eligible for" count={kidFilter ? 1 : 0} active={!!kidFilter} onClick={() => setActiveDrawer("eligible")} />
        )}
        <FilterChip label="Category" count={selectedCats.size} active={selectedCats.size > 0} onClick={() => setActiveDrawer("category")} />
        <FilterChip label="Area" count={selectedHoods.size} active={selectedHoods.size > 0} onClick={() => setActiveDrawer("neighbourhood")} locked={!canUseAdvancedFilters} onLocked={() => showFilterToast("Upgrade to Skeddo Plus for advanced filters")} />
        <FilterChip label="Cost" count={selectedCosts.size} active={selectedCosts.size > 0} onClick={() => setActiveDrawer("cost")} locked={!canUseAdvancedFilters} onLocked={() => showFilterToast("Upgrade to Skeddo Plus for advanced filters")} />
        <FilterChip label="Day" count={selectedDayLengths.size} active={selectedDayLengths.size > 0} onClick={() => setActiveDrawer("dayLength")} />
        <FilterChip label="Length" count={selectedLengths.size} active={selectedLengths.size > 0} onClick={() => setActiveDrawer("length")} />
        <FilterChip label="Provider" count={selectedProviders.size} active={selectedProviders.size > 0} onClick={() => setActiveDrawer("provider")} locked={!canUseAdvancedFilters} onLocked={() => showFilterToast("Upgrade to Skeddo Plus for advanced filters")} />
      </div>

      {/* Active filter summary */}
      {totalActiveFilters > 0 && (
        <div style={{ padding: "6px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: C.muted, fontFamily: "'Barlow', sans-serif" }}>
            {totalActiveFilters} filter{totalActiveFilters !== 1 ? "s" : ""} · {eligibilityFiltered.length} results
          </span>
          <button onClick={clearAllFilters} style={{ background: "none", border: "none", color: C.danger, fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Clear all
          </button>
        </div>
      )}

      {/* Results count */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
          marginBottom: 8,
        }}
      >
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

      {/* ─── Desktop category browse view ─── */}
      {isDesktop && !isLoadingPrograms && !search && totalActiveFilters === 0 && !showFavoritesOnly && (() => {
        // Group programs by category for browse view
        const categoryGroups = CATEGORIES.map((cat) => ({
          category: cat,
          programs: allDirectoryPrograms.filter((p) => p.category === cat),
        })).filter((g) => g.programs.length > 0);

        return (
          <div style={{ marginTop: 16 }}>
            {categoryGroups.map((g) => (
              <CategoryBrowseRow
                key={g.category}
                category={g.category}
                programs={g.programs}
                onTap={onOpenDirectoryDetail}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
                addedNames={addedNames}
              />
            ))}
          </div>
        );
      })()}

      {/* Program cards — hide the standard grid on desktop when showing category browse */}
      {(isDesktop && !search && totalActiveFilters === 0 && !showFavoritesOnly) ? null : (
        <>
      {isLoadingPrograms && <SkeletonList count={6} />}
      {!isLoadingPrograms && filtered.length === 0 && (
        <>
          <EmptyState
            icon={"\uD83D\uDD0D"}
            message="No programs match your search. Try broadening your filters."
          />
          <div style={{
            textAlign: "center",
            padding: "0 16px 16px",
            marginTop: -8,
          }}>
            <p style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 14,
              color: C.muted,
              lineHeight: 1.6,
              marginBottom: 12,
            }}>
              Can't find a program you're registered for or one you know exists? You can add it manually by clicking the + Add button below.
            </p>
            {onOpenAddProgram && (
              <button
                onClick={onOpenAddProgram}
                style={{
                  ...s.addButton,
                  fontSize: 15,
                  padding: "12px 28px",
                }}
              >
                + Add Program
              </button>
            )}
          </div>
        </>
      )}
      {!isLoadingPrograms && (
        <div className="discover-results">
          {visiblePrograms.map((p) => (
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
        </div>
      )}

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
        </>
      )}

      {/* ─── Filter Drawers ─── */}

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
                fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: sortBy === opt.key ? 600 : 400,
                textAlign: "left", cursor: "pointer", minHeight: 44,
                display: "flex", alignItems: "center", gap: 10,
              }}
            >
              {sortBy === opt.key && <span>{"✓"}</span>}
              {opt.label}
            </button>
          ))}
        </div>
      </FilterDrawer>

      {/* Category Drawer */}
      <FilterDrawer open={activeDrawer === "category"} onClose={() => setActiveDrawer(null)} title="Category"
        onClear={() => { setSelectedCats(new Set()); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        <FilterOptions
          options={CATEGORIES.map((cat) => ({ id: cat, label: cat, icon: CAT_EMOJI[cat] || "" }))}
          selected={selectedCats}
          onToggle={(id) => toggleInSet(setSelectedCats, id)}
        />
      </FilterDrawer>

      {/* Age Drawer */}
      <FilterDrawer open={activeDrawer === "age"} onClose={() => setActiveDrawer(null)} title="Age Range"
        onClear={() => { setAgeMin(""); setAgeMax(""); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <input
            style={s.input}
            type="number"
            placeholder="Min age"
            value={ageMin}
            onChange={(e) => { setAgeMin(e.target.value); setVisibleCount(PAGE_SIZE); }}
          />
          <input
            style={s.input}
            type="number"
            placeholder="Max age"
            value={ageMax}
            onChange={(e) => { setAgeMax(e.target.value); setVisibleCount(PAGE_SIZE); }}
          />
        </div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Quick presets
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[{ label: "Under 5", min: "", max: "4" }, { label: "5-8", min: "5", max: "8" }, { label: "9-12", min: "9", max: "12" }, { label: "13+", min: "13", max: "" }].map((preset) => (
            <button key={preset.label} onClick={() => { setAgeMin(preset.min); setAgeMax(preset.max); setVisibleCount(PAGE_SIZE); }}
              style={{
                padding: "10px 16px", borderRadius: 10,
                border: (ageMin === preset.min && ageMax === preset.max) ? `1.5px solid ${C.ink}` : "1.5px solid rgba(27,36,50,0.12)",
                background: (ageMin === preset.min && ageMax === preset.max) ? C.ink : "#FFF",
                color: (ageMin === preset.min && ageMax === preset.max) ? "#FFF" : C.ink,
                fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer", minHeight: 44,
              }}
            >{preset.label}</button>
          ))}
        </div>
      </FilterDrawer>

      {/* Cost Drawer */}
      <FilterDrawer open={activeDrawer === "cost"} onClose={() => setActiveDrawer(null)} title="Cost"
        onClear={() => { setSelectedCosts(new Set()); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        {!canUseAdvancedFilters ? (
          <div style={{ textAlign: "center", padding: 20, fontFamily: "'Barlow', sans-serif", color: C.muted }}>
            <p style={{ fontSize: 14, marginBottom: 8 }}>Upgrade to Skeddo Plus for cost filters</p>
          </div>
        ) : (
          <FilterOptions
            options={COST_RANGES.slice(1).map((r, i) => ({ id: i + 1, label: r.label }))}
            selected={selectedCosts}
            onToggle={(id) => toggleInSet(setSelectedCosts, id)}
          />
        )}
      </FilterDrawer>

      {/* Neighbourhood Drawer */}
      <FilterDrawer open={activeDrawer === "neighbourhood"} onClose={() => setActiveDrawer(null)} title="Neighbourhoods"
        onClear={() => { setSelectedHoods(new Set()); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        {!canUseAdvancedFilters ? (
          <div style={{ textAlign: "center", padding: 20, fontFamily: "'Barlow', sans-serif", color: C.muted }}>
            <p style={{ fontSize: 14, marginBottom: 8 }}>Upgrade to Skeddo Plus for neighbourhood filters</p>
          </div>
        ) : (
          <div style={{ background: C.cream, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            {CITY_NEIGHBOURHOODS.map((cityObj) => {
              const isExpanded = expandedCities.has(cityObj.city);
              const selectedInCity = cityObj.neighbourhoods.filter((n) => selectedHoods.has(n)).length;
              const allInCitySelected = selectedInCity === cityObj.neighbourhoods.length;
              const someInCitySelected = selectedInCity > 0 && !allInCitySelected;
              return (
                <div key={cityObj.city}>
                  <div
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 12px", borderBottom: `1px solid ${C.border}`, cursor: "pointer",
                    }}
                    onClick={() => toggleCityExpand(cityObj.city)}
                    role="button" tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} ${cityObj.city} neighbourhoods`}
                  >
                    <span style={{ fontSize: 10, color: C.muted, transition: "transform 0.15s", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>{"▶"}</span>
                    <span style={{ flex: 1, fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: C.ink }}>
                      {cityObj.city}
                      {someInCitySelected && <span style={{ color: C.muted, fontWeight: 400 }}> ({selectedInCity}/{cityObj.neighbourhoods.length})</span>}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleCity(cityObj); }}
                      aria-label={allInCitySelected ? `Deselect all ${cityObj.city} neighbourhoods` : `Select all ${cityObj.city} neighbourhoods`}
                      style={{
                        fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700,
                        color: allInCitySelected ? C.danger : C.seaGreen,
                        background: allInCitySelected ? C.dangerBg : C.seaGreen + "12",
                        border: "none", borderRadius: 6, padding: "3px 8px", cursor: "pointer", whiteSpace: "nowrap",
                      }}
                    >
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
                            fontFamily: "'Barlow', sans-serif", fontSize: 13,
                            color: isSelected ? C.ink : C.muted, fontWeight: isSelected ? 600 : 400,
                          }}>
                            <span style={{
                              width: 18, height: 18, borderRadius: 4,
                              border: `2px solid ${isSelected ? C.seaGreen : C.border}`,
                              background: isSelected ? C.seaGreen : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, color: C.white, flexShrink: 0, transition: "all 0.12s",
                            }} onClick={(e) => { e.preventDefault(); toggleHood(hood); }}>
                              {isSelected ? "✓" : ""}
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
        )}
      </FilterDrawer>

      {/* Season Drawer */}
      <FilterDrawer open={activeDrawer === "season"} onClose={() => setActiveDrawer(null)} title="Season Type"
        onClear={() => { setSelectedSeasons(new Set()); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        <FilterOptions
          options={SEASON_TYPES.map((st) => ({ id: st, label: st }))}
          selected={selectedSeasons}
          onToggle={(id) => toggleInSet(setSelectedSeasons, id)}
        />
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

      {/* Length Drawer */}
      <FilterDrawer open={activeDrawer === "length"} onClose={() => setActiveDrawer(null)} title="Program Length"
        onClear={() => { setSelectedLengths(new Set()); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        <FilterOptions
          options={PROGRAM_LENGTHS.map((pl) => ({ id: pl.key, label: pl.label }))}
          selected={selectedLengths}
          onToggle={(id) => toggleInSet(setSelectedLengths, id)}
        />
      </FilterDrawer>

      {/* Day Length Drawer */}
      <FilterDrawer open={activeDrawer === "dayLength"} onClose={() => setActiveDrawer(null)} title="Day Length"
        onClear={() => { setSelectedDayLengths(new Set()); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        <FilterOptions
          options={DAY_LENGTHS.map((dl) => ({ id: dl, label: dl }))}
          selected={selectedDayLengths}
          onToggle={(id) => toggleInSet(setSelectedDayLengths, id)}
        />
      </FilterDrawer>

      {/* Activity Type Drawer */}
      <FilterDrawer open={activeDrawer === "activityType"} onClose={() => setActiveDrawer(null)} title="Activity Type"
        onClear={() => { setSelectedActivityTypes(new Set()); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        {!canUseAdvancedFilters ? (
          <div style={{ textAlign: "center", padding: 20, fontFamily: "'Barlow', sans-serif", color: C.muted }}>
            <p style={{ fontSize: 14, marginBottom: 8 }}>Upgrade to Skeddo Plus for activity type filters</p>
          </div>
        ) : availableActivityTypes.length === 0 ? (
          <div style={{ textAlign: "center", padding: 20, fontFamily: "'Barlow', sans-serif", color: C.muted, fontSize: 14 }}>
            No activity types available for current category selection
          </div>
        ) : (
          <>
            {selectedCats.size > 0 && (
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted, marginBottom: 12 }}>
                Showing activity types for selected categories
              </div>
            )}
            <FilterOptions
              options={availableActivityTypes.map((at) => ({ id: at, label: at }))}
              selected={selectedActivityTypes}
              onToggle={(id) => toggleInSet(setSelectedActivityTypes, id)}
            />
          </>
        )}
      </FilterDrawer>

      {/* Provider Drawer */}
      <FilterDrawer open={activeDrawer === "provider"} onClose={() => setActiveDrawer(null)} title="Provider"
        onClear={() => { setSelectedProviders(new Set()); setProviderSearch(""); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        {!canUseAdvancedFilters ? (
          <div style={{ textAlign: "center", padding: 20, fontFamily: "'Barlow', sans-serif", color: C.muted }}>
            <p style={{ fontSize: 14, marginBottom: 8 }}>Upgrade to Skeddo Plus for provider filters</p>
          </div>
        ) : (
          <>
            {/* Selected providers as removable chips */}
            {selectedProviders.size > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {[...selectedProviders].sort().map((prov) => (
                  <button key={prov} onClick={() => toggleInSet(setSelectedProviders, prov)}
                    style={{
                      fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600,
                      background: C.ink, color: "#fff", border: "none", borderRadius: 20,
                      padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                    }}>
                    {prov} <span style={{ fontSize: 14, lineHeight: 1 }}>&times;</span>
                  </button>
                ))}
              </div>
            )}
            {/* Provider search */}
            <div style={{ position: "relative", marginBottom: 12 }}>
              <input
                style={{ ...s.input, fontSize: 13, paddingLeft: 32 }}
                placeholder="Search providers..."
                value={providerSearch}
                onChange={(e) => setProviderSearch(e.target.value)}
              />
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: C.muted, pointerEvents: "none" }}>
                &#x1F50D;
              </span>
            </div>
            {/* Provider list */}
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {allProviders
                .filter((prov) => prov.toLowerCase().includes(providerSearch.toLowerCase().trim()))
                .slice(0, 50)
                .map((prov) => {
                  const isSelected = selectedProviders.has(prov);
                  return (
                    <div key={prov} onClick={() => toggleInSet(setSelectedProviders, prov)}
                      role="option" aria-selected={isSelected}
                      style={{
                        padding: "10px 12px", fontFamily: "'Barlow', sans-serif", fontSize: 14,
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
                      }}>
                        {isSelected ? "✓" : ""}
                      </span>
                      {prov}
                    </div>
                  );
                })}
              {allProviders.filter((prov) => prov.toLowerCase().includes(providerSearch.toLowerCase().trim())).length === 0 && (
                <div style={{ padding: 12, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, textAlign: "center" }}>
                  No providers found
                </div>
              )}
            </div>
          </>
        )}
      </FilterDrawer>

      {/* Eligible for drawer */}
      <FilterDrawer open={activeDrawer === "eligible"} onClose={() => setActiveDrawer(null)} title="Eligible for"
        onClear={() => { onKidFilter(null); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <button
            onClick={() => { onKidFilter(null); setVisibleCount(PAGE_SIZE); }}
            style={{
              padding: "14px 16px", fontFamily: "'Barlow', sans-serif", fontSize: 15,
              color: !kidFilter ? C.ink : C.muted, fontWeight: !kidFilter ? 700 : 400,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
              borderBottom: `1px solid ${C.border}`, background: !kidFilter ? C.ink + "08" : "transparent",
              border: "none", borderRadius: 0, textAlign: "left",
            }}
          >
            <span style={{
              width: 20, height: 20, borderRadius: "50%",
              border: `2px solid ${!kidFilter ? C.seaGreen : C.border}`,
              background: !kidFilter ? C.seaGreen : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, color: C.white, flexShrink: 0,
            }}>
              {!kidFilter ? "✓" : ""}
            </span>
            All Programs (no age filter)
          </button>
          {kids && kids.length > 1 && (
            <button
              onClick={() => { onKidFilter("all-kids"); setVisibleCount(PAGE_SIZE); }}
              style={{
                padding: "14px 16px", fontFamily: "'Barlow', sans-serif", fontSize: 15,
                color: kidFilter === "all-kids" ? C.ink : C.muted, fontWeight: kidFilter === "all-kids" ? 700 : 400,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                borderBottom: `1px solid ${C.border}`, background: kidFilter === "all-kids" ? C.seaGreen + "10" : "transparent",
                border: "none", borderRadius: 0, textAlign: "left",
              }}
            >
              <span style={{
                width: 20, height: 20, borderRadius: "50%",
                border: `2px solid ${kidFilter === "all-kids" ? C.seaGreen : C.border}`,
                background: kidFilter === "all-kids" ? C.seaGreen : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: C.white, flexShrink: 0,
              }}>
                {kidFilter === "all-kids" ? "✓" : ""}
              </span>
              <div>
                <div>All Kids Together</div>
                <div style={{ fontSize: 12, color: C.muted, fontWeight: 400 }}>Programs all your kids can attend</div>
              </div>
            </button>
          )}
          {(kids || []).map((kid) => {
            const isActive = kidFilter === kid.id;
            const kidColor = kid.color || C.seaGreen;
            const hasBirth = kid.birthMonth && kid.birthYear;
            return (
              <button
                key={kid.id}
                onClick={() => { onKidFilter(kid.id); setVisibleCount(PAGE_SIZE); }}
                style={{
                  padding: "14px 16px", fontFamily: "'Barlow', sans-serif", fontSize: 15,
                  color: isActive ? C.ink : C.muted, fontWeight: isActive ? 700 : 400,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                  borderBottom: `1px solid ${C.border}`, background: isActive ? kidColor + "10" : "transparent",
                  border: "none", borderRadius: 0, textAlign: "left",
                }}
              >
                <span style={{
                  width: 20, height: 20, borderRadius: "50%",
                  border: `2px solid ${isActive ? kidColor : C.border}`,
                  background: isActive ? kidColor : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: C.white, flexShrink: 0,
                }}>
                  {isActive ? "✓" : ""}
                </span>
                <div>
                  <div>{kid.name}</div>
                  {hasBirth ? (
                    <div style={{ fontSize: 12, color: C.muted, fontWeight: 400 }}>
                      Age-appropriate programs for {kid.name}
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: C.olive, fontWeight: 400 }}>
                      Add birth month to enable age filtering
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </FilterDrawer>

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
