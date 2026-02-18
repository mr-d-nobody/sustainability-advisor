export default function Recommendation({ items }) {

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 
    p-4 sm:p-6 rounded-2xl shadow-xl w-full">

      <h3 className="text-sm sm:text-base text-white/70 mb-4">
        Recommendations
      </h3>

      <ul className="space-y-2">

        {items.map((item, index) => (
          <li 
            key={index} 
            className="text-green-300 text-sm leading-relaxed break-words"
          >
            🌱 {item}
          </li>
        ))}

      </ul>

    </div>
  );
}
