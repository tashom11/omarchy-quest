'use client';

import { commandsByWorld, worldInfo, worldOrder } from '@/data/commands';
import { useLanguage } from '@/lib/i18n';
import PageHeader from '@/components/PageHeader';

type Props = {
  onBack: () => void;
};

// Reference view: every command in the game, grouped by world, freely
// browsable without playing (no timer, no score).
export default function CommandReference({ onBack }: Props) {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center gap-8">
      <PageHeader title={t.reference.title} backLabel={t.reference.back} onBack={onBack} />

      <p className="text-slate-400 text-sm max-w-2xl text-center">{t.reference.subtitle}</p>

      <div className="w-full max-w-3xl flex flex-col gap-8">
        {worldOrder.map((world) => {
          const info = worldInfo[world];
          const items = commandsByWorld(world);

          return (
            <section key={world} className="panel p-5" aria-labelledby={`world-${world}-heading`}>
              <h3 id={`world-${world}-heading`} className="font-mono text-lg text-slate-100 flex items-center gap-2 mb-4">
                <span className="text-2xl" aria-hidden="true">
                  {info.icon}
                </span>
                {info.title[language]}
              </h3>
              <ul className="flex flex-col gap-3">
                {items.map((cmd) => (
                  <li key={cmd.id} className="border-t border-border pt-3 first:border-0 first:pt-0">
                    <p className="text-sm text-slate-300">{cmd.prompt[language]}</p>
                    <p className="font-mono text-accent mt-1">{cmd.answer}</p>
                    <p className="text-xs text-slate-500 mt-1">{cmd.explanation[language]}</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
