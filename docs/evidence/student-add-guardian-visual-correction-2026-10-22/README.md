# Add Guardian visual correction — 22 October 2026

## Provenance

- Working-tree base: `1a87c65649d6176704d8a94d5ed73456bf41fd0a`
- Production build: `b4gzkHnMT0zbXOVU9X1-H`
- Demo: `http://127.0.0.1:3400`
- Application route: `/admin/students/491a5bc0-5b6a-4751-bd05-207fadec0bc8`
- Exact reference state: `docs/ux/references/student-onboarding-approved/refined-onboarding.html#guardian`
- Viewports: 1440×1000 and 390×844 CSS pixels, DPR 1, visual scale 1

The application capture uses the fictional Avery Example record. The reference uses its embedded fictional Mira Shah record. No credential or session value is included here.

## Direct comparison

| State | Reference | Before | Corrected application |
|---|---|---|---|
| Desktop | [reference-add-guardian-desktop.png](reference-add-guardian-desktop.png) | [application-before-add-guardian-desktop.png](application-before-add-guardian-desktop.png) | [application-after-add-guardian-desktop.png](application-after-add-guardian-desktop.png) |
| Mobile | [reference-add-guardian-mobile.png](reference-add-guardian-mobile.png) | [application-before-add-guardian-mobile.png](application-before-add-guardian-mobile.png) | [application-after-add-guardian-mobile.png](application-after-add-guardian-mobile.png) |

Computed measurements are in [before-metrics.json](before-metrics.json) and [after-metrics.json](after-metrics.json). The final screenshots were directly inspected for proportion, hierarchy, alignment, density, clipping and action placement.

## Corrections

- Matched the 470px desktop drawer and full-width mobile composition, square drawer edge and 101px/96px headers.
- Matched the 21px/650 title, 12px/550 labels, 13px desktop fields, 16px mobile fields and muted supporting context.
- Matched 40px desktop and 44px mobile controls, one-pixel borders, 6px radii and reference padding.
- Matched the Portal access divider, 13px/600 heading, compact 16px checks and 32px/44px purpose rows.
- Matched the 73px/77px footer, 36px/44px buttons and intrinsic Cancel plus flexible primary action on mobile.
- Replaced implementation-oriented labels with the reference wording: Portal access, Child summary, Attendance, Timetable and Add & send invitation.
- Preserved initial focus, Escape close, focus return and zero root overflow at both viewports.

## Required production differences

- Relationship begins with **Select relationship**. The application does not presume Mother before the administrator chooses a relationship.
- **Also allow school notices for this child** remains available because it is an implemented, separately authorized optional purpose. The static reference does not show this supported production grant.
- Child summary, Attendance and Timetable are the fixed approved core bundle. They are presented as read-only included access rather than allowing the static mock to invent selective grant behavior.
- Forest theme tokens remain authoritative, so the application color values differ slightly from the reference's literal embedded colors while preserving the same visual roles and contrast.

## Verification

- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; TypeScript and production compilation passed.
- `pnpm exec eslint components/guardian-access-management.tsx test/e2e/students-registration.spec.ts` — passed.
- Signed-in Playwright comparison probe — passed at both viewports: bundled Inter loaded, no root overflow, initial focus reached Full name, Escape closed the drawer and focus returned to Add guardian.
- Backend, authorization, persistence, invitation recovery, schema, migrations and seed data were unchanged.

Human visual acceptance remains **PENDING**.
