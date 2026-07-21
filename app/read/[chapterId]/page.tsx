'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getAtHomeServer,
  chapterPageUrls,
  getChapter,
  getMangaChapters,
  getManga,
  getTitle,
  getCoverFileName,
  coverUrl,
} from '@/lib/mangadex';
import { useHistory } from '@/lib/useHistory';

export default function ReaderPage() {
  const params = useParams<{ chapterId: string }>();
  const router = useRouter();
  const [pages, setPages] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [siblings, setSiblings] = useState<{ prevId: string | null; nextId: string | null }>({
    prevId: null,
    nextId: null,
  });
  const [context, setContext] = useState<{ mangaId: string; title: string; cover: string; label: string } | null>(
    null
  );
  const { saveProgress } = useHistory();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPage(0);

    async function load() {
      const [athome, chapterRes] = await Promise.all([
        getAtHomeServer(params.chapterId),
        getChapter(params.chapterId),
      ]);
      if (cancelled) return;

      const urls = chapterPageUrls(athome);
      setPages(urls);

      const chapterData = chapterRes.data;
      const mangaRel = chapterData.relationships.find((r: any) => r.type === 'manga');
      const mangaId = mangaRel?.id;
      const label = `Ch. ${chapterData.attributes.chapter ?? '?'}`;

      if (mangaId) {
        const [mangaRes, feedRes] = await Promise.all([
          getManga(mangaId),
          getMangaChapters(mangaId, { limit: 200 }),
        ]);
        if (cancelled) return;

        const manga = mangaRes.data;
        const title = getTitle(manga);
        const fileName = getCoverFileName(manga);
        const cover = fileName ? coverUrl(mangaId, fileName, 256) : '';

        const chapterList = feedRes.data;
        const idx = chapterList.findIndex((c) => c.id === params.chapterId);
        setSiblings({
          prevId: idx > 0 ? chapterList[idx - 1].id : null,
          nextId: idx >= 0 && idx < chapterList.length - 1 ? chapterList[idx + 1].id : null,
        });

        setContext({ mangaId, title, cover, label });
        saveProgress({
          mangaId,
          title,
          coverUrl: cover,
          chapterId: params.chapterId,
          chapterLabel: label,
          page: 0,
        });
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.chapterId]);

  const goToPage = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(pages.length - 1, next));
      setPage(clamped);
      if (context) {
        saveProgress({
          mangaId: context.mangaId,
          title: context.title,
          coverUrl: context.cover,
          chapterId: params.chapterId,
          chapterLabel: context.label,
          page: clamped,
        });
      }
    },
    [pages.length, context, params.chapterId, saveProgress]
  );

  if (loading) return <p className="text-ink/50 text-sm">Loading chapter...</p>;

  return (
    <div className="reader-scope -mx-4 md:-mx-6 px-4 md:px-6 -mt-8 md:-mt-10 pt-6 pb-10 rounded-sm">
      <div className="max-w-2xl mx-auto">
        {context && (
          <div className="flex items-center justify-between mb-4">
            <Link href={`/manga/${context.mangaId}`} className="text-sm text-spine hover:text-spine-dim">
              ← {context.title}
            </Link>
            <span className="text-sm text-paper/50 font-mono">
              {context.label} · {page + 1}/{pages.length}
            </span>
          </div>
        )}

        <div className="rounded-sm overflow-hidden border border-paper/10 bg-reader-panel">
          {pages[page] && <img src={pages[page]} alt={`Page ${page + 1}`} className="w-full" />}
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() =>
              page === 0 && siblings.prevId ? router.push(`/read/${siblings.prevId}`) : goToPage(page - 1)
            }
            disabled={page === 0 && !siblings.prevId}
            className="px-4 py-2 rounded-sm bg-reader-panel border border-paper/10 text-paper disabled:opacity-30 hover:border-spine"
          >
            {page === 0 ? '← Prev Chapter' : '← Prev Page'}
          </button>
          <button
            onClick={() =>
              page === pages.length - 1 && siblings.nextId
                ? router.push(`/read/${siblings.nextId}`)
                : goToPage(page + 1)
            }
            disabled={page === pages.length - 1 && !siblings.nextId}
            className="px-4 py-2 rounded-sm bg-spine hover:bg-spine-dim text-paper font-semibold disabled:opacity-30"
          >
            {page === pages.length - 1 ? 'Next Chapter →' : 'Next Page →'}
          </button>
        </div>
      </div>
    </div>
  );
}
