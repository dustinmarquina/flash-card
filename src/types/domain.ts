export type Folder = { id?: number; name: string; createdAt: number };
export type Card = {
  id?: number;
  folderId?: number;
  front: string;
  back: string;
  createdAt: number;
  updatedAt: number;
};
export type ReviewLog = {
  id?: number;
  cardId: number;
  grade: "again" | "hard" | "good" | "easy";
  at: number;
};
