"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateUserProgress } from "@/services/userProgress";

export default function JoinQuizPage() {
  const [quizId, setQuizId] = useState("");
  const [username, setUsername] = useState("");
  const [NoHp, setNoHp] = useState("");
  const router = useRouter();

  const handleJoin = async () => {
    if (!quizId || !username) {
      alert("Isi quiz ID dan nama dulu ya");
      return;
    }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(username)) {
    //   alert("Tolong masukkan email yang benar!");
    //   return;
    // }

    await getOrCreateUserProgress(quizId, username, NoHp).then((joinDetail) => {
      if (joinDetail !== null) {
        localStorage.setItem("username", username);
        localStorage.setItem("nohp", NoHp);
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
          Untuk melanjutkan atau melihat hasil kuis, gunakan nomor hp yang
          pernah dipakai untuk mengerjakan kuis.
        </li>
        {/* <li className="bg-orange-950 p-2 rounded-lg">
          Username tidak boleh pakai spasi dan harus huruf kecil semua.
        </li> */}
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
        placeholder="Masukkan Nomor Hp"
        value={NoHp}
        onChange={(e) => {
          // const cleaned = e.target.value.toLowerCase().replace(/\s+/g, "");
          setNoHp(e.target.value);
        }}
        className="border p-2 w-full mb-4"
      />
      <input
        type="text"
        placeholder="Masukkan Username"
        value={username}
        onChange={(e) => {
          // const cleaned = e.target.value.toLowerCase().replace(/\s+/g, "");
          setUsername(e.target.value);
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
