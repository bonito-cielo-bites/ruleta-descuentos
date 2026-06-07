# Ruleta Bonito Cielo

Discount wheel app for trade fair stands. Captures customer name and phone, spins a weighted prize wheel, and stores leads locally for CSV export.

## Local development

**Requirements:** Node.js 18+, pnpm 8+

```bash
pnpm install
pnpm dev       # http://localhost:5173 — stop with Ctrl+C
```

## Build

```bash
pnpm build     # output → dist/
pnpm preview   # serve the production build locally
```

## Customization

All configuration lives at the top of `src/App.jsx`:

- **`PRIZES`** — wheel segments, prize values, weights (higher weight = lands more often), and colors
- **`const CSS`** — full color palette and styles; see `instructions.md §6` for the color role mapping

## Deployment

See `instructions.md` for:
- Deploying to Vercel (§3)
- Connecting Google Sheets to capture leads server-side (§5)
- Applying the Bonito Cielo brand palette (§6)
