import QRCode from "qrcode";

export const generateQRCodeImage = async (text: string): Promise<string> => {
  try {
    const dataUrl = await QRCode.toDataURL(text);
    return dataUrl; // Ini base64 image, siap untuk di-upload
  } catch (err) {
    console.error(err);
    return "";
  }
};
