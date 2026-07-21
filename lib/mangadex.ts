import {
  Manga,
  MangaListResponse,
  ChapterListResponse,
  AtHomeResponse,
} from './types';

// All calls go through our own /api/mangadex proxy (see app/api/mangadex/[...path]/route.ts)
// rather than hitting api.mangadex.org directly from the browser.
const PROXY_BASE = '/api/mangadex';

async function proxyFetch<T>(path: string, params?: Record<string, string | string[]>): Promise<T> {
  const search = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        value.forEach((v) => search.append(`${key}[]`, v));
      } else {
        search.set(key, value);
      }
    }
  }
  const qs = search.toString();
  const res = await fetch(`${PROXY_BASE}/${path}${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(`MangaDex request failed: ${res.status}`);
  return res.json();
}

export function coverUrl(mangaId: string, coverFileName: string, size: 256 | 512 | 'original' = 512) {
  const suffix = size === 'original' ? '' : `.${size}.jpg`;
  return `https://uploads.mangadex.org/covers/${mangaId}/${coverFileName}${suffix}`;
}

export function getTitle(manga: Manga): string {
  const attrs = manga.attributes.title;
  return attrs.en ?? Object.values(attrs)[0] ?? 'Untitled';
}

export function getCoverFileName(manga: Manga): string | null {
  const cover = manga.relationships.find((r) => r.type === 'cover_art');
  return (cover?.attributes?.fileName as string) ?? null;
}

export async function searchManga(query: string, limit = 20): Promise<MangaListResponse> {
  return proxyFetch<MangaListResponse>('manga', {
    title: query,
    limit: String(limit),
    'includes[]': 'cover_art',
    'order[relevance]': 'desc',
  });
}

export async function browseManga(opts?: {
  limit?: number;
  offset?: number;
  tags?: string[];
  order?: 'latestUploadedChapter' | 'followedCount' | 'rating';
}): Promise<MangaListResponse> {
  const { limit = 24, offset = 0, tags, order = 'followedCount' } = opts ?? {};
  return proxyFetch<MangaListResponse>('manga', {
    limit: String(limit),
    offset: String(offset),
    'includes[]': 'cover_art',
    [`order[${order}]`]: 'desc',
    ...(tags ? { 'includedTags[]': tags } : {}),
  });
}

export async function getManga(id: string): Promise<{ data: Manga }> {
  return proxyFetch<{ data: Manga }>(`manga/${id}`, { 'includes[]': 'cover_art' });
}

export async function getMangaChapters(
  mangaId: string,
  opts?: { limit?: number; offset?: number; language?: string }
): Promise<ChapterListResponse> {
  const { limit = 100, offset = 0, language = 'en' } = opts ?? {};
  return proxyFetch<ChapterListResponse>(`manga/${mangaId}/feed`, {
    limit: String(limit),
    offset: String(offset),
    'translatedLanguage[]': language,
    'order[chapter]': 'asc',
    'includes[]': 'scanlation_group',
  });
}

export async function getChapter(chapterId: string) {
  return proxyFetch<{ data: any }>(`chapter/${chapterId}`, {
    'includes[]': ['manga', 'scanlation_group'],
  });
}

export async function getAtHomeServer(chapterId: string): Promise<AtHomeResponse> {
  return proxyFetch<AtHomeResponse>(`at-home/server/${chapterId}`);
}

export function chapterPageUrls(athome: AtHomeResponse, quality: 'data' | 'dataSaver' = 'data'): string[] {
  const files = athome.chapter[quality];
  return files.map((f) => `${athome.baseUrl}/${quality}/${athome.chapter.hash}/${f}`);
}

export async function getRandomManga(): Promise<{ data: Manga }> {
  return proxyFetch<{ data: Manga }>('manga/random', { 'includes[]': 'cover_art' });
}
