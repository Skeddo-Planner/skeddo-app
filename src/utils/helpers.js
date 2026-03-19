/* ─── SKEDDO SHARED HELPERS ───
   Extracted from various components to reduce duplication.
   Import from here instead of defining locally. */

import { C } from "../constants/brand";

/* ─── Currency formatter ─── */
export const fmt$ = (n) =>
  n === "TBD"
    ? "TBD"
    : Number(n || 0).toLocaleString("en-CA", {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

/* ─── Date formatters ─── */
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/** Format "2026-07-06" → "Jul 6, 2026" */
export function fmtDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d)) return dateStr;
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** Format "2026-07-06" → "Jul 6" (short, no year) */
export function fmtShortDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d)) return null;
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/* ─── Registration status logic ─── */
export const REGISTRATION_STATUSES = [
  { key: "open", label: "Open for Registration", color: C.seaGreen, icon: "✓" },
  { key: "opening-soon", label: "Opening Soon", color: C.blue, icon: "◷" },
  { key: "full", label: "Full / Waitlist", color: C.olive, icon: "●" },
  { key: "in-progress", label: "In Progress", color: C.lilac, icon: "▶" },
  { key: "completed", label: "Completed", color: C.muted, icon: "✗" },
];

export function getRegistrationStatus(program) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = program.startDate ? new Date(program.startDate + "T00:00:00") : null;
  const end = program.endDate ? new Date(program.endDate + "T00:00:00") : null;
  if (end && end < today) return "completed";
  if (start && start <= today) return "in-progress";
  if (program.enrollmentStatus === "Full") return "full";
  if (program.enrollmentStatus === "Coming Soon") return "opening-soon";
  return "open";
}

/* ─── Municipal provider detection ─── */
export const MUNICIPAL_PREFIXES = [
  "City of Vancouver", "City of Burnaby", "NVRC", "North Vancouver Recreation",
  "City of Richmond", "Richmond Olympic", "District of West Vancouver", "City of New Westminster",
];

export function isMunicipalProvider(providerName) {
  return MUNICIPAL_PREFIXES.some((m) => (providerName || "").includes(m));
}

/* ─── DB row transformer ─── */
export function dbRowToCamelCase(row) {
  return {
    id: row.id,
    name: row.name,
    provider: row.provider,
    category: row.category,
    campType: row.camp_type,
    scheduleType: row.schedule_type,
    ageMin: row.age_min,
    ageMax: row.age_max,
    startDate: row.start_date,
    endDate: row.end_date,
    days: row.days,
    startTime: row.start_time,
    endTime: row.end_time,
    cost: row.cost,
    indoorOutdoor: row.indoor_outdoor,
    neighbourhood: row.neighbourhood,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    enrollmentStatus: row.enrollment_status,
    registrationUrl: row.registration_url,
    description: row.description,
    tags: row.tags,
    activityType: row.activity_type,
  };
}

/* ─── Sort programs ─── */
export function sortPrograms(programs, sortKey) {
  if (sortKey === "relevance") return programs;
  const sorted = [...programs];
  switch (sortKey) {
    case "price-asc":
      sorted.sort((a, b) => {
        const ca = typeof a.cost === "number" ? a.cost : Infinity;
        const cb = typeof b.cost === "number" ? b.cost : Infinity;
        return ca - cb;
      });
      break;
    case "price-desc":
      sorted.sort((a, b) => {
        const ca = typeof a.cost === "number" ? a.cost : -1;
        const cb = typeof b.cost === "number" ? b.cost : -1;
        return cb - ca;
      });
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

/* ─── ICS Calendar Export ─── */
/**
 * Generate an ICS file and trigger download for a program.
 * Handles full-day events (date only) and timed events (with start/end time).
 */
export function downloadICS(program) {
  const p = program;
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  // Parse dates
  const startDate = p.startDate || "";
  const endDate = p.endDate || startDate;

  // Parse times (e.g. "9:00 AM", "3:30 PM", "09:00", "15:00")
  function parseTime(timeStr) {
    if (!timeStr) return null;
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return null;
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const ampm = (match[3] || "").toUpperCase();
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return { h, m };
  }

  // Extract start/end times from the "times" field (e.g. "9:00 AM - 3:00 PM")
  let startTime = null;
  let endTime = null;
  if (p.times) {
    const parts = p.times.split(/\s*[-–]\s*/);
    if (parts[0]) startTime = parseTime(parts[0].trim());
    if (parts[1]) endTime = parseTime(parts[1].trim());
  }
  // Also check startTime/endTime fields
  if (!startTime && p.startTime) startTime = parseTime(p.startTime);
  if (!endTime && p.endTime) endTime = parseTime(p.endTime);

  let dtStart, dtEnd;
  if (startTime && startDate) {
    // Timed event — use Pacific time via TZID
    const sd = startDate.replace(/-/g, "");
    const ed = (endDate || startDate).replace(/-/g, "");
    const sh = String(startTime.h).padStart(2, "0");
    const sm = String(startTime.m).padStart(2, "0");
    dtStart = `DTSTART;TZID=America/Vancouver:${sd}T${sh}${sm}00`;
    if (endTime) {
      const eh = String(endTime.h).padStart(2, "0");
      const em = String(endTime.m).padStart(2, "0");
      dtEnd = `DTEND;TZID=America/Vancouver:${ed}T${eh}${em}00`;
    } else {
      dtEnd = `DTEND;TZID=America/Vancouver:${sd}T${sh}${sm}00`;
    }
  } else if (startDate) {
    // All-day event
    const sd = startDate.replace(/-/g, "");
    const ed = endDate ? endDate.replace(/-/g, "") : sd;
    // ICS all-day DTEND is exclusive, so add one day
    const endD = new Date(endDate || startDate);
    endD.setDate(endD.getDate() + 1);
    const edPlus = endD.toISOString().slice(0, 10).replace(/-/g, "");
    dtStart = `DTSTART;VALUE=DATE:${sd}`;
    dtEnd = `DTEND;VALUE=DATE:${edPlus}`;
  } else {
    // No date info — can't create calendar event
    return;
  }

  const summary = p.name || "Skeddo Program";
  const location = p.address || p.location || p.neighbourhood || "";
  const description = [
    p.provider ? `Provider: ${p.provider}` : "",
    p.category ? `Category: ${p.category}` : "",
    p.days ? `Days: ${p.days}` : "",
    p.times ? `Times: ${p.times}` : "",
    p.registrationUrl ? `Register: ${p.registrationUrl}` : "",
  ].filter(Boolean).join("\\n");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Skeddo//skeddo.ca//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:skeddo-${p.id || Date.now()}@skeddo.ca`,
    `DTSTAMP:${stamp}`,
    dtStart,
    dtEnd,
    `SUMMARY:${summary}`,
    location ? `LOCATION:${location}` : "",
    description ? `DESCRIPTION:${description}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(p.name || "program").replace(/[^a-zA-Z0-9]/g, "-")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─── App-wide constants ─── */
export const PAGE_SIZE = 50;
export const MAX_WIDTH = 480;
export const TIP_DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
export const SWIPE_THRESHOLD_PX = 60;
export const DEADLINE_ALERT_DAYS = 7;
