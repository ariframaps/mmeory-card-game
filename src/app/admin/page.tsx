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

export default function AdminPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      await deleteQuiz(id);
      alert("kuis berhasil dihapus");
      window.location.reload(); // Reloads the page from cache
    } catch (e) {
      alert("gagal menghapus kuis");
    }
    setIsLoading(false);
  };

  const handleViewLeaderboard = (id: string) => {
    if (selectedQuizId === id) {
      // klik lagi = tutup
      setSelectedQuizId(null);
    } else {
      setSelectedQuizId(id);
    }
  };

  if (isLoading)
    return <p className="p-4 max-w-md mx-auto text-center my-10">loading...</p>;

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
          {selectedQuizId && (
            <LeaderboardCard
              quiz={quizzes.find((i) => i.id === selectedQuizId) as Quiz}
            />
          )}
        </div>
      )}{" "}
    </div>
  );
}
