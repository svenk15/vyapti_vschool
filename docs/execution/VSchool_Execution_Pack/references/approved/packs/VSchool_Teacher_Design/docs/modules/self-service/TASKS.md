# My requests — Proposed teacher tasks

Status: design handoff, not a replacement for existing repository tasks. Each slice must be demoable. Map the TEA reference to the current execution index before implementation. Never duplicate or retire current tasks implicitly.

Prerequisites: owning module released and enabled; specific permission approved; schema/API/transaction LLD reconciled. Follow earlier phase dependencies; resolve any explicit current acceptance gates.


## TEA-37 — Request leave and arrange a handoff

- [ ] Reconcile this contract, phase 6, capability `own leave.request; no approval power` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Leave request → Teaching impact.
- [ ] Prove invariant: Coverage belongs to the timetable owner; pupil and staff attendance are different domains. Sensitive leave evidence is restricted.
- [ ] Prove recovery: Insufficient balance, overlapping request or changed approval authority blocks/returns appropriately.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The request is pending, approved, returned or declined with a clear reason.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-38 — Review my staff record and request a correction

- [ ] Reconcile this contract, phase 6, capability `own staff.read / correction request` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: My details → Correction request.
- [ ] Prove invariant: No view of colleagues’ personal records or payroll; bank/salary changes require a separately designed sensitive process.
- [ ] Prove recovery: Revoked employment, disputed evidence and duplicate requests route to the authorized HR owner.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: An own-record request has a traceable decision.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed.
