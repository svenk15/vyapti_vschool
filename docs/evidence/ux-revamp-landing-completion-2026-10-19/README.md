# Five-workspace landing correction evidence

Date: 19 October 2026 (Asia/Kolkata)

Executable application source: `271917a911c766c853fa561ec173c5dcd00bb855`

Production build ID: `Fv3qWOdG-v7QSU68zLxnF`

Demo: `http://127.0.0.1:3400`

Human visual acceptance: **PENDING**.

## Delivered scope

The correction is split across the requested focused checkpoints:

- `cd7736a` — shared calendar, attention, session-table and spacing corrections.
- `95839f5` — exact navigation mapping and permission-preserving regrouping.
- `c6c8a8f` — authorized role-specific landing projections.
- `271917a` — final permission-sensitive Parent/Principal corrections and current-source visual/browser evidence.

| Workspace | Required sections delivered | Remaining dependency | Functional verification | Visual comparison | Human acceptance |
|---|---|---|---|---|---|
| Administrator | Header/actions, summary, attention, sessions, bounded Events calendar, quick access, setup | None for the supported page; unavailable owner reads remain explicit | Current demo persona plus 3 authorized deep links; focused E2E at desktop/mobile | Direct 1440×1000 and 390×844 inspection complete | PENDING |
| Teacher | Current/next class, summary, register attention, Learning workload, classes, quick access | Teacher Events reader requires the recorded audience decision | Current demo persona plus Learning and Assessment deep links | Direct desktop/mobile inspection complete | PENDING |
| Student | Context, summary, next work, notices, classes, calendar, quick access | None for current granted purposes | Two accepted contexts and 4 authorized deep links | Direct desktop/mobile inspection complete | PENDING |
| Parent / guardian | Child context, factual Attendance, Learning, notices when granted, classes, calendar, quick access | None for current granted purposes | Two accepted child contexts and 4 authorized deep links | Direct desktop/mobile inspection complete | PENDING |
| Principal | Cross-owner summary, decisions/follow-ups, Attendance signals, quick access | Principal Events reader requires the recorded capability decision | Current demo persona plus Assessment and Coordination deep links | Direct desktop/mobile inspection complete | PENDING |

Teacher and Principal calendar decisions are recorded in `docs/execution/UX_REVAMP/LANDING_PROJECTION_DELTA.md`. Their unsupported states are truthful and do not broaden Events authority. Browser institution creation remains the independent UX-15 operator-principal dependency.

## Visual evidence

Production pages and expanded navigation are under `personas/`. Each role has desktop and mobile landing captures and separate desktop/mobile navigation captures. The private fixture values used to authenticate were not copied into this directory.

The shared calendar selected, verified-empty and failed/retry states are under `calendar/`. The shared candidate in all four palettes is under `themes/`. `candidate-intermediate.png` records the 900px stacked layout.

The earlier, superseded baseline is retained separately under `docs/evidence/ux-revamp-17-landings-2026-10-19/`; it was not overwritten. This comparison is between populated application states with equivalent roles and current authorized data. The Teacher, Parent, Student and Principal HTML packs remain workflow explorers rather than exact approved landing references.

Direct inspection found no root overflow, clipped actions or overlapping controls at 1440×1000, 900×1000 or 390×844. Desktop navigation scrolls independently above the account footer; mobile drawers keep focus inside, expose the footer, close with Escape and return focus to the opener. Computed body font was Inter with the generated Inter fallback. Native VoiceOver/NVDA and actual-browser 200% zoom remain unperformed gates.

## Verification

- Focused lint for the changed pages, gallery, persona verifier and landing E2E: passed.
- `pnpm exec tsc --noEmit`: passed.
- `pnpm check:backend`: passed.
- `pnpm check:boundaries`: passed.
- `pnpm check:docs`: passed before this final evidence update and is rerun for the documentation checkpoint.
- `pnpm test:unit test/unit/landing-calendar-model.test.ts`: 3/3 passed.
- Focused real-PostgreSQL Learning projection case: 1/1 passed after 119 migrations.
- Landing Playwright, Chromium, one worker: 3/3 passed, including the 900px breakpoint.
- Landing Playwright, mobile 390×844, one worker: 2/2 passed.
- Current-source persona verifier: 11/11 protected/public states passed against `http://127.0.0.1:3400`.
- Production build: passed with the repository's established 4 GiB Node heap; build ID above.

An initial desktop rerun exposed two stale test expectations: the verified one-week fixture correctly disables out-of-range navigation, and the new Administrator state says `Calendar could not be loaded` with Retry. The assertions were corrected to the approved bounded-range and failed-query semantics; no application behavior was weakened.

Release gates remain human visual acceptance, native accessibility, actual-browser 200% zoom, TEN-03 restricted-role/RLS evidence, provider/deployment configuration and production release approval.
