'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Search, UserCircle2 } from 'lucide-react';

export function MobileTopBar() {
  const { data: session, status } = useSession();

  return (
    <header className="md:hidden sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-line">
      <div className="px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-bold text-ink">
          manga<span className="text-spine">.</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/search" aria-label="Search" className="text-ink/70">
            <Search size={20} />
          </Link>
          <Link
            href={status === 'authenticated' ? '/collections' : '/login'}
            aria-label="Account"
            className="text-ink/70"
          >
            {status === 'authenticated' ? (
              <span className="w-7 h-7 rounded-full bg-spine text-paper text-xs font-bold flex items-center justify-center font-mono">
                {(session.user?.name || session.user?.email || '?')[0].toUpperCase()}
              </span>
            ) : (
              <UserCircle2 size={22} />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
