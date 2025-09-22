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
  setCurrentFolderId: async (id) => {
    set({ currentFolderId: id });
    console.log("Current folder ID set to:", id);
    if (id !== null) {
      await get().loadCards(id);
    } else {
      set({ cards: [] });
    }
    console.log("Cards after setting folder ID:", get().cards);
  },

  folders: [],
  loadFolders: async () => {
    const all = await db.folders.toArray();
    console.log("Loaded folders:", all);
    set({ folders: all });
  },
  addFolder: async (name) => {
    await db.folders.add({ name });
    await get().loadFolders();
    console.log("Added folder:", name);
  },

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
