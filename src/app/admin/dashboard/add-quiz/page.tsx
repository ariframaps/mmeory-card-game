"use client";

import { useEffect, useState } from "react";
import { addQuiz, updateQuizQrcodeUrl } from "@/services/quizzes";
import { Timestamp } from "firebase/firestore";
import { QuestionItem, Quiz } from "@/types/firestoreTypes";
import { useRouter } from "next/navigation";
import { ImageItem } from "@/types/types";
import { uploadAllImages } from "@/services/image";
import { generateQRImage } from "@/utils/generateQR";

export default function AddQuizPage() {
  const router = useRouter();
  const rootPath = typeof window !== "undefined" ? window.location.origin : "";
  const [quizName, setQuizName] = useState("");
  const [totalImages, setTotalImages] = useState(0);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sameImgLabelErr, setSameImgLabelErr] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      router.push("/admin");
    }
  }, []);

  const handleGenerate = () => {
    if (totalImages <= 0) {
      alert("Masukkan jumlah gambar");
      return;
    }

    // Reset dulu sebelum generate baru
    setImages([]);
    setQuestions([]);

    const newImages = Array.from({ length: totalImages }, () => ({
      id: crypto.randomUUID(),
      label: "",
      file: null,
      previewUrl: "",
    }));
    setImages(newImages);

    const newQuestions = Array.from({ length: totalImages }, () => ({
      questionText: "",
      correctImageId: "",
    }));
    setQuestions(newQuestions);
  };

  const handleImageChange = (index: number, file: File | null) => {
    if (!file) return;

    const maxSize = 3.5 * 1024 * 1024; // 3.5 MB

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Hanya PNG, JPG, or JPEG files yang boleh diupload.");
      return;
    }

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

    const labelSet = new Set(images.map((img) => img.label));
    if (labelSet.size !== images.length || images.some((img) => !img.label)) {
      alert("Semua nama gambar harus unik dan tidak boleh kosong");
      return;
    }

    setIsSubmitting(true);
    try {
      const realImageUrls = await uploadAllImages(images);

      const newQuiz = {
        title: quizName,
        createdAt: Timestamp.now(),
        isStarted: false,
        images: realImageUrls,
        questions,
      } as Quiz;

      const newId = await addQuiz(newQuiz);

      const qrCodeImage = await generateQRImage(`${rootPath}/quiz?id=${newId}`);
      await updateQuizQrcodeUrl(newId, qrCodeImage);

      alert("Quiz berhasil ditambahkan!");
      router.push("/admin/dashboard");
      setIsSubmitting(false);
    } catch (err) {
      console.error("Gagal simpan quiz:", err);
      alert(`Gagal menyimpan quiz. Coba lagi. ${err}`);
      setIsSubmitting(false);
    }
  };

  const handleLabelChange = (index: number, value: string) => {
    const isDuplicate = images.some(
      (img, i) => i !== index && img.label === value
    );
    if (isDuplicate) {
      setSameImgLabelErr(true);
    } else {
      setSameImgLabelErr(false);
    }

    const newImages = [...images];
    newImages[index].label = value;
    setImages(newImages);
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
              <div
                key={img.id}
                className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md w-36">
                {img.previewUrl ? (
                  <img
                    src={img.previewUrl}
                    alt={`Preview ${img.label}`}
                    className="w-28 h-28 object-cover mb-2 rounded border"
                  />
                ) : (
                  <div className="w-28 h-28 bg-gray-200 flex items-center justify-center mb-2 rounded border text-sm text-gray-600">
                    No Preview
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Image name"
                  value={img.label}
                  onChange={(e) => handleLabelChange(i, e.target.value)}
                  className="border px-2 py-1 text-sm rounded w-full mb-2"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(i, e.target.files?.[0] || null)
                  }
                  className="text-sm text-gray-700 w-full"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {questions.length > 0 && (
        <>
          <h2 className="font-semibold text-lg mb-4">Pertanyaan</h2>
          <div className="space-y-4 mb-6">
            {questions.map((q, i) => (
              <div
                key={i}
                className="border border-gray-300 bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium mb-3 text-gray-700">
                  Pertanyaan {i + 1}
                </p>

                <input
                  type="text"
                  placeholder={`Tulis pertanyaan ${i + 1}`}
                  value={q.questionText}
                  onChange={(e) =>
                    handleQuestionChange(i, "questionText", e.target.value)
                  }
                  className="border border-gray-300 p-2 rounded w-full mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />

                <select
                  value={q.correctImageId}
                  onChange={(e) =>
                    handleQuestionChange(i, "correctImageId", e.target.value)
                  }
                  className="border border-gray-300 p-2 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">-- Pilih Gambar yang Benar --</option>
                  {images
                    .filter((img) => img.label)
                    .map((img) => (
                      <option key={img.label} value={img.label}>
                        {img.label}
                      </option>
                    ))}
                </select>
              </div>
            ))}
          </div>
        </>
      )}

      {sameImgLabelErr && (
        <p className="text-red-400 mb-4">
          Nama gambar tidak boleh ada yang sama!
        </p>
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
