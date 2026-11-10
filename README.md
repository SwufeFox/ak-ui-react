# ak-ui-react

**An Arknights-inspired design system for React.**

The React port of [ak-ui](https://github.com/YunYouJun/ak-ui) — PRTS terminal aesthetics shipped as
typed components, design tokens, and motion controllers.

- **Showcase** — https://ak-ui-react.pages.dev
- **Package** — `@swufefox/ak-ui-react`
- **Upstream** — [YunYouJun/ak-ui](https://github.com/YunYouJun/ak-ui) (Vue)

## Why

- **A visual language, not a theme.** Cut corners, scanlines, HUD brackets, signal colors and
  bilingual display type are part of the component set, not decoration you bolt on later.
- **Two themes, one stylesheet.** `terminal` (dark) and `archive` (light) switch from a single
  attribute on any ancestor.
- **React-native.** Typed props, controlled or uncontrolled inputs, imperative handles where the
  original exposed methods.
- **No bundled game art.** Icons come from your app, so nothing copyrighted ships in the package.

## Install

```bash
npm install @swufefox/ak-ui-react
```

Import the stylesheet once, at your app entry:

```ts
import '@swufefox/ak-ui-react/style.css'
```

Requires React 18 or 19.

## Use it

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
          onValueChange={setTab}
        />
      </AkCardContent>
    </AkCard>
  )
}
```

## Theming

Themes and density cascade from ancestor attributes, and every surface reads from `--ak-*` custom
properties, so a host app can retune a whole subtree:

```tsx
<main data-ak-theme="archive" data-ak-density="cozy">
  …
</main>
```

```css
.app-shell {
  --ak-signal-info: #2ec5ff;
  --ak-cut: 4px;
}
```

## What's inside

Interface components (buttons, cards, tables, tabs, menus, dialogs, forms), motion and media
(count-ups, entrances, galleries, full-screen navigation), the geometric decoration language
(stripes, halftone, brackets, cut corners), Arknights game-data pieces (rarity, profession, elite
and potential marks, skill levels, trust), operator dossiers and stage cards, skill sheets and
sealed records, and panels with feedback primitives (accordions, messages, toasts, steppers) —
the last three layers ported from [prts-design](https://github.com/MooncellWiki/prts-design).

Browse the [showcase](https://ak-ui-react.pages.dev) for live previews and copyable examples, or
read [`llms.txt`](./llms.txt) for a machine-readable component index and
[`docs/api.md`](./docs/api.md) for the full API reference.

## Credits

Design tokens, SCSS and DOM controllers originate from
[YunYouJun/ak-ui](https://github.com/YunYouJun/ak-ui) (MIT, © 2019 云游君). The decoration and
game-data layers are derived from
[MooncellWiki/prts-design](https://github.com/MooncellWiki/prts-design) (MIT,
© 2026-present MooncellWiki). No game image assets were ported.

## License

MIT. Contributors: see [AGENTS.md](./AGENTS.md).
