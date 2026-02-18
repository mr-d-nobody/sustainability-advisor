export default function ResultCard({ carbon }) {

  const getColor = () => {
    if (carbon < 50) return "text-green-400";
    if (carbon < 150) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 
    p-4 sm:p-6 rounded-2xl shadow-xl w-full">

      <h3 className="text-sm sm:text-base text-white/70 mb-3">
        Carbon Footprint
      </h3>

      <p className={`text-2xl sm:text-3xl md:text-4xl font-semibold ${getColor()}`}>
        {carbon} kg CO₂
      </p>

    </div>
  );
}
