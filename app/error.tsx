'use client';

// Route-level error boundary. Kept self-contained (no LanguageContext, since
// an error here may mean that provider itself failed to render) and
// bilingual by default, same approach as app/not-found.tsx.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 gap-6 text-center">
      <p className="font-mono text-danger text-sm tracking-widest uppercase">$ ./oups --erreur</p>
      <h1 className="font-mono text-3xl font-bold text-slate-100">Quelque chose s&apos;est mal passé</h1>
      <h2 className="font-mono text-xl text-slate-300">Something went wrong</h2>
      <div className="space-y-1 text-slate-400 max-w-sm">
        <p>
          Ta progression est sauvegardée dans ton navigateur et n&apos;est pas affectée. Essaie de
          recharger la page.
        </p>
        <p>Your progress is saved in your browser and is unaffected. Try reloading the page.</p>
      </div>
      <div className="flex gap-4">
        <button onClick={reset} className="btn-primary">
          ↻ Réessayer / Retry
        </button>
        <a href={`${basePath}/`} className="btn-secondary">
          ← Accueil / Home
        </a>
      </div>
    </div>
  );
}
