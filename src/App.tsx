import { useState, useEffect } from "react";
import { db, Card } from "./db";

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
      <div
        className="container"
        style={{
          alignItems: "center",
        }}
      >
        <h1>Study Set</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as typeof e.target & {
              folderName: { value: string };
            };
            createFolder(form.folderName.value);
            // setCreateFolderMode(false);
          }}
          style={{ width: "100%", gap: 8, marginBottom: 16 }}
        >
          <div>
            <input name="folderName" placeholder="Folder Name" />
            <button>Create</button>
            <button type="button" style={{ marginLeft: 8 }}>
              Cancel
            </button>
          </div>
        </form>
        <div>
          <ul>
            {folders.map((f, idx) => (
              <div key={idx} style={{ marginTop: 8 }}>
                <button onClick={() => selectFolder(idx + 1)}>{f}</button>
                <button
                  onClick={() => deleteFolder(idx + 1)}
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </button>
              </div>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // --- UI rendering ---
  if (studyMode) {
    const card = cards[currentIndex];
    return (
      <>
        <h1>Study Mode</h1>
        <div
          className={`card ${flip ? "flip" : ""}`}
          onClick={() => setFlip(!flip)}
          style={{ paddingTop: 32, paddingBottom: 32 }}
        >
          <div className="front">
            <h2>{card.front}</h2>
          </div>
          <div className="back">
            <h2>{card.back}</h2>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 30,
          }}
        >
          <button onClick={previousCard} disabled={currentIndex === 0}>
            <span style={{ fontSize: 20, marginRight: 8 }}>&larr;</span>
          </button>
          <div
            style={{
              padding: "8px 16px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {currentIndex + 1}/{cards.length}
          </div>
          <button
            onClick={nextCard}
            disabled={currentIndex + 1 >= cards.length}
          >
            <span style={{ fontSize: 20, marginRight: 8 }}>&rarr;</span>
          </button>
        </div>
      </>
    );
  }
  return (
    <div className="container">
      <h1>Flashcards App</h1>
      <form
        onSubmit={addCard}
        style={{ width: "100%", display: "flex", gap: 8, marginBottom: 16 }}
      >
        <input
          placeholder="Front"
          value={front}
          onChange={(e) => setFront(e.target.value)}
        />
        <input
          placeholder="Back"
          value={back}
          onChange={(e) => setBack(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <h2>Cards ({cards.length})</h2>
      <ul>
        {cards.map((c) => (
          <li key={c.id}>
            <b>{c.front}</b> — {c.back}
            <button onClick={() => deleteCard(c.id)} style={{ marginLeft: 8 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={startStudy}
        disabled={cards.length === 0}
        style={{ marginTop: 20 }}
      >
        Start Study
      </button>
    </div>
  );
}
