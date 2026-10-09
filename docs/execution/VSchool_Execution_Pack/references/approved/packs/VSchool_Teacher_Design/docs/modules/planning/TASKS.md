<!-- TT-01 contract -->
## TT-01 supersedes the timetable outline
For TEA-22, TEA-23, TEA-24, follow [Shared timetable workflows](../../timetable/WORKFLOWS.md), [physical LLD](../../timetable/LLD.md), [one task queue](../../timetable/TASKS.md) and [checkpoint](../../timetable/CURRENT_STATE.md). The timetable-specific outline below is retained as historical context; do not implement it as an independent queue. Other module workflows remain current. First release is a weekly cycle; two-week cycle remains future scope.

# Timetable & cover — Proposed teacher tasks

Status: design handoff, not a replacement for existing repository tasks. Each slice must be demoable. Map the TEA reference to the current execution index before implementation. Never duplicate or retire current tasks implicitly.

Prerequisites: owning module released and enabled; specific permission approved; schema/API/transaction LLD reconciled. Follow earlier phase dependencies; resolve any explicit current acceptance gates.


## TEA-22 — Review my published timetable

- [ ] Reconcile this contract, phase 3, capability `timetable.read for current assignments` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Week → Session details.
- [ ] Prove invariant: Manual Phase 1 sessions do not imply recurring timetable support. A schedule view never creates attendance records.
- [ ] Prove recovery: Draft/unpublished change, room closure and cancelled occurrence clearly identify the current authoritative version.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The teacher can plan against a versioned schedule and identify changes.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-23 — Accept and perform a cover assignment

- [ ] Reconcile this contract, phase 3, capability `explicit cover/dated assignment grant` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Cover request → Confirm availability.
- [ ] Prove invariant: Accepting a message alone grants nothing. No shared credentials, administrator impersonation or permanent roster access.
- [ ] Prove recovery: Clash, stale request, revoked eligibility and already-opened session follow the approved substitution contract.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: An authorized cover assignment grants only the exact required session scope.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-24 — Hand over a lesson or request a schedule change

- [ ] Reconcile this contract, phase 3, capability `timetable.change.request (proposed) + own assignment` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Affected lesson → Handoff.
- [ ] Prove invariant: Do not move a scheduled session or grant access from a teacher draft. Open/submitted history is preserved.
- [ ] Prove recovery: Denied request or changed assignment leaves the original schedule authoritative.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The scheduling owner reviews the request and publishes any approved change.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. Scope-extension decision remains a prerequisite.
