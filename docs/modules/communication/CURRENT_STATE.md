# Communication — current state

Last updated: 15 October 2026.

COM-01 is **ENGINEERING_VERIFIED**. COM-02 is **ENGINEERING_VERIFIED** for Student text-notice read/acknowledgement and safe withdrawal; STW-27 remains partial only for attachments because their file-owner contract is absent, while STW-28 is engineering-complete. The portable domain/application boundary, Prisma adapter, composition/server gateway, forward migrations, Administrator staged publication/withdrawal, Parent and Student Messages/read/acknowledgement and focused unit/PostgreSQL/browser checks are implemented. Human review is **PENDING**.

The Student projection and direct reference comparison are recorded in [COM-02 evidence](../../evidence/communication-stw-27-28-2026-10-15/README.md).

## Evidence so far

- Unit: `test/unit/communication-notices.test.ts` 3/3 passed.
- Real PostgreSQL: `test/functional/communication-notices.test.ts` 2/2 passed against `vyapti_vschool_test` after 52 migrations. It proves exact notice purpose, explicit publisher grant, frozen recipient manifest, publication replay, separate read/ack evidence, acknowledgement replay, Administrator aggregate and denial after child-access revocation.
- Playwright: the complete Administrator publish → Parent read → acknowledge → reload journey passed 1/1 in desktop Chromium and 1/1 in mobile Chromium, sequentially with one worker. Direct 1440×1000 and 390×844 reference/application captures were inspected; the initial mobile capture exposed a grid cascade defect, which was corrected and recaptured.
- Student projection PostgreSQL: `test/functional/communication-student-notices.test.ts` 2/2 passed after 53 migrations. It proves frozen typed recipients, no later-purpose backfill, transfer preservation, current-purpose revocation, cross-Student denial, separate read/acknowledgement replay, safe withdrawal and stale withdrawal rejection.
- Current-source Playwright: the combined Administrator publish → Parent acknowledgement → Student acknowledgement → staged withdrawal → safe Student recovery journey passed 2/2 in desktop Chromium and 2/2 in mobile Chromium with one worker. The exact approved Student reference and application were inspected at matching viewports. One mobile run encountered a transient Next 404 and the unchanged focused rerun passed; no assertion or timeout was weakened.
- `pnpm check:db-design`, `pnpm check:boundaries`, `pnpm check:backend`, `pnpm check:docs`, `pnpm lint`, TypeScript and the production build passed for this slice. `pnpm demo:seed` includes the Communication fixture and writes private credentials only to the ignored `artifacts/communication-01/private-demo.json`.
- Development and test schemas contain four forward migration checkpoints. The first local development attempt exposed a Section composite-key mismatch and retained two DDL objects; it was recorded rolled back/applied through Prisma, and the additive recovery migration completed the missing schema without reset or deletion. Fresh test application applied the base and recovery migrations successfully. The final additive metadata migration records Path A ownership without rewriting applied history.

## Remaining limitations and next action

SA-35 remains partial beyond the delivered publication/withdrawal slices: durable drafts, tabs for drafts/delivery follow-up, scheduling, email/provider delivery, corrections, teacher authoring and private conversations are unimplemented and were not represented as working controls. PAR-14 and STW-28 are engineering-complete for their approved text-notice acknowledgement outcomes. STW-27 is partial only for attachments pending a scanned-file owner, recipient grant and expiring download contract. The approved-reference font has unresolved redistribution provenance, so the documented application fallback remains. Human review, native accessibility, TEN-03 and production provider review remain pending.

## 16 October 2026 — Principal notice coverage

The Communication-owned `notice-coverage.v1` read projection is VERIFIED; the complete LEA-34 follow-up workflow remains PARTIAL and human review is PENDING. A current Principal with the distinct `communication.read_leadership` capability can read one repeatable branch snapshot of current immutable publication versions and their separate eligible, first-read and explicit-acknowledgement counts. The DTO and route contain no recipient identity, notice body, contact or family relationship detail. Publication authority remains independently granted and is not implied by the Principal role.

Focused evidence: Access unit 10/10, real PostgreSQL Communication 3/3, and the combined current-source Communication journey 3/3 Chromium plus 3/3 mobile, sequentially with one worker. Desktop/mobile reference and application captures were directly inspected. No schema or migration changed; both local databases retain all 64 migrations. `pnpm demo:seed` continues to create or preserve the existing fictional Parent/Student notices and now verifies their Principal aggregate coverage. See [evidence](../../evidence/principal-lea-34-communication-2026-10-16/README.md).

At this 16 October checkpoint reminder/resend was not implemented. The following COM-03 checkpoint supersedes that limitation for durable portal reminders; external provider delivery remains unavailable.

## 17 October 2026 — COM-03 / LEA-34 portal acknowledgement reminders

COM-03 and LEA-34 are **ENGINEERING_VERIFIED** for the approved synthetic-only portal-reminder outcome; human review remains **PENDING**. The Principal starts from current notice coverage, reviews aggregate current eligibility, confirms the exact immutable publication version and receives a durable aggregate receipt. Recipient identity, notice body, contact and family relationship data never enter the Principal DTO.

The Communication owner now stores a logical reminder and per-recipient outcomes. It reauthorizes the current Principal and the separate operator-designated reminder-manager grant, then intersects the frozen audience with current exact notice-purpose access. Already acknowledged, revoked, inactive, 24-hour-limited and max-three recipients are suppressed without being reported as contacted. Exact actor/key/payload replay returns the original semantic receipt; a changed payload conflicts, and revoked authority cannot disclose a protected replay. Parent and Student notice details expose only their own durable portal-reminder count and latest time under their existing live purpose checks. Email/provider delivery is not simulated.

Focused evidence: Communication unit 4/4; real-PostgreSQL Communication 4/4 after 77 forward migrations; focused Administrator publish/Parent acknowledgement → Principal reminder → Student portal-item browser journey 2/2 in Chromium and 2/2 in mobile Chromium, sequentially with one worker. TypeScript, focused ESLint, backend/boundary/docs/database-design checks and the production build passed. Desktop/mobile reference and application captures were directly inspected. See [evidence](../../evidence/principal-f10-communication-reminder-2026-10-17/README.md).

F10 remains **IN_PROGRESS** because the distinct author/reviewer/publisher lifecycle for LEA-33 is not yet complete. Production provider selection/review, TEN-03, font portability, native accessibility and human review remain pending.

### LEA-39 notice-coverage export — 16 October 2026

The owner projection now reports the exact current-publication total and applies its validated bound after the current-version join. Reporting consumes only that port, refuses more than 50 rows without truncation, neutralizes spreadsheet formulas and excludes recipient/account/Student identity, body, contact/family detail, delivery inference and reminder authority. Preview and generation independently recheck Principal Communication read, all Communication dependencies and the operator-designated branch export grant. No schema or migration changed; both local databases retain 67 migrations.

Focused evidence: reporting unit 14/14; real-PostgreSQL Communication/Reporting 1/1, including `total:2` with a one-row owner page, no automatic grant, explicit grant/revocation and private-field exclusion; sequential one-worker Communication journeys 3/3 desktop and 3/3 mobile; Playwright's isolated production build passed. The export captures were directly inspected against immutable LEA-39. See [evidence](../../evidence/principal-lea-39-communication-export-2026-10-16/README.md). Human review and the existing font/native-accessibility/TEN-03/production-provider gates remain pending.
