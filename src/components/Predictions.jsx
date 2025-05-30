import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const Predictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPredictions() {
      try {
        const res = await fetch(
          "/api/tennis/predictions"
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setPredictions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPredictions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-white">
        <span>Loading predictions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20 text-red-500">
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <section id="predictions" className="py-16 bg-bgDark2 text-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center">Upcoming Predictions</h2>
        <div className="flex flex-col space-y-6">
          {predictions.map(({ id, player1, player2, prob1, prob2 }) => (
            <FightCard
              key={id}
              playerA={player1}
              playerB={player2}
              probA={prob1}
              probB={prob2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FightCard({ playerA, playerB, probA, probB }) {
  return (
    <motion.div
      className="bg-bgDark1 p-6 rounded-2xl shadow-lg flex items-center justify-between"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-1">{playerA}</h3>
        <span className="text-3xl font-bold text-blue-500">{(probA * 100).toFixed(2)}%</span>
      </div>
      <span className="mx-4 text-4xl font-extrabold text-gray-400">VS</span>
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-1">{playerB}</h3>
        <span className="text-3xl font-bold text-blue-500">{(probB * 100).toFixed(2)}%</span>
      </div>
    </motion.div>
  );
}
