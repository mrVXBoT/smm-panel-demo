# Design System — Character-led SMM Storefront

## Approved direction
Combine **ROBO·X-style bold 3D mascot and floating objects** with **Growfollows-style SMM-specific social service illustrations**. These are inspiration references only: create an original character, artwork and layout; do not copy protected assets.

## Experience
This is a service-commerce storefront first, analytics dashboard second. Landing hero centers a distinctive original animated mascot, floating Telegram/social motifs, clear service categories and a primary "Explore Services" CTA. Purchase flows stay highly readable.

## Visual language
Playful premium, dark base, bright electric cyan/blue accents with selective violet; restrained glow, rounded asymmetric cards, depth through layered illustrations and soft shadows. Avoid generic chart-heavy SaaS templates.

## Core pages
- Landing: mascot hero, floating 3D social tokens, category carousel, featured service cards, animated process steps, FAQ and CTA.
- Services: illustrated Telegram Stars, Premium, Boosts and fictional Virtual Numbers cards; search/filter.
- Order: clean, accessible dynamic form, price summary, tasteful animated completion state.
- Wallet: simulated Visa/Mastercard method selection and demo-only receipt.
- Customer/admin: clear functional dashboard with light mascot accents, not intrusive 3D everywhere.

## Motion system
Use Motion for UI transitions and scroll reveals; Rive for original interactive mascot (preferred) or Spline for an optimized 3D scene. Lazy-load heavy animations; honor prefers-reduced-motion and provide static fallbacks. Avoid animation that blocks purchasing.

## Palette & typography
Dark background #0B1120, dark surface #111B2E, elevated #18263D, primary #38BDF8, accent #A78BFA, text #F1F5F9, muted #94A3B8. Light background #F8FAFC, surface #FFFFFF, text #0F172A. Success #22C55E, warning #F59E0B, danger #EF4444.
Inter for Latin and Vazirmatn for Persian; 14–16px body, tabular financial figures.

## Layout & components
Desktop sidebar 256px, topbar 64px, max width 1440px. Mobile drawer or bottom navigation. 8px spacing scale, card radius 16px. MascotHero, FloatingSocialTokens, IllustratedServiceCard, ServiceSelector, OrderForm, StatusBadge, WalletCard, DemoCheckout, Receipt, DataTable, EmptyState, Skeleton, Toast.

## Accessibility & performance
Keyboard-friendly dialogs, visible focus, contrast-tested text, responsive layouts, loading/empty/error states. Compress 3D assets; keep first render fast. No real card collection or provider fulfillment; show persistent DEMO labels.

## Implementation acceptance
Present original mascot concepts before committing to final 3D assets. Build functional page structure before animation polish. Mobile, reduced-motion and slow-device fallbacks must work.

## Approved interactive mascot experience (2026-11-14)
The mascot is a functional part of the demo customer journey, not merely decoration.
- Idle: subtle breathing/blinking; pointer-follow only when pointer is fine and reduced motion is off.
- Service hover/selection: mascot acknowledges the category; Stars displays floating coins, Premium displays gift/crown, Boosts displays upward motion, Numbers displays a fictional SIM icon.
- Order validation: helpful non-blocking feedback; never obscure form fields.
- Mock checkout success/failure: distinct celebratory/recovery reactions, explicitly labeled DEMO.
- Loading: short loop with static fallback; avoid blocking the flow.
- Mobile: tap-driven states, no pointer dependency.
### Implementation choices
Motion for standard UI transitions; Rive state machine for original mascot; GSAP ScrollTrigger only for landing story sections. Spline optional and lazy-loaded for one or two hero/product scenes. dotLottie optional for lightweight status icons. Avoid duplicating animation responsibilities.
### Performance & acceptance
Lazy-load mascot and 3D assets; static poster fallback; prefers-reduced-motion honored; no layout shifts; animation never blocks keyboard navigation, purchases or readability. Add acceptance tests for state transitions and reduced-motion behavior.
