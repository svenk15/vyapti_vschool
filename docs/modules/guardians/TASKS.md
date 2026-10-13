# Guardians tasks

## FAM-01 — Simplified child access and invitation foundation

Implement the designated `family.access.manage` grant, explicit child authorization, fixed three-purpose bundle, dedicated invitation/acceptance, resend, revocation, account-wide recovery affiliation and minimal permitted-child query described in DESIGN.

Acceptance requires real PostgreSQL negative/concurrency/replay evidence, no staff membership for guardians, and browser coverage of Administrator link → invitation → guardian entry plus failure/revocation states. Human review remains separate.

Status: **ENGINEERING_VERIFIED**. Human review: **PENDING**.

## FAM-02 — Parent child home

Render the approved Parent shell, child selector and minimal child/current-school summary using FAM-01 authority. No owner statistics are fabricated.

Status: **ENGINEERING_VERIFIED**. Human review: **PENDING**.

## FAM-03 — Parent Attendance read

Add the Attendance-owned child history projection bounded by `access_from`, submitted session state and `attendance.read_child`.

Status: **ENGINEERING_VERIFIED**. Human review: **PENDING**.

## FAM-04 — Parent published Timetable read

Complete the Parent slice of TT-06 through the Academics owner projection, active Enrollment/Placement and `timetable.read_child`; expose no drafts or Teacher actions.

Status: **ENGINEERING_VERIFIED**. Human review: **PENDING**.
