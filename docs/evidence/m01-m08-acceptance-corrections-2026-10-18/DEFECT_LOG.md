# Acceptance correction defect log

## Confirmed defects

| ID | Area | Finding | Resolution | Evidence |
|---|---|---|---|---|
| AC-01 | Administrator shell | Seeded navigation remained a crowded operational/management catalogue. | Existing guarded destinations regrouped without route or visibility changes. | `screenshots/admin-navigation-*` |
| AC-02 | Communication | Cell metadata ran together at production densities. | Shared stacked cell metadata and mobile spacing applied. | `screenshots/admin-communication-*` |
| AC-03 | Registration | Internal identity terminology was exposed and the exact-reference field was always present. | School-office labels and mode-specific exact inputs; resolver unchanged. | `screenshots/admin-registration-*`; focused registration 3/3 |
| AC-04 | Principal home | Architecture-oriented explanations and unavailable copy could imply module-wide disablement. | Concise user copy and accurate optional-summary empty state. | `screenshots/principal-dashboard-*` |
| AC-05 | Student assignment | Guidance for a submitted/feedback state described draft work. | Guidance now derives from the current state. | `screenshots/student-assignment-state-*` |
| AC-06 | Shared cards/status | Parent Learning and Student home cards could touch; Published metadata differed by viewport. | Shared 24px vertical stack and consistent status recipe. | Parent/Student and Communication captures |
| AC-07 | Presentation seed | Learning purpose was granted to an arbitrary accepted link for the learner, not necessarily the documented Parent persona. | Seed selects exact Parent and Student accounts, preserves narrow purposes and republishes only a new immutable audience when required. Validator now rejects a disconnected scenario. | Guarded seed output; `screenshots/parent-learning-*` |
| AC-08 | Attendance test | Historical combined test used retired correction/cancellation selectors and stale status assumptions. | Test follows current staged correction and current guarded cancellation/audit behavior. | Focused Attendance 1/1 |
| AC-09 | Coordination fixture prose | Resolution prose called a displayed Scheduled source submitted. | Fixture closure text now describes the scheduled authoritative source. | Focused Coordination 1/1; `source-state/*` |

## Investigated non-defects

| Finding | Investigation | Result |
|---|---|---|
| Mobile fixed navigation might hide reachable content/focus | Current Parent Learning and Student home captured at 390×844 after focusing their last meaningful main control; root width, focus rectangle and fixed-nav rectangle recorded. | No overlap or unreachable final control reproduced after the shared safe-area spacing. Student focus bottom 773.4px; nav top 781px. Native assistive-technology and actual zoom remain pending. |
| Resolved follow-up displayed Scheduled while the prose described submitted | Current source type, immutable request evidence and closure capture were inspected; focused journey exercised return, resubmit and independent closure. | Product state was Scheduled throughout. The inconsistency was test/evidence prose, not source mutation or an authorization defect. |

No business-rule, tenant-boundary, identity-resolution or owner-authorization defect was confirmed in this pass.
