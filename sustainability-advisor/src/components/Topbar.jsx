export default function Topbar({ setUserId, toggleSidebar }) {

  return (
    <div className="h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 
    flex items-center justify-between 
    px-4 sm:px-8 text-white">

      <div className="flex items-center gap-4">

        {/* Mobile Sidebar Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden bg-green-500 px-3 py-2 rounded-lg text-black"
        >
          ☰
        </button>

        <h2 className="font-medium text-base sm:text-lg">
          Dashboard
        </h2>

      </div>

      <button
        onClick={() => setUserId(null)}
        className="bg-red-500 hover:bg-red-400 transition 
        px-4 py-2 rounded-lg text-black text-sm"
      >
        Logout
      </button>

    </div>
  );
}
