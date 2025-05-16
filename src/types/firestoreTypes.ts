import { Timestamp } from "firebase/firestore";

// 👇 Subcollection: leaderboard item
export type Leaderboard = {
  [username: string]: {
    score: number;
    time: number; // misal detik
    createdAt: Timestamp;
  };
};

// 👇 Main quiz document
export type Quiz = {
  id: string;
  title: string;
  isStarted: boolean;
  questions: QuestionItem[];
  images: QuizImage[]; // gambar untuk memory card
  createdAt: Timestamp;
  startedAt?: Timestamp;
};

// 👇 Gambar-gambar di kuis
export type QuizImage = {
  url: string;
  id: string; // contoh: "Barcode Scanner"
};

// 👇 Soal kuis
export type QuestionItem = {
  questionText: string;
  correctImageId: string; // cocokkan ke id gambar
};

// 👇 User progress
export type UserProgress = {
  quizId: string;
  username: string;
  currentQuestion: number;
  score: number;
  finishedAt?: Timestamp;
};
