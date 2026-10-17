# F05 / LEA-41 leadership brief evidence

Human review: **PENDING**. Deployment: **SYNTHETIC_ONLY**.

## Scope

The production route is `/leadership/briefs/new`, with revision/detail routes under `/leadership/briefs/{id}`. The approved source is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow state `LEA-41 — Prepare a leadership review brief`.

The implementation uses the approved choose evidence/audience → review narrative → save revision → finalize → separately share sequence. It uses the production Principal shell and recipe-W pages instead of copying the workflow-explorer dialog. It exposes only immutable whole-branch Attendance snapshot facts, bounded human interpretation and explicit permitted recipients.

## Verification

- Application validation: `test/unit/reporting-leadership-brief.test.ts`, 2/2 passed.
- Real PostgreSQL: `test/functional/reporting-leadership-brief.test.ts`, 1/1 passed against `vyapti_vschool_test` with 85 migrations.
- Browser: `test/e2e/principal-leadership-brief.spec.ts`, sequential one-worker Chromium 2/2 and mobile 2/2.
- Focused lint, TypeScript, backend and database-design checks passed before the final repository checkpoint.
- Guarded fictional seed helper passed twice without duplicate brief/revision creation. The private result remains in ignored `artifacts/leadership-01/private-demo.json`.

PostgreSQL evidence covers separate explicit grants, subgroup-source rejection, append-only revision history, stale version, exact replay and key conflict, share/read reauthorization, first-read recording, comparison-grant revocation and withdrawal denial. The browser journey deliberately loses the committed create response and recovers using the same payload/key before finalizing and sharing.

## Visual comparison

- [Reference desktop](reference-chromium.png)
- [Application author desktop](application-author-chromium.png)
- [Application recipient desktop](application-recipient-chromium.png)
- [Reference mobile](reference-mobile.png)
- [Application author mobile](application-author-mobile.png)
- [Application recipient mobile](application-recipient-mobile.png)

The captures were directly inspected for hierarchy, spacing, action placement, wrapping and overflow. A measured mobile defect in the lifecycle metric and long recipient address was fixed by the final mobile composition. The reference is a catalogue/workflow dialog rather than a complete production screen, so the shared shell, routed detail, source fact cards and reviewed-audience evidence are documented production adaptations. Font portability, native VoiceOver/NVDA and actual browser 200% zoom remain unperformed gates.

## Database and release limits

Migration `20261017233000_reporting_leadership_briefs` adds six forward-only registered Path A institution tables. Development and test both have 85 migrations. TEN-03 enforcement remains incomplete. Real-data retention, backup deletion and aggregate-disclosure policy are unresolved, so default availability stays disabled outside explicit fictional synthetic mode. No external message, downloadable brief or acknowledgement claim is implemented.
