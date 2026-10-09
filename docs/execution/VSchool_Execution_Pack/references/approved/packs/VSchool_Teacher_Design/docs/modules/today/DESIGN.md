# My teaching day — Teacher design

Edition 01 · First phase 1 · UX design proposal

See the next class and the work that needs attention.

Domain owner(s): academics, attendance. The teacher UI consumes these owners; it does not become a new shared-data owner. Resolve exact physical tables/capabilities against the current repository before coding.

## Common layout and states

Use the shared shell, typography, icons, context control, fluid Filter/Sort drawers and explicit outcomes from ../../UX_SYSTEM.md. All protected reads and commands recheck server scope. Include loading, empty, invalid input, permission loss, expired session, stale version and relevant unknown/delivery failure states. Keep institution/branch, school-local date and current assignment explicit.

## TEA-05 — Plan my teaching day

Phase: 1 (Attendance pilot). Reconcile the approved module scope before implementation.

Entry: `today`. Required capability/condition: **class.read + assigned attendance capabilities**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Choose the date** — The school-local date determines the schedule.
   - Teaching date: `date`; required.
2. **Next action** — Show sessions in time order with their actual state.
   - Open: `select`; required; choices: Next assigned session, Unsubmitted register, Submitted session receipt.

### Outcome and domain invariant

The teacher reaches the right class with a clear next action.

Scheduled, open, submitted and cancelled are distinct. A missing register never creates absence records. No unrelated school-wide student counts.

### Failure and recovery

No sessions is a helpful empty state, not evidence of an account failure. Refresh rechecks assignments.

### Data workflow and ownership

Authorized Offering/Assignment → dated AttendanceSession read model. Include branch zone, as-of time and server-resolved capability.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-06 — Resolve a missing or changed assignment

Phase: 1 (Attendance pilot). Reconcile the approved module scope before implementation.

Entry: `flow/TEA-06`. Required capability/condition: **self.read + minimal assignment status**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Readiness** — Show the safe reason the teaching day is incomplete.
   - Issue: `select`; required; choices: No active teaching assignment, Teacher eligibility not ready, Session changed or cancelled.
2. **Handoff** — The teacher cannot repair identity, eligibility or assignments themselves.
   - Safe support reference: `text`; required.
   - Next step: `select`; required; choices: Contact school administrator, Refresh after administrator update.

### Outcome and domain invariant

The teacher has a precise, non-sensitive handoff and a retry route.

Never widen access, create an assignment or offer another teacher’s session to fill an empty page.

### Failure and recovery

If assignment is revoked while open, stop access and clear protected draft data.

### Data workflow and ownership

Read Access/People/Academics readiness through published minimal contracts. Phase 1 handoff is informational, not a new ticket system.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.
