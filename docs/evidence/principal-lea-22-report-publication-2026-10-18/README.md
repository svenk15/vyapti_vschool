# LEA-22 assessment report publication evidence

Captured 18 October 2026 IST. Human review is **PENDING**.

## Verified scope

- A current Assessments overseer hands one exact approved report revision to a separately designated publisher.
- The publisher is a current Principal with explicit `PUBLISH` authority and is not a recorder of the pinned source evidence.
- Audience is explicitly `STUDENT`, `GUARDIANS` or `BOTH`; zero eligible recipients blocks the handoff.
- The versioned synthetic PDF includes the school, Student, academic period, subjects/results, report reference, publication time and visibly synthetic signatory label. It contains no fake signature.
- Documents quarantines and scans the exact bytes with real local ClamAV before immutable promotion. Publication pins the resulting version and grant.
- Lost-response recovery checks the original owner command key. Exact replay returns one result without a duplicate artifact or publication.
- Family and Student reads reauthorize the exact accepted portal link and result purpose. Document serving rechecks current owner authority and current clean scan state.
- A separately authorized withdrawal with a required reason blocks future serving while retaining the immutable publication and withdrawal history. Corrections require a new approved report revision.

## Focused verification

- `pnpm test:unit test/unit/assessment-report-publication.test.ts` — 3/3 passed.
- `pnpm test:functional test/functional/assessment-report-publication.test.ts` — 4/4 passed against `vyapti_vschool_test`, 117 migrations.
- `pnpm check:db-design` — passed with 204 registered tables.
- `pnpm typecheck` — passed after the final recipient authorization change.
- `VSCHOOL_E2E=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed, isolated build `D4nB_bWb-BgD6tEY5dgfU`.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed after the final authorization and boundary corrections, normal build `0hJtggoLkSHmXGYS4qNvA`.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/principal-assessments.spec.ts --project=chromium --grep "publishes one scanned report" --workers=1` — 1/1 passed.
- The same focused command with `--project=mobile` — 1/1 passed.

One attempted functional invocation included Vitest's unsupported `--runInBand` option and stopped before executing tests. The corrected focused command above passed. Earlier browser failures exposed and led to correction of a staff-only branch-context assumption for non-staff recipients; no assertion, authorization rule or timeout was weakened.

## Direct visual inspection

The approved source is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, opened at workflow `LEA-22`.

The reference is a workflow explorer, not a complete production page. Its four steps map to:

1. `/leadership/assessments/publications` source/audience review and explicit handoff.
2. The same routed workspace's visible eligible-recipient preview.
3. The designated publisher's final publish action and recovered owner receipt.
4. `/family/results` and `/student/results` current-purpose delivery status, followed by the Principal withdrawal state.

The desktop and mobile reference, handoff, recovered publication, Family result, Student result and withdrawn Family states were inspected directly. The production routes retain the approved shared shell, hierarchy, spacing, focus treatment and responsive cards. The implementation intentionally expands the explorer into separate role-owned screens and exposes the synthetic-only warning and withdrawal consequence required by the accepted contract.

## Captures

- `reference-{chromium,mobile}.png`
- `application-handoff-{chromium,mobile}.png`
- `application-published-{chromium,mobile}.png`
- `family-results-{chromium,mobile}.png`
- `student-results-{chromium,mobile}.png`
- `family-withdrawn-{chromium,mobile}.png`

## Remaining gates

Production template/signatory approval, storage provider/region, retention and deletion policy, scanner-service operations, TEN-03, font portability, native VoiceOver/NVDA, actual browser 200% zoom and human acceptance remain pending. Synthetic local evidence does not authorize real pupil documents or production enablement.
