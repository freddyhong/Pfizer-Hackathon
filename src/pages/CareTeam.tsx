import React, { useMemo, useState } from "react";

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

// Utilities
const monthFmt = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});
const weekdayFmt = new Intl.DateTimeFormat(undefined, { weekday: "short" });

function getMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = startDay;
  const totalCells = Math.ceil((prevMonthDays + daysInMonth) / 7) * 7;

  const cells: { date: Date; inCurrentMonth: boolean }[] = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - prevMonthDays + 1;
    const d = new Date(year, month, dayNum);
    cells.push({ date: d, inCurrentMonth: d.getMonth() === month });
  }
  return cells;
}
function keyFor(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CareTeamPage() {
  const today = new Date();
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selected, setSelected] = useState<Date | null>(null);
  const [note, setNote] = useState("");

  const availability: Record<string, string[]> = {
    [keyFor(new Date(2025, 8, 4))]: [
      "10:30 AM",
      "10:45 AM",
      "11:00 AM",
      "11:15 AM",
    ],
    [keyFor(new Date(2025, 8, 5))]: ["9:00 AM", "9:30 AM", "10:00 AM"],
    [keyFor(new Date(2025, 8, 15))]: ["9:00 AM", "9:30 AM", "10:00 AM"],
    [keyFor(new Date(2025, 8, 17))]: [
      "10:30 AM",
      "10:45 AM",
      "11:00 AM",
      "11:15 AM",
    ],
    [keyFor(new Date(2025, 8, 23))]: [
      "10:30 AM",
      "10:45 AM",
      "11:00 AM",
      "11:15 AM",
    ],
    [keyFor(new Date(2025, 8, 24))]: [
      "10:30 AM",
      "10:45 AM",
      "11:00 AM",
      "11:15 AM",
    ],
    [keyFor(new Date(2025, 8, 25))]: ["9:00 AM", "9:30 AM", "10:00 AM"],
  };

  const grid = useMemo(
    () => getMonthGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor]
  );
  const weeks: { date: Date; inCurrentMonth: boolean }[][] = [];
  for (let i = 0; i < grid.length; i += 7) weeks.push(grid.slice(i, i + 7));

  function go(delta: number) {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));
  }

  return (
    <div
      className="ml-64 min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${PFIZER.blue2}, #ffffff)`,
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b px-6 py-4 flex justify-between items-center"
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          borderColor: PFIZER.blue3,
        }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => go(-1)}>◀</button>
          <h1 className="font-bold text-xl">{monthFmt.format(cursor)}</h1>
          <button onClick={() => go(1)}>▶</button>
        </div>
      </header>

      {/* Main layout */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 py-6">
        {/* Calendar */}
        <section
          className="lg:col-span-2 bg-white rounded-2xl shadow p-4 border"
          style={{ borderColor: PFIZER.blue3 }}
        >
          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center font-semibold text-xs mb-1">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i}>{weekdayFmt.format(new Date(2024, 7, 18 + i))}</div>
            ))}
          </div>

          {/* Days */}
          <div className="flex flex-col gap-2">
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-2">
                {week.map(({ date, inCurrentMonth }) => {
                  const k = keyFor(date);
                  const hasAvailability = !!availability[k];
                  const isSelected = selected && keyFor(selected) === k;
                  return (
                    <button
                      key={k}
                      disabled={!hasAvailability || !inCurrentMonth}
                      onClick={() => setSelected(date)}
                      className="aspect-square rounded-xl border flex items-center justify-center"
                      style={{
                        background: isSelected
                          ? PFIZER.blue5
                          : hasAvailability
                          ? PFIZER.blue7
                          : "white",
                        color: isSelected ? "white" : PFIZER.blue3,
                        opacity: inCurrentMonth ? 1 : 0.3,
                      }}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar: appointments + note */}
        <aside
          className="bg-white rounded-2xl shadow p-5 border flex flex-col"
          style={{ borderColor: PFIZER.blue3 }}
        >
          <h2 className="text-lg font-bold mb-2">Care Team</h2>

          {/* Available times */}
          {selected ? (
            <div>
              <h3 className="font-semibold mb-2">{selected.toDateString()}</h3>
              {(availability[keyFor(selected)] || []).map((time) => (
                <button
                  key={time}
                  className="block w-full text-left px-3 py-2 mb-2 rounded-xl border"
                  style={{ borderColor: PFIZER.blue3, color: PFIZER.blue2 }}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Select a date to see available times.
            </p>
          )}

          {/* Divider */}
          <hr className="my-4" />

          {/* Send note */}
          <h3 className="font-semibold mb-2">Send a Note</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a quick message to your doctor..."
            className="w-full rounded-xl border p-2 mb-3"
            style={{ borderColor: PFIZER.blue3 }}
          />
          <button
            className="px-4 py-2 rounded-xl font-medium shadow-sm"
            style={{ background: PFIZER.blue6, color: "white" }}
          >
            Send
          </button>
        </aside>
      </main>
    </div>
  );
}
