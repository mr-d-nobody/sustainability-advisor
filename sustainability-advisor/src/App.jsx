import { useState, useEffect } from "react";

import bg from "./assets/background.png";
import Recharge from "./pages/Recharge";
import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminPanel from "./pages/AdminPanel";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Transactions from "./pages/Transactions";
export default function App() {

  const [result, setResult] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [userId, setUserId] = useState(
    localStorage.getItem("userId")
  );
  const [showRegister, setShowRegister] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔥 Auto-redirect to Recharge page when credits are 0
  useEffect(() => {
    const redirectToRecharge = () => {
      setPage("recharge");
    };

    window.addEventListener("goToRecharge", redirectToRecharge);

    return () => {
      window.removeEventListener("goToRecharge", redirectToRecharge);
    };
  }, []);
  useEffect(() => {
  const syncCreditsFromBackend = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("https://sustainability-advisor.onrender.com/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return;

    const data = await res.json();

    localStorage.setItem("credits", data.credits);
    window.dispatchEvent(new Event("creditsUpdated"));
  };

  syncCreditsFromBackend();
}, []);

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

    await fetch("https://sustainability-advisor.onrender.com/save", {
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
  <div className="relative min-h-screen text-white overflow-hidden">

    {/* Background */}
    <div
      className="fixed inset-0 -z-20 bg-cover bg-center scale-105"
      style={{ backgroundImage: `url(${bg})` }}
    />
    <div className="fixed inset-0 -z-10 bg-gradient-to-br 
      from-green-950/70 via-black/70 to-green-900/70 backdrop-blur-sm" />

    {/* Sidebar */}
    <Sidebar
      setPage={(p) => {
        setPage(p);
        setSidebarOpen(false);
      }}
      isOpen={sidebarOpen}
    />

    {/* Mobile Overlay */}
    {sidebarOpen && (
      <div
        className="fixed inset-0 bg-black/60 md:hidden z-30 backdrop-blur-sm"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    {/* Main */}
    <div className="md:ml-64 flex flex-col min-h-screen">

      <Topbar
        setUserId={(id) => {
          localStorage.clear();
          setUserId(id);
        }}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        setPage={setPage}
      />

      {/* Page Content Container */}
      <main className="flex-1 p-6 sm:p-8 transition-all duration-300">

        <div className="max-w-6xl mx-auto">

          {/* Animated Page Switch */}
          <div className="animate-fadeIn">

            {page === "transactions" && <Transactions />}
            {page === "dashboard" && (
              <Dashboard analyze={analyze} result={result} />
            )}
            {page === "about" && <About />}
            {page === "history" && <HistoryPage />}
            {page === "settings" && <Settings setUserId={setUserId} />}
            {page === "recharge" && <Recharge />}
            {page === "admin" && <AdminPanel />}

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-white/40 py-4 border-t border-white/10">
        © {new Date().getFullYear()} Smart Sustainability Advisor · Built with 🌱
      </footer>

    </div>
  </div>
);
}