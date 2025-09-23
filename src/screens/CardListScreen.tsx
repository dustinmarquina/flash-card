import React, { useState } from "react";
import { ArrowLeft, Settings, Play, Plus, Trash2 } from "lucide-react";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
  folderName?: string;
  onBack?: () => void;
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
  folderName = "Study Set",
  onBack,
}: CardListScreenProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);

  const handleAddCard = (e: React.FormEvent) => {
    addCard(e);
    setIsAddingCard(false);
  };

  const handleCancel = () => {
    setFront("");
    setBack("");
    setIsAddingCard(false);
  };

  return (
    <div className="container max-w-3xl mx-auto p-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 mb-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-xl font-semibold leading-none">{folderName}</h1>
            <p className="text-sm text-muted-foreground">StudyCards</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Ready to Study */}
      <div className="rounded-2xl p-6 mb-6 text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Ready to study?</h2>
          <p className="opacity-90">
            {cards.length} card{cards.length !== 1 ? "s" : ""} waiting for you
          </p>
        </div>
        <Button
          onClick={startStudy}
          disabled={cards.length === 0}
          className="bg-white text-indigo-600 hover:bg-white/90"
        >
          <Play className="h-4 w-4 mr-2" /> Start Study
        </Button>
      </div>

      {/* Add New Card */}
      {!isAddingCard ? (
        <button
          className="w-full py-12 border-2 border-dashed rounded-xl text-muted-foreground hover:text-foreground hover:border-foreground/40 transition grid place-items-center mb-6"
          onClick={() => setIsAddingCard(true)}
        >
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            <span>Add New Card</span>
          </div>
        </button>
      ) : (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Front</label>
                <Input
                  placeholder="Enter the question or term"
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Back</label>
                <Input
                  placeholder="Enter the answer or definition"
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={!front.trim() || !back.trim()}>
                  Add Card
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Cards List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Cards ({cards.length})</h2>

        {cards.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <div className="text-base mb-2">No cards yet</div>
            <div className="text-sm">Add your first card to get started!</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {cards.map((card) => (
              <Card key={card.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                        Front
                      </div>
                      <div className="text-base bg-muted/40 rounded-md px-3 py-2">
                        {card.front}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                        Back
                      </div>
                      <div className="text-base bg-muted/40 rounded-md px-3 py-2">
                        {card.back || "…"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
                    <div className="flex gap-6">
                      <span>75% accuracy (4 reviews)</span>
                      <span>Last reviewed: 9/23/2025</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this card?")
                        ) {
                          deleteCard(card.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
