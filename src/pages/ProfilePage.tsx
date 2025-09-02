// src/pages/ProfilePage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import characterImage from "../assets/character.png";

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

export default function ProfilePage() {
  const [username] = useState("Pirate Zach");
  const [birthdayStr] = useState("2015-08-04");
  const [enrollmentDateStr] = useState("2025-08-03");
  const [money] = useState("2.7K");
  const [pokoBirthdayStr] = useState("2025-08-04");
  const [pokoPersonality] = useState("Courageous");
  const [pokoName] = useState("Bluey");
  const pokoBirthday = useMemo(
    () => new Date(pokoBirthdayStr),
    [pokoBirthdayStr]
  );
  const pokoAge = useMemo(() => {
    const today = new Date();
    let years = today.getFullYear() - pokoBirthday.getFullYear();
    let months = today.getMonth() - pokoBirthday.getMonth();
    if (today.getDate() < pokoBirthday.getDate()) months--;
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months };
  }, [pokoBirthday]);

  type AchievementCardProps = {
    title: string;
    description: string;
    condition: string;
    icon: React.ReactNode;
  };

  const AchievementCard: React.FC<AchievementCardProps> = ({
    title,
    description,
    condition,
    icon,
  }) => (
    <div
      className="rounded-2xl p-4 border shadow flex flex-col gap-1"
      style={{
        background: PFIZER.blue1,
        borderColor: PFIZER.blue3,
        color: "white",
      }}
    >
      <div className="text-3xl mb-1">{icon}</div>
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm">{description}</div>
      <div className="text-xs mt-1 text-blue-200">{condition}</div>
    </div>
  );

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden ml-32"
      style={{
        background: `linear-gradient(180deg, ${PFIZER.blue2}, #ffffff)`,
      }}
    >
      <header
        className="sticky top-0 z-30 border-b backdrop-blur bg-white/70"
        style={{ borderColor: PFIZER.blue4 }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h1
            className="text-xl sm:text-3xl font-bold"
            style={{ color: PFIZER.blue1 }}
          >
            Zach's Profile
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <section
          className="lg:col-span-2 rounded-2xl border shadow bg-white p-4 sm:p-6"
          style={{ borderColor: PFIZER.blue4 }}
        >
          <div className="flex flex-col gap-6">
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
                  value={username}
                  readOnly
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
                  readOnly
                />
              </div>
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
                  readOnly
                />
              </div>
              <div>
                <label
                  className="text-xs uppercase tracking-wide"
                  style={{ color: PFIZER.blue2 }}
                >
                  Money
                </label>
                <div
                  className="mt-1 flex items-center gap-2 rounded-xl border px-3 py-2"
                  style={{ borderColor: PFIZER.blue4 }}
                >
                  <span className="text-xl">💰</span>
                  <span
                    className="text-xl font-semibold tabular-nums"
                    style={{ color: PFIZER.blue1 }}
                  >
                    {money}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="rounded-2xl p-4 border shadow-sm"
                style={{ borderColor: PFIZER.blue4, background: "white" }}
              >
                <div
                  className="text-xs uppercase tracking-wide"
                  style={{ color: PFIZER.blue2 }}
                >
                  Longest Missions Streak
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: PFIZER.blue1 }}
                >
                  52 days
                </div>
              </div>
              <div
                className="rounded-2xl p-4 border shadow-sm"
                style={{ borderColor: PFIZER.blue4, background: "white" }}
              >
                <div
                  className="text-xs uppercase tracking-wide"
                  style={{ color: PFIZER.blue2 }}
                >
                  Longest Attendance Streak
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: PFIZER.blue1 }}
                >
                  77 days
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-4 border shadow-sm"
              style={{ borderColor: PFIZER.blue4, background: "white" }}
            >
              <div
                className="text-xs uppercase tracking©-wide"
                style={{ color: PFIZER.blue2 }}
              >
                Total Playtime
              </div>
              <div
                className="text-2xl font-bold tabular-nums"
                style={{ color: PFIZER.blue1 }}
              >
                03:42:10
              </div>
            </div>

            <div>
              <h2
                className="text-lg font-bold mb-2"
                style={{ color: PFIZER.blue1 }}
              >
                Achievements
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AchievementCard
                  title="First Steps"
                  description="Completed your first mission!"
                  condition="Complete 1 mission"
                  icon="⭐"
                />
                <AchievementCard
                  title="Brave Reporter"
                  description="Honestly shared your feelings 10 times."
                  condition="Log mood 10 times"
                  icon="✨"
                />
              </div>
            </div>
          </div>
        </section>

        <aside
          className="rounded-2xl border shadow bg-white p-4 sm:p-6 flex flex-col"
          style={{ borderColor: PFIZER.blue4 }}
        >
          <div className="mb-3 sm:mb-4">
            <label
              className="text-xs uppercase tracking-wide"
              style={{ color: PFIZER.blue2 }}
            >
              Poko's Name
            </label>
            <input
              className="mt-1 w-full px-3 py-2 rounded-xl border outline-none focus:ring-2"
              style={{ borderColor: PFIZER.blue4 }}
              value={pokoName}
              readOnly
            />
          </div>
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
                Birthday
              </label>
              <input
                type="date"
                className="mt-1 w-full px-3 py-2 rounded-xl border outline-none focus:ring-2"
                style={{ borderColor: PFIZER.blue4 }}
                value={pokoBirthdayStr}
                readOnly
              />
            </div>
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
                readOnly
              />
            </div>
            <div
              className="rounded-2xl p-4 border"
              style={{ borderColor: PFIZER.blue5, background: PFIZER.blue8 }}
            >
              <div
                className="text-xs uppercase tracking-wide"
                style={{ color: PFIZER.blue2 }}
              >
                Age
              </div>
              <div
                className="text-xl font-semibold"
                style={{ color: PFIZER.blue1 }}
              >
                {pokoAge ? `${pokoAge.years}y ${pokoAge.months}m` : "—"}
              </div>
            </div>
          </div>
        </aside>
      </main>
      <footer className="py-4" />
    </div>
  );
}
