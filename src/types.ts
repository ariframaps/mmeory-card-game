export interface CardItem {
  id: number;
  name: string;
  img: string;
}

export interface QuestionItem {
  id: number;
  text: string;
  correctId: number;
}

export interface Quiz {
  id: number;
  title: string;
  imageCount: number;
  questions: QuestionItem[];
}

export interface ScoreEntry {
  username: string;
  score: number;
  time: string;
}
