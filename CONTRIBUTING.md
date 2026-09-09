# Contributing

Thanks for considering a contribution to Omarchy Quest!

## Setup

```bash
npm install
npm run dev
```

## Before opening a PR

```bash
npm run lint
npm run test
npm run build
```

Both must pass; `npm install` also sets up a local `pre-push` git hook
that runs the same checks automatically before every push (see
[`scripts/pre-push.sh`](scripts/pre-push.sh)).

## Guidelines

- Code, identifiers, and comments: **English**. The app's bilingual FR/EN
  content lives in `data/commands.ts` and `lib/i18n.tsx` — that's the only
  place French text belongs.
- Keep components focused; prefer editing an existing file over adding a
  new abstraction for a one-off need.
- Adding a quiz question? See the "Adding quiz content" section in the
  [README](README.md) — no code changes needed, just append to
  `data/commands.ts`.
- Commit messages: short, present tense, explain the *why* when it's not
  obvious from the diff.

## Reporting bugs / suggesting features

Open a [GitHub issue](https://github.com/tashom11/omarchy-quest/issues)
with steps to reproduce (for bugs) or the use case (for features).
