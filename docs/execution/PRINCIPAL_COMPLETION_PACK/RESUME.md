# Programme resume

Task/subtask: F07-A and WF-23/LEA-23 are **ENGINEERING_COMPLETE** at product checkpoint `F07_PRODUCT_COMMIT`. F07 remains **PARTIAL**. The exact next action is F07-B / LEA-24: reconcile the existing Timetable cover proposal with approved D09 and D02, write the narrow exact-occurrence cover LLD, and implement approval plus substitute acceptance without changing OPEN/submitted Attendance.

Approved decisions: D01 preserves the existing COORD-02/LEA-10 contract. On 17 October 2026 the repository owner explicitly approved D02–D19 for synthetic-only implementation exactly as recorded in `02_PRODUCT_DECISIONS.md`, with no exceptions. This does not authorize production enablement, purchases, provider selection, real external messages or payments, or invented emergency procedures. Human acceptance remains separate and PENDING.

Current matrix: 19 ENGINEERING_COMPLETE, five PARTIAL and 22 NOT_STARTED. Human review remains PENDING for all 46 Principal workflows.

Current verified product source: `F07_PRODUCT_COMMIT`. The normal build and focused E2E build both completed from the F07-A source. Current normal build ID: `z4pQqAZLYuGN_Fp_yPxa9`.

Current demo: the exact current-source demo is restored at `http://127.0.0.1:3400` after the checkpoint commit. Verify `/api/health` and the build identity again on resumption rather than assuming a long-running process survived.

Development migrations / test migrations: 80 applied and none pending in each database. Forward migration `20261017200000_people_operational_availability` adds the People recorder-grant, interval and immutable revision tables. No applied history was edited and no data was reset. Path-A policy metadata is recorded; TEN-03 remains incomplete and blocks production/real-client data.

F07-A outcome: separate recorder designation; branch-timezone safe intervals; UNKNOWN for missing evidence; safe Principal date/state/time projection with no source/private narrative; minimal `BUSY`/`FREE`/`UNKNOWN` cross-branch port; exact replay; expected-version revisions; account → Organization → School → interval locking; live account/membership/module/purpose checks; real recorder browser command and Principal reload. Exact-occurrence cover has not been implemented.

Verification: focused unit 4/4; real-PostgreSQL functional 2/2; TypeScript; focused ESLint; backend, boundaries, docs and 121-table database design; normal production build; sequential one-worker browser journey 2/2 Chromium and 2/2 mobile. Screenshots were directly inspected at 1440×1000 and 390×844. Evidence: `docs/evidence/principal-f07-availability-2026-10-17/README.md`.

Seed state: `pnpm demo:seed` completed against the guarded development database and preserved existing credentials/manual records. Private credentials remain in ignored `artifacts/leadership-01/private-demo.json` and `artifacts/people-02/private-demo.json`.

Pending gates: F07-B/LEA-24 cover, human review, font portability, native VoiceOver/NVDA, real browser 200% zoom, TEN-03, provider/restore/load review and production enablement. Do not mark these passed.
