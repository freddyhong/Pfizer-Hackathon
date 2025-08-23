// src/components/Navbar.tsx
import React, { useState } from "react";
import LogoPng from "../assets/logo.png";

// Reusable NavItem component (mostly styling changes)
interface NavItemProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  label,
  isActive,
  onClick,
  children,
}) => {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`
        relative flex items-center w-full p-4 rounded-lg
        transition-all duration-300
        ${
          isActive
            ? "bg-blue-100 text-blue-600"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        }
      `}
    >
      {}
      {children}
      {}
      <span className="ml-4 font-semibold">{label}</span>
      {}
      {isActive && (
        <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-600 rounded-r-full" />
      )}
    </a>
  );
};

// The main Navbar component, now styled as a sidebar
export function Navbar({
  activeItem,
  setActiveItem,
}: {
  activeItem: string;
  setActiveItem: (item: string) => void;
}) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white/90 backdrop-blur-md shadow-lg z-50 flex flex-col p-4">
      <div className="text-3xl font-bold text-blue-600 mb-10 text-center pt-4 flex flex-row justify-center items-center">
        <img src={LogoPng} alt="" className="w-16 h-14 mr-3" />
        <span>Poko</span>
      </div>

      <nav className="flex flex-col space-y-3">
        <NavItem
          href="/"
          label="Main"
          isActive={activeItem === "Main"}
          onClick={() => setActiveItem("Main")}
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </NavItem>

        <NavItem
          href="/achievements"
          label="Achievements"
          isActive={activeItem === "Achievements"}
          onClick={() => setActiveItem("Achievements")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
            />
          </svg>
        </NavItem>

        <NavItem
          href="/calendar"
          label="Calendar"
          isActive={activeItem === "Calendar"}
          onClick={() => setActiveItem("Calendar")}
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </NavItem>

        <NavItem
          href="/learning"
          label="Learning"
          isActive={activeItem === "Learning"}
          onClick={() => setActiveItem("Learning")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20"
            />
          </svg>
        </NavItem>

        <NavItem
          href="/profile"
          label="Profile"
          isActive={activeItem === "Profile"}
          onClick={() => setActiveItem("Profile")}
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </NavItem>
      </nav>
    </aside>
  );
}
