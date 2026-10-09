<!-- TT-01 contract -->
## TT-01 supersedes the timetable outline
For TEA-22, TEA-23, TEA-24, follow [Shared timetable workflows](../../timetable/WORKFLOWS.md), [physical LLD](../../timetable/LLD.md), [one task queue](../../timetable/TASKS.md) and [checkpoint](../../timetable/CURRENT_STATE.md). The timetable-specific outline below is retained as historical context; do not implement it as an independent queue. Other module workflows remain current. First release is a weekly cycle; two-week cycle remains future scope.

# Timetable & cover — Teacher design

Edition 01 · First phase 3 · UX design proposal

Understand published schedules and explicit temporary teaching assignments.

Domain owner(s): academics. The teacher UI consumes these owners; it does not become a new shared-data owner. Resolve exact physical tables/capabilities against the current repository before coding.

## Common layout and states

Use the shared shell, typography, icons, context control, fluid Filter/Sort drawers and explicit outcomes from ../../UX_SYSTEM.md. All protected reads and commands recheck server scope. Include loading, empty, invalid input, permission loss, expired session, stale version and relevant unknown/delivery failure states. Keep institution/branch, school-local date and current assignment explicit.

## TEA-22 — Review my published timetable

Phase: 3 (Teaching and learning). Reconcile the approved module scope before implementation.

Entry: `planning`. Required capability/condition: **timetable.read for current assignments**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Week** — A published version is distinct from a draft plan.
   - Week beginning: `date`; required.
2. **Session details** — See room, subject and permitted changes with a list alternative to the grid.
   - Assigned class: `select`; required; choices: Grade 6 · A · Mathematics, Grade 6 · B · Mathematics, Grade 7 · A · Science.
   - View: `select`; required; choices: Published timetable, Dated exceptions.

### Outcome and domain invariant

The teacher can plan against a versioned schedule and identify changes.

Manual Phase 1 sessions do not imply recurring timetable support. A schedule view never creates attendance records.

### Failure and recovery

Draft/unpublished change, room closure and cancelled occurrence clearly identify the current authoritative version.

### Data workflow and ownership

Academics TimetableVersion/slots + dated assignments and exceptions compose the view; Attendance references generated occurrence source.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-23 — Accept and perform a cover assignment

Phase: 3 (Teaching and learning). Reconcile the approved module scope before implementation.

Entry: `flow/TEA-23`. Required capability/condition: **explicit cover/dated assignment grant**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Cover request** — Show class, period and responsibilities before acceptance.
   - Cover: `select`; required; choices: Grade 6 B · Mathematics · 12 Oct, 11:15.
2. **Confirm availability** — Eligibility and clashes are rechecked before making access effective.
   - Response: `select`; required; choices: Accept availability, Decline with reason.
   - Reason: `textarea`; required.

### Outcome and domain invariant

An authorized cover assignment grants only the exact required session scope.

Accepting a message alone grants nothing. No shared credentials, administrator impersonation or permanent roster access.

### Failure and recovery

Clash, stale request, revoked eligibility and already-opened session follow the approved substitution contract.

### Data workflow and ownership

Academics owns Substitution/Assignment changes; attendance assignment resolver checks dated scope at every action.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-24 — Hand over a lesson or request a schedule change

Phase: 3 (Teaching and learning). Explicit scope extension; approval/reconciliation required.

Entry: `flow/TEA-24`. Required capability/condition: **timetable.change.request (proposed) + own assignment**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Affected lesson** — A request does not directly modify the timetable.
   - Assigned class: `select`; required; choices: Grade 6 · A · Mathematics, Grade 6 · B · Mathematics, Grade 7 · A · Science.
   - Date: `date`; required.
   - Request type: `select`; required; choices: Availability change, Room issue, Cover handoff.
2. **Handoff** — Share only necessary teaching context with the authorized recipient.
   - Lesson handoff / request reason: `textarea`; required.

### Outcome and domain invariant

The scheduling owner reviews the request and publishes any approved change.

Do not move a scheduled session or grant access from a teacher draft. Open/submitted history is preserved.

### Failure and recovery

Denied request or changed assignment leaves the original schedule authoritative.

### Data workflow and ownership

Proposed TimetableChangeRequest links an existing offering/occurrence; Academics executes approval. Learning resources keep their grants.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.
