# Omarchy Quest

🎮 **Play it live:** [tashom11.github.io/omarchy-quest](https://tashom11.github.io/omarchy-quest/)

A small web game to help people actually memorize the keyboard shortcuts
and CLI commands of the [Omarchy](https://omarchy.org) Linux distro,
instead of looking them up every time. Answer quiz questions or drag-and-drop
blocks to rebuild a command, unlock the next "world", and build a streak.

This is an **unofficial, community-built** project with no affiliation to
the official Omarchy team.

## Why this exists

Omarchy has a lot of keyboard-first workflows and `omarchy-*` commands that
are hard to internalize just by reading a docs page once. This project turns
that reference material into short, situational questions ("you want to do
X — what's the shortcut?") so the muscle memory sticks.

## Features

- Two ways to learn: a timed multiple-choice quiz, and "Build the command"
  (drag or click blocks into the right order).
- Content organized into six worlds (windows, apps, themes, system,
  network, screenshots), unlocked progressively.
- Fully bilingual, French / English, with automatic browser-language
  detection on first visit.
- No backend, no database, no accounts: progress (stars, streak, best
  score) is saved only in the browser's `localStorage`.

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Static build

```bash
npm run build
```

The static site is generated in `out/`, ready to be served by any static
file host.

Set `NEXT_PUBLIC_SITE_URL` at build time to get correct canonical /
Open Graph URLs and a working sitemap, e.g.:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
```

## Deploying to GitHub Pages

The [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) workflow
builds and publishes the site automatically on every push to `main`.

Steps to enable it:

1. In the GitHub repo settings → **Pages**, choose the **GitHub Actions**
   source.
2. Push to `main`: the workflow builds the site with the right `basePath`
   (`/<repo-name>`) and publishes it automatically.

The site will be available at `https://<user>.github.io/<repo-name>/`.

## Tests & local checks

```bash
npm run test
```

Vitest (with jsdom + React Testing Library) covers:
- pure logic in [`lib/progress.ts`](lib/progress.ts) (stars, world unlocking, streak)
- content integrity checks for [`data/commands.ts`](data/commands.ts) (unique ids, bilingual completeness, distractor counts)
- component behavior: world locking/unlocking, the progress-reset confirm
  flow, the result screen's heading, and the quiz timer's pause/resume

There's no CI for this small project: `npm install` installs a local
`pre-push` git hook (see [`scripts/pre-push.sh`](scripts/pre-push.sh)) that
runs `lint`, `test`, and `build` before every push, so the same checks run
on your machine instead of on GitHub. There is no end-to-end/browser test
suite yet (e.g. Playwright) — everything above runs against a simulated DOM,
not a real browser.

## Adding quiz content

All questions live in [`data/commands.ts`](data/commands.ts). Each entry
follows this shape:

```ts
{
  id: 'win-01',
  world: 'windows',
  prompt: {
    fr: 'Tu veux basculer la disposition entre mosaïque et flottant.',
    en: 'You want to toggle between tiled and floating layout.',
  },
  answer: 'Super + T',
  distractors: ['Super + F', 'Super + Shift + Space', 'Super + V'],
  explanation: {
    fr: 'Super + T bascule la fenêtre active entre flottant et mosaïque.',
    en: 'Super + T toggles the active window between floating and tiled.',
  },
  difficulty: 1,
}
```

Just append an object to the `commands` array to enrich an existing world,
or create a new world by adding it to `World`, `worldInfo`, and `worldOrder`.

`answer`/`distractors` are not translated (they're commands/shortcuts,
identical in both languages); only `prompt` and `explanation` are bilingual.

Commands whose `answer` has 2+ words are automatically eligible for
"Build the command" mode (see `buildableCommands()` in the same file).

## Project structure

```
app/                    → Next.js shell (layout, main page, global styles, SEO routes)
components/             → Game screens (home, world select, quiz, build mode, result)
data/commands.ts        → Quiz content (questions, worlds)
hooks/useLocalStorage.ts → Progress persistence
lib/progress.ts         → Pure logic: stars, unlocking, streak
lib/i18n.tsx            → FR/EN translation context and UI dictionary
scripts/pre-push.sh     → Local pre-push checks (lint, test, build), installed by `npm install`
.github/workflows/      → Automated GitHub Pages deployment
```

## Accessibility & SEO

- Keyboard-operable throughout (all interactive elements are real
  `<button>`s); the "Build the command" mode supports drag *and* click.
- Visible focus states, ARIA live regions for quiz/build feedback, and a
  skip-to-content link.
- `<html lang>` follows the selected UI language; the UI language itself
  defaults to the browser's language on a visitor's very first visit
  (falls back to French), then stays as whatever was last chosen.
- Respects `prefers-reduced-motion`: all animations/transitions are
  disabled system-wide for users who request it.
- Custom, bilingual 404 page (`app/not-found.tsx`).
- A real Open Graph image is generated at build time
  (`app/opengraph-image.tsx`), not just meta tags pointing to nothing.
- `robots.txt` / `sitemap.xml` are generated at build time
  (`app/robots.ts`, `app/sitemap.ts`), with AI crawlers explicitly allowed.
- `public/llms.txt` gives AI answer engines a short, structured summary of
  the site (see [llmstxt.org](https://llmstxt.org)).
- JSON-LD structured data (`schema.org/Game`) is embedded in the page head.

## Contributing

Issues and pull requests are welcome — this is meant to be a community
project. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for setup, guidelines,
and what to check before opening a PR.

## Security

This is a static, client-only app with no backend or user data leaving
the browser. See [`SECURITY.md`](SECURITY.md) for the full threat model
and how to report an issue.

## License

[MIT](LICENSE) — see the `LICENSE` file for the full text.
