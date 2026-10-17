# LEA-13 assigned explanation review evidence

Status: engineering and direct comparison complete with documented deviations; human review PENDING.

The approved source is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow `LEA-13`. It is a workflow-explorer dialog, so the production mapping follows recipe D in `SCREEN_MAP.md`: `/leadership/attendance/explanations/:id` for the assigned reviewer and `/family/attendance/explanations/:id` for the exact originator.

Implemented behavior:

- A submitted case is bound server-side to one current operator-provisioned reviewer grant; Principal role alone cannot disclose protected text.
- An open Attendance-owned clarification pauses accept/decline and Parent withdrawal.
- Only the original submitter account through the same live Guardian access and independent purpose may read and answer the question. Revocation denies answer and protected receipt replay; another guardian is never substituted.
- The answer increments the clarification and case evidence versions. Disposition requires that refreshed case version.
- Exact command keys replay one original request/answer without duplicate children or side effects. Changed payloads conflict.
- Acceptance changes only the explanation case. The source `AttendanceRecord` remains `ABSENT` at the same revision.
- Question, answer, Parent explanation and school response stay out of general audit/receipt evidence. Protected storage remains synthetic-only.

Verification applies to implementation commit `098dfdc` (`Complete assigned attendance explanation review`):

- `pnpm check`: passed, including 223/223 unit tests, documentation, TypeScript/lint, backend boundaries and 153 registered database contracts.
- `pnpm test:functional test/functional/attendance-explanations.test.ts`: 2/2 passed against real `vyapti_vschool_test`; covers exact replay, open-child blocking, refreshed evidence, stale disposition, revoked-originator denial, raw-text exclusion and unchanged Attendance mark.
- `pnpm test:e2e test/e2e/principal-attendance-explanation.spec.ts --project=chromium --workers=1`: 1/1 passed.
- The same focused command for `--project=mobile`: 1/1 passed sequentially.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build`: passed; production build `Y2RRnsgIQEFKXA659pe5g`.
- Isolated Playwright build: `XSdb21XIckKXSIAeXvFV7`.
- Development and test databases each contain 95 forward migrations through `20261018210000_attendance_explanation_clarification`. Neither database was reset.
- `pnpm demo:seed` preserved prior fixtures and prepared the ignored scenario at `artifacts/attendance-explanations/private-demo.json`. Earlier independent TEN/ACA/branding seed refresh warnings were reported honestly; they did not prevent this seed or overwrite prior data.

Visual inspection covered assigned review, open clarification, persisted Parent answer and accepted outcome at 1440×1000 and 390×844. Captures in this directory are labelled `reference-*`, `application-request-*`, `application-parent-answer-*` and `application-accepted-*`. The routed production screens preserve the explorer’s stage order and consequences, while the explorer remains a catalogue dialog rather than a literal page design. The established local-font portability deviation, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03 and real-data retention remain pending.
