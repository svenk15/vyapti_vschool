# Student support — Proposed teacher tasks

Status: design handoff, not a replacement for existing repository tasks. Each slice must be demoable. Map the TEA reference to the current execution index before implementation. Never duplicate or retire current tasks implicitly.

Prerequisites: owning module released and enabled; specific permission approved; schema/API/transaction LLD reconciled. Follow earlier phase dependencies; resolve any explicit current acceptance gates.


## TEA-36 — Refer a student concern safely

- [ ] Reconcile this contract, phase 6, capability `restricted referral.create; assigned pupil context` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Minimal referral → Restricted handoff.
- [ ] Prove invariant: Teacher role gives no full clinical, custody or safeguarding case access. No automatic parent notification for a sensitive concern.
- [ ] Prove recovery: Unavailable recipient or urgent danger uses the approved human escalation protocol; do not leave an urgent case in a generic queue.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: A minimal referral is handed to an authorized specialist with accountable status.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed.
