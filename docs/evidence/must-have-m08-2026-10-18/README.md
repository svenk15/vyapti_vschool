# Must-have M08 — missing register to verified resolution

Status: `VERIFIED_CURRENT_SOURCE / HUMAN_REVIEW_PENDING`

Application source under test: `d165806`; isolated build `Wrd7P85a7tJo0u_ZOsWfN`. The focused checkpoint also maintains two browser assertions for current accepted UI wording.

## Connected journey

- Principal created and assigned one request from an exact missing-register Attendance source.
- The worker's stale page retained entered values; revoking `coordination.work` denied submission and restoring the same current designation allowed the guarded retry.
- Independent review returned the first factual proposal. The worker refreshed and resubmitted exact source evidence; Principal verification re-read Attendance and closed the request.
- A second setup-review request linked to the current session. The assigned Administrator canceled only through the existing Attendance flow, submitted exact `ATTENDANCE_CANCELLATION` revision 1 and obtained independent verification.
- The resolved source became unavailable for another setup-review request. Queue, detail, history, desktop/mobile overflow and mobile navigation behavior remained intact.

## Verification

- `VSCHOOL_E2E_BUILT=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm test:e2e test/e2e/coordination.spec.ts --project=chromium --grep "completes missing-register and setup-review follow-ups" --workers=1` — **1/1 passed**.
- The same focused command with `--project=mobile` — **1/1 passed**.
- `pnpm test:functional test/functional/coordination-requests.test.ts` — **18/18 passed** against real PostgreSQL `vyapti_vschool_test`; **117 migrations**, none pending.

The initial desktop run reached the negative assignee state and exposed an obsolete expected sentence; the screen correctly used the stricter accepted named-pupil grant wording. The initial mobile run completed all business operations and exposed an obsolete pre-regrouping sidebar label. Only those assertions changed before the passing runs.

## Visual inspection

Awaiting-verification, resolved missing-register, resolved setup/cancellation and populated-queue states were inspected directly at 1440×1000 and 390×844. The routed production composition retains clear owner/source facts, append-only history, explicit evidence, separated review actions, responsive stacking and visible navigation focus.

## Remaining gates

Human acceptance, protected operational-note production retention/backup-deletion policy, font portability, native accessibility, TEN-03 and production readiness remain pending. Synthetic mode does not authorize real-client operational notes.
