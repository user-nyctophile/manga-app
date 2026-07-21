'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getManga, getMangaChapters, getTitle, getCoverFileName, coverUrl } from '@/lib/mangadex';
import { Manga, Chapter } from '@/lib/types';
import { useFavorites } from '@/lib/useFavorites';

export default function MangaDetailPage() {
  const params = useParams<{ id: string }>();
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSaved, toggle } = useFavorites();

  useEffect(() => {
    setLoading(true);
    Promise.all([getManga(params.id), getMangaChapters(params.id)])
      .then(([mangaRes, chapterRes]) => {
        setManga(mangaRes.data);
        setChapters(chapterRes.data);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading || !manga) {
    return (
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        <div className="aspect-[2/3] bg-panel rounded-sm" />
        <div className="space-y-3">
          <div className="h-8 bg-panel rounded-sm w-2/3" />
          <div className="h-4 bg-panel rounded-sm w-full" />
          <div className="h-4 bg-panel rounded-sm w-5/6" />
        </div>
      </div>
    );
  }

  const title = getTitle(manga);
  const fileName = getCoverFileName(manga);
  const cover = fileName ? coverUrl(manga.id, fileName, 512) : null;
  const description = manga.attributes.description.en ?? Object.values(manga.attributes.description)[0] ?? '';
  const saved = isSaved(manga.id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
      <div>
        <div className="relative aspect-[2/3] rounded-sm overflow-hidden bg-panel border border-line mb-4 shadow-sm">
          {cover && <img src={cover} alt={title} className="w-full h-full object-cover" />}
        </div>
        <button
          onClick={() => toggle({ id: manga.id, title, coverUrl: cover })}
          className={`w-full py-2.5 rounded-sm font-semibold transition-colors ${
            saved ? 'bg-panel border border-spine text-spine' : 'bg-spine hover:bg-spine-dim text-paper'
          }`}
        >
          {saved ? '✓ In Favorites' : '+ Add to Favorites'}
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-display font-bold mb-2 text-ink">{title}</h1>
        <div className="flex gap-2 flex-wrap mb-4">
          {manga.attributes.tags.slice(0, 6).map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-panel border border-line rounded-full px-3 py-1 text-ink/60 font-mono"
            >
              {tag.attributes.name.en}
            </span>
          ))}
        </div>
        <p className="text-ink/70 leading-relaxed mb-8 whitespace-pre-line line-clamp-6">{description}</p>

        <h2 className="text-xl font-display font-bold mb-3 text-ink">Chapters</h2>
        <div className="border border-line rounded-sm divide-y divide-line max-h-[500px] overflow-y-auto bg-panel">
          {chapters.length === 0 && (
            <p className="p-4 text-sm text-ink/50">No English chapters found.</p>
          )}
          {chapters.map((ch) => (
            <Link
              key={ch.id}
              href={`/read/${ch.id}`}
              className="flex justify-between items-center px-4 py-3 hover:bg-paper transition-colors"
            >
              <span className="text-sm text-ink">
                {ch.attributes.volume ? `Vol. ${ch.attributes.volume} ` : ''}
                Ch. {ch.attributes.chapter ?? '?'} {ch.attributes.title ? `— ${ch.attributes.title}` : ''}
              </span>
              <span className="text-xs text-ink/40 font-mono">
                {new Date(ch.attributes.publishAt).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
