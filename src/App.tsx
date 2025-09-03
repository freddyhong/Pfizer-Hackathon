import { useState } from "react";
import { Navbar } from "./components/Navbar";
import MainPage from "./pages/MainPage";
import CalendarPage from "./pages/CalendarPage";
import LearningPage from "./pages/LearningPage";
import ProfilePage from "./pages/ProfilePage";
import AchievementsPage from "./pages/AchievementsPage";
import DailyJournal from "./pages/JournalPage";
import CareTeamPage from "./pages/CareTeam";
import LoginPage from "./pages/LoginPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState("Main");

  const handleLogin = () => {
    setIsAuthenticated(true);
  };
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
      case "Learning":
        return <LearningPage />;
      case "Journal":
        return <DailyJournal />;
      case "CareTeam":
        return <CareTeamPage />;
      default:
        return <MainPage />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="relative min-h-screen">
      <Navbar activeItem={activePage} setActiveItem={setActivePage} />
      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
