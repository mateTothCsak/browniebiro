import type { Metadata } from 'next';
import { Fraunces, Figtree, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://browniebiro.vercel.app';
const TITLE = 'BrownieBíró';
const DESCRIPTION = 'Értékeld és fedezd fel Magyarország legjobb Burger King brownie-jait. Nem hivatalos Burger King brownie rajongói oldal · független értékelések.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
    siteName: 'BrownieBíró',
    locale: 'hu_HU',
    type: 'website',
    images: [{ url: '/api/card', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/api/card'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="hu"
      className={`${fraunces.variable} ${figtree.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
