'use client';

import { Progress } from '@/lib/progress';
import { worldOrder } from '@/data/commands';
import { useLanguage } from '@/lib/i18n';

type Props = {
  progress: Progress;
  ready: boolean;
  onPlay: () => void;
  onChallenge: () => void;
  onReference: () => void;
  onBuild: () => void;
  onReset: () => void;
};

export default function HomeScreen({ progress, ready, onPlay, onChallenge, onReference, onBuild, onReset }: Props) {
  const { t } = useLanguage();
  const completedWorlds = worldOrder.filter((w) => progress.worlds[w]?.complete).length;
  const bestOverallScore = Math.max(0, ...Object.values(progress.worlds).map((r) => r?.bestScore ?? 0));
  const hasPlayed = completedWorlds > 0;
  const hasAnyProgress = hasPlayed || Boolean(progress.build) || progress.streak > 0;

  function handleReset() {
    if (window.confirm(t.home.resetConfirm)) {
      onReset();
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 gap-10">
      <div className="text-center space-y-3">
        <p className="font-mono text-accent text-sm tracking-widest uppercase">{t.home.kicker}</p>
        <h1 className="font-mono text-4xl sm:text-6xl font-bold text-slate-100">
          Omarchy<span className="text-accent">Quest</span>
          <span className="terminal-cursor" aria-hidden="true" />
        </h1>
        <p className="text-slate-400 max-w-md mx-auto">{t.home.subtitle}</p>
      </div>

      <dl className="panel px-6 py-4 flex flex-col sm:flex-row gap-6 text-center font-mono">
        <div>
          <dt className="text-xs text-slate-400 uppercase tracking-wide order-2">{t.home.worldsStat}</dt>
          <dd className="text-2xl text-accent font-bold order-1">{ready ? completedWorlds : '–'}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400 uppercase tracking-wide order-2">{t.home.scoreStat}</dt>
          <dd className="text-2xl text-accentSecondary font-bold order-1">{ready ? bestOverallScore : '–'}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400 uppercase tracking-wide order-2">{t.home.streakStat}</dt>
          <dd className="text-2xl text-warning font-bold order-1">
            {ready ? progress.streak : '–'}
            <span aria-hidden="true">🔥</span>
          </dd>
        </div>
      </dl>

      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={onPlay} className="btn-primary">
          {hasPlayed ? t.home.continueButton : t.home.playButton}
        </button>
        <button onClick={onBuild} className="btn-secondary">
          {t.home.buildButton}
        </button>
        {hasPlayed && (
          <button onClick={onChallenge} className="btn-secondary">
            {t.home.challengeButton}
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 font-mono text-sm">
        <button onClick={onReference} className="text-accentSecondary hover:underline">
          {t.home.referenceButton}
        </button>
        <a
          href="https://omarchy.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-slate-200 hover:underline"
        >
          {t.home.siteButton} ({t.home.officialSource})
        </a>
      </div>

      {ready && hasAnyProgress && (
        <button onClick={handleReset} className="font-mono text-xs text-slate-600 hover:text-danger underline">
          {t.home.resetButton}
        </button>
      )}
    </div>
  );
}
