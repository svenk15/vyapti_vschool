<!-- TT-01 contract -->
## TT-01 supersedes the timetable outline
For STW-07, STW-08, follow [Shared timetable workflows](../../timetable/WORKFLOWS.md), [physical LLD](../../timetable/LLD.md), [one task queue](../../timetable/TASKS.md) and [checkpoint](../../timetable/CURRENT_STATE.md). The timetable-specific outline below is retained as historical context; do not implement it as an independent queue. Other module workflows remain current. First release is a weekly cycle; two-week cycle remains future scope.

# My day & classes — DESIGN
Design status: DESIGNED_FOR_UX_REVIEW. Production implementation: NOT_ASSESSED. Human acceptance: PENDING.
Owner: Academics. Earliest proposed phase: 3.

## Purpose and screens
Actionable published schedule and assigned class context.
Use the shared UX_SYSTEM.md. Reference boards (desktop/mobile): My-day, Timetable, Class-change. Every workflow also has a guided review under flow/STW-xx. Specialist walkthroughs are proposals, not fully connected downstream implementations.

## Domain and low-level boundary
Entities/tables to reconcile: Offering; published ScheduleOccurrence; authorized task projections.
Application ports: ReadMyDay / ReadPublishedTimetable / ReadAssignedClass.
Repository workflow: Join current enrollment to published occurrence/audience. Bound home task rows and fetch own draft/attempt summaries; class change references published revision. These reads never mutate attendance.
Prerequisite: Published timetable owner and dated assignment membership; no assumption that Phase 1 manual sessions are a timetable engine.

## Permission and transport
Authenticate server principal; derive current verified student enrollment. Check released module, institution entitlement, branch enablement, capability and object/audience scope on every read, command, status and download. Route/form identifiers are references only. Do not rely on client visibility or caller-settable tenant GUCs. HTTP DTOs cannot contain private teacher/guardian/peer data.

Use domain values for IDs, versions, publication state and school time. Commands validate before mutation, follow shared lock order, commit evidence atomically and return typed outcomes. Exact replay must reauthorize reads and return the same owner result. Do not hold DB locks over external provider I/O. Query DTOs are bounded/paginated.

## Shared failure states
Loading, legitimate empty state, recoverable request failure, session expiry, revoked access, version conflict and module unavailable. For mutating journeys, distinguish definitive rejection from transport uncertainty and preserve the intent. Full-page errors should not silently clear unsaved work. Every confirm/dialog action is keyboard accessible and has a safe cancellation path.

## STW-06 — Plan my school day
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Know the next class and the next deliberate action.
1. **Review today** — Show school-local date, next class and a short prioritized list of due work.
2. **Open an action** — Go directly to published class details, assignment, returned feedback or notice.
3. **Outcome:** Student reaches one clear next task.

**Permission/invariant:** No engagement score, anxiety countdown, class rank or fabricated completion percentage.
**Failure/recovery:** Empty timetable and nothing-due states remain useful; display last successful refresh.
**Persistence/data:** Published ScheduleOccurrence + student Assignment projections + returned Feedback.
**Join/write contract:** Join current enrollment to published occurrence/audience. Bound home task rows and fetch own draft/attempt summaries; class change references published revision. These reads never mutate attendance.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-07 — Read my timetable
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Understand the published week.
1. **Select date** — Browse days in school timezone and show current published version.
2. **Open class** — Read subject, period, room and permitted teacher name.
3. **Outcome:** Exact occurrence details.

**Permission/invariant:** Manual attendance sessions do not imply a recurring timetable engine.
**Failure/recovery:** Cancelled, room-changed and not-yet-published are explicit states.
**Persistence/data:** Academic enrollment, offering, published timetable revision and occurrence.
**Join/write contract:** Join current enrollment to published occurrence/audience. Bound home task rows and fetch own draft/attempt summaries; class change references published revision. These reads never mutate attendance.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-08 — Respond to a changed class
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Notice a schedule change without confusing it with attendance.
1. **Read change** — Show old/new room or time with effective date and published notice.
2. **View current class** — Navigate to the current occurrence; do not silently open cancelled links.
3. **Outcome:** Current class context with visible change.

**Permission/invariant:** A cancellation never manufactures an attendance outcome.
**Failure/recovery:** Stale links resolve current published version or a safe cancelled state.
**Persistence/data:** Schedule revision + occurrence + scoped communication update.
**Join/write contract:** Join current enrollment to published occurrence/audience. Bound home task rows and fetch own draft/attempt summaries; class change references published revision. These reads never mutate attendance.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-09 — Open an assigned class space
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Find course-specific work and resources.
1. **Choose my class** — Show only current assigned offerings, grouped by subject.
2. **Review class** — Open published work, permitted resources and returned feedback.
3. **Outcome:** Own course material only.

**Permission/invariant:** No class roster, classmates’ marks, guardian contacts or private teacher notes.
**Failure/recovery:** Ended enrollment follows explicit historical-access policy; default deny new downloads.
**Persistence/data:** Offering + dated Enrollment/AssignmentAudience; minimized student projection.
**Join/write contract:** Join current enrollment to published occurrence/audience. Bound home task rows and fetch own draft/attempt summaries; class change references published revision. These reads never mutate attendance.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.
