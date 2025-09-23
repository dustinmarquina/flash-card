# 📚 Flashcards App

A simple **Progressive Web App (PWA)** built with **React, Vite, TailwindCSS, and shadcn/ui** for studying with flashcards.  
Supports offline use with IndexedDB for persistent storage.

---

## ✨ Features
- 📁 Create, view, and delete **folders (study sets)**
- 📝 Add, edit, and delete **cards** within a folder
- 🔄 Study mode with card flipping
- 📊 Track card statistics (accuracy, last reviewed) *(placeholder for now)*
- 💾 Offline support via **IndexedDB** and **service worker caching**
- 🎨 Styled with **TailwindCSS + shadcn/ui** components  

---

## 🛠️ Tech Stack
- **React 18** + **Vite** ⚡  
- **TailwindCSS v4** + **shadcn/ui** 🎨  
- **Zustand** for state management 🐻  
- **Dexie.js (IndexedDB)** for local storage 🗄️  
- **Workbox** for PWA service worker ⚙️  

---

## 📂 Project Structure
src/
├── components/       # shadcn/ui components
├── screens/          # Screens (FolderList, CardList, Study)
├── store/            # Zustand store (useFlashcards)
├── db/               # Dexie IndexedDB setup
├── App.tsx           # Root component
└── main.tsx          # Vite entry

📱 PWA Support
	•	Works offline (service worker + cache)
	•	Installable on mobile/desktop
	•	Data stored in IndexedDB, so your sets/cards stay saved
  
Folder List Screen
	•	Create new study sets
	•	See all folders with card counts
<img width="862" height="622" alt="image" src="https://github.com/user-attachments/assets/d5d5878a-41f2-46f1-92fa-7ecfdeec5642" />

Card List Screen
	•	Add new cards
	•	View/edit/delete cards
	•	Start study session
<img width="710" height="891" alt="image" src="https://github.com/user-attachments/assets/07627044-db3f-47ae-baf9-7234a1db3bea" />

Study Screen
	•	Flip cards to test yourself
	•	Track progress
<img width="876" height="696" alt="image" src="https://github.com/user-attachments/assets/e7bceb44-dc95-48ff-8ba4-9d961de044ef" />
