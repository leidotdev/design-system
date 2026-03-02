# Design System

Shared design tokens and UI components built on shadcn/ui conventions.

## Token Workflow

Design tokens live in `tokens/tokens.json` using the [Tokens Studio](https://tokens.studio/) format. A build script generates CSS custom properties and a Tailwind extension from this single source of truth.

### Quick Start

```bash
npm run tokens:build
```

This produces two files (both git-ignored):

| File | Purpose |
|---|---|
| `src/styles/tokens.css` | CSS variables in `:root` (light) and `.dark` scopes |
| `tokens/tailwind-tokens.js` | Tailwind `theme.extend` object you spread into `tailwind.config.js` |

### Using the generated tokens

**CSS** — import `src/styles/tokens.css` at the top of your global stylesheet:

```css
@import "./tokens.css";
```

**Tailwind** — spread the extension into your config:

```js
const tokenExtensions = require("./tokens/tailwind-tokens.js");

module.exports = {
  ...tokenExtensions,
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
};
```

## Code → Figma (push tokens to design)

1. Open the **Tokens Studio** plugin in Figma.
2. Connect the plugin to this repository (Settings → Add new → URL or GitHub sync).
   - Point the token source to `tokens/tokens.json`.
3. The plugin reads the JSON and creates matching Figma styles/variables.
4. Designers apply the synced tokens to components in Figma.

When a developer updates `tokens/tokens.json`, the designer pulls the latest changes in Tokens Studio to stay in sync.

## Figma → Code (pull tokens from design)

1. Designers update token values in the **Tokens Studio** plugin inside Figma.
2. Push the changes back to this repo (Tokens Studio → Push to GitHub).
   - This updates `tokens/tokens.json` on a branch.
3. Open a PR, review the diff, and merge.
4. Run `npm run tokens:build` to regenerate CSS and Tailwind files.

### Tokens Studio Plugin Setup

1. Install **Tokens Studio for Figma** from the Figma Community.
2. Open the plugin → **Settings** → **Sync providers** → **Add new**.
3. Choose **GitHub** (or **URL** for read-only).
4. Fill in:
   - **Repository**: `<org>/<repo>`
   - **Branch**: `main`
   - **File path**: `tokens/tokens.json`
5. Click **Save** and **Pull from GitHub** to load the tokens.
6. Apply token sets (`light`, `dark`, `global`) as needed.

## Project Structure

```
tokens/
  tokens.json            # Source of truth (Tokens Studio format)
  tailwind-tokens.js     # Generated Tailwind extension
scripts/
  build-tokens.js        # Token build script
src/
  styles/
    tokens.css           # Generated CSS variables
  components/ui/         # shadcn/ui components (added later)
  app/                   # Application entry point
```
