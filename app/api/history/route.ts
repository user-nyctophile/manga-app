import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.id as string | undefined;
}

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const history = await prisma.historyEntry.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(history);
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { mangaId, title, coverUrl, chapterId, chapterLabel, page } = await req.json();
  if (!mangaId || !chapterId) {
    return NextResponse.json({ error: 'mangaId and chapterId are required' }, { status: 400 });
  }

  const entry = await prisma.historyEntry.upsert({
    where: { userId_mangaId: { userId, mangaId } },
    update: { title, coverUrl, chapterId, chapterLabel, page },
    create: { userId, mangaId, title, coverUrl, chapterId, chapterLabel, page },
  });
  return NextResponse.json(entry);
}
