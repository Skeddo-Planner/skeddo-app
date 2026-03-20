import { useState, useMemo, useRef, useCallback } from "react";
import { C, STATUS_MAP } from "../constants/brand";
import { s } from "../styles/shared";
import KidFilterBar from "../components/KidFilterBar";

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

function parseDays(daysStr) {
  if (!daysStr) return [];
  const s = daysStr.toLowerCase().replace(/\u2013/g, "-");
  const result = [];
  if (s.includes("mon-fri") || s.includes("mon\u2013fri")) return [0, 1, 2, 3, 4];
  DAY_NAMES.forEach((name, i) => {
    if (s.includes(name.toLowerCase())) result.push(i);
  });
  return result;
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

/* ─── Kid dot colors — distinct palette for up to 6 kids ─── */
const KID_COLORS = [C.seaGreen, C.blue, C.lilac, C.olive, "#E06C50", "#5BB5A2"];

/* ─── Build a map of date → [kidId, …] for the visible month ─── */
function buildBookingMap(programs, kids, year, month) {
  const map = {}; // "YYYY-MM-DD" → Set<kidId|"__all__">
  programs.forEach((p) => {
    const dayIndices = parseDays(p.days);
    if (dayIndices.length === 0) return;
    // Iterate every day of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dow = date.getDay();
      const calIdx = dow === 0 ? 6 : dow - 1; // Mon=0 … Sun=6
      if (!dayIndices.includes(calIdx)) continue;
      if (!isDateInRange(date, p.startDate, p.endDate)) continue;
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      if (!map[key]) map[key] = new Set();
      const kidIds = p.kidIds || [];
      if (kidIds.length === 0) {
        map[key].add("__all__");
      } else {
        kidIds.forEach((kid) => map[key].add(kid));
      }
    }
  });
  return map;
}

/* ─── Mini Calendar ─── */
function MiniCalendar({ currentMonday, onSelectWeek, programs, kids }) {
  const year = currentMonday.getFullYear();
  const month = currentMonday.getMonth();
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

  // Build kid → color index map
  const kidColorMap = {};
  (kids || []).forEach((k, i) => {
    kidColorMap[k.id] = KID_COLORS[i % KID_COLORS.length];
  });

  // Build booking map for this month
  const bookingMap = useMemo(
    () => buildBookingMap(programs || [], kids || [], year, month),
    [programs, kids, year, month]
  );

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
          fontFamily: "'Barlow', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          color: C.ink,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        {currentMonday.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </div>

      {/* Legend — show kid color dots if kids exist */}
      {kids && kids.length > 0 && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginBottom: 6,
          flexWrap: "wrap",
        }}>
          {kids.map((k, i) => (
            <div key={k.id} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: KID_COLORS[i % KID_COLORS.length],
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 9,
                fontWeight: 600,
                color: C.muted,
              }}>
                {k.name}
              </span>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2,
        }}
      >
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 9,
              fontWeight: 700,
              color: C.muted,
              textAlign: "center",
              padding: 2,
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

          // Get booking dots for this date
          const dateKey = inMonth
            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(dn).padStart(2, "0")}`
            : null;
          const bookedKids = dateKey ? bookingMap[dateKey] : null;
          const dots = [];
          if (bookedKids) {
            if (bookedKids.has("__all__") && (!kids || kids.length === 0)) {
              dots.push(C.seaGreen);
            } else {
              (kids || []).forEach((k, ki) => {
                if (bookedKids.has(k.id) || bookedKids.has("__all__")) {
                  dots.push(KID_COLORS[ki % KID_COLORS.length]);
                }
              });
            }
            // If no kids added but programs exist, show a single dot
            if (dots.length === 0 && bookedKids.size > 0) {
              dots.push(C.seaGreen);
            }
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
                fontSize: 11,
                fontWeight: isToday ? 800 : 500,
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
                  : "transparent",
                border: "none",
                borderRadius: 6,
                padding: "3px 2px 1px",
                cursor: inMonth ? "pointer" : "default",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: 28,
              }}
            >
              <span>{inMonth ? dn : ""}</span>
              {dots.length > 0 && (
                <span style={{
                  display: "flex",
                  gap: 2,
                  marginTop: 1,
                  justifyContent: "center",
                }}>
                  {dots.slice(0, 4).map((color, di) => (
                    <span
                      key={di}
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        background: isToday ? C.cream : color,
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ScheduleTab({ programs, kids, kidFilter, onKidFilter, onOpenDetail, onNavigateToDiscover }) {
  /* Filter programs by kid if selected */
  const visiblePrograms = kidFilter
    ? programs.filter((p) => (p.kidIds || []).includes(kidFilter))
    : programs;
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
      const dayIndices = parseDays(p.days);
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

  return (
    <div>
      <h2 style={s.pageTitle}>Schedule</h2>

      {/* Kid filter */}
      <KidFilterBar kids={kids} kidFilter={kidFilter} onKidFilter={onKidFilter} />

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
            padding: "8px 12px",
            fontSize: 16,
            borderRadius: 8,
          }}
        >
          ‹
        </button>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 16,
              color: C.ink,
            }}
          >
            {formatDateShort(weekStart)} – {formatDateShort(weekEnd)}, {weekEnd.getFullYear()}
          </div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted, marginTop: 2 }}>
            {totalThisWeek} program{totalThisWeek !== 1 ? "s" : ""} this week
          </div>
        </div>
        <button
          onClick={() => setWeekStart(addDays(weekStart, 7))}
          aria-label="Next week"
          style={{
            ...s.secondaryBtn,
            flex: "none",
            padding: "8px 12px",
            fontSize: 16,
            borderRadius: 8,
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
            fontSize: 12,
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
                      fontSize: 11,
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
                      fontFamily: "'Instrument Serif', serif",
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
                        fontSize: 9,
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
                {dayPrograms.length === 0 && (
                  <span
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: 11,
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
                            fontSize: 11,
                            color: C.muted,
                          }}
                        >
                          {prog.times || "TBD"}
                        </span>
                        {assignedKids.length > 0 && (
                          <>
                            <span style={{ color: C.border, fontSize: 11 }}>·</span>
                            {assignedKids.map((k) => {
                              const kidIdx = (kids || []).findIndex((kk) => kk.id === k.id);
                              const kidColor = KID_COLORS[kidIdx >= 0 ? kidIdx % KID_COLORS.length : 0];
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
                                  fontFamily: "'Instrument Serif', serif",
                                  fontSize: 10,
                                  fontWeight: 400,
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
                        fontSize: 9,
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
          <p style={{ fontSize: 12, color: C.muted }}>Try navigating to a different week, or add programs from the Discover tab.</p>
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
    </div>
  );
}
