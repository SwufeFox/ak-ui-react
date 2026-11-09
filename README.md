# ak-ui-react

**An Arknights-inspired design system for React** — PRTS terminal aesthetics, shipped as typed
components, design tokens, and framework-agnostic motion controllers.

The design layer comes from [ak-ui](https://github.com/YunYouJun/ak-ui); this package is its React
port. The SCSS primitives and DOM controllers are shared, so the React components drive the same
behaviour the Vue originals did.

- **Showcase** — https://ak-ui-react.pages.dev
- **Package** — `@swufefox/ak-ui-react`
- **AI reference** — [`llms.txt`](./llms.txt)
- **Upstream** — [YunYouJun/ak-ui](https://github.com/YunYouJun/ak-ui)

## Why use it

- **A real visual language, not a theme.** Cut corners, scanlines, HUD brackets, signal colors, and
  bilingual display type are part of the component set.
- **Two themes out of the box.** `terminal` (dark) and `archive` (light), switched from an ancestor
  attribute — no second stylesheet.
- **React-native API.** Typed props, controlled inputs, slot props, and imperative handles where the
  original exposed methods.
- **No bundled game art.** Icons are supplied by the host, so the package ships no copyrighted
  assets.

## Install

```bash
npm install @swufefox/ak-ui-react
```

Import the stylesheet once, at your app entry:

```ts
import '@swufefox/ak-ui-react/style.css'
```

Requires React 18 or 19.

## Quick start

```tsx
import { useState } from 'react'
import {
  AkButton,
  AkCard,
  AkCardHeader,
  AkCardTitle,
  AkCardContent,
  AkTabs,
} from '@swufefox/ak-ui-react'

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
          onValueChange={setTab}
        />
      </AkCardContent>
    </AkCard>
  )
}
```

## What's inside

A curated tour rather than an exhaustive inventory — the package exports more components than the
showcase has dedicated blocks for.

**Interface** — `AkButton` · `AkCard` · `AkTag` · `AkStatus` · `AkNotice` · `AkProgress` ·
`AkGauge` · `AkSlider` · `AkInputNumber` · `AkTabs` · `AkSegmented` · `AkTable` · `AkDialog` ·
`AkPopover` · `AkDropdownMenu` · `AkCollapsible` · `AkCommand` · `AkBreadcrumb` · `AkScreen` ·
`AkSlot` · `AkItem`

**Motion & media** — `AkCountUp` · `AkEntrance` · `AkAssetLoader` · `AkMediaGallery` ·
`AkMobileMenu` · `AkParticleField` · `AkSectionNavigator` · `AkGlow` · `AkOutline` · `AkSkew`

**Decoration** — hazard stripes, halftone, blueprint grids, corner brackets, glyphs, cut corners,
chevrons, bilingual headings (`AkStripes`, `AkHalftone`, `AkGridBackdrop`, `AkCorner`,
`AkBrackets`, `AkCut`, `AkGlyph`, `AkBilingual`, …)

**Arknights game data** — rarity rails, professions, elite/potential/specialization marks, skill
levels, attribute panels, trust (`AkRarity`, `AkProfession`, `AkElite`, `AkPotential`, `AkSpec`,
`AkSkillLevels`, `AkAttrs`, `AkTrust`, …)

Components are exported from the package root with typed props. `AkButton` variants are
`default`, `outline`, `action`, `advanced`, `light`, `danger`, and `ghost`.

The showcase presents a curated set of blocks with live previews, code, and API notes; it does not
have a dedicated block for every export.

## Theming

Themes and density cascade from ancestor attributes:

```tsx
<main data-ak-theme="archive" data-ak-density="cozy">
  …
</main>
```

Retune individual surfaces through the `--ak-*` custom properties, or scope a component size with
`data-ak-size`:

```css
.app-shell {
  --ak-signal-info: #2ec5ff;
  --ak-cut: 4px;
}
```

## Controllers

Motion and interactive behaviour are available without React, through sub-path exports:

```ts
import { createSectionNavigation, createMediaGallery } from '@swufefox/ak-ui-react/core'
import { createCountUp, createEntrance } from '@swufefox/ak-ui-react/core/effects'
import { createDashboardDepth } from '@swufefox/ak-ui-react/core/depth'
```

Each controller attaches to a DOM node and returns a `destroy()` (or equivalent) cleanup handle.

## Documentation

| Resource | Contents |
| --- | --- |
| [Showcase](https://ak-ui-react.pages.dev) | Live previews, prop tuning, copyable examples |
| [`llms.txt`](./llms.txt) | Component index and API definitions for AI assistants |
| [`docs/api.md`](./docs/api.md) | Generated API reference from source JSDoc |
| [`AGENTS.md`](./AGENTS.md) | Architecture, build, and contribution guidelines |

## Credits

Design tokens, SCSS, and DOM controllers originate from
[YunYouJun/ak-ui](https://github.com/YunYouJun/ak-ui) (MIT, © 2019 云游君).

The `decor` and `arknights` layers are derived from
[MooncellWiki/prts-design](https://github.com/MooncellWiki/prts-design) (MIT,
© 2026-present MooncellWiki). No game image assets were ported.

## License

MIT.
