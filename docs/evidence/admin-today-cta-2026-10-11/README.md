# Administrator Today CTA comparison — 11 October 2026

Human visual acceptance is **PENDING**. This checkpoint changes presentation only; authorized destinations and dashboard data remain unchanged.

## Comparison

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html`, populated `#/home` state.
- Reference capture: `docs/evidence/admin-today-2026-10-10/reference-populated-desktop.png` at 1440 × 1000.
- Application: `/admin`, authenticated with the fictional local administrator, captured in `today-desktop.png` at 1440 × 1000 and `today-mobile.png` at 390 × 844.

The earlier application inherited generic 44px, 14px/600 secondary buttons with the darker control border. The approved Today composition specifies 40px desktop CTAs, 8 × 14px padding, 8px radius and gap, 13px/550 text, `#DFE6DF` border, white surface, and `#213A32` text. It also uses an outline gear for School setup and outline arrows before attention and quick-action labels.

## Corrections

- School setup now uses the approved gear path instead of the school/building icon.
- Open register, Review import, and Review access now include the approved leading arrow.
- Quick actions and View setup use the same SVG arrow rather than a text glyph.
- Header, attention, and quick-action CTAs now share the approved desktop dimensions, border, background, text color, typography and icon spacing.
- Mobile retains 44px targets. Attention actions wrap beneath their row content rather than compressing the label column.

## Verification

`measurements.json` records the current computed styles. `node scripts/verify-admin-today-cta-local.mjs` asserted the exact desktop measurements and RGB values, approved gear/arrow paths, 44px mobile targets, and absence of document-level overflow. Focused ESLint, TypeScript, and the production build passed. The screenshots were inspected against the reference; differing dates, names and counts are current real synthetic records rather than presentation drift.
