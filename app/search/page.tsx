'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchManga } from '@/lib/mangadex';
import { MangaGrid } from '@/components/MangaGrid';
import { Manga } from '@/lib/types';

function SearchInner() {
  const params = useSearchParams();
  const router = useRouter();
  const initialQuery = params.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialQuery) return;
    setLoading(true);
    searchManga(initialQuery)
      .then((res) => setMangaList(res.data))
      .finally(() => setLoading(false));
  }, [initialQuery]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-6 text-ink">Search</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search manga..."
          className="flex-1 bg-panel border border-line rounded-sm px-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:border-spine"
        />
        <button
          type="submit"
          className="bg-spine hover:bg-spine-dim text-paper font-semibold px-6 rounded-sm transition-colors"
        >
          Search
        </button>
      </form>
      {loading ? (
        <p className="text-ink/50 text-sm">Searching...</p>
      ) : (
        <MangaGrid mangaList={mangaList} />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-ink/50 text-sm">Loading...</p>}>
      <SearchInner />
    </Suspense>
  );
}
