// src/App.tsx
import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { DailyTasks } from "../components/DailyTasks";
import characterImage from "../assets/character.png";
import { Chatbot } from "../components/Chatbot";

function MainPage() {
  const childName = "Zach";
  const [isTasksVisible, setIsTasksVisible] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

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
