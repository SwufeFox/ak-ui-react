# Repository Guidelines

## Project Overview

`@swufefox/ak-ui-react` is the React port of the Vue-first [ak-ui](https://github.com/YunYouJun/ak-ui)
design system (Arknights / PRTS terminal aesthetic). Three layers ship together and must stay in sync:

1. **Design tokens + CSS primitives** — upstream SCSS, vendored.
2. **Framework-agnostic DOM controllers** — vendored `.mjs` (site sections, effects, dashboard depth).
3. **React components** — re-implemented over the *same* `ak-*` classes and `data-*` contracts the
   Vue components drove, so behaviour is not duplicated.

The repo also carries a full showcase app (`src/demo/`) deployed to Cloudflare Pages, and generated
API / LLM documentation derived from emitted `.d.ts` JSDoc.

## Architecture & Data Flow

**Two build targets — never interchangeable**

- **Library**: `vite.lib.config.ts` + `src/ak/index.ts` → `dist/` (ESM only; `react`, `react-dom`,
  `react/jsx-runtime` externalized). Declarations via `tsc -p tsconfig.build.json`; CSS via
  dart-sass; controllers copied verbatim to `dist/core/`.
- **Showcase**: `vite.config.ts` builds `src/demo/` into `dist-demo/`. The demo imports the library
  **from source** (`../../ak`), never from `dist`.

**Styling pipeline (order matters)**

```
src/ak/styles/ak-ui.scss  --dart-sass-->  dist/style.css   (scripts/build.mjs, stage 4)
src/ak/styles/scss/       --copy------>    dist/scss/        (consumers can recompile)
```

- `src/ak/styles/ak-ui.scss` is the file the build compiles; it `@use`s partials from `scss/`.
- The legacy duplicate entry `src/ak/styles/scss/ak-ui.scss` and the unused `ak-tokens.scss`
  shim were removed in 2.0. Keep exactly one entry; a second one silently drifts.
- Showcase CSS is split into `src/demo/styles/{base,catalogue,showcase,media}.css`, imported in
  that order by `src/demo/demo.css` (imports-only entry). `media.css` must stay last — it holds
  the `@media` / reduced-motion overrides that rely on cascade order.
- `_ak-tuning.scss` is loaded by component partials (e.g. `_ak-button.scss`), so `data-ak-size` /
  `data-ak-density` rules reach the output without the root entry `@use`ing it.
- Stage 4 runs **after** Vite and overwrites the emitted CSS; it strips the UTF-8 BOM dart-sass
  prepends, because an inlined `<style>` would otherwise invalidate the `:root` token block.

**Theming** cascades from ancestor attributes: `data-ak-theme="terminal" | "archive"` and
`data-ak-density="compact" | "cozy" | "spacious"`. `terminal` is the default (`:root`), `archive`
is the only light mode — the old `data-theme="light"` alias was removed in 2.0. Every tunable is an
`--ak-*` custom property in `src/ak/styles/scss/_tokens.scss`; do not add per-partial archive
overrides when a semantic token can express the same value.

**2.0 breaking changes already applied** (do not reintroduce the old shapes)

- Legacy `scss/ak-ui.scss` entry and the `ak-tokens.scss` shim are gone; `src/ak/styles/ak-ui.scss`
  is the only stylesheet entry.
- `data-theme="light"` is gone; use `data-ak-theme="archive"`.
- `AkBackdrop` no longer takes `blur`; it is a matte overlay (no `backdrop-filter`).
- `AkDialog.open` is optional; `defaultOpen` is the uncontrolled counterpart.
- `AkSlider` / `AkInputNumber` / `AkTabs` / `AkSegmented` accept `defaultValue`; `value` is optional.
- `AkCard` / `AkItem` interactive variants accept `disabled` and prefer a real `<button>` when the
  content has no nested controls.

**Controller contract (the most important pattern)**

```
render → ref attached → useEffect: create controller → keep instance in a ref → cleanup: destroy()
```

Controllers live in `src/ak/core/**/*.mjs`, require a document-attached element
(`src/ak/core/site/shared.mjs` throws without `ownerDocument.defaultView`), and own their own
`AbortController` lifetime. `src/ak/lib/useController.ts` is a thin effect wrapper whose dependency
list controls recreation. Never instantiate a controller during render; never recreate it per props
change unless the dependency truly requires it.

**Showcase data flow**

```
main.tsx → App (locale, theme, density, boot, settings, llms dialog)
  └─ ReferenceView   owns hash routing (#components-N), ?view= state, shared example state
       ├─ CatalogueRail   search + sliding active marker (aria-current="location")
       └─ Block           renders exactly ONE active category; inactive Blocks return null
            ├─ example(tune)      authored JSX in src/demo/examples/*.tsx
            ├─ createTuneSession  records tunable props; overrides keyed `<target>|<prop>`
            ├─ exportCode(ovr)    lazy per-category exporter → standalone TSX
            └─ api                rows from src/demo/doc-data.ts
```

Because inactive `Block`s return `null`, the 17 categories are lightweight shells, but **any React
state change in `App`/`ReferenceView` re-renders every mounted Block**. That is why high-frequency
chrome is written straight to the DOM:

- topbar retract + rail offset (`rAF`, 4px threshold, writes only on direction flips);
- reading-progress fill (`transform: scaleX()`);
- system readout clock / viewport (`status.tsx`);
- tab underline, rail marker, stage direction (`--demo-stage-dir`).

**Export pipeline**: `example-manifest.ts` maps numeric category ids to raw source + hook setup +
render expression → `example-export.ts` builds the standalone TSX. IDs 9, 10, 17 use dedicated
site / shell / command exporters. Code generation is lazy and cached against
`(tree, exporter, overrides, locale)`; stale results must never be shown or copied.

## Key Directories

| Path | Purpose |
|---|---|
| `src/ak/ui/<feature>/Ak*.tsx` | React components, one folder per feature — e.g. `src/ak/ui/button/AkButton.tsx` |
| `src/ak/lib/` | `utils.ts` (`cx`, `variantClass`), `useController.ts`, `useControllableState.ts`, `useId.ts`, `audio.ts` |
| `src/ak/core/` | Vendored `.mjs` controllers + `.d.mts`; published as `…/core`, `…/core/effects`, `…/core/depth` |
| `src/ak/styles/` | Authored SCSS (`ak-ui.scss` + `scss/_ak-*.scss`, `_tokens.scss`, `_ak-tuning.scss`) |
| `src/demo/` | Showcase: `App.tsx` (routing/state/chrome), `block.tsx`, `catalogue-rail.tsx`, `catalogue-data.ts`, `view-param.ts`, `examples/*.tsx`, `styles/*.css`, `i18n.tsx`, `doc-data.ts` |
| `scripts/` | `build.mjs` (4-stage library build), `gen-api.mjs` (`.d.ts` → `docs/api.md`) |
| `docs/`, `public/llms.txt` | **Generated**. Authored: root `llms.txt`, `README.md` |

## Development Commands

```bash
npm run dev          # showcase dev server, http://0.0.0.0:5273
npm run typecheck    # tsc --noEmit (strict + noUnused*)
npm run build        # library: typecheck → vite lib → d.ts → sass → docs/api.md
npm run build:demo   # showcase build → dist-demo/
npm run preview:demo # serve dist-demo
npm run pack:check   # npm pack --dry-run, inspect the published file list
npm run build:api    # regenerate docs/api.md only (requires dist/ui from a prior build)
```

- `npm run build` deploys the **package**; `npm run build:demo` produces the **site**. Cloudflare
  Pages must use the latter.
- `gen-api.mjs` reads `dist/ui/**/*.d.ts` and exits non-zero if it is missing — build first.
- Only `scripts/build.mjs` populates `dist/scss` and `dist/core`.

## Code Conventions & Common Patterns

- **Naming**: components `AkPascalCase`, files `AkFoo.tsx`, props `AkFooProps`; folders group by
  feature; SCSS partials `_ak-<feature>.scss`; CSS classes BEM-ish (`ak-button__label`,
  `ak-button--ghost`); tokens `--ak-*`.
- **Component shape**: plain named function + exported `*Props` extending the native attribute type;
  destructure defaults, spread the rest onto the DOM node, compose classes with `cx` /
  `variantClass` (`default` renders the bare class, anything else appends `--<variant>`).
- **Imperative handles**: `forwardRef` + `useImperativeHandle` only for controller-backed widgets —
  `AkEntrance.replay`, `AkCountUp.replay`, `AkMobileMenu.open/close`, `AkSectionNavigator.navigate`.
- **State (2.0 contract)**: dual-mode everywhere. `value` + `onValueChange` controls; `defaultValue`
  seeds internal state when `value` is `undefined`. Disclosure uses `open` / `defaultOpen` /
  `onOpenChange`. A defined `value` (including `0`, `''`, `false`) always wins. `src/ak/lib/useControllableState.ts`
  is the shared hook. Native handler names (`onChange`, `onClick`) are kept for native event consumers.
  Accessible names: native `aria-label` takes precedence over the legacy `ariaLabel` prop.
- **IDs**: `lib/useId.ts` exports `useInstanceId` — a counter-based prefixed id. `React.useId()`
  emits colons which break `getElementById`-based ARIA wiring; a few components call
  `useId().replace(/:/g, '')` instead — follow the local component's convention.
- **CSS**: every `var(--ak-…)` keeps a fallback; consumer overrides are expected. Do **not** move
  demo-only rules into the library stylesheet. In demo CSS, derive `--demo-*` from `--ak-*` — never
  hardcode a second palette.
- **Animation**: only `transform` / `opacity` / `clip-path`; M3-derived curves in
  `--demo-motion-*`; honour `prefers-reduced-motion` for every non-essential motion.
- **Accessibility is part of the contract**: roving `tabIndex` + arrow/Home/End on tablists/menus,
  `aria-current="location"` on in-page anchors, native `<dialog>` via `showModal()`, visible
  `:focus-visible` rings, ≥24px hit targets (nav links 44px), `aria-live` on async copy/status.
- **i18n invariant (showcase)**: `const en = {…} as const` is the authority; `MessageKey = keyof
  typeof en`; `zhCN: Record<MessageKey, string>` must cover every key or `tsc` fails. `t(key, vars)`
  interpolates `{name}`. Never build keys at runtime — use a typed mapping.
- **Error handling**: audio calls guard `window`/storage and swallow playback errors; failed code
  generation clears its cache entry and surfaces a localized error with Copy disabled. Public
  components must not throw on normal prop combinations; vendor controllers may throw on malformed
  or unattached roots (that is a contract violation, not an error path).
- **Audio**: `playTactileSound()` respects the persisted on/off flag and lazily creates the
  `AudioContext`; keep both guards when touching audio paths.

## Important Files

| File | Why it matters |
|---|---|
| `src/ak/index.ts` | Package root barrel — every public component **and type** must be exported here |
| `src/ak/ui/index.ts` | Internal barrel of component values; **not** a substitute for the root |
| `vite.lib.config.ts` | Library bundle: ESM entry `src/ak/index.ts`, externals, `dist/style.css` |
| `vite.config.ts` | Showcase dev/build config (`dist-demo/`, port 5273) |
| `src/ak/styles/ak-ui.scss` | The stylesheet the build compiles |
| `src/ak/styles/scss/_tokens.scss` | All design tokens + `archive` overrides |
| `src/ak/styles/scss/_ak-tuning.scss` | `data-ak-size` / `data-ak-density` knobs |
| `src/demo/App.tsx` | Showcase shell: routing, shared demo state, topbar/settings/dialogs, hero |
| `src/demo/block.tsx` | One category panel: preview/tune/code/API tabs, inspect mode, export cache |
| `src/demo/catalogue-rail.tsx` | Searchable category rail + sliding active marker |
| `src/demo/catalogue-data.ts` | `CATEGORIES`, `CATEGORY_COMPONENTS`, search keywords |
| `src/demo/view-param.ts` | `?view=` read/write + `DemoView` type |
| `src/demo/i18n.tsx` | Locale dictionaries; English is the key authority |
| `src/demo/example-manifest.ts` | Per-category exporter dispatch (numeric id → standalone TSX) |
| `src/demo/doc-data.ts` | Authored API rows rendered by each Block's Api tab |
| `scripts/build.mjs` | Canonical library build; only place `dist/scss` / `dist/core` are populated |
| `scripts/gen-api.mjs` | Regex-based `.d.ts` parser; fragile to unusual declaration shapes |
| `package.json` `exports` | `.`, `./style.css`, `./core`, `./core/effects`, `./core/depth`, `./package.json` |
| `.github/workflows/publish.yml` | Tag `v*` → publish; tag must equal `package.json` version |

## Runtime/Tooling Preferences

- **Node `22.14.0`** — pinned by `.nvmrc` and the publish workflow; newer local versions are fine,
  CI is not.
- **npm is the release path**: the workflow upgrades to `npm@^11.5.1`, runs `npm ci`, then
  `npm publish` through OIDC trusted publishing (no token secret). `bun.lock` exists for local
  installs; `package.json` declares neither manager.
- **ESM only** (`"type": "module"`, single `import` condition). Do not add CJS output without
  updating `exports`.
- **TypeScript 7** with `strict`, `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`, `isolatedModules`, `allowImportingTsExtensions`,
  `resolveJsonModule`. Dead imports/params fail `npm run typecheck`.
- **Vite 8** + `@vitejs/plugin-react`; `scripts/build.mjs` shells out via `npx` (`shell: true` on
  Windows).
- **No ESLint / Prettier / Biome / EditorConfig** — match surrounding style by hand.
- **Never hand-edit** `docs/api.md`, `public/llms.txt`, `dist*` — they are overwritten by the build.
  Edit source JSDoc / root `llms.txt` instead.

## Testing & QA

**There is no test framework and no test files** — no `test` script, no `*.test.*`, no
`__tests__`, no Playwright/Vitest config. Verification is structural plus manual:

1. `npm run typecheck` — strict; also proves showcase locale completeness and no dead symbols.
2. `npm run build` — typecheck, bundle, declarations, CSS, `docs/api.md` regeneration.
3. `npm run build:demo` — catches showcase-only breakage (does not check behaviour).
4. `npm run pack:check` — confirms the published tarball contents.
5. Browser check of `npm run dev`:
   - Tune overrides, Code copy, generated code matches the preview;
   - both themes (`terminal` / `archive`), both locales (`en` / `zh-CN`);
   - narrow viewports (390px) and the horizontal category rail;
   - interaction layer: boot sequence (skip + reduced-motion skip), HUD reticle and lock frame on
     `pointer: fine` only, reading-progress line, directional category transition;
   - focus states, dialog Escape/return-focus, `?view=` deep links.

CI (`.github/workflows/publish.yml`) runs only on `v*` tags or manual dispatch: `npm ci` →
`typecheck` → `build` → tag/version match → `npm pack --dry-run` → optional dry-run publish. There
is no push-to-branch QA workflow, so run the ladder above before tagging.

**Known deliberate deviations from upstream CSS** are listed in README → *Port notes → Local fixes
to vendored CSS* (breadcrumb/choice hit areas, standalone `AkSan` add button, loading-screen label).
Do not "restore" them to upstream values.

When changing a public component, update the JSDoc that `gen-api.mjs` reads, then rebuild so
`docs/api.md` and `llms.txt` stay truthful.
