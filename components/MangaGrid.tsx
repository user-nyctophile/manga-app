import { Manga } from '@/lib/types';
import { MangaCard } from './MangaCard';

export function MangaGrid({ mangaList }: { mangaList: Manga[] }) {
  if (mangaList.length === 0) {
    return <p className="text-ink/50 text-sm">Nothing here yet.</p>;
  }
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {mangaList.map((manga) => (
        <MangaCard key={manga.id} manga={manga} />
      ))}
    </div>
  );
}
