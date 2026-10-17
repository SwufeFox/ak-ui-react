# ak-ui-react

**The React version of [ak-ui](https://github.com/YunYouJun/ak-ui)** — an Arknights-inspired
design system. This repository is the React rewrite; upstream is Vue-first (SCSS primitives plus
a shadcn-**vue** registry).

The component layer is re-implemented in React while the design layer stays intact: the
framework-agnostic SCSS and the DOM controllers are reused as-is, so the React components drive
the *same* controller instances the Vue components did.

- **Package:** `@swufefox/ak-ui-react`
- **Repo:** https://github.com/SwufeFox/ak-ui-react
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

Every component is typed; all public types are re-exported from the package root.

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

### Two components with real contracts

- **`AkSectionNavigator`** is a full-screen scroll-snap shell, not a generic page wrapper. It
  requires a `[data-ak-section-viewport]` containing sections that each have a **unique `id`**;
  the controller throws otherwise. Section links use `data-ak-section-link` and receive
  `aria-current="location"`.
- **`AkMobileMenu`**'s trigger is hidden above `48rem` by the stylesheet — it is a mobile
  affordance.

## Development

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
