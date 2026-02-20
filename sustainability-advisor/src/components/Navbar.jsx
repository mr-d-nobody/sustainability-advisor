import { useEffect, useState } from "react";

export default function Navbar() {

  const [credits, setCredits] = useState(0);

  useEffect(() => {
  const loadCredits = () => {
    const storedCredits = localStorage.getItem("credits");
    setCredits(storedCredits ? parseInt(storedCredits, 10) : 0);
  };

  loadCredits();

  window.addEventListener("creditsUpdated", loadCredits);

  return () => {
    window.removeEventListener("creditsUpdated", loadCredits);
  };
}, []);

  return (
    <div className="fixed top-0 w-full z-50">

      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">

          <h1 className="text-white text-base sm:text-xl font-semibold tracking-tight">
            🌱 Smart Sustainability Advisor
          </h1>

          <span className="text-green-300 text-sm">
            💳 Credits: {credits}
          </span>

        </div>

      </div>

    </div>
  );
}