import { API_URL } from "../config";
import { useEffect, useState } from "react";

export default function History() {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          // Token invalid or expired
          localStorage.clear();
          window.location.reload();
          return;
        }

        const data = await res.json();
        setData(data);

      } catch (err) {
        console.error("History error:", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 
    p-4 sm:p-6 rounded-2xl shadow-xl mt-6">

      <h3 className="text-base sm:text-lg mb-4">
        History
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">

          <thead>
            <tr className="text-white/70">
              <th className="px-3 py-2 text-left">Carbon</th>
              <th className="px-3 py-2 text-left">Score</th>
              <th className="px-3 py-2 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan="3" className="px-3 py-4 text-white/60">
                  No history yet.
                </td>
              </tr>
            )}

            {data.map((item, i) => (
              <tr key={i} className="text-green-300 border-t border-white/10">
                <td className="px-3 py-2">{item.carbon}</td>
                <td className="px-3 py-2">{item.score}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {item.date}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}
