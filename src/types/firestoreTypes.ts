import { Timestamp } from "firebase/firestore";

// 👇 Subcollection: leaderboard item
export type Leaderboard = {
  [username: string]: {
    score: number;
    time: number; // misal detik
    createdAt: Timestamp;
    nohp: string;
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
  qrcode: string;
};

// 👇 Gambar-gambar di kuis
export type QuizImage = {
  url: string;
  label: string; // contoh: "Barcode Scanner"
  deleteHash: string;
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
  nohp: string;
  currentQuestion: number;
  score: number;
  finishedAt?: Timestamp;
};
