'use client';

import { worldInfo, World, worldOrder } from '@/data/commands';
import { isWorldUnlocked, Progress } from '@/lib/progress';
import { useLanguage } from '@/lib/i18n';
import PageHeader from '@/components/PageHeader';

type Props = {
  progress: Progress;
  onSelectWorld: (world: World) => void;
  onBack: () => void;
};

export default function WorldSelect({ progress, onSelectWorld, onBack }: Props) {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center gap-8">
      <PageHeader title={t.worlds.title} backLabel={t.worlds.back} onBack={onBack} />

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl list-none">
        {worldOrder.map((world) => {
          const unlocked = isWorldUnlocked(world, progress);
          const result = progress.worlds[world];
          const info = worldInfo[world];

          return (
            <li key={world}>
              <button
                disabled={!unlocked}
                onClick={() => onSelectWorld(world)}
                aria-disabled={!unlocked}
                className={`panel p-5 text-left w-full transition-all duration-150 ${
                  unlocked
                    ? 'hover:border-accent hover:-translate-y-0.5 cursor-pointer'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl" aria-hidden="true">
                    {unlocked ? info.icon : '🔒'}
                  </span>
                  <span className="font-mono text-warning" aria-label={`${result?.stars ?? 0} / 3 stars`}>
                    {'★'.repeat(result?.stars ?? 0)}
                    <span className="text-border">{'★'.repeat(3 - (result?.stars ?? 0))}</span>
                  </span>
                </div>
                <h3 className="font-mono text-lg text-slate-100 mt-3">{info.title[language]}</h3>
                <p className="text-sm text-slate-400 mt-1">{info.description[language]}</p>
                {!unlocked && <p className="text-xs text-danger mt-2 font-mono">{t.worlds.locked}</p>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
