"use client";

import React, { useState } from "react";
import CreateQuizForm from "@/components/CreateQuizForm";
import QuizList from "@/components/QuizList";
import Leaderboard from "@/components/Leaderboard";
import type { Quiz, ScoreEntry } from "@/types";

const getDummyLeaderboard = (quizId: number): ScoreEntry[] => {
  return [
    { username: "User A", score: 3, time: "20s" },
    { username: "User B", score: 2, time: "25s" },
  ];
};

export default function AdminPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<
    ScoreEntry[] | null
  >(null);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);

  const handleCreateQuiz = (quiz: Quiz) => {
    setQuizzes([...quizzes, quiz]);
  };

  const handleStartQuiz = (id: number) => {
    alert(`Mulai kuis ID: ${id}`);
    // bisa redirect ke halaman game atau trigger event
  };

  const handleDeleteQuiz = (id: number) => {
    setQuizzes(quizzes.filter((q) => q.id !== id));
  };

  const handleViewLeaderboard = (id: number) => {
    if (selectedQuizId === id) {
      // klik lagi = tutup
      setSelectedQuizId(null);
    } else {
      setSelectedQuizId(id);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <CreateQuizForm onCreate={handleCreateQuiz} />
      <QuizList
        quizzes={quizzes}
        onStart={handleStartQuiz}
        onViewLeaderboard={handleViewLeaderboard}
        onDelete={handleDeleteQuiz}
      />
      {selectedQuizId !== null && (
        <div className="mt-4">
          <h2 className="text-md font-bold mb-2">
            Leaderboard untuk kuis ID: {selectedQuizId}
          </h2>
          <Leaderboard scores={getDummyLeaderboard(selectedQuizId)} />
        </div>
      )}{" "}
    </div>
  );
}
