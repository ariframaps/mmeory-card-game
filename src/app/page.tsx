"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateUserProgress } from "@/services/userProgress";

export default function JoinQuizPage() {
  const [quizId, setQuizId] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleJoin = async () => {
    if (!quizId || !username) {
      alert("Isi quiz ID dan nama dulu ya");
      return;
    }

    await getOrCreateUserProgress(quizId, username).then((joinDetail) => {
      console.log(joinDetail);
      if (joinDetail !== null) {
        localStorage.setItem("username", username);
        // arahkan ke halaman kuis
        router.push(`/quiz/${joinDetail.quizId}`);
      } else {
        alert("kuis tidak ditemukan");
      }
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Join Kuis</h1>

      <ul className="text-gray-300 mb-4 flex flex-col gap-2">
        <li className="bg-orange-950 p-2 rounded-lg">
          Untuk melanjutkan atau melihat hasil kuis, gunakan username yang
          pernah dipakai.
        </li>
        <li className="bg-orange-950 p-2 rounded-lg">
          Username tidak boleh pakai spasi dan harus huruf kecil semua.
        </li>
      </ul>

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
        onChange={(e) => {
          const cleaned = e.target.value.toLowerCase().replace(/\s+/g, "");
          setUsername(cleaned);
        }}
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
