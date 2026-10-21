# Add student field alignment — 22 October 2026

Human visual acceptance: **PENDING**.

## Scope and provenance

- Route: `http://127.0.0.1:3400/admin/students/register`
- Exact reference: `docs/ux/references/student-onboarding-approved/refined-onboarding.html#add`
- Application HEAD before this focused checkpoint: `a3afd6b`
- Verified production build: `U3PCwpgFZl_6ep0MNOa7t`
- Viewports: 1440×1000 and 390×844 CSS pixels, DPR 1, Playwright scale 1
- Development migration: `20261022110000_guardian_relationship`, applied forward without reset or backfill

## Resolved behavior

- The Parent / guardian section contains Full name, the descriptive Relationship enum (Mother, Father or Guardian), a full-row email field and the existing explicit portal-invitation action.
- Relationship is stored by the Guardians owner on the exact child-access row and is included in replay identity when present. It grants no authority and cannot select or merge identity. Omission retains the legacy canonical hash shape for older unresolved commands.
- Placement dates & roll number remains reachable when the Student is assigned later. Selecting a class reveals Effective from, Last day and optional Roll number. Last day is a necessary application deviation from the mock because the accepted Enrollment command owns an inclusive interval.
- Entering guardian details without the invitation action creates no unsupported contact-only record.
- The Guardian management drawer also collects and displays Relationship for newly authorized access; historical rows truthfully show “Not recorded”.
- The existing notice-purpose checkbox now reaches the already-authorized owner input; no new purpose or grant was introduced.

## Measured presentation

`final-metrics.json` records computed styles from the reference and served application. Both now use:

- page title: 28px/36px desktop and 24px/31px mobile, weight 650;
- section title: 14px/24px, weight 650;
- field label: 12px/18px, weight 550;
- desktop controls: 13px text, 40px height, 1px border;
- mobile controls: 16px text, 44px height, 1px border;
- no root overflow at either viewport.

The application uses loaded Inter and the active Forest theme tokens. Placeholder examples are intentionally muted gray. Literal reference colors are not hard-coded over the approved theme.

## Current acceptance evidence

- `reference-final-desktop.png`
- `application-final-empty-desktop.png`
- `application-final-placement-desktop.png`
- `reference-final-mobile.png`
- `application-final-empty-mobile.png`
- `application-final-placement-mobile.png`
- `final-metrics.json`

Files named `stale-cache`, `pre-title`, or lacking `final` are retained intermediate diagnostic captures and are not acceptance evidence.

## Verification

- `pnpm typecheck` — passed.
- `pnpm exec vitest run --config vitest.config.ts test/unit/guardian-policy.test.ts test/unit/student-onboarding.test.ts` — 4/4 passed.
- `pnpm check:backend` — passed.
- `pnpm check:boundaries` — passed.
- `pnpm check:db-design` — passed with the relationship column and constraint registered.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; final build above.
- Guarded `node scripts/database.mjs functional test/functional/guardians.test.ts` — **not run to assertions** because Prisma returned `Schema engine error` while preparing the designated test database. This is not reported as a functional pass. The development database migration applied successfully.

Production provider review, native VoiceOver/NVDA, TEN-03 and human acceptance remain pending.
