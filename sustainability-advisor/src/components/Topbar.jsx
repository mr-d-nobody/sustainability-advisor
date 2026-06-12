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
    <div className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 
    backdrop-blur-2xl bg-black/40 border-b border-white/10 shadow-lg shadow-black/20">

      {/* Left side: Hamburger + Logo */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button 
          onClick={() => setPage("dashboard")}
          className="flex items-center gap-2 group focus:outline-none text-left"
        >
          <span className="text-xl sm:text-2xl transform group-hover:scale-110 transition-transform duration-300">🌱</span>
          <h1 className="text-base sm:text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200 group-hover:to-green-400 transition-colors duration-300 truncate max-w-[120px] sm:max-w-none">
            Smart Sustainability
            <span className="hidden lg:inline"> Advisor</span>
          </h1>
        </button>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-2 sm:gap-6">

        <button
          onClick={() => setPage("about")}
          className="hidden sm:flex items-center gap-1.5 text-white/70 hover:text-green-400 transition-colors text-sm font-medium"
        >
          <span>🌍</span>
          <span>About</span>
        </button>

        <div className="flex items-center bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-green-300 
        px-3 py-1.5 rounded-full text-xs sm:text-sm border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
          <span className="mr-1 sm:mr-1.5">💳</span>
          <span className="font-bold">{credits}</span>
          <span className="ml-1 hidden sm:inline">Credits</span>
        </div>

        <div className="hidden md:block w-px h-6 bg-white/10 mx-1"></div>

        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-white/50">Welcome back</span>
          <span className="text-sm text-white font-medium truncate max-w-[100px] leading-tight">{username}</span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 bg-white/5 hover:bg-red-500/20 text-white/90 hover:text-red-400 
          px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 border border-white/10 hover:border-red-500/30"
        >
          <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>

      </div>

    </div>
  );
}