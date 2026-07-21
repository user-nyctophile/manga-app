import { NextRequest, NextResponse } from 'next/server';

const MANGADEX_BASE = 'https://api.mangadex.org';

// MangaDex's browser CORS policy blocks direct client-side calls, and
// funneling everything through one route lets us cache + rate-limit
// in a single place instead of scattering fetches across the app.
export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const search = req.nextUrl.search;
  const url = `${MANGADEX_BASE}/${path}${search}`;

  try {
    const upstream = await fetch(url, {
      headers: { 'User-Agent': 'manga-app (personal, non-commercial)' },
      // Metadata barely changes; cache for 5 min to stay well inside rate limits.
      next: { revalidate: 300 },
    });

    const body = await upstream.text();

    return new NextResponse(body, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Upstream MangaDex request failed' },
      { status: 502 }
    );
  }
}
