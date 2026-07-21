'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Search, BookMarked } from 'lucide-react';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/browse', label: 'Browse', icon: Compass },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/collections', label: 'Library', icon: BookMarked },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-panel border-t border-line safe-bottom">
      <div className="grid grid-cols-4">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                active ? 'text-spine' : 'text-ink/50'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
