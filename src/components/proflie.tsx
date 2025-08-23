import React, { useEffect, useMemo, useRef, useState } from "react";
import characterImage from "./assets/character.png"; // Poko's profile picture (auto-set)

/**
 * PokoProfilePage
 * - Profile photo upload & preview (stored in localStorage)
 * - Username, Birthday (editable)
 * - Longest mission & attendance streaks (editable)
 * - Achievements section (add/remove badges)
 * - Poko (smartpet) card: photo, birthday (editable), age (auto-calculated)
 * - Pfizer palette applied throughout
 *
 * Tailwind required. No external libs necessary.
 */

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

// --- LocalStorage helpers ---------------------------------------------------
const LS_KEYS = {
  avatar: "poko.profile.avatarDataUrl",
  username: "poko.profile.username",
  birthday: "poko.profile.birthday",
  missionStreak: "poko.profile.longestMissionStreak",
  attendanceStreak: "poko.profile.longestAttendanceStreak",
  achievements: "poko.profile.achievements",
  pokoBirthday: "poko.profile.pokoBirthday",
};

// --- Components -------------------------------------------------------------
function AvatarUpload({ value, onChange }: { value: string | null; onChange: (dataUrl: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-24 h-24 rounded-2xl overflow-hidden border shadow"
        style={{ borderColor: PFIZER.blue4, background: PFIZER.blue8 }}
      >
        {value ? (
          <img src={value} alt="User avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-sm" style={{ color: PFIZER.blue4 }}>
            No photo
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded-xl text-sm font-medium border"
            style={{ background: PFIZER.blue6, color: "white", borderColor: PFIZER.blue4 }}
            onClick={() => inputRef.current?.click()}
          >
            Upload
          </button>
          {value && (
            <button
              className="px-3 py-2 rounded-xl text-sm font-medium border"
              style={{ background: "white", color: PFIZER.blue4, borderColor: PFIZER.blue4 }}
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

function StatCard({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="rounded-2xl p-4 border shadow-sm flex items-center justify-between" style={{ borderColor: PFIZER.blue4, background: "white" }}>
      <div>
        <div className="text-xs uppercase tracking-wide" style={{ color: PFIZER.blue2 }}>{label}</div>
        <div className="text-2xl font-bold" style={{ color: PFIZER.blue1 }}>{value} days</div>
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

function AchievementBadge({ title, onRemove }: { title: string; onRemove: () => void }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm shadow-sm"
      style={{ background: PFIZER.blue8, borderColor: PFIZER.blue5, color: PFIZER.blue2 }}>
      <span className="truncate max-w-[10rem]" title={title}>{title}</span>
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

export default function PokoProfilePage() {
  // --- Profile state --------------------------------------------------------
  const [avatar, setAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [birthdayStr, setBirthdayStr] = useState("");

  const [missionStreak, setMissionStreak] = useState(0);
  const [attendanceStreak, setAttendanceStreak] = useState(0);

  const [achievements, setAchievements] = useState<string[]>(["Welcome Aboard", "First Mission Complete"]);
  const [newAchv, setNewAchv] = useState("");

  // --- Poko state -----------------------------------------------------------
  const [pokoBirthdayStr, setPokoBirthdayStr] = useState("");
  const pokoBirthday = useMemo(() => parseDate(pokoBirthdayStr), [pokoBirthdayStr]);
  const pokoAge = useMemo(() => calcAge(pokoBirthday), [pokoBirthday]);

  // Load from localStorage once
  useEffect(() => {
    try {
      setAvatar(localStorage.getItem(LS_KEYS.avatar));
      setUsername(localStorage.getItem(LS_KEYS.username) || "");
      setBirthdayStr(localStorage.getItem(LS_KEYS.birthday) || "");
      setMissionStreak(Number(localStorage.getItem(LS_KEYS.missionStreak) || 0));
      setAttendanceStreak(Number(localStorage.getItem(LS_KEYS.attendanceStreak) || 0));
      const ach = localStorage.getItem(LS_KEYS.achievements);
      if (ach) setAchievements(JSON.parse(ach));
      setPokoBirthdayStr(localStorage.getItem(LS_KEYS.pokoBirthday) || "");
    } catch {
      // Ignore localStorage errors (e.g., quota exceeded)
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      if (avatar) localStorage.setItem(LS_KEYS.avatar, avatar); else localStorage.removeItem(LS_KEYS.avatar);
      localStorage.setItem(LS_KEYS.username, username);
      localStorage.setItem(LS_KEYS.birthday, birthdayStr);
      localStorage.setItem(LS_KEYS.missionStreak, String(missionStreak));
      localStorage.setItem(LS_KEYS.attendanceStreak, String(attendanceStreak));
      localStorage.setItem(LS_KEYS.achievements, JSON.stringify(achievements));
      localStorage.setItem(LS_KEYS.pokoBirthday, pokoBirthdayStr);
    } catch (err) {
      console.error("Failed to persist profile to localStorage", err);
    }
  }, [avatar, username, birthdayStr, missionStreak, attendanceStreak, achievements, pokoBirthdayStr]);

  // Defaults for initial UX (if no Poko birthday, use today)
  useEffect(() => {
    if (!pokoBirthdayStr) setPokoBirthdayStr(fmtDateInput(new Date()));
  }, [pokoBirthdayStr]);

  // Defaults for initial UX (if no Poko birthday, use today)
  useEffect(() => {
    if (!pokoBirthdayStr) setPokoBirthdayStr(fmtDateInput(new Date()));
  }, [pokoBirthdayStr]);

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${PFIZER.blue2}, #ffffff)` }}>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b backdrop-blur bg-white/70" style={{ borderColor: PFIZER.blue4 }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: PFIZER.blue1 }}>Profile</h1>
          <div className="text-sm" style={{ color: PFIZER.blue2 }}>Poko Smartpet</div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <section className="lg:col-span-2 rounded-2xl border shadow bg-white p-6" style={{ borderColor: PFIZER.blue4 }}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <AvatarUpload value={avatar} onChange={setAvatar} />

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wide" style={{ color: PFIZER.blue2 }}>Username</label>
                  <input
                    className="mt-1 w-full px-3 py-2 rounded-xl border outline-none focus:ring-2"
                    style={{ borderColor: PFIZER.blue4 }}
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide" style={{ color: PFIZER.blue2 }}>Birthday</label>
                  <input
                    type="date"
                    className="mt-1 w-full px-3 py-2 rounded-xl border outline-none focus:ring-2"
                    style={{ borderColor: PFIZER.blue4 }}
                    value={birthdayStr}
                    onChange={(e) => setBirthdayStr(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard label="Longest Missions Streak" value={missionStreak} onChange={setMissionStreak} />
              <StatCard label="Longest Attendance Streak" value={attendanceStreak} onChange={setAttendanceStreak} />
            </div>

            {/* Achievements */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold" style={{ color: PFIZER.blue1 }}>Achievements</h2>
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
                    style={{ background: PFIZER.blue6, color: "white", borderColor: PFIZER.blue5 }}
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
                  <AchievementBadge key={`${a}-${i}`} title={a} onRemove={() => setAchievements(achievements.filter((_, idx) => idx !== i))} />
                ))}
                {achievements.length === 0 && (
                  <div className="text-sm" style={{ color: PFIZER.blue2 }}>No achievements yet. Add your first badge!</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Poko card */}
        <aside className="rounded-2xl border shadow bg-white p-6 flex flex-col" style={{ borderColor: PFIZER.blue4 }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: PFIZER.blue1 }}>Poko (Smartpet)</h2>

          <div className="w-full rounded-2xl overflow-hidden border mb-4" style={{ borderColor: PFIZER.blue5, background: PFIZER.blue8 }}>
            <img src={characterImage} alt="Poko character" className="w-full h-48 object-contain" />
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs uppercase tracking-wide" style={{ color: PFIZER.blue2 }}>Poko's Birthday</label>
              <input
                type="date"
                className="mt-1 w-full px-3 py-2 rounded-xl border outline-none focus:ring-2"
                style={{ borderColor: PFIZER.blue4 }}
                value={pokoBirthdayStr}
                onChange={(e) => setPokoBirthdayStr(e.target.value)}
              />
            </div>

            <div className="rounded-2xl p-4 border" style={{ borderColor: PFIZER.blue5, background: PFIZER.blue8 }}>
              <div className="text-xs uppercase tracking-wide" style={{ color: PFIZER.blue2 }}>Poko's Age</div>
              <div className="text-xl font-semibold" style={{ color: PFIZER.blue1 }}>
                {pokoAge ? `${pokoAge.years}y ${pokoAge.months}m` : "—"}
              </div>
            </div>

            <div className="rounded-2xl p-4 border" style={{ borderColor: PFIZER.blue4 }}>
              <div className="text-xs uppercase tracking-wide" style={{ color: PFIZER.blue2 }}>Quick Tips</div>
              <ul className="list-disc pl-5 text-sm" style={{ color: PFIZER.blue2 }}>
                <li>Use the Upload button to set your profile photo.</li>
                <li>Streak counters are editable for testing/demo.</li>
                <li>All values are saved locally in your browser.</li>
              </ul>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="py-6">
        <div className="max-w-6xl mx-auto px-6 text-xs text-center" style={{ color: PFIZER.blue2 }}>
          Tip: replace palette hex codes in PFIZER to match official brand guidelines.
        </div>
      </footer>
    </div>
  );
}
