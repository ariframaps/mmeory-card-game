"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinQuizPage() {
  const [quizId, setQuizId] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (!quizId || !username) {
      alert("Isi quiz ID dan nama dulu ya");
      return;
    }

    // arahkan ke halaman kuis
    router.push(`/quiz/${quizId}?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Masuk Kuis</h1>
      <input
        type="text"
        placeholder="Quiz ID"
        value={quizId}
        onChange={(e) => setQuizId(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="Nama Kamu"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <button
        onClick={handleJoin}
        className="bg-blue-500 text-white w-full py-2">
        Mulai
      </button>
    </div>
  );
}
