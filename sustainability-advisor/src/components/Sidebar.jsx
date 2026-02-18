export default function Sidebar({ setPage, isOpen }) {

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

      <h1 className="text-lg sm:text-xl font-semibold mb-8">
        🌱 Sustainability
      </h1>

      <nav className="space-y-4 text-sm">

        <p
          onClick={() => setPage("dashboard")}
          className="cursor-pointer hover:text-green-400 transition"
        >
          Dashboard
        </p>

        <p
          onClick={() => setPage("history")}
          className="cursor-pointer hover:text-green-400 transition"
        >
          History
        </p>

        <p
          onClick={() => setPage("settings")}
          className="cursor-pointer hover:text-green-400 transition"
        >
          Settings
        </p>

      </nav>

    </div>
  );
}
