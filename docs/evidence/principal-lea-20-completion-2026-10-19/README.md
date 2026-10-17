# LEA-20 exact-cycle readiness and Coordination evidence

Verified implementation commit: `0ffaf54`. Human review remains **PENDING**.

## Implemented outcome

- Principal selects an exact authorized Assessments cycle through URL state; branch scope and oversight are rechecked on the server.
- Frozen required slots preserve numeric zero, missing, not assessed, absent and excused as distinct states.
- A blocker-bearing cycle can open the staged Assessments-readiness follow-up, choose only an eligible Assessments planner with independent Coordination work authority, and create one durable request.
- The typed Assessments adapter returns aggregate cycle evidence only. Coordination receives no mark, moderation or publication authority and writes no Assessments rows.
- Exact replay returns the original request without duplication. Changed owner evidence rejects the old revision. Only the current `ASSESSMENT_READINESS_RECHECK` can be submitted and independently verified. Revoked oversight prevents source disclosure.
- The durable detail links back to the exact source cycle; withdrawal or reassignment leaves Assessments history unchanged.

## Verification

- Unit: `pnpm exec vitest run --config vitest.config.ts test/unit/coordination-requests.test.ts` — 14/14 passed.
- Real PostgreSQL: `pnpm test:functional test/functional/assessments-readiness.test.ts` — 3/3 passed against `vyapti_vschool_test`.
- TypeScript: `pnpm exec tsc --noEmit --pretty false` — passed.
- Focused ESLint over the changed source/tests — passed.
- Normal production build: `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed for implementation commit `0ffaf54`, build ID `LTj3s3qCdKwbxIexlHvZh`.
- Isolated browser build: `VSCHOOL_E2E=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed, build ID `7q-ho9p_o1Qnvwj2HdauL`.
- One-worker Chromium 1440×1000: application plus reference 2/2 passed.
- One-worker mobile 390×844: application plus reference 2/2 passed; focused top-position recapture 1/1 passed.
- Development and test schemas: 114 forward migrations through `20261019062000_coordination_assessment_readiness_source`; no reset or migration rewrite.
- Guarded development seed: `node --import tsx scripts/demo-assessments.ts` — passed twice and preserved existing data; private scenario path only was printed.

An earlier broad file run reused persisted Teacher fixture state and expected revision 1 after it had become revision 2. A second browser attempt served the stale `.next-e2e` build and therefore lacked the new selector. Those failures were diagnosed from their error contexts; the isolated build was refreshed and only the LEA-20 cases were rerun. They are not reported as passes.

## Direct comparison

Authority: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, explorer state `LEA-20`.

- [Desktop reference](reference-chromium.png)
- [Desktop readiness](application-chromium.png)
- [Desktop handoff review](application-handoff-chromium.png)
- [Desktop durable follow-up](application-follow-up-chromium.png)
- [Mobile reference](reference-mobile.png)
- [Mobile readiness](application-mobile.png)
- [Mobile handoff review](application-handoff-mobile.png)
- [Mobile durable follow-up](application-follow-up-mobile.png)

All eight captures were directly inspected. The explorer is a workflow dialog; production maps its four stages to the recipe-L readiness report, staged Coordination operation and durable detail route. The production hierarchy, cycle action, blocker distinctions, source return, responsive stacking and absence of page-level overflow are consistent. The shared sticky mobile header is captured at the top of each current screenshot. Exact explorer pixel identity is not claimed.

Font portability, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03, human acceptance and production enablement remain pending.
