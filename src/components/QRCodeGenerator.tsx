import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

type Props = {
  link: string;
};

const QRCodeGenerator = ({ link }: Props) => {
  const qrRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = () => {
    const canvas = qrRef.current;
    if (!canvas) return;

    const imageURL = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = imageURL;
    a.download = "qrcode.png";
    a.click();
  };

  const handleShare = () => {
    const canvas = qrRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], "qrcode.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          title: "QR Code",
          text: "Scan this QR Code!",
          files: [file],
        });
      } else {
        alert("Share nggak didukung di browser ini.");
      }
    });
  };

  return (
    <div className="mb-4">
      <QRCodeCanvas value={link} size={200} ref={qrRef} />
      <br />
      <div className="flex gap-4">
        <button
          onClick={handleShare}
          className="bg-green-500 text-white px-3 py-1 rounded">
          Share QR Code
        </button>
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white px-3 py-1 rounded">
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
