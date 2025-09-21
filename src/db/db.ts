import Dexie, { Table } from "dexie";

export interface Folder {
  id?: number;
  name: string;
}

export interface Card {
  id?: number;
  front: string;
  back: string;
  folderId?: number;
}

class AppDB extends Dexie {
  cards!: Table<Card, number>;
  folders!: Table<Folder, number>;
  constructor() {
    super("flashcards-db");
    this.version(1).stores({
      cards: "++id, front, back, folderId",
      folders: "++id, name",
    });
  }
}
export const db = new AppDB();
