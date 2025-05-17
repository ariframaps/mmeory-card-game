"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOrCreateUserProgress } from "@/services/userProgress";

export default function QuizEntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get("id");

  const [NoHp, setNoHp] = useState("");
  const [username, setUsername] = useState("");

  // ✅ Otomatis join kalau sudah ada username di localStorage
  useEffect(() => {
    const savedNoHp = localStorage.getItem("nohp");
    const savedUsername = localStorage.getItem("username");
    if (savedNoHp && quizId && savedUsername) {
      joinQuiz(savedNoHp, savedUsername);
    }
  }, [quizId]);

  const joinQuiz = async (NoHpToUse: string, username: string) => {
    try {
      const joinDetail = await getOrCreateUserProgress(
        quizId!,
        username,
        NoHpToUse
      );
      if (joinDetail) {
        localStorage.setItem("username", username);
        localStorage.setItem("nohp", NoHpToUse);
        router.push(`/quiz/${joinDetail.quizId}`);
      } else {
        alert("Kuis tidak ditemukan.");
      }
    } catch (err) {
      console.error("Join error:", err);
      alert("Terjadi kesalahan saat join kuis.");
    }
  };

  const handleJoin = () => {
    if (!NoHp) {
      alert("Nomor WA harus diisi");
      return;
    }
    if (!username) {
      alert("Username harus diisi");
      return;
    }

    const waRegex = /^\+?\d{8,15}$/;
    if (!waRegex.test(NoHp)) {
      alert("Tolong masukkan nomor WA yang benar!");
      return;
    }

    // Lanjut panggil joinQuiz dengan NoHp dan username
    joinQuiz(NoHp, username);
  };

  // ❌ Kalau gak ada quizId di URL
  if (!quizId) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl text-red-500 font-bold mb-4">
          Kuis tidak ditemukan
        </h2>
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded"
          onClick={() => router.push("/")}>
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">Masukkan NoHp untuk Mulai Kuis</h1>
      <div className="max-w-md mx-auto p-4">
        <input
          type="tel"
          placeholder="Nomor WhatsApp kamu"
          value={NoHp}
          onChange={(e) => setNoHp(e.target.value)}
          className="w-full border p-2 mb-4"
        />
        <input
          type="text"
          placeholder="Username kamu"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 mb-4"
        />
        <button
          onClick={handleJoin}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Mulai
        </button>
      </div>
    </div>
  );
}
