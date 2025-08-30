// src/pages/DailyJournal.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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

const emojisMood = ["😢", "😔", "😐", "🙂", "😄"];
const emojisPain = ["😀", "🙂", "😐", "😟", "😖", "😫", "😩", "😢", "😭", "💀"];
const monthFmt = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" });

function generateRandomData(scale, days = 75) {
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - i));
    return {
      date: date.toLocaleDateString("en-CA"),
      value: Math.floor(Math.random() * scale),
    };
  });
}

const MoodGraph = ({ data }) => (
  <div className="mb-8">
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-2xl font-bold tracking-wide text-[#488CCA]">Mood Log</h2>
    </div>
    <div
      className="rounded-2xl border p-4 shadow bg-white overflow-x-auto"
      style={{ borderColor: PFIZER.blue4 }}
    >
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 32, right: 0, bottom: 16, left: 0 }}>
          <XAxis dataKey="date" tickFormatter={(d) => d.slice(8)} interval="preserveStartEnd" />
          <YAxis domain={[0, 4]} tickFormatter={(v) => emojisMood[v]} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={(val) => emojisMood[val]} />
          <Line type="monotone" dataKey="value" stroke={PFIZER.blue5} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const PainGraph = ({ data }) => (
  <div className="mb-8">
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-2xl font-bold tracking-wide text-[#272C77]">Pain Log</h2>
    </div>
    <div
      className="rounded-2xl border p-4 shadow bg-white overflow-x-auto"
      style={{ borderColor: PFIZER.blue4 }}
    >
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 32, right: 0, bottom: 16, left: 0 }}>
          <XAxis dataKey="date" tickFormatter={(d) => d.slice(8)} interval="preserveStartEnd" />
          <YAxis domain={[0, 9]} tickFormatter={(v) => emojisPain[v]} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={(val) => emojisPain[val]} />
          <Line type="monotone" dataKey="value" stroke={PFIZER.blue3} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const FeelingCard = ({ date, words, index }) => (
  <div
    className={`rounded-2xl border shadow-md p-4 text-sm hover:shadow-lg transition-shadow ${
      index % 2 === 0 ? "bg-white" : "bg-[#EBF5FC]"
    }`}
    style={{ borderColor: PFIZER.blue4 }}
  >
    <div className="text-xs text-gray-500 mb-1 font-medium">{date}</div>
    <ul className="list-disc list-inside">
      {words.map((word, i) => (
        <li key={i}>{word}</li>
      ))}
    </ul>
  </div>
);

export default function DailyJournal() {
  const [fullMoodData, setFullMoodData] = useState([]);
  const [fullPainData, setFullPainData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().setDate(1)));

  useEffect(() => {
    setFullMoodData(generateRandomData(5));
    setFullPainData(generateRandomData(10));
  }, []);

  const monthlyMoodData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const prefix = `${year}-${month}`;
    return fullMoodData.filter((d) => d.date.startsWith(prefix));
  }, [fullMoodData, currentMonth]);

  const monthlyPainData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const prefix = `${year}-${month}`;
    return fullPainData.filter((d) => d.date.startsWith(prefix));
  }, [fullPainData, currentMonth]);

  const feelingWords = useMemo(() => {
    const dates = monthlyMoodData.map((d) => d.date);
    return dates.map((date) => ({
      date,
      words: ["happy", "hopeful", "energized", "calm", "worried", "sad", "curious"]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3),
    }));
  }, [monthlyMoodData]);

  // 👉 Monthly summary (avg mood + avg pain)
  const avgMood =
    monthlyMoodData.length > 0
      ? (monthlyMoodData.reduce((s, d) => s + d.value, 0) / monthlyMoodData.length).toFixed(1)
      : "-";
  const avgPain =
    monthlyPainData.length > 0
      ? (monthlyPainData.reduce((s, d) => s + d.value, 0) / monthlyPainData.length).toFixed(1)
      : "-";

  function changeMonth(delta) {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden ml-32"
      style={{ background: `linear-gradient(270deg, ${PFIZER.blue5}, ${PFIZER.blue8})` }}
    >
      <header
        className="sticky top-0 z-30 backdrop-blur bg-white/80 shadow-sm"
        style={{ borderColor: PFIZER.blue4 }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: PFIZER.blue1 }}>
            Daily Journal
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeMonth(-1)}
              className="px-3 py-1 rounded-md text-sm border bg-white"
              style={{ borderColor: PFIZER.blue4 }}
            >
              ◀ Prev
            </button>
            <h2
              className="text-lg font-semibold w-36 text-center"
              style={{ color: PFIZER.blue2 }}
            >
              {monthFmt.format(currentMonth)}
            </h2>
            <button
              onClick={() => changeMonth(1)}
              className="px-3 py-1 rounded-md text-sm border bg-white"
              style={{ borderColor: PFIZER.blue4 }}
            >
              Next ▶
            </button>
            <button
              onClick={() => setCurrentMonth(new Date(new Date().setDate(1)))}
              className="ml-2 px-3 py-1 rounded-md text-sm border text-white"
              style={{ borderColor: PFIZER.blue4, backgroundColor: PFIZER.blue5 }}
            >
              This Month
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 flex flex-col gap-6">
          <MoodGraph data={monthlyMoodData} />
          <PainGraph data={monthlyPainData} />
          <div>
            <h2 className="text-2xl font-bold tracking-wide text-[#3857A6] mb-2">
              Feeling Words Diary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {feelingWords.slice(0, 9).map((entry, i) => (
                <FeelingCard key={i} index={i} date={entry.date} words={entry.words} />
              ))}
            </div>
          </div>
        </section>

        <aside
          className="rounded-2xl shadow p-4 sm:p-6 flex flex-col gap-3 h-fit"
          style={{ background: `linear-gradient(270deg, ${PFIZER.blue7}, ${PFIZER.blue8})` }}
        >
          <hr style={{ borderTop: "4px solid #488CCA", marginTop: "1rem" }} />
          <h2 className="text-xl font-bold text-[#488CCA]">Overview of Month</h2>
          <div className="bg-white/80 rounded-xl border border-blue-200 px-4 py-3 text-sm">
            <p className="mb-1">
              <strong>Month:</strong> {monthFmt.format(currentMonth)}
            </p>
            <p className="mb-1">
              <strong>Avg Mood:</strong> {avgMood} / 4
            </p>
            <p className="mb-1">
              <strong>Avg Pain:</strong> {avgPain} / 9
            </p>
          </div>

          <hr style={{ borderTop: "4px solid #3857A6", marginTop: "2rem" }} />
          <h2 className="text-xl font-bold text-[#3857A6]">Weekly Status</h2>
          <div className="bg-white/80 rounded-xl border border-blue-200 px-4 py-3 text-sm">
            <p>
              Zach has been suffering through lots of pain this week. He's been mostly unhappy for
              the past 3 days.
            </p>
          </div>

          <hr style={{ borderTop: "4px solid #272C77", marginTop: "2rem" }} />
          <h2 className="text-xl font-bold text-[#272C77]">Tips</h2>
          <div className="bg-white/80 rounded-xl border border-blue-200 px-4 py-3 text-sm">
            <ul className="list-disc list-inside">
              <li>Help Zach engage in light, enjoyable activities or games.</li>
              <li>Encourage positive reinforcement through character rewards.</li>
              <li>Take note of daily pain levels and mood patterns.</li>
              <li>Share this log with Zach’s doctors and nurses regularly.</li>
            </ul>
          </div>
        </aside>
      </main>

      <footer className="py-4" />
    </div>
  );
}
