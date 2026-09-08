# Security

## Threat model

Omarchy Quest is a static, client-only web game:

- No backend, no database, no server-side code of any kind.
- No user accounts, no authentication, no cookies.
- No user-generated content — nothing entered by a visitor is ever
  rendered back as HTML/JS (no XSS surface from user input, since there
  is no user input beyond localStorage read/written by the app itself).
- The only persisted data is game progress, stored in the visitor's own
  browser `localStorage`, never transmitted anywhere.
- The only outbound network activity is loading the site's own static
  assets; the app never calls `fetch`/`XMLHttpRequest` on its own.

This significantly limits the realistic attack surface. Reports about
generic scanner findings that don't apply to a backend-less static site
(e.g. "missing rate limiting", "no CSRF token") will likely be closed as
not applicable — please explain the concrete exploitation scenario for a
site with no server and no forms if you believe one applies.

## Defense in depth already in place

- A `Content-Security-Policy` is set via `<meta>` in
  [`app/layout.tsx`](app/layout.tsx) (the only option available on
  GitHub Pages, which serves files as-is with no custom headers).
  `unsafe-inline` is required for `script-src`/`style-src` because of how
  Next.js hydrates a static export — see the comment above the policy for
  the exact trade-off.
- All external links use `rel="noopener noreferrer"`.
- The one inline script (JSON-LD structured data) escapes `<` before
  injection to prevent a `</script>` breakout, even though its content is
  static and author-controlled.

## Known accepted finding

`npm audit` reports a moderate/high finding in a `postcss` copy nested
inside `next`'s own dependency tree (`node_modules/next/node_modules/postcss`).
This is used only by Next's internal build tooling to process our own
trusted CSS at build time — it never runs against attacker-controlled
input, and never ships to the deployed static site. The only fix
available is a Next.js major version upgrade (15 → 16), which we're
deferring until it's been evaluated on its own merits, not as a forced
security patch for an inapplicable finding. Re-run `npm audit` after
dependency updates to confirm this is still the case.

## Reporting a vulnerability

Open a [GitHub issue](https://github.com/tashom11/omarchy-quest/issues)
describing the concrete impact. Given the threat model above, please
include a realistic scenario (not just a scanner/lint finding) for
anything beyond XSS or supply-chain concerns.
