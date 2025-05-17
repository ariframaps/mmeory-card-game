"use client";

import { useEffect, useState } from "react";
// import { Leaderboard } from "@/types/firestoreTypes";
import { getLeaderboard } from "@/services/leaderBoards";
import { Quiz } from "@/types/firestoreTypes";

interface Props {
  quiz: Quiz;
}

type LeaderboardEntry = {
  username: string;
  score: number;
  time: number;
};

const LeaderboardCard = ({ quiz }: Props) => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);

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

  return (
    <>
      <h2 className="text-md font-bold mb-2">Detail kuis - {quiz.title}</h2>
      <div className="border mt-4 p-4">
        <div className="p-2 rounded bg-yellow-950 mb-2">
          <h3 className="text-md mb-2">ID: {quiz.id}</h3>
          {quiz.startedAt && (
            <h3 className="text-md  mb-2">
              Started At:{quiz.startedAt?.toDate().toString()}
            </h3>
          )}
          <h3 className="text-md">
            Created At:{quiz.createdAt.toDate().toString()}
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
