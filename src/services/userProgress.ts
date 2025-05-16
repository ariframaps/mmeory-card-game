import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/utils/firebase.browser";
import { UserProgress } from "@/types/firestoreTypes";
import { fetchQuizById } from "./quizzes";

export async function getOrCreateUserProgress(
  quizId: string,
  username: string
): Promise<UserProgress | null> {
  const checkQuiz = await fetchQuizById(quizId);

  if (checkQuiz !== null) {
    const docId = `${quizId}_${username}`;
    const userRef = doc(db, "userProgress", docId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProgress;
    }

    const newUserProgress: UserProgress = {
      quizId,
      username,
      currentQuestion: 0,
      score: 0,
    };

    await setDoc(userRef, {
      ...newUserProgress,
      updatedAt: serverTimestamp(),
    });

    return newUserProgress;
  } else {
    return null;
  }
}

export async function updateUserProgress(
  quizId: string,
  username: string,
  currentQuestion: number,
  score: number
): Promise<void> {
  const docId = `${quizId}_${username}`;
  const userRef = doc(db, "userProgress", docId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    console.warn("User progress not found");
    return;
  }

  const current = userSnap.data() as UserProgress;

  const nextProgress = {
    currentQuestion: currentQuestion,
    score: score,
  };

  await updateDoc(userRef, nextProgress);
}

export async function deleteUserProgressByQuizId(
  quizId: string
): Promise<void> {
  const progressRef = collection(db, "userProgress");
  const q = query(progressRef, where("quizId", "==", quizId));
  const snapshot = await getDocs(q);

  const deletePromises = snapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, "userProgress", docSnap.id))
  );
  await Promise.all(deletePromises);
}
