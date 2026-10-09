# Resources & facilities — Teacher design

Edition 01 · First phase 6 · UX design proposal

Borrow, request or book permitted teaching resources.

Domain owner(s): library, inventory, facilities. The teacher UI consumes these owners; it does not become a new shared-data owner. Resolve exact physical tables/capabilities against the current repository before coding.

## Common layout and states

Use the shared shell, typography, icons, context control, fluid Filter/Sort drawers and explicit outcomes from ../../UX_SYSTEM.md. All protected reads and commands recheck server scope. Include loading, empty, invalid input, permission loss, expired session, stale version and relevant unknown/delivery failure states. Keep institution/branch, school-local date and current assignment explicit.

## TEA-39 — Borrow, reserve or renew a resource

Phase: 6 (School services). Reconcile the approved module scope before implementation.

Entry: `resources`. Required capability/condition: **library.self_service for own borrower identity**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Find resource** — Search permitted catalog items, not other borrowers’ history.
   - Title or copy reference: `text`; required.
2. **Request** — Current eligibility and hold policy determine availability.
   - Action: `select`; required; choices: Request checkout, Reserve available title, Request renewal.

### Outcome and domain invariant

The teacher sees their own loan/reservation and due date.

A request is not a confirmed checkout until the circulation owner records it. No authority to waive fines or edit another borrower.

### Failure and recovery

Already loaned copy, hold queue, renewal limit and lost item have explicit outcomes.

### Data workflow and ownership

Library CatalogItem/Copy/Loan/Reservation read contracts; teacher requests are scoped to own borrower identity.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-40 — Request materials or book a teaching space

Phase: 6 (School services). Reconcile the approved module scope before implementation.

Entry: `flow/TEA-40`. Required capability/condition: **resource.request / facility.book within granted scope**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Request** — Choose a teaching need and time.
   - Resource: `select`; required; choices: Science lab, Projector kit, Classroom materials.
   - Date: `date`; required.
   - Start time: `time`; required.
   - End time: `time`; required.
2. **Purpose** — Inventory custody and room scheduling remain explicit.
   - Teaching purpose: `textarea`; required.

### Outcome and domain invariant

The request is confirmed only after availability and approval checks.

No direct stock adjustment or room double-booking; timetable commitments and maintenance blocks apply.

### Failure and recovery

Concurrent booking, unavailable quantity, overdue return and changed class schedule need reviewed alternatives.

### Data workflow and ownership

Facilities booking range and Inventory request/custody references; authorized owner commands append movements and reservations.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.
