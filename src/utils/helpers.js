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

/* ─── App-wide constants ─── */
export const PAGE_SIZE = 50;
export const MAX_WIDTH = 480;
export const TIP_DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
export const SWIPE_THRESHOLD_PX = 60;
export const DEADLINE_ALERT_DAYS = 7;
