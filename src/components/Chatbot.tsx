import React from "react";

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

interface ChatbotProps {
  onClose: () => void;
}

export function Chatbot({ onClose }: ChatbotProps) {
  return (
    <div
      className="fixed bottom-28 right-8 z-20 w-full max-w-sm rounded-2xl shadow-xl flex flex-col"
      style={{
        backgroundColor: PFIZER.blue8,
        height: "70vh",
        maxHeight: "600px",
      }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between p-4 rounded-t-2xl"
        style={{ backgroundColor: PFIZER.blue3, color: "white" }}
      >
        <h2 className="text-lg font-bold">Chat with your Companion</h2>
        <button
          onClick={onClose}
          className="text-white hover:opacity-75"
          aria-label="Close chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </header>

      {/* Message Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Bot Message */}
        <div className="flex justify-start">
          <div
            className="p-3 rounded-lg max-w-xs"
            style={{ backgroundColor: "white", color: PFIZER.blue1 }}
          >
            <p className="text-sm">
              Hi! I'm here to help. You can ask me about your treatment,
              feelings, or just chat!
            </p>
          </div>
        </div>
        {/* User Message */}
        <div className="flex justify-end">
          <div
            className="p-3 rounded-lg max-w-xs"
            style={{ backgroundColor: PFIZER.blue6, color: "white" }}
          >
            <p className="text-sm">What is a mission?</p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t" style={{ borderColor: PFIZER.blue6 }}>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-full border border-[pfizer-blue-6] ring-[pfizer-blue-3] focus:outline-none focus:ring-2"
          />
          <button
            className="p-3 rounded-full text-white transition-transform hover:scale-110"
            style={{ backgroundColor: PFIZER.blue3 }}
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
