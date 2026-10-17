# LEA-36 meeting and follow-up evidence

Status: ENGINEERING_COMPLETE / DIRECT_COMPARISON_COMPLETE_WITH_DEVIATIONS / HUMAN_REVIEW_PENDING.

Authority: approved D14 and `docs/execution/PRINCIPAL_COMPLETION_PACK/workflows/LEA-36.md`. Reference state: `WorkflowReview.read('LEA-36')` in `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`. Production entries: `/leadership/meetings`, `/leadership/meetings/new`, `/teacher/meetings` and `/family/meetings`.

Implemented outcome: an explicitly designated Principal meeting manager saves and proposes one bounded meeting to exact authorized staff/family participants. Each participant responds through their real workspace. A changed time resets responses; removal revokes future detail access; confirmation requires every active acceptance; completion records explicit attendance and independently owned actions. An agreed action crosses only the typed minimal Events-to-Coordination boundary and is assigned only to its exact owner. Status lookup and exact replay reauthorize before result disclosure.

Verification:

- `pnpm exec vitest run test/unit/meetings.test.ts --maxWorkers=1 --reporter=default` — PASS, 3/3.
- Real PostgreSQL `test/functional/meetings.test.ts` — PASS, 3/3 inside the guarded functional run. The accidentally unfiltered wrapper run also exposed two unrelated pre-existing failures (`institution-context` DTO expectation and `reporting-leadership-brief` fixture); they are not represented as F13 failures.
- Focused Playwright, one worker — Chromium PASS 2/2; mobile PASS 2/2. The first Chromium attempt reused an old `.next-e2e` build and returned a truthful 404; rebuilding the isolated artifact resolved that environment mismatch. A later assertion expected an Alert title to be a heading and was corrected without changing product code. The first mobile assertion counted another project's scoped action; the query was corrected to the current organization/school.
- TypeScript and focused ESLint — PASS.
- 4 GiB normal production build — PASS, build `RlcDzwsntOpieqzTRSokQ`.
- 4 GiB E2E production build — PASS, build `C2dPFQedY6Xq5HD8ABxTd`.
- Development and test databases: 103 forward migrations through `20261019021000_coordination_meeting_action_source`; no reset or migration rewrite.
- `pnpm demo:seed` meeting helper completed twice without replacing existing data; ignored private scenario: `artifacts/meetings-01/private-demo.json`.

Direct inspection: `reference-*` is the approved workflow explorer. `principal-proposed-*`, `teacher-accepted-*` and `principal-follow-up-*` are real application states at 1440×1000 and 390×844. The production pages use the approved persistent shell and staged recipe rather than copying the catalogue dialog. Spacing, hierarchy, focus order, responsive stacking and overflow were inspected. The standard font portability deviation remains.

Release gates: protected-text retention, TEN-03, native VoiceOver/NVDA, font portability, deployment/provider review and human acceptance remain pending. No production or real-client use is authorized.
