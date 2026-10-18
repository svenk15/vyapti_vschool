# UX-08 four-theme integrated checkpoint

Date: 18 October 2026 (Asia/Kolkata)

## Provenance and outcome

- Implementation source: `d57fe8c` (`Add idempotent UX theme demo fixture`).
- Standard production build: `BIXjEBxrscUilW5ZTAgW9`, built with the repository's established `NODE_OPTIONS=--max-old-space-size=4096` configuration.
- Schema state: all 118 forward migrations applied in development and the dedicated test database. UX-08 adds no migration.
- Engineering: VERIFIED. Direct visual inspection: COMPLETE for the captured states. Human acceptance: PENDING. Production: BLOCKED by the recorded release gates.

## Route and theme matrix

| Surface | Forest | Amethyst | Porcelain | Linen | Viewports/evidence |
|---|---:|---:|---:|---:|---|
| Shared component gallery | Yes | Yes | Yes | Yes | 1440×1000 and 390×844; ten copied checkpoint captures in this directory |
| Authorized appearance settings | Persisted/preview | Persisted/preview | Preview/cancel | Persisted/preview | Desktop and mobile captures in this directory |
| Administrator protected shell | Yes | — | — | Yes | Current-source UX-06 scope switch; unchanged by UX-07/08 presentation code |
| Teacher protected shell | Yes | — | — | — | Current-source UX-07 desktop/mobile timetable journey |
| Principal protected shell | Yes | — | — | — | Current-source UX-07 desktop/mobile inbox journey |
| Parent/Guardian protected shell | — | — | Yes | — | Current-source UX-07 desktop/mobile attendance journey |
| Student protected shell | — | Yes | — | Yes | Current-source UX-07 context switch at desktop/mobile |
| Public branded entry | Owner-published | Owner-published | Owner-published | Owner-published | UX-05 public projection; remains separate from protected tenant appearance |

A dash means that workspace was not redundantly captured under that theme; the same semantic tokens and shell implementation are exercised by the four-theme gallery and the listed protected-workspace coverage. No route obtains authority from its theme.

## Contrast evidence

The current `shared/contracts/branding.ts` values were measured using the production `contrastRatio` function. All recorded normal-text pairs exceed 4.5:1.

| Theme | Primary/on-primary | Text/canvas | Muted/surface |
|---|---:|---:|---:|
| Forest | 6.36 | 13.01 | 6.08 |
| Amethyst & Pearl | 6.86 | 14.31 | 5.91 |
| Porcelain & Ink | 7.49 | 14.06 | 5.53 |
| Linen & Bronze | 6.83 | 13.16 | 5.89 |

## Synthetic fixture

`pnpm demo:seed` now runs `scripts/demo-appearance.ts` as “UX-08 inherited and overridden appearance”. It uses only guarded Access commands and fictional `.example` identities. The institution starts Forest; one branch inherits it; a second branch has an explicit Amethyst override. The seed changes the institution to Linen to prove the override remains Amethyst, then restores Forest. Porcelain and Linen are recorded as preview choices. Two consecutive runs completed without duplicate records or credential replacement. The private ignored result is `artifacts/appearance-01/private-demo.json`; no passwords or tokens were printed.

The consolidated seed completed successfully. Older optional TEN-02, ACA-01 and BRD-02 refresh helpers reported preserved-state warnings/conflicts against existing development data; they are not UX-08 failures and no existing records were reset or overwritten.

## Verification

- Focused lint/type/boundary/backend checks passed for the fixture and browser correction.
- `pnpm test:functional test/functional/institution-context.test.ts`: 11/11 passed against real `vyapti_vschool_test`, including default/inherited/overridden appearance, stale write, replay, foreign scope, rollback, revoked receipt and constraints.
- Four-theme gallery, Chromium desktop: 5 scenarios exercised; the theme matrix passed. One stale Sort assertion failed before the test was aligned with the already-approved compact toolbar; its focused rerun passed 1/1.
- Four-theme gallery, mobile Chromium: 5/5 passed.
- Authorized appearance settings: desktop 1/1 and mobile 1/1 passed.
- UX-07 current-source protected-workspace runs remain applicable: Student, Parent, Teacher and Principal passed at desktop and mobile; Administrator protected theme and context evidence remains applicable from UX-06 because UX-07/08 did not change that shell implementation.
- `pnpm check`: passed lint, typecheck, documentation validation, database design (204 registered tables), boundaries, backend compilation and 59 unit files/261 tests.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build`: passed; build ID `BIXjEBxrscUilW5ZTAgW9`.
- Final documentation validation and `git diff --check` are recorded in the evidence commit.

## Direct inspection

The four desktop gallery captures were inspected side by side. Theme changes affect semantic color values while typography, alignment, density, feedback hierarchy, table containment, workspace preview and authentication composition remain consistent. Representative mobile and appearance-settings captures were inspected for stacking, selected state, action placement and document overflow. The Parent mobile context label clipping found during UX-07 is fixed in the current source.

These captures are current-source copies stored separately so the task does not stage overwritten historical evidence. They are automated Chromium renders. They do not prove native assistive-technology behavior or actual browser zoom.

## Remaining gates

- Human visual acceptance is PENDING.
- Native VoiceOver and NVDA are unperformed.
- Actual-browser 200% zoom is unperformed. Playwright viewport/device-scale behavior is not relabelled as browser zoom.
- TEN-03 restricted-role/RLS proof, provider/deployment configuration, real-client data authorization and production release remain incomplete.
