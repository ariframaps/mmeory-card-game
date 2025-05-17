"use client";

import { useEffect, useState } from "react";
// import { Leaderboard } from "@/types/firestoreTypes";
import { getLeaderboard } from "@/services/leaderBoards";
import { Quiz } from "@/types/firestoreTypes";
import QRCodeGenerator from "./QRCodeGenerator";
import { usePathname } from "next/navigation";

interface Props {
  quiz: Quiz;
}

type LeaderboardEntry = {
  username: string;
  score: number;
  time: number;
};

const LeaderboardCard = ({ quiz }: Props) => {
  // const rootPath = process.env.NEXT_PUBLIC_ROOT_PATH;
  const rootPath = typeof window !== "undefined" ? window.location.origin : "";
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard(quiz.id);

      if (data) {
        // convert object to array
        const entries = Object.entries(data).map(([username, value]) => ({
          username,
          score: value.score,
          time: value.time,
        }));

        // sort by score DESC, time ASC
        entries.sort((a, b) =>
          b.score !== a.score ? b.score - a.score : a.time - b.time
        );

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

  return (
    <>
      <h2 className="text-md font-bold mb-2">Detail kuis - {quiz.title}</h2>
      <div className="border mt-4 p-4">
        <div className="p-2 rounded bg-yellow-950 mb-2">
          {/* <QRCodeGenerator link={`${rootPath}/quiz?id=${quiz.id}`} /> */}
          {quiz.qrcodeImgUrl && (
            <div>
              <img src={quiz.qrcodeImgUrl.url} alt="" />
            </div>
          )}
          <div className="flex items-center mb-2">
            <h3 className="text-md mr-2">ID: {quiz.id}</h3>
            <button
              onClick={handleCopy}
              className="text-sm text-gray-900 bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          {/* {quiz.startedAt && (
            <h3 className="text-md  mb-2">
              Started At:{quiz.startedAt?.toDate().toString()}
            </h3>
          )}
          <h3 className="text-md">
            Created At:{quiz.createdAt.toDate().toString()}
          </h3> */}
          <h3 className="text-md underline text-blue-300">
            <a href={`${rootPath}/quiz?id=${quiz.id}`}>Try quiz</a>
          </h3>
        </div>
        <h3 className="text-md font-semibold mb-2">Leaderboard</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Skor</th>
              <th>Waktu (detik)</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((entry, index) => (
              <tr key={index}>
                <td>{entry.username}</td>
                <td>{entry.score}</td>
                <td>{entry.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LeaderboardCard;
