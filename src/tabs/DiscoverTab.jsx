import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { C, CATEGORIES, CAT_EMOJI, SEASON_TYPES, DAY_LENGTHS } from "../constants/brand";
import { s } from "../styles/shared";
import EmptyState from "../components/EmptyState";
import { SkeletonList } from "../components/SkeletonCard";
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
import { trackEvent } from "../utils/analytics";
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
  { key: "az", label: "A-Z" },
];

const DAY_LABELS = ["M", "T", "W", "T", "F"];
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ─── Category accent colors ─── */
const CAT_ACCENT = {
  "Sports": C.seaGreen,
  "Arts": C.olive,
  "STEM": C.blue,
  "Music": C.lilac,
  "Outdoor": C.seaGreen,
  "Life Skills": C.olive,
  "Academic": C.blue,
  "Cultural": C.lilac,
  "Language": C.blue,
  "Faith-Based": C.lilac,
  "Social": C.seaGreen,
  "Childcare": C.seaGreen,
};

/* ────────────────────────────────────────────────────────────
   WEEK COMPUTATION — dynamic summer weeks + stat holidays
   ──────────────────────────────────────────────────────────── */

function computeSummerWeeks(year) {
  // Anchor to the Monday nearest to July 1 as Week 1
  const july1 = new Date(year, 6, 1); // Jul 1
  const dow = july1.getDay(); // 0=Sun … 6=Sat
  // Find nearest Monday: if dow <= 3 (Sun-Wed), go back; if > 3, go forward
  let mondayOffset;
  if (dow === 0) mondayOffset = 1; // Sun -> next Mon
  else if (dow === 1) mondayOffset = 0; // Mon
  else if (dow <= 4) mondayOffset = -(dow - 1); // Tue-Thu -> prev Mon
  else mondayOffset = 8 - dow; // Fri-Sat -> next Mon

  const week1Monday = new Date(year, 6, 1 + mondayOffset);

  // Stat holidays
  const canadaDay = new Date(year, 6, 1); // Jul 1
  // BC Day = first Monday of August
  const aug1 = new Date(year, 7, 1);
  const aug1Dow = aug1.getDay();
  const bcDayOffset = aug1Dow === 0 ? 1 : aug1Dow === 1 ? 0 : 8 - aug1Dow;
  const bcDay = new Date(year, 7, 1 + bcDayOffset);

  const statHolidays = [
    { date: canadaDay, name: "Canada Day" },
    { date: bcDay, name: "BC Day" },
  ];

  const weeks = [];
  for (let i = 0; i < 9; i++) {
    const monday = new Date(week1Monday);
    monday.setDate(week1Monday.getDate() + i * 7);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    // Check which days are stat holidays in this week
    const holidays = [];
    for (let d = 0; d < 5; d++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + d);
      const isHoliday = statHolidays.some(
        (h) => h.date.getFullYear() === dayDate.getFullYear() &&
               h.date.getMonth() === dayDate.getMonth() &&
               h.date.getDate() === dayDate.getDate()
      );
      if (isHoliday) holidays.push(d);
    }

    weeks.push({
      id: `summer-w${i + 1}`,
      label: `Wk ${i + 1}`,
      fullLabel: `Week ${i + 1}`,
      type: "summer",
      weekNum: i + 1,
      monday,
      friday,
      startStr: `${MONTH_ABBR[monday.getMonth()]} ${monday.getDate()}`,
      dateRange: (() => {
        const m = monday, f = friday;
        if (m.getMonth() === f.getMonth()) {
          return `${MONTH_ABBR[m.getMonth()]} ${m.getDate()} – ${f.getDate()}, ${m.getFullYear()}`;
        }
        return `${MONTH_ABBR[m.getMonth()]} ${m.getDate()} – ${MONTH_ABBR[f.getMonth()]} ${f.getDate()}, ${m.getFullYear()}`;
      })(),
      statHolidays: holidays,
    });
  }
  return weeks;
}

/* Determine which weekdays a program covers in a given week */
function getProgramWeekDays(program, weekMonday) {
  if (!program.startDate) return [];
  const pStart = new Date(program.startDate + "T00:00:00");
  const pEnd = program.endDate ? new Date(program.endDate + "T00:00:00") : pStart;

  const days = [];
  for (let d = 0; d < 5; d++) {
    const dayDate = new Date(weekMonday);
    dayDate.setDate(weekMonday.getDate() + d);
    if (dayDate >= pStart && dayDate <= pEnd) {
      // Check if the program runs on this day of the week
      const programDays = program.days ? program.days.toLowerCase() : "";
      if (!programDays || programDays.includes("mon-fri") || programDays.includes("m-f") || programDays === "daily") {
        days.push(d);
      } else {
        const dayMap = { 0: ["mon", "mo"], 1: ["tue", "tu"], 2: ["wed", "we"], 3: ["thu", "th"], 4: ["fri", "fr"] };
        const aliases = dayMap[d];
        if (aliases.some((a) => programDays.includes(a))) {
          days.push(d);
        }
      }
    }
  }
  return days;
}

/* Does a program overlap with a given week at all? */
function programOverlapsWeek(program, weekMonday, weekFriday) {
  if (!program.startDate) return false;
  const pStart = new Date(program.startDate + "T00:00:00");
  const pEnd = program.endDate ? new Date(program.endDate + "T00:00:00") : pStart;
  return pStart <= weekFriday && pEnd >= weekMonday;
}

/* Build a week-specific schedule string like "Mon–Fri · 9–3 PM" */
function getWeekScheduleLabel(program, weekDays) {
  if (weekDays.length === 0) return "";
  let dayLabel;
  if (weekDays.length === 5) {
    dayLabel = "Mon–Fri";
  } else if (weekDays.length === 1) {
    dayLabel = DAY_NAMES[weekDays[0]];
  } else {
    // Check for consecutive runs
    const isConsecutive = weekDays.every((d, i) => i === 0 || d === weekDays[i - 1] + 1);
    if (isConsecutive && weekDays.length >= 3) {
      dayLabel = `${DAY_NAMES[weekDays[0]]}–${DAY_NAMES[weekDays[weekDays.length - 1]]}`;
    } else {
      dayLabel = weekDays.map((d) => DAY_NAMES[d]).join(", ");
    }
  }
  const timeStr = program.startTime && program.endTime
    ? ` · ${program.startTime}–${program.endTime}`
    : "";
  return dayLabel + timeStr;
}


/* ─── FilterChip — small pill button ─── */
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
      fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: active ? 600 : 500,
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

/* ─── WeekTile — individual week in the strip/sidebar ─── */
function WeekTile({ week, active, coverageDots, programCount, isAway, onSelect, onToggleAway, isDesktop }) {
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(false);

  const handlePointerDown = () => {
    const timer = setTimeout(() => setShowContextMenu(true), 500);
    setLongPressTimer(timer);
  };
  const handlePointerUp = () => {
    if (longPressTimer) clearTimeout(longPressTimer);
    setLongPressTimer(null);
  };

  const hasGaps = !isAway && coverageDots.some((d) => d === "gap") && coverageDots.some((d) => d === "covered");

  if (isDesktop) {
    // Desktop sidebar tile — horizontal row
    return (
      <div style={{ position: "relative" }}>
        <div
          onClick={() => onSelect(week.id)}
          onContextMenu={(e) => { e.preventDefault(); setShowContextMenu(true); }}
          role="button"
          tabIndex={0}
          aria-label={`${week.fullLabel}, ${week.dateRange}${isAway ? ", marked as away" : ""}`}
          aria-pressed={active}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            height: 56, padding: "8px 12px", borderRadius: 10, cursor: "pointer",
            background: active ? "rgba(45,159,111,0.08)" : "transparent",
            borderLeft: active ? `3px solid ${C.seaGreen}` : "3px solid transparent",
            opacity: isAway ? 0.6 : 1,
            transition: "background 0.15s, border-color 0.15s",
          }}
        >
          <div style={{ width: 42, flexShrink: 0 }}>
            <div style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 500, color: C.ink,
              textDecoration: isAway ? "line-through" : "none",
            }}>{week.startStr}</div>
          </div>
          <div style={{ flex: 1, fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 500, color: C.ink }}>
            {week.fullLabel}
          </div>
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            {isAway ? (
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontStyle: "italic", color: C.blue }}>Away</span>
            ) : (
              <>
                {coverageDots.map((dot, i) => (
                  <div key={i} style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: dot === "covered" ? C.seaGreen : dot === "holiday" ? C.blue : "transparent",
                    border: dot === "gap" ? `1px solid ${hasGaps ? C.olive : "rgba(27,36,50,0.15)"}` : "none",
                  }} />
                ))}
                {hasGaps && (
                  <div style={{
                    width: 4, height: 4, borderRadius: "50%", background: C.olive, marginLeft: 2,
                  }} />
                )}
              </>
            )}
          </div>
        </div>
        {showContextMenu && (
          <>
            <div onClick={() => setShowContextMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 999 }} />
            <div style={{
              position: "absolute", top: "100%", right: 8, zIndex: 1000,
              background: C.white, borderRadius: 10, padding: 4,
              boxShadow: "0 4px 16px rgba(27,36,50,0.15)", border: `1px solid ${C.border}`,
              minWidth: 160,
            }}>
              <button onClick={() => { onToggleAway(week.id); setShowContextMenu(false); }} style={{
                display: "block", width: "100%", textAlign: "left", padding: "10px 14px",
                fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 500,
                color: C.ink, background: "none", border: "none", borderRadius: 8, cursor: "pointer",
              }}>
                {isAway ? "Remove away" : "Mark as away"}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Mobile tile — vertical compact
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        onClick={() => onSelect(week.id)}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        role="button"
        tabIndex={0}
        aria-label={`${week.fullLabel}, ${week.startStr}${isAway ? ", marked as away" : ""}`}
        aria-pressed={active}
        style={{
          width: 80, padding: "10px 6px", borderRadius: 12,
          background: active ? "rgba(45,159,111,0.06)" : C.white,
          border: active ? `1.5px solid ${C.seaGreen}` : "0.5px solid rgba(27,36,50,0.15)",
          cursor: "pointer", textAlign: "center",
          opacity: isAway ? 0.6 : 1,
          transition: "background 0.15s, border-color 0.15s",
          position: "relative",
        }}
      >
        {/* Gap indicator micro-dot */}
        {hasGaps && !active && (
          <div style={{
            position: "absolute", top: 4, right: 4, width: 4, height: 4,
            borderRadius: "50%", background: C.olive,
          }} />
        )}
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.blue, marginBottom: 2 }}>
          {week.label}
        </div>
        <div style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 4,
        }}>
          {week.startStr}
        </div>
        <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 4 }}>
          {coverageDots.map((dot, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: "50%",
              background: isAway
                ? "rgba(27,36,50,0.15)"
                : dot === "covered" ? C.seaGreen
                : dot === "holiday" ? C.blue
                : "transparent",
              border: (!isAway && dot === "gap")
                ? `1px solid ${hasGaps ? C.olive : "rgba(27,36,50,0.15)"}`
                : "none",
            }} />
          ))}
        </div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.blue }}>
          {isAway ? "Away" : `${programCount} camp${programCount !== 1 ? "s" : ""}`}
        </div>
      </div>
      {showContextMenu && (
        <>
          <div onClick={() => setShowContextMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 999 }} />
          <div style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            zIndex: 1000, background: C.white, borderRadius: 10, padding: 4,
            boxShadow: "0 4px 16px rgba(27,36,50,0.15)", border: `1px solid ${C.border}`,
            minWidth: 160, marginTop: 4,
          }}>
            <button onClick={() => { onToggleAway(week.id); setShowContextMenu(false); }} style={{
              display: "block", width: "100%", textAlign: "left", padding: "10px 14px",
              fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 500,
              color: C.ink, background: "none", border: "none", borderRadius: 8, cursor: "pointer",
            }}>
              {isAway ? "Remove away" : "Mark as away"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── CoverageBar — M T W T F day indicators ─── */
function CoverageBar({ coverage, statHolidays, isAway, onDayClick, isDesktop }) {
  return (
    <div style={{ display: "flex", gap: 4, padding: "0 16px", marginBottom: 8 }}>
      {coverage.map((status, i) => {
        const isHoliday = statHolidays.includes(i);
        const isCovered = status === "covered";
        const isGap = status === "gap";
        let bg, color, fontWeight;
        if (isAway) {
          bg = "rgba(27,36,50,0.06)";
          color = "rgba(27,36,50,0.35)";
          fontWeight = 500;
        } else if (isHoliday) {
          bg = "rgba(74,111,165,0.10)";
          color = C.blue;
          fontWeight = 600;
        } else if (isCovered) {
          bg = "rgba(45,159,111,0.10)";
          color = C.seaGreen;
          fontWeight = 600;
        } else {
          bg = "rgba(231,111,81,0.08)";
          color = C.olive;
          fontWeight = 500;
        }
        return (
          <div
            key={i}
            onClick={isDesktop && isGap && onDayClick ? () => onDayClick(i) : undefined}
            role={isDesktop && isGap ? "button" : undefined}
            tabIndex={isDesktop && isGap ? 0 : undefined}
            aria-label={`${DAY_NAMES[i]}, ${isHoliday ? "stat holiday" : isCovered ? "covered" : "uncovered"}`}
            style={{
              flex: 1, maxWidth: isDesktop ? 120 : undefined,
              height: 36, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: bg,
              fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight,
              color,
              cursor: isDesktop && isGap ? "pointer" : "default",
              textDecoration: isAway ? "line-through" : "none",
              transition: "background 0.15s",
              position: "relative",
            }}
          >
            {DAY_LABELS[i]}
            {isHoliday && !isAway && (
              <span style={{ fontSize: 8, marginLeft: 2 }}>🏳</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── GapCallout — shows when gaps exist ─── */
function GapCallout({ gapDays, hasAnyEnrolled, isAway }) {
  if (isAway) {
    return (
      <div style={{
        margin: "0 16px 12px", padding: "12px 14px", borderRadius: 12,
        background: "rgba(27,36,50,0.04)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 16 }}>✈️</span>
        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.blue }}>
          You've marked this week as away. Programs are still shown in case plans change.
        </span>
      </div>
    );
  }
  if (gapDays.length === 0) return null;
  if (gapDays.length === 5 && !hasAnyEnrolled) {
    return (
      <div style={{
        margin: "0 16px 12px", padding: "12px 14px", borderRadius: 12,
        background: "rgba(74,111,165,0.06)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", background: "rgba(74,111,165,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, color: C.blue, flexShrink: 0,
        }}>📋</div>
        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.blue }}>
          No programs enrolled yet this week
        </span>
      </div>
    );
  }
  if (!hasAnyEnrolled) return null; // Only show gap callout when partially planned
  const gapNames = gapDays.map((d) => DAY_NAMES[d]);
  const gapText = gapNames.length === 1
    ? `${gapNames[0]} is uncovered this week`
    : `${gapNames.slice(0, -1).join(", ")} and ${gapNames[gapNames.length - 1]} are uncovered this week`;
  return (
    <div role="alert" style={{
      margin: "0 16px 12px", padding: "12px 14px", borderRadius: 12,
      background: "rgba(231,111,81,0.06)",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%", background: "rgba(231,111,81,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, color: C.olive, flexShrink: 0,
      }}>!</div>
      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.olive }}>
        {gapText}
      </span>
    </div>
  );
}

/* ─── Directory Card — program card with week-specific schedule ─── */
function DirectoryCard({ program, alreadyAdded, onTap, favorited, onToggleFavorite, regStatus, eligibility, weekScheduleLabel, accentOverride }) {
  const statusInfo = REGISTRATION_STATUSES.find((s) => s.key === regStatus) || REGISTRATION_STATUSES[0];
  const isApprox = !isMunicipalProvider(program.provider) && typeof program.cost === "number" && program.cost > 0;
  const accent = accentOverride || CAT_ACCENT[program.category] || C.seaGreen;

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
        transition: "box-shadow 0.2s, transform 0.15s",
      }}
      onClick={() => onTap(program)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${program.name}`}
    >
      {/* Favorite heart */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(program.id); }}
        style={{
          position: "absolute", top: 10, right: 10,
          background: "none", border: "none", cursor: "pointer",
          fontSize: 20, lineHeight: 1, padding: 10, zIndex: 2,
          minWidth: 40, minHeight: 40,
          color: favorited ? C.olive : "#9CA3AF",
          transition: "color 0.15s ease",
        }}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      >
        {favorited ? "\u2764\uFE0F" : "\u2661"}
      </button>

      {/* Category header */}
      <div style={{
        fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
        color: accent, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4,
      }}>
        {CAT_EMOJI[program.category] || ""} {program.category}
      </div>

      {/* Name + provider + status */}
      <div style={{ paddingRight: 28 }}>
        <div style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 16, fontWeight: 700,
          color: C.ink, lineHeight: 1.3, marginBottom: 2,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>{program.name}</div>
        <div style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted,
          marginBottom: 4, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
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

      {/* Schedule — week-specific or full date range */}
      <div style={{
        fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginTop: 6,
      }}>
        {weekScheduleLabel || (() => {
          if (!program.startDate) return null;
          const sd = new Date(program.startDate + "T00:00:00");
          const ed = program.endDate ? new Date(program.endDate + "T00:00:00") : null;
          const est = program.confirmed2026 === false ? " (est.)" : "";
          if (!ed || program.startDate === program.endDate) return fmtDate(program.startDate) + est;
          if (sd.getMonth() === ed.getMonth() && sd.getFullYear() === ed.getFullYear())
            return `${MONTH_ABBR[sd.getMonth()]} ${sd.getDate()} – ${ed.getDate()}, ${sd.getFullYear()}${est}`;
          if (sd.getFullYear() === ed.getFullYear())
            return `${MONTH_ABBR[sd.getMonth()]} ${sd.getDate()} – ${MONTH_ABBR[ed.getMonth()]} ${ed.getDate()}, ${ed.getFullYear()}${est}`;
          return `${fmtDate(program.startDate)} – ${fmtDate(program.endDate)}${est}`;
        })()}
        {!weekScheduleLabel && program.startTime && program.endTime && (
          <span style={program.confirmed2026 === false ? { fontStyle: "italic", color: "#B8860B" } : undefined}>
            {" "}· {program.startTime}–{program.endTime}{program.confirmed2026 === false ? " (est.)" : ""}
          </span>
        )}
      </div>

      {/* Bottom row: badges + price */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", flex: 1 }}>
          {(program.ageMin != null || program.ageMax != null) && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, background: C.blue + "14", color: C.blue, padding: "2px 8px", borderRadius: 10 }}>
              {program.ageMin != null && program.ageMax != null
                ? `Ages ${program.ageMin}-${program.ageMax}`
                : program.ageMin != null ? `Ages ${program.ageMin}+` : `Up to ${program.ageMax}`}
            </span>
          )}
          {program.neighbourhood && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 500, background: "rgba(27,36,50,0.05)", color: C.blue, padding: "2px 8px", borderRadius: 10 }}>
              📍 {program.neighbourhood}
            </span>
          )}
          {program.dayLength && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, background: C.seaGreen + "18", color: C.seaGreen, padding: "2px 8px", borderRadius: 10 }}>
              {program.dayLength}
            </span>
          )}
          {eligibility && eligibility.eligibilityTier === "borderline" && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, background: "rgba(244, 162, 97, 0.10)", color: "#F4A261", padding: "2px 8px", borderRadius: 10 }}>
              {eligibility.label}
            </span>
          )}
          {eligibility && eligibility.eligibilityTier === "eligible" && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, background: "rgba(45, 159, 111, 0.10)", color: "#2D9F6F", padding: "2px 8px", borderRadius: 10 }}>
              {eligibility.label}
            </span>
          )}
        </div>
        <div style={{
          fontFamily: "'Poppins', sans-serif", fontSize: 16, color: C.ink,
          fontWeight: 700, whiteSpace: "nowrap", marginLeft: 8,
        }}>
          {program.earlyBirdCost != null && program.earlyBirdDeadline && new Date(program.earlyBirdDeadline) >= new Date()
            ? <><span>${Number(program.earlyBirdCost).toLocaleString()}</span><span style={{ fontSize: 11, color: C.muted, textDecoration: "line-through", marginLeft: 4 }}>${Number(program.cost).toLocaleString()}</span></>
            : program.cost === "TBD" ? "TBD" : program.cost ? (isApprox ? "~$" : "$") + Number(program.cost).toLocaleString() + (program.costPer === "week" ? "/wk" : "") : "Free"
          }
        </div>
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT — DiscoverTab
   ══════════════════════════════════════════════════════════════ */

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
  const [userSubmitted, setUserSubmitted] = useState([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const isDesktop = useIsDesktop();

  const [filterToast, setFilterToast] = useState(null);
  const showFilterToast = (msg) => { setFilterToast(msg); setTimeout(() => setFilterToast(null), 2500); };

  /* Load user-submitted programs from Supabase */
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

  const allDirectoryPrograms = useMemo(() => {
    if (userSubmitted.length === 0) return fallbackPrograms;
    const existing = new Set(fallbackPrograms.map((p) => `${p.name}|||${p.provider}`.toLowerCase()));
    const newOnes = userSubmitted.filter((p) => !existing.has(`${p.name}|||${p.provider}`.toLowerCase()));
    return [...fallbackPrograms, ...newOnes];
  }, [userSubmitted]);

  const searchTrackRef = useRef(null);
  const weekStripRef = useRef(null);
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState(new Set());
  const [selectedHoods, setSelectedHoods] = useState(new Set());
  const [expandedCities, setExpandedCities] = useState(new Set());
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [selectedCosts, setSelectedCosts] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedRegStatuses, setSelectedRegStatuses] = useState(new Set(["open", "coming-soon", "upcoming", "likely-coming-soon"]));
  const [selectedProviders, setSelectedProviders] = useState(new Set());
  const [providerSearch, setProviderSearch] = useState("");
  const [selectedActivityTypes, setSelectedActivityTypes] = useState(new Set());
  const [selectedDayLengths, setSelectedDayLengths] = useState(new Set());
  const [showBorderline, setShowBorderline] = useState(true);
  const [dayFilter, setDayFilter] = useState(null); // desktop: click a gap day to filter

  /* Week state */
  const [selectedWeekId, setSelectedWeekId] = useState(null);
  const [awayWeeks, setAwayWeeks] = useState(() => {
    try {
      const stored = localStorage.getItem("skeddo-away-weeks");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });

  const { dataVersion, lastCheckedLabel, isStale, isChecking, checkForUpdates } = useDataFreshness();

  /* ─── Compute summer weeks ─── */
  const summerYear = useMemo(() => {
    // Determine which summer to show based on program dates
    const years = new Set();
    allDirectoryPrograms.forEach((p) => {
      if (p.startDate) {
        const d = new Date(p.startDate + "T00:00:00");
        if (d.getMonth() >= 5 && d.getMonth() <= 7) years.add(d.getFullYear()); // Jun-Aug
      }
    });
    if (years.size > 0) return Math.max(...years);
    return new Date().getFullYear();
  }, [allDirectoryPrograms]);

  const summerWeeks = useMemo(() => computeSummerWeeks(summerYear), [summerYear]);

  /* Auto-select current week on initial load */
  useEffect(() => {
    if (selectedWeekId) return;
    const today = new Date();
    const match = summerWeeks.find((w) => today >= w.monday && today <= w.friday);
    setSelectedWeekId(match ? match.id : summerWeeks[0]?.id || null);
  }, [summerWeeks, selectedWeekId]);

  /* Persist away weeks */
  useEffect(() => {
    localStorage.setItem("skeddo-away-weeks", JSON.stringify([...awayWeeks]));
  }, [awayWeeks]);

  const toggleAway = useCallback((weekId) => {
    setAwayWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekId)) next.delete(weekId);
      else next.add(weekId);
      return next;
    });
  }, []);

  /* Selected week object */
  const selectedWeek = useMemo(
    () => summerWeeks.find((w) => w.id === selectedWeekId) || summerWeeks[0],
    [summerWeeks, selectedWeekId]
  );

  const isSelectedAway = awayWeeks.has(selectedWeekId);

  /* ─── User's enrolled programs for coverage computation ─── */
  const userPrograms = programs || [];

  /* Coverage for each week */
  const weekCoverageMap = useMemo(() => {
    const map = {};
    summerWeeks.forEach((week) => {
      const coverage = [false, false, false, false, false]; // M T W T F
      userPrograms.forEach((up) => {
        const status = (up.status || "").toLowerCase();
        if (status !== "enrolled" && status !== "exploring") return;
        const days = getProgramWeekDays(up, week.monday);
        days.forEach((d) => { coverage[d] = true; });
      });
      map[week.id] = coverage;
    });
    return map;
  }, [summerWeeks, userPrograms]);

  /* Coverage dots for a week: "covered" | "gap" | "holiday" */
  const getCoverageDots = useCallback((week) => {
    const cov = weekCoverageMap[week.id] || [false, false, false, false, false];
    return cov.map((covered, i) => {
      if (week.statHolidays.includes(i)) return "holiday";
      return covered ? "covered" : "gap";
    });
  }, [weekCoverageMap]);

  /* Coverage for selected week */
  const selectedCoverage = useMemo(() => {
    if (!selectedWeek) return ["gap", "gap", "gap", "gap", "gap"];
    return getCoverageDots(selectedWeek);
  }, [selectedWeek, getCoverageDots]);

  /* Gap days (excluding stat holidays) */
  const gapDays = useMemo(() => {
    return selectedCoverage
      .map((s, i) => (s === "gap" ? i : -1))
      .filter((i) => i >= 0);
  }, [selectedCoverage]);

  /* Coverage summary text */
  const coverageSummary = useMemo(() => {
    if (!selectedWeek) return "";
    const totalWorkDays = 5 - selectedWeek.statHolidays.length;
    const covered = selectedCoverage.filter((s) => s === "covered").length;
    return `${covered}/${totalWorkDays} days covered`;
  }, [selectedWeek, selectedCoverage]);

  /* User's enrolled/exploring programs in the selected week */
  const myProgramsThisWeek = useMemo(() => {
    if (!selectedWeek) return [];
    return userPrograms
      .filter((up) => {
        const status = (up.status || "").toLowerCase();
        if (status !== "enrolled" && status !== "exploring") return false;
        return programOverlapsWeek(up, selectedWeek.monday, selectedWeek.friday);
      })
      .map((up) => {
        const weekDays = getProgramWeekDays(up, selectedWeek.monday);
        return { ...up, weekDays, weekScheduleLabel: getWeekScheduleLabel(up, weekDays) };
      });
  }, [selectedWeek, userPrograms]);

  /* Program count per week (enrolled/exploring) */
  const weekProgramCounts = useMemo(() => {
    const map = {};
    summerWeeks.forEach((week) => {
      map[week.id] = userPrograms.filter((up) => {
        const status = (up.status || "").toLowerCase();
        if (status !== "enrolled" && status !== "exploring") return false;
        return programOverlapsWeek(up, week.monday, week.friday);
      }).length;
    });
    return map;
  }, [summerWeeks, userPrograms]);

  /* Summer overview stats */
  const summerOverview = useMemo(() => {
    const nonAway = summerWeeks.filter((w) => !awayWeeks.has(w.id));
    const planned = nonAway.filter((w) => (weekProgramCounts[w.id] || 0) > 0).length;
    return { planned, total: nonAway.length };
  }, [summerWeeks, awayWeeks, weekProgramCounts]);

  /* ─── Auto-scroll week strip to active tile ─── */
  useEffect(() => {
    if (!weekStripRef.current || isDesktop) return;
    const idx = summerWeeks.findIndex((w) => w.id === selectedWeekId);
    if (idx >= 0) {
      const tileWidth = 86; // 80 + 6 gap
      const stripWidth = weekStripRef.current.offsetWidth;
      const scrollTo = idx * tileWidth - stripWidth / 2 + tileWidth / 2;
      weekStripRef.current.scrollTo({ left: Math.max(0, scrollTo), behavior: "smooth" });
    }
  }, [selectedWeekId, summerWeeks, isDesktop]);

  /* ─── Filter state ─── */
  const allProviders = useMemo(() => {
    return [...new Set(allDirectoryPrograms.map((p) => p.provider))].sort((a, b) =>
      a.localeCompare(b, "en", { sensitivity: "base" })
    );
  }, [allDirectoryPrograms]);

  const availableActivityTypes = useMemo(() => {
    const types = new Set();
    allDirectoryPrograms.forEach((p) => {
      if (selectedCats.size === 0 || selectedCats.has(p.category)) {
        if (p.activityType) types.add(p.activityType);
      }
    });
    return [...types].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
  }, [selectedCats, allDirectoryPrograms]);

  useEffect(() => {
    setSelectedActivityTypes((prev) => {
      if (prev.size === 0) return prev;
      const validTypes = new Set(availableActivityTypes);
      const pruned = new Set([...prev].filter((t) => validTypes.has(t)));
      return pruned.size === prev.size ? prev : pruned;
    });
  }, [availableActivityTypes]);

  const toggleInSet = (setter, value) => {
    trackEvent("filter_applied", { filter_type: "toggle", filter_value: String(value) });
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
    setSelectedHoods(new Set());
    setAgeMin("");
    setAgeMax("");
    setSelectedCosts(new Set());
    setShowFavoritesOnly(false);
    setSortBy("relevance");
    setSelectedRegStatuses(new Set(["open", "coming-soon", "upcoming", "likely-coming-soon"]));
    setSelectedProviders(new Set());
    setSelectedActivityTypes(new Set());
    setSelectedDayLengths(new Set());
    setProviderSearch("");
    setDayFilter(null);
    setVisibleCount(PAGE_SIZE);
  };

  const totalActiveFilters = useMemo(() => {
    let count = 0;
    if (selectedCats.size > 0) count++;
    if (ageMin || ageMax) count++;
    if (selectedCosts.size > 0) count++;
    if (selectedHoods.size > 0) count++;
    if (selectedRegStatuses.size > 0 && !(selectedRegStatuses.size === 4 && selectedRegStatuses.has("open") && selectedRegStatuses.has("coming-soon") && selectedRegStatuses.has("upcoming") && selectedRegStatuses.has("likely-coming-soon"))) count++;
    if (selectedDayLengths.size > 0) count++;
    if (selectedActivityTypes.size > 0) count++;
    if (selectedProviders.size > 0) count++;
    if (showFavoritesOnly) count++;
    if (sortBy !== "relevance") count++;
    if (search) count++;
    if (dayFilter !== null) count++;
    return count;
  }, [selectedCats, ageMin, ageMax, selectedCosts, selectedHoods, selectedRegStatuses, selectedDayLengths, selectedActivityTypes, selectedProviders, showFavoritesOnly, sortBy, search, dayFilter]);

  const addedNames = useMemo(() => {
    const set = new Set();
    (programs || []).forEach((p) => set.add(p.name?.toLowerCase()));
    return set;
  }, [programs]);

  /* User program IDs for excluding from available list */
  const userProgramNames = useMemo(() => {
    const set = new Set();
    (programs || []).forEach((p) => {
      if (p.name) set.add(p.name.toLowerCase());
    });
    return set;
  }, [programs]);

  /* ─── Week-scoped + filtered programs ─── */
  const weekFilteredPrograms = useMemo(() => {
    if (!selectedWeek) return [];
    const q = search.toLowerCase().trim();
    const minAge = ageMin ? Number(ageMin) : null;
    const maxAge = ageMax ? Number(ageMax) : null;
    const costRanges = selectedCosts.size > 0
      ? [...selectedCosts].map((i) => COST_RANGES[i])
      : null;

    return allDirectoryPrograms.filter((p) => {
      // 1. Must overlap the selected week
      if (!programOverlapsWeek(p, selectedWeek.monday, selectedWeek.friday)) return false;

      // 2. Exclude programs in user's list (they appear in "My programs" section)
      if (userProgramNames.has(p.name?.toLowerCase())) return false;

      // 3. Day filter (desktop: click a gap day)
      if (dayFilter !== null) {
        const weekDays = getProgramWeekDays(p, selectedWeek.monday);
        if (!weekDays.includes(dayFilter)) return false;
      }

      // Standard filters
      if (selectedRegStatuses.size > 0 && !selectedRegStatuses.has(getRegistrationStatus(p))) return false;
      if (showFavoritesOnly && !favorites.includes(p.id)) return false;
      if (q) {
        const haystack = [p.name, p.provider, p.description].filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (selectedCats.size > 0 && !selectedCats.has(p.category)) return false;
      if (selectedActivityTypes.size > 0 && !selectedActivityTypes.has(p.activityType)) return false;
      if (selectedProviders.size > 0 && !selectedProviders.has(p.provider)) return false;
      if (selectedHoods.size > 0 && !selectedHoods.has(p.neighbourhood)) return false;
      if (minAge != null && p.ageMax != null && p.ageMax < minAge) return false;
      if (maxAge != null && p.ageMin != null && p.ageMin > maxAge) return false;
      if (costRanges) {
        if (p.cost === "TBD") return true;
        const cost = typeof p.cost === "number" ? p.cost : 0;
        if (!costRanges.some((range) => {
          if (range.max === 0) return cost === 0;
          if (range.min === 0 && range.max === Infinity) return true;
          return cost >= range.min && cost <= range.max;
        })) return false;
      }
      if (selectedDayLengths.size > 0 && (!p.dayLength || !selectedDayLengths.has(p.dayLength))) return false;
      return true;
    });
  }, [allDirectoryPrograms, selectedWeek, search, selectedCats, selectedHoods, ageMin, ageMax, selectedCosts, showFavoritesOnly, favorites, selectedRegStatuses, selectedProviders, selectedActivityTypes, selectedDayLengths, dayFilter, userProgramNames]);

  /* ─── Relevance sort (gap-fill + registration urgency) ─── */
  const sortedPrograms = useMemo(() => {
    if (sortBy !== "relevance" || !selectedWeek) {
      return sortPrograms(weekFilteredPrograms, sortBy);
    }

    // V1 relevance: gap coverage (40%) + status urgency (25%)
    const statusOrder = { "open": 0, "coming-soon": 1, "upcoming": 2, "likely-coming-soon": 3, "full-waitlist": 4, "in-progress": 5, "completed": 6 };
    const totalGaps = gapDays.length;

    return [...weekFilteredPrograms].sort((a, b) => {
      // Gap fill score
      let aGapFill = 0, bGapFill = 0;
      if (totalGaps > 0) {
        const aDays = getProgramWeekDays(a, selectedWeek.monday);
        const bDays = getProgramWeekDays(b, selectedWeek.monday);
        aGapFill = aDays.filter((d) => gapDays.includes(d)).length / totalGaps;
        bGapFill = bDays.filter((d) => gapDays.includes(d)).length / totalGaps;
      }

      // Status score (lower is better)
      const aStatus = statusOrder[getRegistrationStatus(a)] ?? 6;
      const bStatus = statusOrder[getRegistrationStatus(b)] ?? 6;

      // Combined score (higher is better)
      const aScore = aGapFill * 0.6 + (1 - aStatus / 6) * 0.4;
      const bScore = bGapFill * 0.6 + (1 - bStatus / 6) * 0.4;

      if (bScore !== aScore) return bScore - aScore;
      // Tiebreaker: favorites first, then alphabetical
      const aFav = favorites.includes(a.id) ? 1 : 0;
      const bFav = favorites.includes(b.id) ? 1 : 0;
      if (bFav !== aFav) return bFav - aFav;
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [weekFilteredPrograms, sortBy, selectedWeek, gapDays, favorites]);

  /* Eligibility */
  const isAllKids = kidFilter === "all-kids";
  const selectedKid = useMemo(
    () => (kidFilter && !isAllKids) ? (kids || []).find((k) => k.id === kidFilter) : null,
    [kidFilter, isAllKids, kids]
  );
  const kidsWithBirth = useMemo(
    () => (kids || []).filter((k) => k.birthMonth && k.birthYear),
    [kids]
  );

  const eligibilityMap = useMemo(() => {
    if (isAllKids && kidsWithBirth.length > 0) {
      const map = new Map();
      sortedPrograms.forEach((p) => {
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
    sortedPrograms.forEach((p) => {
      const startDate = p.startDate || new Date().toISOString().split("T")[0];
      const result = computeEligibility(selectedKid.birthMonth, selectedKid.birthYear, p.ageMin, p.ageMax, startDate);
      const label = getEligibilityLabel(selectedKid.name, selectedKid.birthMonth, selectedKid.birthYear, p.ageMin, p.ageMax, startDate);
      map.set(p.id, { ...result, label });
    });
    return map;
  }, [isAllKids, kidsWithBirth, selectedKid, sortedPrograms]);

  const eligibilityFiltered = useMemo(() => {
    if (!eligibilityMap) return sortedPrograms;
    return sortedPrograms.filter((p) => {
      const elig = eligibilityMap.get(p.id);
      if (!elig || elig.eligibilityTier === null) return true;
      if (elig.eligibilityTier === "ineligible") return false;
      if (elig.eligibilityTier === "borderline" && !showBorderline) return false;
      return true;
    });
  }, [sortedPrograms, eligibilityMap, showBorderline]);

  const visiblePrograms = eligibilityFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < eligibilityFiltered.length;

  /* ─── Handle selecting a week ─── */
  const handleSelectWeek = useCallback((weekId) => {
    setSelectedWeekId(weekId);
    setVisibleCount(PAGE_SIZE);
    setDayFilter(null);
  }, []);

  /* Handle clicking a gap day on desktop */
  const handleDayClick = useCallback((dayIndex) => {
    setDayFilter((prev) => prev === dayIndex ? null : dayIndex);
    setVisibleCount(PAGE_SIZE);
  }, []);

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */

  const weekContentArea = (
    <>
      {/* Week detail header */}
      {selectedWeek && (
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: isDesktop ? "0 0 12px" : "12px 16px 8px",
        }}>
          <div style={{
            fontFamily: isDesktop ? "'Poppins', sans-serif" : "'Barlow', sans-serif",
            fontSize: isDesktop ? 24 : 18, fontWeight: isDesktop ? 700 : 500, color: C.ink,
          }}>
            {selectedWeek.dateRange}
          </div>
          <div style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.blue,
          }}>
            {coverageSummary}
          </div>
        </div>
      )}

      {/* Coverage bar */}
      {selectedWeek && !isSelectedAway && (
        <CoverageBar
          coverage={selectedCoverage}
          statHolidays={selectedWeek.statHolidays}
          isAway={isSelectedAway}
          onDayClick={isDesktop ? handleDayClick : null}
          isDesktop={isDesktop}
        />
      )}

      {/* Day filter indicator */}
      {dayFilter !== null && (
        <div style={{
          margin: "4px 16px 8px", display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.olive }}>
            Showing programs covering {DAY_NAMES[dayFilter]}
          </span>
          <button onClick={() => setDayFilter(null)} style={{
            background: "none", border: "none", color: C.olive, cursor: "pointer",
            fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "underline",
          }}>Clear</button>
        </div>
      )}

      {/* Gap callout */}
      {selectedWeek && (
        <GapCallout
          gapDays={gapDays}
          hasAnyEnrolled={myProgramsThisWeek.length > 0}
          isAway={isSelectedAway}
        />
      )}

      {/* My programs this week */}
      {selectedWeek && (
        <div style={{ padding: "0 16px", marginBottom: myProgramsThisWeek.length > 0 ? 16 : 8 }}>
          <div style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700,
            textTransform: "uppercase", color: C.blue, letterSpacing: 0.5,
            marginBottom: 8,
          }}>
            YOUR SCHEDULE
          </div>
          {myProgramsThisWeek.length === 0 ? (
            <div style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted,
              padding: "10px 14px", background: "rgba(74,111,165,0.04)",
              borderRadius: 10, marginBottom: 4,
            }}>
              Add your first program for this week
            </div>
          ) : (
            <div style={isDesktop ? { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 } : {}}>
              {myProgramsThisWeek.map((up) => {
                const status = (up.status || "").toLowerCase();
                const accent = status === "enrolled" ? C.seaGreen : status === "exploring" ? C.blue : C.olive;
                return (
                  <DirectoryCard
                    key={up.id || up.name}
                    program={up}
                    alreadyAdded={true}
                    favorited={isFavorite(up.id)}
                    onToggleFavorite={toggleFavorite}
                    onTap={onOpenDirectoryDetail}
                    regStatus={getRegistrationStatus(up)}
                    eligibility={null}
                    weekScheduleLabel={up.weekScheduleLabel}
                    accentOverride={accent}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Search bar */}
      <div style={{ padding: "0 16px", marginBottom: 8 }}>
        <div style={{ position: "relative" }}>
          <span style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            fontSize: 16, color: C.muted, pointerEvents: "none",
          }}>&#x1F50D;</span>
          <input
            style={s.searchBox}
            type="text"
            placeholder="Search programs, providers..."
            value={search}
            onChange={(e) => {
              const val = e.target.value;
              setSearch(val);
              setVisibleCount(PAGE_SIZE);
              if (searchTrackRef.current) clearTimeout(searchTrackRef.current);
              if (val.trim()) {
                searchTrackRef.current = setTimeout(() => trackEvent("search_programs", { search_term: val.trim() }), 500);
              }
            }}
          />
        </div>
      </div>

      {/* Show borderline toggle */}
      {selectedKid && selectedKid.birthMonth && selectedKid.birthYear && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8, margin: "0 16px 12px",
          padding: "8px 12px", background: "rgba(244, 162, 97, 0.08)", borderRadius: 10,
        }}>
          <label style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.ink,
            display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flex: 1,
          }}>
            <input type="checkbox" checked={showBorderline} onChange={() => setShowBorderline((v) => !v)}
              style={{ accentColor: "#F4A261", width: 16, height: 16 }} />
            Show borderline camps
          </label>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted }}>
            Filtering for {selectedKid.name}
          </span>
        </div>
      )}

      {/* Filter chips */}
      <div style={{
        padding: "4px 16px 0",
        overflowX: "auto", display: "flex", gap: 6, alignItems: "center",
        scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch",
        ...(isDesktop ? {
          position: "sticky", top: 0, zIndex: 10,
          background: C.cream, borderBottom: `1px solid rgba(27,36,50,0.06)`,
          padding: "8px 0", flexWrap: "wrap",
        } : {}),
      }}>
        <FilterChip label={`♡ ${favorites.length}`} active={showFavoritesOnly} onClick={() => { setShowFavoritesOnly(!showFavoritesOnly); setVisibleCount(PAGE_SIZE); }} />
        <FilterChip label="Category" count={selectedCats.size + selectedActivityTypes.size} active={selectedCats.size > 0 || selectedActivityTypes.size > 0} onClick={() => setActiveDrawer("category")} />
        {kids && kids.length > 0 && (
          <FilterChip label="Eligible for" count={kidFilter ? 1 : 0} active={!!kidFilter} onClick={() => setActiveDrawer("eligible")} />
        )}
        <FilterChip label="Cost" count={selectedCosts.size} active={selectedCosts.size > 0} onClick={() => setActiveDrawer("cost")} />
        <FilterChip label="Area" count={selectedHoods.size} active={selectedHoods.size > 0} onClick={() => setActiveDrawer("neighbourhood")} />
        <FilterChip label="Day" count={selectedDayLengths.size} active={selectedDayLengths.size > 0} onClick={() => setActiveDrawer("dayLength")} />
        <FilterChip label="Status" count={selectedRegStatuses.size} active={selectedRegStatuses.size > 0} onClick={() => setActiveDrawer("status")} />
        <FilterChip label="Sort" active={sortBy !== "relevance"} onClick={() => setActiveDrawer("sort")} />
        {totalActiveFilters > 0 && (
          <button onClick={clearAllFilters} style={{
            background: "none", border: "none", color: C.olive,
            fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600,
            cursor: "pointer", whiteSpace: "nowrap", padding: "6px 8px",
          }}>Clear all</button>
        )}
      </div>

      {/* Active filter summary */}
      {totalActiveFilters > 0 && (
        <div style={{ padding: "6px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, color: C.muted, fontFamily: "'Barlow', sans-serif" }}>
            {totalActiveFilters} filter{totalActiveFilters !== 1 ? "s" : ""} · {eligibilityFiltered.length} results
          </span>
        </div>
      )}

      {/* Results count */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        margin: "8px 16px",
      }}>
        <span style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: C.muted,
        }}>
          {eligibilityFiltered.length.toLocaleString()} program{eligibilityFiltered.length !== 1 ? "s" : ""} this week
        </span>
      </div>

      {/* Available programs */}
      <div style={{ padding: "0 16px" }}>
        {isLoadingPrograms && <SkeletonList count={6} />}
        {!isLoadingPrograms && eligibilityFiltered.length === 0 && (
          <>
            <EmptyState
              icon={"\uD83D\uDD0D"}
              message="No programs found for this week. Try adjusting your filters or check nearby weeks."
            />
            {onOpenAddProgram && (
              <div style={{ textAlign: "center", padding: "0 16px 16px", marginTop: -8 }}>
                <p style={{
                  fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted,
                  lineHeight: 1.6, marginBottom: 12,
                }}>
                  Can't find a program? You can add it manually.
                </p>
                <button onClick={onOpenAddProgram} style={{ ...s.addButton, fontSize: 15, padding: "12px 28px" }}>
                  + Add Program
                </button>
              </div>
            )}
          </>
        )}
        {!isLoadingPrograms && (
          <div style={isDesktop ? {
            display: "grid",
            gridTemplateColumns: eligibilityFiltered.length >= 9 ? "repeat(3, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))",
            gap: 12,
          } : {}}>
            {visiblePrograms.map((p) => {
              const weekDays = selectedWeek ? getProgramWeekDays(p, selectedWeek.monday) : [];
              const weekLabel = selectedWeek ? getWeekScheduleLabel(p, weekDays) : "";
              return (
                <DirectoryCard
                  key={p.id}
                  program={p}
                  alreadyAdded={addedNames.has(p.name?.toLowerCase())}
                  favorited={isFavorite(p.id)}
                  onToggleFavorite={toggleFavorite}
                  onTap={onOpenDirectoryDetail}
                  regStatus={getRegistrationStatus(p)}
                  eligibility={eligibilityMap ? eligibilityMap.get(p.id) : null}
                  weekScheduleLabel={weekLabel}
                />
              );
            })}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            aria-label={`Load more programs, ${eligibilityFiltered.length - visibleCount} remaining`}
            style={{
              width: "100%",
              fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700,
              color: C.seaGreen, background: C.white,
              border: `1.5px solid ${C.seaGreen}`, borderRadius: 12,
              padding: "12px 16px", cursor: "pointer",
              marginTop: 8, marginBottom: 8, transition: "all 0.15s",
            }}
          >
            Load more ({eligibilityFiltered.length - visibleCount} remaining)
          </button>
        )}
      </div>
    </>
  );

  /* ─── Desktop layout ─── */
  if (isDesktop) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Left sidebar — Week navigator */}
        <div style={{
          width: 200, flexShrink: 0, background: C.white,
          borderRight: "0.5px solid rgba(27,36,50,0.08)",
          padding: "16px 12px", position: "sticky", top: 0,
          height: "100vh", overflowY: "auto",
          scrollbarWidth: "thin",
        }}>
          {/* Summer overview */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontFamily: "'Poppins', sans-serif", fontSize: 18, color: C.ink, marginBottom: 4,
            }}>
              Summer {summerYear}
            </div>
            <div style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.blue, marginBottom: 8,
            }}>
              {summerOverview.planned} of {summerOverview.total} weeks planned
            </div>
            {/* Mini progress bar */}
            <div style={{ display: "flex", gap: 2 }}>
              {summerWeeks.map((w) => {
                const isAway = awayWeeks.has(w.id);
                const count = weekProgramCounts[w.id] || 0;
                const dots = getCoverageDots(w);
                const allCovered = dots.every((d) => d === "covered" || d === "holiday");
                const someCovered = dots.some((d) => d === "covered");
                let bg;
                if (isAway) bg = "rgba(27,36,50,0.10)";
                else if (allCovered) bg = C.seaGreen;
                else if (someCovered) bg = C.lilac;
                else bg = C.cream;
                return (
                  <div key={w.id} style={{
                    flex: 1, height: 4, borderRadius: 2, background: bg,
                    border: `0.5px solid ${C.border}`,
                  }} />
                );
              })}
            </div>
          </div>

          {/* Week tiles */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {summerWeeks.map((week) => (
              <WeekTile
                key={week.id}
                week={week}
                active={selectedWeekId === week.id}
                coverageDots={getCoverageDots(week)}
                programCount={weekProgramCounts[week.id] || 0}
                isAway={awayWeeks.has(week.id)}
                onSelect={handleSelectWeek}
                onToggleAway={toggleAway}
                isDesktop={true}
              />
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, maxWidth: 960, margin: "0 auto", padding: "24px 32px" }}>
          {weekContentArea}
        </div>

        {/* Filter drawers (shared) */}
        {renderFilterDrawers()}
      </div>
    );
  }

  /* ─── Mobile layout ─── */
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 5 }}>
        <h2 style={s.pageTitle}>Discover</h2>
        <p style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted,
          marginBottom: 8, marginTop: 0,
        }}>
          {isLoadingPrograms
            ? "Loading programs..."
            : `Browse ${allDirectoryPrograms.length.toLocaleString()} programs · Week by week`}
        </p>
      </div>

      {/* Week strip — horizontal scroll */}
      <div
        ref={weekStripRef}
        style={{
          display: "flex", gap: 6, overflowX: "auto", padding: "0 16px 8px",
          scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch",
        }}
      >
        {summerWeeks.map((week) => (
          <WeekTile
            key={week.id}
            week={week}
            active={selectedWeekId === week.id}
            coverageDots={getCoverageDots(week)}
            programCount={weekProgramCounts[week.id] || 0}
            isAway={awayWeeks.has(week.id)}
            onSelect={handleSelectWeek}
            onToggleAway={toggleAway}
            isDesktop={false}
          />
        ))}
      </div>

      {weekContentArea}

      {/* Filter drawers */}
      {renderFilterDrawers()}

      {/* Filter upgrade toast */}
      {filterToast && (
        <div role="status" aria-live="polite" style={{
          position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
          background: C.ink, color: C.cream,
          fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600,
          padding: "12px 20px", borderRadius: 10,
          boxShadow: "0 4px 16px rgba(27,36,50,0.2)", zIndex: 9999,
          animation: "fadeIn 0.2s ease", whiteSpace: "nowrap",
        }}>
          {filterToast}
        </div>
      )}
    </div>
  );

  /* ─── Filter Drawers (shared between mobile + desktop) ─── */
  function renderFilterDrawers() {
    return (
      <>
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
          onClear={() => { setSelectedCats(new Set()); setSelectedActivityTypes(new Set()); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
          {(() => {
            const catTypeMap = {};
            allDirectoryPrograms.forEach((p) => {
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
                    }}>{isCatSelected ? "✓" : ""}</span>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: isCatSelected ? 600 : 400, color: C.ink, flex: 1 }}>
                      {CAT_EMOJI[cat] || ""} {cat}
                    </span>
                    {activeSubCount > 0 && (
                      <span style={{ background: C.seaGreen, color: "#fff", fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {activeSubCount}
                      </span>
                    )}
                    {subTypes.length > 0 && (
                      <span style={{ fontSize: 12, color: C.muted, transition: "transform 0.15s", transform: isCatSelected ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>{"▶"}</span>
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
                            }}>{isTypeSelected ? "✓" : ""}</span>
                            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: isTypeSelected ? C.ink : C.muted, fontWeight: isTypeSelected ? 600 : 400, flex: 1 }}>
                              {type}
                            </span>
                            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted }}>{count}</span>
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

        {/* Cost Drawer */}
        <FilterDrawer open={activeDrawer === "cost"} onClose={() => setActiveDrawer(null)} title="Cost"
          onClear={() => { setSelectedCosts(new Set()); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
          <FilterOptions
            options={COST_RANGES.slice(1).map((r, i) => ({ id: i + 1, label: r.label }))}
            selected={selectedCosts}
            onToggle={(id) => toggleInSet(setSelectedCosts, id)}
          />
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
                    <span style={{ fontSize: 10, color: C.muted, transition: "transform 0.15s", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>{"▶"}</span>
                    <span style={{ flex: 1, fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: C.ink }}>
                      {cityObj.city}
                      {someInCitySelected && <span style={{ color: C.muted, fontWeight: 400 }}> ({selectedInCity}/{cityObj.neighbourhoods.length})</span>}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); toggleCity(cityObj); }}
                      aria-label={allInCitySelected ? `Deselect all ${cityObj.city}` : `Select all ${cityObj.city}`}
                      style={{
                        fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700,
                        color: allInCitySelected ? "#EF4444" : C.seaGreen,
                        background: allInCitySelected ? "#FEF2F2" : C.seaGreen + "12",
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
                            fontFamily: "'Barlow', sans-serif", fontSize: 14,
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

        {/* Day Length Drawer */}
        <FilterDrawer open={activeDrawer === "dayLength"} onClose={() => setActiveDrawer(null)} title="Day Length"
          onClear={() => { setSelectedDayLengths(new Set()); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
          <FilterOptions
            options={DAY_LENGTHS.map((dl) => ({ id: dl, label: dl }))}
            selected={selectedDayLengths}
            onToggle={(id) => toggleInSet(setSelectedDayLengths, id)}
          />
        </FilterDrawer>

        {/* Provider Drawer */}
        <FilterDrawer open={activeDrawer === "provider"} onClose={() => setActiveDrawer(null)} title="Provider"
          onClear={() => { setSelectedProviders(new Set()); setProviderSearch(""); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
          <>
            {selectedProviders.size > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {[...selectedProviders].sort().map((prov) => (
                  <button key={prov} onClick={() => toggleInSet(setSelectedProviders, prov)} style={{
                    fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600,
                    background: C.ink, color: "#fff", border: "none", borderRadius: 20,
                    padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                  }}>
                    {prov} <span style={{ fontSize: 14, lineHeight: 1 }}>&times;</span>
                  </button>
                ))}
              </div>
            )}
            <div style={{ position: "relative", marginBottom: 12 }}>
              <input style={{ ...s.input, fontSize: 14, paddingLeft: 32 }}
                placeholder="Search providers..."
                value={providerSearch}
                onChange={(e) => setProviderSearch(e.target.value)} />
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: C.muted, pointerEvents: "none" }}>
                &#x1F50D;
              </span>
            </div>
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
                      }}>{isSelected ? "✓" : ""}</span>
                      {prov}
                    </div>
                  );
                })}
              {allProviders.filter((prov) => prov.toLowerCase().includes(providerSearch.toLowerCase().trim())).length === 0 && (
                <div style={{ padding: 12, fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, textAlign: "center" }}>
                  No providers found
                </div>
              )}
            </div>
          </>
        </FilterDrawer>

        {/* Eligible for drawer */}
        <FilterDrawer open={activeDrawer === "eligible"} onClose={() => setActiveDrawer(null)} title="Eligible for"
          onClear={() => { onKidFilter(null); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <button onClick={() => { onKidFilter(null); setVisibleCount(PAGE_SIZE); }} style={{
              padding: "14px 16px", fontFamily: "'Barlow', sans-serif", fontSize: 15,
              color: !kidFilter ? C.ink : C.muted, fontWeight: !kidFilter ? 700 : 400,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
              background: !kidFilter ? C.ink + "08" : "transparent",
              border: "none", borderRadius: 0, textAlign: "left",
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%",
                border: `2px solid ${!kidFilter ? C.seaGreen : C.border}`,
                background: !kidFilter ? C.seaGreen : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: C.white, flexShrink: 0,
              }}>{!kidFilter ? "✓" : ""}</span>
              All Programs (no age filter)
            </button>
            {kids && kids.length > 1 && (
              <button onClick={() => { onKidFilter("all-kids"); setVisibleCount(PAGE_SIZE); }} style={{
                padding: "14px 16px", fontFamily: "'Barlow', sans-serif", fontSize: 15,
                color: kidFilter === "all-kids" ? C.ink : C.muted, fontWeight: kidFilter === "all-kids" ? 700 : 400,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                background: kidFilter === "all-kids" ? C.seaGreen + "10" : "transparent",
                border: "none", borderRadius: 0, textAlign: "left",
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: "50%",
                  border: `2px solid ${kidFilter === "all-kids" ? C.seaGreen : C.border}`,
                  background: kidFilter === "all-kids" ? C.seaGreen : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: C.white, flexShrink: 0,
                }}>{kidFilter === "all-kids" ? "✓" : ""}</span>
                <div>
                  <div>All Kids Together</div>
                  <div style={{ fontSize: 14, color: C.muted, fontWeight: 400 }}>Programs all your kids can attend</div>
                </div>
              </button>
            )}
            {(kids || []).map((kid) => {
              const isActive = kidFilter === kid.id;
              const kidColor = kid.color || C.seaGreen;
              const hasBirth = kid.birthMonth && kid.birthYear;
              return (
                <button key={kid.id} onClick={() => { onKidFilter(kid.id); setVisibleCount(PAGE_SIZE); }} style={{
                  padding: "14px 16px", fontFamily: "'Barlow', sans-serif", fontSize: 15,
                  color: isActive ? C.ink : C.muted, fontWeight: isActive ? 700 : 400,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                  background: isActive ? kidColor + "10" : "transparent",
                  border: "none", borderRadius: 0, textAlign: "left",
                }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: "50%",
                    border: `2px solid ${isActive ? kidColor : C.border}`,
                    background: isActive ? kidColor : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, color: C.white, flexShrink: 0,
                  }}>{isActive ? "✓" : ""}</span>
                  <div>
                    <div>{kid.name}</div>
                    {hasBirth ? (
                      <div style={{ fontSize: 14, color: C.muted, fontWeight: 400 }}>
                        Age-appropriate programs for {kid.name}
                      </div>
                    ) : (
                      <div style={{ fontSize: 14, color: C.olive, fontWeight: 400 }}>
                        Add birth month to enable age filtering
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </FilterDrawer>
      </>
    );
  }
}
