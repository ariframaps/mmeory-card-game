"use client";

import React from "react";
import type { ScoreEntry } from "../types";

interface Props {
  scores: ScoreEntry[];
}

const LeaderboardSidebar = ({ scores }: Props) => {
  return (
    <div className="mt-5 w-full bg-gray-800 p-4 border-l hidden md:block">
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
