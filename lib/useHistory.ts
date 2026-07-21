'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { useLibrary } from './store';

export interface HistoryItem {
  mangaId: string;
  title: string;
  coverUrl: string | null;
  chapterId: string;
  chapterLabel: string;
  page: number;
  updatedAt: number;
}

export function useHistory() {
  const { status } = useSession();
  const authed = status === 'authenticated';
  const guestHistory = useLibrary((s) => s.continueReading);
  const updateGuestProgress = useLibrary((s) => s.updateProgress);
  const [serverHistory, setServerHistory] = useState<HistoryItem[] | null>(null);

  const refresh = useCallback(() => {
    if (!authed) return;
    fetch('/api/history')
      .then((r) => r.json())
      .then((data: any[]) =>
        setServerHistory(
          data.map((h) => ({
            mangaId: h.mangaId,
            title: h.title,
            coverUrl: h.coverUrl,
            chapterId: h.chapterId,
            chapterLabel: h.chapterLabel,
            page: h.page,
            updatedAt: new Date(h.updatedAt).getTime(),
          }))
        )
      );
  }, [authed]);

  useEffect(() => {
    if (authed) refresh();
  }, [authed, refresh]);

  const items: HistoryItem[] = authed
    ? serverHistory ?? []
    : Object.values(guestHistory).map((h) => ({ ...h, coverUrl: h.coverUrl || null }));

  async function saveProgress(entry: Omit<HistoryItem, 'updatedAt'>) {
    if (!authed) {
      updateGuestProgress({ ...entry, coverUrl: entry.coverUrl ?? '', updatedAt: Date.now() });
      return;
    }
    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    refresh();
  }

  return { items: items.sort((a, b) => b.updatedAt - a.updatedAt), saveProgress };
}
