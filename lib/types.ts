export interface MangaAttributes {
  title: Record<string, string>;
  description: Record<string, string>;
  status: string;
  tags: { attributes: { name: Record<string, string> } }[];
  year?: number;
}

export interface RelatedItem {
  id: string;
  type: string;
  attributes?: Record<string, any>;
}

export interface Manga {
  id: string;
  type: 'manga';
  attributes: MangaAttributes;
  relationships: RelatedItem[];
}

export interface ChapterAttributes {
  title: string | null;
  chapter: string | null;
  volume: string | null;
  translatedLanguage: string;
  publishAt: string;
  pages: number;
}

export interface Chapter {
  id: string;
  type: 'chapter';
  attributes: ChapterAttributes;
  relationships: RelatedItem[];
}

export interface AtHomeResponse {
  baseUrl: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}

export interface MangaListResponse {
  data: Manga[];
  total: number;
}

export interface ChapterListResponse {
  data: Chapter[];
  total: number;
}
