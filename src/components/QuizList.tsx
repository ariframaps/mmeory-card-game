"use client";

import { Quiz } from "@/types/firestoreTypes";
import React from "react";

interface Props {
  quizzes: Quiz[];
  onStart: (id: string) => void;
  onViewLeaderboard: (id: string) => void;
  onDelete: (id: string) => void;
  onRestart: (id: string) => void;
}

const QuizList = ({
  quizzes,
  onStart,
  onViewLeaderboard,
  onDelete,
  onRestart,
}: Props) => {
  const handleDelete = (id: string) => {
    const yakin = confirm("Yakin mau hapus kuis ini?");
    if (yakin) {
      onDelete(id);
    }
  };
  const handleReset = (id: string) => {
    const yakin = confirm(
      "Yakin mau reset kuis ini? semua data user yang pernah memainkan kuis ini akan dihapus dan leaderboard juga akan dihapus"
    );
    if (yakin) {
      onRestart(id);
    }
  };

  return (
    <div className="border p-4">
      <h2 className="text-lg font-semibold mb-2">Daftar Kuis</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li
            key={quiz.id}
            className="mb-5 p-4 bg-blue-100 rounded-lg shadow-sm border border-blue-200 text-black">
            <p className="font-bold text-lg mb-2">{quiz.title}</p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => !quiz.isStarted && onStart(quiz.id)}
                disabled={quiz.isStarted}
                className={`px-4 py-1 rounded font-medium ${
                  quiz.isStarted
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}>
                {quiz.isStarted ? "Already Started" : "Start"}
              </button>

              <button
                onClick={() => quiz.isStarted && handleReset(quiz.id)}
                disabled={!quiz.isStarted}
                className={`px-4 py-1 rounded font-medium ${
                  !quiz.isStarted
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}>
                Reset
              </button>

              <button
                onClick={() => onViewLeaderboard(quiz.id)}
                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                Detail
              </button>

              {/* <button
                onClick={() => handleDelete(quiz.id)}
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Hapus
              </button> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizList;
