import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { C, STATUS_MAP, KID_COLORS } from "../constants/brand";
import { s } from "../styles/shared";
import KidFilterBar from "../components/KidFilterBar";
import { downloadAllICS, detectConflicts } from "../utils/helpers";
import { trackEvent } from "../utils/analytics";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

function parseDays(daysStr, startDate, endDate) {
  if (daysStr) {
    const s = daysStr.toLowerCase().replace(/\u2013/g, "-");
    const result = [];
    // Handle range patterns
    if (s.includes("mon-fri") || s.includes("monday-friday") || s.includes("weekdays")) return [0, 1, 2, 3, 4];
    if (s.includes("mon-sat")) return [0, 1, 2, 3, 4, 5];
    if (s.includes("mon-thu") || s.includes("monday-thursday")) return [0, 1, 2, 3];
    // Handle full day names and abbreviations
    const fullNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const shortNames = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    shortNames.forEach((name, i) => {
      if (s.includes(fullNames[i]) || s.includes(name)) result.push(i);
    });
    if (result.length > 0) return result;
  }
  // Fallback: if no days parsed but we have start and end dates, assume Mon-Fri (weekdays)
  if (startDate && endDate) {
    return [0, 1, 2, 3, 4]; // Mon-Fri default
  }
  if (startDate && !endDate) {
    // Single date — figure out which weekday it falls on
    const d = new Date(startDate + "T00:00:00");
    const jsDay = d.getDay(); // 0=Sun, 1=Mon...
    const mapped = jsDay === 0 ? 6 : jsDay - 1; // convert to 0=Mon
    return [mapped];
  }
  return [];
}

function parseTime(timeStr) {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return parseInt(match[1]) + parseInt(match[2]) / 60;
}

function parseTimeRange(timesStr) {
  if (!timesStr) return { start: 9, end: 12 };
  const parts = timesStr.split(/[-\u2013]/);
  const start = parseTime(parts[0]) || 9;
  const end = parseTime(parts[1]) || start + 3;
  return { start, end };
}

function isDateInRange(date, startDate, endDate) {
  if (!startDate && !endDate) return true;
  const d = date.getTime();
  if (startDate && d < new Date(startDate).getTime()) return false;
  if (endDate && d > new Date(endDate).getTime()) return false;
  return true;
}

/* ─── Format conflict dates into a readable string ─── */
const FULL_MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function formatConflictDates(conflictList) {
  // Collect all unique dates from all conflicts
  const dateSet = new Set();
  conflictList.forEach((c) => {
    (c.dates || []).forEach((d) => {
      const dt = new Date(d);
      dateSet.add(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`);
    });
  });
  if (dateSet.size === 0) return "";
  // Sort dates chronologically
  const sorted = [...dateSet].sort();
  // Group by month+year
  const groups = {};
  sorted.forEach((ds) => {
    const [y, m, d] = ds.split("-").map(Number);
    const key = `${y}-${m}`;
    if (!groups[key]) groups[key] = { year: y, month: m, days: [] };
    groups[key].days.push(d);
  });
  const groupKeys = Object.keys(groups).sort();
  // Format each group
  const parts = groupKeys.map((key) => {
    const g = groups[key];
    const monthName = FULL_MONTHS[g.month - 1];
    if (g.days.length === 1) return `${monthName} ${g.days[0]}`;
    const allButLast = g.days.slice(0, -1).join(", ");
    return `${monthName} ${allButLast} and ${g.days[g.days.length - 1]}`;
  });
  // If all in same month, it will be one part. If across months, join with ", "
  return parts.join(", ");
}

/* ─── Fallback kid colors if kid.color is not set ─── */
const KID_COLORS_FALLBACK = [C.seaGreen, C.blue, C.lilac, C.olive, "#E06C50", "#5BB5A2"];

/* ─── Build a map of date → [{ kidColor, status }, …] for the visible month ─── */
function buildBookingMap(programs, kids, year, month) {
  const map = {}; // "YYYY-MM-DD" → array of { kidColor, status }
  programs.forEach((p) => {
    const dayIndices = parseDays(p.days);
    if (dayIndices.length === 0) return;
    const status = p.status || "Exploring";
    // Determine kid colors for this program
    const assignedKids = (p.kidIds || []).map((id) => (kids || []).find((k) => k.id === id)).filter(Boolean);
    const kidColors = assignedKids.length > 0
      ? assignedKids.map((k) => {
          const kidIdx = (kids || []).findIndex((kk) => kk.id === k.id);
          return k.color || KID_COLORS[kidIdx >= 0 ? kidIdx % KID_COLORS.length : 0]?.hex || C.muted;
        })
      : [C.muted]; // unassigned programs get muted color
    // Iterate every day of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dow = date.getDay();
      const calIdx = dow === 0 ? 6 : dow - 1; // Mon=0 … Sun=6
      if (!dayIndices.includes(calIdx)) continue;
      if (!isDateInRange(date, p.startDate, p.endDate)) continue;
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      if (!map[key]) map[key] = [];
      kidColors.forEach((kc) => {
        // Avoid duplicate kid+status combos on same date
        if (!map[key].some((e) => e.kidColor === kc && e.status === status)) {
          map[key].push({ kidColor: kc, status });
        }
      });
    }
  });
  return map;
}

/* ─── Mini Calendar ─── */
function MiniCalendar({ currentMonday, onSelectWeek, programs, kids }) {
  // Independent month navigation state — starts at the week view's month
  const [calMonth, setCalMonth] = useState(() => ({
    year: currentMonday.getFullYear(),
    month: currentMonday.getMonth(),
  }));

  // Sync when currentMonday's month changes (e.g. user taps "Today" button)
  useEffect(() => {
    const m = currentMonday.getMonth();
    const y = currentMonday.getFullYear();
    setCalMonth((prev) => {
      if (prev.month === m && prev.year === y) return prev;
      return { year: y, month: m };
    });
  }, [currentMonday.getMonth(), currentMonday.getFullYear()]);

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
    for (let d = 0; d < 7; d++) {
      week.push(dayNum);
      dayNum++;
    }
    weeks.push(week);
    if (dayNum > daysInMonth) break;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build booking map for this month — tracks status colors per date
  const bookingMap = useMemo(
    () => buildBookingMap(programs || [], kids || [], year, month),
    [programs, kids, year, month]
  );

  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{
        background: C.white,
        borderRadius: 14,
        padding: 12,
        marginBottom: 16,
        border: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <button
          onClick={goToPrevMonth}
          aria-label="Previous month"
          style={{
            ...s.secondaryBtn,
            flex: "none",
            width: 44,
            height: 44,
            padding: 0,
            fontSize: 20,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ‹
        </button>
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: C.ink,
            textAlign: "center",
          }}
        >
          {monthLabel}
        </div>
        <button
          onClick={goToNextMonth}
          aria-label="Next month"
          style={{
            ...s.secondaryBtn,
            flex: "none",
            width: 44,
            height: 44,
            padding: 0,
            fontSize: 20,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ›
        </button>
      </div>

      {/* Legend — two rows: kids then statuses */}
      <div style={{ marginBottom: 8 }}>
        {/* Kid colors */}
        {(kids || []).length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 4 }}>
            {(kids || []).map((k) => {
              const kidIdx = (kids || []).findIndex((kk) => kk.id === k.id);
              const kidColor = k.color || KID_COLORS[kidIdx >= 0 ? kidIdx % KID_COLORS.length : 0]?.hex || C.muted;
              return (
                <div key={k.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: kidColor, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, color: C.ink }}>{k.name}</span>
                </div>
              );
            })}
          </div>
        )}
        {/* Status shapes */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: C.ink, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>Enrolled</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: "transparent", border: `1.5px solid ${C.ink}`, boxSizing: "border-box", flexShrink: 0 }} />
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>Waitlist</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: 1, background: C.ink, opacity: 0.6, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>Exploring</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
        }}
      >
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: C.muted,
              textAlign: "center",
              padding: 3,
            }}
          >
            {d[0]}
          </div>
        ))}
        {weeks.flat().map((dn, i) => {
          const inMonth = dn >= 1 && dn <= daysInMonth;
          const date = inMonth
            ? new Date(year, month, dn)
            : null;
          const isCurrentWeek =
            date &&
            date >= currentMonday &&
            date < addDays(currentMonday, 7);
          const isToday = date && date.getTime() === today.getTime();

          // Get booking dots for this date — kid color + status shape
          const dateKey = inMonth
            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(dn).padStart(2, "0")}`
            : null;
          const dots = dateKey ? (bookingMap[dateKey] || []) : [];

          // Background color based on most important status on this day
          let dayBg = "transparent";
          if (dots.length > 0 && inMonth && !isToday) {
            const hasEnrolled = dots.some((d) => d.status === "Enrolled");
            const hasWaitlist = dots.some((d) => d.status === "Waitlist");
            const hasExploring = dots.some((d) => d.status === "Exploring");
            if (hasEnrolled) dayBg = STATUS_MAP.Enrolled.color + "20";
            else if (hasWaitlist) dayBg = STATUS_MAP.Waitlist.color + "20";
            else if (hasExploring) dayBg = STATUS_MAP.Exploring.color + "20";
          }

          return (
            <button
              key={i}
              onClick={() => {
                if (date) onSelectWeek(getMonday(date));
              }}
              aria-label={inMonth && date ? `Select week of ${formatDateShort(date)}` : undefined}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 14,
                fontWeight: isToday ? 800 : 600,
                color: !inMonth
                  ? "transparent"
                  : isToday
                  ? C.cream
                  : isCurrentWeek
                  ? C.seaGreen
                  : C.ink,
                background: isToday
                  ? C.seaGreen
                  : isCurrentWeek
                  ? C.seaGreen + "14"
                  : dayBg,
                border: "none",
                borderRadius: 6,
                padding: "5px 2px 3px",
                cursor: inMonth ? "pointer" : "default",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: 38,
              }}
            >
              <span>{inMonth ? dn : ""}</span>
              {dots.length > 0 && (
                <span style={{
                  display: "flex",
                  gap: 2,
                  marginTop: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}>
                  {dots.slice(0, 3).map((dot, di) => {
                    const dotColor = isToday ? C.cream : dot.kidColor;
                    if (dot.status === "Waitlist") {
                      // Hollow circle with border
                      return (
                        <span
                          key={di}
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            background: "transparent",
                            border: `1.5px solid ${dotColor}`,
                            boxSizing: "border-box",
                            flexShrink: 0,
                          }}
                        />
                      );
                    }
                    if (dot.status === "Exploring") {
                      // Small square
                      return (
                        <span
                          key={di}
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: 1,
                            background: dotColor,
                            opacity: 0.6,
                            flexShrink: 0,
                          }}
                        />
                      );
                    }
                    // Enrolled: solid filled circle
                    return (
                      <span
                        key={di}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 2,
                          background: dotColor,
                          flexShrink: 0,
                        }}
                      />
                    );
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

export default function ScheduleTab({ programs, kids, kidFilter, onKidFilter, onOpenDetail, onNavigateToDiscover, onOpenAddProgram, planAccess }) {
  /* Local toast for upgrade prompts */
  const [schedToast, setSchedToast] = useState(null);
  const showSchedToast = (msg) => { setSchedToast(msg); setTimeout(() => setSchedToast(null), 2500); };
  const [dismissedConflicts, setDismissedConflicts] = useState(false);
  const [dismissedLogistics, setDismissedLogistics] = useState(false);
  const canExport = planAccess?.canExportCalendar ?? true;

  /* ─── Status visibility filter ─── */
  const [visibleStatuses, setVisibleStatuses] = useState(() => new Set(["Enrolled", "Waitlist", "Exploring"]));

  /* ─── Hidden programs state (persisted to localStorage) ─── */
  const [hiddenPrograms, setHiddenPrograms] = useState(() => {
    try { const s = localStorage.getItem("skeddo-hidden-schedule-programs"); return s ? new Set(JSON.parse(s)) : new Set(); } catch { return new Set(); }
  });
  useEffect(() => {
    localStorage.setItem("skeddo-hidden-schedule-programs", JSON.stringify([...hiddenPrograms]));
  }, [hiddenPrograms]);
  const [showVisibilityPanel, setShowVisibilityPanel] = useState(false);

  const toggleHidden = (id) => {
    setHiddenPrograms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const showAllPrograms = () => setHiddenPrograms(new Set());
  const hideAllPrograms = () => setHiddenPrograms(new Set(programs.map((p) => p.id)));

  /* Filter programs by kid, status, then exclude hidden */
  const visiblePrograms = (kidFilter
    ? programs.filter((p) => (p.kidIds || []).includes(kidFilter))
    : programs
  ).filter((p) => !hiddenPrograms.has(p.id) && visibleStatuses.has(p.status));
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));

  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

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
    // Sort each day by start time
    byDay.forEach((day) => day.sort((a, b) => a.timeRange.start - b.timeRange.start));
    return byDay;
  }, [visiblePrograms, weekDates]);

  const totalThisWeek = scheduledByDay.reduce((sum, day) => sum + day.length, 0);

  /* ─── Swipe gesture for week navigation ─── */
  const touchStartX = useRef(null);
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 60) {
      setWeekStart((prev) => addDays(prev, deltaX < 0 ? 7 : -7));
    }
    touchStartX.current = null;
  }, []);

  // Conflict detection — only enrolled programs
  const conflicts = useMemo(() => {
    const enrolled = visiblePrograms.filter((p) => p.status === "Enrolled");
    return detectConflicts(enrolled);
  }, [visiblePrograms]);

  // Export modal state
  const [showExport, setShowExport] = useState(false);
  const [exportKidFilter, setExportKidFilter] = useState("all"); // "all" or kid id
  const [exportSelected, setExportSelected] = useState(new Set());
  const [exportDateMode, setExportDateMode] = useState("all"); // "all" | "month" | "week" | "custom"
  const [exportMonth, setExportMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [exportCustomStart, setExportCustomStart] = useState("");
  const [exportCustomEnd, setExportCustomEnd] = useState("");

  // Programs available for export (enrolled only, filtered by kid + date)
  const exportablePrograms = useMemo(() => {
    let list = visiblePrograms.filter((p) => p.status === "Enrolled");
    if (exportKidFilter !== "all") {
      list = list.filter((p) => (p.kidIds || []).includes(exportKidFilter));
    }
    if (exportDateMode === "month" && exportMonth) {
      const [y, m] = exportMonth.split("-").map(Number);
      const monthStart = new Date(y, m - 1, 1);
      const monthEnd = new Date(y, m, 0);
      list = list.filter((p) => {
        if (!p.startDate) return false;
        const ps = new Date(p.startDate + "T00:00:00");
        const pe = p.endDate ? new Date(p.endDate + "T00:00:00") : ps;
        return pe >= monthStart && ps <= monthEnd;
      });
    } else if (exportDateMode === "week") {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      list = list.filter((p) => {
        if (!p.startDate) return false;
        const ps = new Date(p.startDate + "T00:00:00");
        const pe = p.endDate ? new Date(p.endDate + "T00:00:00") : ps;
        return pe >= weekStart && ps <= weekEnd;
      });
    } else if (exportDateMode === "custom" && exportCustomStart && exportCustomEnd) {
      const customStart = new Date(exportCustomStart + "T00:00:00");
      const customEnd = new Date(exportCustomEnd + "T00:00:00");
      list = list.filter((p) => {
        if (!p.startDate) return false;
        const ps = new Date(p.startDate + "T00:00:00");
        const pe = p.endDate ? new Date(p.endDate + "T00:00:00") : ps;
        return pe >= customStart && ps <= customEnd;
      });
    }
    return list;
  }, [visiblePrograms, exportKidFilter, exportDateMode, exportMonth, weekStart, exportCustomStart, exportCustomEnd]);

  // When export modal opens, select all by default
  const openExportModal = () => {
    setShowExport(true);
    setExportKidFilter("all");
    setExportDateMode("all");
    // will select all once exportablePrograms updates
    setTimeout(() => {
      setExportSelected(new Set(exportablePrograms.map((p) => p.id)));
    }, 0);
  };

  // Keep selections in sync when filters change
  const toggleExportProgram = (id) => {
    setExportSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const selectAllExport = () => setExportSelected(new Set(exportablePrograms.map((p) => p.id)));
  const selectNoneExport = () => setExportSelected(new Set());

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h2 style={s.pageTitle}>Schedule</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Add custom activity */}
          {onOpenAddProgram && (
            <button
              onClick={onOpenAddProgram}
              aria-label="Add custom activity"
              style={{
                background: C.seaGreen, color: "#fff", border: "none",
                borderRadius: 10, width: 38, height: 38, fontSize: 20, fontWeight: 700,
                fontFamily: "'Barlow', sans-serif", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              +
            </button>
          )}
          {/* Show/hide programs filter */}
          <button
            onClick={() => setShowVisibilityPanel((v) => !v)}
            aria-label="Show or hide programs on calendar"
            style={{
              background: showVisibilityPanel ? C.seaGreen : C.white,
              color: showVisibilityPanel ? "#fff" : C.ink,
              border: `1.5px solid ${showVisibilityPanel ? C.seaGreen : C.border}`,
              borderRadius: 10, width: 38, height: 38, fontSize: 16,
              fontFamily: "'Barlow', sans-serif", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            {hiddenPrograms.size > 0 && (
              <span style={{
                position: "absolute", top: -5, right: -5,
                background: "#E76F51", color: "#fff",
                borderRadius: 8, minWidth: 16, height: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
                padding: "0 4px",
              }}>
                {hiddenPrograms.size}
              </span>
            )}
          </button>
          {/* Export */}
          <button
            onClick={() => {
              if (!canExport) { showSchedToast("Upgrade to Skeddo Plus to export your calendar"); return; }
              openExportModal();
            }}
            style={{
              background: canExport ? C.blue : "#9CA3AF", color: "#fff", border: "none",
              borderRadius: 10, padding: "8px 14px", fontSize: 14, fontWeight: 700,
              fontFamily: "'Barlow', sans-serif", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              opacity: canExport ? 1 : 0.6,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* ── Calendar Visibility Panel ── */}
      {showVisibilityPanel && (
        <div style={{
          background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
          padding: "14px 16px", marginBottom: 12,
          animation: "fadeIn 0.2s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700,
              color: C.ink, textTransform: "uppercase", letterSpacing: 0.5,
            }}>
              Calendar Visibility
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={showAllPrograms}
                style={{
                  fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700,
                  color: C.seaGreen, background: "none", border: "none", cursor: "pointer",
                }}
              >
                Show All
              </button>
              <button
                onClick={hideAllPrograms}
                style={{
                  fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700,
                  color: C.muted, background: "none", border: "none", cursor: "pointer",
                }}
              >
                Hide All
              </button>
            </div>
          </div>
          {programs.length === 0 ? (
            <div style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted,
              textAlign: "center", padding: "12px 0",
            }}>
              No programs added yet.
            </div>
          ) : (
            programs.map((p) => {
              const isVisible = !hiddenPrograms.has(p.id);
              const st = STATUS_MAP[p.status] || STATUS_MAP.Exploring;
              return (
                <div
                  key={p.id}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: `1px solid ${C.border}20`,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600,
                      color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {p.name}
                    </div>
                    <span style={{
                      fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
                      color: st.color, textTransform: "uppercase", flexShrink: 0,
                    }}>
                      {p.status}
                    </span>
                  </div>
                  {/* Toggle switch */}
                  <button
                    onClick={() => toggleHidden(p.id)}
                    aria-label={isVisible ? `Hide ${p.name} from calendar` : `Show ${p.name} on calendar`}
                    style={{
                      width: 44, height: 24, borderRadius: 12, border: "none",
                      background: isVisible ? C.seaGreen : "#D1D5DB",
                      cursor: "pointer", position: "relative", flexShrink: 0,
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span style={{
                      position: "absolute", top: 2, left: isVisible ? 22 : 2,
                      width: 20, height: 20, borderRadius: 10,
                      background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      transition: "left 0.2s ease",
                    }} />
                  </button>
                </div>
              );
            })
          )}
          <div style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted,
            marginTop: 8, textAlign: "center",
          }}>
            {hiddenPrograms.size > 0
              ? `${hiddenPrograms.size} program${hiddenPrograms.size !== 1 ? "s" : ""} hidden from calendar`
              : "All programs visible"}
          </div>
        </div>
      )}

      {/* Conflict warnings — true conflicts (same kid) */}
      {!dismissedConflicts && conflicts.filter((c) => c.type === "conflict").length > 0 && (() => {
        const conflictDates = formatConflictDates(conflicts.filter((c) => c.type === "conflict"));
        return (
          <div style={{
            background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12,
            padding: "12px 16px", marginBottom: 12, position: "relative",
          }}>
            <button onClick={() => setDismissedConflicts(true)} aria-label="Dismiss conflicts" style={{
              position: "absolute", top: 8, right: 10, background: "none", border: "none",
              color: "#991B1B", fontSize: 18, cursor: "pointer", padding: "0 4px", lineHeight: 1,
            }}>{"\u00D7"}</button>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: "#991B1B", marginBottom: 6 }}>
              {"\u26A0\uFE0F"} Scheduling Heads Up
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "#7F1D1D", lineHeight: 1.5 }}>
              {conflictDates}
            </div>
          </div>
        );
      })()}

      {/* Logistics alerts — different kids at the same time */}
      {!dismissedLogistics && conflicts.filter((c) => c.type === "logistics").length > 0 && (() => {
        const logisticsDates = formatConflictDates(conflicts.filter((c) => c.type === "logistics"));
        return (
          <div style={{
            background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12,
            padding: "12px 16px", marginBottom: 12, position: "relative",
          }}>
            <button onClick={() => setDismissedLogistics(true)} aria-label="Dismiss logistics alerts" style={{
              position: "absolute", top: 8, right: 10, background: "none", border: "none",
              color: "#92400E", fontSize: 18, cursor: "pointer", padding: "0 4px", lineHeight: 1,
            }}>{"\u00D7"}</button>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: "#92400E", marginBottom: 6 }}>
              {"\uD83D\uDCCB"} Logistics Heads-Up
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "#78350F", lineHeight: 1.5 }}>
              {logisticsDates}
            </div>
          </div>
        );
      })()}

      {/* Kid filter */}
      <KidFilterBar kids={kids} kidFilter={kidFilter} onKidFilter={onKidFilter} />

      {/* Status filter chips — toggle Enrolled/Waitlist/Exploring visibility */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {[
          { key: "Enrolled", label: "Enrolled", color: C.seaGreen, icon: "✓" },
          { key: "Waitlist", label: "Waitlist", color: C.olive, icon: "◷" },
          { key: "Exploring", label: "Exploring", color: C.blue, icon: "◇" },
        ].map((st) => {
          const isActive = visibleStatuses.has(st.key);
          return (
            <button
              key={st.key}
              onClick={() => {
                setVisibleStatuses((prev) => {
                  const next = new Set(prev);
                  if (next.has(st.key)) {
                    if (next.size > 1) next.delete(st.key); // don't allow deselecting all
                  } else {
                    next.add(st.key);
                  }
                  return next;
                });
              }}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700,
                border: `1.5px solid ${isActive ? st.color : C.border}`,
                background: isActive ? st.color + "18" : "transparent",
                color: isActive ? st.color : C.muted,
                minHeight: 36, transition: "all 0.15s",
              }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: isActive ? st.color : C.border,
              }} />
              {st.label}
            </button>
          );
        })}
      </div>

      {/* Mini calendar for quick week jumping */}
      <MiniCalendar currentMonday={weekStart} onSelectWeek={setWeekStart} programs={visiblePrograms} kids={kids} />

      {/* Week navigator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          marginTop: 8,
        }}
      >
        <button
          onClick={() => setWeekStart(addDays(weekStart, -7))}
          aria-label="Previous week"
          style={{
            ...s.secondaryBtn,
            flex: "none",
            width: 44,
            height: 44,
            padding: 0,
            fontSize: 20,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ‹
        </button>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 16,
              color: C.ink,
            }}
          >
            {formatDateShort(weekStart)} – {formatDateShort(weekEnd)}, {weekEnd.getFullYear()}
          </div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginTop: 2 }}>
            {totalThisWeek} program{totalThisWeek !== 1 ? "s" : ""} this week
          </div>
        </div>
        <button
          onClick={() => setWeekStart(addDays(weekStart, 7))}
          aria-label="Next week"
          style={{
            ...s.secondaryBtn,
            flex: "none",
            width: 44,
            height: 44,
            padding: 0,
            fontSize: 20,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ›
        </button>
      </div>

      {!isThisWeek && (
        <button
          onClick={() => setWeekStart(getMonday(new Date()))}
          aria-label="Jump to this week"
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: C.seaGreen,
            background: "none",
            border: "none",
            cursor: "pointer",
            marginBottom: 12,
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Jump to this week
        </button>
      )}

      {/* Day columns — swipe left/right to change week */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ display: "flex", flexDirection: "column", gap: 6 }}
      >
        {weekDates.map((date, dayIdx) => {
          const dayPrograms = scheduledByDay[dayIdx];
          const isToday = new Date().toDateString() === date.toDateString();
          const isWeekend = dayIdx >= 5;

          return (
            <div
              key={dayIdx}
              style={{
                background: isToday ? `${C.seaGreen}08` : C.white,
                borderRadius: 12,
                border: isToday ? `2px solid ${C.seaGreen}` : `1px solid ${C.border}`,
                padding: "10px 12px",
                minHeight: 56,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: dayPrograms.length > 0 ? 8 : 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: isToday ? C.seaGreen : C.muted,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      width: 30,
                    }}
                  >
                    {DAY_NAMES[dayIdx]}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 15,
                      color: isToday ? C.seaGreen : C.ink,
                    }}
                  >
                    {date.getDate()}
                  </span>
                  {isToday && (
                    <span
                      style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        color: C.cream,
                        background: C.seaGreen,
                        padding: "2px 6px",
                        borderRadius: 4,
                        textTransform: "uppercase",
                      }}
                    >
                      Today
                    </span>
                  )}
                </div>
                {dayPrograms.length === 0 && totalThisWeek > 0 && (
                  <span
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: 14,
                      color: isWeekend ? C.muted : C.border,
                      fontWeight: 500,
                    }}
                  >
                    {isWeekend ? "Weekend" : "Free"}
                  </span>
                )}
              </div>

              {dayPrograms.map((prog, i) => {
                const st = STATUS_MAP[prog.status] || STATUS_MAP.Exploring;
                const assignedKids = (prog.kidIds || [])
                  .map((kid) => kids.find((k) => k.id === kid))
                  .filter(Boolean);
                return (
                  <div
                    key={prog.id + "-" + i}
                    onClick={() => onOpenDetail(prog)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${prog.name}, ${prog.times || "TBD"}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 8px",
                      borderRadius: 8,
                      background: st.bg,
                      border: prog.status === "Exploring"
                        ? `1.5px dashed ${C.blue}50`
                        : prog.status === "Waitlist"
                          ? `1.5px solid ${C.olive}30`
                          : "1.5px solid transparent",
                      marginBottom: i < dayPrograms.length - 1 ? 4 : 0,
                      cursor: "pointer",
                      transition: "transform 0.1s",
                    }}
                  >
                    <div
                      style={{
                        width: 3,
                        height: 28,
                        borderRadius: 2,
                        background: st.color,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "'Barlow', sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          color: C.ink,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {prog.name}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          marginTop: 1,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Barlow', sans-serif",
                            fontSize: 13,
                            color: C.muted,
                          }}
                        >
                          {prog.times || "TBD"}
                        </span>
                        {assignedKids.length > 0 && (
                          <>
                            <span style={{ color: C.border, fontSize: 13 }}>·</span>
                            {assignedKids.map((k) => {
                              const kidIdx = (kids || []).findIndex((kk) => kk.id === k.id);
                              const kidColor = k.color || KID_COLORS_FALLBACK[kidIdx >= 0 ? kidIdx % KID_COLORS_FALLBACK.length : 0];
                              return (
                              <span
                                key={k.id}
                                title={k.name}
                                aria-label={k.name}
                                style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: 6,
                                  background: kidColor,
                                  color: C.cream,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontFamily: "'Poppins', sans-serif",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  lineHeight: 1,
                                  flexShrink: 0,
                                }}
                              >
                                {k.name?.[0]?.toUpperCase()}
                              </span>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        color: st.color,
                        textTransform: "uppercase",
                      }}
                    >
                      {prog.status}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {totalThisWeek === 0 && (
        <div style={{ ...s.emptyState, marginTop: 16 }}>
          <span style={{ fontSize: 28 }}>📅</span>
          <p style={{ marginTop: 8 }}>No programs scheduled this week.</p>
          <p style={{ fontSize: 14, color: C.muted }}>Try navigating to a different week, or add programs from the Discover tab.</p>
          {onNavigateToDiscover && (
            <button
              onClick={onNavigateToDiscover}
              aria-label="Browse programs in the Discover tab"
              style={{
                ...s.primaryBtn,
                marginTop: 12,
                padding: "10px 24px",
                fontSize: 13,
                flex: "none",
              }}
            >
              Browse Programs
            </button>
          )}
        </div>
      )}

      {/* ── Export Modal ── */}
      {showExport && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(27,36,50,0.45)", zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowExport(false); }}
        >
          <div style={{
            background: C.white, borderRadius: 20, width: "100%", maxWidth: 420,
            maxHeight: "85vh", display: "flex", flexDirection: "column",
            boxShadow: "0 8px 32px rgba(27,36,50,0.18)",
          }}>
            {/* Header */}
            <div style={{ padding: "18px 20px 12px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, color: C.ink, margin: 0 }}>
                  Export Calendar
                </h3>
                <button onClick={() => setShowExport(false)} style={{ background: "none", border: "none", fontSize: 22, color: C.muted, cursor: "pointer", padding: "0 4px" }}>
                  {"\u00D7"}
                </button>
              </div>

              {/* Kid filter */}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                  Export for
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button
                    onClick={() => { setExportKidFilter("all"); setExportSelected(new Set()); }}
                    style={{
                      padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                      fontFamily: "'Barlow', sans-serif", border: `1px solid ${exportKidFilter === "all" ? C.seaGreen : C.border}`,
                      background: exportKidFilter === "all" ? C.seaGreen + "18" : "transparent",
                      color: exportKidFilter === "all" ? C.seaGreen : C.muted,
                    }}
                  >
                    All Kids
                  </button>
                  {(kids || []).map((k) => (
                    <button
                      key={k.id}
                      onClick={() => { setExportKidFilter(k.id); setExportSelected(new Set()); }}
                      style={{
                        padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                        fontFamily: "'Barlow', sans-serif", border: `1px solid ${exportKidFilter === k.id ? C.seaGreen : C.border}`,
                        background: exportKidFilter === k.id ? C.seaGreen + "18" : "transparent",
                        color: exportKidFilter === k.id ? C.seaGreen : C.muted,
                      }}
                    >
                      {k.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date range filter */}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                  Date Range
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {[
                    { key: "all", label: "All Dates" },
                    { key: "week", label: "This Week" },
                    { key: "month", label: "By Month" },
                    { key: "custom", label: "Custom" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => { setExportDateMode(opt.key); setExportSelected(new Set()); }}
                      style={{
                        padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                        fontFamily: "'Barlow', sans-serif", border: `1px solid ${exportDateMode === opt.key ? C.blue : C.border}`,
                        background: exportDateMode === opt.key ? C.blue + "18" : "transparent",
                        color: exportDateMode === opt.key ? C.blue : C.muted,
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                  {exportDateMode === "month" && (
                    <input
                      type="month"
                      value={exportMonth}
                      onChange={(e) => { setExportMonth(e.target.value); setExportSelected(new Set()); }}
                      style={{
                        fontFamily: "'Barlow', sans-serif", fontSize: 13, padding: "5px 8px",
                        borderRadius: 8, border: `1px solid ${C.border}`, color: C.ink,
                      }}
                    />
                  )}
                </div>
                {exportDateMode === "custom" && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                    <input
                      type="date"
                      value={exportCustomStart}
                      onChange={(e) => { setExportCustomStart(e.target.value); setExportSelected(new Set()); }}
                      style={{
                        flex: 1, fontFamily: "'Barlow', sans-serif", fontSize: 13, padding: "8px 10px",
                        borderRadius: 8, border: `1px solid ${C.border}`, color: C.ink, minHeight: 40,
                      }}
                    />
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted }}>to</span>
                    <input
                      type="date"
                      value={exportCustomEnd}
                      onChange={(e) => { setExportCustomEnd(e.target.value); setExportSelected(new Set()); }}
                      style={{
                        flex: 1, fontFamily: "'Barlow', sans-serif", fontSize: 13, padding: "8px 10px",
                        borderRadius: 8, border: `1px solid ${C.border}`, color: C.ink, minHeight: 40,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Select all / none */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: C.ink }}>
                  {exportablePrograms.length} program{exportablePrograms.length !== 1 ? "s" : ""} · {exportSelected.size} selected
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={selectAllExport} style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.seaGreen, fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
                    Select All
                  </button>
                  <button onClick={selectNoneExport} style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Program list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px" }}>
              {exportablePrograms.length === 0 ? (
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, textAlign: "center", padding: "24px 0" }}>
                  No enrolled programs match these filters.
                </div>
              ) : (
                exportablePrograms.map((p) => {
                  const isChecked = exportSelected.has(p.id);
                  const pKids = (p.kidIds || []).map((id) => (kids || []).find((k) => k.id === id)?.name).filter(Boolean);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleExportProgram(p.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 0", borderBottom: `1px solid ${C.border}20`,
                        cursor: "pointer",
                      }}
                    >
                      <div style={{
                        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                        border: `2px solid ${isChecked ? C.seaGreen : C.border}`,
                        background: isChecked ? C.seaGreen : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: C.cream, fontSize: 14,
                      }}>
                        {isChecked ? "\u2713" : ""}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.name}
                        </div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted }}>
                          {[p.days, p.times, pKids.length > 0 ? pKids.join(", ") : null].filter(Boolean).join(" · ")}
                        </div>
                        {p.startDate && (
                          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>
                            {p.startDate}{p.endDate && p.endDate !== p.startDate ? ` – ${p.endDate}` : ""}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Export actions */}
            <div style={{ padding: "12px 20px 18px", borderTop: `1px solid ${C.border}` }}>
              <button
                onClick={() => {
                  const toExport = exportablePrograms.filter((p) => exportSelected.has(p.id));
                  downloadAllICS(toExport);
                  trackEvent("export_calendar", { program_count: toExport.length });
                  setShowExport(false);
                }}
                disabled={exportSelected.size === 0}
                style={{
                  ...s.primaryBtn, width: "100%", marginBottom: 8,
                  opacity: exportSelected.size === 0 ? 0.5 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Download .ics ({exportSelected.size})
              </button>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, textAlign: "center", lineHeight: 1.4 }}>
                Works with Apple Calendar, Google Calendar, and Outlook
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule upgrade toast */}
      {schedToast && (
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
          {schedToast}
        </div>
      )}
    </div>
  );
}
