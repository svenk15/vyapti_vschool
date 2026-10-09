# Messages & families — Proposed teacher tasks

Status: design handoff, not a replacement for existing repository tasks. Each slice must be demoable. Map the TEA reference to the current execution index before implementation. Never duplicate or retire current tasks implicitly.

Prerequisites: owning module released and enabled; specific permission approved; schema/API/transaction LLD reconciled. Follow earlier phase dependencies; resolve any explicit current acceptance gates.


## TEA-17 — Read school notices and acknowledge

- [ ] Reconcile this contract, phase 2, capability `communication.read for explicit audience` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Notice → Acknowledge when requested.
- [ ] Prove invariant: Do not infer acknowledgement from an opened page or email tracking. Attachments reauthorize.
- [ ] Prove recovery: Edited/withdrawn notice or revoked audience membership has a safe update state.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: A required acknowledgement records the teacher’s explicit action.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-18 — Prepare a class message

- [ ] Reconcile this contract, phase 2, capability `communication.compose; send requires delegated scope` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Message → Audience review → Submit for approval.
- [ ] Prove invariant: Teacher role is not a blanket send grant. Recheck relationship, purpose, consent and module access at actual delivery.
- [ ] Prove recovery: Provider failure/unknown is distinct from sent/delivered. Revoked relationships are suppressed, not retried.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: A message draft or approval request has a visible status.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-19 — Reply in a permitted family conversation

- [ ] Reconcile this contract, phase 2, capability `communication.reply + child/conversation grant` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Conversation context → Reply.
- [ ] Prove invariant: No teacher-created guardian relationship or invitation. A household contact or payer is not automatically a portal guardian.
- [ ] Prove recovery: Removed participant or revoked child grant prevents further disclosure; report safely to the school office.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: A reply appears in the authorized thread with its actual delivery state.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-20 — Arrange a family meeting

- [ ] Reconcile this contract, phase 2, capability `meeting.request within permitted family relationship (proposed)` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Purpose and participant → Availability.
- [ ] Prove invariant: This scheduling extension needs approval and a conflict model before implementation. No student-sensitive detail in public calendars.
- [ ] Prove recovery: Concurrent booking, cancellation, time-zone display and guardian revocation require clear recovery.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The request is proposed, confirmed, rescheduled or cancelled with an explicit participant response.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. Scope-extension decision remains a prerequisite.

## TEA-21 — Review permitted absence context

- [ ] Reconcile this contract, phase 2, capability `attendance explanation read purpose; no default approval` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Student and date → School handoff.
- [ ] Prove invariant: No clinical attachment, private family dispute or guardian note unless explicitly authorized. No automatic absence inference.
- [ ] Prove recovery: Pending explanation, late attendance, revoked relationship and unavailable detail are distinct.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The teacher gets necessary context while the school office controls disposition and correction.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed.
