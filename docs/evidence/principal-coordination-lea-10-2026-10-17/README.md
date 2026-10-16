# LEA-10 bounded bulk Attendance follow-up evidence

Approved authority: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow `LEA-10 — Follow up multiple missing registers safely`.

Implemented entry: `/leadership/attendance` → explicit due-register selection → `/leadership/coordination/bulk` → durable `/leadership/coordination/batches/:id` receipt.

## Verification

- Unit: Coordination request and 1–50 unique-selection validation, 4/4 passed.
- Real PostgreSQL: Coordination suite, 10/10 passed. It covers mixed outcomes, exact replay and changed-payload conflict, committed-item recovery, concurrent batches, cross-scope/forged candidates, ineligible assignment, revocation and protected receipt disclosure.
- Playwright with one worker: focused LEA-10 application and approved-reference tests passed on desktop Chromium and the 390×844 mobile project. The flow verifies explicit selection, final-only mutation, response-loss retry, persisted mixed receipt, focus, query-change clearing and no viewport overflow.
- Builds: dedicated E2E and normal production builds passed with the LEA-10 routes. Backend extraction, boundary, database-design, documentation, type and focused lint checks passed.
- Demo: `pnpm demo:seed` completed and preserved existing records while adding the connected overdue source and durable batch examples.

## Captures and direct inspection

- `reference-lea-10-chromium.png` and `reference-lea-10-mobile.png`: unchanged approved workflow-explorer state.
- `application-selection-chromium.png` and `application-selection-mobile.png`: production Attendance source selection after the sort change cleared the prior selection.
- `application-result-chromium.png` and `application-result-mobile.png`: durable honest result with one created, one already-existing and one failed item.

The approved dialog defines the workflow order and interactions, while the production implementation uses the persistent Principal shell, a routed staged form and a durable receipt. Typography, spacing, badge hierarchy and responsive card treatment use the approved shared recipes. The modal-versus-route composition and the documented portable-font exception remain explicit deviations. Human acceptance and native accessibility evidence remain PENDING.

An initial focused run accidentally received an older `.next-e2e` build and was discarded; the dedicated target was rebuilt before the recorded results. A subsequent visual inspection found a mobile table-width override, which was fixed and reverified with an explicit no-overflow assertion.
