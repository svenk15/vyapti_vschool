# LEA-02 Principal branch-context isolation evidence

Status: engineering verified; direct visual comparison complete with documented composition deviation; human review pending.

The approved authority is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow **LEA-02 — Switch branches without losing context**. The application routes are `/leadership/context`, `/leadership`, `/leadership/attendance` and the scoped Attendance source route.

The focused journey provisions two explicitly granted Principal branches with separate real Attendance sessions. It starts from a filtered West coverage page, chooses the server-returned East destination, completes the staged unfinished-work review and confirms the switch. The destination home and coverage page show East data only, the former `status/sort/order` URL state is absent, and an attempted West session deep link returns the destination-scoped unavailable state. No browser value becomes tenant authority.

## Verification

- Focused ESLint and `tsc --noEmit`: passed for the new journey.
- Focused Playwright, sequentially with one worker: Chromium 2/2 and mobile 2/2 passed against `vyapti_vschool_test`; all 64 migrations were applied with none pending.
- The first command mistakenly forwarded a literal `--` through the repository wrapper and began the broad suite; it was stopped after one unrelated existing test passed. The corrected direct argument form ran only the two LEA-02 cases per project.
- The unchanged Access transaction/grant evidence from LDR-01 and Attendance scope/revocation evidence from LEA-08 remain applicable. This checkpoint changes no product code, schema, migration, permission, transaction or seed contract.
- Documentation validation and diff checks are recorded with the checkpoint commit.

## Visual inspection

The approved source is a fictional workflow-review dialog; the application demonstrates the contract through the production Principal shell and real branch-scoped Attendance data. Direct inspection at 1440×1000 and 390×844 confirmed readable hierarchy, no overflow, distinct branch identity and records, cleared filter presentation, and a safe denial state.

- Desktop: [approved LEA-02](reference-chromium.png), [West before switch](application-west-chromium.png), [East after switch](application-east-chromium.png), [old deep link denied](application-old-deep-link-denied-chromium.png).
- Mobile: [approved LEA-02](reference-mobile.png), [West before switch](application-west-mobile.png), [East after switch](application-east-mobile.png), [old deep link denied](application-old-deep-link-denied-mobile.png).

The dialog/page composition difference, exact font portability, native VoiceOver/NVDA, TEN-03, production controls and human acceptance remain pending. Credentials remain only in ignored mode-0600 `artifacts/leadership-01/private-demo.json`.
