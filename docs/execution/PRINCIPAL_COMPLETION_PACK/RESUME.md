# Programme resume

Task/subtask: F02 and WF-03/LEA-03 are **ENGINEERING_COMPLETE** at product checkpoint `a3c7da1`. F04 plus F02 closes the composite LEA-26 handover workflow. The exact next action is F07 / D09: reconcile the existing People availability and Timetable cover contracts, write the narrow owner LLD for safe availability intervals and one exact occurrence cover, then implement the earliest independent counterpart without widening Teacher access or changing open/submitted Attendance.

Approved decisions: D01 preserves the existing COORD-02/LEA-10 contract. On 17 October 2026 the repository owner explicitly approved D02–D19 for synthetic-only implementation exactly as recorded in `02_PRODUCT_DECISIONS.md`, with no exceptions. This does not authorize production enablement, purchases, provider selection, real external messages or payments, or invented emergency procedures. Human acceptance remains separate and PENDING.

Current matrix: 18 ENGINEERING_COMPLETE, five PARTIAL and 23 NOT_STARTED. Human review remains PENDING for all 46 Principal workflows.

Current verified product source: `a3c7da1`. Normal production build `qCk9yMBZEprYlJB1zrOXP` passed. Focused isolated desktop/mobile browser runs used the same application source.

Current demo: `http://127.0.0.1:3400` is running build `qCk9yMBZEprYlJB1zrOXP`; `/api/health` returned `ready:true` after restart from the product checkpoint.

Development migrations / test migrations: 79 applied and none pending in each database. `20261017190000_access_leadership_delegations` adds the scoped D02 root, actions, receipts and events. Because that migration had already been applied before the database-design checker exposed missing canonical Path-A comments, forward-only `20261017190500_access_delegation_rls_metadata` adds only comments. No applied history was edited and no data was reset.

F02 outcome: trusted operator issue/revoke; exact allowlisted actions; active Employee/account binding; ≤30-day half-open window; overlap/self-issue/wildcard denial; exact replay and expected-version revoke; live account/membership/binding/Employee/action recheck; first Communication owner consumer; acting workspace, role, branch-local expiry and history; immediate revoke/expiry denial. No browser issue/revoke authority and no production approver/provider claim.

Verification: F02 unit 6/6; real-PostgreSQL F02 1/1; TypeScript; focused ESLint; backend, boundaries, docs, 118-table database design and Principal package validation; normal production build; sequential one-worker browser journey 2/2 Chromium and 2/2 mobile. Screenshots were directly inspected at 1440×1000 and 390×844. Evidence: `docs/evidence/principal-f02-delegation-2026-10-17/README.md`.

Seed state: the new focused provisioner completed against the guarded development database and preserved existing credentials/history. `pnpm demo:seed` invokes it after the Communication fixture. Private credentials remain in ignored `artifacts/leadership-01/private-demo.json` and `artifacts/people-02/private-demo.json`.

Pending gates: human review, school production approver/action configuration, font portability, native VoiceOver/NVDA, TEN-03, provider/restore/load review and production enablement. Do not mark these passed.
