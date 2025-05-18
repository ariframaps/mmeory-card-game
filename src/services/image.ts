import { QuizImage } from "@/types/firestoreTypes";
import { ImageItem } from "@/types/types";

export const uploadAllImages = async (
  images: ImageItem[]
): Promise<QuizImage[]> => {
  const uploadedImages = [];

  let i = 1;
  for (const img of images) {
    const formData = new FormData();
    formData.append("file", img.file as File);

    console.log("miaw");
    const res = await fetch("/api/imgur", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error("Gagal upload gambar", (res as any).err);

    uploadedImages.push({
      label: img.label, // pastikan kamu punya label di tiap gambar
      url: data.link,
      deleteHash: data.deletehash,
      index: i,
    });
    i++;
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
