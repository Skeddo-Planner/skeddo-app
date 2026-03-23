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
  { key: "coming-soon", label: "Coming Soon", color: C.blue, icon: "◷" },
  { key: "upcoming", label: "Upcoming", color: "#6B8FA3", icon: "◷" },
  { key: "likely-coming-soon", label: "Likely Coming Soon", color: "#B8860B", icon: "◷" },
  { key: "full", label: "Full / Waitlist", color: C.olive, icon: "●" },
  { key: "in-progress", label: "In Progress", color: C.lilac, icon: "▶" },
  { key: "completed", label: "Completed", color: C.muted, icon: "✗" },
];

/**
 * Compute registration status dynamically based on dates and enrollment data.
 *
 * Priority:
 * 1. Completed: camp end date has passed
 * 2. In Progress: camp start date has passed but end date hasn't
 * 3. Full/Waitlist: explicit enrollment status from provider
 * 4. Open: registration date has passed AND not marked full
 * 5. Coming Soon: registration date is confirmed and within 30 days
 * 6. Upcoming: registration date is confirmed but more than 30 days away
 * 7. Likely Coming Soon: no confirmed registration date, estimated data only
 * 8. Open (fallback): enrollment status says "Open"
 */
export function getRegistrationStatus(program) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const MS_PER_DAY = 86400000;

  const campStart = program.startDate ? new Date(program.startDate + "T00:00:00") : null;
  const campEnd = program.endDate ? new Date(program.endDate + "T00:00:00") : null;
  const regDate = program.registrationDate ? new Date(program.registrationDate + "T00:00:00") : null;

  // 1. Completed: camp end date has passed
  if (campEnd && campEnd < today) return "completed";

  // 2. In Progress: camp has started but not ended, not accepting new applicants
  if (campStart && campStart <= today && (!campEnd || campEnd >= today)) return "in-progress";

  // 3. Full/Waitlist: explicit status from provider
  const es = (program.enrollmentStatus || "").toLowerCase();
  if (es === "full" || es === "full/waitlist" || es === "waitlist") return "full";

  // 4. Open: registration date has passed (registration is live)
  if (regDate && regDate <= today) {
    return "open";
  }

  // 5. Open: explicit "Open" status from provider (no regDate but confirmed open)
  if (es === "open") return "open";

  // 6. Coming Soon: registration date confirmed and within 30 days
  if (regDate) {
    const daysUntilReg = Math.ceil((regDate - today) / MS_PER_DAY);
    if (daysUntilReg <= 30) return "coming-soon";
    // 7. Upcoming: registration date confirmed but more than 30 days away
    return "upcoming";
  }

  // 8. Likely Coming Soon: no confirmed registration date, estimated data
  if (program.confirmed2026 === false || es === "likely coming soon" || es === "tbd") {
    return "likely-coming-soon";
  }

  // 9. Coming Soon: provider said "Coming Soon" but no specific date
  if (es === "coming soon") return "coming-soon";

  // 10. Fallback: if we have a future camp start but no registration info
  if (campStart && campStart > today) return "likely-coming-soon";

  return "open";
}

/* ─── Verified pricing provider detection ─── */
/* Municipal providers have verified pricing from public portals.
   Other providers with verified pricing (confirmed from registration pages) are also listed. */
export const VERIFIED_PROVIDERS = [
  "City of Vancouver", "City of Burnaby", "NVRC", "North Vancouver Recreation",
  "City of Richmond", "Richmond Olympic", "District of West Vancouver", "City of New Westminster",
  "Arts Umbrella", "PAL Ropes Course", "Extra Steps", "Flicka Gymnastics",
  "Stanley Park Ecology Society", "UBC Recreation", "BrainSTEM Learning",
  "STEMA Learning", "Harbour Dance Centre", "VSO School of Music",
  "VanDusen Botanical Garden", "Jump Gymnastics", "Code Ninjas",
  "YMCA of Greater Vancouver", "Mount Seymour", "School of Rock",
  "MacSailing", "Vancouver Circus School", "Zebra Robotics",
  "Ava Music & Art Centre", "Dynamo Fencing", "Vancouver Art Gallery",
  "SFU Summer Camps", "Pedalheads", "JCC of Greater Vancouver",
  "Science AL!VE", "Bard on the Beach",
  "Exceleration", "Soaring Eagle",
];

// Keep old name as alias for backward compatibility
export const MUNICIPAL_PREFIXES = VERIFIED_PROVIDERS;

export function isMunicipalProvider(providerName) {
  return VERIFIED_PROVIDERS.some((m) => (providerName || "").includes(m));
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

/**
 * Export ALL programs as a single ICS file (batch export).
 */
export function downloadAllICS(programs) {
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  function parseTime(timeStr) {
    if (!timeStr) return null;
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return null;
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const ampm = match[3]?.toUpperCase();
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return { h, m };
  }

  const events = programs.map((p) => {
    const startDate = p.startDate || "";
    const endDate = p.endDate || startDate;
    if (!startDate) return "";

    const times = (p.times || "").split(/[–\-]/);
    const startTime = parseTime(times[0]?.trim());
    const endTime = parseTime(times[1]?.trim());

    const desc = [p.provider, p.category, p.days, p.times, p.registrationUrl].filter(Boolean).join("\\n");
    const loc = p.location || p.neighbourhood || "";
    const uid = `skeddo-${p.id}@skeddo.ca`;

    if (startTime && endTime) {
      const dtStart = `DTSTART;TZID=America/Vancouver:${startDate.replace(/-/g, "")}T${String(startTime.h).padStart(2, "0")}${String(startTime.m).padStart(2, "0")}00`;
      const dtEnd = `DTEND;TZID=America/Vancouver:${endDate.replace(/-/g, "")}T${String(endTime.h).padStart(2, "0")}${String(endTime.m).padStart(2, "0")}00`;
      return `BEGIN:VEVENT\r\n${dtStart}\r\n${dtEnd}\r\nSUMMARY:${p.name}\r\nDESCRIPTION:${desc}\r\nLOCATION:${loc}\r\nUID:${uid}\r\nDTSTAMP:${stamp}\r\nEND:VEVENT`;
    }
    // All-day event
    const dtStart = `DTSTART;VALUE=DATE:${startDate.replace(/-/g, "")}`;
    const nextDay = new Date(endDate + "T00:00:00");
    nextDay.setDate(nextDay.getDate() + 1);
    const dtEnd = `DTEND;VALUE=DATE:${nextDay.toISOString().slice(0, 10).replace(/-/g, "")}`;
    return `BEGIN:VEVENT\r\n${dtStart}\r\n${dtEnd}\r\nSUMMARY:${p.name}\r\nDESCRIPTION:${desc}\r\nLOCATION:${loc}\r\nUID:${uid}\r\nDTSTAMP:${stamp}\r\nEND:VEVENT`;
  }).filter(Boolean);

  if (events.length === 0) return;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Skeddo//skeddo.ca//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Skeddo Schedule",
    "X-WR-TIMEZONE:America/Vancouver",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "skeddo-schedule.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Detect schedule conflicts — programs with overlapping times AND date ranges
 * on the same weekday. Returns one conflict per unique program pair (not per day).
 */
export function detectConflicts(programs) {
  const seen = new Set(); // track unique program pairs
  const conflicts = [];

  function parseTimeDec(timeStr) {
    if (!timeStr) return null;
    const m = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!m) return null;
    let h = parseInt(m[1]);
    const min = parseInt(m[2]);
    const ap = m[3]?.toUpperCase();
    if (ap === "PM" && h < 12) h += 12;
    if (ap === "AM" && h === 12) h = 0;
    return h + min / 60;
  }

  // Pre-process: parse times and date ranges
  const parsed = programs.map((p) => {
    if (!p.times || !p.days || !p.startDate) return null;
    const parts = (p.times || "").split(/[–\-]/);
    const startDec = parseTimeDec(parts[0]);
    const endDec = parseTimeDec(parts[1]);
    if (startDec == null || endDec == null) return null;
    const weekdays = parseDayRange(p.days);
    const dateStart = new Date(p.startDate + "T00:00:00");
    const dateEnd = p.endDate ? new Date(p.endDate + "T00:00:00") : dateStart;
    return { ...p, startDec, endDec, weekdays, dateStart, dateEnd };
  }).filter(Boolean);

  // Compare each pair of programs
  for (let i = 0; i < parsed.length; i++) {
    for (let j = i + 1; j < parsed.length; j++) {
      const a = parsed[i];
      const b = parsed[j];

      // Skip if date ranges don't overlap
      if (a.dateEnd < b.dateStart || b.dateEnd < a.dateStart) continue;

      // Skip if no shared weekdays
      const sharedDays = a.weekdays.filter((d) => b.weekdays.includes(d));
      if (sharedDays.length === 0) continue;

      // Skip if times don't overlap
      if (a.startDec >= b.endDec || b.startDec >= a.endDec) continue;

      // Deduplicate by program pair
      const pairKey = [a.id, b.id].sort().join("|");
      if (seen.has(pairKey)) continue;
      seen.add(pairKey);

      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayList = sharedDays.map((d) => dayNames[d]).join(", ");

      // Compute actual overlapping dates for this conflict pair
      const overlapStart = a.dateStart > b.dateStart ? a.dateStart : b.dateStart;
      const overlapEnd = a.dateEnd < b.dateEnd ? a.dateEnd : b.dateEnd;
      const conflictDates = [];
      const cur = new Date(overlapStart);
      while (cur <= overlapEnd) {
        if (sharedDays.includes(cur.getDay())) {
          conflictDates.push(new Date(cur));
        }
        cur.setDate(cur.getDate() + 1);
      }

      // Check if the same kid is assigned to both (true conflict vs logistics)
      const aKids = a.kidIds || [];
      const bKids = b.kidIds || [];
      const sharedKids = aKids.filter((k) => bKids.includes(k));
      const isSameKid = sharedKids.length > 0 || (aKids.length === 0 && bKids.length === 0);

      conflicts.push({
        day: dayList,
        program1: a.name,
        program2: b.name,
        time1: a.times,
        time2: b.times,
        type: isSameKid ? "conflict" : "logistics",
        dates: conflictDates,
      });
    }
  }

  return conflicts;
}

/* ─── Cost-Per-Hour Calculation ─── */

/** Parse "Mon-Fri" or "Mon, Wed, Fri" into JS weekday numbers (0=Sun, 1=Mon, ...) */
export function parseDayRange(days) {
  if (!days) return [];
  const dayMap = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
  const normalized = days.toLowerCase().replace(/\u2013/g, "-"); // en-dash to hyphen

  // Handle range like "Mon-Fri"
  const rangeMatch = normalized.match(/^(\w{3})\s*-\s*(\w{3})$/);
  if (rangeMatch) {
    const start = dayMap[rangeMatch[1]];
    const end = dayMap[rangeMatch[2]];
    if (start != null && end != null) {
      const result = [];
      for (let d = start; d <= end; d++) result.push(d);
      return result;
    }
  }

  // Handle comma-separated like "Mon, Wed, Fri"
  return normalized.split(/[,&]+/).map((d) => dayMap[d.trim().slice(0, 3)]).filter((d) => d != null);
}

/** Count sessions between startDate and endDate that fall on the given weekdays */
export function countSessions(startDate, endDate, days) {
  if (!startDate || !endDate || !days) return 0;
  const weekdays = parseDayRange(days);
  if (weekdays.length === 0) return 0;

  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  let count = 0;
  const d = new Date(start);
  while (d <= end) {
    if (weekdays.includes(d.getDay())) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

/** Parse time string like "9:00 AM" or "15:00" into decimal hours */
function parseTimeToHours(timeStr) {
  if (!timeStr) return null;
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return null;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const ampm = match[3]?.toUpperCase();
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h + m / 60;
}

/** Calculate cost per hour for a program */
export function calcCostPerHour(program) {
  const cost = Number(program.cost);
  if (!cost || cost <= 0) return null;

  const startH = parseTimeToHours(program.startTime || program.times?.split("–")[0]?.trim());
  const endH = parseTimeToHours(program.endTime || program.times?.split("–")[1]?.trim());
  if (startH == null || endH == null || endH <= startH) return null;

  const hoursPerSession = endH - startH;
  const sessions = countSessions(program.startDate, program.endDate, program.days);
  if (sessions === 0) return null;

  const totalHours = hoursPerSession * sessions;
  return totalHours > 0 ? cost / totalHours : null;
}

/** Get colour for cost-per-hour value */
export function costPerHourColor(cph) {
  // Use neutral grey tones — avoids conflicting with status colors (green/terracotta/blue)
  if (cph == null) return "#6B7280";
  if (cph < 10) return "#374151"; // Dark grey — great value
  if (cph <= 20) return "#6B7280"; // Mid grey — typical
  return "#9CA3AF"; // Light grey — premium
}

/* ─── App-wide constants ─── */
export const PAGE_SIZE = 50;
export const MAX_WIDTH = 480;
export const TIP_DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
export const SWIPE_THRESHOLD_PX = 60;
export const DEADLINE_ALERT_DAYS = 7;
