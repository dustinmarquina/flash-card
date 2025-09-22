import React from "react";
import { useFlashcards } from "../store/useFlashcards";

interface FolderListScreenProps {
  folders: string[];
  createFolder: (name: string) => void;
  deleteFolder: (id?: number) => void;
  selectFolder: (id: number) => void;
}

export default function FolderListScreen({
  folders,
  createFolder,
  deleteFolder,
  selectFolder,
}: FolderListScreenProps) {
  //   const createFolder = useFlashcards((state) => state.addFolder);
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
