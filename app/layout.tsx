import type { Metadata } from 'next';
import './globals.css';

// Set NEXT_PUBLIC_SITE_URL at build time (see README) to get correct
// canonical / Open Graph URLs once the game is deployed.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
const title = 'Omarchy Quest — Learn Omarchy commands by playing';
const description =
  'A quiz and command-building game to learn the keyboard shortcuts and CLI commands of Omarchy (Arch Linux + Hyprland). Free, open source, no account needed.';

export const metadata: Metadata = {
  // Origin only (no basePath). Next resolves the auto-discovered
  // opengraph-image/icon file routes as `${basePath}/route` and joins that
  // onto metadataBase: with a GitHub Pages deploy, basePath already equals
  // this site's path segment, so a metadataBase that also included it (as
  // `siteUrl` does below) produced a duplicated path — .../omarchy-quest
  // /omarchy-quest/opengraph-image, a 404. `alternates.canonical` below
  // uses the full `siteUrl` explicitly instead of relying on metadataBase.
  metadataBase: new URL(new URL(siteUrl).origin),
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
  alternates: { canonical: siteUrl },
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

// Best-effort Content-Security-Policy via <meta>: this is a static export
// with no server, so real CSP HTTP headers (or X-Frame-Options / a
// frame-ancestors directive, which browsers ignore when set via <meta>)
// aren't available — GitHub Pages serves files as-is. `unsafe-inline` is
// required for both script-src and style-src because Next's static export
// hydrates via an inline RSC payload script and React sets some inline
// `style` attributes; there is no per-request nonce to use instead in a
// prebuilt static file. What this CSP still meaningfully buys: no
// externally-hosted script/style/image can be injected and loaded, no
// exfiltration via fetch/XHR/WebSocket to a third-party origin, no
// <object>/<embed> plugin execution, and no cross-origin form submission.
// Caveat: a meta-tag CSP only governs content parsed *after* it in the
// document, and the App Router always emits a handful of its own
// same-origin <script src> tags earlier in <head> (outside our control
// here) — harmless since script-src 'self' would allow them anyway, but
// worth knowing this isn't equivalent to a real Content-Security-Policy
// HTTP header covering the entire response.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: LanguageProvider intentionally overwrites
    // `lang` on the client once the stored preference loads from
    // localStorage, so a mismatch with this server-rendered default is
    // expected, not a bug.
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={csp} />
      </head>
      <body>
        <script
          id="structured-data"
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
        />
        {children}
      </body>
    </html>
  );
}
