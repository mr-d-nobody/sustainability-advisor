export default function ScoreCard({ score }) {

  const getColor = () => {
    if (score >= 75) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 
    p-4 sm:p-6 rounded-2xl shadow-xl w-full">

      <h3 className="text-sm sm:text-base text-white/70 mb-3">
        Sustainability Score
      </h3>

      <p className={`text-2xl sm:text-3xl md:text-4xl font-semibold ${getColor()}`}>
        {score} / 100
      </p>

    </div>
  );
}
