import React from "react";

interface Props {
  score: number;
}

const ScoreBoard: React.FC<Props> = ({ score }) => {
  return (
    <div className="mt-4 p-2 border text-center">
      <strong>Skor:</strong> {score}
    </div>
  );
};

export default ScoreBoard;
