import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { C, STATUS_MAP, KID_COLORS } from "../constants/brand";
import { s } from "../styles/shared";
import KidFilterBar from "../components/KidFilterBar";
import { downloadAllICS, detectConflicts } from "../utils/helpers";
import { trackEvent } from "../utils/analytics";
import useIsDesktop from "../hooks/useIsDesktop";

/* ─── Constants ─── */
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FULL_MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const DS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const F = {
  serif: "'Poppins', sans-serif",
  sans: "'Barlow', system-ui, -apple-system, sans-serif",
};

const shadow = "0 2px 8px rgba(27,36,50,0.07), 0 1px 3px rgba(27,36,50,0.04)";

/* ─── FSA -> District mapping ─── */
const FSA_MAP = {
  "V5K":"vsb","V5L":"vsb","V5M":"vsb","V5N":"vsb","V5P":"vsb","V5R":"vsb","V5S":"vsb",
  "V5T":"vsb","V5V":"vsb","V5W":"vsb","V5X":"vsb","V5Y":"vsb","V5Z":"vsb","V6A":"vsb",
  "V6B":"vsb","V6C":"vsb","V6E":"vsb","V6G":"vsb","V6H":"vsb","V6J":"vsb","V6K":"vsb",
  "V6L":"vsb","V6M":"vsb","V6N":"vsb","V6P":"vsb","V6R":"vsb","V6S":"vsb","V6T":"vsb",
  "V6Z":"vsb","V3N":"burnaby","V5A":"burnaby","V5B":"burnaby","V5C":"burnaby","V5E":"burnaby",
  "V5G":"burnaby","V5H":"burnaby","V5J":"burnaby","V7G":"nv","V7H":"nv","V7J":"nv","V7K":"nv",
  "V7L":"nv","V7M":"nv","V7N":"nv","V7P":"nv","V7S":"wv","V7T":"wv","V7V":"wv","V7W":"wv",
  "V6V":"rich","V6W":"rich","V6X":"rich","V6Y":"rich","V7A":"rich","V7B":"rich","V7C":"rich",
  "V7E":"rich","V3R":"surrey","V3S":"surrey","V3T":"surrey","V3V":"surrey","V3W":"surrey",
  "V3X":"surrey","V4A":"surrey","V3B":"coq","V3C":"coq","V3E":"coq","V3H":"coq","V3J":"coq",
  "V3K":"coq","V3L":"nw",
};

const DISTRICTS = {
  vsb: {
    id: "vsb", name: "Vancouver School Board (SD39)", short: "VSB", year: "2025\u201326",
    proD: [
      { date: "2025-09-19", label: "Pro D Day", scope: "Flexible \u2014 may vary by school" },
      { date: "2025-10-24", label: "Provincial Pro D Day", scope: "Province-wide" },
      { date: "2025-11-21", label: "Pro D Day", scope: "District-wide" },
      { date: "2026-01-12", label: "Pro D Day", scope: "Flexible \u2014 may vary by school" },
      { date: "2026-02-13", label: "Pro D Day", scope: "District-wide" },
      { date: "2026-04-20", label: "Indigenous Focus Day", scope: "District-wide" },
    ],
    breaks: [
      { id: "winter", start: "2025-12-22", end: "2026-01-02", label: "Winter Break", planLabel: "Holiday Break" },
      { id: "spring", start: "2026-03-16", end: "2026-03-27", label: "Spring Break", planLabel: "Spring Break" },
    ],
    holidays: [
      { date: "2025-09-01", label: "Labour Day" },
      { date: "2025-09-30", label: "National Day of Truth & Reconciliation" },
      { date: "2025-10-13", label: "Thanksgiving" },
      { date: "2025-11-11", label: "Remembrance Day" },
      { date: "2025-12-25", label: "Christmas Day" },
      { date: "2025-12-26", label: "Boxing Day" },
      { date: "2026-01-01", label: "New Year's Day" },
      { date: "2026-02-16", label: "Family Day" },
      { date: "2026-04-03", label: "Good Friday" },
      { date: "2026-04-06", label: "Easter Monday" },
      { date: "2026-05-18", label: "Victoria Day" },
      { date: "2026-06-26", label: "Administrative Day" },
    ],
    summerStart: "2026-06-29", summerEnd: "2026-09-04",
  },
  burnaby: { id: "burnaby", name: "Burnaby (SD41)", short: "SD41", year: "2025\u201326", proD: [], breaks: [], holidays: [], ph: true },
  nv: { id: "nv", name: "North Vancouver (SD44)", short: "SD44", year: "2025\u201326", proD: [], breaks: [], holidays: [], ph: true },
  wv: { id: "wv", name: "West Vancouver (SD45)", short: "SD45", year: "2025\u201326", proD: [], breaks: [], holidays: [], ph: true },
  rich: { id: "rich", name: "Richmond (SD38)", short: "SD38", year: "2025\u201326", proD: [], breaks: [], holidays: [], ph: true },
  surrey: { id: "surrey", name: "Surrey (SD36)", short: "SD36", year: "2025\u201326", proD: [], breaks: [], holidays: [], ph: true },
  coq: { id: "coq", name: "Coquitlam (SD43)", short: "SD43", year: "2025\u201326", proD: [], breaks: [], holidays: [], ph: true },
  nw: { id: "nw", name: "New Westminster (SD40)", short: "SD40", year: "2025\u201326", proD: [], breaks: [], holidays: [], ph: true },
};

/* ─── Date helpers ─── */
function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function formatDateShort(d) {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

const dim = (y, m) => new Date(y, m + 1, 0).getDate();
const sd0 = (y, m) => new Date(y, m, 1).getDay();
const dk = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const fmtS = (str) => { const [, m, d] = str.split("-").map(Number); return `${FULL_MONTHS[m - 1].slice(0, 3)} ${d}`; };

/* ─── parseDays / times / ranges (from old code) ─── */
function parseDays(daysStr, startDate, endDate) {
  if (daysStr) {
    const sn = daysStr.toLowerCase().replace(/\u2013/g, "-");
    const result = [];
    if (sn.includes("mon-fri") || sn.includes("monday-friday") || sn.includes("weekdays")) return [0, 1, 2, 3, 4];
    if (sn.includes("mon-sat")) return [0, 1, 2, 3, 4, 5];
    if (sn.includes("mon-thu") || sn.includes("monday-thursday")) return [0, 1, 2, 3];
    const fullNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const shortNames = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    shortNames.forEach((name, i) => { if (sn.includes(fullNames[i]) || sn.includes(name)) result.push(i); });
    if (result.length > 0) return result;
  }
  if (startDate && endDate) return [0, 1, 2, 3, 4];
  if (startDate && !endDate) {
    const d = new Date(startDate + "T00:00:00");
    const jsDay = d.getDay();
    const mapped = jsDay === 0 ? 6 : jsDay - 1;
    return [mapped];
  }
  return [];
}

function parseTimeRange(timesStr) {
  if (!timesStr) return { start: 9, end: 12 };
  const parseT = (s) => {
    const m = s.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!m) return null;
    let h = parseInt(m[1]);
    const min = parseInt(m[2]) / 60;
    const ampm = (m[3] || "").toUpperCase();
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return h + min;
  };
  const parts = timesStr.split(/[-\u2013]/);
  const start = parseT(parts[0]) ?? 9;
  const end = parseT(parts[1]) ?? start + 3;
  return { start, end };
}

function isDateInRange(date, startDate, endDate) {
  if (!startDate && !endDate) return true;
  const d = date.getTime();
  if (startDate && d < new Date(startDate).getTime()) return false;
  if (endDate && d > new Date(endDate).getTime()) return false;
  return true;
}

/* ─── Conflict date formatting ─── */
function formatConflictDates(conflictList) {
  const dateSet = new Set();
  conflictList.forEach((c) => {
    (c.dates || []).forEach((d) => {
      const dt = new Date(d);
      dateSet.add(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`);
    });
  });
  if (dateSet.size === 0) return "";
  const sorted = [...dateSet].sort();
  const groups = {};
  sorted.forEach((ds) => {
    const [y, m, d] = ds.split("-").map(Number);
    const key = `${y}-${m}`;
    if (!groups[key]) groups[key] = { year: y, month: m, days: [] };
    groups[key].days.push(d);
  });
  const parts = Object.keys(groups).sort().map((key) => {
    const g = groups[key];
    const monthName = FULL_MONTHS[g.month - 1];
    if (g.days.length === 1) return `${monthName} ${g.days[0]}`;
    const allButLast = g.days.slice(0, -1).join(", ");
    return `${monthName} ${allButLast} and ${g.days[g.days.length - 1]}`;
  });
  return parts.join(", ");
}

/* ─── Kid color fallback ─── */
const KID_COLORS_FALLBACK = [C.seaGreen, C.blue, C.lilac, C.olive, "#E06C50", "#5BB5A2"];

function getKidColor(kid, kids) {
  if (kid.color) return kid.color;
  const idx = (kids || []).findIndex((k) => k.id === kid.id);
  return KID_COLORS[idx >= 0 ? idx % KID_COLORS.length : 0]?.hex || C.muted;
}

/* ─── Build booking map for mini calendar ─── */
function buildBookingMap(programs, kids, year, month) {
  const map = {};
  programs.forEach((p) => {
    const dayIndices = parseDays(p.days);
    if (dayIndices.length === 0) return;
    const status = p.status || "Exploring";
    const assignedKids = (p.kidIds || []).map((id) => (kids || []).find((k) => k.id === id)).filter(Boolean);
    const kidColors = assignedKids.length > 0
      ? assignedKids.map((k) => getKidColor(k, kids))
      : [C.muted];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dow = date.getDay();
      const calIdx = dow === 0 ? 6 : dow - 1;
      if (!dayIndices.includes(calIdx)) continue;
      if (!isDateInRange(date, p.startDate, p.endDate)) continue;
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      if (!map[key]) map[key] = [];
      kidColors.forEach((kc) => {
        if (!map[key].some((e) => e.kidColor === kc && e.status === status)) {
          map[key].push({ kidColor: kc, status });
        }
      });
    }
  });
  return map;
}

/* ─── School calendar coverage map ─── */
function buildCoverageMap(dist, edits) {
  const m = {};
  if (!dist) return m;
  dist.proD?.forEach((p) => { if (!edits.removed.includes(p.date)) m[p.date] = { type: "proD", label: p.label, scope: p.scope }; });
  dist.breaks?.forEach((b) => {
    for (let d = new Date(b.start); d <= new Date(b.end); d.setDate(d.getDate() + 1)) {
      const k = dk(d.getFullYear(), d.getMonth(), d.getDate());
      if (!edits.removed.includes(k)) m[k] = { type: "break", label: b.label };
    }
  });
  dist.holidays?.forEach((h) => { if (!edits.removed.includes(h.date)) m[h.date] = { type: "holiday", label: h.label }; });
  edits.added.forEach((a) => { m[a.date] = { type: a.type, label: a.label, scope: "Custom" }; });
  if (dist.summerStart) {
    for (let d = new Date(dist.summerStart); d <= new Date(dist.summerEnd); d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      const k = dk(d.getFullYear(), d.getMonth(), d.getDate());
      if (!m[k]) m[k] = { type: "summer", label: "Summer" };
    }
  }
  return m;
}

function countEvents(m) {
  const c = { proD: 0, break: 0, holiday: 0, summer: 0 };
  Object.values(m).forEach((v) => { if (c[v.type] !== undefined) c[v.type]++; });
  return c;
}

/* ─── Make break weeks from date ranges ─── */
function makeWeeks(startStr, endStr, prefix) {
  const weeks = [];
  // Parse as local noon to avoid UTC-offset date shift issues (e.g. Sep 4 UTC → Sep 3 PDT)
  const endDate = new Date(endStr + "T12:00:00");
  let ws = new Date(startStr + "T12:00:00");
  while (ws.getDay() !== 1 && ws <= endDate) ws.setDate(ws.getDate() + 1);
  let wn = 1;
  while (ws <= endDate) {
    const we = new Date(ws); we.setDate(we.getDate() + 4);
    if (we > endDate) we.setTime(endDate.getTime());
    const days = [];
    for (let d = new Date(ws); d <= we; d.setDate(d.getDate() + 1)) {
      const dow = d.getDay();
      if (dow === 0 || dow === 6) continue;
      days.push(`${DS[dow]} ${FULL_MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`);
    }
    weeks.push({
      id: `${prefix}-w${wn}`,
      label: `Week ${wn}`,
      dates: `${FULL_MONTHS[ws.getMonth()].slice(0, 3)} ${ws.getDate()} \u2013 ${FULL_MONTHS[we.getMonth()].slice(0, 3)} ${we.getDate()}`,
      startDate: dk(ws.getFullYear(), ws.getMonth(), ws.getDate()),
      endDate: dk(we.getFullYear(), we.getMonth(), we.getDate()),
      dayLabels: days,
      programs: [],
      awayDays: [],
      awayReason: "",
    });
    wn++;
    ws = new Date(we); ws.setDate(ws.getDate() + 3);
  }
  return weeks;
}

/* ─── Map real programs to break weeks ─── */
function mapProgramsToWeeks(weeks, programs, kids) {
  return weeks.map((week) => {
    const wStart = new Date(week.startDate + "T00:00:00");
    const wEnd = new Date(week.endDate + "T00:00:00");
    const matched = [];
    programs.forEach((p) => {
      if (!p.startDate) return;
      const pStart = new Date(p.startDate + "T00:00:00");
      const pEnd = p.endDate ? new Date(p.endDate + "T00:00:00") : pStart;
      // Overlap check
      if (pEnd < wStart || pStart > wEnd) return;
      const assignedKids = (p.kidIds || []).map((id) => (kids || []).find((k) => k.id === id)).filter(Boolean);
      if (assignedKids.length === 0) {
        matched.push({
          id: p.id,
          kid: "unassigned",
          kidName: "Unassigned",
          name: p.name,
          provider: p.provider || "",
          status: (p.status || "Exploring").toLowerCase(),
          cost: p.cost || 0,
          days: p.days || "Mon\u2013Fri",
          time: p.times || "",
          note: "",
        });
      } else {
        assignedKids.forEach((k) => {
          matched.push({
            id: `${p.id}-${k.id}`,
            kid: k.id,
            kidName: k.name,
            name: p.name,
            provider: p.provider || "",
            status: (p.status || "Exploring").toLowerCase(),
            cost: p.cost || 0,
            days: p.days || "Mon\u2013Fri",
            time: p.times || "",
            note: "",
          });
        });
      }
    });
    return { ...week, programs: matched };
  });
}

/* ─── Coverage helpers ─── */
function getCov(week, kidId) {
  const p = week.programs.filter((x) => x.kid === kidId);
  if (week.awayDays.length >= week.dayLabels.length) return "away";
  if (p.length === 0) return "gap";
  if (p.some((x) => x.status === "enrolled")) return "covered";
  if (p.some((x) => x.status === "waitlist")) return "partial";
  return "planning";
}

function weekCost(week, filter) {
  return week.programs
    .filter((p) => filter === "all" || filter === null || p.kid === filter)
    .reduce((s, p) => s + p.cost, 0);
}

const statusCfg = {
  enrolled: { label: "Enrolled", bg: "rgba(45,159,111,0.10)", color: C.seaGreen, icon: "\u2713" },
  waitlist: { label: "Waitlist", bg: "rgba(231,111,81,0.10)", color: C.olive, icon: "\u23F3" },
  exploring: { label: "Exploring", bg: "rgba(74,111,165,0.10)", color: C.blue, icon: "?" },
};

/* ─── localStorage helpers for school calendar ─── */
const SCHOOL_CAL_KEY = "skeddo-school-calendar";
function loadSchoolCalendar() {
  try {
    const raw = localStorage.getItem(SCHOOL_CAL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveSchoolCalendar(data) {
  try { localStorage.setItem(SCHOOL_CAL_KEY, JSON.stringify(data)); } catch { /* noop */ }
}

const AWAY_KEY = "skeddo-planner-away";
function loadAway() {
  try {
    const raw = localStorage.getItem(AWAY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function saveAway(data) {
  try { localStorage.setItem(AWAY_KEY, JSON.stringify(data)); } catch { /* noop */ }
}

/* ═══════════════════════════════════════════════════════════════
   MINI CALENDAR (enhanced with school calendar day types)
   ═══════════════════════════════════════════════════════════════ */
function MiniCalendar({ currentMonday, onSelectWeek, programs, kids, covMap, setupDone }) {
  const [calMonth, setCalMonth] = useState(() => ({
    year: currentMonday.getFullYear(),
    month: currentMonday.getMonth(),
  }));

  useEffect(() => {
    const m = currentMonday.getMonth();
    const y = currentMonday.getFullYear();
    setCalMonth((prev) => {
      if (prev.month === m && prev.year === y) return prev;
      return { year: y, month: m };
    });
  }, [currentMonday]);

  const { year, month } = calMonth;

  const goToPrevMonth = () => {
    setCalMonth((prev) => {
      const m = prev.month - 1;
      return m < 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: m };
    });
  };

  const goToNextMonth = () => {
    setCalMonth((prev) => {
      const m = prev.month + 1;
      return m > 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: m };
    });
  };

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const firstDay = monthStart.getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = monthEnd.getDate();
  const weeks = [];
  let dayNum = 1 - startOffset;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) { week.push(dayNum); dayNum++; }
    weeks.push(week);
    if (dayNum > daysInMonth) break;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookingMap = useMemo(
    () => buildBookingMap(programs || [], kids || [], year, month),
    [programs, kids, year, month]
  );

  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div style={{ background: C.white, borderRadius: 14, padding: 12, marginBottom: 16, border: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <button onClick={goToPrevMonth} aria-label="Previous month" style={{ ...s.secondaryBtn, flex: "none", width: 44, height: 44, padding: 0, fontSize: 20, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {"\u2039"}
        </button>
        <div style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 700, color: C.ink, textAlign: "center" }}>
          {monthLabel}
        </div>
        <button onClick={goToNextMonth} aria-label="Next month" style={{ ...s.secondaryBtn, flex: "none", width: 44, height: 44, padding: 0, fontSize: 20, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {"\u203A"}
        </button>
      </div>

      {/* Legend */}
      <div style={{ marginBottom: 8 }}>
        {(kids || []).length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 4 }}>
            {(kids || []).map((k) => {
              const kidColor = getKidColor(k, kids);
              return (
                <div key={k.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: kidColor, flexShrink: 0 }} />
                  <span style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 600, color: C.ink }}>{k.name}</span>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: C.ink, flexShrink: 0 }} />
            <span style={{ fontFamily: F.sans, fontSize: 11, color: C.muted }}>Enrolled</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: "transparent", border: `1.5px solid ${C.ink}`, boxSizing: "border-box", flexShrink: 0 }} />
            <span style={{ fontFamily: F.sans, fontSize: 11, color: C.muted }}>Waitlist</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: 1, background: C.ink, opacity: 0.6, flexShrink: 0 }} />
            <span style={{ fontFamily: F.sans, fontSize: 11, color: C.muted }}>Exploring</span>
          </div>
          {setupDone && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: C.olive, flexShrink: 0 }} />
                <span style={{ fontFamily: F.sans, fontSize: 11, color: C.muted }}>Pro-D</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: C.blue, flexShrink: 0 }} />
                <span style={{ fontFamily: F.sans, fontSize: 11, color: C.muted }}>Break</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
        {DAY_NAMES.map((d) => (
          <div key={d} style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 700, color: C.muted, textAlign: "center", padding: 3 }}>
            {d[0]}
          </div>
        ))}
        {weeks.flat().map((dn, i) => {
          const inMonth = dn >= 1 && dn <= daysInMonth;
          const date = inMonth ? new Date(year, month, dn) : null;
          const isCurrentWeek = date && date >= currentMonday && date < addDays(currentMonday, 7);
          const isToday = date && date.getTime() === today.getTime();

          const dateKey = inMonth ? `${year}-${String(month + 1).padStart(2, "0")}-${String(dn).padStart(2, "0")}` : null;
          const dots = dateKey ? (bookingMap[dateKey] || []) : [];
          const covEntry = dateKey && covMap ? covMap[dateKey] : null;

          // Background based on school calendar events
          let dayBg = "transparent";
          if (covEntry && inMonth && !isToday) {
            if (covEntry.type === "proD") dayBg = C.olive + "18";
            else if (covEntry.type === "break") dayBg = C.blue + "18";
            else if (covEntry.type === "holiday") dayBg = C.seaGreen + "18";
            else if (covEntry.type === "summer") dayBg = C.lilac + "18";
          } else if (dots.length > 0 && inMonth && !isToday) {
            const hasEnrolled = dots.some((d) => d.status === "Enrolled");
            const hasWaitlist = dots.some((d) => d.status === "Waitlist");
            if (hasEnrolled) dayBg = STATUS_MAP.Enrolled.color + "20";
            else if (hasWaitlist) dayBg = STATUS_MAP.Waitlist.color + "20";
            else dayBg = STATUS_MAP.Exploring.color + "20";
          }

          return (
            <button
              key={i}
              onClick={() => { if (date) onSelectWeek(getMonday(date)); }}
              aria-label={inMonth && date ? `Select week of ${formatDateShort(date)}` : undefined}
              style={{
                fontFamily: F.sans, fontSize: 14, fontWeight: isToday ? 800 : 600,
                color: !inMonth ? "transparent" : isToday ? C.cream : isCurrentWeek ? C.seaGreen : C.ink,
                background: isToday ? C.seaGreen : isCurrentWeek ? C.seaGreen + "14" : dayBg,
                border: "none", borderRadius: 6,
                padding: "5px 2px 3px", cursor: inMonth ? "pointer" : "default",
                textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", minHeight: 38,
              }}
            >
              <span>{inMonth ? dn : ""}</span>
              {dots.length > 0 && (
                <span style={{ display: "flex", gap: 2, marginTop: 2, justifyContent: "center", flexWrap: "wrap" }}>
                  {dots.slice(0, 3).map((dot, di) => {
                    const dotColor = isToday ? C.cream : dot.kidColor;
                    if (dot.status === "Waitlist") {
                      return <span key={di} style={{ width: 6, height: 6, borderRadius: 3, background: "transparent", border: `1.5px solid ${dotColor}`, boxSizing: "border-box", flexShrink: 0 }} />;
                    }
                    if (dot.status === "Exploring") {
                      return <span key={di} style={{ width: 5, height: 5, borderRadius: 1, background: dotColor, opacity: 0.6, flexShrink: 0 }} />;
                    }
                    return <span key={di} style={{ width: 6, height: 6, borderRadius: 2, background: dotColor, flexShrink: 0 }} />;
                  })}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BOTTOM SHEET
   ═══════════════════════════════════════════════════════════════ */
function BottomSheet({ onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ flex: 1, background: "rgba(27,36,50,0.4)", animation: "fadeIn 0.2s ease" }} />
      <div style={{ background: C.white, borderRadius: "20px 20px 0 0", padding: "8px 20px 32px", maxHeight: "75vh", overflowY: "auto", boxShadow: "0 -4px 24px rgba(27,36,50,0.12)", animation: "slideUp 0.25s ease-out" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(27,36,50,0.15)", margin: "0 auto 16px" }} />
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PLANNER WEEK CARD
   ═══════════════════════════════════════════════════════════════ */
function WeekCard({ week, progs, wc, gap, away, exp, kidF, kids, idx, onTog, onNote, onAway, onNavigateToDiscover }) {
  const noP = gap && progs.length === 0;
  return (
    <div style={{ background: away ? "rgba(244,162,97,0.08)" : noP ? "rgba(231,111,81,0.05)" : C.white, borderRadius: 14, overflow: "hidden", boxShadow: (away || noP) ? "none" : shadow, border: noP ? "1.5px dashed rgba(231,111,81,0.25)" : `1px solid ${C.border}20`, animation: `fadeUp 0.3s ease-out ${idx * 0.03}s both` }}>
      <div onClick={onTog} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 700, color: gap ? C.olive : C.ink, minWidth: 50 }}>{week.label}</span>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.muted }}>{week.dates}</span>
          {week.awayDays.length > 0 && <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: "rgba(244,162,97,0.12)", color: C.lilac, fontFamily: F.sans, fontWeight: 500 }}>{"\u2708\uFE0F"} {away ? (week.awayReason || "Away") : `${week.awayDays.length}d away`}</span>}
          {noP && !away && <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: "rgba(231,111,81,0.12)", color: C.olive, fontFamily: F.sans, fontWeight: 600 }}>GAP</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {wc > 0 && <span style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.ink }}>${wc}</span>}
          {!away && (
            <div style={{ display: "flex", gap: 3 }}>
              {(kidF === "all" || kidF === null ? kids : kids.filter((k) => k.id === kidF)).map((k) => {
                const c = getCov(week, k.id);
                const col = c === "covered" ? C.seaGreen : c === "partial" ? C.lilac : c === "planning" ? C.blue : "rgba(231,111,81,0.3)";
                return <div key={k.id} style={{ width: 8, height: 8, borderRadius: 4, background: col, border: c === "gap" ? `1.5px dashed ${C.olive}` : "none" }} />;
              })}
            </div>
          )}
          <span style={{ fontSize: 14, color: C.muted, display: "inline-block", transform: exp ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>{"\u203A"}</span>
        </div>
      </div>
      {exp && (
        <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${C.border}20`, paddingTop: 10 }}>
          {away && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: "rgba(244,162,97,0.08)", marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>{"\uD83C\uDFD4\uFE0F"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.lilac }}>{week.awayReason || "Away"}</div>
                <div style={{ fontFamily: F.sans, fontSize: 12, color: C.muted }}>No camp needed</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onAway(); }} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid rgba(244,162,97,0.25)`, background: C.cream, fontFamily: F.sans, fontSize: 12, color: C.lilac, cursor: "pointer", fontWeight: 500 }}>Edit</button>
            </div>
          )}
          {progs.map((p) => {
            const st = statusCfg[p.status] || statusCfg.exploring;
            const kid = kids.find((k) => k.id === p.kid);
            return (
              <div key={p.id} style={{ padding: "10px 12px", borderRadius: 10, background: C.cream, borderLeft: `3px solid ${st.color}`, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {(kidF === "all" || kidF === null) && kid && <div style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 600, color: getKidColor(kid, kids), textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{kid.name}</div>}
                    <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                    <div style={{ fontFamily: F.sans, fontSize: 11, color: C.muted, marginTop: 1 }}>{p.provider}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: st.bg, color: st.color, textTransform: "uppercase" }}>{st.icon} {st.label}</span>
                    {p.cost > 0 && <div style={{ fontFamily: F.sans, fontSize: 11, color: C.muted, marginTop: 3 }}>${p.cost}</div>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <span style={{ fontFamily: F.sans, fontSize: 11, color: C.muted }}>{"\uD83D\uDCC5"} {p.days}</span>
                  {p.time && <span style={{ fontFamily: F.sans, fontSize: 11, color: C.muted }}>{"\uD83D\uDD50"} {p.time}</span>}
                </div>
                {p.note ? (
                  <div onClick={(e) => { e.stopPropagation(); onNote(p.id); }} style={{ marginTop: 8, padding: "8px 10px", borderRadius: 8, background: "rgba(74,111,165,0.06)", fontFamily: F.sans, fontSize: 12, color: C.muted, fontStyle: "italic", cursor: "pointer", display: "flex", gap: 6 }}>
                    <span>{"\uD83D\uDCAD"}</span><span style={{ flex: 1 }}>{p.note}</span><span style={{ fontSize: 10, opacity: 0.5 }}>{"\u270E"}</span>
                  </div>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); onNote(p.id); }} style={{ marginTop: 8, padding: "6px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.cream, fontFamily: F.sans, fontSize: 12, color: C.muted, cursor: "pointer", fontWeight: 500 }}>{"\uD83D\uDCAD"} Add a note</button>
                )}
              </div>
            );
          })}
          {gap && !away && (
            <div style={{ padding: 14, borderRadius: 10, background: "rgba(231,111,81,0.05)", border: "1.5px dashed rgba(231,111,81,0.2)", textAlign: "center", marginBottom: 8 }}>
              <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 500, color: C.olive, marginBottom: 8 }}>{"\u26A0\uFE0F"} Coverage gap</div>
              {onNavigateToDiscover && <button onClick={onNavigateToDiscover} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: C.seaGreen, color: C.white, fontFamily: F.sans, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Browse Programs {"\u2192"}</button>}
            </div>
          )}
          {(kidF === "all" || kidF === null) && !away && kids.map((k) => getCov(week, k.id) !== "gap" ? null : (
            <div key={k.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "rgba(231,111,81,0.05)", borderLeft: "3px dashed rgba(231,111,81,0.3)", marginBottom: 6 }}>
              <span style={{ fontFamily: F.sans, fontSize: 12, color: C.olive, fontWeight: 500 }}>No program for {k.name}</span>
            </div>
          ))}
          {week.awayDays.length > 0 && !away && (
            <div onClick={(e) => { e.stopPropagation(); onAway(); }} style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(244,162,97,0.08)", fontFamily: F.sans, fontSize: 12, color: C.lilac, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span>{"\u2708\uFE0F"}</span><span style={{ flex: 1 }}>Away: {week.awayDays.map((d) => d.split(" ")[0]).join(", ")}</span><span style={{ fontSize: 10, opacity: 0.5 }}>{"\u270E"}</span>
            </div>
          )}
          {!away && week.awayDays.length === 0 && <button onClick={(e) => { e.stopPropagation(); onAway(); }} style={{ marginTop: 4, padding: "6px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.cream, fontFamily: F.sans, fontSize: 12, color: C.muted, cursor: "pointer", fontWeight: 500 }}>{"\u2708\uFE0F"} Mark days away</button>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NOTE EDITOR
   ═══════════════════════════════════════════════════════════════ */
function NoteEditor({ week, pid, onSave, onClose }) {
  const prog = week?.programs.find((p) => p.id === pid);
  const [txt, setTxt] = useState(prog?.note || "");
  const ref = useRef(null);
  useEffect(() => { setTimeout(() => ref.current?.focus(), 100); }, []);
  if (!prog) return null;
  return (
    <div>
      <h3 style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 600, color: C.ink, margin: "0 0 4px" }}>{prog.note ? "Edit note" : "Add a note"}</h3>
      <div style={{ fontFamily: F.sans, fontSize: 14, color: C.muted, marginBottom: 16 }}>{prog.name} {"\u00B7"} {week.label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {["Backup option?", "Schedule conflict?", "Ask about drop-off", "Compare alternatives", "Need PM coverage"].map((c) => (
          <button key={c} onClick={() => setTxt((p) => p ? `${p}. ${c}` : c)} style={{ padding: "5px 10px", borderRadius: 16, border: `1px solid ${C.border}`, background: C.cream, fontFamily: F.sans, fontSize: 11, color: C.muted, cursor: "pointer" }}>{c}</button>
        ))}
      </div>
      <textarea ref={ref} value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Your notes…" rows={3} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.cream, fontFamily: F.sans, fontSize: 14, color: C.ink, resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.5 }} />
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button onClick={onClose} style={{ ...s.secondaryBtn, flex: 1 }}>Cancel</button>
        <button onClick={() => onSave(txt)} style={{ ...s.primaryBtn, flex: 1 }}>Save</button>
      </div>
      {prog.note && <button onClick={() => onSave("")} style={{ width: "100%", marginTop: 8, padding: 10, borderRadius: 10, border: "none", background: "transparent", fontFamily: F.sans, fontSize: 14, color: C.olive, cursor: "pointer" }}>Remove note</button>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AWAY EDITOR
   ═══════════════════════════════════════════════════════════════ */
function AwayEditor({ week, onToggle, onReason, onAll, onClear, onClose }) {
  const [r, setR] = useState(week?.awayReason || "");
  if (!week) return null;
  return (
    <div>
      <h3 style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 600, color: C.ink, margin: "0 0 4px" }}>Mark days away</h3>
      <div style={{ fontFamily: F.sans, fontSize: 14, color: C.muted, marginBottom: 12 }}>{week.label} {"\u00B7"} {week.dates}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        {week.dayLabels.map((day) => {
          const ia = week.awayDays.includes(day);
          const pts = day.split(" ");
          return (
            <button key={day} onClick={() => onToggle(day)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: ia ? `1.5px solid ${C.lilac}` : `1.5px solid ${C.border}`, background: ia ? "rgba(244,162,97,0.08)" : C.white, cursor: "pointer" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: ia ? `2px solid ${C.lilac}` : `2px solid ${C.border}`, background: ia ? C.lilac : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{ia && <span style={{ color: C.white, fontSize: 14, fontWeight: 700 }}>{"\u2713"}</span>}</div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <span style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: ia ? C.lilac : C.ink }}>{pts[0]}</span>
                <span style={{ fontFamily: F.sans, fontSize: 14, color: C.muted, marginLeft: 8 }}>{pts.slice(1).join(" ")}</span>
              </div>
              {ia && <span style={{ fontSize: 14 }}>{"\u2708\uFE0F"}</span>}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={onAll} style={{ ...s.secondaryBtn, flex: 1, padding: "8px 12px", fontSize: 14 }}>Select all</button>
        <button onClick={onClear} style={{ ...s.secondaryBtn, flex: 1, padding: "8px 12px", fontSize: 14 }}>Clear all</button>
      </div>
      {week.awayDays.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 500, color: C.muted, display: "block", marginBottom: 6 }}>Reason (optional)</label>
          <input type="text" value={r} onChange={(e) => { setR(e.target.value); onReason(e.target.value); }} placeholder="e.g. Family trip to Whistler" style={{ ...s.input }} />
        </div>
      )}
      <button onClick={onClose} style={{ ...s.primaryBtn, width: "100%" }}>Done</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SMALL HELPER COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
function SumCell({ label, value, color }) {
  return (
    <div style={{ flex: 1, padding: "12px 10px", textAlign: "center" }}>
      <div style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 700, color, lineHeight: 1.2 }}>{value}</div>
    </div>
  );
}

function TypeBadge({ type }) {
  const cfg = { proD: { l: "PRO-D", bg: C.olive + "18", c: C.olive }, break: { l: "BREAK", bg: C.blue + "18", c: C.blue }, holiday: { l: "HOLIDAY", bg: C.seaGreen + "18", c: C.seaGreen }, summer: { l: "SUMMER", bg: C.lilac + "18", c: C.lilac } }[type] || { l: "OTHER", bg: C.cream, c: C.muted };
  return <span style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: cfg.bg, color: cfg.c, textTransform: "uppercase", letterSpacing: 0.3 }}>{cfg.l}</span>;
}

function SecHeader({ icon, title, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <div>
        <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.ink }}>{title}</div>
        <div style={{ fontFamily: F.sans, fontSize: 11, color: C.muted }}>{sub}</div>
      </div>
    </div>
  );
}

function DateList({ title, sub, icon, color, dates, removed, onToggle, fmt }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <SecHeader icon={icon} title={title} sub={sub} />
      {dates.map((d) => {
        const off = removed.includes(d.date);
        const f = fmt(d);
        return (
          <button key={d.date} onClick={() => onToggle(d.date)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}20`, background: C.white, boxShadow: off ? "none" : shadow, opacity: off ? 0.4 : 1, cursor: "pointer", textAlign: "left", borderLeft: off ? "3px solid rgba(27,36,50,0.1)" : `3px solid ${color}`, marginBottom: 4 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: off ? C.muted : C.ink, textDecoration: off ? "line-through" : "none" }}>{f.a}</div>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: C.muted, textDecoration: off ? "line-through" : "none" }}>{f.b}</div>
            </div>
            <span style={{ fontSize: 11, color: off ? C.seaGreen : C.muted, fontFamily: F.sans, fontWeight: 500 }}>{off ? "\u21A9 Restore" : "\u2715"}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CSS ANIMATIONS
   ═══════════════════════════════════════════════════════════════ */
function AnimStyles() {
  return (
    <style>{`
      @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
      @keyframes scaleIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
    `}</style>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN SCHEDULE TAB
   ═══════════════════════════════════════════════════════════════ */
export default function ScheduleTab({ programs, kids, kidFilter, onKidFilter, onOpenDetail, onNavigateToDiscover, onOpenAddProgram, planAccess }) {
  const isDesktop = useIsDesktop();
  /* ─── Mode & page state ─── */
  const [mode, setMode] = useState("planner"); // "calendar" | "planner"
  const [page, setPage] = useState("main"); // "main" | "setup"

  /* ─── Toast ─── */
  const [schedToast, setSchedToast] = useState(null);
  const showSchedToast = (msg) => { setSchedToast(msg); setTimeout(() => setSchedToast(null), 2500); };

  /* ─── Conflicts ─── */
  const [dismissedConflicts, setDismissedConflicts] = useState(false);
  const [dismissedLogistics, setDismissedLogistics] = useState(false);
  const [dismissedSetupBanner, setDismissedSetupBanner] = useState(false);
  const canExport = planAccess?.canExportCalendar ?? true;

  /* ─── Status visibility ─── */
  const [visibleStatuses, setVisibleStatuses] = useState(() => new Set(["Enrolled", "Waitlist", "Exploring"]));

  /* ─── Hidden programs ─── */
  const [hiddenPrograms, setHiddenPrograms] = useState(() => {
    try { const sv = localStorage.getItem("skeddo-hidden-schedule-programs"); return sv ? new Set(JSON.parse(sv)) : new Set(); } catch { return new Set(); }
  });
  useEffect(() => { localStorage.setItem("skeddo-hidden-schedule-programs", JSON.stringify([...hiddenPrograms])); }, [hiddenPrograms]);
  const [showVisibilityPanel, setShowVisibilityPanel] = useState(false);
  const toggleHidden = (id) => { setHiddenPrograms((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; }); };
  const showAllPrograms = () => setHiddenPrograms(new Set());
  const hideAllPrograms = () => setHiddenPrograms(new Set(programs.map((p) => p.id)));

  /* ─── Filtered programs for calendar view ─── */
  const visiblePrograms = (kidFilter
    ? programs.filter((p) => (p.kidIds || []).includes(kidFilter))
    : programs
  ).filter((p) => !hiddenPrograms.has(p.id) && visibleStatuses.has(p.status));

  /* ─── Week navigation ─── */
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const weekEnd = addDays(weekStart, 6);
  const isThisWeek = getMonday(new Date()).getTime() === weekStart.getTime();

  const scheduledByDay = useMemo(() => {
    const byDay = Array.from({ length: 7 }, () => []);
    visiblePrograms.forEach((p) => {
      const dayIndices = parseDays(p.days, p.startDate, p.endDate);
      const timeRange = parseTimeRange(p.times);
      dayIndices.forEach((dayIdx) => {
        const date = weekDates[dayIdx];
        if (date && isDateInRange(date, p.startDate, p.endDate)) {
          byDay[dayIdx].push({ ...p, timeRange });
        }
      });
    });
    byDay.forEach((day) => day.sort((a, b) => a.timeRange.start - b.timeRange.start));
    return byDay;
  }, [visiblePrograms, weekDates]);

  const totalThisWeek = scheduledByDay.reduce((sum, day) => sum + day.length, 0);

  /* ─── Swipe ─── */
  const touchStartX = useRef(null);
  const handleTouchStart = useCallback((e) => { touchStartX.current = e.touches[0].clientX; }, []);
  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 60) { setWeekStart((prev) => addDays(prev, deltaX < 0 ? 7 : -7)); }
    touchStartX.current = null;
  }, []);

  /* ─── Conflicts ─── */
  const conflicts = useMemo(() => {
    const enrolled = visiblePrograms.filter((p) => p.status === "Enrolled");
    return detectConflicts(enrolled);
  }, [visiblePrograms]);

  /* ─── Export modal state ─── */
  const [showExport, setShowExport] = useState(false);
  const [exportKidFilter, setExportKidFilter] = useState("all");
  const [exportSelected, setExportSelected] = useState(new Set());
  const [exportDateMode, setExportDateMode] = useState("all");
  const [exportMonth, setExportMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [exportCustomStart, setExportCustomStart] = useState("");
  const [exportCustomEnd, setExportCustomEnd] = useState("");

  const exportablePrograms = useMemo(() => {
    let list = visiblePrograms.filter((p) => p.status === "Enrolled");
    if (exportKidFilter !== "all") list = list.filter((p) => (p.kidIds || []).includes(exportKidFilter));
    if (exportDateMode === "month" && exportMonth) {
      const [y, m] = exportMonth.split("-").map(Number);
      const mStart = new Date(y, m - 1, 1);
      const mEnd = new Date(y, m, 0);
      list = list.filter((p) => { if (!p.startDate) return false; const ps = new Date(p.startDate + "T00:00:00"); const pe = p.endDate ? new Date(p.endDate + "T00:00:00") : ps; return pe >= mStart && ps <= mEnd; });
    } else if (exportDateMode === "week") {
      const wEnd = new Date(weekStart); wEnd.setDate(wEnd.getDate() + 6);
      list = list.filter((p) => { if (!p.startDate) return false; const ps = new Date(p.startDate + "T00:00:00"); const pe = p.endDate ? new Date(p.endDate + "T00:00:00") : ps; return pe >= weekStart && ps <= wEnd; });
    } else if (exportDateMode === "custom" && exportCustomStart && exportCustomEnd) {
      const cStart = new Date(exportCustomStart + "T00:00:00"); const cEnd = new Date(exportCustomEnd + "T00:00:00");
      list = list.filter((p) => { if (!p.startDate) return false; const ps = new Date(p.startDate + "T00:00:00"); const pe = p.endDate ? new Date(p.endDate + "T00:00:00") : ps; return pe >= cStart && ps <= cEnd; });
    }
    return list;
  }, [visiblePrograms, exportKidFilter, exportDateMode, exportMonth, weekStart, exportCustomStart, exportCustomEnd]);

  const openExportModal = () => {
    setShowExport(true); setExportKidFilter("all"); setExportDateMode("all");
    setTimeout(() => { setExportSelected(new Set(exportablePrograms.map((p) => p.id))); }, 0);
  };
  const toggleExportProgram = (id) => { setExportSelected((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; }); };
  const selectAllExport = () => setExportSelected(new Set(exportablePrograms.map((p) => p.id)));
  const selectNoneExport = () => setExportSelected(new Set());

  /* ─── School Calendar Setup state ─── */
  const [postal, setPostal] = useState("");
  const [detDist, setDetDist] = useState(null);
  const [confDist, setConfDist] = useState(null);
  const [isManual, setIsManual] = useState(false);
  const [edits, setEdits] = useState({ removed: [], added: [] });
  const [setupDone, setSetupDone] = useState(false);
  const [addForm, setAddForm] = useState(false);
  const [addDate, setAddDate] = useState("");
  const [addLabel, setAddLabel] = useState("");
  const [addType, setAddType] = useState("proD");

  // Load saved school calendar on mount
  useEffect(() => {
    const saved = loadSchoolCalendar();
    if (saved) {
      if (saved.confDist) setConfDist(saved.confDist);
      if (saved.isManual) setIsManual(saved.isManual);
      if (saved.edits) setEdits(saved.edits);
      if (saved.setupDone) setSetupDone(saved.setupDone);
    }
  }, []);

  const dist = confDist ? DISTRICTS[confDist] : null;
  const covMap = useMemo(() => buildCoverageMap(dist, edits), [dist, edits]);
  const evCounts = useMemo(() => countEvents(covMap), [covMap]);

  function handlePostal(v) {
    let c = v.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (c.length > 3) c = c.slice(0, 3) + " " + c.slice(3, 6);
    setPostal(c);
    setDetDist(FSA_MAP[c.replace(/\s/g, "").slice(0, 3)] || null);
  }
  function toggleRemoved(d) { setEdits((p) => ({ ...p, removed: p.removed.includes(d) ? p.removed.filter((x) => x !== d) : [...p.removed, d] })); }
  function addCustomDate() {
    if (!addDate || !addLabel) return;
    setEdits((p) => ({ ...p, added: [...p.added, { date: addDate, label: addLabel, type: addType }] }));
    setAddDate(""); setAddLabel(""); setAddForm(false);
  }
  function saveSetup() {
    setSetupDone(true);
    setPage("main");
    saveSchoolCalendar({ confDist, isManual, edits, setupDone: true });
  }

  /* ─── Planner mode state ─── */
  const [planSec, setPlanSec] = useState("summer");
  const [expWeek, setExpWeek] = useState(null);
  const [sheet, setSheet] = useState(null);

  // Calendar mode for year-round view
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selDate, setSelDate] = useState(null);

  // Build planner break weeks using real programs
  const breakSections = useMemo(() => {
    const summerWeeks = dist?.summerStart ? makeWeeks(dist.summerStart, dist.summerEnd, "summer") : makeWeeks("2026-06-29", "2026-09-04", "summer");
    const springBreak = dist?.breaks?.find((b) => b.id === "spring");
    const springWeeks = springBreak ? makeWeeks(springBreak.start, springBreak.end, "spring") : makeWeeks("2026-03-16", "2026-03-27", "spring");
    const winterBreak = dist?.breaks?.find((b) => b.id === "winter");
    const holidayWeeks = winterBreak ? makeWeeks(winterBreak.start, winterBreak.end, "winter") : makeWeeks("2025-12-22", "2026-01-02", "winter");

    // Map real programs onto weeks
    const mappedSummer = mapProgramsToWeeks(summerWeeks, programs, kids);
    const mappedSpring = mapProgramsToWeeks(springWeeks, programs, kids);
    const mappedHoliday = mapProgramsToWeeks(holidayWeeks, programs, kids);

    return [
      { id: "summer", label: "Summer", dates: dist?.summerStart ? `${fmtS(dist.summerStart)} \u2013 ${fmtS(dist.summerEnd)}` : "Jun 29 \u2013 Sep 4", weeks: mappedSummer, color: C.lilac },
      { id: "spring", label: "Spring Break", dates: springBreak ? `${fmtS(springBreak.start)} \u2013 ${fmtS(springBreak.end)}` : "Mar 16 \u2013 27", weeks: mappedSpring, color: C.blue },
      { id: "holiday", label: "Holiday Break", dates: winterBreak ? `${fmtS(winterBreak.start)} \u2013 ${fmtS(winterBreak.end)}` : "Dec 22 \u2013 Jan 2", weeks: mappedHoliday, color: C.seaGreen },
    ];
  }, [dist, programs, kids]);

  // Away state persisted
  const [awayData, setAwayData] = useState(() => loadAway());
  const getWeekAway = (weekId) => awayData[weekId] || { days: [], reason: "" };
  const updateAway = (weekId, updater) => {
    setAwayData((prev) => {
      const cur = prev[weekId] || { days: [], reason: "" };
      const next = { ...prev, [weekId]: updater(cur) };
      saveAway(next);
      return next;
    });
  };

  // Attach away data to break weeks
  const activeSec = breakSections.find((sec) => sec.id === planSec);
  const actWeeks = useMemo(() => {
    return (activeSec?.weeks || []).map((w) => {
      const aw = getWeekAway(w.id);
      return { ...w, awayDays: aw.days, awayReason: aw.reason };
    });
  }, [activeSec, awayData]);

  // Planner notes state (localStorage)
  const NOTES_KEY = "skeddo-planner-notes";
  const [notes, setNotes] = useState(() => {
    try { const raw = localStorage.getItem(NOTES_KEY); return raw ? JSON.parse(raw) : {}; } catch { return {}; }
  });
  function updateNote(weekId, progId, note) {
    setNotes((prev) => {
      const next = { ...prev, [`${weekId}-${progId}`]: note };
      localStorage.setItem(NOTES_KEY, JSON.stringify(next));
      return next;
    });
  }
  // Attach notes to week programs
  const actWeeksWithNotes = useMemo(() => {
    return actWeeks.map((w) => ({
      ...w,
      programs: w.programs.map((p) => ({ ...p, note: notes[`${w.id}-${p.id}`] || p.note || "" })),
    }));
  }, [actWeeks, notes]);

  const kidF = kidFilter === null ? "all" : kidFilter;
  const kidsArr = kids || [];

  // Planner stats
  const actTotal = actWeeksWithNotes.reduce((sum, w) => sum + weekCost(w, kidF), 0);
  const actCovered = actWeeksWithNotes.filter((w) => {
    if (w.awayDays.length >= w.dayLabels.length) return true;
    if (kidF === "all") return kidsArr.every((k) => getCov(w, k.id) !== "gap");
    return getCov(w, kidF) !== "gap";
  }).length;
  const actGaps = actWeeksWithNotes.length - actCovered;

  /* ═══════════════════════════════════════
     SETUP PAGE
     ═══════════════════════════════════════ */
  if (page === "setup") return (
    <div>
      <AnimStyles />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setPage("main")} aria-label="Back" style={{ background: "none", border: "none", color: C.muted, fontSize: 22, cursor: "pointer", padding: "4px 8px 4px 0" }}>{"\u2039"}</button>
        <div>
          <h2 style={s.pageTitle}>{setupDone ? "Edit School Calendar" : "School Calendar Setup"}</h2>
          <p style={{ fontFamily: F.sans, fontSize: 14, color: C.muted, margin: 0 }}>
            {confDist || isManual ? "Tap dates to remove. Add custom dates below." : "Enter postal code or set up manually."}
          </p>
        </div>
      </div>

      {/* Step 1: Postal / source */}
      {!confDist && !isManual && (
        <div style={{ animation: "fadeIn 0.2s ease" }}>
          <label style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.ink, display: "block", marginBottom: 6 }}>Your postal code</label>
          <input type="text" value={postal} onChange={(e) => handlePostal(e.target.value)} placeholder="e.g. V6K 1A1" maxLength={7}
            style={{ ...s.input, fontSize: 18, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }} />

          {detDist && DISTRICTS[detDist] && (
            <div style={{ marginTop: 10, padding: "12px 14px", borderRadius: 10, background: C.seaGreen + "0F", border: `1px solid ${C.seaGreen}25`, animation: "fadeUp 0.2s ease" }}>
              <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.seaGreen }}>{"\u2713"} {DISTRICTS[detDist].name}</div>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: C.muted, marginTop: 2 }}>{DISTRICTS[detDist].year}{DISTRICTS[detDist].ph ? " \u00B7 Calendar coming soon" : ""}</div>
              {!DISTRICTS[detDist].ph ? (
                <button onClick={() => { setConfDist(detDist); setIsManual(false); }} style={{ ...s.primaryBtn, marginTop: 10, width: "100%", fontSize: 14 }}>
                  Use {DISTRICTS[detDist].short} Calendar {"\u2192"}
                </button>
              ) : (
                <button onClick={() => setIsManual(true)} style={{ ...s.secondaryBtn, marginTop: 10, width: "100%", fontSize: 14 }}>Set Up Manually {"\u2192"}</button>
              )}
            </div>
          )}
          {postal.replace(/\s/g, "").length >= 3 && !detDist && (
            <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, background: C.olive + "0F", fontFamily: F.sans, fontSize: 12, color: C.olive }}>Could not match this postal code. Set up manually below.</div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontFamily: F.sans, fontSize: 11, color: C.muted }}>or</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          <button onClick={() => setIsManual(true)} style={{ width: "100%", padding: "16px", borderRadius: 14, border: `1px solid ${C.border}`, background: C.white, boxShadow: shadow, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: C.blue + "14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{"\u270F\uFE0F"}</div>
            <div>
              <div style={{ fontFamily: F.sans, fontSize: 15, fontWeight: 600, color: C.ink }}>Set up manually</div>
              <div style={{ fontFamily: F.sans, fontSize: 12, color: C.muted, lineHeight: 1.4, marginTop: 2 }}>Private school, homeschool, or add your own dates.</div>
            </div>
          </button>
        </div>
      )}

      {/* Step 2: Review / Edit */}
      {(confDist || isManual) && (
        <div style={{ animation: "fadeIn 0.2s ease" }}>
          <div style={{ padding: "10px 12px", borderRadius: 10, background: C.seaGreen + "0F", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>{isManual ? "\u270F\uFE0F" : "\uD83C\uDFEB"}</span>
              <div>
                <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.seaGreen }}>{isManual ? "Manual Setup" : dist?.name}</div>
                {dist && <div style={{ fontFamily: F.sans, fontSize: 11, color: C.muted }}>{dist.year}</div>}
              </div>
            </div>
            <button onClick={() => { setConfDist(null); setIsManual(false); }} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", fontFamily: F.sans, fontSize: 11, color: C.muted, cursor: "pointer" }}>Change</button>
          </div>

          {dist && !isManual && (
            <div style={{ padding: "10px 12px", borderRadius: 10, background: C.lilac + "0F", border: `1px solid ${C.lilac}20`, marginBottom: 14, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{"\u26A0\uFE0F"}</span>
              <div style={{ fontFamily: F.sans, fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
                <strong style={{ color: C.ink }}>Pro-D days may vary by school.</strong> Dates marked "Flexible" are set by individual schools. Double-check with your school calendar and adjust below.
              </div>
            </div>
          )}

          {dist?.proD?.length > 0 && (
            <DateList title="Pro-D & Non-Instructional Days" sub="Full day \u2014 coverage needed" icon={"\uD83D\uDCCB"} color={C.olive}
              dates={dist.proD} removed={edits.removed} onToggle={toggleRemoved} fmt={(d) => ({ a: fmtS(d.date), b: d.scope })} />
          )}
          {dist?.breaks?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <SecHeader icon={"\uD83C\uDFD6\uFE0F"} title="School Breaks" sub="Extended time off" />
              {dist.breaks.map((b) => (
                <div key={b.id} style={{ padding: "12px 14px", borderRadius: 10, background: C.white, boxShadow: shadow, marginBottom: 6, borderLeft: `3px solid ${C.blue}` }}>
                  <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.ink }}>{b.label}</div>
                  <div style={{ fontFamily: F.sans, fontSize: 12, color: C.muted, marginTop: 2 }}>{fmtS(b.start)} {"\u2013"} {fmtS(b.end)}</div>
                </div>
              ))}
            </div>
          )}
          {dist?.holidays?.length > 0 && (
            <DateList title="Holidays" sub="No school" icon={"\uD83C\uDFF3\uFE0F"} color={C.seaGreen}
              dates={dist.holidays} removed={edits.removed} onToggle={toggleRemoved} fmt={(d) => ({ a: fmtS(d.date), b: d.label })} />
          )}
          {edits.added.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <SecHeader icon={"\u270F\uFE0F"} title="Your Custom Dates" sub="Added manually" />
              {edits.added.map((a) => (
                <div key={a.date} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, background: C.white, boxShadow: shadow, marginBottom: 4, borderLeft: `3px solid ${C.olive}` }}>
                  <div>
                    <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.ink }}>{a.label}</div>
                    <div style={{ fontFamily: F.sans, fontSize: 11, color: C.muted }}>{fmtS(a.date)}</div>
                  </div>
                  <button onClick={() => setEdits((p) => ({ ...p, added: p.added.filter((x) => x.date !== a.date) }))} style={{ background: "none", border: "none", fontSize: 14, color: C.olive, cursor: "pointer", padding: 8 }}>{"\u2715"}</button>
                </div>
              ))}
            </div>
          )}

          {/* Add form */}
          {!addForm ? (
            <button onClick={() => setAddForm(true)} style={{ width: "100%", padding: "14px", borderRadius: 12, border: `1.5px dashed ${C.border}`, background: "transparent", fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.muted, cursor: "pointer", marginBottom: 20 }}>+ Add a date</button>
          ) : (
            <div style={{ padding: 16, borderRadius: 14, background: C.white, boxShadow: shadow, marginBottom: 20, animation: "fadeUp 0.2s ease" }}>
              <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 12 }}>Add a custom date</div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 500, color: C.muted, display: "block", marginBottom: 4 }}>Date</label>
                <input type="date" value={addDate} onChange={(e) => setAddDate(e.target.value)} style={{ ...s.input, fontSize: 14 }} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 500, color: C.muted, display: "block", marginBottom: 4 }}>Description</label>
                <input type="text" value={addLabel} onChange={(e) => setAddLabel(e.target.value)} placeholder="e.g. School Pro-D Day" style={{ ...s.input, fontSize: 14 }} />
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {[{ id: "proD", l: "Pro-D", c: C.olive }, { id: "break", l: "Break", c: C.blue }, { id: "holiday", l: "Holiday", c: C.seaGreen }].map((t) => (
                  <button key={t.id} onClick={() => setAddType(t.id)} style={{ flex: 1, padding: "8px 6px", borderRadius: 8, cursor: "pointer", border: addType === t.id ? `1.5px solid ${t.c}` : `1.5px solid ${C.border}`, background: addType === t.id ? `${t.c}15` : "transparent", fontFamily: F.sans, fontSize: 12, fontWeight: addType === t.id ? 600 : 400, color: addType === t.id ? t.c : C.muted }}>{t.l}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setAddForm(false)} style={{ ...s.secondaryBtn, flex: 1, padding: "10px", fontSize: 14 }}>Cancel</button>
                <button onClick={addCustomDate} disabled={!addDate || !addLabel} style={{ ...s.primaryBtn, flex: 1, padding: "10px", fontSize: 14, opacity: addDate && addLabel ? 1 : 0.5 }}>Add</button>
              </div>
            </div>
          )}

          <button onClick={saveSetup} style={{ ...s.primaryBtn, width: "100%", fontSize: 16, boxShadow: `0 4px 16px ${C.seaGreen}40` }}>
            {setupDone ? "Save Changes" : "Save & View Calendar \u2192"}
          </button>
        </div>
      )}
    </div>
  );

  /* ═══════════════════════════════════════
     DESKTOP WEEKLY GRID VIEW
     ═══════════════════════════════════════ */
  if (isDesktop && mode === "calendar") {
    const HOURS = [];
    // Determine hour range from events
    let minHour = 8, maxHour = 17;
    scheduledByDay.forEach((day) => {
      day.forEach((ev) => {
        if (ev.timeRange.start < minHour) minHour = Math.floor(ev.timeRange.start);
        if (ev.timeRange.end > maxHour) maxHour = Math.ceil(ev.timeRange.end);
      });
    });
    minHour = Math.max(minHour - 1, 6);
    maxHour = Math.min(maxHour + 1, 21);
    for (let h = minHour; h <= maxHour; h++) HOURS.push(h);

    const hourHeight = 56;
    const totalGridHeight = HOURS.length * hourHeight;
    const todayStr = dk(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    // Kid colors for event blocks
    const kidColorMap = {};
    kids.forEach((k, i) => {
      kidColorMap[k.id] = k.color || KID_COLORS[i % KID_COLORS.length]?.hex || C.muted;
    });

    return (
      <div>
        {/* Desktop mode toggle + header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={s.pageTitle}>Schedule</h2>
          <div style={{ display: "flex", background: C.ink + "0A", borderRadius: 10, padding: 3 }}>
            {[{ id: "calendar", l: "Calendar" }, { id: "planner", l: "Planner" }].map((m) => (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                padding: "7px 14px", borderRadius: 8, border: "none",
                background: mode === m.id ? C.seaGreen + "18" : "transparent",
                color: mode === m.id ? C.seaGreen : C.muted,
                fontFamily: F.sans, fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>{m.l}</button>
            ))}
          </div>
        </div>

        {/* Panel header with week navigation */}
        <div className="skeddo-panel-header" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setWeekStart((prev) => addDays(prev, -7))}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                border: `1px solid rgba(27,36,50,0.15)`, background: C.white,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: F.sans, fontSize: 16, color: C.muted,
              }}
              aria-label="Previous week"
            >
              {"\u2039"}
            </button>
            <div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, color: C.ink, margin: 0 }}>
                {formatDateShort(weekDates[0])} – {formatDateShort(weekDates[4])}
              </h2>
              <p style={{ fontFamily: F.sans, fontSize: 13, color: C.muted, margin: 0 }}>
                {totalThisWeek} event{totalThisWeek !== 1 ? "s" : ""} this week
              </p>
            </div>
            <button
              onClick={() => setWeekStart((prev) => addDays(prev, 7))}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                border: `1px solid rgba(27,36,50,0.15)`, background: C.white,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: F.sans, fontSize: 16, color: C.muted,
              }}
              aria-label="Next week"
            >
              {"\u203A"}
            </button>
            {!isThisWeek && (
              <button
                onClick={() => setWeekStart(getMonday(new Date()))}
                style={{
                  padding: "4px 12px", borderRadius: 6,
                  background: "none", border: `1px solid rgba(27,36,50,0.15)`,
                  fontFamily: F.sans, fontSize: 12, color: C.muted, cursor: "pointer",
                }}
              >
                Today
              </button>
            )}
          </div>
        </div>

        {/* Weekly grid */}
        <div style={{
          borderRadius: 12, overflow: "hidden",
          background: "rgba(27,36,50,0.08)",
          border: `0.5px solid rgba(27,36,50,0.08)`,
        }}>
          {/* Column headers: time + Mon-Fri */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "60px repeat(5, 1fr)",
            gap: 1,
          }}>
            {/* Empty time column header */}
            <div style={{ background: C.cream, height: 44 }} />
            {/* Day headers */}
            {weekDates.slice(0, 5).map((date, i) => {
              const dateStr = dk(date.getFullYear(), date.getMonth(), date.getDate());
              const isToday = dateStr === todayStr;
              return (
                <div key={i} style={{
                  background: isToday ? "rgba(45,159,111,0.06)" : C.cream,
                  height: 44, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{
                    fontFamily: F.sans, fontSize: 12, fontWeight: 500,
                    color: isToday ? C.seaGreen : C.ink,
                  }}>
                    {DAY_NAMES[i]}
                  </div>
                  <div style={{
                    fontFamily: F.sans, fontSize: 11, color: isToday ? C.seaGreen : C.muted,
                  }}>
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time grid rows */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "60px repeat(5, 1fr)",
            gap: 1,
          }}>
            {HOURS.map((hour) => (
              <div key={`row-${hour}`} style={{ display: "contents" }}>
                {/* Time label */}
                <div style={{
                  background: C.white,
                  minHeight: hourHeight,
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                  paddingRight: 8,
                  paddingTop: 2,
                }}>
                  <span style={{ fontFamily: F.sans, fontSize: 11, color: C.muted }}>
                    {hour === 0 ? "12 AM" : hour <= 12 ? `${hour} ${hour < 12 ? "AM" : "PM"}` : `${hour - 12} PM`}
                  </span>
                </div>

                {/* Day cells */}
                {weekDates.slice(0, 5).map((date, dayIdx) => {
                  const dateStr = dk(date.getFullYear(), date.getMonth(), date.getDate());
                  const isToday = dateStr === todayStr;
                  // Find events that start in this hour
                  const dayEvents = scheduledByDay[dayIdx] || [];
                  const eventsInHour = dayEvents.filter((ev) => {
                    return Math.floor(ev.timeRange.start) === hour;
                  });

                  return (
                    <div key={`${hour}-${dayIdx}`} style={{
                      background: isToday ? "rgba(45,159,111,0.02)" : C.white,
                      minHeight: hourHeight,
                      position: "relative",
                      padding: 2,
                      borderTop: hour > minHour ? "1px solid rgba(27,36,50,0.04)" : "none",
                    }}>
                      {eventsInHour.map((ev, evIdx) => {
                        const durationHours = ev.timeRange.end - ev.timeRange.start;
                        const blockHeight = Math.max(durationHours * hourHeight - 4, 20);
                        // Determine kid color from first kid
                        const kidId = ev.kidIds?.[0];
                        const color = kidId ? (kidColorMap[kidId] || C.seaGreen) : C.seaGreen;
                        const kidName = kidId ? kids.find((k) => k.id === kidId)?.name : null;
                        // Handle overlapping events
                        const overlaps = eventsInHour.length;
                        const width = overlaps > 1 ? `calc(${100 / overlaps}% - 2px)` : "calc(100% - 4px)";
                        const left = overlaps > 1 ? `calc(${(evIdx * 100) / overlaps}% + 1px)` : "2px";

                        return (
                          <div
                            key={ev.id}
                            onClick={() => onOpenDetail(ev)}
                            style={{
                              position: "absolute",
                              top: 2,
                              left: left,
                              width: width,
                              height: blockHeight,
                              borderRadius: 6,
                              padding: "4px 6px",
                              background: `${color}14`,
                              borderLeft: `2px solid ${color}`,
                              cursor: "pointer",
                              overflow: "hidden",
                              transition: "box-shadow 0.15s",
                              zIndex: 1,
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 2px 6px rgba(27,36,50,0.1)"}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                          >
                            <div style={{
                              fontFamily: F.sans, fontSize: 11, fontWeight: 600,
                              color: color, lineHeight: 1.3,
                              overflow: "hidden", textOverflow: "ellipsis",
                              whiteSpace: durationHours >= 2 ? "normal" : "nowrap",
                            }}>
                              {ev.name}
                            </div>
                            {kidName && durationHours >= 1 && (
                              <div style={{
                                fontFamily: F.sans, fontSize: 11, color: color,
                                opacity: 0.7, marginTop: 2,
                              }}>
                                {kidName}
                              </div>
                            )}
                            {durationHours >= 2 && ev.times && (
                              <div style={{
                                fontFamily: F.sans, fontSize: 11, color: color,
                                opacity: 0.5, marginTop: 1,
                              }}>
                                {ev.times}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     MAIN PAGE
     ═══════════════════════════════════════ */
  return (
    <div>
      <AnimStyles />

      {/* Header with Calendar/Planner toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 0 }}>
        <div>
          <h2 style={s.pageTitle}>Schedule</h2>
          <p style={{ fontFamily: F.sans, fontSize: 16, color: C.muted, marginBottom: 16, marginTop: 0 }}>
            {mode === "calendar" ? "Your week at a glance" : "Break coverage planner"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {/* Calendar/Planner toggle — no emojis */}
          <div style={{ display: "flex", background: C.ink + "0A", borderRadius: 10, padding: 3 }}>
            {[{ id: "calendar", l: "Calendar" }, { id: "planner", l: "Planner" }].map((m) => (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                padding: "7px 14px", borderRadius: 8, border: "none",
                background: mode === m.id ? C.seaGreen + "18" : "transparent",
                color: mode === m.id ? C.seaGreen : C.muted,
                fontFamily: F.sans, fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>{m.l}</button>
            ))}
          </div>

        </div>
      </div>

      {/* Setup prompt banner — dismissible, full-width, no emoji */}
      {!setupDone && !dismissedSetupBanner && mode === "calendar" && (
        <div style={{ marginBottom: 12, padding: "12px 16px", borderRadius: 10, background: C.seaGreen + "12", display: "flex", alignItems: "center", gap: 10 }}>
          <div onClick={() => setPage("setup")} style={{ flex: 1, cursor: "pointer", fontFamily: F.sans, fontSize: 14, fontWeight: 500, color: C.ink }}>
            Set up your school calendar to see Pro-D days and breaks
          </div>
          <button onClick={(e) => { e.stopPropagation(); setDismissedSetupBanner(true); }} style={{
            background: "none", border: "none", cursor: "pointer", padding: "2px 6px",
            fontFamily: F.sans, fontSize: 16, color: C.muted, lineHeight: 1,
          }}>{"\u2715"}</button>
        </div>
      )}

      {/* ═══ CALENDAR MODE ═══ */}
      {mode === "calendar" && (
        <div>
          {/* Visibility panel */}
          {showVisibilityPanel && (
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: "14px 16px", marginBottom: 12, animation: "fadeIn 0.2s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 700, color: C.ink, textTransform: "uppercase", letterSpacing: 0.5 }}>Calendar Visibility</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={showAllPrograms} style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 700, color: C.seaGreen, background: "none", border: "none", cursor: "pointer" }}>Show All</button>
                  <button onClick={hideAllPrograms} style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 700, color: C.muted, background: "none", border: "none", cursor: "pointer" }}>Hide All</button>
                </div>
              </div>
              {programs.length === 0 ? (
                <div style={{ fontFamily: F.sans, fontSize: 14, color: C.muted, textAlign: "center", padding: "12px 0" }}>No programs added yet.</div>
              ) : programs.map((p) => {
                const isVisible = !hiddenPrograms.has(p.id);
                const st = STATUS_MAP[p.status] || STATUS_MAP.Exploring;
                return (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}20` }}>
                    <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                      <span style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 700, color: st.color, textTransform: "uppercase", flexShrink: 0 }}>{p.status}</span>
                    </div>
                    <button onClick={() => toggleHidden(p.id)} aria-label={isVisible ? `Hide ${p.name}` : `Show ${p.name}`} style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: isVisible ? C.seaGreen : "#D1D5DB", cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 0.2s ease" }}>
                      <span style={{ position: "absolute", top: 2, left: isVisible ? 22 : 2, width: 20, height: 20, borderRadius: 10, background: "#fff", boxShadow: "0 1px 3px rgba(27,36,50,0.2)", transition: "left 0.2s ease" }} />
                    </button>
                  </div>
                );
              })}
              <div style={{ fontFamily: F.sans, fontSize: 14, color: C.muted, marginTop: 8, textAlign: "center" }}>
                {hiddenPrograms.size > 0 ? `${hiddenPrograms.size} program${hiddenPrograms.size !== 1 ? "s" : ""} hidden` : "All programs visible"}
              </div>
            </div>
          )}

          {/* School calendar legend */}
          {setupDone && (
            <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "8px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                {[{ c: C.olive, l: "Pro-D", n: evCounts.proD }, { c: C.blue, l: "Break", n: evCounts.break }, { c: C.seaGreen, l: "Holiday", n: evCounts.holiday }].map((x) => (
                  <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 0" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: x.c }} />
                    <span style={{ fontFamily: F.sans, fontSize: 11, color: C.muted }}>{x.l} ({x.n})</span>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", marginTop: 4 }}>
                <span style={{ fontFamily: F.sans, fontSize: 11, color: C.lilac, fontWeight: 500 }}>{"\u26A0\uFE0F"} Pro-D days may vary by school {"\u00B7"} <span onClick={() => setPage("setup")} style={{ textDecoration: "underline", cursor: "pointer" }}>verify & edit</span></span>
              </div>
            </div>
          )}

          {/* Conflict warnings */}
          {!dismissedConflicts && conflicts.filter((c) => c.type === "conflict").length > 0 && (() => {
            const conflictDates = formatConflictDates(conflicts.filter((c) => c.type === "conflict"));
            return (
              <div style={{ background: C.dangerBg, borderLeft: `3px solid ${C.danger}`, borderRadius: 12, padding: "12px 16px", marginBottom: 12, position: "relative" }}>
                <button onClick={() => setDismissedConflicts(true)} aria-label="Dismiss conflicts" style={{ position: "absolute", top: 8, right: 10, background: "none", border: "none", color: "#991B1B", fontSize: 18, cursor: "pointer", padding: "0 4px", lineHeight: 1 }}>{"\u00D7"}</button>
                <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 700, color: "#991B1B", marginBottom: 6 }}>{"\u26A0\uFE0F"} Scheduling Heads Up</div>
                <div style={{ fontFamily: F.sans, fontSize: 14, color: "#7F1D1D", lineHeight: 1.5 }}>{conflictDates}</div>
              </div>
            );
          })()}

          {!dismissedLogistics && conflicts.filter((c) => c.type === "logistics").length > 0 && (() => {
            const logisticsDates = formatConflictDates(conflicts.filter((c) => c.type === "logistics"));
            return (
              <div style={{ background: "#FFFBEB", borderLeft: "3px solid #F4A261", borderRadius: 12, padding: "12px 16px", marginBottom: 12, position: "relative" }}>
                <button onClick={() => setDismissedLogistics(true)} aria-label="Dismiss logistics alerts" style={{ position: "absolute", top: 8, right: 10, background: "none", border: "none", color: "#92400E", fontSize: 18, cursor: "pointer", padding: "0 4px", lineHeight: 1 }}>{"\u00D7"}</button>
                <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 700, color: "#92400E", marginBottom: 6 }}>{"\uD83D\uDCCB"} Logistics Heads-Up</div>
                <div style={{ fontFamily: F.sans, fontSize: 14, color: "#78350F", lineHeight: 1.5 }}>{logisticsDates}</div>
              </div>
            );
          })()}

          {/* Kid filter + visibility filter button */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <KidFilterBar kids={kids} kidFilter={kidFilter} onKidFilter={onKidFilter} />
            </div>
            <button onClick={() => setShowVisibilityPanel((v) => !v)} aria-label="Show or hide programs on calendar" style={{
              background: showVisibilityPanel ? C.seaGreen : C.white,
              color: showVisibilityPanel ? "#fff" : C.ink,
              border: `1.5px solid ${showVisibilityPanel ? C.seaGreen : C.border}`,
              borderRadius: 10, width: 38, height: 38, fontSize: 16, cursor: "pointer", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              {hiddenPrograms.size > 0 && (
                <span style={{ position: "absolute", top: -5, right: -5, background: C.olive, color: "#fff", borderRadius: 8, minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.sans, fontSize: 11, fontWeight: 700, padding: "0 4px" }}>
                  {hiddenPrograms.size}
                </span>
              )}
            </button>
          </div>

          {/* Status filter chips */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {[
              { key: "Enrolled", label: "Enrolled", color: C.seaGreen, icon: "\u2713" },
              { key: "Waitlist", label: "Waitlist", color: C.olive, icon: "\u25F7" },
              { key: "Exploring", label: "Exploring", color: C.blue, icon: "\u25C7" },
            ].map((st) => {
              const isActive = visibleStatuses.has(st.key);
              return (
                <button key={st.key} onClick={() => {
                  setVisibleStatuses((prev) => {
                    const next = new Set(prev);
                    if (next.has(st.key)) { if (next.size > 1) next.delete(st.key); }
                    else next.add(st.key);
                    return next;
                  });
                }} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                  fontFamily: F.sans, fontSize: 14, fontWeight: 700,
                  border: `1.5px solid ${isActive ? st.color : C.border}`,
                  background: isActive ? st.color + "18" : "transparent",
                  color: isActive ? st.color : C.muted, minHeight: 36, transition: "all 0.15s",
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: isActive ? st.color : C.border }} />
                  {st.label}
                </button>
              );
            })}
          </div>

          {/* Mini calendar */}
          <MiniCalendar currentMonday={weekStart} onSelectWeek={setWeekStart} programs={visiblePrograms} kids={kids} covMap={setupDone ? covMap : null} setupDone={setupDone} />

          {/* Week navigator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, marginTop: 8 }}>
            <button onClick={() => setWeekStart(addDays(weekStart, -7))} aria-label="Previous week" style={{ ...s.secondaryBtn, flex: "none", width: 44, height: 44, padding: 0, fontSize: 20, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{"\u2039"}</button>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: F.serif, fontSize: 16, color: C.ink }}>
                {formatDateShort(weekStart)} {"\u2013"} {formatDateShort(weekEnd)}, {weekEnd.getFullYear()}
              </div>
              <div style={{ fontFamily: F.sans, fontSize: 14, color: C.muted, marginTop: 2 }}>
                {totalThisWeek} program{totalThisWeek !== 1 ? "s" : ""} this week
              </div>
            </div>
            <button onClick={() => setWeekStart(addDays(weekStart, 7))} aria-label="Next week" style={{ ...s.secondaryBtn, flex: "none", width: 44, height: 44, padding: 0, fontSize: 20, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{"\u203A"}</button>
          </div>

          {!isThisWeek && (
            <button onClick={() => setWeekStart(getMonday(new Date()))} aria-label="Jump to this week" style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 700, color: C.seaGreen, background: "none", border: "none", cursor: "pointer", marginBottom: 12, display: "block", marginLeft: "auto", marginRight: "auto" }}>
              Jump to this week
            </button>
          )}

          {/* Day columns with selected date info from school calendar */}
          <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {weekDates.map((date, dayIdx) => {
              const dayPrograms = scheduledByDay[dayIdx];
              const isToday = new Date().toDateString() === date.toDateString();
              const isWeekend = dayIdx >= 5;
              const dateKey = dk(date.getFullYear(), date.getMonth(), date.getDate());
              const covEntry = setupDone ? covMap[dateKey] : null;

              return (
                <div key={dayIdx} style={{
                  background: isToday ? `${C.seaGreen}08` : covEntry ? `${covEntry.type === "proD" ? C.olive : covEntry.type === "break" ? C.blue : covEntry.type === "holiday" ? C.seaGreen : C.lilac}08` : C.white,
                  borderRadius: 12,
                  border: isToday ? `2px solid ${C.seaGreen}` : `1px solid ${C.border}`,
                  padding: "10px 12px", minHeight: 56,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: dayPrograms.length > 0 || covEntry ? 8 : 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 700, color: isToday ? C.seaGreen : C.muted, textTransform: "uppercase", letterSpacing: 0.5, width: 30 }}>
                        {DAY_NAMES[dayIdx]}
                      </span>
                      <span style={{ fontFamily: F.serif, fontSize: 15, color: isToday ? C.seaGreen : C.ink }}>{date.getDate()}</span>
                      {isToday && <span style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 700, color: C.cream, background: C.seaGreen, padding: "2px 6px", borderRadius: 4, textTransform: "uppercase" }}>Today</span>}
                      {covEntry && <TypeBadge type={covEntry.type} />}
                    </div>
                    {dayPrograms.length === 0 && !covEntry && totalThisWeek > 0 && (
                      <span style={{ fontFamily: F.sans, fontSize: 14, color: isWeekend ? C.muted : C.border, fontWeight: 500 }}>
                        {isWeekend ? "Weekend" : "Free"}
                      </span>
                    )}
                  </div>

                  {covEntry && covEntry.type !== "summer" && dayPrograms.length === 0 && (
                    <div style={{ padding: "8px 10px", borderRadius: 8, background: C.olive + "0A", border: `1px dashed ${C.olive}30`, marginBottom: 4 }}>
                      <div style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 500, color: C.olive }}>{"\u26A0\uFE0F"} {covEntry.label} {"\u2014"} coverage needed</div>
                      {onNavigateToDiscover && <button onClick={onNavigateToDiscover} style={{ marginTop: 6, padding: "4px 12px", borderRadius: 6, border: "none", background: C.seaGreen, color: C.white, fontFamily: F.sans, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Browse Programs</button>}
                    </div>
                  )}

                  {dayPrograms.map((prog, i) => {
                    const st = STATUS_MAP[prog.status] || STATUS_MAP.Exploring;
                    const assignedKids = (prog.kidIds || []).map((kid) => kids.find((k) => k.id === kid)).filter(Boolean);
                    return (
                      <div key={prog.id + "-" + i} onClick={() => onOpenDetail(prog)} role="button" tabIndex={0} aria-label={`View ${prog.name}, ${prog.times || "TBD"}`} style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 8,
                        background: st.bg,
                        border: prog.status === "Exploring" ? `1.5px dashed ${C.blue}50` : prog.status === "Waitlist" ? `1.5px solid ${C.olive}30` : "1.5px solid transparent",
                        marginBottom: i < dayPrograms.length - 1 ? 4 : 0, cursor: "pointer", transition: "transform 0.1s",
                      }}>
                        <div style={{ width: 3, height: 28, borderRadius: 2, background: st.color, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 700, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{prog.name}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                            <span style={{ fontFamily: F.sans, fontSize: 14, color: C.muted }}>{prog.times || "TBD"}</span>
                            {assignedKids.length > 0 && (
                              <>
                                <span style={{ color: C.border, fontSize: 14 }}>{"\u00B7"}</span>
                                {assignedKids.map((k) => (
                                  <span key={k.id} title={k.name} aria-label={k.name} style={{
                                    width: 18, height: 18, borderRadius: 6,
                                    background: getKidColor(k, kids), color: C.cream,
                                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: F.serif, fontSize: 11, fontWeight: 700, lineHeight: 1, flexShrink: 0,
                                  }}>
                                    {k.name?.[0]?.toUpperCase()}
                                  </span>
                                ))}
                              </>
                            )}
                          </div>
                        </div>
                        <span style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 700, color: st.color, textTransform: "uppercase" }}>{prog.status}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {totalThisWeek === 0 && (
            <div style={{ ...s.emptyState, marginTop: 16 }}>
              <span style={{ fontSize: 28 }}>{"\uD83D\uDCC5"}</span>
              <p style={{ marginTop: 8 }}>No programs scheduled this week.</p>
              <p style={{ fontSize: 14, color: C.muted }}>Try navigating to a different week, or add programs from the Search tab.</p>
              {onNavigateToDiscover && (
                <button onClick={onNavigateToDiscover} aria-label="Browse programs in the Search tab" style={{ ...s.primaryBtn, marginTop: 12, padding: "10px 24px", fontSize: 14, flex: "none" }}>
                  Browse Programs
                </button>
              )}
            </div>
          )}

          {/* Export button — below week view */}
          <button onClick={openExportModal} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", padding: "12px", marginTop: 16,
            background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 10,
            fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.blue,
            cursor: "pointer",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Calendar
          </button>
        </div>
      )}

      {/* ═══ PLANNER MODE ═══ */}
      {mode === "planner" && (
        <div style={{ animation: "fadeIn 0.2s ease" }}>
          {/* Kid filter — hidden on desktop where the sidebar already has it */}
          {!isDesktop && <KidFilterBar kids={kids} kidFilter={kidFilter} onKidFilter={onKidFilter} />}

          {/* Section tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 2 }}>
            {breakSections.map((sec) => {
              const active = planSec === sec.id;
              const gaps = sec.weeks.filter((w) => {
                const aw = getWeekAway(w.id);
                if (aw.days.length >= w.dayLabels.length) return false;
                if (kidF === "all") return kidsArr.some((k) => getCov({ ...w, awayDays: aw.days }, k.id) === "gap");
                return getCov({ ...w, awayDays: aw.days }, kidF) === "gap";
              }).length;
              return (
                <button key={sec.id} onClick={() => { setPlanSec(sec.id); setExpWeek(null); }} style={{
                  padding: "10px 16px", borderRadius: 12,
                  border: active ? `1.5px solid ${sec.color}` : `1px solid ${C.border}20`,
                  background: active ? C.white : "transparent", boxShadow: active ? shadow : "none",
                  cursor: "pointer", flexShrink: 0, textAlign: "left",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 5, background: sec.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: active ? C.ink : C.muted }}>{sec.label}</span>
                  </div>
                  <div style={{ fontFamily: F.sans, fontSize: 11, color: C.muted }}>
                    {sec.dates} {gaps > 0 && <span style={{ color: C.olive, fontWeight: 600 }}>{"\u00B7"} {gaps} gap{gaps > 1 ? "s" : ""}</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Summary bar */}
          <div style={{ display: "flex", background: C.white, borderRadius: 12, boxShadow: shadow, marginBottom: 12 }}>
            <SumCell label="Cost" value={`$${actTotal.toLocaleString()}`} color={C.ink} />
            <div style={{ width: 1, background: C.border + "40" }} />
            <SumCell label="Coverage" value={`${actCovered}/${actWeeksWithNotes.length}`} color={actGaps > 0 ? C.olive : C.seaGreen} />
            <div style={{ width: 1, background: C.border + "40" }} />
            <SumCell label="Status" value={actGaps === 0 ? "Ready" : "Gaps"} color={actGaps === 0 ? C.seaGreen : C.lilac} />
          </div>

          {/* Week rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {actWeeksWithNotes.map((week, i) => {
              const progs = week.programs.filter((p) => kidF === "all" || p.kid === kidF);
              const wc = weekCost(week, kidF);
              const fa = week.awayDays.length >= week.dayLabels.length;
              const hasGap = !fa && (kidF === "all" ? kidsArr.some((k) => getCov(week, k.id) === "gap") : getCov(week, kidF) === "gap");
              const isExp = expWeek === week.id;

              return (
                <WeekCard
                  key={week.id}
                  week={week}
                  progs={progs}
                  wc={wc}
                  gap={hasGap}
                  away={fa}
                  exp={isExp}
                  kidF={kidF}
                  kids={kidsArr}
                  idx={i}
                  onTog={() => setExpWeek(isExp ? null : week.id)}
                  onNote={(pid) => setSheet({ t: "note", wk: week.id, pid })}
                  onAway={() => setSheet({ t: "away", wk: week.id })}
                  onNavigateToDiscover={onNavigateToDiscover}
                />
              );
            })}
          </div>

          {kidsArr.length === 0 && (
            <div style={{ ...s.emptyState, marginTop: 16 }}>
              <span style={{ fontSize: 28 }}>{"\uD83D\uDDD3\uFE0F"}</span>
              <p style={{ marginTop: 8 }}>Add kids from the Home tab to see per-kid coverage.</p>
            </div>
          )}
        </div>
      )}

      {/* ─── Bottom sheets ─── */}
      {sheet && (
        <BottomSheet onClose={() => setSheet(null)}>
          {sheet.t === "note" ? (
            <NoteEditor
              week={actWeeksWithNotes.find((w) => w.id === sheet.wk)}
              pid={sheet.pid}
              onSave={(n) => { updateNote(sheet.wk, sheet.pid, n); setSheet(null); }}
              onClose={() => setSheet(null)}
            />
          ) : (
            <AwayEditor
              week={actWeeksWithNotes.find((w) => w.id === sheet.wk)}
              onToggle={(d) => updateAway(sheet.wk, (cur) => ({ ...cur, days: cur.days.includes(d) ? cur.days.filter((x) => x !== d) : [...cur.days, d] }))}
              onReason={(r) => updateAway(sheet.wk, (cur) => ({ ...cur, reason: r }))}
              onAll={() => {
                const w = actWeeksWithNotes.find((x) => x.id === sheet.wk);
                if (w) updateAway(sheet.wk, (cur) => ({ ...cur, days: [...w.dayLabels] }));
              }}
              onClear={() => updateAway(sheet.wk, (cur) => ({ ...cur, days: [] }))}
              onClose={() => setSheet(null)}
            />
          )}
        </BottomSheet>
      )}

      {/* ─── Export Modal ─── */}
      {showExport && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(27,36,50,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowExport(false); }}>
          <div style={{ background: C.white, borderRadius: 20, width: "100%", maxWidth: 420, maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 32px rgba(27,36,50,0.18)" }}>
            <div style={{ padding: "18px 20px 12px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontFamily: F.serif, fontSize: 20, color: C.ink, margin: 0 }}>Export Calendar</h3>
                <button onClick={() => setShowExport(false)} style={{ background: "none", border: "none", fontSize: 22, color: C.muted, cursor: "pointer", padding: "0 4px" }}>{"\u00D7"}</button>
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Export for</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button onClick={() => { setExportKidFilter("all"); setExportSelected(new Set()); }} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: F.sans, border: `1px solid ${exportKidFilter === "all" ? C.seaGreen : C.border}`, background: exportKidFilter === "all" ? C.seaGreen + "18" : "transparent", color: exportKidFilter === "all" ? C.seaGreen : C.muted }}>All Kids</button>
                  {(kids || []).map((k) => (
                    <button key={k.id} onClick={() => { setExportKidFilter(k.id); setExportSelected(new Set()); }} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: F.sans, border: `1px solid ${exportKidFilter === k.id ? C.seaGreen : C.border}`, background: exportKidFilter === k.id ? C.seaGreen + "18" : "transparent", color: exportKidFilter === k.id ? C.seaGreen : C.muted }}>{k.name}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Date Range</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {[{ key: "all", label: "All Dates" }, { key: "week", label: "This Week" }, { key: "month", label: "By Month" }, { key: "custom", label: "Custom" }].map((opt) => (
                    <button key={opt.key} onClick={() => { setExportDateMode(opt.key); setExportSelected(new Set()); }} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: F.sans, border: `1px solid ${exportDateMode === opt.key ? C.blue : C.border}`, background: exportDateMode === opt.key ? C.blue + "18" : "transparent", color: exportDateMode === opt.key ? C.blue : C.muted }}>{opt.label}</button>
                  ))}
                  {exportDateMode === "month" && (
                    <input type="month" value={exportMonth} onChange={(e) => { setExportMonth(e.target.value); setExportSelected(new Set()); }} style={{ fontFamily: F.sans, fontSize: 14, padding: "5px 8px", borderRadius: 8, border: `1px solid ${C.border}`, color: C.ink }} />
                  )}
                </div>
                {exportDateMode === "custom" && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                    <input type="date" value={exportCustomStart} onChange={(e) => { setExportCustomStart(e.target.value); setExportSelected(new Set()); }} style={{ flex: 1, fontFamily: F.sans, fontSize: 14, padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, color: C.ink, minHeight: 40 }} />
                    <span style={{ fontFamily: F.sans, fontSize: 14, color: C.muted }}>to</span>
                    <input type="date" value={exportCustomEnd} onChange={(e) => { setExportCustomEnd(e.target.value); setExportSelected(new Set()); }} style={{ flex: 1, fontFamily: F.sans, fontSize: 14, padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, color: C.ink, minHeight: 40 }} />
                  </div>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.ink }}>{exportablePrograms.length} program{exportablePrograms.length !== 1 ? "s" : ""} {"\u00B7"} {exportSelected.size} selected</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={selectAllExport} style={{ fontFamily: F.sans, fontSize: 14, color: C.seaGreen, fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Select All</button>
                  <button onClick={selectNoneExport} style={{ fontFamily: F.sans, fontSize: 14, color: C.muted, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Clear</button>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px" }}>
              {exportablePrograms.length === 0 ? (
                <div style={{ fontFamily: F.sans, fontSize: 14, color: C.muted, textAlign: "center", padding: "24px 0" }}>No enrolled programs match these filters.</div>
              ) : exportablePrograms.map((p) => {
                const isChecked = exportSelected.has(p.id);
                const pKids = (p.kidIds || []).map((id) => (kids || []).find((k) => k.id === id)?.name).filter(Boolean);
                return (
                  <div key={p.id} onClick={() => toggleExportProgram(p.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${C.border}20`, cursor: "pointer" }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, border: `2px solid ${isChecked ? C.seaGreen : C.border}`, background: isChecked ? C.seaGreen : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: C.cream, fontSize: 14 }}>
                      {isChecked ? "\u2713" : ""}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 700, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                      <div style={{ fontFamily: F.sans, fontSize: 14, color: C.muted }}>{[p.days, p.times, pKids.length > 0 ? pKids.join(", ") : null].filter(Boolean).join(" \u00B7 ")}</div>
                      {p.startDate && <div style={{ fontFamily: F.sans, fontSize: 11, color: C.muted }}>{p.startDate}{p.endDate && p.endDate !== p.startDate ? ` \u2013 ${p.endDate}` : ""}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "12px 20px 18px", borderTop: `1px solid ${C.border}` }}>
              <button onClick={() => {
                const toExport = exportablePrograms.filter((p) => exportSelected.has(p.id));
                downloadAllICS(toExport);
                trackEvent("export_calendar", { program_count: toExport.length });
                setShowExport(false);
              }} disabled={exportSelected.size === 0} style={{ ...s.primaryBtn, width: "100%", marginBottom: 8, opacity: exportSelected.size === 0 ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Download .ics ({exportSelected.size})
              </button>
              <div style={{ fontFamily: F.sans, fontSize: 14, color: C.muted, textAlign: "center", lineHeight: 1.4 }}>Works with Apple Calendar, Google Calendar, and Outlook</div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {schedToast && (
        <div role="status" aria-live="polite" style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: C.ink, color: C.cream, fontFamily: F.sans, fontSize: 14, fontWeight: 600, padding: "12px 20px", borderRadius: 10, boxShadow: "0 4px 16px rgba(27,36,50,0.2)", zIndex: 9999, animation: "fadeIn 0.2s ease", whiteSpace: "nowrap" }}>
          {schedToast}
        </div>
      )}
    </div>
  );
}
