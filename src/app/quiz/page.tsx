"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOrCreateUserProgress } from "@/services/userProgress";

export default function QuizEntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quizId, setQuizId] = useState(searchParams.get("id"));
  const [isLoading, setIsLoading] = useState(false);

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

      console.log(joinDetail);
      if (joinDetail) {
        localStorage.setItem("username", username);
        localStorage.setItem("nohp", NoHpToUse);
        router.push(`/quiz/${joinDetail.quizId}`);
      } else {
        alert("Kuis tidak ditemukan.");
        setQuizId(null);
      }
    } catch (err) {
      console.error("Join error:", err);
      alert("Terjadi kesalahan saat join kuis.");
    }
  };

  const handleJoin = () => {
    setIsLoading(true);
    if (!NoHp) {
      alert("Nomor HP harus diisi");
      return;
    }
    if (!username) {
      alert("Username harus diisi");
      return;
    }

    const waRegex = /^\+?\d{8,15}$/;
    if (!waRegex.test(NoHp)) {
      alert("Tolong masukkan nomor HP yang benar!");
      return;
      setIsLoading(false);
    } else {
      // Lanjut panggil joinQuiz dengan NoHp dan username
      joinQuiz(NoHp, username);
      setIsLoading(false);
    }
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

  if (isLoading)
    return <p className="p-4 max-w-md mx-auto text-center my-10">loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">
        Masukkan Nomor HP dan nama anda untuk Mulai Kuis
      </h1>
      <div className="max-w-md mx-auto p-4">
        <input
          type="tel"
          placeholder="Nomor HP Anda"
          value={NoHp}
          onChange={(e) => {
            const value = e.target.value;
            // Cuma izinkan angka dan opsional awalan '+'
            if (/^\+?\d*$/.test(value)) {
              setNoHp(value);
            }
          }}
          className="w-full border p-2 mb-4"
        />
        <input
          type="text"
          placeholder="Nama Anda"
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
