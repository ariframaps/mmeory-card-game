"use client";
import React from "react";
import type { ScoreEntry } from "@/types";

interface Props {
  scores: ScoreEntry[];
}

const Leaderboard = ({ scores }: Props) => {
  return (
    <div className="border mt-4 p-4">
      <h3 className="text-md font-semibold mb-2">Leaderboard</h3>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Skor</th>
            <th>Waktu</th>
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

export default Leaderboard;
