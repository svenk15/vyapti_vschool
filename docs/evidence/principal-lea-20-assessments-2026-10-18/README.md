# LEA-20 Assessments readiness evidence

Verified application source: `4ee71ac` (`Add Principal assessment readiness demo`). Foundation schema source: `e6d0d9b`. Human review remains **PENDING**.

## Scope verified

- Explicit branch Assessments oversight grant; a Principal role alone is insufficient.
- Released, entitled and branch-activated synthetic-only Assessments module.
- One `REPEATABLE READ` projection over an exact scheme version and frozen cohort.
- Numeric zero, missing, not assessed, absent and excused remain distinct.
- Moderation and report states remain separate; unresolved required outcomes prevent readiness.
- Responsive production route at `/leadership/assessments` with gated navigation and fail-closed unavailable state.
- Idempotent `pnpm demo:seed` feature provisioner stores only scenario identifiers in ignored `artifacts/assessments-01/private-demo.json`.

## Verification

- Unit: `test/unit/assessments-readiness.test.ts` — 2/2 passed.
- Real PostgreSQL: `test/functional/assessments-readiness.test.ts` — 2/2 passed, including explicit grant and revoked-authority denial.
- Database design: 165 registered table contracts passed.
- TypeScript and focused lint passed.
- Production build: `VSCHOOL_E2E=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm build` passed; isolated build ID `9yGR2HpAHgIuovsqu5MG4`.
- Chromium 1440×1000: 2/2 focused journey/reference cases passed; final changed-state recapture 1/1 passed.
- Mobile 390×844: 2/2 focused journey/reference cases passed; final changed-state recapture 1/1 passed.
- The feature provisioner passed twice against local `vyapti_vschool`, confirming repeat-run preservation.

The first browser invocation accidentally forwarded an extra `--` through `pnpm`, selected the broad suite, and was stopped after one unrelated case. Subsequent commands passed the spec path directly and selected only the intended cases.

## Direct comparison

Authority: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, explorer state `LEA-20`.

- [Desktop application](application-chromium.png)
- [Desktop reference](reference-chromium.png)
- [Mobile application](application-mobile.png)
- [Mobile reference](reference-mobile.png)

The reference is a workflow explorer dialog; the application uses production recipe L. Direct inspection confirmed the production heading hierarchy, four-card desktop summary, labeled mobile evidence rows, blocker distinction, current navigation state and no viewport overflow. Font portability, native VoiceOver/NVDA and actual browser 200% zoom remain pending.

## Remaining LEA-20 work

LEA-20 is **PARTIAL**. The factual read projection is implemented and compared, but the production flow still needs an authorized cycle selector, real counterpart cycle/mark operations and a typed Assessments source contract for Coordination. Seeded owner rows are demo evidence, not a substitute for those owner operations. LEA-21 moderation and LEA-22 publication remain NOT_STARTED.
