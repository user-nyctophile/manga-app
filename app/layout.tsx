import type { Metadata } from 'next';
import { Shippori_Mincho, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { MobileTopBar } from '@/components/MobileTopBar';
import { BottomNav } from '@/components/BottomNav';
import { Providers } from '@/components/Providers';

const display = Shippori_Mincho({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
});
const body = Inter({ subsets: ['latin'], variable: '--font-body' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'manga.',
  description: 'Browse and read manga, powered by MangaDex.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-paper font-body">
        <Providers>
          <Header />
          <MobileTopBar />
          <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 pb-24 md:pb-10">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
