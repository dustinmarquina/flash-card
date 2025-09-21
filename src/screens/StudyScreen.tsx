import React from "react";
import { Card } from "../db/db";

interface StudyScreenProps {
  cards: Card[];
  currentIndex: number;
  flip: boolean;
  setFlip: (flip: boolean) => void;
  nextCard: () => void;
  previousCard: () => void;
}

export default function StudyScreen({
  cards,
  currentIndex,
  flip,
  setFlip,
  nextCard,
  previousCard,
}: StudyScreenProps) {
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
        <button onClick={nextCard} disabled={currentIndex + 1 >= cards.length}>
          <span style={{ fontSize: 20, marginRight: 8 }}>&rarr;</span>
        </button>
      </div>
    </>
  );
}
