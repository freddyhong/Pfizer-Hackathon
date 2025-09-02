import { useMemo, useState } from "react";

const PFIZER = {
  blue1: "#15144B",
  blue2: "#272C77",
  blue3: "#33429D",
  blue4: "#3857A6",
  blue5: "#488CCA",
  blue6: "#74BBE6",
  blue7: "#CFEAFB",
  blue8: "#EBF5FC",
};

// Utility: format
const monthFmt = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});
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
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

// ✅ To-do types + helper
type Todo = { id: string; text: string; done: boolean };
type Todos = Record<string, Todo[]>;
const uid = () => Math.random().toString(36).slice(2, 9);

export default function CalendarPage() {
  const today = new Date();
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selected, setSelected] = useState<Date>(today);
  const [events, setEvents] = useState<Events>({
    [keyFor(today)]: ["Appointment @ 10AM", "Medication refill"],
  });
  const [draft, setDraft] = useState("");

  // ✅ To-do state
  const [todos, setTodos] = useState<Todos>({});
  const [todoDraft, setTodoDraft] = useState("");

  const grid = useMemo(
    () => getMonthGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor]
  );
  const weeks: { date: Date; inCurrentMonth: boolean }[][] = [];
  for (let i = 0; i < grid.length; i += 7) weeks.push(grid.slice(i, i + 7));

  function go(deltaMonths: number) {
    setCursor(
      new Date(cursor.getFullYear(), cursor.getMonth() + deltaMonths, 1)
    );
  }

  function addEvent() {
    const k = keyFor(selected);
    if (!draft.trim()) return;
    setEvents((prev) => ({ ...prev, [k]: [...(prev[k] || []), draft.trim()] }));
    setDraft("");
  }

  // ✅ To-do handlers
  function addTodo() {
    const k = keyFor(selected);
    if (!todoDraft.trim()) return;
    setTodos((prev) => ({
      ...prev,
      [k]: [
        ...(prev[k] || []),
        { id: uid(), text: todoDraft.trim(), done: false },
      ],
    }));
    setTodoDraft("");
  }

  function toggleTodo(id: string) {
    const k = keyFor(selected);
    setTodos((prev) => ({
      ...prev,
      [k]: (prev[k] || []).map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      ),
    }));
  }

  function removeTodo(id: string) {
    const k = keyFor(selected);
    setTodos((prev) => ({
      ...prev,
      [k]: (prev[k] || []).filter((t) => t.id !== id),
    }));
  }

  function clearCompleted() {
    const k = keyFor(selected);
    setTodos((prev) => ({
      ...prev,
      [k]: (prev[k] || []).filter((t) => !t.done),
    }));
  }

  // Weekday headers starting from Sunday
  const weekStart = new Date(2024, 7, 18); // arbitrary Sunday to map names
  const weekdayNames = Array.from({ length: 7 }, (_, i) =>
    weekdayFmt.format(
      new Date(
        weekStart.getFullYear(),
        weekStart.getMonth(),
        weekStart.getDate() + i
      )
    )
  );
  // Date comparison utility

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // ✅ Per-day todos derived
  const selectedKey = keyFor(selected);
  const dayTodos = todos[selectedKey] || [];
  const remaining = dayTodos.filter((t) => !t.done).length;

  return (
    <div
      className="ml-64 min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${PFIZER.blue2}, #ffffff)`,
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          borderColor: PFIZER.blue3,
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => go(-1)}
              className="px-3 py-2 rounded-xl border text-sm transition active:scale-95"
              style={{ borderColor: PFIZER.blue3, color: PFIZER.blue2 }}
              aria-label="Previous month"
            >
              {" "}
              ◀
            </button>

            <h1
              className="text-xl md:text-2xl font-bold"
              style={{ color: PFIZER.blue3 }}
            >
              {monthFmt.format(cursor)}
            </h1>
            <button
              onClick={() => go(1)}
              className="px-3 py-2 rounded-xl border text-sm transition active:scale-95"
              style={{ borderColor: PFIZER.blue3, color: PFIZER.blue2 }}
              aria-label="Next month"
            >
              {" "}
              ▶︎
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

          {
            <div className="hidden md:flex items-center gap-2">
              <span className="inline-flex items-center text-xs gap-1">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: PFIZER.blue6 }}
                />
                Selected
              </span>
              <span className="inline-flex items-center text-xs gap-1">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: PFIZER.blue4 }}
                />
                Today
              </span>
            </div>
          }
        </div>
      </header>

      {/* Grid + Sidebar */}
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <section
          className="lg:col-span-2 bg-white rounded-2xl shadow p-4 border"
          style={{ borderColor: PFIZER.blue3 }}
        >
          {/* Weekday header */}
          <div
            className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: PFIZER.blue3 }}
          >
            {weekdayNames.map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
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
                  const isWeekend = [0, 6].includes(date.getDay());

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
                          : isWeekend
                          ? PFIZER.blue8
                          : inCurrentMonth
                          ? "white"
                          : "#fafafa",
                        color: isSelected || isWeekend ? "Navy" : "inherit",
                        boxShadow: isSelected
                          ? `0 0 0 2px ${PFIZER.blue8}`
                          : undefined,
                      }}
                    >
                      <span className="text-sm font-semibold">
                        {date.getDate()}
                      </span>
                      {/* Need to add hover over effect for events */}
                      <div className="mt-auto flex flex-wrap gap-1 max-w-full">
                        {hasEvents &&
                          events[k]!.slice(0, 3).map((evt, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded text-[10px] leading-none whitespace-nowrap max-w-full text-wrap"
                              style={{
                                background: isSelected
                                  ? PFIZER.blue5
                                  : PFIZER.blue2,
                                color: isSelected ? "white" : PFIZER.blue7,
                              }}
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
        <aside
          className="bg-white rounded-2xl shadow p-5 border flex flex-col"
          style={{ borderColor: PFIZER.blue3 }}
        >
          <h2
            className="text-lg font-bold mb-1"
            style={{ color: PFIZER.blue3 }}
          >
            {selected.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <p className="text-sm mb-4" style={{ color: PFIZER.blue3 }}>
            Notes & events
          </p>

          {/* Events list */}
          <div className="flex flex-col gap-3">
            {(events[keyFor(selected)] || []).map((evt, i) => (
              <div
                key={i}
                className="border rounded-xl px-3 py-2 text-sm flex items-center justify-between"
                style={{ borderColor: PFIZER.blue3 }}
              >
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
                  style={{ color: PFIZER.blue6, borderColor: PFIZER.blue3 }}
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
              <button
                onClick={addEvent}
                className="px-4 py-2 rounded-xl font-medium shadow-sm"
                style={{ background: PFIZER.blue6, color: "white" }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Divider */}
          <hr
            className="my-5"
            style={{ borderColor: PFIZER.blue3, opacity: 0.2 }}
          />

          {/* ✅ To-do list */}
          <h3
            className="text-md font-semibold mb-2"
            style={{ color: PFIZER.blue3 }}
          >
            To-do
          </h3>

          <div className="flex gap-2">
            <input
              value={todoDraft}
              onChange={(e) => setTodoDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add a task…"
              className="flex-1 px-3 py-2 rounded-xl border outline-none focus:ring-2"
              style={{ borderColor: PFIZER.blue3 }}
            />
            <button
              onClick={addTodo}
              className="px-4 py-2 rounded-xl font-medium shadow-sm"
              style={{ background: PFIZER.blue6, color: "white" }}
            >
              Add
            </button>
          </div>

          <ul className="flex flex-col gap-2 mt-3">
            {dayTodos.length === 0 ? (
              <li className="text-sm" style={{ color: PFIZER.blue3 }}>
                No tasks yet—add one above.
              </li>
            ) : (
              dayTodos.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-2 justify-between border rounded-xl px-3 py-2"
                  style={{
                    borderColor: PFIZER.blue3,
                    background: t.done ? PFIZER.blue8 : "transparent",
                  }}
                >
                  <label className="flex items-center gap-2 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleTodo(t.id)}
                      className="w-4 h-4"
                      style={{ accentColor: PFIZER.blue6 }}
                    />
                    <span
                      className="text-sm"
                      style={{
                        textDecoration: t.done ? "line-through" : "none",
                        color: t.done ? PFIZER.blue2 : "inherit",
                      }}
                    >
                      {t.text}
                    </span>
                  </label>
                  <button
                    onClick={() => removeTodo(t.id)}
                    className="text-xs px-2 py-1 rounded-md border"
                    style={{ color: PFIZER.blue6, borderColor: PFIZER.blue3 }}
                  >
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>

          {dayTodos.length > 0 && (
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs" style={{ color: PFIZER.blue3 }}>
                {remaining} left
              </span>
              <button
                onClick={clearCompleted}
                className="text-xs px-2 py-1 rounded-md border"
                style={{ color: PFIZER.blue5, borderColor: PFIZER.blue3 }}
              >
                Clear completed
              </button>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
