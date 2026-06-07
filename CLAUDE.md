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

This is a **single-file React app** (`src/App.jsx`) — all logic, styles, and UI live there. There are no separate components, routes, or state management libraries.

### Screens

The app cycles through three screens controlled by a `screen` state variable:

```
"entry"  →  "wheel"  →  "result"
```

- `entry`: captures name, phone (+57 prefix), and consent checkbox
- `wheel`: renders the SVG spinner; spin triggered by hub button or `¡Girar la ruleta!` button
- `result`: shows the prize won or "Casi ganas" (lose)

An admin panel (⚙ button, fixed bottom-right) sits outside this flow, protected by `ADMIN_PIN`.

### Key constants to customize

| Constant | Location | Purpose |
|---|---|---|
| `PRIZES` | top of App.jsx | Segments: label, type (`pct`/`lose`), value, `weight` (higher = more frequent), colors |
| `const CSS` | top of App.jsx (template literal) | All visual styles — color palette, fonts, animations |

### Prize probability

`weightedPick()` selects a prize proportionally by `weight`. Increasing a segment's weight makes it land more often. Total weights don't need to sum to any specific number.

### Data storage

Leads are sent to Google Sheets via a Google Apps Script webhook — see `instructions.md §5` for setup. There is no local persistence or admin panel.

### Styles

All CSS lives in the `const CSS` template literal injected via `<style>{CSS}</style>`. BEM-like class names prefixed with `bc-`. To retheme, replace hex values in that block — see `instructions.md` section 6 for the color role mapping.

### Google Sheets integration

`instructions.md` section 5 describes adding a `SHEETS_URL` constant and modifying `finishSpin` to POST leads to a Google Apps Script webhook. This is not wired up yet — `finishSpin` computes the result but does not persist it anywhere until Sheets is connected.

## Notes

- `ruleta.jsx` at the repo root is the original source file. `src/App.jsx` is the working copy with `window.storage` replaced by `localStorage`.
- `pnpm.onlyBuiltDependencies: ["esbuild"]` in `package.json` is required for pnpm to build esbuild's native binaries without interactive prompts.
