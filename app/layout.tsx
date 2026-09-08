import type { Metadata } from 'next';
import './globals.css';

// Set NEXT_PUBLIC_SITE_URL at build time (see README) to get correct
// canonical / Open Graph URLs once the game is deployed.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
const title = 'Omarchy Quest — Learn Omarchy commands by playing';
const description =
  'A quiz and command-building game to learn the keyboard shortcuts and CLI commands of Omarchy (Arch Linux + Hyprland). Free, open source, no account needed.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    'Omarchy',
    'Hyprland',
    'Arch Linux',
    'keyboard shortcuts',
    'CLI commands',
    'learning game',
    'quiz',
    'dotfiles',
  ],
  authors: [{ name: 'Omarchy Quest contributors' }],
  applicationName: 'Omarchy Quest',
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title,
    description,
    siteName: 'Omarchy Quest',
    locale: 'en_US',
    alternateLocale: ['fr_FR'],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

// Structured data (schema.org) so search engines and AI answer engines can
// understand what this page is without guessing from layout alone.
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Game',
  name: 'Omarchy Quest',
  description,
  url: siteUrl,
  genre: 'Educational',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any (web browser)',
  inLanguage: ['en', 'fr'],
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: LanguageProvider intentionally overwrites
    // `lang` on the client once the stored preference loads from
    // localStorage, so a mismatch with this server-rendered default is
    // expected, not a bug.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
