import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import MainPage from "./pages/MainPage";
import CalendarPage from "./pages/CalendarPage";
import ProfilePage from "./pages/ProfilePage";
import AchievementsPage from "./pages/AchievementsPage";

function App() {
  const [activePage, setActivePage] = useState("Main");

  const renderPage = () => {
    switch (activePage) {
      case "Main":
        return <MainPage />;
      case "Calendar":
        return <CalendarPage />;
      case "Profile":
        return <ProfilePage />;
      case "Achievements":
        return <AchievementsPage />;
      default:
        return <MainPage />;
    }
  };

  return (
    <div className="relative min-h-screen">
      <Navbar activeItem={activePage} setActiveItem={setActivePage} />
      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
