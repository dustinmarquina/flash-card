import { useState, useEffect } from "react";
import { db, Card } from "./db/db";
import FolderListScreen from "./screens/FolderListScreen";
import StudyScreen from "./screens/StudyScreen";
import CardListScreen from "./screens/CardListScreen";

export default function App() {
  const [folders, setFolders] = useState<string[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [flip, setFlip] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [createFolderMode, setCreateFolderMode] = useState(true);
  const [studyMode, setStudyMode] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  async function loadFolders() {
    const allFolders = await db.folders.toArray();
    console.log(
      "Loaded folders:",
      allFolders.map((f) => f.name)
    );
    setFolders(allFolders.map((f) => f.name));
  }

  // load cards from db
  async function loadCards() {
    const all = await db.cards
      .where("folderId")
      .equals(currentFolder ? currentFolder : 0)
      .toArray();
    console.log("Loaded cards:", all);
    setCards(all);
  }

  async function createFolder(name: string) {
    if (!name) return;
    await db.folders.add({ name });
    loadFolders();
  }

  async function addCard(e: React.FormEvent) {
    e.preventDefault();
    if (!front || !back) return;
    await db.cards.add({
      front,
      back,
      folderId: currentFolder ? currentFolder : undefined,
    });
    setFront("");
    setBack("");
    loadCards();
  }

  async function deleteFolder(id?: number) {
    if (!id) return;
    await db.folders.delete(id);
    loadFolders();
  }

  async function deleteCard(id?: number) {
    if (!id) return;
    await db.cards.delete(id);
    loadCards();
  }

  useEffect(() => {
    loadCards();
    loadFolders();
  }, [currentFolder]);

  function selectFolder(id: number) {
    setCurrentFolder(id);
    setCreateFolderMode(false);
    loadCards();
  }

  function startStudy() {
    if (cards.length === 0) return;
    setStudyMode(true);
    setCurrentIndex(0);
    setShowAnswer(false);
  }
  function previousCard() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  }

  function nextCard() {
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setStudyMode(false);
    }
  }

  if (createFolderMode) {
    return (
      <FolderListScreen
        folders={folders}
        createFolder={createFolder}
        deleteFolder={deleteFolder}
        selectFolder={selectFolder}
      />
    );
  }

  // --- UI rendering ---
  if (studyMode) {
    return (
      <StudyScreen
        cards={cards}
        currentIndex={currentIndex}
        flip={flip}
        setFlip={setFlip}
        nextCard={nextCard}
        previousCard={previousCard}
      />
    );
  }
  return (
    <CardListScreen
      cards={cards}
      front={front}
      back={back}
      setFront={setFront}
      setBack={setBack}
      addCard={addCard}
      deleteCard={deleteCard}
      startStudy={startStudy}
    />
  );
}
