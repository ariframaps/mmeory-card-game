import { uploadAllImages } from "@/services/image";
import { QuizImage } from "@/types/firestoreTypes";
import QRCode from "qrcode";

// link = link quiz kamu
export const generateQRImage = async (link: string): Promise<QuizImage> => {
  const qrDataUrl = await QRCode.toDataURL(link);

  // Convert base64 ke File
  const res = await fetch(qrDataUrl);
  const blob = await res.blob();
  const file = new File([blob], "qrcode.png", { type: "image/png" });

  // Bikin ImageItem untuk uploadAllImages
  const imageItem = {
    label: "quiz_qrcode",
    file,
    previewUrl: qrDataUrl,
  };

  // Upload pakai fungsi kamu yang udah ada
  const [uploadedQR] = await uploadAllImages([imageItem]);

  return uploadedQR;
};
