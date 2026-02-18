export default function Settings({ setUserId }) {

  return (
    <div className="p-4 sm:p-6 md:ml-64 pt-6 text-white">

      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6">
        Settings
      </h1>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 
      p-4 sm:p-6 rounded-2xl shadow-xl max-w-md">

        <h2 className="text-sm sm:text-base text-white/70 mb-4">
          Account
        </h2>

        <button
          onClick={() => setUserId(null)}
          className="bg-red-500 hover:bg-red-400 transition 
          px-4 py-2.5 rounded-lg text-black text-sm w-full sm:w-auto"
        >
          Logout
        </button>

      </div>

    </div>
  );
}
