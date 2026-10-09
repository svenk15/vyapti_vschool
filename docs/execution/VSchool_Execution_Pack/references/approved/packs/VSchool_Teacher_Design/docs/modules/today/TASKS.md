# My teaching day — Proposed teacher tasks

Status: design handoff, not a replacement for existing repository tasks. Each slice must be demoable. Map the TEA reference to the current execution index before implementation. Never duplicate or retire current tasks implicitly.

Prerequisites: owning module released and enabled; specific permission approved; schema/API/transaction LLD reconciled. Follow earlier phase dependencies; resolve any explicit current acceptance gates.


## TEA-05 — Plan my teaching day

- [ ] Reconcile this contract, phase 1, capability `class.read + assigned attendance capabilities` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Choose the date → Next action.
- [ ] Prove invariant: Scheduled, open, submitted and cancelled are distinct. A missing register never creates absence records. No unrelated school-wide student counts.
- [ ] Prove recovery: No sessions is a helpful empty state, not evidence of an account failure. Refresh rechecks assignments.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The teacher reaches the right class with a clear next action.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-06 — Resolve a missing or changed assignment

- [ ] Reconcile this contract, phase 1, capability `self.read + minimal assignment status` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Readiness → Handoff.
- [ ] Prove invariant: Never widen access, create an assignment or offer another teacher’s session to fill an empty page.
- [ ] Prove recovery: If assignment is revoked while open, stop access and clear protected draft data.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The teacher has a precise, non-sensitive handoff and a retry route.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed.
