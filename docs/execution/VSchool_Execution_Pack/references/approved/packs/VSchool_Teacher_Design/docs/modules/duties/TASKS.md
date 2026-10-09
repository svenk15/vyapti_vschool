# Assigned duties — Proposed teacher tasks

Status: design handoff, not a replacement for existing repository tasks. Each slice must be demoable. Map the TEA reference to the current execution index before implementation. Never duplicate or retire current tasks implicitly.

Prerequisites: owning module released and enabled; specific permission approved; schema/API/transaction LLD reconciled. Follow earlier phase dependencies; resolve any explicit current acceptance gates.


## TEA-41 — Carry out an assigned school duty

- [ ] Reconcile this contract, phase 6, capability `explicit dated duty / minimal roster grant (proposed)` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Duty scope → Record accountable handoff.
- [ ] Prove invariant: Proposed extension: explicit activity-specific grant, dates and authorized pickup/handoff rules must precede implementation. No unrestricted live child location.
- [ ] Prove recovery: Wrong-child handoff, missing pickup authority or offline uncertainty uses the approved human fallback.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The assigned duty records a minimal outcome and responsible handoff.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. Scope-extension decision remains a prerequisite.
