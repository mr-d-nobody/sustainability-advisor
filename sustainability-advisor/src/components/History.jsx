import { useEffect, useState } from "react";

export default function History({ userId }) {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`https://sustainability-advisor.onrender.com/history/${userId}`)
      .then(res => res.json())
      .then(setData);
  }, [userId]);

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
