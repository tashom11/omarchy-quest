'use client';

import { useLanguage } from '@/lib/i18n';

// Footer shown on every screen: makes clear this game is an unofficial
// project, to avoid any confusion with Omarchy's own docs/team.
export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="fixed bottom-0 inset-x-0 z-10 bg-panel/90 backdrop-blur border-t border-border">
      <p className="text-center text-xs text-slate-500 px-4 py-2 max-w-2xl mx-auto">
        {t.footer.text}{' '}
        <a
          href="https://omarchy.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-accentSecondary hover:underline"
        >
          omarchy.org
        </a>
      </p>
    </footer>
  );
}
