'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getRandomManga } from '@/lib/mangadex';
import { useHistory } from '@/lib/useHistory';

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loadingRandom, setLoadingRandom] = useState(false);
  const { items: history } = useHistory();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  async function handleSurpriseMe() {
    setLoadingRandom(true);
    try {
      const { data } = await getRandomManga();
      router.push(`/manga/${data.id}`);
    } finally {
      setLoadingRandom(false);
    }
  }

  return (
    <div className="space-y-14 md:space-y-16">
      <section className="text-center py-6 md:py-10">
        <p className="font-mono text-xs tracking-[0.2em] text-spine mb-3 uppercase">Powered by MangaDex</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 text-ink leading-tight">
          Discover your next <span className="text-spine">obsession</span>
        </h1>
        <p className="text-ink/60 mb-8 max-w-md mx-auto">
          Thousands of titles, updated daily. Pick up exactly where you left off.
        </p>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
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
        <button
          onClick={handleSurpriseMe}
          disabled={loadingRandom}
          className="mt-6 text-spine hover:text-spine-dim text-sm font-medium font-mono"
        >
          {loadingRandom ? 'Finding something...' : '⚡ Surprise me'}
        </button>
      </section>

      {history.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-4 border-l-4 border-spine pl-3 text-ink">
            Continue Reading{' '}
            <span className="text-ink/40 text-base font-body font-normal">{history.length} manga</span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {history.map((entry) => (
              <a key={entry.mangaId} href={`/read/${entry.chapterId}`} className="group block">
                <div className="relative aspect-[2/3] rounded-sm overflow-hidden bg-panel border border-line">
                  {entry.coverUrl && (
                    <img
                      src={entry.coverUrl}
                      alt={entry.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                    />
                  )}
                  {/* real progress marker — actual last-read page, not a fabricated percentage */}
                  <div className="absolute bottom-1.5 right-1.5 bg-ink/80 text-paper text-[10px] font-mono px-1.5 py-0.5 rounded-sm">
                    p.{entry.page + 1}
                  </div>
                </div>
                <p className="mt-2 text-sm text-ink/90 line-clamp-1 font-medium">{entry.title}</p>
                <p className="text-xs text-ink/40 font-mono">{entry.chapterLabel}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
