# Programme resume

Current checkpoint: F11 / WF-20 / LEA-20 is **ENGINEERING_COMPLETE** at implementation commit `0ffaf54`. Human review remains **PENDING**. F11-A/B/C/D and LEA-20/21 are verified, while F11 as a foundation remains **PARTIAL** because LEA-22 report publication still depends on the incomplete real-scanned Documents path.

Approved decisions: D01 preserves the existing COORD-02/LEA-10 contract. On 17 October 2026 the repository owner explicitly approved D02-D19 for synthetic-only implementation exactly as recorded in `02_PRODUCT_DECISIONS.md`, with no exceptions. This does not authorize production enablement, purchases, provider selection, real external messages or payments, real complaint data, or invented emergency procedures. Human acceptance remains separate.

Queue accounting: all 46 workflow rows are accounted for as 43 ENGINEERING_COMPLETE, two PARTIAL and one NOT_STARTED. LEA-32 and LEA-45 are partial. LEA-22 is not started. LEA-27 and LEA-29 cover every currently registered decision owner, including `ASSESSMENTS_MODERATION` and `FINANCE_EXCEPTION`; later decision owners still require their own typed registration and evidence.

LEA-20 completion: the existing exact readiness projection, Administrator planning/frozen cohort and assigned-Teacher mark revisions now include authorized exact-cycle selection plus a typed Assessments-to-Coordination handoff. The owner adapter reauthorizes inspect/recheck, exposes aggregate evidence only, restricts assignees to an active Assessments planner with independent Coordination work authority, rejects stale evidence and accepts only the current `ASSESSMENT_READINESS_RECHECK`. Exact replay creates one request; revoked oversight prevents source disclosure. Coordination never writes Assessments tables.

LEA-20 verification: focused unit 14/14 and real-PostgreSQL readiness/handoff/security 3/3 passed. TypeScript and focused lint passed. Development and test databases contain 114 forward migrations through `20261019062000_coordination_assessment_readiness_source`; neither database was reset and no applied migration was edited. Sequential one-worker Playwright passed 2/2 Chromium and 2/2 mobile against isolated build `7q-ho9p_o1Qnvwj2HdauL`; the focused mobile recapture passed 1/1 after returning full-page screenshots to the top. All eight application/reference captures were directly inspected in `docs/evidence/principal-lea-20-completion-2026-10-19/`. The guarded Assessments seed passed twice without overwriting existing records. The exact implementation commit `0ffaf54` passed the normal 4 GiB production build with build ID `LTj3s3qCdKwbxIexlHvZh`.

Remaining workflow gaps:

- LEA-32 PARTIAL: text-only targeted notice is verified; attachment completion requires a real scanner, authenticated Documents serving/link contract and direct completed reference comparison. An adapter double is insufficient.
- LEA-45 PARTIAL: the deterministic source-linked Assistant boundary is verified at `58ae335`; production completion requires approved provider, data region, retention and real-provider evaluation. The deterministic adapter is not a provider integration.
- LEA-22 NOT_STARTED: report publication requires the complete real-scanned Documents path plus its exact publication/audience contract. Missing provider configuration does not authorize simulated completion.

No remaining incomplete workflow is independently eligible for ENGINEERING_COMPLETE under the current provider and Documents restrictions. Continue only when the scanner/serving contract or Assistant provider/region/retention configuration is available, or when an independently approved workflow is added. Do not downgrade these concrete external dependencies to a generic technical-design blocker.

Demo credentials remain in ignored `artifacts/people-02/private-demo.json` and related private artifact files; never copy their values into Git or documentation. After the final commit, make one normal 4 GiB build and run one demo server at `http://127.0.0.1:3402`, recording the exact source and build ID.

Pending release gates: human review, font portability, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03, real-data retention/backup deletion and disclosure policy, real provider/scanner/restore/load review and production enablement.
