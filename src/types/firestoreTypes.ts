import { Timestamp } from "firebase/firestore";

// 👇 Subcollection: leaderboard item
export type Leaderboard = {
  [username: string]: {
    attempt: number;
    isWinning: boolean;
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
  qrcodeImgUrl?: QuizImage;
};

// 👇 Gambar-gambar di kuis
export type QuizImage = {
  url: string;
  label: string; // contoh: "Barcode Scanner"
  deleteHash: string;
  index: number;
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
  attempt: number;
  shuffledSeq?: number[];
  answeredQuestion?: string;
  finishedAt?: Timestamp;
};
