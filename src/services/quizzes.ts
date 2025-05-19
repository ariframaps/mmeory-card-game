import { Quiz, QuizImage } from "@/types/firestoreTypes";
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
import { deleteImage } from "./image";

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
  const quizSnap = await getDoc(quizRef);

  if (!quizSnap.exists()) {
    throw new Error("Quiz not found");
  }

  const quizData = quizSnap.data();
  console.log(quizData);

  // Hapus semua gambar Imgur
  const images: QuizImage[] = quizData.images || [];
  console.log(images);
  try {
    for (const img of images) {
      if (img.deleteHash) {
        try {
          console.log(img.deleteHash);
          await deleteImage(img.deleteHash); // panggil fungsi kamu
        } catch (err) {
          console.warn(
            "Gagal hapus gambar qrcodeImgUrlur:",
            img.deleteHash,
            err
          );

          throw new Error("Gagal hapus gambar Imgur");
        }
      }
    }

    if (quizData.qrcodeImgUrl) {
      try {
        console.log(quizData.qrcodeImgUrl.deleteHash);
        await deleteImage(quizData.qrcodeImgUrl.deleteHash); // panggil fungsi kamu
      } catch (err) {
        console.warn(
          "Gagal hapus gambar qrcodeImgUrlur:",
          quizData.qrcodeImgUrl.deleteHash,
          err
        );
        throw new Error("Gagal hapus gambar Imgur");
      }
    }

    // Lanjut hapus data lain
    await deleteLeaderboardByQuizId(quizId);
    await deleteUserProgressByQuizId(quizId);
    await deleteDoc(quizRef);
  } catch (e) {
    throw new Error("gagal menghapus kuis");
  }
}

export async function restartQuiz(quizId: string): Promise<void> {
  const quizRef = doc(quizzesCollection, quizId);

  try {
    updateDoc(quizRef, {
      isStarted: false,
    });

    await deleteLeaderboardByQuizId(quizId);
    await deleteUserProgressByQuizId(quizId);
  } catch (error) {
    throw new Error("gagal restrart kuis");
  }
}

export async function startQuiz(quizId: string): Promise<void> {
  const quizRef = doc(quizzesCollection, quizId);

  await updateDoc(quizRef, {
    isStarted: true,
    startedAt: Timestamp.now(),
  });
}

export async function updateQuizQrcodeUrl(
  quizId: string,
  qrcodeImgUrl: QuizImage
): Promise<void> {
  const quizRef = doc(quizzesCollection, quizId);

  await updateDoc(quizRef, {
    qrcodeImgUrl, // tambahkan atau update field ini
  });
}
