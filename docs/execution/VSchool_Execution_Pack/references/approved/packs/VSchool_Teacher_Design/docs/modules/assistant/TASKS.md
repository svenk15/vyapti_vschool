# Teaching assistant — Proposed teacher tasks

Status: design handoff, not a replacement for existing repository tasks. Each slice must be demoable. Map the TEA reference to the current execution index before implementation. Never duplicate or retire current tasks implicitly.

Prerequisites: owning module released and enabled; specific permission approved; schema/API/transaction LLD reconciled. Follow earlier phase dependencies; resolve any explicit current acceptance gates.


## TEA-42 — Use a teaching draft with source evidence

- [ ] Reconcile this contract, phase 7, capability `assistant.use + each source capability` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Choose an allowed task → Review evidence → Human action.
- [ ] Prove invariant: No autonomous attendance marking, grading, discipline, diagnosis or guardian messaging. No unrestricted student SQL or sensitive-case retrieval.
- [ ] Prove recovery: Missing evidence, prompt injection, stale content and provider failure cause abstention or an explicit safe fallback.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: A reviewed draft supports the teacher without independently changing school records.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed.
