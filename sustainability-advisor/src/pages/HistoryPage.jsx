import History from "../components/History";

export default function HistoryPage() {

  return (
    <div className="p-4 sm:p-6 md:ml-64 pt-6 text-white">

      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6">
        History
      </h1>

      <History />

    </div>
  );
}
