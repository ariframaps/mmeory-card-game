import { QuestionItem, QuizImage } from "@/types/firestoreTypes";
import React from "react";
// import { CardItem } from "../types/types";

interface Props {
  cards: QuizImage[];
  onSelect: (id: string) => void;
  isHidden: boolean;
  currentQuestion: number;
  quiz: QuestionItem[];
}

const CardGrid: React.FC<Props> = ({
  cards,
  onSelect,
  isHidden,
  currentQuestion,
  quiz,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => {
        const isRevealed =
          !isHidden ||
          quiz
            .slice(0, currentQuestion)
            .some((q) => q.correctImageId === card.label);

        return (
          <div
            key={card.label}
            className={`border p-2 ${
              !isRevealed ? "cursor-pointer" : "cursor-default"
            }`}
            onClick={() => {
              if (!isRevealed) onSelect(card.label);
            }}>
            {isRevealed ? (
              <img
                src={card.url}
                alt={card.label}
                className="w-full h-24 object-contain"
              />
            ) : (
              <div className="bg-gray-700 w-full h-24 flex items-center justify-center text-white text-xl">
                {card.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CardGrid;
