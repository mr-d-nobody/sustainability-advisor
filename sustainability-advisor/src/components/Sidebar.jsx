import { useEffect, useState } from "react";

export default function Sidebar({ setPage, isOpen }) {

  const [credits, setCredits] = useState(0);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const [showAccount, setShowAccount] = useState(false);

  useEffect(() => {

    const loadData = () => {
      const storedCredits = localStorage.getItem("credits");
      const storedUserId = localStorage.getItem("userId");
      const storedUsername = localStorage.getItem("username");
      const storedRole = localStorage.getItem("role");

      const parsedCredits = parseInt(storedCredits, 10);

      setCredits(isNaN(parsedCredits) ? 0 : parsedCredits);
      setUserId(storedUserId || null);
      setUsername(storedUsername || null);
      setRole(storedRole || null);
    };

    loadData();
    window.addEventListener("creditsUpdated", loadData);

    return () => {
      window.removeEventListener("creditsUpdated", loadData);
    };

  }, []);

  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : "??";

  return (
    <div
      className={`
      fixed top-0 left-0 h-screen w-64 
      bg-black/40 backdrop-blur-xl border-r border-white/10 text-white 
      p-6 z-40
      transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0
      `}
    >

      <h1 className="text-lg sm:text-xl font-semibold mb-6">
        🌱 Sustainability
      </h1>

      {/* User Badge */}
      <div
        onClick={() => setShowAccount(!showAccount)}
        className="mb-4 flex items-center gap-3 cursor-pointer 
        hover:bg-white/10 p-2 rounded-xl transition"
      >
        <div className="w-9 h-9 rounded-full bg-green-500 
        flex items-center justify-center font-semibold text-black">
          {initials}
        </div>

        <div>
          <p className="text-sm font-medium">
            {username || "User"}
            {role === "admin" && (
              <span className="ml-2 text-xs text-yellow-400">
                👑
              </span>
            )}
          </p>
          <p className="text-xs text-white/60">
            Click for details
          </p>
        </div>
      </div>

      {/* Expandable Account Info */}
      {showAccount && (
        <div className="mb-6 bg-white/10 border border-white/10 
        rounded-xl px-4 py-3 text-sm text-green-300 space-y-2">
          <p>🆔 User ID: {userId}</p>
          <p>👤 Username: {username}</p>
          <p>💳 Credits: {credits}</p>
          <p>🔐 Role: {role}</p>
        </div>
      )}

      <nav className="space-y-4 text-sm">

        <p
          onClick={() => setPage("dashboard")}
          className="cursor-pointer hover:text-green-400 transition"
        >
          🏠Dashboard
        </p>

        <p
          onClick={() => setPage("history")}
          className="cursor-pointer hover:text-green-400 transition"
        >
          📊History
        </p>

        <p
          onClick={() => setPage("recharge")}
          className="cursor-pointer hover:text-green-400 transition"
        >
          💳Recharge Credits
        </p>

        {/* 👑 Admin Panel Only For Admin */}
        {role === "admin" && (
          <p
            onClick={() => setPage("admin")}
            className="cursor-pointer hover:text-yellow-400 transition"
          >
            👑 Admin Panel
          </p>
        )}
        <p
          onClick={() => setPage("transactions")}
          className="cursor-pointer hover:text-green-400 transition"
        >
          🧾Transactions
        </p>

        <p
          onClick={() => setPage("settings")}
          className="cursor-pointer hover:text-green-400 transition"
        >
          ⚙️Settings
        </p>

      </nav>

    </div>
  );
}