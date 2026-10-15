# EV-02 / PAR-18 typed Parent agenda evidence

Status: ENGINEERING_VERIFIED_SUPPORTED_SLICE / DIRECT_COMPARISON_PARTIAL / HUMAN_REVIEW_PENDING

## Scope

This checkpoint adds typed school-event categories, a school-local Parent **From date** and category filter, and a privacy-minimal permitted calendar export. It preserves EV-01's frozen audience, live purpose/module checks, immutable versions, canceled-event history, replay and concurrency contracts.

PAR-18 remains partial. A combined Timetable/Event agenda, academic closure semantics and advanced event interactions remain outside EV-02.

## Authority and comparison

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html#/flow/PAR-18`
- Earlier unchanged reference captures: `docs/evidence/events-calendar-2026-10-15/reference-parent-desktop.png` and `reference-parent-mobile.png`
- Live populated Parent agenda: `parent-calendar-chromium.png` and `parent-calendar-mobile.png`
- Administrator category composition: `admin-compose-chromium.png` and `admin-compose-mobile.png`
- Published and Student regression states are retained beside those files.

The reference and application were directly inspected at 1440×1000 and 390×844. The application follows the approved shared shell, content width, hierarchy, typography scale, control sizing, spacing and responsive stacking. The approved artifact presents a three-stage review prototype, while the current-release application presents the real read-only agenda with server-authorized filters, export and detail navigation. This structural difference remains a documented, unaccepted reference deviation. Prototype-only review controls were not added to production.

## Verification

- Unit: `pnpm test:unit test/unit/events.test.ts` — PASS, 2/2.
- PostgreSQL: `pnpm test:functional test/functional/events-calendar.test.ts` — PASS, 3/3.
- Desktop browser: focused Chromium project, one worker — PASS, 1/1.
- Mobile browser: focused mobile project, one worker — PASS, 1/1.
- `pnpm typecheck` — PASS.
- Focused ESLint — PASS.
- `pnpm check:db-design` — PASS; 96 table contracts agree.
- `pnpm check:docs`, `pnpm check:boundaries` and `pnpm check:backend` — PASS.
- E2E-mode and final normal `pnpm build` — PASS.
- `pnpm demo:seed` — the Events fixtures completed idempotently and preserved prior records. Independent TEN-02, ACA-01 and BRD-02 refresh steps emitted preservation warnings and continued; no success is claimed for those refreshes.

The first focused PostgreSQL run exposed an incorrect asynchronous assertion in the new test. The production operation validates synchronously; the assertion was corrected and the changed test passed. No business assertion was weakened.

Migration `20261016120000_events_agenda_categories` is applied to the development and test databases. Both report 62 applied migrations. Existing rows remain truthfully categorized as `GENERAL`; new drafts require one approved typed category.

## Pending gates

- Human review of this checkpoint.
- Exact portable font parity.
- Native VoiceOver/NVDA evidence.
- TEN-03 database enforcement/context proof and other production gates.
