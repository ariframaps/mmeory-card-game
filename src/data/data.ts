import { CardItem, QuestionItem } from "@/types/types";

export const cards: CardItem[] = [
  { id: 1, name: "Barcode Scanner", img: "/images/barcode.png" },
  { id: 2, name: "Printer", img: "/images/printer.png" },
  { id: 3, name: "Monitor", img: "/images/monitor.png" },
];

export const questions: QuestionItem[] = [
  {
    id: 1,
    text: "Mana gambar barcode scanner?",
    correctId: 1,
  },
  {
    id: 2,
    text: "Mana gambar printer?",
    correctId: 2,
  },
];
