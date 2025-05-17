"use client";

import React, { useEffect, useState } from "react";
import type { ScoreEntry } from "../types/types";
import { getLeaderboard } from "@/services/leaderBoards";

interface Props {
  quizId: string;
}

type LeaderboardEntry = {
  username: string;
  score: number;
  time: number;
};

const LeaderboardSidebar = ({ quizId }: Props) => {
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
    <div className="mt-5 w-full bg-gray-800 p-4 border-l block">
      <h2 className="text-lg font-bold mb-2">Leaderboard</h2>
      <ul>
        {scores.map((entry, i) => (
          <li key={i} className="mb-2">
            <div className="font-semibold">{entry.username}</div>
            <div className="text-sm text-gray-400">
              Skor: {entry.score} - Waktu: {entry.time}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderboardSidebar;
