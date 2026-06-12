import { API_URL } from "../config";
import { useState } from "react";

export default function Settings() {

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async () => {

    const res = await fetch(`${API_URL}/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Something went wrong");
      return;
    }

    setMessage("Password changed successfully ✅");
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div className="max-w-md mx-auto bg-white/10 backdrop-blur-xl 
    border border-white/20 p-6 rounded-2xl shadow-xl mt-6 text-white">

      <h2 className="text-lg font-semibold mb-4">Change Password</h2>

      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full mb-3 p-2 rounded bg-white/20 border border-white/30"
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full mb-4 p-2 rounded bg-white/20 border border-white/30"
      />

      <button
        onClick={handleChangePassword}
        className="bg-green-500 hover:bg-green-400 w-full py-2 rounded text-black font-medium"
      >
        Update Password
      </button>

      {message && (
        <p className="mt-4 text-sm text-green-300">{message}</p>
      )}

    </div>
  );
}