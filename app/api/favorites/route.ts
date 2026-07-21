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

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { mangaId, title, coverUrl } = await req.json();
  if (!mangaId || !title) {
    return NextResponse.json({ error: 'mangaId and title are required' }, { status: 400 });
  }

  const favorite = await prisma.favorite.upsert({
    where: { userId_mangaId: { userId, mangaId } },
    update: {},
    create: { userId, mangaId, title, coverUrl },
  });
  return NextResponse.json(favorite);
}

export async function DELETE(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { mangaId } = await req.json();
  await prisma.favorite.deleteMany({ where: { userId, mangaId } });
  return NextResponse.json({ ok: true });
}
