import { create } from "zustand";
import { db, Card, Folder } from "../db/db";

type Screen = "folders" | "cards" | "study";

interface FlashcardState {
  screen: Screen;
  setScreen: (s: Screen) => void;

  currentFolderId: number | null;
  setCurrentFolderId: (id: number | null) => void;

  folders: Folder[];
  loadFolders: () => Promise<void>;
  addFolder: (name: string) => void;

  cards: Card[];
  loadCards: (folderId: number) => Promise<void>;
  addCard: (
    folderId: number | null,
    front: string,
    back: string
  ) => Promise<void>;
  deleteCard: (id?: number, folderId?: number | null) => Promise<void>;
}

let folderCounter = 1;
let cardCounter = 1;

export const useFlashcards = create<FlashcardState>((set, get) => ({
  screen: "folders",
  setScreen: (s) => set({ screen: s }),

  currentFolderId: null,
  setCurrentFolderId: (id) => set({ currentFolderId: id }),

  folders: [],
  loadFolders: async () => {
    const all = await db.folders.toArray();
    set({ folders: all });
  },
  addFolder: (name) =>
    set((state) => ({
      folders: [...state.folders, { id: folderCounter++, name }],
    })),

  cards: [],
  loadCards: async (folderId) => {
    const all = await db.cards.where("folderId").equals(folderId).toArray();
    set({ cards: all });
  },
  addCard: async (folderId, front, back) => {
    await db.cards.add({ front, back, folderId: folderId || undefined });
    await get().loadCards(folderId!);
  },
  deleteCard: async (id, folderId) => {
    await db.cards.delete(id!);
    await get().loadCards(folderId!);
  },
}));
