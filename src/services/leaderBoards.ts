import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  Timestamp,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/utils/firebase.browser";
import { Leaderboard } from "@/types/firestoreTypes";

export async function updateLeaderboardScore(
  quizId: string,
  username: string,
  score: number,
  quizStartedAt: Timestamp
): Promise<void> {
  const now = Timestamp.now();
  const seconds = now.seconds - quizStartedAt.seconds;

  const leaderboardRef = doc(db, "leaderboards", quizId);
  const docSnap = await getDoc(leaderboardRef);

  if (!docSnap.exists()) {
    // buat dokumen baru dengan user pertama
    await setDoc(leaderboardRef, {
      [username]: { score, time: seconds, createdAt: now },
    });
  } else {
    // update data user tanpa hilangkan data lain
    await updateDoc(leaderboardRef, {
      [`${username}`]: { score, time: seconds, createdAt: now },
    });
  }
}

export async function deleteLeaderboardByQuizId(quizId: string): Promise<void> {
  const leaderboardRef = doc(db, "leaderboards", quizId);
  await deleteDoc(leaderboardRef);
}

export async function getLeaderboard(
  quizId: string
): Promise<Leaderboard | null> {
  const leaderboardRef = doc(db, "leaderboards", quizId);
  const docSnap = await getDoc(leaderboardRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docSnap.data() as Leaderboard;
}
