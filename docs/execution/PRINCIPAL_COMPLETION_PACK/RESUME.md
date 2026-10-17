# Programme resume

Task/subtask: WF-30 / LEA-30 is **ENGINEERING_COMPLETE** for the registered Coordination owner at tested implementation commit `1b90a484dc89ffd562fef2b8ca948180f830798f`. Direct visual comparison is complete with the documented routed-shell/font deviations. Human review remains **PENDING**.

Approved decisions: D01 preserves the existing COORD-02/LEA-10 contract. On 17 October 2026 the repository owner explicitly approved D02–D19 for synthetic-only implementation exactly as recorded in `02_PRODUCT_DECISIONS.md`, with no exceptions. This does not authorize production enablement, purchases, provider selection, real external messages or payments, or invented emergency procedures. Human acceptance remains separate.

Current matrix: 31 ENGINEERING_COMPLETE, one PARTIAL and 14 NOT_STARTED; all 46 Principal workflows are accounted for exactly once. The sole partial is LEA-32: text-only notice preparation/review/publication is verified, while a real scanner-backed Documents link, authenticated serving path and direct attachment-state comparison remain absent.

Current verified executable implementation source: `1b90a484dc89ffd562fef2b8ca948180f830798f` (`Complete Principal decision recusal workflow`). Normal production build ID: `3WI-DraVmxxezxGi_SKrp`; isolated browser build ID: `gS8x-rxS13-K_3UtE0mc6`. Development and test databases contain 90 forward migrations through `20261018170000_coordination_decision_recusal`; neither was reset and no applied migration was edited.

Verification: `pnpm check` passed lint, TypeScript, 30 documentation checks, 144 database contracts, boundaries, portable backend and 216/216 unit tests. Focused real-PostgreSQL Coordination passed 18/18. Sequential one-worker Playwright passed the recusal/reviewer journey and immutable LEA-30 reference capture 2/2 Chromium and 2/2 mobile. Evidence: `docs/evidence/principal-lea-30-recusal-2026-10-17/README.md`.

Demo data: the focused changed Coordination helper passed and records the independent reviewer pointer in ignored `artifacts/coordination-01/private-demo.json`; reviewer credentials remain in ignored `artifacts/attendance-01/private-demo.json`. The composite `pnpm demo:seed` currently stops earlier at an existing Principal credential mismatch and preserves all existing records. Do not overwrite that account or reset the database to hide the mismatch.

Next action: reconcile the machine task graph after WF-30 and select the earliest approved ready owner capability. LEA-32 remains blocked on the real scanner/provider configuration and Communication/Documents link, but missing external configuration must not stop another independent eligible workflow. Retain the D02–D19 synthetic-only boundaries and do not treat registered Coordination coverage as proof for future owners.

Pending gates: human review, font portability, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03, real-data retention/backup deletion and disclosure policy, provider/restore/load review and production enablement.
