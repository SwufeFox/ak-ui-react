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

## Compatibility

- **React 18 or 19**, ESM only.
- **Next.js App Router**: the package entry is a client boundary (`'use client'`), so importing any
  component from a server component works — the components render on the client. The DOM controllers
  under `@swufefox/ak-ui-react/core` have no React dependency and stay usable from server code.
- **Fonts**: Chakra Petch and Oswald (both OFL-1.1) ship with the package and cover the label and
  display roles. The original game's Bender / Novecento Sans Wide are *not* redistributed here; they
  stay first in the font stacks, so a machine that has them installed keeps the original look.

## Migrating from 1.x

The component set only grew — no export was removed in 2.0 — but five contracts behave
differently now:

| 1.x | 2.0 |
| :--- | :--- |
| `data-theme="light"` | `data-ak-theme="archive"`. The old alias is gone, so `data-theme` no longer switches anything; `data-ak-theme="terminal"` stays the default. |
| `<AkBackdrop blur />` | `<AkBackdrop strength="light" />` — the overlay is matte and no longer blurs the page behind it. |
| `open` was required | `open` is optional; `defaultOpen` seeds the uncontrolled mode (`AkDialog`, `AkPopover`, menus, panels). |
| `value` was required | `value` is optional; `defaultValue` seeds the uncontrolled mode (`AkSlider`, `AkInputNumber`, `AkTabs`, `AkSegmented`). A defined `value` still wins. |
| `AkCard` / `AkItem` had no `disabled` | both accept `disabled`, and a pressable card renders a real `<button>` when it has no nested controls. |

The stylesheet import is unchanged (`import '@swufefox/ak-ui-react/style.css'`), and the package
entry stays a client boundary, so a Next.js server component can import any component.

## What's inside

Interface components (buttons, cards, tables, tabs, menus, dialogs, forms), motion and media
(count-ups, entrances, galleries, full-screen navigation), the geometric decoration language
(stripes, halftone, brackets, cut corners), Arknights game-data pieces (rarity, profession, elite
and potential marks, skill levels, trust), operator dossiers and stage cards, skill sheets and
sealed records, and panels with feedback primitives (accordions, messages, toasts, steppers) —
the last three layers ported from [prts-design](https://github.com/MooncellWiki/prts-design).

Browse the [showcase](https://ak-ui-react.pages.dev) for live previews and copyable examples, or
read [`llms.txt`](./llms.txt) for the machine-readable design contract and component index — it
points at [`docs/api.md`](./docs/api.md), the generated reference with every prop, variant and method.

For documentation changes, `npm run build:api` regenerates the reference from the built
declarations, including complete object and tuple union types such as `AkRangeGrid`.
`npm run check:docs` checks examples in this README, `llms.txt` and the guide against that
reference, including both named and inline string literal unions with either JSX quote style.
Rebuild declarations after changing source APIs before regenerating the reference.

The showcase reuses syntax-highlighted React nodes while the generated source is unchanged.
Each tuning session enumerates overrides once and only clones instances whose props actually change.

## Port notes

### Local fixes to vendored CSS

The vendored upstream CSS is kept recognisable, but a few rules are deliberately different:

- **Breadcrumb hit area** — upstream ships no breadcrumb layer at all, so this one is added; its links get 24px-tall hit areas through padding plus an equal negative margin, which leaves the row rhythm untouched.
- **Choice hit area** — the `sm` checkbox is only 20px tall, so the label row keeps a 24px minimum height.
- **Standalone `AkSan` add button** — the container variants size the button themselves; the baseline gives it a size so a standalone meter does not fall back to the browser default button (29×21px).
- **Loading track label** — upstream hangs it 5.3rem outside the right edge of the track, where narrow screens cut it in half; here it is attached to the track end instead.
- **Tooltip class name** — upstream calls it `.ak-tooltip`, but that name belongs to `AkPopover` here (native Popover API), so the CSS-positioned bubble uses the sibling name `.ak-tip`.
- **Avatar shape** — square by default, matching this library's geometry; upstream's round avatar stays available as an explicit opt-in.
- **Narrow number steppers** — the four shortcuts use at most 80% of the control width, keeping the central value visible at every size tier in a narrow container.

Do not "restore" these to upstream values.

## Credits

Design tokens, SCSS and DOM controllers originate from
[YunYouJun/ak-ui](https://github.com/YunYouJun/ak-ui) (MIT, © 2019 云游君). The decoration and
game-data layers are derived from
[MooncellWiki/prts-design](https://github.com/MooncellWiki/prts-design) (MIT,
© 2026-present MooncellWiki). No game image assets were ported.

## License

MIT. Contributors: see [AGENTS.md](./AGENTS.md).
