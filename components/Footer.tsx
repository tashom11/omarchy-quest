'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n';

// Footer shown on every screen: makes clear this game is an unofficial
// project, to avoid any confusion with Omarchy's own docs/team.
export default function Footer() {
  const { t } = useLanguage();
  const footerRef = useRef<HTMLElement | null>(null);

  // The footer's text length (and therefore line-wrapped height) varies by
  // language and viewport width — the French disclaimer is noticeably
  // longer than the English one. Rather than reserving a fixed amount of
  // body padding that could be too small on a narrow viewport in French
  // (re-creating the exact overlap bug once fixed for the language
  // selector, just against page content this time), measure the real
  // height and expose it as a CSS variable the body's padding reads.
  useEffect(() => {
    const el = footerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty('--footer-height', `${entry.contentRect.height}px`);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="fixed bottom-0 inset-x-0 z-10 bg-panel/90 backdrop-blur border-t border-border">
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
