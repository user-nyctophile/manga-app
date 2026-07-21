'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useFavorites } from '@/lib/useFavorites';
import { useHistory } from '@/lib/useHistory';

export default function CollectionsPage() {
  const { status } = useSession();
  const [tab, setTab] = useState<'favorites' | 'history'>('favorites');
  const { items: favorites } = useFavorites();
  const { items: history } = useHistory();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-display font-bold text-ink">Your Library</h1>
      </div>
      {status !== 'authenticated' && (
        <p className="text-sm text-ink/50 mb-6">
          Saved on this device only.{' '}
          <Link href="/register" className="text-spine font-semibold hover:underline">
            Create an account
          </Link>{' '}
          to keep it on every device.
        </p>
      )}

      <div className="flex gap-1 mb-6 border-b border-line">
        {(['favorites', 'history'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${
              tab === t ? 'border-spine text-spine' : 'border-transparent text-ink/50'
            }`}
          >
            {t === 'favorites' ? `Favorites (${favorites.length})` : `History (${history.length})`}
          </button>
        ))}
      </div>

      {tab === 'favorites' ? (
        favorites.length === 0 ? (
          <p className="text-ink/50 text-sm">
            Nothing saved yet. Open a manga and hit &ldquo;Add to Favorites&rdquo;.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {favorites.map((item) => (
              <Link key={item.mangaId} href={`/manga/${item.mangaId}`} className="group block">
                <div className="relative aspect-[2/3] rounded-sm overflow-hidden bg-panel border border-line">
                  {item.coverUrl && (
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm text-ink/90 line-clamp-2 font-medium">{item.title}</p>
              </Link>
            ))}
          </div>
        )
      ) : history.length === 0 ? (
        <p className="text-ink/50 text-sm">No reading history yet.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {history.map((item) => (
            <a key={item.mangaId} href={`/read/${item.chapterId}`} className="group block">
              <div className="relative aspect-[2/3] rounded-sm overflow-hidden bg-panel border border-line">
                {item.coverUrl && (
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                  />
                )}
                <div className="absolute bottom-1.5 right-1.5 bg-ink/80 text-paper text-[10px] font-mono px-1.5 py-0.5 rounded-sm">
                  p.{item.page + 1}
                </div>
              </div>
              <p className="mt-2 text-sm text-ink/90 line-clamp-1 font-medium">{item.title}</p>
              <p className="text-xs text-ink/40 font-mono">{item.chapterLabel}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
