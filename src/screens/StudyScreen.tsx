import React, { useState, useEffect } from "react";
import { Card } from "../db/db";

interface StudyScreenProps {
  cards: Card[];
  currentIndex: number;
  flip: boolean;
  setFlip: (flip: boolean) => void;
  nextCard: () => void;
  previousCard: () => void;
  folderName?: string;
  onBack?: () => void;
  onExit?: () => void;
}

interface StudyStats {
  correct: number;
  incorrect: number;
  completed: number;
}

export default function StudyScreen({
  cards,
  currentIndex,
  flip,
  setFlip,
  nextCard,
  previousCard,
  folderName = "Study Set",
  onBack,
  onExit,
}: StudyScreenProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyStats, setStudyStats] = useState<StudyStats>({
    correct: 0,
    incorrect: 0,
    completed: 0,
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const card = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  // Reset answer state when card changes
  useEffect(() => {
    setShowAnswer(false);
    setFlip(false);
  }, [currentIndex, setFlip]);

  // Check if study session is completed
  useEffect(() => {
    if (studyStats.completed >= cards.length && cards.length > 0) {
      setIsCompleted(true);
    }
  }, [studyStats.completed, cards.length]);

  const handleRevealAnswer = () => {
    setShowAnswer(true);
    setFlip(true);
  };

  const handleShowQuestion = () => {
    setShowAnswer(false);
    setFlip(false);
  };

  const handleCardClick = () => {
    if (showAnswer) {
      handleShowQuestion();
    } else {
      handleRevealAnswer();
    }
  };

  const handleCorrect = () => {
    setStudyStats((prev) => ({
      ...prev,
      correct: prev.correct + 1,
      completed: prev.completed + 1,
    }));
    if (currentIndex + 1 < cards.length) {
      nextCard();
    }
  };

  const handleIncorrect = () => {
    setStudyStats((prev) => ({
      ...prev,
      incorrect: prev.incorrect + 1,
      completed: prev.completed + 1,
    }));
    if (currentIndex + 1 < cards.length) {
      nextCard();
    }
  };

  const handleStudyAgain = () => {
    setStudyStats({ correct: 0, incorrect: 0, completed: 0 });
    setIsCompleted(false);
    setShowAnswer(false);
    // Reset to first card (this would need to be handled by parent component)
    if (onBack) onBack();
  };

  const accuracy =
    studyStats.completed > 0
      ? Math.round((studyStats.correct / studyStats.completed) * 100)
      : 0;

  if (isCompleted) {
    return (
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: 20,
          textAlign: "center",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {onBack && (
              <button
                onClick={onBack}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 18,
                  cursor: "pointer",
                  padding: 8,
                }}
              >
                ←
              </button>
            )}
            <div>
              <h1 style={{ margin: 0, fontSize: 24 }}>
                Studying: {folderName}
              </h1>
              <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                StudyCards
              </p>
            </div>
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
              padding: 8,
            }}
          >
            ⚙️
          </button>
        </div>

        {/* Completion Content */}
        <div style={{ marginTop: 60 }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🏆</div>
          <h2 style={{ fontSize: 32, marginBottom: 10 }}>
            Study Session Complete!
          </h2>
          <p style={{ color: "#666", fontSize: 18, marginBottom: 40 }}>
            Great job studying {folderName}
          </p>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 40,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                background: "#e8f5e8",
                padding: "20px 30px",
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <div
                style={{ fontSize: 28, fontWeight: "bold", color: "#4CAF50" }}
              >
                {studyStats.correct}
              </div>
              <div style={{ color: "#4CAF50", fontSize: 14 }}>Correct</div>
            </div>
            <div
              style={{
                background: "#ffeaea",
                padding: "20px 30px",
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <div
                style={{ fontSize: 28, fontWeight: "bold", color: "#f44336" }}
              >
                {studyStats.incorrect}
              </div>
              <div style={{ color: "#f44336", fontSize: 14 }}>Incorrect</div>
            </div>
            <div
              style={{
                background: "#e3f2fd",
                padding: "20px 30px",
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <div
                style={{ fontSize: 28, fontWeight: "bold", color: "#2196F3" }}
              >
                {accuracy}%
              </div>
              <div style={{ color: "#2196F3", fontSize: 14 }}>Accuracy</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            <button
              onClick={handleStudyAgain}
              style={{
                background: "#333",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              🔄 Study Again
            </button>
            <button
              onClick={onBack || onExit}
              style={{
                background: "white",
                color: "#333",
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: "12px 24px",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Back to Cards
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: "none",
                border: "none",
                fontSize: 18,
                cursor: "pointer",
                padding: 8,
              }}
            >
              ←
            </button>
          )}
          <div>
            <h1 style={{ margin: 0, fontSize: 24 }}>Studying: {folderName}</h1>
            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>StudyCards</p>
          </div>
        </div>
        <button
          style={{
            background: "none",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
            padding: 8,
          }}
        >
          ⚙️
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 14, color: "#666" }}>Progress</span>
          <span style={{ fontSize: 14, color: "#666" }}>
            {currentIndex + 1} of {cards.length}
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: 8,
            backgroundColor: "#f0f0f0",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: "#333",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Card Display */}
      <div style={{ marginBottom: 40, perspective: "1000px" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "300px",
            transformStyle: "preserve-3d",
            transition: "transform 0.6s",
            transform: showAnswer ? "rotateY(180deg)" : "rotateY(0deg)",
            cursor: "pointer",
          }}
          onClick={handleCardClick}
        >
          {/* Question Side (Front) */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              border: "3px solid #4F8EF7",
              borderRadius: 12,
              padding: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                color: "#4F8EF7",
                fontSize: 14,
                fontWeight: "bold",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Question
            </div>
            <div
              style={{
                fontSize: 24,
                textAlign: "center",
                marginBottom: 30,
                color: "#333",
              }}
            >
              {card.front}
            </div>
            <div
              style={{
                color: "#999",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              Click to reveal answer
            </div>
          </div>

          {/* Answer Side (Back) */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              border: "3px solid #4CAF50",
              borderRadius: 12,
              padding: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                color: "#4CAF50",
                fontSize: 14,
                fontWeight: "bold",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Answer
            </div>
            <div
              style={{
                fontSize: 20,
                textAlign: "center",
                marginBottom: 30,
                color: "#333",
                lineHeight: 1.4,
              }}
            >
              {card.back}
            </div>
            <div
              style={{
                color: "#999",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              Click to go back to question
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {showAnswer ? (
          // Self-assessment buttons when answer is shown
          <>
            <button
              onClick={previousCard}
              disabled={currentIndex === 0}
              style={{
                background: "none",
                border: "none",
                fontSize: 16,
                color: currentIndex === 0 ? "#ccc" : "#666",
                cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                padding: "8px 12px",
              }}
            >
              ← Previous
            </button>

            <button
              onClick={handleIncorrect}
              style={{
                background: "#f44336",
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "10px 20px",
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ✕ Incorrect
            </button>

            <button
              onClick={handleCorrect}
              style={{
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "10px 20px",
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ✓ Correct
            </button>

            <button
              onClick={nextCard}
              disabled={currentIndex + 1 >= cards.length}
              style={{
                background: "none",
                border: "none",
                fontSize: 16,
                color: currentIndex + 1 >= cards.length ? "#ccc" : "#666",
                cursor:
                  currentIndex + 1 >= cards.length ? "not-allowed" : "pointer",
                padding: "8px 12px",
              }}
            >
              Next →
            </button>
          </>
        ) : (
          // Navigation buttons when question is shown
          <>
            <button
              onClick={previousCard}
              disabled={currentIndex === 0}
              style={{
                background: "none",
                border: "none",
                fontSize: 16,
                color: currentIndex === 0 ? "#ccc" : "#666",
                cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                padding: "8px 12px",
              }}
            >
              ← Previous
            </button>

            <span style={{ color: "#666", fontSize: 16, padding: "0 20px" }}>
              {currentIndex + 1} of {cards.length}
            </span>

            <button
              onClick={nextCard}
              disabled={currentIndex + 1 >= cards.length}
              style={{
                background: "none",
                border: "none",
                fontSize: 16,
                color: currentIndex + 1 >= cards.length ? "#ccc" : "#666",
                cursor:
                  currentIndex + 1 >= cards.length ? "not-allowed" : "pointer",
                padding: "8px 12px",
              }}
            >
              Next →
            </button>
          </>
        )}
      </div>

      {/* Exit Study Mode */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={onExit || onBack}
          style={{
            background: "none",
            border: "none",
            color: "#666",
            fontSize: 14,
            cursor: "pointer",
            padding: "8px 16px",
          }}
        >
          Exit Study Mode
        </button>
      </div>
    </div>
  );
}
