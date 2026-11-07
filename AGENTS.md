# Repository Guidelines

## Project Overview

`@swufefox/ak-ui-react` is the React port of the Vue-first [ak-ui](https://github.com/YunYouJun/ak-ui) design system (Arknights-inspired tactical/terminal UI). It ships three things that must stay in sync:

1. **Design tokens + CSS primitives** — upstream SCSS, vendored as-is.
2. **Framework-agnostic DOM controllers** — vendored `.mjs` (site sections, effects, dashboard depth).
3. **React components** — re-implemented on top of the same controller instances the Vue components drove.

The repo also contains a full showcase app (`src/demo`) deployed to Cloudflare Pages, and generated API/LLM documentation derived from emitted `.d.ts` JSDoc.

## Architecture & Data Flow

**Two independent build targets:**

- **Library** — `src/ak/index.ts` → `dist/index.js` (ESM only, `react`/`react-dom` externalized), declarations via `tsc -p tsconfig.build.json`, styles via dart-sass, controllers copied verbatim to `dist/core/`.
- **Showcase** — `vite.config.ts` builds `src/demo` into `dist-demo/`. The demo imports the library **from source** (`../../ak`), never from `dist`.

**Styling pipeline (order matters):**

```
src/ak/styles/ak-ui.scss  --dart-sass-->  dist/style.css     (scripts/build.mjs step 4)
src/ak/styles/scss/       --copy------>   dist/scss/          (consumers can recompile)
```

Step 4 runs **after** the Vite lib build and overwrites the CSS Vite emitted; it also strips the UTF-8 BOM dart-sass adds, because an inlined `<style>` would otherwise null out every `:root` token. `src/ak/styles/scss/ak-ui.scss` is a secondary entry, **not** the file the build compiles.

**Theming:** everything cascades from ancestor attributes — `data-ak-theme="terminal" | "archive"` and `data-ak-density="compact" | "cozy" | "spacious"`. All tunables are `--ak-*` custom properties defined in `src/ak/styles/scss/_tokens.scss`.

**Controller contract (the most important pattern):**

```
render → ref attached → useEffect: create controller → keep instance in a ref → cleanup: destroy()
```

Controllers require a document-attached element and own their own `AbortController` lifetime (`src/ak/core/site/shared.mjs`). Never instantiate one during render, and never recreate it per-props-change unless the dependency truly requires it.

**Showcase data flow:**

```
main.tsx → App → I18nProvider
  └─ ReferenceView        owns hash routing (#components-N) + all per-category demo state
       ├─ CatalogueRail   aria-current="location" links
       └─ Block            renders exactly one category (returns null when inactive)
            ├─ example(tune)      authored JSX in src/demo/examples/*.tsx
            ├─ createTuneSession  wraps JSX via tune('id', <Component/>) for prop editing
            ├─ exportCode(ovr)    lazy per-category exporter → standalone TSX
            └─ api                rows from src/demo/doc-data.ts
```

`StageContext` shares the active id plus an `overrideRegistry` ref so exporters can snapshot other categories' Tune edits. Code generation is deduped by `(tree, exporter, overrides, locale)` identity — stale results must never be displayed or copied.

**Bundle trade-off (deliberate):** every category's preview renderer and both locale dictionaries load eagerly, so switching categories never shows a spinner; only the Code exporters are split into per-category chunks. Splitting previews would trade first-paint weight for a loading state on every category switch — do not do it without measuring that trade.

## Key Directories

| Path | Purpose |
|---|---|
| `src/ak/ui/<feature>/Ak*.tsx` | React components, one folder per feature (button, card, menu, command, screen, …) |
| `src/ak/lib/` | `utils.ts` (`cx`, `variantClass`), `useController.ts`, `useId.ts`, `audio.ts`, `size.ts`, `tokens.ts` |
| `src/ak/core/` | Vendored `.mjs` + `.d.mts` controllers; published as `…/core`, `…/core/effects`, `…/core/depth` |
| `src/ak/styles/` | Authored SCSS (`ak-ui.scss` + `scss/_ak-*.scss`, `_tokens.scss`, `_ak-tuning.scss`) |
| `src/demo/` | Showcase app; `examples/*.tsx` are per-category preview renderers; `highlight.ts` colorizes generated code |
| `src/demo/example-*.ts` | Code-export pipeline (manifest, TSX assembly, tune adapter, standalone site/shell) |
| `scripts/` | `build.mjs` (4-stage library build), `gen-api.mjs` (d.ts → `docs/api.md`) |
| `docs/`, `llms.txt` | **Generated**: `docs/api.md`, `public/llms.txt`. **Authored**: root `llms.txt` |

## Development Commands

```bash
npm run dev          # showcase dev server, http://0.0.0.0:5273
npm run typecheck    # tsc --noEmit (strict + noUnused*)
npm run build        # library: typecheck → vite lib → d.ts → sass → docs/api.md
npm run build:demo   # showcase build → dist-demo/
npm run preview:demo # serve dist-demo
npm run pack:check   # npm pack --dry-run, inspect the published file list
npm run build:api    # regenerate docs/api.md only (requires dist/ui from a build)
```

Library bundling is not the default Vite config: `npm run build` drives `vite build --config vite.lib.config.ts`. Plain `vite build` builds the showcase.

## Code Conventions & Common Patterns

- **Naming:** components `AkPascalCase`, files `AkFoo.tsx`, props `AkFooProps`; folders group by feature; SCSS partials `_ak-<feature>.scss`; CSS classes BEM-ish `ak-button__label`, variant modifiers `ak-button--ghost`; tokens `--ak-*`.
- **Component shape:** plain named function + exported `*Props` extending the native attribute type; destructure defaults, spread the rest onto the DOM node, compose classes with `cx` / `variantClass`. Use `forwardRef` + `useImperativeHandle` only for controller-backed widgets (`AkEntranceHandle`, `AkMobileMenuHandle`).
- **State:** controlled via `value` + `onValueChange` / `onOpenChange`; uncontrolled via `defaultValue` / `defaultOpen`; native handlers keep React names (`onClick`, `onChange`).
- **IDs:** not uniform — `lib/useId.ts` uses a module counter ref, others use `React.useId().replace(/:/g, '')`. Follow the neighbouring component.
- **CSS:** every `var(--ak-…)` keeps a fallback; consumer overrides are expected (`--ak-button-bg` style names). Do not move demo-only rules into the library stylesheet.
- **i18n invariant (showcase):** `const en = {…} as const` is the authority; `MessageKey = keyof typeof en`; `zhCN: Record<MessageKey, string>` must cover every key or `tsc` fails. `t(key, vars)` interpolates `{name}`. Never construct keys at runtime — use an explicit typed mapping (`MENU_ACTION_LABELS` in `src/demo/examples/menus.tsx` is the reference).
- **Accessibility:** tablists use roving `tabIndex` + arrow/Home/End keys; in-page anchors use `aria-current="location"`; dialogs are native `<dialog>` via `showModal()`; reduced-motion is honoured in both controllers and SCSS; the skip link targets the focusable `#demo-main`.
- **Error handling:** no throwing across component boundaries; audio calls guard `window` and swallow playback errors; failed code generation clears the cache entry and surfaces a localized error with Copy disabled.

## Important Files

| File | Why it matters |
|---|---|
| `src/ak/index.ts` | Package root barrel — every public component/type must be exported here |
| `src/ak/ui/index.ts` | Internal barrel; **not** re-exported wholesale by the root |
| `src/ak/styles/scss/_tokens.scss` | All design tokens + `archive` (light) overrides |
| `src/ak/styles/ak-ui.scss` | The file the build compiles to `dist/style.css` |
| `src/demo/App.tsx` | Showcase shell: routing, Tune/code/API panels, settings, generators |
| `src/demo/i18n.tsx` | Locale dictionaries; English is the key authority |
| `src/demo/example-manifest.ts` | Per-category exporter dispatch (numeric category id) |
| `scripts/build.mjs` | Canonical library build; also the only place `dist/scss`/`dist/core` are populated |
| `scripts/gen-api.mjs` | Regex-based d.ts parser; fragile to unusual declaration shapes |
| `package.json` `exports` | Root, `./style.css`, `./core`, `./core/effects`, `./core/depth`, `./package.json` — no wildcard |
| `.github/workflows/publish.yml` | Tag `v*` → publish; tag must equal `package.json` version |

## Runtime/Tooling Preferences

- **Node `22.14.0`** — pinned by `.nvmrc` and the publish workflow. Local machines running newer Node are fine; CI is not.
- **npm is the release path**: workflow upgrades to `npm@^11.5.1`, runs `npm ci`, then `npm publish` via OIDC trusted publishing (no token secret). `bun.lock` exists for local installs; neither manager is declared in `package.json`.
- **ESM only** (`"type": "module"`, single `import` condition). Do not add CJS output without updating `exports`.
- **TypeScript 7** with `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `isolatedModules`, `allowImportingTsExtensions`. Dead imports/params fail `npm run typecheck`.
- **Vite 8** with `@vitejs/plugin-react`; `scripts/build.mjs` invokes binaries through `npx` and uses `shell: true` on Windows.
- **Never hand-edit** `docs/api.md` or `public/llms.txt` — both are overwritten by `npm run build`. Edit `llms.txt` (root) and source JSDoc instead.
- `dist`, `dist-demo`, `dist-demo-*` are gitignored; the showcase deploy reads `dist-demo`.

## Testing & QA

There is **no test framework and no test files** in this repository (`package.json` has no `test` script; no `*.test.*`, `__tests__`, Playwright or Vitest config exists). Verification is structural and manual:

1. `npm run typecheck` — strict, covers unused symbols and cross-dictionary completeness.
2. `npm run build` — runs typecheck, bundles, emits declarations, compiles CSS, regenerates `docs/api.md`.
3. `npm run build:demo` — catches showcase-only breakage.
4. `npm run pack:check` — confirms the published tarball contents (`dist`, `docs`, `llms.txt`).
5. Browser check of `npm run dev` for interactive behaviour (Tune, Code copy, dialogs, both themes `terminal`/`archive`, both locales `en`/`zh-CN`, narrow viewports).

When changing a public component, also update the JSDoc that `gen-api.mjs` reads, then rebuild so `docs/api.md` and `llms.txt` stay truthful.
