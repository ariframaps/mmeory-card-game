import { Quiz } from "@/types/firestoreTypes";
import { quizzesCollection } from "@/utils/firebase.browser";
import {
  DocumentData,
  Query,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { deleteLeaderboardByQuizId } from "./leaderBoards";
import { deleteUserProgressByQuizId } from "./userProgress";

export async function fetchQuizzez(query?: Query): Promise<Quiz[]> {
  let querySnapshot = null;

  if (query) {
    querySnapshot = await getDocs(query);
  } else {
    querySnapshot = await getDocs(quizzesCollection);
  }

  const quizzesList = querySnapshot.docs.map((doc: DocumentData) => {
    return { ...doc.data(), id: doc.id };
  });

  return quizzesList as Quiz[];
}

export async function fetchQuizById(id: string): Promise<Quiz | null> {
  const docRef = doc(quizzesCollection, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { ...docSnap.data(), id: docSnap.id } as Quiz;
  } else {
    return null; // Quiz tidak ditemukan
  }
}

// Add new quiz
export async function addQuiz(quiz: Omit<Quiz, "id">): Promise<string> {
  const docRef = await addDoc(quizzesCollection, quiz);
  return docRef.id; // ID baru dari Firebase
}

// Delete quiz
export async function deleteQuiz(quizId: string): Promise<void> {
  const quizRef = doc(quizzesCollection, quizId);
  await deleteLeaderboardByQuizId(quizId);
  await deleteUserProgressByQuizId(quizId);
  await deleteDoc(quizRef);
}

export async function startQuiz(quizId: string): Promise<void> {
  const quizRef = doc(quizzesCollection, quizId);

  await updateDoc(quizRef, {
    isStarted: true,
    startedAt: Timestamp.now(),
  });
}
