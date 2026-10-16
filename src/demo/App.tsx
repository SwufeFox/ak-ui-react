import { useState, type ReactNode } from 'react'
import {
  AkAssetLoader,
  AkButton,
  AkCard,
  AkCardContent,
  AkCardDescription,
  AkCardFooter,
  AkCardHeader,
  AkCardTitle,
  AkCountUp,
  AkGauge,
  AkInputNumber,
  AkMediaGallery,
  AkMobileMenu,
  AkNotice,
  AkParticleField,
  AkProgress,
  AkSectionNavigator,
  AkSegmented,
  AkSlider,
  AkStatus,
  AkTabs,
  AkTag,
} from '../ak'
import { galleryItems } from './gallery-art'
import './demo.css'

function Block({ eyebrow, title, note, children }: { eyebrow: string; title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section className="demo-block">
      <span className="demo-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {note ? <p className="demo-note">{note}</p> : null}
      {children}
    </section>
  )
}

const shellSections = [
  { id: 'shell-command', label: 'Command', title: 'COMMAND DECK', body: 'Scroll, drag or use the arrow keys — the controller snaps between uniquely identified sections.' },
  { id: 'shell-archive', label: 'Archive', title: 'ARCHIVE', body: 'Section navigation syncs the hash and drives an entrance animation per section.' },
  { id: 'shell-relay', label: 'Relay', title: 'RELAY', body: '`AkSectionNavigator` requires a viewport plus sections with unique ids — every block below satisfies that contract.' },
]

/** Demonstrates the real contract: a viewport wrapping uniquely identified sections. */
function SiteShellDemo() {
  const [current, setCurrent] = useState(shellSections[0].id)

  return (
    <div className="demo-shell">
      <AkSectionNavigator syncHash={false} onChange={(id) => setCurrent(id)}>
        <header className="ak-site__header">
          <span className="ak-site__eyebrow">AK-UI SITE SHELL</span>
          <nav className="ak-site__nav" aria-label="Sections">
            {shellSections.map((section) => (
              <a key={section.id} href={`#${section.id}`} data-ak-section-link aria-current={current === section.id ? 'location' : undefined}>
                {section.label}
              </a>
            ))}
          </nav>
        </header>
        <div className="ak-site__viewport" data-ak-section-viewport>
          {shellSections.map((section) => (
            <section key={section.id} id={section.id} className="ak-site__section" data-ak-section>
              <div data-ak-section-content>
                <span className="ak-site__eyebrow">SECTION / {section.label}</span>
                <h2>{section.title}</h2>
                <p className="ak-text">{section.body}</p>
                <div className="demo-row">
                  <AkTag variant="advanced">Section {shellSections.findIndex((s) => s.id === section.id) + 1} / {shellSections.length}</AkTag>
                </div>
              </div>
            </section>
          ))}
        </div>
      </AkSectionNavigator>
    </div>
  )
}

export function App() {
  const [tab, setTab] = useState('overview')
  const [segment, setSegment] = useState('all')
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [slider, setSlider] = useState(42)
  const [count, setCount] = useState(1280)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="demo-page">
      <header className="demo-header">
        <div>
          <span className="demo-eyebrow">AK-UI · REACT PORT</span>
          <h1>Arknights-inspired design system</h1>
        </div>
        <AkStatus label="SYSTEM" detail="Online" />
      </header>

      <main className="demo-main">
        <Block eyebrow="01 / ACTIONS" title="Button & Tag" note="Variant-driven BEM class names, ported one-to-one from the Vue registry.">
          <div className="demo-row">
            <AkButton>Default</AkButton>
            <AkButton variant="outline">Outline</AkButton>
            <AkButton variant="action">Action</AkButton>
            <AkButton variant="advanced">Advanced</AkButton>
            <AkButton variant="light">Light</AkButton>
            <AkTag>Tag</AkTag>
            <AkTag variant="advanced">Advanced</AkTag>
            <AkTag variant="danger">Danger</AkTag>
            <AkTag variant="neutral">Neutral</AkTag>
          </div>
          <div className="demo-row" style={{ marginTop: 'var(--ak-space-4)' }}>
            <AkButton variant="action" icon={<span aria-hidden="true">◈</span>}>With icon</AkButton>
            <AkButton variant="outline" block style={{ maxWidth: '16rem' }}>Block</AkButton>
            <AkButton disabled>Disabled</AkButton>
          </div>
        </Block>

        <Block eyebrow="02 / SURFACES" title="Card" note="`AkCard` renders any element via `as`, with header / title / content / footer slots.">
          <div className="demo-grid">
            <AkCard as="article">
              <AkCardHeader>
                <AkCardTitle>Default card</AkCardTitle>
                <AkCardDescription>Standard containment surface.</AkCardDescription>
              </AkCardHeader>
              <AkCardContent className="ak-text">Body copy using the shared typography token.</AkCardContent>
              <AkCardFooter>
                <AkButton variant="outline">Inspect</AkButton>
              </AkCardFooter>
            </AkCard>
            <AkCard as="article" variant="outline">
              <AkCardHeader>
                <AkCardTitle>Outline card</AkCardTitle>
                <AkCardDescription>Hairline framing variant.</AkCardDescription>
              </AkCardHeader>
              <AkCardContent className="ak-text">variant=&quot;outline&quot;</AkCardContent>
            </AkCard>
            <AkCard as="article" variant="stripe">
              <AkCardHeader>
                <AkCardTitle>Stripe card</AkCardTitle>
                <AkCardDescription>Accent band variant.</AkCardDescription>
              </AkCardHeader>
              <AkCardContent className="ak-text">variant=&quot;stripe&quot;</AkCardContent>
            </AkCard>
          </div>
        </Block>

        <Block eyebrow="03 / FEEDBACK" title="Notice, Status, Progress & Gauge">
          <div className="demo-stack">
            <AkNotice title="Mission briefing" code="RI / INFO">All operators report to the command deck before deployment.</AkNotice>
            <AkNotice variant="warning" title="Caution" code="RI / WARN">Originium density above threshold in sector 04.</AkNotice>
            <AkNotice variant="danger" title="Critical" code="RI / CRIT">Hull breach detected — evacuation protocol engaged.</AkNotice>
            <AkNotice variant="success" title="Deployment complete" code="RI / OK">All squads have reached their assigned positions.</AkNotice>
          </div>
          <div className="demo-row" style={{ marginTop: 'var(--ak-space-4)' }}>
            <AkStatus label="Network" detail="Stable" />
            <AkStatus label="Reactor" detail="48%" variant="warning" />
            <AkStatus label="Hull" detail="Breach" variant="critical" />
            <AkStatus label="Relay" detail="Down" variant="offline" />
          </div>
          <div className="demo-stack" style={{ marginTop: 'var(--ak-space-4)' }}>
            <AkProgress label="Deploy progress" value={72} />
            <AkProgress label="Integrity" value={18} variant="danger" valueLabel="CRITICAL" />
          </div>
          <div className="demo-row" style={{ marginTop: 'var(--ak-space-4)' }}>
            <AkGauge label="Deploy" value={64} unit="percent" />
            <AkGauge label="Heat" value={88} unit="percent" variant="warning" />
          </div>
        </Block>

        <Block eyebrow="04 / INPUTS" title="Slider, InputNumber & Segmented">
          <div className="demo-stack">
            <AkSlider label="Volume" value={slider} onValueChange={(v) => setSlider(Number.isFinite(v) ? v : 0)} />
            <span className="ak-text">Slider value: <span className="demo-inline-value">{slider}</span></span>
            <AkInputNumber value={slider} max={100} onValueChange={setSlider} />
            <AkSegmented
              ariaLabel="Filter"
              options={[
                { label: 'All', value: 'all' },
                { label: 'Ground', value: 'ground' },
                { label: 'Air', value: 'air' },
              ]}
              value={segment}
              onValueChange={(v) => setSegment(v ?? 'all')}
            />
            <span className="ak-text">Selected: <span className="demo-inline-value">{segment}</span></span>
          </div>
        </Block>

        <Block eyebrow="05 / NAVIGATION" title="Tabs" note="Arrow keys, Home and End move focus between tabs and panels are wired with aria-controls.">
          <AkTabs
            ariaLabel="Operator dossier"
            items={[
              { value: 'overview', label: 'Overview', eyebrow: 'DOSSIER / 001', title: 'Overview', description: 'General deployment profile.' },
              { value: 'skills', label: 'Skills', eyebrow: 'DOSSIER / 002', title: 'Skills', description: 'Combat and support abilities.' },
              { value: 'archive', label: 'Archive', eyebrow: 'DOSSIER / 003', title: 'Archive', description: 'Restricted background records.' },
            ]}
            value={tab}
            onValueChange={(v) => setTab(v ?? 'overview')}
            renderPanel={(item) => (
              <p className="ak-text">
                Panel body for <strong>{item.value}</strong>.
              </p>
            )}
          />
        </Block>

        <Block eyebrow="06 / EFFECTS" title="CountUp & ParticleField" note="Both drive the framework-agnostic controllers vendored in src/ak/core.">
          <div className="demo-stack">
            <div className="demo-row">
              <span style={{ fontSize: '2rem' }}>
                <AkCountUp value={count} duration={900} />
              </span>
              <AkButton variant="outline" onClick={() => setCount((c) => c + 256)}>+256</AkButton>
              <AkButton variant="outline" onClick={() => setCount(0)}>Reset</AkButton>
            </div>
            <div className="demo-canvas">
              <AkParticleField count={70} pattern="orbit" renderer="auto" />
              <span className="demo-canvas-label">Canvas particle field — WebGL with a 2D fallback.</span>
            </div>
          </div>
        </Block>

        <Block eyebrow="07 / GALLERY" title="MediaGallery" note="Controller-managed carousel: prev/next, selectors, swipe gestures and an expanded dialog. The active index is mirrored back through `onValueChange`.">
          <AkMediaGallery items={galleryItems} value={galleryIndex} onValueChange={setGalleryIndex} />
          <p className="demo-note" style={{ marginTop: 'var(--ak-space-4)', marginBottom: 0 }}>
            Active index: <span className="demo-inline-value">{galleryIndex}</span>
          </p>
        </Block>

        <Block eyebrow="08 / SITE" title="AssetLoader & MobileMenu">
          <div className="demo-stack">
            <AkAssetLoader
              label="Resources"
              tasks={[
                () => new Promise((resolve) => setTimeout(resolve, 400)),
                () => new Promise((resolve) => setTimeout(resolve, 900)),
                () => new Promise((resolve) => setTimeout(resolve, 1500)),
              ]}
            />
            <div>
              <AkButton variant="outline" onClick={() => setMenuOpen(true)}>Open mobile menu</AkButton>
              {menuOpen ? <span className="ak-text"> (see the dialog rendered below)</span> : null}
            </div>
            <div>
              <AkMobileMenu label="Menu" closeLabel="Close">
                <a className="ak-nav__link" href="#shell-command">Command</a>
                <a className="ak-nav__link" href="#shell-archive">Archive</a>
                <a className="ak-nav__link" href="#shell-relay">Relay</a>
              </AkMobileMenu>
            </div>
          </div>
        </Block>

        <Block eyebrow="09 / SECTION NAVIGATOR" title="Site shell" note="Scroll-snap navigation with hash sync, per-section entrance animation and cancellable transitions. Sections must have unique ids behind a `[data-ak-section-viewport]`.">
          <SiteShellDemo />
        </Block>
      </main>
    </div>
  )
}
