import { useState } from "react";

import bg from "./assets/background.png";

import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import Settings from "./pages/Settings";

import Login from "./components/Login";
import Register from "./components/Register";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function App() {

  const [result, setResult] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [userId, setUserId] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const analyze = async (data) => {

    if (!userId) return;

    const carbon =
      data.electricity * 0.82 +
      data.transport * 0.12 +
      data.waste * 0.5;

    let score = 100;

    score -= data.electricity * 0.08;
    score -= data.water * 0.04;
    score -= data.waste * 1.2;
    score -= data.transport * 0.06;
    score += data.renewable * 0.15;

    score = Math.max(0, Math.min(100, score));

    let rec = [];

    if (data.electricity > 300) rec.push("Switch to LED bulbs");
    if (data.water > 150) rec.push("Reduce water usage");
    if (data.transport > 100) rec.push("Use public transport");
    if (data.renewable < 30) rec.push("Install solar panels");
    if (data.waste > 15) rec.push("Recycle waste");

    if (rec.length === 0)
      rec.push("Excellent sustainability");

    await fetch("http://localhost:5000/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        ...data,
        carbon,
        score,
      }),
    });

    setResult({
      carbon: carbon.toFixed(2),
      score: score.toFixed(0),
      rec,
      ...data,
    });
  };

  /* AUTH FLOW */

  if (!userId && !showRegister)
    return (
      <Login
        setUserId={setUserId}
        goToRegister={() => setShowRegister(true)}
      />
    );

  if (!userId && showRegister)
    return (
      <Register
        goToLogin={() => setShowRegister(false)}
      />
    );

  /* DASHBOARD */

  return (
    <div className="relative min-h-screen text-white">

      {/* Background */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-green-900/60 via-black/60 to-green-800/60" />

      {/* Sidebar */}
      <Sidebar
        setPage={(p) => {
          setPage(p);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="md:ml-64">

        <Topbar
          setUserId={setUserId}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="p-4 sm:p-6">

          {page === "dashboard" && (
            <Dashboard analyze={analyze} result={result} />
          )}

          {page === "history" && (
            <HistoryPage userId={userId} />
          )}

          {page === "settings" && (
            <Settings setUserId={setUserId} />
          )}

        </div>

      </div>

    </div>
  );
}
