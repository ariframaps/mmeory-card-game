import React from "react";

interface Props {
  score: number;
}

const ScoreBoard: React.FC<Props> = ({ score }) => {
  return (
    <div className="mt-4 p-2 bg-green-500 border">
      <strong>Skor:</strong> {score}
    </div>
  );
};

export default ScoreBoard;
