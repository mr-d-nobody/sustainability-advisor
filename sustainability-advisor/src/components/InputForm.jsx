import { useState } from "react";

export default function InputForm({ onAnalyze }) {

  const [electricity, setElectricity] = useState("");
  const [water, setWater] = useState("");
  const [waste, setWaste] = useState("");
  const [transport, setTransport] = useState("");
  const [renewable, setRenewable] = useState("");

  const handleSubmit = () => {
    if (!electricity || !water || !waste || !transport || !renewable) {
      alert("Please fill all fields");
      return;
    }

    onAnalyze({
      electricity: Number(electricity),
      water: Number(water),
      waste: Number(waste),
      transport: Number(transport),
      renewable: Number(renewable),
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 
    p-5 sm:p-8 rounded-2xl shadow-2xl 
    w-[92%] max-w-md text-white">

      <h2 className="text-lg sm:text-xl font-medium mb-5">
        Enter Sustainability Data
      </h2>

      <input
        type="number"
        min="0"
        className="bg-white/20 border border-white/30 p-2.5 w-full mb-3 rounded-lg placeholder-white/60 focus:ring-2 focus:ring-green-400 outline-none text-sm"
        placeholder="Electricity (kWh)"
        onChange={(e)=>setElectricity(e.target.value)}
      />

      <input
        type="number"
        min="0"
        className="bg-white/20 border border-white/30 p-2.5 w-full mb-3 rounded-lg placeholder-white/60 focus:ring-2 focus:ring-green-400 outline-none text-sm"
        placeholder="Water (Liters)"
        onChange={(e)=>setWater(e.target.value)}
      />

      <input
        type="number"
        min="0"
        className="bg-white/20 border border-white/30 p-2.5 w-full mb-3 rounded-lg placeholder-white/60 focus:ring-2 focus:ring-green-400 outline-none text-sm"
        placeholder="Waste (kg)"
        onChange={(e)=>setWaste(e.target.value)}
      />

      <input
        type="number"
        min="0"
        className="bg-white/20 border border-white/30 p-2.5 w-full mb-3 rounded-lg placeholder-white/60 focus:ring-2 focus:ring-green-400 outline-none text-sm"
        placeholder="Transport (km)"
        onChange={(e)=>setTransport(e.target.value)}
      />

      <input
        type="number"
        min="0"
        className="bg-white/20 border border-white/30 p-2.5 w-full mb-4 rounded-lg placeholder-white/60 focus:ring-2 focus:ring-green-400 outline-none text-sm"
        placeholder="Renewable Energy (%)"
        onChange={(e)=>setRenewable(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-green-500 hover:bg-green-400 transition 
        py-2.5 w-full rounded-lg font-medium text-black"
      >
        Analyze
      </button>

    </div>
  );
}
