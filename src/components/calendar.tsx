import React, { useMemo, useState } from "react";


const PFIZER = {
  blue1: "#15144B",
  blue2: "#272C77",
  blue3: "#33429D",
  blue4: "#3857A6",
  blue5: "#488CCA",
  blue6: "#74BBE6",
  blue7: "#CFEAFB",
  blue8: "#EBF5FC"
};

// Utility: format
const monthFmt = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" });
const weekdayFmt = new Intl.DateTimeFormat(undefined, { weekday: "short" });

// Get days for a month grid (starts on Sunday)
function getMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = startDay; // number of leading blanks from previous month
  const totalCells = Math.ceil((prevMonthDays + daysInMonth) / 7) * 7;

  const cells: { date: Date; inCurrentMonth: boolean }[] = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - prevMonthDays + 1;
    const d = new Date(year, month, dayNum);
    cells.push({ date: d, inCurrentMonth: d.getMonth() === month });
  }
  return cells;
}

// Simple in-memory event store keyed by yyyy-mm-dd
type Events = Record<string, string[]>;
function keyFor(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date>(today);
  const [events, setEvents] = useState<Events>({
    [keyFor(today)]: ["Kickoff @ 10:", "Medication refill"],
  });
  const [draft, setDraft] = useState("");

  const grid = useMemo(() => getMonthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const weeks: { date: Date; inCurrentMonth: boolean }[][] = [];
  for (let i = 0; i < grid.length; i += 7) weeks.push(grid.slice(i, i + 7));

  function go(deltaMonths: number) {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + deltaMonths, 1));
  }

  function addEvent() {
    const k = keyFor(selected);
    if (!draft.trim()) return;
    setEvents((prev) => ({ ...prev, [k]: [...(prev[k] || []), draft.trim()] }));
    setDraft("");
  }

  // Weekday headers starting from Sunday
  const weekStart = new Date(2024, 7, 18); // arbitrary Sunday to map names
  const weekdayNames = Array.from({ length: 7 }, (_, i) => weekdayFmt.format(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i)));

  const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  return (
    <div className="ml-64 min-h-screen" style={{ background: `linear-gradient(180deg, ${PFIZER.blue2}, #ffffff)` }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", borderColor: PFIZER.blue3 }}>
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => go(-1)}
              className="px-3 py-2 rounded-xl border text-sm transition active:scale-95"
              style={{ borderColor: PFIZER.blue3, color: PFIZER.blue7 }}
              aria-label="Previous month"
            > ◀
            </button>

            <h1 className="text-xl md:text-2xl font-bold" style={{ color: PFIZER.blue8 }}>
              {monthFmt.format(cursor)}
            </h1>
            <button
              onClick={() => go(1)}
              className="px-3 py-2 rounded-xl border text-sm transition active:scale-95"
              style={{ borderColor: PFIZER.blue3, color: PFIZER.blue7 }}
              aria-label="Next month">
            </button>
            <button
              onClick={() => {
                const t = new Date();
                setCursor(new Date(t.getFullYear(), t.getMonth(), 1));
                setSelected(t);
              }}
              className="ml-3 px-3 py-2 rounded-xl text-sm font-medium shadow-sm"
              style={{ background: PFIZER.blue6, color: "white" }}
            >
              Today
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: PFIZER.blue8 }}>Legend:</span>
            <span className="inline-flex items-center text-xs gap-1">
              <span className="w-3 h-3 rounded-full" style={{ background: PFIZER.blue6 }} />
              Selected
            </span>
            <span className="inline-flex items-center text-xs gap-1">
              <span className="w-3 h-3 rounded-full" style={{ background: PFIZER.blue4 }} />
              Today
            </span>
          </div>
        </div>
      </header>

      {/* Grid + Sidebar */}
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <section className="lg:col-span-2 bg-white rounded-2xl shadow p-4 border" style={{ borderColor: PFIZER.blue3 }}>
          {/* Weekday header */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: PFIZER.blue7 }}>
            {weekdayNames.map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex flex-col gap-2">
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-2">
                {week.map(({ date, inCurrentMonth }) => {
                  const k = keyFor(date);
                  const hasEvents = !!events[k]?.length;
                  const isToday = isSameDay(date, today);
                  const isSelected = isSameDay(date, selected);

                  return (
                    <button
                      key={k}
                      onClick={() => setSelected(date)}
                      className="aspect-square rounded-xl border flex flex-col items-start p-2 text-left transition hover:shadow-sm focus:outline-none focus:ring-2"
                      style={{
                        borderColor: inCurrentMonth ? PFIZER.blue3 : "#e5e7eb",
                        background: isSelected
                          ? PFIZER.blue6
                          : isToday
                          ? PFIZER.blue3
                          : inCurrentMonth
                          ? "white"
                          : "#fafafa",
                        color: isSelected ? "white" : "inherit",
                        boxShadow: isSelected ? `0 0 0 2px ${PFIZER.blue6}` : undefined,
                      }}
                    >
                      <span className="text-sm font-semibold">
                        {date.getDate()}
                      </span>
                      <div className="mt-auto flex flex-wrap gap-1">
                        {hasEvents && events[k]!.slice(0, 3).map((evt, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[10px] leading-none whitespace-nowrap"
                            style={{ background: isSelected ? PFIZER.blue5 : PFIZER.blue2, color: isSelected ? "white" : PFIZER.blue7 }}
                            title={evt}
                          >
                            {evt.length > 16 ? evt.slice(0, 16) + "…" : evt}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* Day details */}
        <aside className="bg-white rounded-2xl shadow p-5 border flex flex-col" style={{ borderColor: PFIZER.blue3 }}>
          <h2 className="text-lg font-bold mb-1" style={{ color: PFIZER.blue8 }}>
            {selected.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </h2>
          <p className="text-sm mb-4" style={{ color: PFIZER.blue7 }}>Notes & events</p>

          <div className="flex flex-col gap-3">
            {(events[keyFor(selected)] || []).map((evt, i) => (
              <div key={i} className="border rounded-xl px-3 py-2 text-sm flex items-center justify-between" style={{ borderColor: PFIZER.blue3 }}>
                <span>{evt}</span>
                <button
                  onClick={() => {
                    const k = keyFor(selected);
                    setEvents((prev) => ({
                      ...prev,
                      [k]: prev[k].filter((_, idx) => idx !== i),
                    }));
                  }}
                  className="text-xs px-2 py-1 rounded-md border"
                  style={{ color: PFIZER.blue7, borderColor: PFIZER.blue3 }}
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="flex gap-2 mt-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Add an event…"
                className="flex-1 px-3 py-2 rounded-xl border outline-none focus:ring-2"
                style={{ borderColor: PFIZER.blue3 }}
              />
              <button onClick={addEvent} className="px-4 py-2 rounded-xl font-medium shadow-sm" style={{ background: PFIZER.blue6, color: "white" }}>
                Add
              </button>
            </div>

            <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: PFIZER.blue2, color: PFIZER.blue8 }}>
              Tip: replace the hex values in the PFIZER object with official brand codes; the UI will update automatically.
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
