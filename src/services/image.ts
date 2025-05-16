import { QuizImage } from "@/types/firestoreTypes";
import { ImageItem } from "@/types/types";

export const uploadAllImages = async (
  images: ImageItem[]
): Promise<QuizImage[]> => {
  const uploadedImages = [];

  for (const img of images) {
    const formData = new FormData();
    formData.append("file", img.file as File);

    const res = await fetch("/api/imgur", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error("Gagal upload gambar");

    uploadedImages.push({
      label: img.label, // pastikan kamu punya label di tiap gambar
      url: data.link,
      deleteHash: data.deletehash,
    });
  }

  return uploadedImages;
};

export const deleteImage = async (deleteHash: string) => {
  console.log("fungsi delete image", deleteHash);
  const res = await fetch("/api/imgur", {
    method: "DELETE",
    body: JSON.stringify({ deleteHash }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error("Gagal delete gambar");

  console.log("Hasil delete:", data);
};
