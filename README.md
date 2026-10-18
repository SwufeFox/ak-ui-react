# ak-ui-react

**The React version of [ak-ui](https://github.com/YunYouJun/ak-ui)** — an Arknights-inspired
design system. This repository is the React rewrite; upstream is Vue-first (SCSS primitives plus
a shadcn-**vue** registry).

The component layer is re-implemented in React while the design layer stays intact: the
framework-agnostic SCSS and the DOM controllers are reused as-is, so the React components drive
the *same* controller instances the Vue components did.

- **Package:** `@swufefox/ak-ui-react`
- **Repo:** https://github.com/SwufeFox/ak-ui-react
- **Showcase:** https://ak-ui-react.pages.dev
- **Upstream:** [YunYouJun/ak-ui](https://github.com/YunYouJun/ak-ui) (Vue)
- **Peer deps:** React 18 or 19

## Install

```bash
npm install @swufefox/ak-ui-react
# or: pnpm add @swufefox/ak-ui-react
```

Then import the stylesheet once, at your app entry:

```ts
import '@swufefox/ak-ui-react/style.css'
```

## Usage

```tsx
import { useState } from 'react'
import { AkButton, AkCard, AkCardHeader, AkCardTitle, AkCardContent, AkTabs } from '@swufefox/ak-ui-react'

export function Panel() {
  const [tab, setTab] = useState('overview')

  return (
    <AkCard>
      <AkCardHeader>
        <AkCardTitle>Deployment</AkCardTitle>
      </AkCardHeader>
      <AkCardContent>
        <AkButton variant="action">Launch</AkButton>
        <AkTabs
          items={[
            { value: 'overview', label: 'Overview', title: 'Overview' },
            { value: 'archive', label: 'Archive', title: 'Archive' },
          ]}
          value={tab}
          onValueChange={(v) => setTab(v ?? 'overview')}
        />
      </AkCardContent>
    </AkCard>
  )
}
```

### Components

`AkButton` · `AkCard` (`Header`/`Title`/`Description`/`Content`/`Footer`) · `AkTag` · `AkStatus` ·
`AkNotice` · `AkProgress` · `AkGauge` · `AkSlider` · `AkInputNumber` · `AkTabs` · `AkSegmented` ·
`AkCountUp` · `AkEntrance` · `AkAssetLoader` · `AkMediaGallery` · `AkMobileMenu` ·
`AkParticleField` · `AkSectionNavigator`

Decoration (`decor`) — ported from prts-design:

`AkStripes` · `AkCorner` · `AkBrackets` · `AkGridBackdrop` · `AkHalftone` · `AkBlueBand` ·
`AkDisplay` · `AkNum` · `AkCodeId` · `AkOverline` · `AkEn` · `AkWatermark` · `AkBilingual` ·
`AkChevrons` · `AkInverse` · `AkGlyph` · `AkGlyphBox` · `AkCut` · `AkMotion`

Arknights game data (`arknights`) — ported from prts-design:

`AkRarity` · `AkRarityScope` · `AkRarityChip` · `AkRarityBar` · `AkProfession` ·
`AkProfessionLabel` · `AkElite` · `AkPotential` · `AkSpec` · `AkPotList` · `AkPot` ·
`AkSkillLevels` · `AkAttrs` · `AkAttr` · `AkKv` · `AkKvItem` · `AkTrust`

Every component is typed; all public types are re-exported from the package root. Components whose
upstream form draws a game icon take it as a prop (`icon` / `iconSrc` / `children`) — none of them
depend on bundled game art.

### Framework-agnostic controllers

The DOM controllers behind motion, galleries, menus, section navigation, particles and asset
loading have no React dependency and are shipped as sub-path exports:

```ts
import { createSectionNavigation, createMediaGallery } from '@swufefox/ak-ui-react/core'
import { createCountUp, createEntrance } from '@swufefox/ak-ui-react/core/effects'
import { createDashboardDepth } from '@swufefox/ak-ui-react/core/depth'
```

### Styling

The compiled stylesheet is available at `@swufefox/ak-ui-react/style.css`. The original SCSS is
shipped too (`dist/scss/`) if you want to recompile or theme it:

```ts
@use "@swufefox/ak-ui-react/dist/scss/ak-ui.scss";
```

## API conventions

- **`variant`** follows the upstream registry convention: `default` renders the bare class,
  any other value appends a BEM modifier (`ak-button--action`).
- **Controlled inputs** (`AkSlider`, `AkInputNumber`, `AkTabs`, `AkSegmented`, `AkMediaGallery`)
  take `value` + `onValueChange`, replacing Vue's `v-model`.
- **Slot props** replace named slots: `icon` (AkButton), `renderPanel` (AkTabs),
  `renderMedia` (AkMediaGallery), and `children`-as-function (AkAssetLoader).
- **Imperative handles** are used where the original exposed methods via `defineExpose`
  (`AkCountUp`, `AkEntrance`, `AkMobileMenu`, `AkSectionNavigator`) — pass a `ref`.
- **Token-driven decoration** (`AkCut`, `AkMotion`, `AkStripes`, `AkHalftone`, `AkGridBackdrop`, …)
  reads `--ak-*` tokens for its geometry or timing, and accepts either a direct prop
  (`radius` on `AkCut`, `pace` on `AkMotion`) or an inline CSS variable — so you can retune a whole
  surface from an ancestor instead of threading props through every call site:

  ```css
  .app-shell {
    --ak-cut: 4px;           /* every cut corner in this subtree */
    --ak-motion-slow: 900ms; /* every AkMotion --slow in this subtree */
    --ak-ease-standard: cubic-bezier(0.4, 0, 0.1, 1);
  }
  ```

  ⚠️ **Which variable you override matters.** A component reads the *underlying* token
  (`--ak-motion-slow`), so overriding that from an ancestor works. The component's own
  intermediate (`--ak-motion-dur`, which `.ak-motion` declares on the element itself) does **not**
  inherit from an ancestor — setting it on a parent is a no-op. Set the underlying token on an
  ancestor, or set the intermediate on the element itself.

### Two components with real contracts

- **`AkSectionNavigator`** is a full-screen scroll-snap shell, not a generic page wrapper. It
  requires a `[data-ak-section-viewport]` containing sections that each have a **unique `id`**;
  the controller throws otherwise. Section links use `data-ak-section-link` and receive
  `aria-current="location"`.
- **`AkMobileMenu`**'s trigger is hidden above `48rem` by the stylesheet — it is a mobile
  affordance.

## Design references

Parts of this library are ported from **[MooncellWiki/prts-design](https://github.com/MooncellWiki/prts-design)**,
a design system for the Arknights-themed prts.wiki (MIT License, Copyright (c) 2026-present
MooncellWiki; verified against the repository's `LICENSE` file on 2026-10-18). Two layers were
brought over:

- **`decor`** — the geometric decoration language (`_ak-decor.scss`, `src/ak/ui/decor/AkDecor.tsx`):
  hazard stripes, halftone dots, blueprint grids, corner triangles, HUD brackets, uppercase Latin
  display type, glyph inversion, bilingual headings, chevrons.
- **`arknights`** — game-data components (`_ak-arknights.scss`, `src/ak/ui/arknights/AkArknights.tsx`):
  rarity rails, profession colors, elite/potential/specialization marks, potential lists, skill
  level selectors, attribute panels, key-value tables, trust marks.

Upstream tokens were renamed to this package's existing `--ak-*` conventions rather than copied
verbatim, and both light and dark values were mapped onto this package's two themes (terminal /
archive). **No game image assets were ported** — upstream ships its iconography as copyrighted
game extractions under a separate notice, so every icon-bearing component here takes its icon from
the host as `children`/`icon` and renders nothing (rather than a placeholder) when none is passed.

An earlier iteration of this port reviewed the same repository while its license status was still
unresolved and deliberately borrowed only abstract design directions. That restriction is now
lifted; the note is kept here for context.

### Cut corners (`AkCut`)

Upstream hardcoded the same "clip the top-right corner" shape in five places at five different
radii (dialog `1.25rem`, notice `1rem`, popover `0.9rem`, san `0.75rem`, tag `0.55rem`) while
`--ak-cut-sm/md/lg` had **no consumers at all** — the shape existed but was neither reusable nor
tunable. Those five now read the same token:

```css
clip-path: polygon(0 0, calc(100% - var(--ak-cut, <original radius>)) 0, …)
```

Each keeps its original radius as the fallback, so nothing shifts visually unless you override it.
Set `--ak-cut` on any ancestor to retune every cut surface at once:

```css
/* host wants a tighter, more technical cut everywhere */
.app-shell { --ak-cut: 4px; }
```

`AkCut` is the same geometry as a component — `corner` (`tr` default, `tl`/`br`/`bl`/`all`),
`size` (`sm`/`md`/`lg`), or an explicit `radius`.

> `clip-path` clips the element's own shadow — that is its semantics, not a bug. For "cut corner
> **and** drop shadow", put the shadow on a wrapper: `<div style={{boxShadow:…}}><AkCut>…</AkCut></div>`.
> A background on the element itself still shows, since the clip applies to the painted box.

### Motion pacing (`AkMotion`)

Same story as the cut corners, one layer up. `--ak-motion-fast/base/slow` and
`--ak-ease-emphasized` had **no consumers** — every animation in the library hardcoded its own
number (`.ak-entrance`'s controller defaults to `650ms`, `.ak-fx` to `1.5s` / `0.7s`) — so the
pacing scale existed but nothing was on it.

`AkMotion` wires the scale to a real transition:

```tsx
<AkMotion effect="rise" pace="slow" emphasized>
  <AkPanel />
</AkMotion>
```

- `pace` — `quick` (120ms) · `base` (200ms) · `slow` (420ms)
- `effect` — `fade` (`opacity`) · `rise` (`opacity, transform`) · `color` (color/border)
- `emphasized` — swaps `--ak-ease-standard` for `--ak-ease-emphasized`

`effect` is **required in practice**: `transition-duration` alone does nothing without a
`transition-property`, so a pace with no effect is an inert class. That is why they ship paired.

`prefers-reduced-motion: reduce` zeroes the duration rather than removing the transition, so hosts
that rely on `transitionend` are not left hanging.

You can also skip the component and use the tokens directly:

```css
.my-panel {
  transition: opacity var(--ak-motion-dur, var(--ak-motion-base)) var(--ak-motion-ease, var(--ak-ease-standard));
}
```

**To retune pacing from an ancestor, override the scale token, not `--ak-motion-dur`:**

```css
.app-shell { --ak-motion-slow: 900ms; }   /* ✅ reaches every AkMotion in the subtree */
.app-shell { --ak-motion-dur: 90ms; }     /* ❌ no-op — .ak-motion declares it on the element */
```

The same shape applies to `AkCut`: override `--ak-cut`, not `--ak-cut-corner`
(`.ak-cut` sets `--ak-cut-corner` itself, so an ancestor value never arrives).

### Signal glow (`--ak-shadow-signal`)

`--ak-shadow-signal` is the shared glow for "this thing is live". `.ak-status__signal` used to
hardcode its own `box-shadow`; it now reads the token, taking its **colour** from the component's
signal (`--ak-shadow-signal-color`), so one token serves the info / warning / critical variants:

```css
/* retune every signal glow in the app, or just the status dot */
.app-shell { --ak-shadow-signal: 0 0 1.25rem color-mix(in srgb, var(--ak-shadow-signal-color, var(--ak-signal-info)) 70%, transparent); }
```

Note `--ak-shadow-signal` is consumed by `.ak-status`, but is not applied by any component other
than that — if you want a glowing panel, use it directly.

### Reserved tokens

A handful of tokens are part of the published API but **not consumed by any rule in this library**.
They are kept deliberately (removing them would be a breaking change for a published package) and
documented here so you can tell "reserved" apart from "we forgot to wire it up":

| Token | Status |
| --- | --- |
| `--ak-space-5` / `--ak-space-6` | Spacing scale beyond what the components use |
| `--ak-motion-fast` / `--ak-motion-slow` | Wired via `.ak-motion--quick` / `--slow`; reserved if you use tokens directly |
| `--ak-ease-emphasized` | Wired via `.ak-motion--emphasized` |
| `--ak-font-command` | Spare type role (currently aliases the serif) |
| `--ak-type-display-size` / `--ak-type-wide` | Typography scale, not yet consumed |
| `--ak-radius-subtle` | Reserved radius |
| `--ak-bar-w-lg` | Thick accent rail (`.ak-r-bar` uses the 4px `--ak-bar-w`) |
| `--ak-signal-accent` | Alias of `--ak-color-accent`, reserved |

If you are building on this package, prefer the tokens that are actually wired — check this table
before assuming a token will do something.


```bash
npm install
npm run dev        # demo app at http://localhost:5273
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + emit dist/ (ESM, .d.ts, style.css, scss/, core/)
npm run pack:check # inspect the published file list
```

`src/ak/` is the library. `src/demo/` is a dev-only showcase and is not published.

## Releasing

Publishing runs in CI via **npm trusted publishing (OIDC)** — there is no `NPM_TOKEN`
secret to rotate, and 2FA is satisfied by the OIDC exchange rather than a one-time password.

`.github/workflows/publish.yml` runs on a `v*` tag (or manually via `workflow_dispatch`,
with a `dry_run` option that builds and packs without publishing).

```bash
# 1. bump the version
npm version patch          # or minor / major — creates a commit and the tag locally

# 2. push the commit and the tag
git push --follow-tags

# 3. CI typechecks, builds, verifies tag == package.json version, then publishes
```

**One-time setup on npmjs.com** — the package must already exist before a trusted publisher
can be attached (v1.1.0 was published manually with a granular token):

1. Open the package settings: `https://www.npmjs.com/package/@swufefox/ak-ui-react/access`
2. Under **Trusted Publisher**, choose **GitHub Actions** and fill in:
   - Organization or user: `SwufeFox`
   - Repository: `ak-ui-react`
   - Workflow filename: `publish.yml`
   - Environment name: `npm-publish`
3. Tick **Allow npm publish** (not just `npm stage publish`), then save.

The workflow matches those values exactly — `environment: npm-publish`, `id-token: write`,
and `node-version: '22.14.0'` with npm upgraded to `^11.5.1` (trusted publishing requires
npm ≥ 11.5.1 and Node ≥ 22.14.0).

> The configuration expires if it does not complete a first successful publish within two
> days of creation.

## Showcase

The component showcase is the same Vite app used for development (`src/demo/`, 11 sections from
Actions through Arknights game data). It deploys to **Cloudflare Pages** on every push to
`master`, via `.github/workflows/pages.yml` — independent of the npm release, so a docs change
does not cut a version and a release does not wait on the site.

```bash
npm run dev        # local, http://localhost:5273
npx vite build     # builds the showcase into dist-demo/
```

The deployment is deliberately **purely static** — no Pages Functions, no `_worker.js`, no
`_routes.json`. Cloudflare's docs are explicit that "on a purely static project, Pages offers
unlimited free requests"; adding Functions is what makes requests count against the daily limit
and prompts the whole `_routes.json` exclusion dance. So the build output stays four files:

```
dist-demo/index.html
dist-demo/_headers        # response headers, parsed by Pages, not served as an asset
dist-demo/assets/*.js     # 269 KB
dist-demo/assets/*.css    # 107 KB
```

`_headers` (authored in `public/`, copied in by Vite) caches the hashed assets immutably and
keeps `index.html` revalidating, so a deploy is picked up immediately rather than serving a
stale entry point.

If you ever add a `functions/` directory, that changes: every request would invoke a Function by
default, and you would need a `_routes.json` to exclude static routes — which must contain **at
least one `include` rule**, so `"include": []` is invalid and the deploy is rejected.

**One-time setup** — the workflow is guarded by `vars.CLOUDFLARE_PAGES_ENABLED`, so it skips
itself until both secrets exist and that variable is set. This keeps forks and fresh clones green.

1. Create a Pages project named `ak-ui-react` (Workers & Pages → Create → Pages → *Direct
   Upload*). Do **not** connect it to this repo through the Git integration — the workflow
   uploads with `wrangler pages deploy`, so a Git build would deploy the same thing twice.
2. Create an API token (My Profile → API Tokens) scoped to **Account → Cloudflare Pages →
   Edit**.
3. Add two repository secrets (Settings → Secrets and variables → Actions → *Secrets*):
   `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
4. Add one repository **variable** (same page, *Variables* tab): `CLOUDFLARE_PAGES_ENABLED` =
   `true`.

Then push to `master`, or run the workflow from the Actions tab with `dry_run` to build without
deploying.

> The deployed URL is `https://<project-name>.pages.dev`. If the project name is taken, pick
> another and change `--project-name` to match in `pages.yml`.

## Port notes

| Layer | Upstream | Here | Strategy |
| --- | --- | --- | --- |
| Design tokens & component CSS | `src/scss/**` | `src/ak/styles/scss/**` | Vendored unchanged — framework-agnostic. |
| DOM controllers | `src/js/*.mjs` | `src/ak/core/*.mjs` | Vendored unchanged — no Vue dependency. |
| Component layer | `registry/ak/ui/*.vue` | `src/ak/ui/**/*.tsx` | Rewritten in React over the same `ak-*` classes and `data-*` contracts. |

Because the controllers were already framework-agnostic, the React components drive the **same**
controller instances the Vue components did — behaviour was not reimplemented.

Vue → React mapping: `defineProps`→typed props · named slots→`ReactNode` props ·
`v-model`→`value`/`onValueChange` · `defineExpose`→`forwardRef` + `useImperativeHandle` ·
`onMounted`/`onScopeDispose`→`useEffect`. The one substitution worth noting: React's `useId`
emits colons, which are invalid in `id` attributes and break `getElementById`-based ARIA wiring,
so tab/menu components use an internal `useInstanceId` instead.

## License

MIT. This repository is a port of [YunYouJun/ak-ui](https://github.com/YunYouJun/ak-ui) and
retains its license; the design tokens, SCSS and DOM controller sources originate there and
remain under the original copyright (© 2019 云游君).

The `decor` and `arknights` layers are additionally derived from
[MooncellWiki/prts-design](https://github.com/MooncellWiki/prts-design), also MIT,
Copyright (c) 2026-present MooncellWiki. Game image assets from that project were not ported.
