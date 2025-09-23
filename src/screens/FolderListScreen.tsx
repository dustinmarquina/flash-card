import React, { useEffect, useMemo, useState } from "react";
import { useFlashcards } from "../store/useFlashcards";
import { db } from "../db/db";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface FolderListScreenProps {
  //   folders: { id?: number; name: string }[];
  createFolder: (name: string) => void;
  deleteFolder: (id?: number) => void;
  selectFolder: (id: number) => void;
}

export default function FolderListScreen({
  //   folders,
  createFolder,
  //   deleteFolder,
  selectFolder,
}: FolderListScreenProps) {
  // store selectors
  const folders = useFlashcards((s) => s.folders);
  const loadFolders = useFlashcards((s) => s.loadFolders);
  const addFolder = useFlashcards((s) => s.addFolder);
  const deleteFolder = () => {};
  const setCurrentFolderId = useFlashcards((s) => s.setCurrentFolderId);
  const setScreen = useFlashcards((s) => s.setScreen);

  // local UI state
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  // load folders once
  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  // compute card counts per folder (lightweight, no store changes)
  const [counts, setCounts] = useState<Record<number, number>>({});
  useEffect(() => {
    let mounted = true;
    (async () => {
      const next: Record<number, number> = {};
      for (const f of folders) {
        if (f.id == null) continue;
        const c = await db.cards.where("folderId").equals(f.id).count();
        next[f.id] = c;
      }
      if (mounted) setCounts(next);
    })();
    return () => {
      mounted = false;
    };
  }, [folders]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addFolder(name.trim());
    setName("");
    setCreating(false);
  };

  const goToFolder = (id: number) => {
    console.log("Navigating to folder ID:", id);
    setCurrentFolderId(id);
    setScreen("cards");
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold leading-none">Study Sets</h1>
          <p className="text-sm text-muted-foreground mt-1">StudyCards</p>
        </div>

        {/* Create box */}
        <div className="mb-8">
          {!creating ? (
            <button
              onClick={() => setCreating(true)}
              className="w-full py-12 border border-dashed rounded-xl text-muted-foreground hover:text-foreground hover:border-foreground/40 transition grid place-items-center"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">+</span>
                <span>Create New Study Set</span>
              </div>
            </button>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <form
                  onSubmit={handleCreate}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Input
                    autoFocus
                    placeholder="Folder name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button type="submit">Create</Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setName("");
                        setCreating(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Folders grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((f) => {
            const count =
              f.id != null && counts[f.id] != null ? counts[f.id] : 0;
            return (
              <Card
                key={f.id ?? f.name}
                className="relative overflow-hidden hover:shadow-md transition cursor-pointer"
                onClick={() => f.id != null && selectFolder(f.id)}
              >
                {/* left accent */}
                <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-base leading-tight">
                    {f.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="i-lucide-files text-base" />
                    <span>
                      {count} {count === 1 ? "card" : "cards"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="i-lucide-calendar text-base" />
                    <span>Last studied: Never</span>
                  </div>

                  <div className="border-t mt-3 pt-3">
                    <p className="text-xs uppercase tracking-wide mb-1">
                      Recent cards:
                    </p>
                    <p className="text-foreground/80 line-clamp-2">
                      {/* You can hydrate with a real preview later */}
                      Tap to view cards in this set.
                    </p>
                  </div>

                  <div className="pt-3">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        // if (f.id != null) deleteFolder(f.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
