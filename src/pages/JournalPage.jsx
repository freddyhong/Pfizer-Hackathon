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

const MoodGraph = ({ data, selectedDate, onDateChange }) => (
  <div className="mb-8">
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-2xl font-bold tracking-wide text-[#488CCA]">Mood Log</h2>
      <input
        type="date"
        className="rounded-md border px-2 py-1 text-sm shadow-sm"
        style={{ borderColor: PFIZER.blue4 }}
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
      />
    </div>
    <div className="rounded-2xl border p-4 shadow bg-white overflow-x-auto" style={{ borderColor: PFIZER.blue4 }}>
      <ResponsiveContainer width={900} height={220}>
        <LineChart data={data} margin={{ top: 32, right: 0, bottom: 16, left: 0 }}>
          <XAxis dataKey="date" angle={-25} textAnchor="end" interval={4} height={60} />
          <YAxis domain={[0, 4]} tickFormatter={(v) => emojisMood[v]} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={(val) => emojisMood[val]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={PFIZER.blue5}
            strokeWidth={2}
            dot={({ cx, cy, index }) => {
              const isSelected = data[index]?.date === selectedDate;
              return <circle cx={cx} cy={cy} r={isSelected ? 6 : 4} fill={isSelected ? PFIZER.blue3 : PFIZER.blue5} />;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const PainGraph = ({ data, selectedDate, onDateChange }) => (
  <div className="mb-8">
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-2xl font-bold tracking-wide text-[#272C77]">Pain Log</h2>
      <input
        type="date"
        className="rounded-md border px-2 py-1 text-sm shadow-sm"
        style={{ borderColor: PFIZER.blue4 }}
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
      />
    </div>
    <div className="rounded-2xl border p-4 shadow bg-white overflow-x-auto" style={{ borderColor: PFIZER.blue4 }}>
      <ResponsiveContainer width={900} height={220}>
        <LineChart data={data} margin={{ top: 32, right: 0, bottom: 16, left: 0 }}>
          <XAxis dataKey="date" angle={-25} textAnchor="end" interval={4} height={60} />
          <YAxis domain={[0, 9]} tickFormatter={(v) => emojisPain[v]} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={(val) => emojisPain[val]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={PFIZER.blue3}
            strokeWidth={2}
            dot={({ cx, cy, index }) => {
              const isSelected = data[index]?.date === selectedDate;
              return <circle cx={cx} cy={cy} r={isSelected ? 6 : 4} fill={isSelected ? PFIZER.blue1 : PFIZER.blue3} />;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const FeelingCard = ({ date, words, index }) => (
  <div
    className={`rounded-2xl border shadow-md p-4 text-sm hover:shadow-lg transition-shadow ${index % 2 === 0 ? "bg-white" : "bg-[#EBF5FC]"}`}
    style={{ borderColor: PFIZER.blue4 }}
  >
    <div className="text-xs text-gray-500 mb-1 font-medium">{date}</div>
    <ul className="list-disc list-inside">
      {words.map((word, i) => <li key={i}>{word}</li>)}
    </ul>
  </div>
);

export default function DailyJournal() {
  const [moodData, setMoodData] = useState([]);
  const [painData, setPainData] = useState([]);
  const [selectedMoodDate, setSelectedMoodDate] = useState("");
  const [selectedPainDate, setSelectedPainDate] = useState("");

  useEffect(() => {
    const mood = generateRandomData(5);
    const pain = generateRandomData(10);
    setMoodData(mood);
    setPainData(pain);
    setSelectedMoodDate(mood[mood.length - 1]?.date);
    setSelectedPainDate(pain[pain.length - 1]?.date);
  }, []);

  const feelingWords = useMemo(() => {
    const dates = moodData.map((d) => d.date);
    return dates.map((date) => ({
      date,
      words: ["happy", "hopeful", "energized", "calm", "worried", "sad", "curious"].sort(() => 0.5 - Math.random()).slice(0, 3),
    }));
  }, [moodData]);

  const selectedFeeling = feelingWords.find((entry) => entry.date === selectedMoodDate || entry.date === selectedPainDate);

  return (
    <div className="min-h-screen w-full overflow-x-hidden ml-32" style={{ background: `linear-gradient(270deg, ${PFIZER.blue5}, ${PFIZER.blue8})` }}>
      <header className="sticky top-0 z-30 backdrop-blur bg-white/80 shadow-sm" style={{ borderColor: PFIZER.blue4 }}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: PFIZER.blue1 }}>Daily Journal</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 flex flex-col gap-6">
          <MoodGraph data={moodData} selectedDate={selectedMoodDate} onDateChange={setSelectedMoodDate} />
          <PainGraph data={painData} selectedDate={selectedPainDate} onDateChange={setSelectedPainDate} />

          <div>
            <h2 className="text-2xl font-bold tracking-wide text-[#3857A6] mb-2">Feeling Words Diary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {feelingWords.slice(0, 9).map((entry, i) => (
                <FeelingCard key={i} index={i} date={entry.date} words={entry.words} />
              ))}
            </div>
          </div>
        </section>

        <aside
          className="rounded-2xl shadow p-4 sm:p-6 flex flex-col gap-3 h-fit"
          style={{ background: `linear-gradient(270deg, ${PFIZER.blue7}, ${PFIZER.blue8})` }}>

          <hr style={{ borderTop: "4px solid #488CCA", marginTop: "1rem" }} />
          <h2 className="text-xl font-bold text-[#488CCA]">Overview of Today</h2>
          <div className="bg-white/80 rounded-xl border border-blue-200 px-4 py-3 text-sm">
            <p className="mb-1"><strong>Mood Date:</strong> {selectedMoodDate}</p>
            <p className="mb-1"><strong>Pain Date:</strong> {selectedPainDate}</p>
            <p className="mb-1"><strong>Feeling Words Diary:</strong></p>
            <ul className="list-disc list-inside">
              {selectedFeeling?.words.map((word, i) => <li key={i}>{word}</li>)}
            </ul>
          </div>

          <hr style={{ borderTop: "4px solid #3857A6", marginTop: "2rem" }} />
          <h2 className="text-xl font-bold text-[#3857A6]">Weekly Status</h2>
          <div className="bg-white/80 rounded-xl border border-blue-200 px-4 py-3 text-sm">
            <p>Zach has been suffering through lots of pain this week. He's been mostly unhappy for the past 3 days.</p>
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
