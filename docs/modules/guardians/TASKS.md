# Guardians tasks

## FAM-01 — Simplified child access and invitation foundation

Implement the designated `family.access.manage` grant, explicit child authorization, fixed three-purpose bundle, dedicated invitation/acceptance, resend, revocation, account-wide recovery affiliation and minimal permitted-child query described in DESIGN.

Acceptance requires real PostgreSQL negative/concurrency/replay evidence, no staff membership for guardians, and browser coverage of Student registration receipt → guarded Parent setup → invitation plus failure/revocation states. A delivery failure must preserve the registered Student and one Guardian authorization on exact retry. Human review remains separate.

Status: **ENGINEERING_VERIFIED**. Human review: **PENDING**.

## FAM-02 — Parent child home

Render the approved Parent shell, child selector and minimal child/current-school summary using FAM-01 authority. No owner statistics are fabricated.

Status: **ENGINEERING_VERIFIED**. Human review: **PENDING**.

## FAM-03 — Parent Attendance read

Add the Attendance-owned child history projection bounded by `access_from`, submitted session state and `attendance.read_child`.

Status: **ENGINEERING_VERIFIED**. Human review: **PENDING**.

## FAM-04 — Parent published Timetable read

Complete the Parent slice of TT-06 through the Academics owner projection, active Enrollment/Placement and `timetable.read_child`; expose the effective published teaching days and ordered lesson/break periods without assuming five weekdays, and expose no drafts or Teacher actions.

Status: **ENGINEERING_VERIFIED**. Human review: **PENDING**.

## FAM-05 — Parent account and current-session composition

Compose the existing Access safe-self projection, current hosting-session timestamps, generic account recovery and current-session sign-out through the approved PAR-50 staged Parent flow. Retain in-flow choices across Back/Continue, execute only on final confirmation, expose no token or other-session inventory, and prove that browser Back cannot reveal protected child data after sign-out. No schema or migration is required.

Status: **ENGINEERING_VERIFIED** at `7d52491`. Human review: **PENDING**.

## FAM-06 — Independent school-notice purpose

Allow a manager to select `communication.notice.read` independently during a new child-access invitation. Communication remains the owner of notices, audience snapshots and acknowledgements; Guardians only supplies the live exact-purpose check. Existing accepted links are not broadened automatically.

Status: **ENGINEERING_VERIFIED** with COM-01. Human review: **PENDING**.

## FAM-07 — Independent Attendance explanation purpose

Allow the designated manager to select or version-change `attendance.explanation.submit` for one exact GuardianChildAccess. Do not infer it from the fixed read bundle and do not backfill existing links. Attendance remains the case/disposition owner and consumes the live exact-purpose verifier.

Status: **ENGINEERING_VERIFIED** with ATT-05 for the authorized fictional-data slice. Human review: **PENDING**. Real-data protected-text retention remains a release gate.
