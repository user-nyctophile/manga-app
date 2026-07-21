'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { useLibrary, SavedManga } from './store';

export interface FavoriteItem {
  mangaId: string;
  title: string;
  coverUrl: string | null;
}

export function useFavorites() {
  const { status } = useSession();
  const authed = status === 'authenticated';
  const guestCollections = useLibrary((s) => s.collections);
  const toggleGuestSaved = useLibrary((s) => s.toggleSaved);
  const [serverFavorites, setServerFavorites] = useState<FavoriteItem[] | null>(null);
  const [loading, setLoading] = useState(authed);

  const refresh = useCallback(() => {
    if (!authed) return;
    setLoading(true);
    fetch('/api/favorites')
      .then((r) => r.json())
      .then((data) => setServerFavorites(data))
      .finally(() => setLoading(false));
  }, [authed]);

  useEffect(() => {
    if (authed) refresh();
  }, [authed, refresh]);

  const items: FavoriteItem[] = authed
    ? (serverFavorites ?? []).map((f: any) => ({ mangaId: f.mangaId, title: f.title, coverUrl: f.coverUrl }))
    : Object.values(guestCollections).map((c: SavedManga) => ({ mangaId: c.id, title: c.title, coverUrl: c.coverUrl }));

  const isSaved = (mangaId: string) => items.some((i) => i.mangaId === mangaId);

  async function toggle(manga: { id: string; title: string; coverUrl: string | null }) {
    if (!authed) {
      toggleGuestSaved({ id: manga.id, title: manga.title, coverUrl: manga.coverUrl ?? '' });
      return;
    }
    if (isSaved(manga.id)) {
      await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mangaId: manga.id }),
      });
    } else {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mangaId: manga.id, title: manga.title, coverUrl: manga.coverUrl }),
      });
    }
    refresh();
  }

  return { items, isSaved, toggle, loading: authed && loading };
}
