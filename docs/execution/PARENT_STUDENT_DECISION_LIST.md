# Parent/Student consolidated decision list

Last reconciled: 15 October 2026. This list consolidates only the unresolved decisions from the latest Parent/Student delivery batches. It does not authorize a capability, grant, migration, route or UI.

## Priority 1 — Student school notices

Existing implementation: COM-01 already provides immutable Administrator publication, a frozen Parent recipient manifest, exact-version read evidence and acknowledgement. Extending that owner safely can unlock **STW-27** and **STW-28** without starting another large module.

| Exact decision | Recommended option | Material alternative / consequence | Workflows unlocked |
|---|---|---|---|
| Who grants Student notice access? | Add optional `communication.notice.read_self` to one exact Student portal access; only the existing `student.access.manage` Administrator may grant it; do not backfill existing links. | Automatic inclusion silently widens every existing Student account. | STW-27, STW-28 |
| Who enters a class audience? | At publication, resolve active Students by exact Section placement and accepted portal link carrying the purpose; freeze a typed Student recipient binding. | A dynamic audience exposes notices to later transfers or removes historical provenance. | SA-35, STW-27 |
| What happens after transfer or revocation? | Preserve frozen publication membership, but recheck the exact live portal link, purpose and active school Enrollment on every read/acknowledgement; revocation denies immediately. | Rechecking current Section loses legitimate historical audience; automatic catch-up broadens publication after the fact. | STW-27, STW-28 |
| What identifies acknowledgement? | Exact notice version + typed Student recipient binding + acting account, with reauthorization before replay disclosure. | Account-only or Student-only evidence cannot prove the authorized principal. | STW-28 |
| How are correction and withdrawal represented? | Correction creates a new immutable version/manifest. Withdrawal hides the body and retains safe context. No automatic expiry in this slice. | Mutable replacement destroys evidence; expiry needs a separate retention rule. | SA-35/36, STW-27, STW-28 |
| Are attachments included? | No. Keep text notices complete and leave attachments blocked until a scanned file owner and expiring download contract exist. | Treating a URL/blob as an attachment bypasses file authorization. | STW-27 |

The full boundary and COM-02A–D split are in [Student notice projection decision](./COMMUNICATION_STUDENT_PROJECTION_DECISION.md). Parent notices and all existing Student journeys can proceed independently.

## Priority 2 — Parent Attendance explanations

The owner’s 15 October 2026 first-release decision authorized the bounded fictional-data slice. ATT-05 now provides the independent Parent purpose, exact submitted-ABSENT eligibility, originator-only case, designated branch review, versioned lifecycle and safe evidence. The table records the implemented decision; retention remains unresolved for real data.

| Exact decision | Recommended option | Material alternative / consequence | Workflows unlocked |
|---|---|---|---|
| Who submits? | Active accepted exact-child link with a separately granted `attendance.explanation.submit`. | Reusing read purposes silently creates write authority. | PAR-11–13, SA-29 |
| Which records qualify? | Existing submitted `ABSENT` marks on/after `access_from`, within an explicit school-local late window; no future planned absence in this slice. | Future or arbitrary ranges introduce a different request meaning. | PAR-11, SA-29 |
| Who reviews? | Current branch Administrator with explicit `attendance.explanation.review`, distinct from read/correct. | Teacher review requires dated assignment and protected-note visibility rules. | SA-29, PAR-12 |
| What is the lifecycle? | `SUBMITTED` to `ACCEPTED`, `DECLINED` or originator `WITHDRAWN`; terminal decisions immutable; no in-place Parent edit. | More-information/reopen states require a separate approved lifecycle. | PAR-11–12, SA-29 |
| Who sees the case? | Originating account and explicit branch reviewer only; recheck child authority for every Parent read; exclude free text from general audit/outbox. | Shared co-guardian/Teacher visibility broadens protected-note disclosure. | PAR-11–13, SA-29 |
| How long is protected free text retained? | A product/legal duration is still required. Keep state/actor transition metadata separately and allow legal hold to override expiry. | Immediate deletion weakens evidence; indefinite retention increases privacy risk. | PAR-11–13, SA-29 |
| What does acceptance do to Attendance? | Record disposition only. Any mark change remains a separate `attendance.correct` command with its existing version/history rules. | Automatic correction contradicts the approved separation of authority. | PAR-11–13, SA-27/29 |

The exact retry, concurrency and duplicate boundary is implemented as recorded in [Parent workflow matrix](./PARENT_GUARDIAN_WORKFLOW_MATRIX.md#attendance-explanation-decision-boundary). Protected-text storage defaults off and is enabled only for fictional local/test data. A retention decision is still mandatory before real data or production release.

## Next action after a decision

COM-02 Student notices, ATT-05 Parent Attendance explanations, EV-01–04 Calendar/Events and LEA-01–04 text-only Learning are engineering-verified under their approved bounded contracts. Events preserves explicit publisher designation, independent Parent/Student purposes, frozen exact audiences and live access rechecks; the combined Parent calendar now also respects the immutable pinned academic calendar. Learning includes private Student draft/on-time submission/recovery and Student-only published Teacher guidance without granting Parent response/feedback access. PAR-18 and STW-31 remain partial for their wider approved workflows. The next shared slice must be selected from the recorded backlog by satisfied dependencies and settled product semantics.
