# Programme resume

Task/subtask: WF-27 / LEA-27 is **ENGINEERING_COMPLETE** for the approved fictional synthetic scope at source `26fdc0f0216623d654042d4fcc368432156ca126`. Direct visual comparison is complete with documented routed-shell/font deviations. Human review remains **PENDING**.

Approved decisions: D01 preserves the existing COORD-02/LEA-10 contract. On 17 October 2026 the repository owner explicitly approved D02–D19 for synthetic-only implementation exactly as recorded in `02_PRODUCT_DECISIONS.md`, with no exceptions. This does not authorize production enablement, purchases, provider selection, real external messages or payments, or invented emergency procedures. Human acceptance remains separate.

Current matrix: 27 ENGINEERING_COMPLETE, three PARTIAL and 16 NOT_STARTED; all 46 Principal workflows are accounted for exactly once.

Current verified executable source: `26fdc0f0216623d654042d4fcc368432156ca126` (`Complete Principal decision inbox directory`). Normal production build ID: `uvdcAQaNC1HS8F_B_SCVG`. The current-source demo must run at `http://127.0.0.1:3400` and `/api/health` must report `ready:true`. Private Administrator/acting-Principal personas remain in ignored `artifacts/people-02/private-demo.json`; connected Principal/Coordination identifiers remain in ignored `artifacts/leadership-01/private-demo.json` and `artifacts/coordination-01/private-demo.json`.

Development and test databases retain 87 forward migrations. No migration changed for LEA-27, neither database was reset and no applied migration was edited.

Verification for `26fdc0f`: `pnpm check` passed lint, TypeScript, 30 documentation checks, 136 database contracts, boundaries, portable backend and 210/210 unit tests. Focused real-PostgreSQL Coordination passed 15/15. Sequential one-worker Playwright passed 1/1 Chromium and 1/1 mobile after a test-only locator correction; captures were directly inspected against approved LEA-27. Normal production build passed. Evidence: `docs/evidence/principal-lea-27-decisions-2026-10-17/README.md`.

The next smallest started decision workflow is WF-29 / LEA-29, “Approve, reject or return an assigned item” (F03, D03). Reconcile the current Coordination `VERIFY|RETURN` owner action set against the approved workflow before adding code. Do not require fictional owners to complete a registered-owner workflow, and do not expose approve/reject labels or commands that the current owner does not support. If the current implementation already satisfies the registered-owner contract, record that evidence rather than rebuilding it; otherwise implement only the exact missing owner action/feedback state.

Pending gates: human review, font portability, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03, real-data retention/backup deletion and disclosure policy, provider/restore/load review and production enablement. Do not mark these passed.
