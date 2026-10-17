# F05 / LEA-40 bounded branch comparison evidence

Status: engineering verification complete for the synthetic-only LEA-40 slice; human review pending; production disclosure and retention gates remain open.

## Authority and data boundary

- Decision authority: D06 in `docs/execution/PRINCIPAL_COMPLETION_PACK/02_PRODUCT_DECISIONS.md`.
- Approved workflow reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow `LEA-40`.
- Production route: `/leadership/reports/compare`.
- Reporting reads only immutable, nonremoved, latest-per-branch/date whole-branch `attendance-register-coverage.v1` snapshots. It does not query Attendance tables or grant operational drill-down.
- An operator-designated grant enumerates each account/institution/target-branch/metric tuple. Principal role, current branch membership, or institution membership alone does not create comparison authority.
- Every read rechecks the current Principal context, target branch status, Attendance release/entitlement/activation chain and current grant. Revoked or withheld branches contribute no label, value or residual total.
- Comparison is bounded to 1–20 explicitly selected branches and 1–31 local dates. Combined coverage sums received and due counts; it never averages branch percentages. Incompatible date coverage or definitions remain visible and excluded from the combined result.

## Persistence and migration

- Forward migration: `20261017230000_reporting_branch_comparison`.
- New Path A institution-scoped authority table: `vs_reporting_comparison_grant`; `school_id` names the target branch resource.
- Development and test databases both retain 84 forward migrations. Neither database was reset and no applied migration was edited.
- The table is registered in `docs/database/TABLE_REGISTRY.json` with TEN-03 as the enforcement closure gate.

## Verification

- `pnpm test:unit test/unit/reporting-branch-comparison.test.ts`: 3/3 passed. Evidence covers weighted arithmetic (`1/2 + 9/10 = 10/12`), incompatible source dates, no-snapshot state and bounds.
- `pnpm test:functional test/functional/reporting-branch-comparison.test.ts`: 1/1 passed against real `vyapti_vschool_test` with 84 migrations. It covers no automatic grant, explicit enumeration, cross-organization denial, subgroup exclusion, weighted totals, grant revocation without residue, target-module disablement and current Principal reauthorization.
- Focused one-worker Playwright: 2/2 Chromium and 2/2 mobile passed sequentially after a shared mobile-card rule was corrected so comparison caveats remain visible.
- `node --import tsx scripts/demo-principal-attendance.ts`: passed against guarded local development PostgreSQL. It preserves the existing fictional Principal, retained snapshot and one explicitly granted comparable branch in ignored `artifacts/leadership-01/private-demo.json`. Repeated runs reuse the deterministic snapshot command and do not overwrite credentials or manual records.
- Repository gate passed: lint and TypeScript, 30-task documentation validation, 128-table database design, boundaries, portable backend and 205/205 unit tests. The final normal production build passed with build ID `6IdNEhQunU6fmFKvJvngh`; the isolated Playwright build passed with build ID `QYMWNv7odp-WM3fgzxFAE`.

## Direct visual inspection

- `application-chromium.png` and `reference-chromium.png` were inspected at 1440×1000.
- `application-mobile.png` and `reference-mobile.png` were inspected at 390×844.
- The application follows the approved sequence: enumerate authorized branches and period, expose compatibility/source cutoffs, compare like-for-like counts, and keep branch detail inaccessible without separate authority.
- The approved asset is a workflow-explorer dialog over fictional content. The implementation is the production recipe-L Reports page with real authorized data, so this is a direct semantic/component comparison with documented composition differences rather than a pixel-identity claim.
- Desktop has a stable two-column branch selector, compact period controls, three summary cards and a readable evidence table. Mobile stacks selectors/controls, preserves the explanatory card copy, and converts the table to labelled records without horizontal overflow.

## Remaining gates

Human review, exact font portability, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03, production retention/backup-deletion and real-data disclosure policy remain pending. LEA-41 brief authoring/sharing is separate unfinished work.
