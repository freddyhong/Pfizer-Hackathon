import React, { useState } from "react";
import LogoPng from "../assets/logo.png"; // Make sure this path is correct

const PFIZER = {
  blue2: "#272C77",
  blue4: "#3857A6",
  blue5: "#488CCA",
  blue8: "#EBF5FC",
};

interface LoginPageProps {
  onLogin: () => void; // A function to call when login is successful
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Logging in with:", { username, password });
    onLogin();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: PFIZER.blue8 }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <img
            src={LogoPng}
            alt="Poko Logo"
            className="w-20 h-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold" style={{ color: PFIZER.blue2 }}>
            Welcome to Poko
          </h1>
          <p className="text-gray-500">Never Alone in the Journey.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700 block mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: "#D1D5DB" }}
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 block mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: "#D1D5DB" }}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <a
              href="#"
              className="font-medium hover:underline"
              style={{ color: PFIZER.blue5 }}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-bold text-lg transition-transform hover:scale-105"
            style={{ backgroundColor: PFIZER.blue5 }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
