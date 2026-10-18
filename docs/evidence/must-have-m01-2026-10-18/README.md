# M01 workspace access evidence

Status: functional/security verification complete for the current synthetic demo; human acceptance pending.

## Diagnosis

The workspace audit reported that the Parent and Student credentials produced no authorized workspace option. Current source intentionally lists only staff workspaces in `/choose-workspace`; when none exists it reauthorizes Student access first and Parent access second, then redirects directly to `/student` or `/family`. The prior inspection treated the lack of a staff `<option>` as failure before awaiting that redirect.

A read-only development-database probe confirmed:

- Parent and Student accounts are active.
- Parent has two accepted, unrevoked child links and no staff membership.
- Student has two accepted, unrevoked Student contexts and no staff membership.
- Required institution entitlements and branch activations are active.
- Administrator, Teacher and Principal staff workspaces remain independently selectable.

No production row or credential needed repair. No role, purpose, membership, entitlement or activation was broadened.

## Current-source smoke

Against `http://127.0.0.1:3400`, build `jCObsKqoFwjNr2pibKzUn` (application content from `d6c9120` within audit HEAD `34301b1`):

| Persona | Result |
|---|---|
| Administrator | selected School administration and reached `/admin` |
| Principal | selected Principal leadership and reached `/leadership` |
| Teacher | selected Teaching and reached `/teacher/today` |
| Parent | redirected directly to `/family` |
| Student | redirected directly to `/student` |

The browser helper waits for the final URL after confirmation/redirect; an initial version that sampled the URL immediately reproduced another false negative and was corrected before recording the result.

Current Parent and Student captures were visually inspected for context identity, content hierarchy, navigation availability and mobile overflow: [Parent desktop](parent-desktop.png), [Parent mobile](parent-mobile.png), [Student desktop](student-desktop.png), and [Student mobile](student-mobile.png). They supplement, rather than replace, the earlier direct approved-reference comparisons.

## Checks

- `VSCHOOL_CAPTURE_PERSONAS=1 pnpm demo:verify-personas` — passed 11/11 sequential desktop/mobile persona and public-recovery states against the live demo. The ignored private report records the build ID and route results without identities or secrets.
- `pnpm test:functional test/functional/guardians.test.ts test/functional/student-portal.test.ts` — passed 11/11 against real `vyapti_vschool_test`; 117 migrations were already applied and none were pending.
- An earlier invocation containing an extra `--` was not focused: it began the full functional suite and was stopped after unrelated Institution Context and Leadership Brief failures appeared. It is not reported as a pass and no code changed before the corrected focused run.

## Reused security evidence

The unchanged owner code is covered by `test/functional/guardians.test.ts`, `test/functional/student-portal.test.ts`, `test/e2e/guardians.spec.ts` and `test/e2e/student-portal.spec.ts`. These cover intended-account activation, wrong-account denial, exact Person binding, per-child/per-Student current purposes, foreign-resource denial, independent contexts, revocation, concurrency and replay. Focused current-source PostgreSQL results are appended after execution.

## Gates

Human review, native accessibility, TEN-03 restricted-role/RLS proof and production recovery/retention controls remain pending. Credential values and invitation/session tokens are not included in this evidence.
