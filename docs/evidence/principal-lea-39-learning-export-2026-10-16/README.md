# LEA-39 Learning aggregate export evidence

Source checkpoint: working tree after `68051b7` on 16 October 2026; commit recorded after verification. Human review remains PENDING.

## Contract and result

- Approved workflow state: `LEA-39 — Drill into a metric and export permitted evidence` in `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`.
- Application source: `/leadership/learning` → `/leadership/reports/learning` → `/api/v1/leadership/reports/learning.csv`.
- Reporting consumes Learning's application port. It carries the exact branch-local interval, class/subject filters, definition, cutoff and frozen-recipient denominator; refuses more than 50 matching assignments; and writes only existing safe ExportRun/audit metadata.
- CSV contains a summary plus allowlisted assignment aggregates. Student identities, private drafts, response text, feedback, extension/excusal data and follow-up notes are excluded.
- Operator designation remains separate from Principal and Learning read authority. Both are rechecked for every generation.

## Verification

- `pnpm typecheck` — PASS.
- `pnpm exec vitest run test/unit/reporting-export.test.ts` — PASS, 10/10.
- `pnpm test:functional test/functional/learning-publication.test.ts -t "gives a Principal an exact bounded assignment denominator"` — PASS, 1/1 against `vyapti_vschool_test`; 67 migrations applied. The first run exposed an over-broad test assertion because an authorized assignment title contained the word “response”; the assertion was corrected to check the actual private response and Student ID, then passed without changing product behavior.
- `VSCHOOL_E2E=1 pnpm build` — PASS.
- `pnpm test:e2e test/e2e/principal-learning.spec.ts --project=chromium --workers=1 --grep "previews and downloads"` — PASS, 1/1.
- The same focused Playwright command with `--project=mobile` — PASS, 1/1.

## Visual comparison

- Application desktop: `application-chromium.png`.
- Application mobile: `application-mobile.png`.
- Immutable workflow references reused from `docs/evidence/principal-lea-39-export-2026-10-16/reference-chromium.png` and `reference-mobile.png`.
- The captures were directly inspected. Both application layouts preserve the approved stage intent: open the source metric, retain filters/cutoff/scope, preview exported fields and exclusions, then generate through an independently authorized route. The production page uses the established Principal shell rather than the reference review dialog, so visual status remains `DIRECT_COMPARISON_COMPLETE_WITH_DEVIATIONS`. On the stitched mobile full-page capture, the fixed portal header appears mid-image; interaction testing found no horizontal overflow and the page remains scrollable.

Font portability, native VoiceOver/NVDA, TEN-03, production-provider/restore/load gates and human visual acceptance remain pending.
