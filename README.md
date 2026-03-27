# Design Token Pipeline

A production-grade design token pipeline that transforms structured token definitions into platform-ready CSS custom properties and typed JavaScript exports — the same workflow that powers enterprise design systems at scale.

**Live demo:** [tomdeluca-tokens.netlify.app](https://tomdeluca-tokens.netlify.app)

---

## What This Is

Design tokens are the single source of truth for visual design decisions: colors, spacing, typography, shadows, motion. This project demonstrates how to take tokens defined in a format-agnostic source (mirroring Figma Variables) and transform them automatically into artifacts that every platform in your stack can consume.

```
tokens/*.json  →  Style Dictionary  →  dist/tokens.css
                                    →  dist/tokens.js
                                    →  dist/tokens.d.ts
```

The demo site itself is styled exclusively using the generated token output — making it a live, self-documenting artifact.

---

## Pipeline Overview

```
┌─────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│  Token Source   │     │   Style Dictionary   │     │   Platform Output    │
│                 │     │                      │     │                      │
│  tokens/        │────▶│  DTCG pre-process    │────▶│  dist/tokens.css     │
│  color.json     │     │  Name transform      │     │  dist/tokens.js      │
│  spacing.json   │     │  Value transform     │     │  dist/tokens.d.ts    │
│  ...            │     │  Format output       │     │                      │
└─────────────────┘     └──────────────────────┘     └──────────────────────┘
```

### Token Format

Tokens follow the [W3C Design Token Community Group (DTCG)](https://www.w3.org/community/design-tokens/) specification, using `$type` and `$value` properties:

```json
{
  "color": {
    "orange": {
      "500": {
        "$type": "color",
        "$value": "#f97316"
      }
    }
  }
}
```

Supported token types: `color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`, `shadow`, `number`

### Output

**`dist/tokens.css`** — CSS custom properties on `:root`
```css
:root {
  --token-color-orange-500: #f97316;
  --token-spacing-4: 1rem;
  --token-font-size-base: 1rem;
  /* ... */
}
```

**`dist/tokens.js`** — ES module named exports
```js
export const tokenColorOrange500 = "#f97316";
export const tokenSpacing4 = "1rem";
```

**`dist/tokens.d.ts`** — TypeScript declarations
```ts
export declare const tokenColorOrange500: string;
export declare const tokenSpacing4: string;
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
git clone https://github.com/tomdeluca/design-token-pipeline.git
cd design-token-pipeline
npm install
```

### Build Tokens

Generates `dist/tokens.css`, `dist/tokens.js`, and `dist/tokens.d.ts`:

```bash
npm run build:tokens
```

### Start Dev Server

Builds tokens, then starts Vite with HMR:

```bash
npm run dev
```

### Production Build

```bash
npm run build
# Output in: site/
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build:tokens` | Run Style Dictionary to generate token output |
| `npm run dev` | Build tokens + start Vite dev server |
| `npm run build` | Build tokens + Vite production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Stylelint + ESLint |
| `npm run lint:css` | Stylelint only |
| `npm run lint:js` | ESLint only |
| `npm run format` | Format all files with Prettier |

---

## Project Structure

```
design-token-pipeline/
├── tokens/                     ← W3C DTCG format token sources
│   ├── border-radius.json
│   ├── color.json
│   ├── motion.json
│   ├── shadow.json
│   ├── spacing.json
│   └── typography.json
├── config/
│   └── style-dictionary.config.mjs   ← Style Dictionary v4 config
├── scripts/
│   └── build-tokens.mjs              ← Token build entry point
├── src/
│   ├── index.html
│   ├── main.ts                       ← Site JS entry point
│   ├── styles/
│   │   ├── main.css                  ← Imports tokens + component styles
│   │   ├── base.css
│   │   └── components/
│   └── components/
│       ├── tabs.ts                   ← Accessible tab component
│       └── copy-button.ts            ← Clipboard copy utility
├── public/
│   └── favicon.svg
└── dist/                             ← Generated (gitignored, built at deploy time)
    ├── tokens.css
    ├── tokens.js
    └── tokens.d.ts
```

---

## Extending the Pipeline

### Adding a New Token Category

1. Create a new file in `tokens/` following the DTCG format:

```json
{
  "border": {
    "width": {
      "thin": { "$type": "dimension", "$value": "1px" },
      "base": { "$type": "dimension", "$value": "2px" },
      "thick": { "$type": "dimension", "$value": "4px" }
    }
  }
}
```

2. Run `npm run build:tokens` — the new tokens are automatically picked up.

3. In CSS: `var(--token-border-width-thin)`
4. In JS: `import { tokenBorderWidthThin } from './dist/tokens.js'`

### Adding a New Output Platform

Add a platform entry to [config/style-dictionary.config.mjs](config/style-dictionary.config.mjs):

```js
scss: {
  transformGroup: "tokens-studio",
  transforms: ["name/kebab"],
  prefix: "token",
  buildPath: "dist/",
  files: [{ destination: "tokens.scss", format: "scss/variables" }],
},
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Token transformation | [Style Dictionary v4](https://styledictionary.com) |
| DTCG format support | [@tokens-studio/sd-transforms](https://github.com/tokens-studio/sd-transforms) |
| Token spec | [W3C DTCG](https://www.w3.org/community/design-tokens/) |
| Build tool | [Vite 5](https://vitejs.dev) |
| Language | TypeScript (strict) |
| Icons | [Lucide](https://lucide.dev) |
| Font | [Inter](https://rsms.me/inter/) via @fontsource |
| Linting | ESLint (flat config) + Stylelint |
| Formatting | Prettier |

---

## License

MIT — see [LICENSE](LICENSE)
