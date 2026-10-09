# My attendance — DESIGN
Design status: DESIGNED_FOR_UX_REVIEW. Production implementation: NOT_ASSESSED. Human acceptance: PENDING.
Owner: Attendance + Requests. Earliest proposed phase: 2.

## Purpose and screens
Read exact recorded sessions and request review.
Use the shared UX_SYSTEM.md. Reference boards (desktop/mobile): Attendance, Attendance-detail, Awaiting-attendance, Attendance-query. Every workflow also has a guided review under flow/STW-xx. Specialist walkthroughs are proposals, not fully connected downstream implementations.

## Domain and low-level boundary
Entities/tables to reconcile: Session; frozen RosterMember; Record/Revision; OwnedRequest.
Application ports: ReadOwnAttendance / QueryAttendanceRecord.
Repository workflow: Join own student to frozen session roster and current record. Missing mark remains Awaiting submission. Query inserts request and audit only; no AttendanceRecord update in student command.
Prerequisite: Existing attendance granularity, record-version visibility and school query category. STW-26 is an explicit scope extension.

## Permission and transport
Authenticate server principal; derive current verified student enrollment. Check released module, institution entitlement, branch enablement, capability and object/audience scope on every read, command, status and download. Route/form identifiers are references only. Do not rely on client visibility or caller-settable tenant GUCs. HTTP DTOs cannot contain private teacher/guardian/peer data.

Use domain values for IDs, versions, publication state and school time. Commands validate before mutation, follow shared lock order, commit evidence atomically and return typed outcomes. Exact replay must reauthorize reads and return the same owner result. Do not hold DB locks over external provider I/O. Query DTOs are bounded/paginated.

## Shared failure states
Loading, legitimate empty state, recoverable request failure, session expiry, revoked access, version conflict and module unavailable. For mutating journeys, distinguish definitive rejection from transport uncertainty and preserve the intent. Full-page errors should not silently clear unsaved work. Every confirm/dialog action is keyboard accessible and has a safe cancellation path.

## STW-25 — View my recorded attendance
Phase: 2. Reconcile with owner release/dependency gates.

**Intent:** See what the school actually recorded.
1. **Select date/session** — Show exact subject/time and Present/Absent/Late/Excused or Awaiting submission.
2. **Read details** — Show recorded revision and school-local date.
3. **Outcome:** Accurate self-only record.

**Permission/invariant:** No parent/staff data; unsubmitted attendance is never absence; avoid unsupported daily aggregates.
**Failure/recovery:** Permission change clears records; corrected outcome has traceable published details.
**Persistence/data:** AttendanceSession + roster member + current authorized mark/revision.
**Join/write contract:** Join own student to frozen session roster and current record. Missing mark remains Awaiting submission. Query inserts request and audit only; no AttendanceRecord update in student command.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-26 — Query an attendance discrepancy
Phase: 2. Explicit scope extension; allocate/approve before coding.

**Intent:** Ask the school to review an apparent mistake.
1. **Choose record** — Reference a submitted session and give a bounded explanation.
2. **Submit for review** — Show Pending school review and tracking reference.
3. **Outcome:** Owned review request, original record unchanged.

**Permission/invariant:** Student cannot directly edit attendance or approve absence.
**Failure/recovery:** Duplicate open query links existing request; final decision remains school-owned.
**Persistence/data:** Student request + exact AttendanceRecord reference; optional authorized correction link.
**Join/write contract:** Join own student to frozen session roster and current record. Missing mark remains Awaiting submission. Query inserts request and audit only; no AttendanceRecord update in student command.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.
