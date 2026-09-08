'use client';

import { useLanguage } from '@/lib/i18n';

type Props = {
  score: number;
  maxScore: number;
  stars: 0 | 1 | 2 | 3;
  title: string; // already localized by the caller (world name, "Daily challenge", etc.)
  onReplay: () => void;
  onMenu: () => void;
};

export default function ResultScreen({ score, maxScore, stars, title, onReplay, onMenu }: Props) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 gap-8">
      <p className="font-mono text-accent text-sm tracking-widest uppercase">
        {title} — {t.result.done}
      </p>

      <div className="text-5xl flex gap-2" aria-label={`${stars} / 3 stars`}>
        {[0, 1, 2].map((i) => (
          <span key={i} aria-hidden="true" className={i < stars ? 'text-warning' : 'text-border'}>
            ★
          </span>
        ))}
      </div>

      <div className="panel px-8 py-6 text-center">
        <p className="font-mono text-4xl text-slate-100 font-bold">{score}</p>
        <p className="text-sm text-slate-400">
          / {maxScore} {t.result.possiblePoints}
        </p>
      </div>

      <p className="text-slate-300 max-w-md text-center">{t.result.messages[stars]}</p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={onReplay} className="btn-primary">
          {t.result.replay}
        </button>
        <button onClick={onMenu} className="btn-secondary">
          {t.result.menu}
        </button>
      </div>
    </div>
  );
}
