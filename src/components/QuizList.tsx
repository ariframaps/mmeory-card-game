"use client";

import React from "react";
import type { Quiz } from "@/types";

interface Props {
  quizzes: Quiz[];
  onStart: (id: number) => void;
  onViewLeaderboard: (id: number) => void;
  onDelete: (id: number) => void;
}

const QuizList = ({ quizzes, onStart, onViewLeaderboard, onDelete }: Props) => {
  const handleDelete = (id: number) => {
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
            <p>{quiz.imageCount} gambar</p>
            <button
              onClick={() => onStart(quiz.id)}
              className="mr-2 text-green-600">
              Start
            </button>
            <button
              onClick={() => onViewLeaderboard(quiz.id)}
              className="text-blue-600">
              Leaderboard
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
