# Assessments — Proposed teacher tasks

Status: design handoff, not a replacement for existing repository tasks. Each slice must be demoable. Map the TEA reference to the current execution index before implementation. Never duplicate or retire current tasks implicitly.

Prerequisites: owning module released and enabled; specific permission approved; schema/API/transaction LLD reconciled. Follow earlier phase dependencies; resolve any explicit current acceptance gates.


## TEA-32 — Prepare an assessment within an approved scheme

- [ ] Reconcile this contract, phase 4, capability `assessment.plan.write for assigned subject` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Assessment context → Assessment details.
- [ ] Prove invariant: Teachers do not change the institution’s grading policy by editing a screen. Approved publication authority remains separate.
- [ ] Prove recovery: Scheme revision, invalid max score, conflicting dates and lost subject assignment require review.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: A scoped assessment is prepared under a pinned scheme.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-33 — Enter and validate marks

- [ ] Reconcile this contract, phase 4, capability `assessment.mark.write for exact assigned assessment` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Student outcome → Review before saving.
- [ ] Prove invariant: Exact validated score scale; zero is a legitimate score, not a stand-in for missing. Exemption authority may be separately required.
- [ ] Prove recovery: Two-editor conflict, changed scheme, missing evidence and withdrawn enrollment do not silently overwrite.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: A draft mark revision is saved without publishing results to families.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-34 — Submit marks for moderation

- [ ] Reconcile this contract, phase 4, capability `assessment.submit for owned marks; moderator action separately delegated` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Readiness → Submit reviewed revision.
- [ ] Prove invariant: Teacher submission does not approve its own marks by default. Explicit delegation governs moderator actions.
- [ ] Prove recovery: Any changed marks invalidate the previous approval scope; returned marks keep review history.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The selected revision is awaiting moderation or returned with a reason.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-35 — Review result publication and correct an error

- [ ] Reconcile this contract, phase 4, capability `own-subject result preview; correction request, not default publish` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Published version → Error handoff.
- [ ] Prove invariant: No editing a published PDF or overwriting published mark history. Guardian access remains separately permitted.
- [ ] Prove recovery: Withdrawn approval or changed underlying marks blocks publication until reconciled.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: An authorized publisher reviews any correction; the teacher sees the linked disposition.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed.
