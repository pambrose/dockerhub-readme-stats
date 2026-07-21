# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Vercel serverless service that renders SVG cards and badges of Docker Hub image stats (pulls, stars, last updated) for embedding in GitHub READMEs. CommonJS, no build step, no TypeScript, no environment variables — the Docker Hub API is public.

## Git workflow

Work happens on a branch and lands via PR — do not commit directly to `master`. Note that commits before July 2026 went straight to `master`; that is history, not the current convention.

```bash
git checkout -b <branch>     # branch before starting work
gh pr create                 # no (#N) in the title; GitHub appends it on squash merge
```

Keep unrelated concerns in separate PRs. After a PR merges, delete the local and remote branch.

## Commands

```bash
npm install
npm test                        # jest --verbose
npm run test:coverage
npx jest tests/utils.test.js     # single test file
npx jest -t "hides specific stats"  # single test by name
node express.js                 # local server on http://localhost:9000
```

Local smoke check: `http://localhost:9000/api?image=nginx` and `http://localhost:9000/api/badge?image=nginx&style=for-the-badge`. Responses are SVG — open them in a browser to see rendered output.

## Architecture

Two layers, strictly separated:

- **`api/*.js`** — HTTP handlers. Vercel maps file path to route (`api/index.js` → `/api`, `api/badge.js` → `/api/badge`). Each exports a single `async (req, res)`. These own *only* HTTP concerns: reading `req.query`, coercing strings to numbers/booleans, setting `Content-Type`/`Cache-Control`, and the error fallback.
- **`src/*.js`** — Pure functions with no knowledge of `req`/`res`. `fetchStats(image)` returns a normalized stats object; `renderStatsCard(stats, options)` and `renderBadge(stats, options)` take that object plus already-coerced options and return an SVG string.

Keep rendering functions pure — the tests call them directly with plain objects, never through a request.

### Adding an endpoint

New endpoints must be registered in **two** places: create `api/<name>.js` (Vercel picks it up by convention) *and* add an `app.get()` line to `express.js`, which exists solely to mirror Vercel routing locally. Forgetting the second means it works deployed but 404s in local dev.

### Error handling contract

Handlers must never return a non-SVG body on failure (the one exception is a missing `image` param, which returns 400 plain text). Any thrown error is caught and rendered *as an SVG* with `Cache-Control: no-cache` so that a broken image name still displays something readable in a README instead of a broken-image icon. When adding a handler, replicate this try/catch shape.

### XML escaping

Every user-controlled string interpolated into SVG output must pass through `escapeXml` from `src/utils.js` — including `error.message` in the error-SVG paths, since Docker Hub error text can contain the image name. Unescaped interpolation produces malformed XML that GitHub silently refuses to render.

### Conventions worth knowing

- **Color params omit `#`** because URLs can't carry it. `normalizeColor(override, fallback)` in `src/utils.js` prepends `#` when absent; all theme/color resolution goes through it.
- **`cache_seconds` is clamped to 1800–86400** in both handlers. Keep the clamp if you add a third.
- **Short image names auto-prefix `library/`** in `fetchStats` (`nginx` → `library/nginx`), so official images work without a namespace.
- **`api/badge.js` remaps `starCount` into the `pullCount` field** when `type=stars`, so `renderBadge` only ever reads one value field. Not a bug — don't "fix" it by teaching the renderer about star counts.
- **Stats card height is computed**, not fixed: `header + title + (visible stat rows × 30) + padding`. Adding a stat row type means adding to `statItems` and to the `hide` filter list; the height follows automatically.
- **Themes** (`src/themes.js`) are flat objects of five keys: `titleColor`, `textColor`, `iconColor`, `bgColor`, `borderColor`. A new theme is one entry; unknown theme names silently fall back to `default`.
- **Badge text width is approximated** by `measureText` (`chars × 6.8 + 10`) since SVG can't measure fonts server-side. Layout math in `renderBadge` depends on this estimate.

## Tests

Jest with no config file (defaults). `tests/*.test.js` mirrors `src/*.js` one-to-one. `fetchStats.test.js` mocks axios with `jest.mock("axios")`; renderer tests assert on substrings of the returned SVG rather than snapshots. Follow both patterns when extending.

## Docs to keep in sync

Query parameters are documented in three places: the tables in `README.md`, the example URLs in `LOCAL_DEVELOPMENT.md`, and the destructuring in the relevant `api/*.js` handler. Adding or renaming a parameter means updating all three.

The supported Node version likewise lives in three places: `engines.node` in `package.json`, the matrix in `.github/workflows/test.yml`, and the prerequisites in `LOCAL_DEVELOPMENT.md`. `engines` should claim only what CI actually exercises — don't widen it to a version the matrix never runs.
