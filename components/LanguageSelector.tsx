'use client';

import { useLanguage } from '@/lib/i18n';

// FR/EN toggle, placed in a top bar within the normal document flow (not
// position: fixed) so it never overlaps page content, including on mobile.
export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="w-full flex justify-end px-4 py-3">
      <div className="flex font-mono text-xs rounded-lg border border-border overflow-hidden" role="group" aria-label="Language">
        <button
          onClick={() => setLanguage('fr')}
          aria-pressed={language === 'fr'}
          lang="fr"
          className={`px-3 py-1.5 transition-colors ${
            language === 'fr' ? 'bg-accent text-background font-bold' : 'bg-panel text-slate-400 hover:text-slate-200'
          }`}
        >
          FR
        </button>
        <button
          onClick={() => setLanguage('en')}
          aria-pressed={language === 'en'}
          lang="en"
          className={`px-3 py-1.5 transition-colors ${
            language === 'en' ? 'bg-accent text-background font-bold' : 'bg-panel text-slate-400 hover:text-slate-200'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}
