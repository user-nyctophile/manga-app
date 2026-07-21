import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedManga {
  id: string;
  title: string;
  coverUrl: string;
}

export interface ReadingProgress {
  mangaId: string;
  title: string;
  coverUrl: string;
  chapterId: string;
  chapterLabel: string;
  page: number;
  updatedAt: number;
}

interface LibraryState {
  collections: Record<string, SavedManga>; // keyed by manga id
  continueReading: Record<string, ReadingProgress>; // keyed by manga id
  toggleSaved: (manga: SavedManga) => void;
  isSaved: (mangaId: string) => boolean;
  updateProgress: (progress: ReadingProgress) => void;
  removeProgress: (mangaId: string) => void;
}

export const useLibrary = create<LibraryState>()(
  persist(
    (set, get) => ({
      collections: {},
      continueReading: {},
      toggleSaved: (manga) =>
        set((state) => {
          const next = { ...state.collections };
          if (next[manga.id]) {
            delete next[manga.id];
          } else {
            next[manga.id] = manga;
          }
          return { collections: next };
        }),
      isSaved: (mangaId) => !!get().collections[mangaId],
      updateProgress: (progress) =>
        set((state) => ({
          continueReading: { ...state.continueReading, [progress.mangaId]: progress },
        })),
      removeProgress: (mangaId) =>
        set((state) => {
          const next = { ...state.continueReading };
          delete next[mangaId];
          return { continueReading: next };
        }),
    }),
    { name: 'manga-app-library' }
  )
);
