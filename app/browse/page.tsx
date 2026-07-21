'use client';

import { useEffect, useState } from 'react';
import { browseManga } from '@/lib/mangadex';
import { MangaGrid } from '@/components/MangaGrid';
import { Manga } from '@/lib/types';

const ORDERS = [
  { key: 'followedCount', label: 'Popular' },
  { key: 'latestUploadedChapter', label: 'Latest Updates' },
  { key: 'rating', label: 'Top Rated' },
] as const;

export default function BrowsePage() {
  const [order, setOrder] = useState<(typeof ORDERS)[number]['key']>('followedCount');
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    browseManga({ order, limit: 24 })
      .then((res) => setMangaList(res.data))
      .finally(() => setLoading(false));
  }, [order]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-display font-bold text-ink">Browse</h1>
        <div className="flex gap-1 -mx-1 overflow-x-auto">
          {ORDERS.map((o) => (
            <button
              key={o.key}
              onClick={() => setOrder(o.key)}
              className={`shrink-0 px-3 py-1.5 rounded-sm text-sm mx-1 ${
                order === o.key ? 'bg-spine text-paper font-semibold' : 'text-ink/60 hover:bg-panel'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <p className="text-ink/50 text-sm">Loading...</p>
      ) : (
        <MangaGrid mangaList={mangaList} />
      )}
    </div>
  );
}
