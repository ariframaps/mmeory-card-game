"use client";

import { useEffect, useRef, useState } from "react";
import { getLeaderboard } from "@/services/leaderBoards";
import { Quiz } from "@/types/firestoreTypes";
import { Button } from "./ui/button";
import { exportToExcel } from "@/utils/exportToExcel";

interface Props {
  quiz: Quiz;
}

type LeaderboardEntry = {
  username: string;
  attempt: number;
  time: number;
  isWinning: boolean;
  nohp: string;
};

type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
};

type DataItem = {
  username: string;
  isWinning: boolean;
  attempt: number;
  time: number;
  nohp: string;
  createdAt: FirebaseTimestamp;
};

const LeaderboardCard = ({ quiz }: Props) => {
  const rootPath = typeof window !== "undefined" ? window.location.origin : "";
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [entryData, setEntryData] = useState<DataItem[]>();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard(quiz.id);

      if (data) {
        // convert object to array
        const entries = Object.entries(data).map(([username, value]) => ({
          username,
          isWinning: value.isWinning,
          time: value.time,
          attempt: value.attempt,
          nohp: value.nohp,
          createdAt: value.createdAt,
        }));

        setEntryData(entries);

        // sort by score DESC, time ASC
        entries.sort((a, b) => {
          // 1. Winners first
          if (a.isWinning !== b.isWinning) return +b.isWinning - +a.isWinning;
          // 2. Fewer attempts
          if (a.attempt !== b.attempt) return a.attempt - b.attempt;
          // 3. Faster time
          return a.time - b.time;
        });

        setScores(entries);
      }
    };

    fetchLeaderboard();
  }, [quiz.id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(quiz.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset notif
    });
  };

  const handleDownload = async () => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = quiz.qrcodeImgUrl?.url as string;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.drawImage(image, 0, 0);
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    image.onerror = () => {
      alert("Failed to load image for download.");
    };
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Quiz QR Code",
          text: "Scan this QR code to join the quiz!",
          url: quiz.qrcodeImgUrl?.url as string, // the Imgur URL
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing not supported on this device.");
    }
  };

  return (
    <>
      <h2 className="text-md font-bold mb-2">Detail kuis - {quiz.title}</h2>
      <div className="border mt-4 p-4">
        <div className="p-2 rounded bg-yellow-950 mb-2">
          {/* <QRCodeGenerator link={`${rootPath}/quiz?id=${quiz.id}`} /> */}
          {quiz.qrcodeImgUrl && (
            <div className="flex flex-col lg:flex-row w-full gap-3 justify-between items-start">
              <img src={quiz.qrcodeImgUrl.url} alt="quizqr" />
              <div>
                <div className="flex gap-2 mb-4">
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
                <div>
                  <div className="flex items-center my-2">
                    <h3 className="text-white text-md mr-2">ID: {quiz.id}</h3>
                    <button
                      onClick={handleCopy}
                      className="text-sm text-gray-900 bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <h3 className="text-md underline text-blue-300">
                    <a href={`${rootPath}/quiz?id=${quiz.id}`} target="_blank">
                      Link Try quiz
                    </a>
                  </h3>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex w-full justify-between items-center p-3 bg-slate-100 border rounded-lg">
          <h3 className=" mb-2 text-xl font-bold">Leaderboard</h3>
          {entryData && (
            <Button onClick={() => exportToExcel(entryData)}>Download</Button>
          )}
        </div>
        <div className="p-3">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Menang?</th>
                <th>Attempt</th>
                <th>Waktu (detik)</th>
                <th>no hp</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.username}</td>
                  <td>{entry.isWinning ? "Yes" : "No"}</td>
                  <td>{entry.attempt}</td>
                  <td>{entry.time}</td>
                  <td>{entry.nohp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default LeaderboardCard;
