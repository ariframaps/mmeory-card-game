"use client";

import React, { useState } from "react";
import type { QuestionItem, Quiz } from "@/types";

interface Props {
  onCreate: (quiz: Quiz) => void;
}

const CreateQuizForm = ({ onCreate }: Props) => {
  const [title, setTitle] = useState("");
  const [imageCount, setImageCount] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newQuiz: Quiz = {
      id: Date.now(),
      title,
      imageCount,
      questions: [], // kosong dulu
    };

    onCreate(newQuiz);
    setTitle("");
    setImageCount(0);
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">Buat Kuis Baru</h2>
      <input
        type="text"
        placeholder="Judul kuis"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-1 mb-2 w-full"
      />
      <input
        type="number"
        placeholder="Jumlah gambar"
        value={imageCount}
        onChange={(e) => setImageCount(parseInt(e.target.value))}
        className="border p-1 mb-2 w-full"
      />
      <button className="bg-blue-500 text-white px-3 py-1">Buat</button>
    </form>
  );
};

export default CreateQuizForm;
