import React from "react";

interface CardListScreenProps {
  cards: {
    id?: number;
    front: string;
    back: string;
    folderId?: number;
  }[];
  front: string;
  back: string;
  setFront: (front: string) => void;
  setBack: (back: string) => void;
  addCard: (e: React.FormEvent) => void;
  deleteCard: (id?: number) => void;
  startStudy: () => void;
}

export default function CardListScreen({
  cards,
  front,
  back,
  setFront,
  setBack,
  addCard,
  deleteCard,
  startStudy,
}: CardListScreenProps) {
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
