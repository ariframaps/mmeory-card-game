"use client";

import React, { useEffect, useState } from "react";
import QuizList from "@/components/QuizList";
import {
  deleteQuiz,
  fetchQuizzez,
  restartQuiz,
  startQuiz,
} from "@/services/quizzes";
import { Quiz } from "@/types/firestoreTypes";
import { useRouter } from "next/navigation";
import LeaderboardCard from "@/components/Leaderboard";

export default function AdminPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      router.push("/admin");
    } else {
      loadQuizzes();
    }
  }, []);

  const loadQuizzes = async () => {
    const quizzes = await fetchQuizzez();
    setQuizzes(quizzes);
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
  const handleReset = async (id: string) => {
    setIsLoading(true);

    try {
      await restartQuiz(id);
      alert("kuis berhasil direset");
      loadQuizzes();
    } catch (e) {
      alert("gagal mereset kuis");
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

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminName");
    router.push("/admin");
  };

  if (isLoading)
    return <p className="p-4 max-w-md mx-auto text-center my-10">loading...</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex w-full justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
      <button className="bg-blue-500 text-white px-3 py-1 mb-7">
        <a href="/admin/dashboard/add-quiz">buat kuis baru</a>
      </button>
      {/* <CreateQuizForm onCreate={handleCreateQuiz} /> */}
      <QuizList
        onRestart={handleReset}
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
