import { useEffect, useState } from "react";

export default function Topbar({ setUserId, toggleSidebar, setPage }) {

  const [credits, setCredits] = useState(0);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const updateCredits = () => {
      const stored = localStorage.getItem("credits");
      setCredits(Number(stored) || 0);
    };

    updateCredits();
    window.addEventListener("creditsUpdated", updateCredits);

    return () => {
      window.removeEventListener("creditsUpdated", updateCredits);
    };
  }, []);

  const logout = () => {
    localStorage.clear();
    setUserId(null);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 
    backdrop-blur-xl bg-black/30 border-b border-white/10">

      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-white"
        >
          ☰
        </button>

        <h1 className="text-lg sm:text-xl font-semibold">
          Smart Sustainability Advisor
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        <button
          onClick={() => setPage("about")}
          className="text-white/70 hover:text-green-400 transition text-sm"
        >
          🌍 About
        </button>

        <div className="bg-green-500/20 text-green-300 
        px-3 py-1 rounded-full text-sm border border-green-400/20">
          💳 {credits} Credits
        </div>

        <div className="text-sm text-white/70 hidden sm:block">
          Hi, <span className="text-white">{username}</span>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-400 
          px-4 py-1.5 rounded-lg text-sm text-black font-medium"
        >
          Logout
        </button>

      </div>

    </div>
  );
}