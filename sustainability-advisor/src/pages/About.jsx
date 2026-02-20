export default function About() {
  return (
    <div className="p-6 text-white md:ml-64">

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 
      p-8 rounded-2xl shadow-xl max-w-3xl mx-auto">

        <h1 className="text-2xl font-semibold mb-6">
          🌍 About Smart Sustainability Advisor
        </h1>

        <p className="text-white/80 mb-4 leading-relaxed">
          Hi, I am MrDnobody. Smart Sustainability Advisor is a data-driven platform designed to
          help individuals and organizations understand and improve their
          environmental impact.
        </p>

        <p className="text-white/80 mb-4 leading-relaxed">
          By analyzing electricity usage, water consumption, waste generation,
          transportation habits, and renewable energy adoption, our system
          provides personalized sustainability insights and AI-powered
          recommendations.
        </p>

        <p className="text-white/80 mb-4 leading-relaxed">
          Our mission is simple:
          <span className="text-green-400 font-medium">
            {" "}Make sustainability measurable, actionable, and accessible.
          </span>
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">

          <div className="bg-green-500/10 p-4 rounded-xl">
            <h3 className="font-semibold text-green-300">📊 Data Analysis</h3>
            <p className="text-sm text-white/70 mt-2">
              Real-time environmental scoring
            </p>
          </div>

          <div className="bg-green-500/10 p-4 rounded-xl">
            <h3 className="font-semibold text-green-300">🤖 AI Guidance</h3>
            <p className="text-sm text-white/70 mt-2">
              Smart sustainability insights
            </p>
          </div>

          <div className="bg-green-500/10 p-4 rounded-xl">
            <h3 className="font-semibold text-green-300">🌱 Impact Tracking</h3>
            <p className="text-sm text-white/70 mt-2">
              Continuous improvement monitoring
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}