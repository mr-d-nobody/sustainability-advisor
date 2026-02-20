import { useEffect, useState } from "react";

export default function Transactions() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://sustainability-advisor.onrender.com/transactions", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-semibold mb-4">
        💳 Credit History
      </h2>

      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-white/70">
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Amount</th>
            <th className="px-3 py-2">Description</th>
            <th className="px-3 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="border-t border-white/10">
              <td className="px-3 py-2">{item.type}</td>
              <td className="px-3 py-2">{item.amount}</td>
              <td className="px-3 py-2">{item.description}</td>
              <td className="px-3 py-2">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}