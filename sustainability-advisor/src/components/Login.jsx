import { useState } from "react";
import bg from "../assets/login-bg.png";

export default function Login({ setUserId, goToRegister }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    alert(text || "Login failed");
    return;
  }

  const data = await res.json();

  const parsedCredits = parseInt(data.credits, 10);
  const safeCredits = isNaN(parsedCredits) ? 0 : parsedCredits;

  // 🔐 Store identity + token
  localStorage.setItem("userId", data.userId);
  localStorage.setItem("username", data.username);
  localStorage.setItem("credits", safeCredits);
  localStorage.setItem("token", data.token);  
  localStorage.setItem("role", data.role); 

  window.dispatchEvent(new Event("creditsUpdated"));

  setUserId(data.userId);
};

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white px-4">

      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      ></div>

      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-green-900/60 via-black/50 to-green-800/60"></div>

      <div className="flex flex-col items-center">

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-2 text-center">
          Smart Sustainability Advisor
        </h1>

        <p className="text-green-200 mb-8 text-sm text-center">
          Track. Improve. Sustain the future.
        </p>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 
        p-6 sm:p-8 rounded-2xl shadow-2xl 
        w-[92%] max-w-sm">

          <h2 className="text-lg sm:text-xl font-medium mb-5 text-center">
            Welcome Back
          </h2>

          <input
            required
            className="bg-white/20 border border-white/30 p-2.5 w-full mb-3 rounded-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            required
            type="password"
            className="bg-white/20 border border-white/30 p-2.5 w-full mb-4 rounded-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="bg-green-500 hover:bg-green-400 transition py-2.5 w-full rounded-lg font-medium text-black"
          >
            Login
          </button>

          <button
            onClick={goToRegister}
            className="text-green-300 hover:text-green-200 text-sm mt-4 w-full"
          >
            Create new account
          </button>

        </div>

      </div>
    </div>
  );
}
