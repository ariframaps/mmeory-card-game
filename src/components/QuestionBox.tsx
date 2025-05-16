import { QuestionItem } from "@/types/firestoreTypes";
import React from "react";
// import { QuestionItem } from "../types/types";

interface Props {
  question: QuestionItem;
}

const QuestionBox: React.FC<Props> = ({ question }) => {
  return (
    <div className="my-4 p-2 bg-yellow-700 border">
      <p>{question.questionText}</p>
    </div>
  );
};

export default QuestionBox;
