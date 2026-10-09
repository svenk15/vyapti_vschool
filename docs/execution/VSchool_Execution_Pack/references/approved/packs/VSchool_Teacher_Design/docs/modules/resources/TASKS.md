# Resources & facilities — Proposed teacher tasks

Status: design handoff, not a replacement for existing repository tasks. Each slice must be demoable. Map the TEA reference to the current execution index before implementation. Never duplicate or retire current tasks implicitly.

Prerequisites: owning module released and enabled; specific permission approved; schema/API/transaction LLD reconciled. Follow earlier phase dependencies; resolve any explicit current acceptance gates.


## TEA-39 — Borrow, reserve or renew a resource

- [ ] Reconcile this contract, phase 6, capability `library.self_service for own borrower identity` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Find resource → Request.
- [ ] Prove invariant: A request is not a confirmed checkout until the circulation owner records it. No authority to waive fines or edit another borrower.
- [ ] Prove recovery: Already loaned copy, hold queue, renewal limit and lost item have explicit outcomes.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The teacher sees their own loan/reservation and due date.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-40 — Request materials or book a teaching space

- [ ] Reconcile this contract, phase 6, capability `resource.request / facility.book within granted scope` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Request → Purpose.
- [ ] Prove invariant: No direct stock adjustment or room double-booking; timetable commitments and maintenance blocks apply.
- [ ] Prove recovery: Concurrent booking, unavailable quantity, overdue return and changed class schedule need reviewed alternatives.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The request is confirmed only after availability and approval checks.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed.
