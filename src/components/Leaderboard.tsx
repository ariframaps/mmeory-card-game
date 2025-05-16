"use client";

import { useEffect, useState } from "react";
// import { Leaderboard } from "@/types/firestoreTypes";
import { getLeaderboard } from "@/services/leaderBoards";

interface Props {
  quizId: string;
}

type LeaderboardEntry = {
  username: string;
  score: number;
  time: number;
};

const LeaderboardCard = ({ quizId }: Props) => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard(quizId);

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
  }, [quizId]);

  return (
    <div className="border mt-4 p-4">
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
  );
};

export default LeaderboardCard;
