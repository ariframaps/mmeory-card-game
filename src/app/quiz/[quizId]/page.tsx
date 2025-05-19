"use client";

import bgImage from "@/assets/KASSEN-FUN-GAMES.jpg";
import kassenLogo from "@/assets/kassen-logo.png";
import { updateLeaderboardScore } from "@/services/leaderBoards";
import { fetchQuizById } from "@/services/quizzes";
import {
  getOrCreateUserProgress,
  updateUserProgress,
} from "@/services/userProgress";
import { QuestionItem, Quiz, QuizImage } from "@/types/firestoreTypes";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Image from "next/image";
import LoadingPage from "@/components/LoadingPage";

function shuffle<T>(array: T[]): T[] {
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
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [wrongCardId, setWrongCardId] = useState<string | null>(null);

  useEffect(() => {
    const getUsername = localStorage.getItem("username");
    const getNoHp = localStorage.getItem("nohp");
    setNoHp(getNoHp);
    setUsername(getUsername);

    if (getUsername && getNoHp) {
      loadQuiz(getUsername, getNoHp);
    } else {
      triggerAlert("terjadi kesalahan");
      handleLogout();
    }
  }, []);

  const loadQuiz = async (getUsername: string, getNoHp: string) => {
    const quiz = await fetchQuizById(quizId);
    if (quiz != null) {
      setQuiz(quiz);
      // setShuffledImages(quiz.images);

      loadUserProgress(quiz, getUsername, getNoHp);
    } else {
      triggerAlert("kuis tidak ditemukan");
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
      if (userProgress.attempt == 2 && userProgress.shuffledSeq) {
        const reordered: any = userProgress.shuffledSeq
          .map((seqIndex) => qz.images.find((img) => img.index === seqIndex))
          .filter(Boolean);
        if (reordered) setShuffledImages(reordered);

        setCardsVisible(true);
        setAttempt(userProgress.attempt);
        resetGame();
      } else {
        // ================== shuffel question  dan image serta question tidak boleh sama dengan yang tersimpan
        // tapi aku bingung, kalau misal user memulai kuis kan attemptnya jadi 1
        if (userProgress.attempt == 1 && userProgress.shuffledSeq) {
          setPrevQuestionText(userProgress.answeredQuestion as string);

          const reordered: any = userProgress.shuffledSeq
            .map((seqIndex) => qz.images.find((img) => img.index === seqIndex))
            .filter(Boolean);
          if (reordered) setShuffledImages(reordered);
          startQuiz(1, qz);
        } else {
          setShuffledImages(shuffle(qz.images));
        }
      }
    }
  };

  const startQuiz = async (attempt?: number, qz?: Quiz) => {
    // cek apakah sudah dimulai oleh admin
    const checkStartStatus = await fetchQuizById(quizId);
    if (checkStartStatus?.isStarted) {
      let q;

      if (attempt && qz) {
        setAttempt(attempt);
        q = getRandomQuestion(qz);
      } else {
        q = getRandomQuestion(quiz as Quiz);
      }

      setStarted(true);
      setPrevQuestionText(q.questionText);

      // let newShuffledImages: QuizImage[];
      // show ordered cards first
      if (!qz) {
        if (quiz) {
          setCardsVisible(true);
        } else {
          triggerAlert("tidak ada quiz");
        }
      }

      setIsShuffling(true);
      setTimeout(() => {
        setQuestion(q);
        setCardsVisible(false);
        setTimeout(() => {
          // setShuffledImages(shuffle(newShuffledImages as QuizImage[]));
          setIsShuffling(false);
          setCardsVisible(false);
        }, 2000);
      }, 1000);
    } else {
      triggerAlert("Game belum dimulai oleh admin");
    }
  };

  const getRandomQuestion = (qz: Quiz): QuestionItem => {
    const filtered = qz.questions.filter(
      (q) => q.questionText !== prevQuestionText
    ) as QuestionItem[];
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const handleSelect = async (id: string) => {
    if (!(quiz && NoHp && username && quiz.startedAt && shuffledImages)) return;

    if (question && id === question.correctImageId) {
      // ============= simpan si user progress
      triggerAlert("Selamat, jawaban kamu benar!");
      setCardsVisible(true);
      setAttempt(2); // berarti sudah selesai

      const shuffledIndexes = shuffledImages.map((img) => img.index);
      await updateUserProgress(
        quiz.id,
        NoHp,
        2,
        prevQuestionText as string,
        shuffledIndexes
      );
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
        setWrongCardId(id); // id is the wrong card's id
        if (question) setShowCorrectId(question.correctImageId);
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setWrongCardId(null);

        triggerAlert("Jawaban anda salah. Mohon maaf, kesempatan habis!");
        toast.warning("Jawaban salah, mohon maaf kesempatan telah habis!!");
        setCardsVisible(true);

        await updateLeaderboardScore(
          quiz.id,
          username,
          2,
          false,
          quiz.startedAt,
          NoHp
        );

        const shuffledIndexes = shuffledImages.map((img) => img.index);
        await updateUserProgress(
          quiz.id,
          NoHp,
          newAttempt,
          prevQuestionText as string,
          shuffledIndexes
        );

        resetGame();
      } else {
        setWrongCardId(id); // id is the wrong card's id
        setTimeout(() => setWrongCardId(null), 2000); // remove

        toast.warning(
          "Jawaban salah, sisa 1 kesempatan lagi untuk menjawab! Pertanyaan akan berubah"
        );

        if (question) setShowCorrectId(question.correctImageId);

        const shuffledIndexes = shuffledImages.map((img) => img.index);
        await updateUserProgress(
          quiz.id,
          NoHp,
          newAttempt,
          prevQuestionText as string,
          shuffledIndexes
        );

        // wait 1 second before doing the next part
        await new Promise((resolve) => setTimeout(resolve, 2000));
        triggerAlert(
          "Jawaban anda salah. sisa 1 kesempatan lagi untuk menjawab!"
        );
        setShowCorrectId(null);

        setIsShuffling(true);
        setTimeout(() => {
          // setShuffledImages(shuffle(quiz.images as QuizImage[]));
          setIsShuffling(false);
          const nextQuestion = getRandomQuestion(quiz);
          setQuestion(nextQuestion);
          setPrevQuestionText(nextQuestion.questionText);
        }, 8000);
      }
    }
  };

  const resetGame = () => {
    setStarted(false);
    setQuestion(null);
    // setSelectedId(null);
    setShowCorrectId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("nohp");
    router.back();
  };

  const triggerAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  if (quiz == null) {
    return (
      <div
        className="flex justify-center items-center min-h-screen bg-cover bg-fixed bg-center bg-repeat"
        style={{ backgroundImage: `url(${bgImage.src})` }}>
        <div className=" p-5 px-7 rounded-lg flex gap-4 items-center">
          {/* <div className="w-5 h-5 border-2 border-t-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-lg font-bold ">Loading...</p> */}
          <LoadingPage />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-fixed bg-top bg-repeat"
      style={{ backgroundImage: `url(${bgImage.src})` }}>
      <div className="min-h-screen flex flex-col justify-start gap-[7vh] sm:gap-[10vh] pb-4 pt-0 px-1 max-w-3xl mx-auto">
        {/* Top Bar */}
        <div className="bg-white/30 backdrop-blur-sm border p-2 md:p-4 rounded-b-xl">
          <div className="sm:hidden flex justify-between items-center mb-2 md:mb-0">
            <Button
              variant="destructive"
              size={"sm"}
              onClick={handleLogout}
              className="text-white font-bold">
              Logout
            </Button>
            <p className="text-sm text-black">User: {username}</p>
          </div>

          {/* Header */}
          <div className="flex flex-row justify-between items-center sm:items-center gap-2">
            <h1 className="text-2xl font-bold">🧠 Memory Game</h1>
            <div className="flex gap-2 items-center">
              <Badge
                variant="secondary"
                className="hidden sm:block md:text-sm bg-transparent">
                User: {username}
              </Badge>
              <Badge variant="outline" className="md:text-base bg-white">
                Sisa kesempatan: {2 - attempt}
              </Badge>
              <Button
                variant="destructive"
                size={"sm"}
                onClick={handleLogout}
                className="text-white font-bold hidden sm:block">
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-xs border p-1 sm:p-5 rounded-md mb-10 md:mb-0">
          <div className="h-16">
            {/* Start Quiz */}
            {!started && attempt === 0 && (
              <div className="flex w-full justify-end">
                <Button
                  size={"lg"}
                  onClick={() => startQuiz()}
                  className="w-full sm:w-auto bg-green-600 text-white border-2 border-white">
                  Mulai Kuis
                </Button>
              </div>
            )}

            {/* Finished Message */}
            {attempt === 2 && (
              <Alert className="bg-orange-700 text-white">
                <AlertDescription className="text-white">
                  Anda sudah selesai memainkan game
                </AlertDescription>
              </Alert>
            )}

            {/* Question Box */}
            {question && attempt != 2 && (
              <Alert className="text-xl bg-green-100 text-green-900 border-green-300">
                {isShuffling ? (
                  <div className="flex gap-3 items-center min-w-max">
                    <div className="w-5 h-5 border-2 border-t-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    <p className="text-red-700 font-bold text-xl">
                      loading pertanyaan baru.......
                    </p>
                  </div>
                ) : (
                  <AlertDescription className="text-xl text-gray-800 font-bold">
                    {question.questionText}
                  </AlertDescription>
                )}
              </Alert>
            )}
          </div>

          {/* Card Grid */}
          <div className="relative">
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-5 mt-4">
              {shuffledImages &&
                shuffledImages.map((img, i) => (
                  <div key={i} className="bg-red-500 rounded-lg">
                    <div
                      key={img.label}
                      className={`transition-all duration-500 h-full ${
                        !(!cardsVisible || img.label === showCorrectId)
                          ? "cursor-pointer"
                          : "cursor-default"
                      } ${
                        wrongCardId === img.label
                          ? "bg-red-500 animate-pulse"
                          : ""
                      }`}
                      onClick={() => {
                        if (!cardsVisible || img.label === showCorrectId) {
                          handleSelect(img.label);
                        }
                      }}>
                      {cardsVisible || img.label === showCorrectId ? (
                        <Card className="w-full min-h-48 h-full flex gap-y-5 flex-col pb-0 items-center justify-between rounded-lg border-gray-300">
                          <CardContent className="flex flex-col items-center justify-center gap-2 p-0">
                            <img
                              src={img.url}
                              alt={img.label}
                              className="max-h-24 object-contain"
                            />
                            {/* <p className="">{img.label}</p> */}
                          </CardContent>
                          <CardFooter className="bg-gray-600 text-white justify-center w-full rounded-b-lg p-2">
                            <p className="w-full text-center text-xs sm:text-base">
                              {img.label}
                            </p>
                          </CardFooter>
                        </Card>
                      ) : (
                        <div className=" hover:bg-black border border-white min-h-48 h-full bg-gray-700 w-full flex flex-col justify-center items-center gap-2 rounded-lg text-white text-2xl shadow">
                          <Image
                            height={20}
                            src={kassenLogo}
                            alt={"logo kassen"}
                            className="max-h-24 object-contain"
                          />
                          <span className="font-bold">{i + 1}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            {isShuffling && (
              <div className="w-full h-full flex flex-col gap-2 items-center justify-center bg-white/40 backdrop-blur-xs absolute inset-0 rounded-lg">
                <div className=" bg-white px-7 py-5 rounded-lg col-span-full flex justify-center items-center gap-2 text-black">
                  <div className="w-5 h-5 border-2 border-t-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                  <p className="text-center font-bold">
                    Mengacak pertanyaan...
                  </p>
                </div>
                <LoadingPage isAbsolute={false} />
              </div>
            )}
          </div>
        </div>
      </div>
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Info</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="text-base sm:text-lg">{alertMessage}</div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAlert(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
