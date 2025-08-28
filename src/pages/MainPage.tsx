// src/App.tsx
import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { DailyTasks } from "../components/DailyTasks";
import characterImage from "../assets/character.png";
import { Chatbot } from "../components/Chatbot";

const moods = [
  {
    name: "Sad",
    icon: "😔",
    color: "#60A5FA",
    indicatorPos: { cx: 44.8, cy: 85 },
    emojiPos: { top: "60%", left: "16%" },
  },
  {
    name: "Okay",
    icon: "😐",
    color: "#FBBF24",
    indicatorPos: { cx: 140, cy: 30 },
    emojiPos: { top: "21%", left: "50%" },
  },
  {
    name: "Happy",
    icon: "😊",
    color: "#34D399",
    indicatorPos: { cx: 235.2, cy: 85 },
    emojiPos: { top: "60%", left: "84%" },
  },
];

interface FeelingStatusBarProps {
  currentMood: string;
  onSetMood: (mood: string) => void;
}

export function FeelingStatusBar({
  currentMood,
  onSetMood,
}: FeelingStatusBarProps) {
  const activeMood = moods.find((m) => m.name === currentMood) || moods[2];

  return (
    <div
      className="w-full max-w-md relative"
      style={{ aspectRatio: "280 / 140" }}
    >
      {/* The SVG Arc and Indicator */}
      <svg viewBox="0 0 280 140" className="absolute inset-0">
        <defs>
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>

        <path
          d="M 37 102 A 110 110 0 0 1 243 102"
          stroke="url(#arcGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />

        <g
          style={{ transition: "transform 0.4s ease-in-out" }}
          transform={`translate(${activeMood.indicatorPos.cx}, ${activeMood.indicatorPos.cy})`}
        >
          <circle
            cx="0"
            cy="0"
            r="8"
            fill="white"
            stroke={activeMood.color}
            strokeWidth="3"
          />
        </g>
      </svg>

      {moods.map((mood) => (
        <button
          key={mood.name}
          onClick={() => onSetMood(mood.name)}
          className="text-2xl transition-all duration-300 absolute"
          style={{
            top: mood.emojiPos.top,
            left: mood.emojiPos.left,
            transform: `translate(-50%, -50%) ${
              currentMood === mood.name ? "scale(1.15)" : "scale(1)"
            }`,
            opacity: currentMood === mood.name ? 1 : 0.6,
          }}
          aria-label={`Set mood to ${mood.name}`}
        >
          {mood.icon}
        </button>
      ))}
    </div>
  );
}

const TopStatusBar = () => (
  <div className="w-full max-w-sm text-center">
    <div className="bg-[#3857a6bd] backdrop-blur-sm rounded-full px-6 py-2">
      <p className="font-bold text-[#EBF5FC] text-shadow text-lg">
        111 Days with Poko
      </p>
    </div>
  </div>
);

const GreetingBox = ({
  childName,
  mood,
}: {
  childName: string;
  mood: string;
}) => (
  <div className="w-full max-w-sm text-center mt-4">
    <div className="bg-white/80 backdrop-blur-md rounded-2xl px-6 py-4 shadow-lg">
      <p className="font-semibold text-gray-800 text-xl">
        Hi {childName}! I'm feeling {mood.toLowerCase()} today!
      </p>
    </div>
  </div>
);

function MainPage() {
  const childName = "Zach";
  const [isTasksVisible, setIsTasksVisible] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [currentMood, setCurrentMood] = useState("Happy");

  return (
    <main className="ml-64 min-h-screen bg-gradient-to-b from-blue-300 to-blue-100 p-8 font-sans relative flex flex-col">
      <div className="absolute top-8 left-8 z-10">
        <button
          onClick={() => setIsTasksVisible(!isTasksVisible)}
          className="w-16 h-16 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-blue-500 hover:bg-white hover:scale-110 transition-all duration-300"
          aria-label="Toggle daily tasks"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </button>

        <div
          className={`
            absolute top-24 left-0
            transition-all duration-300 ease-in-out w-72
            ${
              isTasksVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }
          `}
        >
          <DailyTasks />
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white text-shadow">
            Hi {childName}!
          </h1>
          <p className="text-xl text-white/90 text-shadow mt-2">
            Poko is happy to see you.
          </p>
        </header>
        <TopStatusBar />
        <FeelingStatusBar
          currentMood={currentMood}
          onSetMood={setCurrentMood}
        />
        <div className="group cursor-pointer text-center">
          <img
            src={characterImage}
            alt="Poko the Companion"
            className="w-64 h-64 md:w-80 md:h-80 object-contain transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:-translate-y-4"
          />
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-10">
        <button
          onClick={() => setIsChatbotVisible(true)}
          className="w-16 h-16 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 hover:scale-110 transition-all duration-300"
          aria-label="Open chatbot"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>

      {isChatbotVisible && (
        <Chatbot onClose={() => setIsChatbotVisible(false)} />
      )}
    </main>
  );
}

export default MainPage;
