# Must-have M06 — assignment to feedback

Status: `VERIFIED_CURRENT_SOURCE / HUMAN_REVIEW_PENDING`

Source under test: application source at `3b683f7` plus documentation-only checkpoint updates. No schema, migration, seed or business-code change was required.

## Verified journey

- Teacher `/teacher/learning` listed the seeded published assignment, opened its exact accepted Student response and displayed the current immutable published feedback.
- Student `/student/assignments` opened the accepted attempt and read the exact published guidance. The accepted response remained immutable.
- Parent `/family/learning` used the exact accepted child binding and `learning.assignment.read_child` purpose. It displayed assignment instructions only and explicitly withheld drafts, submissions and feedback.
- Principal `/leadership/learning` displayed aggregate assignment completion using the frozen published audience and disclosed no private learner work.
- All eight route states were inspected at desktop and mobile sizes. The mobile smoke recorded `390px` client and scroll widths for every state; no root overflow was present.

## Verification

- `pnpm test:functional test/functional/learning-publication.test.ts` — **19/19 passed** with real PostgreSQL `vyapti_vschool_test`; **117 migrations**, none pending.
- Current-source browser inspection — eight desktop captures and eight mobile captures. The desktop run completed every capture before the temporary harness was interrupted by a development fast-refresh response; the captures and corresponding successful server requests were inspected directly. The separate mobile run completed all eight states and wrote [`m06-smoke.json`](./m06-smoke.json).
- Direct visual inspection covered Teacher list/detail/feedback, Student list/feedback, Parent list/detail and Principal aggregate screens. It confirmed role-appropriate composition, current published feedback, read-only Parent disclosure and responsive stacking.

## Scope and gates

The general Guardian fixture was intentionally not granted Learning access. `artifacts/communication-01/private-demo.json` supplies the exact accepted Parent purpose for this fictional scenario. Parent feedback visibility remains outside the accepted LEA-04 contract. Human review, native accessibility, font portability, TEN-03 and production readiness remain pending.
