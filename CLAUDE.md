# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # dev server at localhost:5173
pnpm build      # production build → dist/
pnpm preview    # serve the production build locally
```

No test suite exists. Verify changes visually with `pnpm dev`.

## Architecture

This is a **single-file React app** (`src/App.jsx`) — all logic, styles, and UI live there. No separate components, routes, or state management libraries.

### Screens

Controlled by a `screen` state variable:

```
"entry"  →  "wheel"  →  "result"
```

- `entry`: captures name, last name, phone (+57 prefix), consent checkbox
- `wheel`: SVG spinner; spin triggered by hub button or `¡Girar la ruleta!` button
- `result`: shows prize (`pct`), loss (`lose`), or duplicate phone (`duplicate`)

### Spin flow

`spin()` → `finishSpin()` (via `onTransitionEnd` on the SVG after 5.2 s CSS transition)

Key detail: the Google Sheets fetch is **started in `spin()`** (runs in parallel with the animation) and **awaited in `finishSpin()`** inside a 650 ms `setTimeout`. By then the network call is almost always resolved, so the duplicate check adds no perceptible delay. The result (`pct`/`lose`/`duplicate`) is set inside that setTimeout, and confetti only fires for non-duplicate wins.

`spinning` stays `true` from `spin()` until `setSpinning(false)` inside the 650 ms callback — buttons remain disabled through the entire post-spin transition.

### Key constants

| Constant | Location | Purpose |
|---|---|---|
| `PRIZES` | top of App.jsx | Segments: label, type (`pct`/`lose`), value, `weight`, colors |
| `SHEETS_URL` | top of App.jsx | Google Apps Script web app URL |
| `const CSS` | top of App.jsx (template literal) | All styles — BEM-like `bc-` prefix |

`weightedPick()` selects a prize proportionally by `weight`. Total weights don't need to sum to any specific number.

### Google Sheets integration

**React side** (`src/App.jsx`): `fetch()` with `mode: "cors"` and `Content-Type: "text/plain"` (avoids CORS preflight while allowing response reading). Sends `{ nombre, apellido, telefono, premio, codigo, fecha }`. Falls back to `localStorage` under key `bc_leads`.

**Apps Script side** (`src/app-script.js`): paste into Google Apps Script, set `SHEET_ID` and `SHEET_NAME`, deploy as web app (access: Anyone). Behavior:
- Uses `LockService` to serialize concurrent writes
- Deduplicates by phone (column C), normalizing to digits only
- Returns `{ status: "duplicate" }` if phone already exists — no update
- Returns `{ status: "ok" }` on insert
- `sanitize()` prefixes formula-triggering characters (`=`, `+`, `-`, `@`) with `'` to prevent spreadsheet injection

After any change to `app-script.js`, a **new deployment** must be created in Apps Script and the new URL updated in `SHEETS_URL`.

### Styles

All CSS in the `const CSS` template literal, injected via `<style>{CSS}</style>`. To retheme, replace hex values in that block. The color roles are: `#e24c04` (accent/CTA), `#5879d8` (blue), `#2a1f3d` (dark text), `#f5e4ee` (background).

## Notes

- `ruleta.jsx` at the repo root is the original source artifact — do not edit it.
- `pnpm.onlyBuiltDependencies: ["esbuild"]` in `package.json` is required for pnpm to build esbuild's native binaries without interactive prompts.
