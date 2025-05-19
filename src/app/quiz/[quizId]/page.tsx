"use client";

import { updateLeaderboardScore } from "@/services/leaderBoards";
import { fetchQuizById } from "@/services/quizzes";
import {
  getOrCreateUserProgress,
  updateUserProgress,
} from "@/services/userProgress";
import { QuestionItem, Quiz, QuizImage } from "@/types/firestoreTypes";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function shuffle<T>(array: T[]): T[] {
  console.log(array);
  console.log([...array].sort(() => Math.random() - 0.5));
  return [...array].sort(() => Math.random() - 0.5);
}

export default function MemoryGameUI() {
  const router = useRouter();
  const params = useParams();
  const [started, setStarted] = useState<boolean>(false);
  const [attempt, setAttempt] = useState<number>(0);
  const [question, setQuestion] = useState<QuestionItem | null>(null);
  const [prevQuestionText, setPrevQuestionText] = useState<string | null>(null);
  const [shuffledImages, setShuffledImages] = useState<QuizImage[]>();
  const [showCorrectId, setShowCorrectId] = useState<string | null>(null);
  const [cardsVisible, setCardsVisible] = useState<boolean>(true);

  const quizId = params.quizId as string;
  const [quiz, setQuiz] = useState<Quiz | null>();
  const [NoHp, setNoHp] = useState<string | null>();
  const [username, setUsername] = useState<string | null>();
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    const getUsername = localStorage.getItem("username");
    const getNoHp = localStorage.getItem("nohp");
    setNoHp(getNoHp);
    setUsername(getUsername);

    if (getUsername && getNoHp) {
      loadQuiz(getUsername, getNoHp);
    } else {
      alert("terjadi kesalahan");
      handleLogout();
    }
  }, []);

  const loadQuiz = async (getUsername: string, getNoHp: string) => {
    const quiz = await fetchQuizById(quizId);
    if (quiz != null) {
      setQuiz(quiz);
      setShuffledImages(quiz.images);
      loadUserProgress(quiz, getUsername, getNoHp);
    } else {
      alert("kuis tidak ditemukan");
      router.push("/");
    }
  };

  const loadUserProgress = async (
    qz: Quiz,
    getUsername: string,
    getNoHp: string
  ) => {
    const userProgress = await getOrCreateUserProgress(
      (qz as Quiz).id,
      getUsername,
      getNoHp
    );
    if (userProgress !== null) {
      console.log(userProgress);
      if (userProgress.attempt == 2) {
        setCardsVisible(true);
        setAttempt(userProgress.attempt);
        resetGame();
      } else {
        // ================== shuffel question  dan image serta question tidak boleh sama dengan yang tersimpan
        // tapi aku bingung, kalau misal user memulai kuis kan attemptnya jadi 1
        if (userProgress.attempt == 1) {
          console.log("miaw");
          setPrevQuestionText(userProgress.answeredQuestion as string);
          startQuiz(1, qz);
        }
      }
    }
  };

  const startQuiz = async (attempt?: number, qz?: Quiz) => {
    console.log("meng");
    // cek apakah sudah dimulai oleh admin
    const checkStartStatus = await fetchQuizById(quizId);
    if (checkStartStatus?.isStarted) {
      let q;

      if (attempt && qz) {
        console.log("hehe");
        setAttempt(attempt);
        console.log(qz);
        q = getRandomQuestion(qz);
      } else {
        console.log("ming");
        q = getRandomQuestion(quiz as Quiz);
      }

      setStarted(true);
      setPrevQuestionText(q.questionText);

      let newShuffledImages: QuizImage[];
      // show ordered cards first
      if (qz) {
        setShuffledImages(qz.images);
        newShuffledImages = qz.images;
      } else {
        if (quiz) {
          setShuffledImages(quiz.images);
          newShuffledImages = quiz.images;
          setCardsVisible(true);
        } else {
          console.log("tidak ada quiz");
        }
      }

      setIsShuffling(true);
      setTimeout(() => {
        setQuestion(q);
        setCardsVisible(false);
        setTimeout(() => {
          setShuffledImages(shuffle(newShuffledImages as QuizImage[]));
          setIsShuffling(false);
          setCardsVisible(false);
        }, 1000);
      }, 1000);
    } else {
      alert("game belum dimulai oleh admin");
    }
  };

  const getRandomQuestion = (qz: Quiz): QuestionItem => {
    console.log(qz, "miwaaaaws");
    const filtered = qz.questions.filter(
      (q) => q.questionText !== prevQuestionText
    ) as QuestionItem[];
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const handleSelect = async (id: string) => {
    // setSelectedId(id);
    if (!(quiz && NoHp && username && quiz.startedAt)) return;

    if (question && id === question.correctImageId) {
      // ============= simpan si user progress
      alert("Selamat, jawaban kamu benar!");
      setCardsVisible(true);
      setAttempt(2); // berarti sudah selesai
      await updateUserProgress(quiz.id, NoHp, 2, prevQuestionText as string);
      await updateLeaderboardScore(
        quiz.id,
        username,
        attempt + 1,
        true,
        quiz.startedAt,
        NoHp
      );
      resetGame();
    } else {
      const newAttempt = attempt + 1;
      setAttempt(newAttempt);

      if (newAttempt === 2) {
        alert("Mohon maaf, kesempatan habis!");
        setCardsVisible(true);
        await updateLeaderboardScore(
          quiz.id,
          username,
          2,
          false,
          quiz.startedAt,
          NoHp
        );

        await updateUserProgress(
          quiz.id,
          NoHp,
          newAttempt,
          prevQuestionText as string
        );

        resetGame();
      } else {
        alert("Masih ada 1 kesempatan lagi!");
        if (question) setShowCorrectId(question.correctImageId);

        await updateUserProgress(
          quiz.id,
          NoHp,
          newAttempt,
          prevQuestionText as string
        );

        // wait 1 second before doing the next part
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowCorrectId(null);

        setIsShuffling(true);
        setTimeout(() => {
          setShuffledImages(shuffle(quiz.images as QuizImage[]));
          setIsShuffling(false);
          const nextQuestion = getRandomQuestion(quiz);
          setQuestion(nextQuestion);
          setPrevQuestionText(nextQuestion.questionText);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setStarted(false);
    // setAttempt(1);
    setQuestion(null);
    // setSelectedId(null);
    setShowCorrectId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("nohp");
    router.back();
  };

  if (quiz == null)
    return <p className="p-4 max-w-md mx-auto text-center my-10">loading...</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex w-full justify-between mb-10">
        <button
          onClick={handleLogout}
          className="mb-4 text-red-600 underline text-sm cursor-pointer">
          Logout
        </button>
        <p>user: {username}</p>
      </div>
      <div className="flex justify-between items-center mb-15">
        <h1 className="text-xl font-bold">Memory Game Dummy</h1>
        <span>Sisa kesempatan: {2 - attempt}</span>
      </div>

      {!started && attempt == 0 && (
        <button
          onClick={() => startQuiz()}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
          Mulai Kuis
        </button>
      )}

      {attempt == 2 && (
        <h2 className="text-lg font-bold mb-4 text-white">
          Anda sudah selesai memainkan game
        </h2>
      )}

      {question && (
        <div className="mb-4 bg-green-200 text-black text-lg p-2 px-3 rounded-lg">
          {question.questionText}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mt-5">
        {isShuffling ? (
          <p className="col-span-3 w-full text-center my-5">
            Mengacak gambar...
          </p>
        ) : (
          shuffledImages &&
          shuffledImages.map((img) => (
            <div
              key={img.label}
              className={`border p-2 ${
                !(cardsVisible || img.label === showCorrectId)
                  ? "cursor-pointer"
                  : "cursor-default"
              }`}
              onClick={() => {
                if (!(cardsVisible || img.label === showCorrectId))
                  handleSelect(img.label);
              }}>
              {cardsVisible || img.label === showCorrectId ? (
                <div>
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full h-24 object-contain"
                  />
                  <p>{img.label}</p>
                </div>
              ) : (
                <div className="bg-gray-700 w-full h-24 flex items-center justify-center text-white text-xl">
                  {img.index}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
