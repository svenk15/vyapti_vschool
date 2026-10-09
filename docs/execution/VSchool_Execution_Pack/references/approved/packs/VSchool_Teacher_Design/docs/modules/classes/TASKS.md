# My classes — Proposed teacher tasks

Status: design handoff, not a replacement for existing repository tasks. Each slice must be demoable. Map the TEA reference to the current execution index before implementation. Never duplicate or retire current tasks implicitly.

Prerequisites: owning module released and enabled; specific permission approved; schema/API/transaction LLD reconciled. Follow earlier phase dependencies; resolve any explicit current acceptance gates.


## TEA-07 — Review my assigned classes

- [ ] Reconcile this contract, phase 1, capability `class.read for dated assignments` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Class context → Class workspace.
- [ ] Prove invariant: Recheck the dated assignment on every protected read. Historical visibility follows the current approved access contract, not lifelong access from one past lesson.
- [ ] Prove recovery: Ended or changed assignments show unavailable content and an administrator handoff.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The class workspace explains what the teacher can do and for which dates.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-08 — Review a minimal class roster

- [ ] Reconcile this contract, phase 1, capability `class.read + assigned-roster student.read` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Roster scope → Student context.
- [ ] Prove invariant: No institution-wide person search, unrelated pupil directory, bulk pupil export, financial ledger, custody detail or clinical narrative.
- [ ] Prove recovery: A pupil joining/leaving on a boundary changes future roster eligibility; already opened session rosters remain frozen.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The teacher can identify the correct pupil without gaining full student-record access.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed.
