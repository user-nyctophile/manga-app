import Link from 'next/link';
import { Manga } from '@/lib/types';
import { getTitle, getCoverFileName, coverUrl } from '@/lib/mangadex';

export function MangaCard({ manga }: { manga: Manga }) {
  const fileName = getCoverFileName(manga);
  const src = fileName ? coverUrl(manga.id, fileName, 256) : null;
  const title = getTitle(manga);
  const status = manga.attributes.status;

  return (
    <Link href={`/manga/${manga.id}`} className="group block">
      <div className="relative aspect-[2/3] rounded-sm overflow-hidden bg-panel border border-line shadow-sm">
        {src ? (
          <img
            src={src}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/40 text-sm p-2 text-center font-display">
            {title}
          </div>
        )}
        {/* spine tab — the app's signature corner accent, standing in for a status flag */}
        {status === 'ongoing' && (
          <span className="absolute top-0 right-2 bg-spine text-paper text-[10px] font-mono font-semibold px-1.5 py-1 rounded-b-sm shadow">
            NEW
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent h-14 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="mt-2 text-sm text-ink/90 leading-snug line-clamp-2 font-medium">{title}</p>
    </Link>
  );
}
