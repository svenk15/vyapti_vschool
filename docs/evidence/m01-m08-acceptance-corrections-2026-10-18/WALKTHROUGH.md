# Connected synthetic walkthrough

Run `pnpm demo:seed`, then use `http://127.0.0.1:3400`. Credentials stay in ignored private files; do not copy values into review material.

1. **Administrator** — sign in with `artifacts/people-02/private-demo.json`. Verify the six grouped navigation areas, open Communication to inspect separated metadata, then open Students → Register student. Switch **Student record** between new record, Person ID and admission number and confirm only the applicable exact-reference input appears.
2. **Teacher** — use the Teacher persona in the same private file. Open Today and the assigned Attendance register. Confirm the connected class/learner is present and the normal school-hours session uses the existing guarded workflow.
3. **Parent** — use `artifacts/guardians-01/private-demo.json`. Open Learning for Morgan Example and confirm **Local habitats field notes** is visible. On a narrow viewport, tab to **View assignment** and confirm its focus ring remains above the fixed navigation.
4. **Student** — use `artifacts/students-portal/private-demo.json`. On My day, confirm separated cards and open **Submitted habitats review**. The feedback-available state should offer **Read feedback** and must not instruct the learner to submit an unsubmitted draft.
5. **Independent reviewer** — use only the reviewer persona named in `artifacts/attendance-01/private-demo.json`. Its account is distinct from Administrator, Teacher, Parent and Student and has the narrow Coordination verification grant. Review the source-backed follow-up; the displayed Scheduled source and resolution description should agree.
6. Return to the **Principal** persona from `artifacts/leadership-01/private-demo.json`. The home page uses school-facing copy, and the optional-summary empty state says no additional dashboard summaries are available without claiming that all modules are disabled.

Expected boundary: each persona sees only its own authorized workspace/context. The walkthrough uses synthetic data and sends no real notification.
