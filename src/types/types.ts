// export interface CardItem {
//   id: number;
//   name: string;
//   img: string;
// }

// export interface QuestionItem {
//   id: number;
//   text: string;
//   correctId: number;
// }

export interface ScoreEntry {
  username: string;
  score: number;
  time: string;
}

export type ImageItem = {
  label: string;
  file: File | null;
  previewUrl: string;
};
