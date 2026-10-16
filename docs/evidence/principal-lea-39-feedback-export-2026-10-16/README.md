# LEA-39 feedback-turnaround export evidence

Source checkpoint: working tree after `82ba7de` on 16 October 2026; commit recorded after verification. Human review remains PENDING.

The immutable authority is Principal workflow LEA-39. Application route `/leadership/learning/feedback` opens `/leadership/reports/feedback`; generation uses `/api/v1/leadership/reports/feedback.csv`. Reporting consumes Learning's authorized `feedback-turnaround.v1` port, carries its exact filters/definitions/as-of, and emits one aggregate row. Identity, evidence rows, assignments, drafts, response/feedback text, rankings, targets and overdue labels are excluded.

Verification:

- `pnpm typecheck` — PASS.
- `pnpm exec vitest run test/unit/reporting-export.test.ts` — PASS, 11/11.
- `pnpm test:functional test/functional/learning-publication.test.ts -t "measures first published feedback"` — PASS, 1/1 against real `vyapti_vschool_test`, 67 migrations applied. The local PostgreSQL postmaster first stopped accepting connections; a normal shutdown/restart preserved both databases and the unchanged focused test passed.
- `VSCHOOL_E2E=1 pnpm build` — PASS.
- Focused one-worker Playwright preview/download — PASS 1/1 Chromium and 1/1 mobile.

Visual evidence:

- `application-chromium.png`
- `application-mobile.png`
- Immutable LEA-39 reference reused from `docs/evidence/principal-lea-39-export-2026-10-16/reference-chromium.png` and `reference-mobile.png`.

The captures were directly inspected. Hierarchy, scope/cutoff, aggregate preview, explicit exclusions and download action follow the approved workflow stages through the production Principal shell. The shell-versus-review-dialog difference, font portability, native accessibility, TEN-03, production gates and human review remain explicit deviations/gates.
