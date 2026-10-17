# F08-C / LEA-18 feedback-return follow-up evidence

Status: engineering complete; direct comparison complete with documented production-composition deviations; human review pending.

Verified product source: `792344d960014972a311c835bddbb77a02f30349`. Normal production build: `lXAhv1RaKHcpGRWi6zmwK3j`. Isolated browser build: `SwSiNb0F3qLSA3wlXIZ`.

The approved source is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow `LEA-18` (“Review feedback awaiting return”). It is a workflow explorer dialog. The production mapping is `/leadership/learning/feedback`, the exact-item staged route `/leadership/learning/feedback/follow-up/new`, its receipt and `/leadership/coordination/[id]` detail/action route.

Implemented behavior:

- aggregate turnaround remains `feedback-turnaround.v1`, with a separately paginated exact awaiting projection;
- exact accepted-submission source without learner identity, learner work, feedback draft or performance label;
- active membership, `coordination.work` and exact class/subject `FEEDBACK_FOLLOW_UP` assignee authority;
- staged details/review/final create with retained in-flow edits and exact-key replay;
- private feedback draft rejected as evidence;
- earliest immutable feedback publication for the exact submission rechecked at submit and independent verification;
- current branch, module, permission and exact Learning designation rechecked on protected operations;
- repeat-safe synthetic fixture and grants through `pnpm demo:seed` without overwriting credentials or manual records.

Verification performed on 17 October 2026:

- unit: Coordination request and reporting contracts 23/23;
- real PostgreSQL: complete affected Learning file 19/19;
- TypeScript, focused ESLint, backend extraction compile, boundaries, documentation and 111-table database-design checks passed;
- normal production build `lXAhv1RaKHcpGRWi6zmwK3j` and isolated browser build `SwSiNb0F3qLSA3wlXIZ` passed;
- staged create/receipt/detail: Chromium 1/1 and mobile 1/1, sequentially with one worker;
- aggregate application plus immutable reference capture: Chromium 2/2 and mobile 2/2;
- `pnpm demo:seed` exited 0 and the Learning step prepared or preserved the exact awaiting-feedback scenario and grants; independent TEN-02, ACA-01 and BRD-02 refresh warnings preserved their existing data and are not reported as passes;
- the first Chromium attempt served the prior `.next-e2e` target and therefore lacked the new table; the trace identified the stale build, the isolated target was rebuilt, and the unchanged journey passed.

Direct inspection:

- `../principal-lea-18-feedback-2026-10-16/reference-chromium.png` and `application-chromium.png` at 1440×1000;
- `../principal-lea-18-feedback-2026-10-16/reference-mobile.png` and `application-mobile.png` at 390×844;
- `review-*.png`, `receipt-*.png` and `detail-*.png` for the production Coordination extension.

The application preserves the approved sequence and outcomes in the agreed persistent Principal shell and routed page recipes. The explorer dialog, its fictional background and review controls are not production screens. The application adds a real exact-item table, durable receipt and action detail because these are required for persisted owner behavior. The documented font portability exception remains. Native VoiceOver/NVDA was not executed.

Migration state: development and `vyapti_vschool_test` each have 76 applied migrations; latest is `20261017172000_coordination_learning_feedback_source`. Human review, Coordination operational-note retention/backup-deletion policy, TEN-03, accessibility and production enablement remain pending.
