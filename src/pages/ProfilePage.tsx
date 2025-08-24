// src/pages/ProfilePage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import characterImage from "../assets/character.png"; // Poko's profile picture (auto-set)

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

// --- Utilities --------------------------------------------------------------
function fmtDateInput(d?: Date | null) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDate(str: string): Date | null {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function calcAge(bday: Date | null): { years: number; months: number } | null {
  if (!bday) return null;
  const today = new Date();
  let years = today.getFullYear() - bday.getFullYear();
  let months = today.getMonth() - bday.getMonth();
  if (today.getDate() < bday.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) return null;
  return { years, months };
}

function fmtHMS(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

// --- LocalStorage keys ------------------------------------------------------
const LS_KEYS = {
  avatar: "poko.profile.avatarDataUrl",
  username: "poko.profile.username",
  birthday: "poko.profile.birthday",
  missionStreak: "poko.profile.longestMissionStreak",
  attendanceStreak: "poko.profile.longestAttendanceStreak",
  achievements: "poko.profile.achievements",
  pokoBirthday: "poko.profile.pokoBirthday",
  // New:
  enrollmentDate: "poko.profile.enrollmentDate",
  playtimeSeconds: "poko.profile.playtimeSeconds",
  playTimerRunning: "poko.profile.playTimerRunning",
  playTimerStartedAt: "poko.profile.playTimerStartedAt",
  money: "poko.profile.money",
  pokoPersonality: "poko.profile.pokoPersonality",
};

// --- Components -------------------------------------------------------------
function AvatarUpload({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-24 h-24 rounded-2xl overflow-hidden border shadow"
        style={{ borderColor: PFIZER.blue4, background: PFIZER.blue8 }}
      >
        {value ? (
          <img
            src={value}
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full grid place-items-center text-sm"
            style={{ color: PFIZER.blue4 }}
          >
            No photo
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded-xl text-sm font-medium border"
            style={{
              background: PFIZER.blue6,
              color: "white",
              borderColor: PFIZER.blue4,
            }}
            onClick={() => inputRef.current?.click()}
          >
            Upload
          </button>
          {value && (
            <button
              className="px-3 py-2 rounded-xl text-sm font-medium border"
              style={{
                background: "white",
                color: PFIZER.blue4,
                borderColor: PFIZER.blue4,
              }}
              onClick={() => onChange(null)}
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => onChange(String(reader.result));
            reader.readAsDataURL(file);
            e.currentTarget.value = ""; // reset
          }}
        />
        <p className="text-xs" style={{ color: PFIZER.blue2 }}>
          Recommended: square image, ≥ 256×256
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div
      className="rounded-2xl p-4 border shadow-sm flex items-center justify-between"
      style={{ borderColor: PFIZER.blue4, background: "white" }}
    >
      <div>
        <div
          className="text-xs uppercase tracking-wide"
          style={{ color: PFIZER.blue2 }}
        >
          {label}
        </div>
        <div className="text-2xl font-bold" style={{ color: PFIZER.blue1 }}>
          {value} days
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-2 rounded-xl text-sm border"
          style={{ borderColor: PFIZER.blue4, color: PFIZER.blue4 }}
          onClick={() => onChange(Math.max(0, value - 1))}
        >
          −
        </button>
        <button
          className="px-3 py-2 rounded-xl text-sm border"
          style={{ borderColor: PFIZER.blue4, color: PFIZER.blue4 }}
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

function AchievementBadge({
  title,
  onRemove,
}: {
  title: string;
  onRemove: () => void;
}) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm shadow-sm"
      style={{
        background: PFIZER.blue8,
        borderColor: PFIZER.blue5,
        color: PFIZER.blue2,
      }}
    >
      <span className="truncate max-w-[10rem]" title={title}>
        {title}
      </span>
      <button
        className="text-xs px-2 py-0.5 rounded-md border"
        style={{ borderColor: PFIZER.blue4, color: PFIZER.blue4 }}
        onClick={onRemove}
      >
        Remove
      </button>
    </div>
  );
}

// Small coin glyph
function Coin({ size = 20 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block rounded-full border shadow-sm"
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 30% 30%, #fff7c2, #ffd84d 60%, #e0aa00 90%)",
        borderColor: "#d19c00",
      }}
    />
  );
}

export default function ProfilePage() {
  // --- Profile state --------------------------------------------------------
  const [avatar, setAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [birthdayStr, setBirthdayStr] = useState("");

  const [missionStreak, setMissionStreak] = useState(0);
  const [attendanceStreak, setAttendanceStreak] = useState(0);

  const [achievements, setAchievements] = useState<string[]>([
    "Welcome Aboard",
    "First Mission Complete",
  ]);
  const [newAchv, setNewAchv] = useState("");

  // --- New: Enrollment, Playtime, Money ------------------------------------
  const [enrollmentDateStr, setEnrollmentDateStr] = useState("");
  const [playtimeSeconds, setPlaytimeSeconds] = useState(0);
  const [playRunning, setPlayRunning] = useState(false);
  const playTickRef = useRef<number | null>(null);
  const [playStartedAt, setPlayStartedAt] = useState<number | null>(null); // epoch ms
  const [money, setMoney] = useState<number>(0);

  // --- Poko state -----------------------------------------------------------
  const [pokoBirthdayStr, setPokoBirthdayStr] = useState("");
  const pokoBirthday = useMemo(
    () => parseDate(pokoBirthdayStr),
    [pokoBirthdayStr]
  );
  const pokoAge = useMemo(() => calcAge(pokoBirthday), [pokoBirthday]);

  // --- New: Poko Personality ------------------------------------------------
  const [pokoPersonality, setPokoPersonality] = useState<string>("Courageous");

  // Load from localStorage once
  useEffect(() => {
    try {
      setAvatar(localStorage.getItem(LS_KEYS.avatar));
      setUsername(localStorage.getItem(LS_KEYS.username) || "");
      setBirthdayStr(localStorage.getItem(LS_KEYS.birthday) || "");
      setMissionStreak(
        Number(localStorage.getItem(LS_KEYS.missionStreak) || 0)
      );
      setAttendanceStreak(
        Number(localStorage.getItem(LS_KEYS.attendanceStreak) || 0)
      );
      const ach = localStorage.getItem(LS_KEYS.achievements);
      if (ach) setAchievements(JSON.parse(ach));
      setPokoBirthdayStr(localStorage.getItem(LS_KEYS.pokoBirthday) || "");

      // New loads
      setEnrollmentDateStr(localStorage.getItem(LS_KEYS.enrollmentDate) || "");
      setPlaytimeSeconds(Number(localStorage.getItem(LS_KEYS.playtimeSeconds) || 0));
      setMoney(Number(localStorage.getItem(LS_KEYS.money) || 1000));
      const savedPersonality = localStorage.getItem(LS_KEYS.pokoPersonality);
      if (savedPersonality) setPokoPersonality(savedPersonality);

      const running = localStorage.getItem(LS_KEYS.playTimerRunning) === "1";
      const startedAt = localStorage.getItem(LS_KEYS.playTimerStartedAt);
      if (running) {
        setPlayRunning(true);
        if (startedAt) setPlayStartedAt(Number(startedAt));
      }
    } catch {
      // Ignore localStorage errors (e.g., quota exceeded)
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      if (avatar) localStorage.setItem(LS_KEYS.avatar, avatar);
      else localStorage.removeItem(LS_KEYS.avatar);
      localStorage.setItem(LS_KEYS.username, username);
      localStorage.setItem(LS_KEYS.birthday, birthdayStr);
      localStorage.setItem(LS_KEYS.missionStreak, String(missionStreak));
      localStorage.setItem(LS_KEYS.attendanceStreak, String(attendanceStreak));
      localStorage.setItem(LS_KEYS.achievements, JSON.stringify(achievements));
      localStorage.setItem(LS_KEYS.pokoBirthday, pokoBirthdayStr);

      // New persists
      localStorage.setItem(LS_KEYS.enrollmentDate, enrollmentDateStr);
      localStorage.setItem(LS_KEYS.playtimeSeconds, String(playtimeSeconds));
      localStorage.setItem(LS_KEYS.money, String(money));
      localStorage.setItem(LS_KEYS.pokoPersonality, pokoPersonality);

      localStorage.setItem(LS_KEYS.playTimerRunning, playRunning ? "1" : "0");
      if (playStartedAt) {
        localStorage.setItem(
          LS_KEYS.playTimerStartedAt,
          String(playStartedAt)
        );
      } else {
        localStorage.removeItem(LS_KEYS.playTimerStartedAt);
      }
    } catch (err) {
      console.error("Failed to persist profile to localStorage", err);
    }
  }, [
    avatar,
    username,
    birthdayStr,
    missionStreak,
    attendanceStreak,
    achievements,
    pokoBirthdayStr,
    enrollmentDateStr,
    playtimeSeconds,
    playRunning,
    playStartedAt,
    money,
    pokoPersonality,
  ]);

  // Default Poko birthday (once)
  useEffect(() => {
    if (!pokoBirthdayStr) setPokoBirthdayStr(fmtDateInput(new Date()));
  }, [pokoBirthdayStr]);

  // Default Enrollment Date (once, if empty)
  useEffect(() => {
    if (!enrollmentDateStr) setEnrollmentDateStr(fmtDateInput(new Date()));
  }, [enrollmentDateStr]);

  // Handle playtime timer
  useEffect(() => {
    if (!playRunning) {
      if (playTickRef.current) {
        window.clearInterval(playTickRef.current);
        playTickRef.current = null;
      }
      return;
    }
    // If timer starts and we don't have a start timestamp, set one
    if (!playStartedAt) {
      setPlayStartedAt(Date.now());
    }
    playTickRef.current = window.setInterval(() => {
      // Each tick: add seconds since last tick. To avoid drift, compute from startedAt.
      setPlaytimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      if (playTickRef.current) {
        window.clearInterval(playTickRef.current);
        playTickRef.current = null;
      }
    };
  }, [playRunning, playStartedAt]);

  const togglePlayTimer = () => {
    if (playRunning) {
      // stopping: finalize elapsed since startedAt to be safe
      if (playStartedAt) {
        const elapsed = Math.floor((Date.now() - playStartedAt) / 1000);
        setPlaytimeSeconds((s) => s + Math.max(0, elapsed % 1 === 0 ? 0 : 0)); // interval already accounts every second; no extra add
      }
      setPlayRunning(false);
      setPlayStartedAt(null);
    } else {
      setPlayRunning(true);
      setPlayStartedAt(Date.now());
    }
  };

  return (
    <div
      // 👇 This margin offsets your fixed 16rem-wide sidebar
      className="min-h-screen w-full overflow-x-hidden ml-32"
      style={{
        background: `linear-gradient(180deg, ${PFIZER.blue2}, #ffffff)`,
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 border-b backdrop-blur bg-white/70"
        style={{ borderColor: PFIZER.blue4 }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h1
            className="text-xl sm:text-2xl font-bold"
            style={{ color: PFIZER.blue1 }}
          >
            Profile
          </h1>
          <div className="text-sm" style={{ color: PFIZER.blue2 }}>
            Poko Smartpet
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Profile card */}
        <section
          className="lg:col-span-2 rounded-2xl border shadow bg-white p-4 sm:p-6"
          style={{ borderColor: PFIZER.blue4 }}
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <AvatarUpload value={avatar} onChange={setAvatar} />

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="text-xs uppercase tracking-wide"
                    style={{ color: PFIZER.blue2 }}
                  >
                    Username
                  </label>
                  <input
                    className="mt-1 w-full px-3 py-2 rounded-xl border outline-none focus:ring-2"
                    style={{ borderColor: PFIZER.blue4 }}
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="text-xs uppercase tracking-wide"
                    style={{ color: PFIZER.blue2 }}
                  >
                    Birthday
                  </label>
                  <input
                    type="date"
                    className="mt-1 w-full px-3 py-2 rounded-xl border outline-none focus:ring-2"
                    style={{ borderColor: PFIZER.blue4 }}
                    value={birthdayStr}
                    onChange={(e) => setBirthdayStr(e.target.value)}
                  />
                </div>

                {/* New: Enrollment Date */}
                <div>
                  <label
                    className="text-xs uppercase tracking-wide"
                    style={{ color: PFIZER.blue2 }}
                  >
                    Enrollment Date
                  </label>
                  <input
                    type="date"
                    className="mt-1 w-full px-3 py-2 rounded-xl border outline-none focus:ring-2"
                    style={{ borderColor: PFIZER.blue4 }}
                    value={enrollmentDateStr}
                    onChange={(e) => setEnrollmentDateStr(e.target.value)}
                  />
                </div>

                {/* New: Money (Coins) */}
                <div>
                  <label
                    className="text-xs uppercase tracking-wide"
                    style={{ color: PFIZER.blue2 }}
                  >
                    Money
                  </label>
                  <div className="mt-1 flex items-center justify-between gap-3 rounded-xl border px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Coin />
                      <span
                        className="text-xl font-semibold tabular-nums"
                        style={{ color: PFIZER.blue1 }}
                      >
                        {money}
                      </span>
                    </div>
      
                  </div>
                </div>
              </div>
            </div>

            {/* Streaks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard
                label="Longest Missions Streak"
                value={missionStreak}
                onChange={setMissionStreak}
              />
              <StatCard
                label="Longest Attendance Streak"
                value={attendanceStreak}
                onChange={setAttendanceStreak}
              />
            </div>

            {/* New: Total Playtime */}
            <div
              className="rounded-2xl p-4 border shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              style={{ borderColor: PFIZER.blue4, background: "white" }}
            >
              <div>
                <div
                  className="text-xs uppercase tracking-wide"
                  style={{ color: PFIZER.blue2 }}
                >
                  Total Playtime
                </div>
                <div
                  className="text-2xl font-bold tabular-nums"
                  style={{ color: PFIZER.blue1 }}
                >
                  {fmtHMS(playtimeSeconds)}
                </div>
                <div className="text-xs mt-1" style={{ color: PFIZER.blue2 }}>
                  Counts while the timer is running. Persists across refresh.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-2 rounded-xl text-sm border"
                  style={{
                    borderColor: PFIZER.blue4,
                    color: PFIZER.blue4,
                    background: playRunning ? PFIZER.blue8 : "white",
                  }}
                  onClick={togglePlayTimer}
                  title={playRunning ? "Pause" : "Start"}
                >
                  {playRunning ? "Pause" : "Start"}
                </button>
                <button
                  className="px-3 py-2 rounded-xl text-sm border"
                  style={{ borderColor: PFIZER.blue4, color: PFIZER.blue4 }}
                  onClick={() =>
                    setPlaytimeSeconds((s) => Math.max(0, s - 300))
                  }
                >
                  −5 min
                </button>
                <button
                  className="px-3 py-2 rounded-xl text-sm border"
                  style={{ borderColor: PFIZER.blue4, color: PFIZER.blue4 }}
                  onClick={() => setPlaytimeSeconds((s) => s + 300)}
                >
                  +5 min
                </button>
                <button
                  className="px-3 py-2 rounded-xl text-sm border"
                  style={{ borderColor: PFIZER.blue4, color: PFIZER.blue4 }}
                  onClick={() => {
                    setPlayRunning(false);
                    setPlayStartedAt(null);
                    setPlaytimeSeconds(0);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="text-lg font-bold"
                  style={{ color: PFIZER.blue1 }}
                >
                  Achievements
                </h2>
                <div className="flex gap-2">
                  <input
                    className="px-3 py-2 rounded-xl border outline-none focus:ring-2"
                    style={{ borderColor: PFIZER.blue4 }}
                    placeholder="Add new achievement"
                    value={newAchv}
                    onChange={(e) => setNewAchv(e.target.value)}
                  />
                  <button
                    className="px-4 py-2 rounded-xl font-medium border shadow-sm"
                    style={{
                      background: PFIZER.blue6,
                      color: "white",
                      borderColor: PFIZER.blue5,
                    }}
                    onClick={() => {
                      const t = newAchv.trim();
                      if (!t) return;
                      setAchievements((prev) => [...prev, t]);
                      setNewAchv("");
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {achievements.map((a, i) => (
                  <AchievementBadge
                    key={`${a}-${i}`}
                    title={a}
                    onRemove={() =>
                      setAchievements(
                        achievements.filter((_, idx) => idx !== i)
                      )
                    }
                  />
                ))}
                {achievements.length === 0 && (
                  <div className="text-sm" style={{ color: PFIZER.blue2 }}>
                    No achievements yet. Add your first badge!
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Poko card */}
        <aside
          className="rounded-2xl border shadow bg-white p-4 sm:p-6 flex flex-col"
          style={{ borderColor: PFIZER.blue4 }}
        >
          <h2
            className="text-lg font-bold mb-3 sm:mb-4"
            style={{ color: PFIZER.blue1 }}
          >
            Poko (Smartpet)
          </h2>

          <div
            className="w-full rounded-2xl overflow-hidden border mb-3 sm:mb-4"
            style={{ borderColor: PFIZER.blue5, background: PFIZER.blue8 }}
          >
            <img
              src={characterImage}
              alt="Poko character"
              className="w-full h-40 sm:h-48 object-contain"
            />
          </div>

          <div className="space-y-3">
            <div>
              <label
                className="text-xs uppercase tracking-wide"
                style={{ color: PFIZER.blue2 }}
              >
                Poko's Birthday
              </label>
              <input
                type="date"
                className="mt-1 w-full px-3 py-2 rounded-xl border outline-none focus:ring-2"
                style={{ borderColor: PFIZER.blue4 }}
                value={pokoBirthdayStr}
                onChange={(e) => setPokoBirthdayStr(e.target.value)}
              />
            </div>

            {/* New: Personality */}
            <div>
              <label
                className="text-xs uppercase tracking-wide"
                style={{ color: PFIZER.blue2 }}
              >
                Personality
              </label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl border outline-none focus:ring-2"
                style={{ borderColor: PFIZER.blue4 }}
                value={pokoPersonality}
                onChange={(e) => setPokoPersonality(e.target.value)}
                placeholder="e.g., Courageous"
              />
              <p className="text-xs mt-1" style={{ color: PFIZER.blue2 }}>
                Defaulted to <span className="font-semibold">Courageous</span>.
              </p>
            </div>

            <div
              className="rounded-2xl p-4 border"
              style={{ borderColor: PFIZER.blue5, background: PFIZER.blue8 }}
            >
              <div
                className="text-xs uppercase tracking-wide"
                style={{ color: PFIZER.blue2 }}
              >
                Poko's Age
              </div>
              <div
                className="text-xl font-semibold"
                style={{ color: PFIZER.blue1 }}
              >
                {pokoAge ? `${pokoAge.years}y ${pokoAge.months}m` : "—"}
              </div>
            </div>

            <div
              className="rounded-2xl p-4 border"
              style={{ borderColor: PFIZER.blue4 }}
            >
              <div
                className="text-xs uppercase tracking-wide"
                style={{ color: PFIZER.blue2 }}
              >
                Quick Tips
              </div>
              <ul
                className="list-disc pl-5 text-sm"
                style={{ color: PFIZER.blue2 }}
              >
                <li>Use the Upload button to set your profile photo.</li>
                <li>Streak counters are editable for testing/demo.</li>
                <li>All values are saved locally in your browser.</li>
              </ul>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer spacing */}
      <footer className="py-4" />
    </div>
  );
}
