"use client";

import { useState, useEffect } from "react";
// import { cards, questions } from "@/data/data";
import { ScoreEntry } from "@/types/types";
import LeaderboardSidebar from "@/components/LeaderboardSidebar";
import CardGrid from "@/components/CardGrid";
import QuestionBox from "@/components/QuestionBox";
import ScoreBoard from "@/components/ScoreBoard";
import { useParams, useRouter } from "next/navigation";
import { fetchQuizById } from "@/services/quizzes";
import { Quiz, QuizImage } from "@/types/firestoreTypes";
import { updateLeaderboardScore } from "@/services/leaderBoards";
import {
  getOrCreateUserProgress,
  updateUserProgress,
} from "@/services/userProgress";

export default function Home() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId as string;
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quiz, setQuiz] = useState<Quiz | null>();
  const [isFinished, setIsFinished] = useState(false);
  const [username, setUsername] = useState<string | null>();
  const [NoHp, setNoHp] = useState<string | null>();
  const [shuffledCards, setShuffledCards] = useState<QuizImage[]>([]);

  useEffect(() => {
    const getUsername = localStorage.getItem("username");
    if (getUsername) {
      setUsername(getUsername);
      loadQuiz(getUsername);
    } else {
      alert("terjadi kesalahan");
      handleLogout();
    }
  }, []);

  useEffect(() => {
    if (quiz) {
      const shuffled = [...quiz.images]
        .map((img) => ({ ...img, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ sort, ...img }) => img);

      setShuffledCards(shuffled);
    }
  }, [currentQuestion, quiz]); // acak ulang saat pindah pertanyaan

  const loadUserProgress = async (quiz: Quiz, getUsername: string) => {
    const userProgress = await getOrCreateUserProgress(
      (quiz as Quiz).id,
      getUsername
    );
    if (userProgress !== null) {
      if (userProgress.currentQuestion == quiz.questions.length) {
        setIsFinished(true);
        setScore(userProgress.score);
        setCurrentQuestion(quiz.questions.length);
      } else {
        setScore(userProgress.score);
        setCurrentQuestion(userProgress.currentQuestion);
        console.log(userProgress);
      }
    }
  };

  const loadQuiz = async (getUsername: string) => {
    const quiz = await fetchQuizById(quizId);
    setQuiz(quiz);
    if (quiz != null) {
      loadUserProgress(quiz, getUsername);
      if (quiz.isStarted) setIsStarted(true);
      // console.log(quiz);
    } else {
      alert("kuis tidak ditemukan");
      router.push("/");
    }
  };

  const handleCardSelect = async (id: string) => {
    const correctId = quiz?.questions[currentQuestion].correctImageId;
    let newScore = score;
    if (id === correctId) {
      newScore = newScore + 1;
      setScore(newScore);
      alert("jawaban benar");
    } else {
      alert("jawaban salah");
    }

    if (quiz && username && quiz.startedAt) {
      await updateUserProgress(
        quiz.id,
        username,
        currentQuestion + 1,
        newScore
      );
      if (currentQuestion + 1 < quiz.questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const finalScore = id === correctId ? score + 1 : score;
        await updateLeaderboardScore(
          quiz.id,
          username,
          finalScore,
          quiz.startedAt
        ).then(() => {
          setIsFinished(true);
          alert("Game selesai!");
        });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    router.back();
  };

  if (quiz == null)
    return <p className="p-4 max-w-md mx-auto text-center my-10">loading...</p>;
  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex w-full justify-between">
        <button
          onClick={handleLogout}
          className="mb-4 text-red-600 underline text-sm cursor-pointer">
          Logout
        </button>
        <p>user: {username}</p>
      </div>

      <h1 className="text-xl font-bold mb-4 my-20">
        Memory Game Produk - {quiz.title}
      </h1>

      {!isStarted ? (
        <div className="bg-yellow-100 text-yellow-800 text-sm p-2 mb-4 rounded">
          Kuis belum dimulai. Silakan tunggu admin memulai kuis.
          <br />
          Jika sudah dimulai, silakan <strong>refresh halaman ini</strong>.
        </div>
      ) : (
        currentQuestion == 0 &&
        !isFinished && (
          <div className="bg-yellow-100 text-yellow-800 text-sm p-2 mb-4 rounded">
            <strong>Kuis sudah dimulai</strong>.
          </div>
        )
      )}

      {isFinished && (
        <div className="bg-green-200 text-gray-800 text-sm p-2 mb-4 rounded">
          <strong>Kuis telah dikerjakan</strong>.
        </div>
      )}

      {!isStarted ? (
        <>
          <CardGrid
            quiz={quiz.questions}
            currentQuestion={currentQuestion}
            cards={quiz.images}
            onSelect={() => {}}
            isHidden={false}
          />
        </>
      ) : (
        <>
          {!isFinished && (
            <QuestionBox question={quiz.questions[currentQuestion]} />
          )}
          <CardGrid
            quiz={quiz.questions}
            cards={shuffledCards}
            onSelect={handleCardSelect}
            isHidden={!isFinished}
            currentQuestion={currentQuestion}
          />
        </>
      )}

      {isStarted && <ScoreBoard score={score} />}

      {isFinished && <LeaderboardSidebar quizId={quiz.id} />}
    </div>
  );
}
