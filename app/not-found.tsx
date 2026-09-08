// Custom 404, shown for both `output: export`'s generated 404.html and any
// unmatched client-side path. Kept self-contained (no LanguageContext) and
// bilingual by default since we can't know the visitor's preference here.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 gap-6 text-center">
      <p className="font-mono text-accent text-sm tracking-widest uppercase">$ ls --this-page</p>
      <h1 className="font-mono text-5xl font-bold text-slate-100">404</h1>
      <div className="space-y-1 text-slate-400 max-w-sm">
        <p>Cette page n&apos;existe pas.</p>
        <p>This page doesn&apos;t exist.</p>
      </div>
      <a href={`${basePath}/`} className="btn-primary">
        ← Accueil / Home
      </a>
    </div>
  );
}
