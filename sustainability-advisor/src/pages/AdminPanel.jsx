import { useState } from "react";

export default function AdminPanel() {

  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");

 const handleRecharge = async () => {
  const res = await fetch("https://sustainability-advisor.onrender.com/admin/recharge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      username,
      amount: Number(amount),
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Recharge failed");
    return;
  }

  alert("Credits added successfully!");
};

  return (
    <div className="p-6 md:ml-64 text-white">
      <h1 className="text-2xl font-semibold mb-6">
        👑 Admin Panel
      </h1>

      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10 w-full max-w-md">

        <input
          placeholder="Username"
          className="w-full mb-4 p-2 rounded text-black"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="number"
          placeholder="Credits to add"
          className="w-full mb-4 p-2 rounded text-black"
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={handleRecharge}
          className="bg-yellow-500 hover:bg-yellow-400 transition px-4 py-2 rounded font-semibold text-black w-full"
        >
          Add Credits
        </button>

      </div>
    </div>
  );
}