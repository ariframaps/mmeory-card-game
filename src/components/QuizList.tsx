"use client";

import { Quiz } from "@/types/firestoreTypes";
import React from "react";

interface Props {
  quizzes: Quiz[];
  onStart: (id: string) => void;
  onViewLeaderboard: (id: string) => void;
  onDelete: (id: string) => void;
}

const QuizList = ({ quizzes, onStart, onViewLeaderboard, onDelete }: Props) => {
  const handleDelete = (id: string) => {
    const yakin = confirm("Yakin mau hapus kuis ini?");
    if (yakin) {
      onDelete(id);
    }
  };

  return (
    <div className="border p-4">
      <h2 className="text-lg font-semibold mb-2">Daftar Kuis</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id} className="mb-2 border-b pb-2">
            <p className="font-bold">{quiz.title}</p>
            <button
              onClick={() => !quiz.isStarted && onStart(quiz.id)}
              disabled={quiz.isStarted}
              className={`mr-2 ${
                quiz.isStarted
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-green-600"
              }`}>
              {quiz.isStarted ? "Already Started" : "Start"}
            </button>
            <button
              onClick={() => onViewLeaderboard(quiz.id)}
              className="mr-3 text-blue-600">
              Detail
            </button>
            <button
              onClick={() => handleDelete(quiz.id)}
              className="text-red-600">
              Hapus
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizList;
