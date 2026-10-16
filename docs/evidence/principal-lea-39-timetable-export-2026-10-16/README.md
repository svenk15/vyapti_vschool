# LEA-39 timetable-exceptions export evidence

Source checkpoint: working tree after `b50d913` on 16 October 2026; the executable commit is recorded after verification. Human review remains PENDING.

The immutable authority is Principal workflow LEA-39. `/leadership/timetable` opens `/leadership/reports/timetable`; generation uses `/api/v1/leadership/reports/timetable.csv`. Reporting consumes Academics' authorized `timetable-exceptions.v1` port and carries the current publication, reconciliation definition, owner as-of, aggregate counts and bounded unresolved occurrences into a formula-safe private CSV. Student identities, Attendance rosters/marks/absence explanations, private staff data, drafts and mutation authority are excluded.

Verification:

- `pnpm typecheck` — PASS.
- `pnpm exec vitest run test/unit/reporting-export.test.ts` — PASS, 12/12.
- `pnpm test:functional test/functional/timetable-reconciliation.test.ts -t "reports a mixed batch"` — PASS, 1/1 against real `vyapti_vschool_test`; 67 migrations applied. The case proves explicit exporter designation, exact owner totals, sensitive-field exclusion, revocation denial and preserved mixed reconciliation behavior.
- `VSCHOOL_E2E=1 pnpm build` — PASS.
- Focused one-worker Playwright preview/download — PASS 1/1 Chromium and 1/1 mobile. The first desktop attempt failed only because the assertion paraphrased the visible exclusion copy; the locator was corrected to the actual accessible text without changing behavior.

Visual evidence:

- `application-chromium.png`
- `application-mobile.png`
- Immutable LEA-39 reference reused from `docs/evidence/principal-lea-39-export-2026-10-16/reference-chromium.png` and `reference-mobile.png`.

The captures were directly inspected. Scope/cutoff, bounded evidence preview, explicit exclusions and authorized download follow the approved stages through the production Principal shell. The immutable source is a workflow dialog rather than an exact full-page composition. The known font portability exception, native accessibility, TEN-03, production gates and human review remain pending.
