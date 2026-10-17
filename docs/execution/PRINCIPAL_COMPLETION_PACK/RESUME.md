# Programme resume

Task/subtask: WF-16 / LEA-16 is **ENGINEERING_COMPLETE** for the approved fictional synthetic scope at source `68f9feca3fc02cec880452a56de6bf673afccd27`. Direct visual comparison is complete with documented format/font deviations. Human review remains **PENDING**.

Approved decisions: D01 preserves the existing COORD-02/LEA-10 contract. On 17 October 2026 the repository owner explicitly approved D02–D19 for synthetic-only implementation exactly as recorded in `02_PRODUCT_DECISIONS.md`, with no exceptions. This does not authorize production enablement, purchases, provider selection, real external messages or payments, or invented emergency procedures. Human acceptance remains separate.

Current matrix: 26 ENGINEERING_COMPLETE, four PARTIAL and 16 NOT_STARTED; all 46 Principal workflows are accounted for exactly once. The queue records WF-16 / LEA-16 together with the previously completed WF-42 / LEA-42, WF-07 / LEA-07, WF-41 / LEA-41 and WF-46 / LEA-46 checkpoints.

Current verified executable source: `68f9feca3fc02cec880452a56de6bf673afccd27` (`Complete Principal timetable staffing coverage`). Normal production build ID: `_gBV-mUK4GAsJAyKisGQL`; isolated browser build ID: `rllvncYayj5p8ZmrZneT4`. The current-source demo must run at `http://127.0.0.1:3400` and `/api/health` must report `ready:true`. Private Administrator/acting-Principal personas remain in ignored `artifacts/people-02/private-demo.json`; connected Principal/Timetable identifiers are in ignored `artifacts/leadership-01/private-demo.json` and `artifacts/timetable-01/private-demo.json`.

Development and test databases retain 87 forward migrations. No migration changed for LEA-16, neither database was reset and no applied migration was edited.

Verification for `68f9fec`: `pnpm check` passed lint, TypeScript, 30-task documentation checks, 136 database contracts, boundaries, portable backend and 209/209 unit tests. Focused real-PostgreSQL Timetable/Cover verification passed 3/3. Sequential one-worker Playwright passed 3/3 Chromium and 3/3 mobile; captures were directly inspected against approved LEA-16. Normal and isolated production builds passed. The incremental fictional Timetable verifier passed twice and preserved existing credentials/manual records. An accidental unfiltered functional invocation ran 208 tests successfully but remains a failed batch because of one pre-existing institution-context DTO expectation and the first LEA-16 fixture FK error corrected before the focused pass; it is not claimed as a suite pass. Evidence: `docs/evidence/principal-lea-16-timetable-2026-10-16/README.md`.

The next approved eligible partial is WF-27 / LEA-27, “Find a specific decision and open it” (F03, D03). Preserve source-owner authorization and the existing registered adapter boundary. Add exact-reference search plus only owner-supported type/state/due filters and deterministic due/submitted sorting with safe URL state. Do not invent a generic approval store or imply unsupported owner modules exist.

Pending gates: human review, font portability, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03, real-data retention/backup deletion and disclosure policy, provider/restore/load review and production enablement. Do not mark these passed.
