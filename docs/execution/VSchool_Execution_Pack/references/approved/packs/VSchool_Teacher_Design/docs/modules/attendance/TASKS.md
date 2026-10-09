# Attendance — Proposed teacher tasks

Status: design handoff, not a replacement for existing repository tasks. Each slice must be demoable. Map the TEA reference to the current execution index before implementation. Never duplicate or retire current tasks implicitly.

Prerequisites: owning module released and enabled; specific permission approved; schema/API/transaction LLD reconciled. Follow earlier phase dependencies; resolve any explicit current acceptance gates.


## TEA-09 — Open an assigned attendance session

- [ ] Reconcile this contract, phase 1, capability `attendance.mark + exact dated teacher assignment` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Session context → Open register.
- [ ] Prove invariant: No default presence or absence. Reauthorize at open and submit; validate current session state and assignment.
- [ ] Prove recovery: Empty roster, cancelled session, changed assignment and duplicate open have explicit outcomes. Never manufacture pupils or a replacement session.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The exact frozen roster opens with every pupil initially unmarked.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-10 — Mark attendance and review exceptions

- [ ] Reconcile this contract, phase 1, capability `attendance.mark for exact open session` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Mark deliberately → Check the whole class.
- [ ] Prove invariant: Explicit bulk action states its scope. Mark unmarked present preserves existing exceptions; replacing every status requires a separate confirmation.
- [ ] Prove recovery: Search/filter changes never discard edits. Phase 1 reload/navigation may lose unsent input; warn clearly.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: An in-memory draft accurately represents the teacher’s intended register.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-11 — Submit attendance and keep the receipt

- [ ] Reconcile this contract, phase 1, capability `attendance.mark + eligible exact assignment` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Review totals → Submit once.
- [ ] Prove invariant: Validate the full frozen roster atomically. Same key/payload replay returns the same outcome; changed payload with that key conflicts.
- [ ] Prove recovery: Do not show success before server acknowledgement. On loss of response, retain the intent and use Check status.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: An acknowledged immutable submission shows scope, totals, actor, time and receipt reference.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-12 — Recover an uncertain submission

- [ ] Reconcile this contract, phase 1, capability `same authorized command / receipt scope` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Check status → Resolve the outcome.
- [ ] Prove invariant: Freeze payload/key while outcome is unknown. Receipt resolution reauthorizes; a receipt key is not a bearer credential.
- [ ] Prove recovery: If status check fails, remain Unknown. If not committed and still authorized, retry unchanged intent.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: One logical submission is acknowledged without duplicated or overwritten attendance.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-13 — Handle a stale register or lost permission

- [ ] Reconcile this contract, phase 1, capability `current assignment and session state` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Understand the change → Safe next action.
- [ ] Prove invariant: 409 requires explicit review; 401/403 clears protected draft data. Never silently replay an old roster against a new one.
- [ ] Prove recovery: A submitted record stays read-only; an unavailable record does not leak the new teacher or pupils.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The teacher resolves a valid conflict or leaves an unavailable record without silent overwrite.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-14 — Review history and hand off a correction

- [ ] Reconcile this contract, phase 1, capability `attendance.read_class within authorized assignment scope` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Locate the session → Correction handoff.
- [ ] Prove invariant: No attendance.correct from the Teacher role. Show original submission and permitted correction history with safe reasons.
- [ ] Prove recovery: If the current assignment no longer authorizes the record, deny rather than revealing historical rosters.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The teacher understands the recorded result and the administrator’s correction route.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-15 — Use offline-assisted attendance

- [ ] Reconcile this contract, phase 2, capability `attendance.mark + approved offline capability` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Prepare an authorized session → Reconnect and reconcile.
- [ ] Prove invariant: Phase 1 remains online-first. Any later durable queue needs expiry, minimization, device protection and reauthorization before replay.
- [ ] Prove recovery: Permission revocation, lost device, changed roster, expired queue and competing submission must not silently sync.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: An authorized queued intent is reconciled explicitly and then acknowledged.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-16 — Request an attendance correction

- [ ] Reconcile this contract, phase 2, capability `attendance.correction.request (proposed)` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Identify the exact record → Explain.
- [ ] Prove invariant: New extension requiring scope approval. Only the administrator’s attendance.correct command changes the register.
- [ ] Prove recovery: Duplicates, withdrawal, permission loss and already-corrected records are handled with traceable decisions.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: A proposed request has Pending review / Accepted / Declined states and a linked outcome.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. Scope-extension decision remains a prerequisite.
