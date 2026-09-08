'use client';

type Props = {
  title: string;
  backLabel: string;
  onBack: () => void;
};

// Shared header for secondary screens: back button, centered title, and a
// same-width spacer so the title stays visually centered. Uses a CSS grid
// (auto / 1fr / auto) rather than flex + justify-between, so the back
// button never wraps or collides with the title on narrow (mobile) screens.
export default function PageHeader({ title, backLabel, onBack }: Props) {
  return (
    <div className="w-full max-w-3xl grid grid-cols-[auto_1fr_auto] items-center gap-3">
      <button onClick={onBack} className="font-mono text-sm text-slate-400 hover:text-slate-200 whitespace-nowrap">
        {backLabel}
      </button>
      <h2 className="font-mono text-lg sm:text-2xl text-slate-100 text-center truncate">{title}</h2>
      <div aria-hidden="true" className="w-4" />
    </div>
  );
}
