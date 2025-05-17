"use client";

import { useState } from "react";
import { addQuiz } from "@/services/quizzes";
import { Timestamp } from "firebase/firestore";
import { QuestionItem, Quiz, QuizImage } from "@/types/firestoreTypes";
import { useRouter } from "next/navigation";
import { ImageItem } from "@/types/types";
import { uploadAllImages } from "@/services/image";

export default function AddQuizPage() {
  const router = useRouter();
  const [quizName, setQuizName] = useState("");
  const [totalImages, setTotalImages] = useState(0);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerate = () => {
    if (totalImages <= 0) {
      alert("Masukkan jumlah gambar");
      return;
    }

    // Generate image slots
    const newImages = Array.from({ length: totalImages }, (_, i) => ({
      label: `img${i + 1}`,
      file: null,
      previewUrl: "",
    }));
    setImages(newImages);

    // Generate questions
    const newQuestions = Array.from({ length: totalImages }, () => ({
      questionText: "",
      correctImageId: "",
    }));
    setQuestions(newQuestions);
  };

  const handleImageChange = (index: number, file: File | null) => {
    if (!file) return;

    const maxSize = 3.5 * 1024 * 1024; // 3.5 MB

    if (file.size > maxSize) {
      alert("Ukuran gambar maksimal 3.5 MB");
      return;
    } else {
      const newImages = [...images];
      newImages[index] = {
        label: newImages[index].label,
        file,
        previewUrl: URL.createObjectURL(file),
      };
      setImages(newImages);
    }
  };

  const handleQuestionChange = (
    index: number,
    key: keyof QuestionItem,
    value: string
  ) => {
    if (key === "correctImageId") {
      // Cek apakah gambar ini sudah dipilih di pertanyaan lain
      const alreadyUsed = questions.some(
        (q, i) => i !== index && q.correctImageId === value
      );
      if (alreadyUsed) {
        alert("Gambar ini sudah dipakai di pertanyaan lain");
        return;
      }
    }

    const newQuestions = [...questions];
    newQuestions[index][key] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    if (!quizName) {
      alert("Isi nama quiz");
      return;
    }
    if (images.some((img) => !img.file)) {
      alert("Semua gambar harus diupload");
      return;
    }
    if (questions.some((q) => !q.questionText || !q.correctImageId)) {
      alert("Semua pertanyaan harus diisi dan harus punya jawaban");
      return;
    }

    setIsSubmitting(true);
    try {
      const realImageUrls = await uploadAllImages(images);
      // const canvas = qrRef.current;
      // const imageData = canvas?.toDataURL("image/png"); // base64 image

      const newQuiz = {
        title: quizName,
        createdAt: Timestamp.now(),
        isStarted: false,
        images: realImageUrls,
        questions,
      } as Quiz;

      const newId = await addQuiz(newQuiz);
      alert("Quiz berhasil ditambahkan!");
      router.push("/admin");
    } catch (err) {
      console.error("Gagal simpan quiz:", err);
      alert("Gagal menyimpan quiz. Coba lagi.");
    }
    setIsSubmitting(false);
  };

  if (isSubmitting)
    return <p className="p-4 max-w-md mx-auto text-center my-10">loading...</p>;
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Buat Quiz Baru</h1>

      <input
        type="text"
        placeholder="Nama Quiz"
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <div className="flex gap-2 mb-6">
        <input
          type="number"
          placeholder="Total Gambar/Pertanyaan"
          value={totalImages > 0 ? totalImages : ""}
          onChange={(e) => setTotalImages(Number(e.target.value))}
          className="border p-2 w-full"
          min={1}
        />
        <button
          onClick={handleGenerate}
          className="bg-gray-700 text-white px-4 shrink-0">
          Buat Pertanyaan
        </button>
      </div>

      {images.length > 0 && (
        <>
          <h2 className="font-semibold mb-2">Upload Gambar</h2>
          <div className="flex flex-wrap gap-4 gap-y-8 mb-6 justify-center">
            {images.map((img, i) => (
              <div key={img.label} className="flex flex-col items-center">
                {img.previewUrl ? (
                  <img
                    src={img.previewUrl}
                    alt={`Preview ${img.label}`}
                    className="w-24 h-24 object-cover mb-2 rounded"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-500 flex items-center justify-center mb-2 rounded">
                    <span>Preview</span>
                  </div>
                )}
                <p className="text-sm mb-1">{img.label}</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(i, e.target.files?.[0] || null)
                  }
                  className="bg-gray-700 p-2 w-min rounded"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {questions.length > 0 && (
        <>
          <h2 className="font-semibold mb-2">Pertanyaan</h2>
          <div className="space-y-4 mb-6">
            {questions.map((q, i) => (
              <div key={i} className="border p-4 rounded">
                <p className="font-medium mb-2">Pertanyaan {i + 1}</p>
                <input
                  type="text"
                  placeholder={`Tulis pertanyaan ${i + 1}`}
                  value={q.questionText}
                  onChange={(e) =>
                    handleQuestionChange(i, "questionText", e.target.value)
                  }
                  className="border p-2 w-full mb-2"
                />
                <select
                  value={q.correctImageId}
                  onChange={(e) =>
                    handleQuestionChange(i, "correctImageId", e.target.value)
                  }
                  className="border p-2 w-full">
                  <option value="">-- Pilih Gambar yang Benar --</option>
                  {images.map((img) => (
                    <option
                      key={img.label}
                      value={img.label}
                      className="bg-gray-500">
                      {img.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </>
      )}

      {images.length > 0 && (
        <button
          disabled={images.length == 0}
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded">
          Simpan Quiz
        </button>
      )}
    </div>
  );
}
