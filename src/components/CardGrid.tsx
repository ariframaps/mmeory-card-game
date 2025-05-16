import React from "react";
import { CardItem } from "../types";

interface Props {
  cards: CardItem[];
  onSelect: (id: number) => void;
  isHidden: boolean;
}

const CardGrid: React.FC<Props> = ({ cards, onSelect, isHidden }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="border p-2 cursor-pointer"
          onClick={() => onSelect(card.id)}>
          {!isHidden ? (
            <img
              src={card.img}
              alt={card.name}
              className="w-full h-24 object-contain"
            />
          ) : (
            <div className="bg-gray-700 w-full h-24 flex items-center justify-center">
              ?
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CardGrid;
