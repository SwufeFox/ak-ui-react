# Repository Guidelines

## Project Overview

`@swufefox/ak-ui-react` is the React port of the Vue-first [ak-ui](https://github.com/YunYouJun/ak-ui)
design system (Arknights / PRTS terminal aesthetic), plus ports of
[MooncellWiki/prts-design](https://github.com/MooncellWiki/prts-design) (MIT). Version 2.0.0 is
published on npm. Three layers ship together and must stay in sync:

1. **Design tokens + CSS primitives** — vendored upstream SCSS.
2. **Framework-agnostic DOM controllers** — vendored `.mjs` (site navigation, effects, dashboard depth).
3. **React components** — re-implemented over the *same* `ak-*` classes and `data-*` contracts the
   Vue components drove, so behaviour is not duplicated.

The repo also carries a full showcase app (`src/demo/`, deployed to Cloudflare Pages) and generated
API / LLM documentation derived from emitted declarations. No game artwork ships — icons and
portraits are host-supplied props.

**2.0 contract already applied** (do not reintroduce the old shapes): `data-theme="light"` →
`data-ak-theme="archive"`; `AkBackdrop` is a matte overlay with no `blur`; `open`/`value` are
optional with `defaultOpen`/`defaultValue` as the uncontrolled counterparts; `AkCard`/`AkItem`
accept `disabled` and prefer a real `<button>` when the content has no nested controls; the legacy
`scss/ak-ui.scss` entry and `ak-tokens.scss` shim are gone.

## Architecture & Data Flow

**Two build targets — never interchangeable**

- **Library**: `vite.lib.config.ts` + `src/ak/index.ts` → `dist/` (ESM only; `react`, `react-dom`,
  `react/jsx-runtime` externalized). Declarations via `tsc -p tsconfig.build.json` (sourcemaps
  enabled, so `.map` files ship inside the tarball). CSS via dart-sass; controllers copied to
  `dist/core/`.
- **Showcase**: `vite.config.ts` builds `src/demo/` into `dist-demo/`. The demo imports the library
  **from source** (`../../ak`), never from `dist`.

**Build pipeline** (`scripts/build.mjs`, then the gates)

1. `npx tsc --noEmit`
2. `npx vite build --config vite.lib.config.ts`
3. `npx tsc -p tsconfig.build.json` → `dist/**/*.d.ts` (+ `.d.mts` for `src/ak/core`)
4. dart-sass compiles `src/ak/styles/ak-ui.scss` → `dist/style.css`; strips a leading U+FEFF BOM
   dart-sass adds (an inlined `<style>` would otherwise invalidate the `:root` block); copies
   `src/ak/styles/scss/` → `dist/scss/`, the entry → `dist/ak-ui.scss` (same directory level as
   `scss/` so its `@use "scss/…"` paths resolve), fonts → `dist/fonts/` **and** `dist/scss/fonts/`
5. Replaces `dist/core/` with the controller `.mjs` / `.d.mts` + `src/ak/core/site/`
6. Copies root `llms.txt` → `public/llms.txt`
7. Asserts `dist/index.js` still starts with the `'use client'` directive
8. `gen-api.mjs` → `check-docs.mjs` → `check-css.mjs` (see Testing & QA)

**Styling pipeline (order matters)**

- `src/ak/styles/ak-ui.scss` is the **only** stylesheet entry; it `@use`s partials from `scss/`,
  and `_ak-forced-colors.scss` must stay last so its overrides win.
- Not every `_ak-*.scss` partial is necessarily loaded — the entry's `@use` list is the authority.
  A new partial needs an `@use` line, or it silently ships nothing.
- `_ak-tuning.scss` is pulled in by component partials (e.g. `_ak-button.scss`), so `data-ak-size` /
  `data-ak-density` reach the output without the root entry using it.
- Showcase CSS: `src/demo/styles/{base,catalogue,showcase,media}.css`, imported in that order by the
  imports-only `src/demo/demo.css`; `media.css` must stay last (cascade-dependent overrides).

**Theming** cascades from ancestor attributes: `data-ak-theme="terminal" | "archive"` (terminal is
`:root`, archive is the only light mode) and `data-ak-density="compact" | "cozy" | "spacious"`.
Per-instance size is `data-ak-size="sm" | "md" | "lg"` via `sizeAttrs()`. Every tunable is an
`--ak-*` custom property in `_tokens.scss`; archive-only colours live there as semantic tokens, not
as per-partial branches.

**Component <-> controller contract**

```
render → ref attached → useEffect: create controller → keep instance in a ref → cleanup: destroy()
```

Controllers live in `src/ak/core/**/*.mjs`, derive `window` from `root.ownerDocument.defaultView`
(`core/site/shared.mjs` throws on an unattached root), and own their own `AbortController` lifetime.
`src/ak/lib/useController.ts` is a thin `useEffect` wrapper used where a component wants one; others
use effects directly. Never create a controller during render. Mapping: `AkDepth` →
`createDashboardDepth`, `AkEntrance` → `createEntrance`, `AkCountUp` → `createCountUp`, and the
`site/` wrappers → `createSectionNavigation` / `createMobileMenu` / `createMediaGallery` /
`createAssetLoader` / `createParticleField`.

**Showcase data flow**

```
main.tsx → App (locale, theme, density, boot, settings, llms dialog)
  └─ ReferenceView   hash routing (#components-N, 20 categories), ?view= state, shared example state
       ├─ CatalogueRail   search + sliding active marker (aria-current="location")
       └─ Block           renders exactly ONE active category; inactive Blocks return null
            ├─ example(tune)      renderer from src/demo/example-lazy.ts (per-category chunk)
            ├─ createTuneSession  records tunable props; overrides keyed `<target>|<prop>`
            ├─ exportCode(ovr)    lazy per-category exporter → standalone TSX
            └─ api                curated rows from src/demo/doc-data.ts
```

- **Examples are lazy.** `example-lazy.ts` wraps each `render*` function in a proxy that imports the
  module on first call and bumps a revision that `Block` subscribes to (`useSyncExternalStore`).
  The entry chunk is ≈380 kB (≈120 kB gzip); each category is a 2–42 kB chunk. Do not re-import the
  20 renderers statically into `App.tsx` — that puts all of them back in the first load.
- Inactive Blocks return `null`, but any state change in `App`/`ReferenceView` re-renders every
  mounted Block. High-frequency chrome therefore writes the DOM directly: topbar retract + rail
  offset (`rAF`, 4px threshold), reading-progress `scaleX()`, clock/viewport readout (`status.tsx`),
  tab underline, rail marker, `--demo-stage-dir`.

**Export pipeline**: `example-manifest.ts` maps category ids to `?raw` sources + setup + render
expression → `example-export.ts` assembles standalone TSX (scoped demo CSS, localized messages,
import rewriting). Categories 9, 10 and 17 use dedicated site / shell / command exporters.
Generation is lazy and cached against `(tree, exporter, overrides, locale)`; never show or copy
stale output.

**Documentation flow**: `.d.ts` JSDoc → `scripts/gen-api.mjs` → `docs/api.md` (component props,
public hooks, shared types, public data types). Root `llms.txt` is authored and carries the design
contract; `scripts/check-docs.mjs` validates every JSX example against the generated reference.

## Key Directories

| Path | Purpose |
|---|---|
| `src/ak/ui/<feature>/Ak*.tsx` | React components, one folder per feature — e.g. `src/ak/ui/button/AkButton.tsx` |
| `src/ak/ui/arknights/` | prts-design ports: `AkArknights` (rarity/profession/talent data), `AkOperators` (op card/row, enemy), `AkStageCard` (stage, event, hero), `AkCampBits` (camp, range, phase tabs, materials), `AkSkills` (skill, sheet, matrix, talent), `AkRecords` (module, dossier, archive, voice, dialogue) |
| `src/ak/ui/panels/`, `feedback/`, `navigation/` | prts-design ports: panels/accordion/message/stat, badge/chip/toast/tooltip/search, steps/back-top |
| `src/ak/lib/` | `utils.ts` (`cx`, `variantClass`), `size.ts` (`sizeAttrs`), `tokens.ts` (`tokenStyle`), `useControllableState.ts`, `useController.ts`, `useId.ts`, `audio.ts` |
| `src/ak/core/` | Vendored controllers + `.d.mts`; published as `…/core`, `…/core/effects`, `…/core/depth` |
| `src/ak/styles/` | Authored SCSS (`ak-ui.scss` + `scss/_ak-*.scss`, `_tokens.scss`, `_ak-tuning.scss`), self-hosted fonts |
| `src/demo/` | Showcase: `App.tsx`, `block.tsx`, `catalogue-rail.tsx`, `catalogue-data.ts`, `view-param.ts`, `example-lazy.ts`, `examples/*.tsx`, `styles/*.css`, `i18n.tsx`, `guide-content.ts`, `doc-data.ts` |
| `scripts/` | `build.mjs` (library build), `gen-api.mjs` (declarations → `docs/api.md`), `check-docs.mjs` / `check-css.mjs` (build gates) |
| `docs/`, `public/llms.txt` | **Generated**. Authored: root `llms.txt`, `README.md` |

## Development Commands

```bash
npm run dev          # showcase dev server, http://0.0.0.0:5273
npm run typecheck    # tsc --noEmit (strict + noUnused*)
npm run build        # typecheck → vite lib → d.ts → sass → docs/api.md → both gates
npm run build:demo   # showcase build → dist-demo/
npm run preview:demo # serve dist-demo
npm run pack:check   # npm pack --dry-run, inspect the published file list
npm run build:api    # regenerate docs/api.md only (needs dist/** declarations from a prior build)
npm run check:docs   # JSX examples + curated API rows against docs/api.md
npm run check:css    # token reads, the llms tuning table, the removed theme alias
```

- `npm run build` deploys the **package**; `npm run build:demo` produces the **site**. Cloudflare
  Pages must run the latter.
- `gen-api.mjs` exits non-zero without `dist/ui`; `check-docs.mjs` needs `docs/api.md`;
  `check-css.mjs` needs `dist/style.css`. `npm run build` creates all three in order.
- Only `scripts/build.mjs` populates `dist/scss`, `dist/ak-ui.scss` and `dist/core`.

## Code Conventions & Common Patterns

- **Naming**: components `AkPascalCase`, files `AkFoo.tsx`, props `AkFooProps`; folders group by
  feature; SCSS partials `_ak-<feature>.scss`; classes BEM-ish (`ak-button__label`,
  `ak-button--ghost`, `is-active`); tokens `--ak-*`.
- **Component shape**: plain named function + exported `*Props` extending the native attribute type;
  destructure defaults, spread `...rest`, compose classes with `cx` / `variantClass` (`default`
  renders the bare class), emit size with `sizeAttrs(size)` and merge tokens with
  `tokenStyle(tokens, style)` where the component follows that pattern. Preserve the local spread
  order when a component must override attributes.
- **Polymorphic escape hatch**: components that must render a different element take
  `as?: ElementType` (`AkCard`, `AkCommand`, `AkItem`, `AkSlot`, `AkTag`, `AkDepth`, and the
  decor / surface / effect primitives). `AkTag` defaults to a `<span>`; `as="button"` renders a real
  button and defaults `type="button"` so a tag inside a form never submits. Only pass `as` when the
  semantics justify it.
- **Imperative handles**: `forwardRef` + `useImperativeHandle` only for controller-backed widgets —
  `AkEntrance.replay`, `AkCountUp.replay`, `AkMobileMenu.open/close`, `AkSectionNavigator.navigate`
  (these four are also emitted as `const` declarations — `gen-api.mjs` must keep handling them).
- **State (2.0 contract)**: dual-mode everywhere. `value` + `onValueChange` controls; `defaultValue`
  seeds internal state; `open` / `defaultOpen` / `onOpenChange` for disclosure. Only `undefined` is
  uncontrolled — a defined `value` (including `0`, `''`, `false`) always wins. Shared hook:
  `src/ak/lib/useControllableState.ts`. Native handler names (`onChange`, `onClick`) stay for native
  event consumers. Native `aria-label` takes precedence over the legacy `ariaLabel`.
- **Client boundary**: `'use client'` sits at the two barrels (`src/ak/index.ts`, `src/ak/ui/index.ts`)
  and at the five modules that call `createContext` at module scope (`AkArknights`, `AkRecords`,
  `AkFeedbackBits`, `AkField`, `AkPanels`). It is **not** repeated in every hook-using component —
  the barrels cover them. Bundlers drop the directive when bundling, so `scripts/build.mjs` asserts
  the published `dist/index.js` still starts with it; without that, a Next.js server component would
  evaluate `createContext` at build time.
- **IDs**: two conventions coexist — `useInstanceId` (counter-based, DOM-safe) and
  `useId().replace(/:/g, '')` where a component already uses React's hook. Follow the target
  component's convention; never introduce React IDs with colons into `getElementById` wiring.
- **CSS**: a `var(--ak-…)` **without** a fallback must be defined in the stylesheet; tokens that
  exist purely as per-component override points (`--ak-card-w`, `--ak-dialog-bg`, `--ak-form-w`, …)
  are read *with* a fallback so an unset value still renders. `check:css` enforces both directions,
  including that every token in `llms.txt`'s Tuning Reference is consumed. Do **not** move demo-only
  rules into the library stylesheet; demo CSS derives `--demo-*` from `--ak-*`. No rounded corners,
  no glow (port rule below).
- **Upstream ports (prts-design, MIT)**: keep upstream class names (`ak-op-card__portrait`, …) so the
  vendored CSS stays recognisable, but map upstream variables onto `--ak-*` tokens, keep every rule
  working in both themes, and never ship game artwork (host-supplied props + themed placeholder).
  A new family gets its own `_ak-<family>.scss` partial and `src/ak/ui/<family>/Ak*.tsx` file.
- **Animation**: only `transform` / `opacity` / `clip-path`; M3-derived curves in `--demo-motion-*`;
  honour `prefers-reduced-motion` for every non-essential motion.
- **Accessibility is part of the contract**: roving `tabIndex` + arrow/Home/End on tablists/menus,
  `aria-current="location"` on in-page anchors, native `<dialog>` via `showModal()`, visible
  `:focus-visible` rings, ≥24px hit targets (nav links 44px), `aria-live` on async copy/status, and
  never colour alone as a state indicator.
- **i18n invariant (showcase)**: `const en = {…} as const` is the authority; `MessageKey = keyof
  typeof en`; `zhCN: Record<MessageKey, string>` must cover every key or `tsc` fails. `t(key, vars)`
  interpolates `{name}`. Never build keys at runtime.
- **Docs are part of the change**: public prop changes require updating the source JSDoc that
  `gen-api.mjs` reads, the matching example in `llms.txt` when the surface changed, and the curated
  row in `src/demo/doc-data.ts` when the demo shows it. Both gates run on `npm run build`.
- **Error handling**: audio guards `window`/storage and swallows playback errors; failed code
  generation clears its cache entry and surfaces a localized error with Copy disabled. Public
  components must not throw on normal prop combinations; controllers may throw on unattached roots
  (a contract violation, not an error path).

## Important Files

| File | Why it matters |
|---|---|
| `src/ak/index.ts` | Package root barrel — every public component **and type** must be exported here |
| `src/ak/ui/index.ts` | Internal component-value barrel; **not** a substitute for the root |
| `vite.lib.config.ts` | Library bundle: ESM entry, externals, `dist/style.css`, sourcemaps |
| `vite.config.ts` | Showcase dev/build (`dist-demo/`, port 5273) + dev-only font-path plugin |
| `tsconfig.json` / `tsconfig.build.json` | Strict app config; declaration-only build for `src/ak` |
| `src/ak/styles/ak-ui.scss` | The stylesheet the build compiles; sole partial registry |
| `src/ak/styles/scss/_tokens.scss` | All design tokens + `archive` overrides |
| `src/ak/styles/scss/_ak-tuning.scss` | `data-ak-size` / `data-ak-density` knobs |
| `src/demo/App.tsx` | Showcase shell: routing, shared state, chrome, dialogs, hero |
| `src/demo/block.tsx` | One category panel: preview/tune/code/API tabs, inspect mode, export cache |
| `src/demo/example-lazy.ts` | Per-category lazy renderers + revision subscription |
| `src/demo/catalogue-data.ts` | `CATEGORIES` (20), `CATEGORY_COMPONENTS`, search keywords |
| `src/demo/example-manifest.ts` | Per-category standalone exporter dispatch |
| `src/demo/doc-data.ts` | Curated bilingual API rows (prop names gated) |
| `src/demo/i18n.tsx` | Locale dictionaries; English is the key authority |
| `scripts/build.mjs` | Canonical library build; only place `dist/scss` / `dist/core` are populated |
| `scripts/gen-api.mjs` | Regex `.d.ts`/`.d.mts` parser; public surface from `dist/index.d.ts` |
| `scripts/check-docs.mjs` / `check-css.mjs` | The two release gates |
| `package.json` `exports` | `.`, `./style.css`, `./core`, `./core/effects`, `./core/depth`, `./package.json` |
| `.github/workflows/publish.yml` | Tag `v*` → publish; tag must equal `package.json` version |

## Runtime/Tooling Preferences

- **Node `22.14.0`** — pinned by `.nvmrc` and CI; newer local versions are fine, CI is not.
- **npm is the release path**: CI upgrades to `npm@^11.5.1`, runs `npm ci`, then `npm publish`
  through OIDC trusted publishing (environment `npm-publish`, no token secret). `bun.lock` exists
  for local installs; `package.json` declares neither manager.
- **ESM only** (`"type": "module"`, single `import` condition). Do not add CJS output without
  updating `exports`.
- **TypeScript 7**: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`,
  `isolatedModules`, `allowImportingTsExtensions`, `resolveJsonModule`. Dead imports/params fail
  `npm run typecheck`.
- **Vite 8** + `@vitejs/plugin-react`. `scripts/build.mjs` shells out via `npx` with
  `shell: process.platform === 'win32'` — keep that for Windows.
- **No ESLint / Prettier / Biome / EditorConfig** — match surrounding style by hand.
- **Never hand-edit** `docs/api.md`, `public/llms.txt`, `dist*` — generated or copied by the build.
  Edit source JSDoc / root `llms.txt` instead.
- **Generated-tooling shape**: `gen-api.mjs` is regex-based. It scans `dist/ui`, `dist/lib` and
  `dist/core` (`.d.ts` + `.d.mts`), keeps only names exported from `dist/index.d.ts`, expands
  `extends` chains that resolve to a plain local interface (child wins on name clashes), and handles
  single-line, empty and CRLF interface bodies. Unusual declaration shapes can silently drop props —
  check the generated output after changing a declaration.

## Testing & QA

**There is no test framework and no test files** — no `test` script, no `*.test.*`, no `__tests__`,
no Playwright/Vitest/Jest config, and no test step in CI. Verification is structural plus manual:

1. `npm run typecheck` — strict; also proves showcase locale completeness and no dead symbols.
2. `npm run build` — typecheck, bundle, declarations, CSS, `docs/api.md`, then two gates:
   - `check-docs.mjs` fails on an unknown `<Ak…>` component, a non-native prop the component does
     not declare, a quoted value outside a documented union, or a curated `doc-data.ts` row whose
     prop does not belong to its component/category. Scans `llms.txt`, `guide-content.ts`,
     `README.md` and the curated rows. It checks prop **names** only — types, defaults and wording
     stay hand-maintained.
   - `check-css.mjs` fails on a `var(--ak-…)` without a fallback that is never defined, a token
     listed in `llms.txt`'s Tuning Reference that the stylesheet never consumes, or any revived
     `[data-theme…]` selector.
3. `npm run build:demo` — catches showcase-only breakage (does not check behaviour).
4. `npm run pack:check` — confirms the published tarball contents.
5. Browser check of `npm run dev`:
   - Tune overrides, Code copy, generated code matches the preview;
   - both themes (`terminal` / `archive`), both locales (`en` / `zh-CN`);
   - 390px viewport and the horizontal category rail;
   - interaction layer: boot skip (click + reduced-motion), HUD reticle and lock frame on
     `pointer: fine` only, reading-progress line, directional category transition;
   - focus states, dialog Escape/return-focus, `?view=` deep links;
   - on a token or theme change, re-check contrast in `archive`: fixed dark chips
     (`AkProf boxed`, `AkPot`/`AkSpec`) carry their own foreground.

CI (`.github/workflows/publish.yml`) runs only on `v*` tags or manual dispatch (with a `dry_run`
input): `npm ci` → `typecheck` → `build` → tag/version match → `npm pack --dry-run` → publish.
There is no push/PR QA workflow and no demo build in CI, so run the ladder above before tagging.
`npm test` is not a meaningful gate here.

**Known deliberate deviations from upstream CSS** are listed in README → *Port notes → Local fixes
to vendored CSS* (breadcrumb/choice hit areas, standalone `AkSan` add button, loading-screen label,
`.ak-tip` rename, square-by-default avatars). Do not "restore" them to upstream values.
