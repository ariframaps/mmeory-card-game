"use client";

import React, { useEffect, useState } from "react";
import CreateQuizForm from "@/components/CreateQuizForm";
import QuizList from "@/components/QuizList";
import type { ScoreEntry } from "@/types/types";
import { deleteQuiz, fetchQuizzez, startQuiz } from "@/services/quizzes";
import { Quiz } from "@/types/firestoreTypes";
import { useRouter } from "next/navigation";
import { getLeaderboard } from "@/services/leaderBoards";
import LeaderboardCard from "@/components/Leaderboard";

const getDummyLeaderboard = (quizId: string): ScoreEntry[] => {
  return [
    { username: "User A", score: 3, time: "20s" },
    { username: "User B", score: 2, time: "25s" },
  ];
};

export default function AdminPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    const quizzes = await fetchQuizzez();
    setQuizzes(quizzes);
    console.log(quizzes);
  };

  const handleStartQuiz = async (id: string) => {
    alert(`Mulai kuis ID: ${id}`);
    // bisa redirect ke halaman game atau trigger event
    await startQuiz(id).then(() => {
      alert("kuis berhasil dimulai");
      loadQuizzes(); // refresh quiz list biar update isStarted-nya
    });
  };

  const handleDeleteQuiz = async (id: string) => {
    await deleteQuiz(id);
    alert("kuis berhasil dihapus");
    window.location.reload(); // Reloads the page from cache
  };

  const handleViewLeaderboard = (id: string) => {
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
      <button className="bg-blue-500 text-white px-3 py-1 mb-7">
        <a href="/admin/add-quiz">buat kuis baru</a>
      </button>
      {/* <CreateQuizForm onCreate={handleCreateQuiz} /> */}
      <QuizList
        quizzes={quizzes}
        onStart={handleStartQuiz}
        onViewLeaderboard={handleViewLeaderboard}
        onDelete={handleDeleteQuiz}
      />
      {selectedQuizId !== null && (
        <div className="mt-4">
          <h2 className="text-md font-bold mb-2">
            Detail kuis dengan ID: {selectedQuizId}
          </h2>
          <LeaderboardCard quizId={selectedQuizId} />
        </div>
      )}{" "}
    </div>
  );
}
