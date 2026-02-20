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

  // 🔥 IMPORTANT PART STARTS HERE

  // If backend returns updated credits
  if (data.newCredits !== undefined) {
    localStorage.setItem("credits", data.newCredits);
  } else {
    // If backend does NOT return credits,
    // manually update localStorage
    const currentCredits = parseInt(localStorage.getItem("credits") || "0", 10);
    const updatedCredits = currentCredits + Number(amount);
    localStorage.setItem("credits", updatedCredits);
  }

  // 🔥 Notify entire app
  window.dispatchEvent(new Event("creditsUpdated"));

  alert("Credits added successfully!");
};
}