import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

import InputForm from "../components/InputForm";
import ResultCard from "../components/ResultCard";
import ScoreCard from "../components/ScoreCard";
import Recommendation from "../components/Recommendation";
import Charts from "../components/Charts";

const API_URL = import.meta.env.VITE_API_URL || "https://sustainability-advisor.onrender.com";

export default function Dashboard({ analyze, result }) {

  const [aiAdvice, setAiAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (!result) return;

    const fetchAdvice = async () => {

      try {
        setLoading(true);
        setAiAdvice("");

        const res = await fetch(`${API_URL}/ai-advice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result),
        });

        if (!res.ok) {
          throw new Error("AI request failed");
        }

        const data = await res.json();
        setAiAdvice(data.advice || "No advice generated.");

      } catch (err) {
        setAiAdvice("⚠️ AI service unavailable.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();

  }, [result]);

  return (
    <div className="p-4 sm:p-6 md:ml-64 pt-6">

      <InputForm onAnalyze={analyze} />

      {result && (
        <>

          {/* Result + Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <ResultCard carbon={result.carbon} />
            <ScoreCard score={result.score} />
          </div>

          {/* Charts */}
          <div className="mt-6">
            <Charts data={result} />
          </div>

          {/* Rule-based Recommendations */}
          <div className="mt-6">
            <Recommendation items={result.rec} />
          </div>

          {/* AI Advice */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 
          p-5 sm:p-6 rounded-2xl shadow-xl mt-6">

            <h3 className="text-lg font-semibold mb-4">
              🤖 AI Sustainability Advisor
            </h3>

            {loading && (
              <p className="text-green-300 animate-pulse">
                Generating intelligent recommendations...
              </p>
            )}

            {aiAdvice && !loading && (
              <div className="prose prose-invert max-w-none text-green-200">
                <ReactMarkdown>{aiAdvice}</ReactMarkdown>
              </div>
            )}

          </div>

        </>
      )}

    </div>
  );
}