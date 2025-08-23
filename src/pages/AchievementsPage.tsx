import React from "react";
import { RewardCard } from "../components/RewardCard";

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

const badges = [
  {
    id: 1,
    icon: "⭐",
    title: "First Steps",
    description: "Completed your first mission!",
    requirement: "Complete 1 mission",
    isUnlocked: true,
  },
  {
    id: 2,
    icon: "❤️",
    title: "Three Days Strong",
    description: "Completed missions 3 days in a row!",
    requirement: "3-day streak",
    isUnlocked: false,
  },
  {
    id: 3,
    icon: "🏆",
    title: "Week Warrior",
    description: "Completed missions for a whole week!",
    requirement: "7-day streak",
    isUnlocked: false,
  },
  {
    id: 4,
    icon: "✨",
    title: "Brave Reporter",
    description: "Honestly shared your feelings 10 times.",
    requirement: "Log mood 10 times",
    isUnlocked: true,
  },
];

const outfits = [
  {
    id: 1,
    icon: "🎩",
    title: "Party Hat",
    description: "A fun party hat for celebrations!",
    requirement: "Reach level 3",
    isUnlocked: true,
  },
  {
    id: 2,
    icon: "🦸",
    title: "Superhero Cape",
    description: "A cape for the bravest of heroes!",
    requirement: "Complete 20 missions",
    isUnlocked: false,
  },
  {
    id: 3,
    icon: "🌈",
    title: "Rainbow Wings",
    description: "Beautiful rainbow wings to soar high!",
    requirement: "Complete missions for 2 weeks",
    isUnlocked: false,
  },
  {
    id: 4,
    icon: "👑",
    title: "Golden Crown",
    description: "A crown fit for a champion!",
    requirement: "Reach level 10",
    isUnlocked: false,
  },
];

export default function AchievementsPage() {
  const unlockedCount =
    badges.filter((b) => b.isUnlocked).length +
    outfits.filter((o) => o.isUnlocked).length;
  const totalCount = badges.length + outfits.length;

  return (
    <div
      className="ml-64 min-h-screen p-8"
      style={{ backgroundColor: PFIZER.blue8 }}
    >
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold" style={{ color: PFIZER.blue2 }}>
          🏆 Your Rewards
        </h1>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: PFIZER.blue3 }}
          >
            🏅 Badges Earned
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badge) => (
              <RewardCard key={badge.id} {...badge} />
            ))}
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: PFIZER.blue3 }}
          >
            ✨ Companion Outfits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {outfits.map((outfit) => (
              <RewardCard key={outfit.id} {...outfit} />
            ))}
          </div>
        </section>
      </div>

      <footer className="max-w-3xl mx-auto mt-12">
        <div
          className="p-4 rounded-2xl text-center font-semibold"
          style={{ backgroundColor: PFIZER.blue7, color: PFIZER.blue2 }}
        >
          <p>🎁 Keep completing missions to unlock more rewards!</p>
          <p className="text-sm mt-1">
            {unlockedCount} / {totalCount} rewards unlocked
          </p>
        </div>
      </footer>
    </div>
  );
}
