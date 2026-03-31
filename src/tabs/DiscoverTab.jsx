import { useState, useMemo, useEffect, useRef } from "react";
import { C, CATEGORIES, CAT_EMOJI, SEASON_TYPES, DAY_LENGTHS } from "../constants/brand";
import { s } from "../styles/shared";
import EmptyState from "../components/EmptyState";
import { SkeletonList } from "../components/SkeletonCard";
import FilterDrawer from "../components/FilterDrawer";
import FilterOptions from "../components/FilterOptions";
import { useDataFreshness } from "../hooks/useDataFreshness";
import useIsDesktop from "../hooks/useIsDesktop";
import { supabase } from "../lib/supabase";
// Lazy-loaded for performance — 8.6MB JSON loaded async instead of blocking initial bundle
let _cachedPrograms = null;
const loadPrograms = () => {
  if (_cachedPrograms) return Promise.resolve(_cachedPrograms);
  return import("../data/programs.json").then((m) => {
    _cachedPrograms = m.default;
    return _cachedPrograms;
  });
};
import {
  REGISTRATION_STATUSES,
  getRegistrationStatus,
  isMunicipalProvider,
  sortPrograms,
  fmtDate,
  PAGE_SIZE,
  calcCostPerHour,
} from "../utils/helpers";
import { trackEvent } from "../utils/analytics";
import { computeEligibility, getEligibilityLabel } from "../utils/ageEligibility";

/* ─── City → Neighbourhood groupings ─── */
const CITY_NEIGHBOURHOODS = [
  {
    city: "Vancouver",
    neighbourhoods: [
      "Arbutus Ridge", "Cambie", "Chinatown", "Coal Harbour", "Commercial Drive",
      "Downtown", "Dunbar", "Dunbar-Southlands", "East Vancouver", "Fairview",
      "Fraserview", "Grandview-Woodland", "Granville Island", "Hastings Park",
      "Hastings-Sunrise", "Kensington-Cedar Cottage", "Kerrisdale", "Killarney",
      "Kitsilano", "Main Street", "Marpole", "Mount Pleasant", "Oakridge",
      "Point Grey", "Renfrew-Collingwood", "Riley Park", "Shaughnessy",
      "South Cambie", "South Vancouver", "Stanley Park", "Strathcona", "Sunset",
      "UBC", "University Endowment Lands", "Victoria-Fraserview",
      "West End", "West Point Grey", "Yaletown",
    ],
  },
  {
    city: "Burnaby",
    neighbourhoods: [
      "Burnaby Heights", "Burnaby Mountain", "Capitol Hill", "Cariboo",
      "Central Park", "Deer Lake", "Edmonds", "Metrotown", "North Burnaby",
      "SFU / UniverCity", "South Slope", "Sperling-Duthie",
    ],
  },
  {
    city: "North Vancouver",
    neighbourhoods: [
      "Central Lonsdale", "Deep Cove", "Delbrook", "Dollarton", "Heights",
      "Lower Capilano", "Lower Lonsdale", "Lynn Creek", "Lynn Valley",
      "Maplewood", "Mount Seymour", "Seymour", "Upper Lonsdale",
    ],
  },
  {
    city: "West Vancouver",
    neighbourhoods: ["Ambleside", "British Properties", "Gleneagles", "West Vancouver"],
  },
  {
    city: "Richmond",
    neighbourhoods: [
      "Aberdeen", "Bridgeport", "Broadmoor", "City Centre", "East Cambie",
      "East Richmond", "Ironwood", "Sea Island", "South Arm", "Steveston",
      "Thompson",
    ],
  },
  {
    city: "New Westminster",
    neighbourhoods: [
      "Downtown New West", "Downtown New Westminster", "Moody Park",
      "Queens Park", "Queensborough",
    ],
  },
  {
    city: "Surrey",
    neighbourhoods: [
      "Cloverdale", "Fleetwood", "Green Timbers", "Guildford", "Newton",
      "Panorama", "South Surrey", "Surrey City Centre", "Whalley",
    ],
  },
  {
    city: "Coquitlam",
    neighbourhoods: ["Burquitlam", "Central Coquitlam", "Maillardville"],
  },
  { city: "Port Coquitlam", neighbourhoods: ["Central Port Coquitlam", "Port Coquitlam"] },
  { city: "Port Moody", neighbourhoods: ["Ioco", "Port Moody"] },
  { city: "Maple Ridge", neighbourhoods: ["Maple Ridge", "Town Centre"] },
  { city: "Pitt Meadows", neighbourhoods: ["Central Pitt Meadows"] },
  { city: "Delta", neighbourhoods: ["Delta", "North Delta"] },
  { city: "White Rock", neighbourhoods: ["White Rock"] },
  { city: "Squamish", neighbourhoods: ["Squamish"] },
  { city: "Whistler", neighbourhoods: ["Whistler"] },
  { city: "Bowen Island", neighbourhoods: ["Bowen Island"] },
  { city: "Sunshine Coast", neighbourhoods: ["Sunshine Coast"] },
  { city: "Langley", neighbourhoods: ["Langley"] },
  { city: "Abbotsford", neighbourhoods: ["Abbotsford"] },
  { city: "Mission", neighbourhoods: ["Mission"] },
  { city: "Hope", neighbourhoods: ["Hope"] },
  { city: "Okanagan", neighbourhoods: ["Okanagan"] },
];

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
};

/* ────────────────────────────────────────────────────────────
   SUMMER WEEKS — simple static list for 2026
   ──────────────────────────────────────────────────────────── */

const SUMMER_WEEKS = [
  { id: "w1", weekNum: 1, label: "Week 1", dateRange: "Jun 29 – Jul 3", monday: new Date(2026, 5, 29), friday: new Date(2026, 6, 3), statHolidays: [2], note: "Canada Day Jul 1" },
  { id: "w2", weekNum: 2, label: "Week 2", dateRange: "Jul 6 – Jul 10", monday: new Date(2026, 6, 6), friday: new Date(2026, 6, 10), statHolidays: [] },
  { id: "w3", weekNum: 3, label: "Week 3", dateRange: "Jul 13 – Jul 17", monday: new Date(2026, 6, 13), friday: new Date(2026, 6, 17), statHolidays: [] },
  { id: "w4", weekNum: 4, label: "Week 4", dateRange: "Jul 20 – Jul 24", monday: new Date(2026, 6, 20), friday: new Date(2026, 6, 24), statHolidays: [] },
  { id: "w5", weekNum: 5, label: "Week 5", dateRange: "Jul 27 – Jul 31", monday: new Date(2026, 6, 27), friday: new Date(2026, 6, 31), statHolidays: [] },
  { id: "w6", weekNum: 6, label: "Week 6", dateRange: "Aug 4 – Aug 8", monday: new Date(2026, 7, 4), friday: new Date(2026, 7, 8), statHolidays: [0], note: "BC Day Aug 4" },
  { id: "w7", weekNum: 7, label: "Week 7", dateRange: "Aug 10 – Aug 14", monday: new Date(2026, 7, 10), friday: new Date(2026, 7, 14), statHolidays: [] },
  { id: "w8", weekNum: 8, label: "Week 8", dateRange: "Aug 17 – Aug 21", monday: new Date(2026, 7, 17), friday: new Date(2026, 7, 21), statHolidays: [] },
  { id: "w9", weekNum: 9, label: "Week 9", dateRange: "Aug 24 – Aug 28", monday: new Date(2026, 7, 24), friday: new Date(2026, 7, 28), statHolidays: [] },
  { id: "w10", weekNum: 10, label: "Week 10", dateRange: "Aug 31 – Sep 4", monday: new Date(2026, 7, 31), friday: new Date(2026, 8, 4), statHolidays: [], note: "Last week before school" },
];

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
function getWeekScheduleLabel(program, weekDays, weekMonday) {
  if (weekDays.length === 0) return "";
  // Show date range instead of day names (e.g., "Jun 29 – Jul 3" instead of "Mon–Fri")
  if (weekMonday && weekDays.length > 0) {
    const firstDay = new Date(weekMonday);
    firstDay.setDate(weekMonday.getDate() + weekDays[0]);
    const lastDay = new Date(weekMonday);
    lastDay.setDate(weekMonday.getDate() + weekDays[weekDays.length - 1]);
    let dateLabel;
    if (firstDay.getMonth() === lastDay.getMonth()) {
      dateLabel = `${MONTH_ABBR[firstDay.getMonth()]} ${firstDay.getDate()} – ${lastDay.getDate()}, ${firstDay.getFullYear()}`;
    } else {
      dateLabel = `${MONTH_ABBR[firstDay.getMonth()]} ${firstDay.getDate()} – ${MONTH_ABBR[lastDay.getMonth()]} ${lastDay.getDate()}, ${lastDay.getFullYear()}`;
    }
    const timeStr = program.startTime && program.endTime
      ? ` · ${program.startTime}–${program.endTime}`
      : "";
    return dateLabel + timeStr;
  }
  // Fallback — use program's own date range instead of day names
  if (program.startDate) {
    const sd = new Date(program.startDate + "T00:00:00");
    const ed = program.endDate ? new Date(program.endDate + "T00:00:00") : sd;
    let dateLabel;
    if (program.startDate === program.endDate || !program.endDate) {
      dateLabel = `${MONTH_ABBR[sd.getMonth()]} ${sd.getDate()}, ${sd.getFullYear()}`;
    } else if (sd.getMonth() === ed.getMonth()) {
      dateLabel = `${MONTH_ABBR[sd.getMonth()]} ${sd.getDate()} – ${ed.getDate()}, ${sd.getFullYear()}`;
    } else {
      dateLabel = `${MONTH_ABBR[sd.getMonth()]} ${sd.getDate()} – ${MONTH_ABBR[ed.getMonth()]} ${ed.getDate()}, ${ed.getFullYear()}`;
    }
    const timeStr = program.startTime && program.endTime
      ? ` · ${program.startTime}–${program.endTime}`
      : "";
    return dateLabel + timeStr;
  }
  // Last resort — times only
  const timeStr = program.startTime && program.endTime
    ? `${program.startTime}–${program.endTime}`
    : "";
  return timeStr;
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
      {locked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
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


/* ─── WeekCoverageRow — M T W Th F coverage bar (appears when week filter active) ─── */
function WeekCoverageRow({ selectedWeeks, programs, isDesktop }) {
  // Compute coverage across all selected weeks
  // For each selected week, check which days the user has enrolled/exploring programs
  const weekObjs = selectedWeeks.map((wId) => SUMMER_WEEKS.find((w) => w.id === wId)).filter(Boolean);
  if (weekObjs.length === 0) return null;

  // If multiple weeks selected, show coverage for the first one (simplification)
  const week = weekObjs[0];
  const coverage = [false, false, false, false, false];
  (programs || []).forEach((up) => {
    const status = (up.status || "").toLowerCase();
    if (status !== "enrolled" && status !== "exploring") return;
    const days = getProgramWeekDays(up, week.monday);
    days.forEach((d) => { coverage[d] = true; });
  });

  return (
    <div style={{
      display: "flex", gap: 4, padding: isDesktop ? "0 0 12px" : "0 16px 12px",
    }}>
      {coverage.map((covered, i) => {
        const isHoliday = week.statHolidays.includes(i);
        let bg, color;
        if (isHoliday) {
          bg = "rgba(74,111,165,0.10)";
          color = C.blue;
        } else if (covered) {
          bg = "rgba(45,159,111,0.12)";
          color = C.seaGreen;
        } else {
          bg = "rgba(231,111,81,0.10)";
          color = C.olive;
        }
        return (
          <div key={i} style={{
            flex: 1, maxWidth: isDesktop ? 120 : undefined,
            height: 36, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: bg,
            fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600,
            color,
          }}>
            {DAY_LABELS[i]}
            {isHoliday && <span style={{ fontSize: 11, marginLeft: 3 }}>{"\u25CB"}</span>}
          </div>
        );
      })}
    </div>
  );
}



/* ─── Directory Card — program card ─── */
function DirectoryCard({ program, alreadyAdded, onTap, favorited, onToggleFavorite, regStatus, eligibility, weekScheduleLabel, accentOverride, friendActivity }) {
  const statusInfo = REGISTRATION_STATUSES.find((s) => s.key === regStatus) || REGISTRATION_STATUSES[0];
  const isApprox = program.priceVerified === false && typeof program.cost === "number" && program.cost > 0;
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
              fontSize: 11, fontWeight: 700,
              background: C.seaGreen + "18", color: C.seaGreen,
              padding: "2px 8px", borderRadius: 6,
            }}>Added</span>
          )}
          <span style={{
            fontSize: 11, fontWeight: 700,
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
            fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600,
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

      {/* Circle social proof */}
      {friendActivity && friendActivity.length > 0 && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          marginTop: 6,
          background: "rgba(200, 127, 160, 0.12)",
          color: C.lilac,
          borderRadius: 8, padding: "3px 9px",
          fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600,
        }}>
          <span style={{ fontSize: 13 }}>👥</span>
          {friendActivity.length === 1
            ? `${friendActivity[0].sharedByName} saved this`
            : `${friendActivity.length} friends saved this`}
        </div>
      )}

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
              {program.neighbourhood}
            </span>
          )}
          {program.dayLength && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, background: C.seaGreen + "18", color: C.seaGreen, padding: "2px 8px", borderRadius: 10 }}>
              {program.dayLength}
            </span>
          )}
          {(program.beforeCare?.available || program.afterCare?.available) && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, background: C.blue + "14", color: C.blue, padding: "2px 8px", borderRadius: 10 }}>
              {program.beforeCare?.available && program.afterCare?.available ? "Before + After Care" : program.beforeCare?.available ? "Before Care" : "After Care"}
            </span>
          )}
          {program.earlyBirdCost != null && program.earlyBirdDeadline && new Date(program.earlyBirdDeadline) >= new Date() && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, background: C.olive + "18", color: C.olive, padding: "2px 8px", borderRadius: 10 }}>
              Early Bird until {new Date(program.earlyBirdDeadline + "T00:00:00").toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
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
          {(() => {
            const fmtPrice = (n) => Number(n) % 1 === 0 ? Number(n).toLocaleString() : Number(n).toFixed(2);
            if (program.earlyBirdCost != null && program.earlyBirdDeadline && new Date(program.earlyBirdDeadline) >= new Date())
              return <><span>${fmtPrice(program.earlyBirdCost)}</span><span style={{ fontSize: 11, color: C.muted, textDecoration: "line-through", marginLeft: 4 }}>${fmtPrice(program.cost)}</span></>;
            if (program.cost === "TBD") return "TBD";
            if (program.cost === null || program.cost === undefined) return "Inquire for pricing";
            if (program.cost === 0) return "Free";
            return (isApprox ? "~$" : "$") + fmtPrice(program.cost) + (program.costPer === "week" ? "/wk" : "");
          })()}

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
  circleSocialProof,
}) {
  const [fallbackPrograms, setFallbackPrograms] = useState([]);
  const [userSubmitted, setUserSubmitted] = useState([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);
  const isDesktop = useIsDesktop();

  const [filterToast, setFilterToast] = useState(null);
  const showFilterToast = (msg) => { setFilterToast(msg); setTimeout(() => setFilterToast(null), 2500); };

  /* Load programs.json lazily */
  useEffect(() => {
    loadPrograms().then((data) => {
      setFallbackPrograms(data);
      setIsLoadingPrograms(false);
    });
  }, []);

  /* Load user-submitted programs from Supabase */
  useEffect(() => {
    async function loadUserSubmitted() {
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
    }
    loadUserSubmitted();
  }, []);

  const allDirectoryPrograms = useMemo(() => {
    if (userSubmitted.length === 0) return fallbackPrograms;
    const existing = new Set(fallbackPrograms.map((p) => `${p.name}|||${p.provider}`.toLowerCase()));
    const newOnes = userSubmitted.filter((p) => !existing.has(`${p.name}|||${p.provider}`.toLowerCase()));
    return [...fallbackPrograms, ...newOnes];
  }, [userSubmitted, fallbackPrograms]);

  const searchTrackRef = useRef(null);
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState(new Set());
  const [selectedHoods, setSelectedHoods] = useState(new Set());
  const [expandedCities, setExpandedCities] = useState(new Set());
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [selectedCosts, setSelectedCosts] = useState(new Set());
  const [costFilterMode, setCostFilterMode] = useState("total"); // "total" | "perHour"
  const [selectedCostPerHour, setSelectedCostPerHour] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedRegStatuses, setSelectedRegStatuses] = useState(new Set(["open", "coming-soon", "upcoming", "likely-coming-soon"]));
  const [selectedProviders, setSelectedProviders] = useState(new Set());
  const [providerSearch, setProviderSearch] = useState("");
  const [selectedActivityTypes, setSelectedActivityTypes] = useState(new Set());
  const [selectedDayLengths, setSelectedDayLengths] = useState(new Set());
  const [durationMin, setDurationMin] = useState(0);
  const [durationMax, setDurationMax] = useState(10);
  const [showBorderline, setShowBorderline] = useState(false);

  /* Week filter state — NO week selected by default */
  const [selectedWeeks, setSelectedWeeks] = useState(new Set());

  const { dataVersion, lastCheckedLabel, isStale, isChecking, checkForUpdates } = useDataFreshness();

  /* User's enrolled programs */
  const userPrograms = programs || [];

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
    setSelectedCostPerHour(new Set());
    setCostFilterMode("total");
    setShowFavoritesOnly(false);
    setSortBy("relevance");
    setSelectedRegStatuses(new Set(["open", "coming-soon", "upcoming", "likely-coming-soon"]));
    setSelectedProviders(new Set());
    setSelectedActivityTypes(new Set());
    setSelectedDayLengths(new Set());
    setDurationMin(0);
    setDurationMax(10);
    setProviderSearch("");
    setSelectedWeeks(new Set());
    setVisibleCount(PAGE_SIZE);
  };

  const totalActiveFilters = useMemo(() => {
    let count = 0;
    if (selectedCats.size > 0) count++;
    if (ageMin || ageMax) count++;
    if (selectedCosts.size > 0 || selectedCostPerHour.size > 0) count++;
    if (selectedHoods.size > 0) count++;
    if (selectedRegStatuses.size > 0 && !(selectedRegStatuses.size === 4 && selectedRegStatuses.has("open") && selectedRegStatuses.has("coming-soon") && selectedRegStatuses.has("upcoming") && selectedRegStatuses.has("likely-coming-soon"))) count++;
    if (selectedDayLengths.size > 0) count++;
    if (durationMin > 0 || durationMax < 10) count++;
    if (selectedActivityTypes.size > 0) count++;
    if (selectedProviders.size > 0) count++;
    if (showFavoritesOnly) count++;
    if (sortBy !== "relevance") count++;
    if (search) count++;
    if (selectedWeeks.size > 0) count++;
    return count;
  }, [selectedCats, ageMin, ageMax, selectedCosts, selectedCostPerHour, selectedHoods, selectedRegStatuses, selectedDayLengths, selectedActivityTypes, selectedProviders, showFavoritesOnly, sortBy, search, selectedWeeks]);

  const addedNames = useMemo(() => {
    const set = new Set();
    (programs || []).forEach((p) => set.add(p.name?.toLowerCase()));
    return set;
  }, [programs]);

  const userProgramNames = useMemo(() => {
    const set = new Set();
    (programs || []).forEach((p) => {
      if (p.name) set.add(p.name.toLowerCase());
    });
    return set;
  }, [programs]);

  /* ─── Filtered programs ─── */
  const filteredPrograms = useMemo(() => {
    const q = search.toLowerCase().trim();
    const minAge = ageMin ? Number(ageMin) : null;
    const maxAge = ageMax ? Number(ageMax) : null;
    const costRanges = selectedCosts.size > 0
      ? [...selectedCosts].map((i) => COST_RANGES[i])
      : null;
    const cphRanges = selectedCostPerHour.size > 0
      ? [...selectedCostPerHour].map((i) => COST_PER_HOUR_RANGES[i])
      : null;

    return allDirectoryPrograms.filter((p) => {
      // Week filter
      if (selectedWeeks.size > 0) {
        const matchesAnyWeek = [...selectedWeeks].some((wId) => {
          const week = SUMMER_WEEKS.find((w) => w.id === wId);
          return week && programOverlapsWeek(p, week.monday, week.friday);
        });
        if (!matchesAnyWeek) return false;
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
        const cost = typeof p.cost === "number" ? p.cost : null;
        if (!costRanges.some((range) => {
          if (range.min === -1 && range.max === -1) return cost === null; // "Inquire for pricing" — matches null cost
          if (range.max === 0) return cost === 0; // "Free" filter — only matches cost === 0
          if (range.min === 0 && range.max === Infinity) return true;
          if (cost === null) return false; // null cost doesn't match price ranges
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
      if (selectedDayLengths.size > 0 && (!p.dayLength || !selectedDayLengths.has(p.dayLength))) return false;
      if (durationMin > 0 || durationMax < 10) {
        const dur = p.durationPerDay;
        if (dur == null) return durationMin === 0; // no duration data — show only if min is 0
        if (dur < durationMin || dur > durationMax) return false;
      }
      return true;
    });
  }, [allDirectoryPrograms, search, selectedCats, selectedHoods, ageMin, ageMax, selectedCosts, showFavoritesOnly, favorites, selectedRegStatuses, selectedProviders, selectedActivityTypes, selectedDayLengths, selectedWeeks, durationMin, durationMax]);

  /* ─── Sort ─── */
  const sortedPrograms = useMemo(() => {
    if (sortBy !== "relevance") {
      return sortPrograms(filteredPrograms, sortBy);
    }
    // Simple relevance: registration status urgency + favorites
    const statusOrder = { "open": 0, "coming-soon": 1, "upcoming": 2, "likely-coming-soon": 3, "full-waitlist": 4, "in-progress": 5, "completed": 6 };
    return [...filteredPrograms].sort((a, b) => {
      const aStatus = statusOrder[getRegistrationStatus(a)] ?? 6;
      const bStatus = statusOrder[getRegistrationStatus(b)] ?? 6;
      if (aStatus !== bStatus) return aStatus - bStatus;
      const aFav = favorites.includes(a.id) ? 1 : 0;
      const bFav = favorites.includes(b.id) ? 1 : 0;
      if (bFav !== aFav) return bFav - aFav;
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [filteredPrograms, sortBy, favorites]);

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
      const tierRank = { eligible: 2, borderline: 1, ineligible: 0 };
      sortedPrograms.forEach((p) => {
        const startDate = p.startDate || new Date().toISOString().split("T")[0];
        // Intersection logic: use the WORST tier — ALL kids must be eligible
        let worstTier = "eligible";
        const labels = [];
        for (const kid of kidsWithBirth) {
          const result = computeEligibility(kid.birthMonth, kid.birthYear, p.ageMin, p.ageMax, startDate);
          if (tierRank[result.eligibilityTier] < tierRank[worstTier]) {
            worstTier = result.eligibilityTier;
          }
          if (result.eligibilityTier === "borderline") {
            labels.push(getEligibilityLabel(kid.name, kid.birthMonth, kid.birthYear, p.ageMin, p.ageMax, startDate));
          } else if (result.eligibilityTier === "ineligible") {
            labels.push(`${kid.name} is outside age range`);
          }
        }
        const allEligible = worstTier === "eligible";
        map.set(p.id, {
          eligibilityTier: p.ageMin == null && p.ageMax == null ? null : worstTier,
          label: labels.join("; ") || (allEligible ? "All kids eligible" : ""),
        });
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

  /* programsByWeek removed — default view now shows flat filtered list */


  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */

  return (
    <div style={{ maxWidth: isDesktop ? 1400 : undefined, margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <div style={{ padding: isDesktop ? "24px 32px 0" : "0 0 0", marginBottom: 5 }}>
        <h2 style={s.pageTitle}>Search</h2>
        <p style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 16, color: C.muted,
          marginBottom: 16, marginTop: 0,
          padding: isDesktop ? 0 : undefined,
        }}>
          {isLoadingPrograms
            ? "Loading programs..."
            : `Browse ${eligibilityFiltered.length.toLocaleString()} programs`}
        </p>
      </div>

      {/* Search bar */}
      <div style={{ padding: isDesktop ? "0 32px" : "0 16px 0 13px", marginBottom: 8 }}>
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

      {/* Week coverage row — only when week filter active */}
      {selectedWeeks.size > 0 && (
        <div style={{ padding: isDesktop ? "0 32px" : undefined }}>
          <WeekCoverageRow
            selectedWeeks={[...selectedWeeks]}
            programs={userPrograms}
            isDesktop={isDesktop}
          />
        </div>
      )}

      {/* Show borderline toggle — visible for single kid OR all-kids when kids have birth info */}
      {((selectedKid && selectedKid.birthMonth && selectedKid.birthYear) || (isAllKids && kidsWithBirth.length > 0)) && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8, margin: isDesktop ? "0 32px 12px" : "0 16px 12px 13px",
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
            Filtering for {isAllKids ? "all kids" : selectedKid.name}
          </span>
        </div>
      )}

      {/* Filter chips */}
      <div style={{
        padding: isDesktop ? "4px 32px 0" : "4px 16px 0 13px",
        overflowX: "auto", display: "flex", gap: 6, alignItems: "center",
        scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch",
        ...(isDesktop ? {
          position: "sticky", top: 0, zIndex: 10,
          background: C.cream, borderBottom: `1px solid rgba(27,36,50,0.06)`,
          padding: "8px 32px", flexWrap: "wrap",
        } : {}),
      }}>
        <FilterChip label={`♡ ${favorites.length}`} active={showFavoritesOnly} onClick={() => { setShowFavoritesOnly(!showFavoritesOnly); setVisibleCount(PAGE_SIZE); }} />
        <FilterChip label="Week" count={selectedWeeks.size} active={selectedWeeks.size > 0} onClick={() => setActiveDrawer("week")} />
        <FilterChip label="Category" count={selectedCats.size + selectedActivityTypes.size} active={selectedCats.size > 0 || selectedActivityTypes.size > 0} onClick={() => setActiveDrawer("category")} />
        {kids && kids.length > 0 && (
          <FilterChip label="Eligible for" count={kidFilter ? 1 : 0} active={!!kidFilter} onClick={() => setActiveDrawer("eligible")} />
        )}
        <FilterChip label="Cost" count={selectedCosts.size + selectedCostPerHour.size} active={selectedCosts.size > 0 || selectedCostPerHour.size > 0} onClick={() => setActiveDrawer("cost")} />
        <FilterChip label="Provider" count={selectedProviders.size} active={selectedProviders.size > 0} onClick={() => setActiveDrawer("provider")} />
        <FilterChip label="Area" count={selectedHoods.size} active={selectedHoods.size > 0} onClick={() => setActiveDrawer("neighbourhood")} />
        <FilterChip label="Duration" count={durationMin > 0 || durationMax < 10 ? 1 : 0} active={durationMin > 0 || durationMax < 10} onClick={() => setActiveDrawer("duration")} />
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
        <div style={{ padding: isDesktop ? "6px 32px 0" : "6px 16px 0 13px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, color: C.muted, fontFamily: "'Barlow', sans-serif" }}>
            {totalActiveFilters} filter{totalActiveFilters !== 1 ? "s" : ""} · {eligibilityFiltered.length} results
          </span>
        </div>
      )}

      {/* ─── CONTENT AREA ─── */}
      {(
        /* All programs view — flat paginated grid/list, respects all filters */
        <>
          {/* Results count */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            margin: isDesktop ? "8px 32px" : "8px 16px 8px 13px",
          }}>
            <span style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: C.muted,
            }}>
              {eligibilityFiltered.length.toLocaleString()} program{eligibilityFiltered.length !== 1 ? "s" : ""}
              {selectedWeeks.size > 0 && ` in ${selectedWeeks.size} week${selectedWeeks.size !== 1 ? "s" : ""}`}
            </span>
          </div>

          {/* Program list/grid */}
          <div style={{ padding: isDesktop ? "0 32px" : "0 16px 0 13px" }}>
            {isLoadingPrograms && <SkeletonList count={6} />}
            {!isLoadingPrograms && eligibilityFiltered.length === 0 && (
              <>
                <EmptyState
                  icon={"\uD83D\uDD0D"}
                  message="No programs found. Try adjusting your filters."
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
              <div className="discover-results" style={isDesktop ? {
                display: "grid",
                gridTemplateColumns: eligibilityFiltered.length >= 9 ? "repeat(4, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))",
                gap: 12,
              } : {}}>
                {visiblePrograms.map((p) => {
                  // If week filter is active, show week-specific schedule
                  let weekLabel = "";
                  if (selectedWeeks.size > 0) {
                    const firstWeekId = [...selectedWeeks][0];
                    const firstWeek = SUMMER_WEEKS.find((w) => w.id === firstWeekId);
                    if (firstWeek) {
                      const weekDays = getProgramWeekDays(p, firstWeek.monday);
                      weekLabel = getWeekScheduleLabel(p, weekDays, firstWeek.monday);
                    }
                  }
                  const socialKey = `${(p.name || "").toLowerCase()}|||${(p.provider || "").toLowerCase()}`;
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
                      friendActivity={circleSocialProof ? circleSocialProof[socialKey] : null}
                    />
                  );
                })}
              </div>
            )}

            {/* Load more / See all */}
            {hasMore && (() => {
              const weekFilterActive = selectedWeeks.size > 0;
              const firstWeekObj = weekFilterActive
                ? SUMMER_WEEKS.find((w) => w.id === [...selectedWeeks][0])
                : null;
              const remaining = eligibilityFiltered.length - visibleCount;
              const buttonLabel = weekFilterActive && firstWeekObj
                ? `See all ${eligibilityFiltered.length} programs in ${firstWeekObj.label}`
                : `Load more (${remaining} remaining)`;
              return (
                <button
                  onClick={() => {
                    if (weekFilterActive) {
                      // Show ALL programs for the selected week(s)
                      setVisibleCount(eligibilityFiltered.length);
                    } else {
                      setVisibleCount((v) => v + PAGE_SIZE);
                    }
                  }}
                  aria-label={`Load more programs, ${remaining} remaining`}
                  style={{
                    width: "100%",
                    fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700,
                    color: C.seaGreen, background: C.white,
                    border: `1.5px solid ${C.seaGreen}`, borderRadius: 12,
                    padding: "12px 16px", cursor: "pointer",
                    marginTop: 8, marginBottom: 8, transition: "all 0.15s",
                  }}
                >
                  {buttonLabel}
                </button>
              );
            })()}
          </div>
        </>
      )}

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
                      fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: isSelected ? 600 : 400,
                      color: C.ink,
                    }}>
                      {week.label}: {week.dateRange}
                    </div>
                    {week.note && (
                      <div style={{
                        fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.blue, marginTop: 2,
                      }}>
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
                  fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: sortBy === opt.key ? 600 : 400,
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
                    }}>{isCatSelected ? "\u2713" : ""}</span>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: isCatSelected ? 600 : 400, color: C.ink, flex: 1 }}>
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
          onClear={() => { setSelectedCosts(new Set()); setSelectedCostPerHour(new Set()); setCostFilterMode("total"); setVisibleCount(PAGE_SIZE); }} onApply={() => setActiveDrawer(null)}>
          {/* Toggle: Total / Per Hour */}
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
                fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer",
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
                    <span style={{ flex: 1, fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: C.ink }}>
                      {cityObj.city}
                      {someInCitySelected && <span style={{ color: C.muted, fontWeight: 400 }}> ({selectedInCity}/{cityObj.neighbourhoods.length})</span>}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); toggleCity(cityObj); }}
                      aria-label={allInCitySelected ? `Deselect all ${cityObj.city}` : `Select all ${cityObj.city}`}
                      style={{
                        fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
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
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: C.ink, fontWeight: 700, textAlign: "center", marginBottom: 16 }}>
              {durationMin === 0 && durationMax === 10 ? "Any duration" : `${durationMin}h – ${durationMax}h per day`}
            </div>
            <div style={{ padding: "0 4px" }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginBottom: 6 }}>Minimum: {durationMin}h</div>
              <input type="range" min="0" max="10" step="0.5" value={durationMin}
                onChange={(e) => { const v = parseFloat(e.target.value); setDurationMin(Math.min(v, durationMax)); setVisibleCount(PAGE_SIZE); }}
                style={{ width: "100%", accentColor: C.seaGreen }} />
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginBottom: 6, marginTop: 14 }}>Maximum: {durationMax}h</div>
              <input type="range" min="0" max="10" step="0.5" value={durationMax}
                onChange={(e) => { const v = parseFloat(e.target.value); setDurationMax(Math.max(v, durationMin)); setVisibleCount(PAGE_SIZE); }}
                style={{ width: "100%", accentColor: C.seaGreen }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Barlow', sans-serif", fontSize: 12, color: C.muted, marginTop: 4, padding: "0 2px" }}>
              <span>0h</span><span>2h</span><span>4h</span><span>6h</span><span>8h</span><span>10h</span>
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginTop: 16, lineHeight: 1.5 }}>
              Duration includes before-care and after-care hours when available. Programs without time data are shown when minimum is 0.
            </div>
          </div>
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
            <div style={{ maxHeight: 400, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
              {allProviders
                .filter((prov) => prov.toLowerCase().includes(providerSearch.toLowerCase().trim()))
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
                      }}>{isSelected ? "\u2713" : ""}</span>
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
              }}>{!kidFilter ? "\u2713" : ""}</span>
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
                }}>{kidFilter === "all-kids" ? "\u2713" : ""}</span>
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
                  }}>{isActive ? "\u2713" : ""}</span>
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
