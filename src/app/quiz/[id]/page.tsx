"use client";

import { useState, useEffect } from "react";
import { cards, questions } from "@/data/data";
import { useRouter } from "next/navigation";
import { ScoreEntry } from "@/types";
import LeaderboardSidebar from "@/components/LeaderboardSidebar";
import CardGrid from "@/components/CardGrid";
import QuestionBox from "@/components/QuestionBox";
import ScoreBoard from "@/components/ScoreBoard";

export default function Home() {
  const [showCards, setShowCards] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const leaderboard: ScoreEntry[] = [
    { username: "Alya", score: 3, time: "20s" },
    { username: "Budi", score: 2, time: "25s" },
    { username: "Cici", score: 1, time: "30s" },
  ];

  const handleCardSelect = (id: number) => {
    const correctId = questions[currentQuestion].correctId;
    if (id === correctId) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setShowCards(true);
    } else {
      alert("Game selesai!");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Memory Game Produk</h1>

      {showCards ? (
        <>
          <CardGrid cards={cards} onSelect={() => {}} isHidden={false} />
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white"
            onClick={() => setShowCards(false)}>
            Tutup Kartu (Admin)
          </button>
        </>
      ) : (
        <>
          <QuestionBox question={questions[currentQuestion]} />
          <CardGrid cards={cards} onSelect={handleCardSelect} isHidden={true} />
        </>
      )}

      <ScoreBoard score={score} />

      {/* Sidebar leaderboard */}
      <LeaderboardSidebar scores={leaderboard} />
    </div>
  );
}
