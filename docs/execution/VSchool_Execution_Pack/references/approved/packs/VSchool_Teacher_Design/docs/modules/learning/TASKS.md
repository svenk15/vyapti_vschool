# Teaching & learning — Proposed teacher tasks

Status: design handoff, not a replacement for existing repository tasks. Each slice must be demoable. Map the TEA reference to the current execution index before implementation. Never duplicate or retire current tasks implicitly.

Prerequisites: owning module released and enabled; specific permission approved; schema/API/transaction LLD reconciled. Follow earlier phase dependencies; resolve any explicit current acceptance gates.


## TEA-25 — Plan a lesson

- [ ] Reconcile this contract, phase 3, capability `learning.plan.write for assigned offering` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Teaching context → Plan → Visibility.
- [ ] Prove invariant: Copying a plan must not copy pupil responses or private notes. Lesson plan is not automatic publication to families.
- [ ] Prove recovery: Concurrent edits preserve current revision; lost assignment removes protected content.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: A versioned lesson plan can be revisited and reused with deliberate context changes.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-26 — Add and reuse teaching resources

- [ ] Reconcile this contract, phase 3, capability `learning.resource.write + document permissions` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Resource → Audience.
- [ ] Prove invariant: Scan before availability; sanitized preview; scope-bound short-lived downloads; accessible alternative instructions.
- [ ] Prove recovery: Upload progress, interruption, scan rejection and revoked audience remain explicit.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: A safe, versioned resource is attached to the intended lesson or assignment.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-27 — Create and publish an assignment

- [ ] Reconcile this contract, phase 3, capability `learning.assignment.write / publish for own class` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Task → Submission → Publication review.
- [ ] Prove invariant: Publication requires current assignment and enrollment grants. Do not confuse Save draft with Publish.
- [ ] Prove recovery: Changed deadline publishes a reviewed revision and notice; unknown publish outcome uses a receipt.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The exact published assignment version is visible to the eligible class.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-28 — Review submissions and late work

- [ ] Reconcile this contract, phase 3, capability `learning.submission.read for assigned class` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Worklist → Review work.
- [ ] Prove invariant: Missing is not a numeric zero. Submission revisions and late policy are pinned; never leak one pupil’s work to another.
- [ ] Prove recovery: Interrupted upload, withdrawn enrollment, missing file and malware rejection have distinct explanations.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The teacher can act on each learner’s actual submission state.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-29 — Draft feedback and return work

- [ ] Reconcile this contract, phase 3, capability `learning.feedback.write / return for own task` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Feedback → Return review.
- [ ] Prove invariant: Saving feedback is not result publication or automatic assessment grading. Family visibility needs separate purpose and module grants.
- [ ] Prove recovery: Submission changed while grading requires comparison; missing authority stops publication.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: A private draft remains private; returned feedback identifies its published revision.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-30 — Allow resubmission or revise a deadline

- [ ] Reconcile this contract, phase 3, capability `learning.assignment.manage for own task` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Change scope → Explain change.
- [ ] Prove invariant: No silent retrospective penalty changes; preserve already published feedback and submission history.
- [ ] Prove recovery: Concurrent publication, offline upload and revoked enrollment reconcile against the pinned policy.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The revised policy and optional resubmission path are explicit to affected learners.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-31 — Review learning progress and plan support

- [ ] Reconcile this contract, phase 3, capability `learning.progress.read for assigned scope` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Review evidence → Plan next action.
- [ ] Prove invariant: No opaque risk scores, permanent labels or inference from missing data. A confidential support case needs a separate grant.
- [ ] Prove recovery: Sparse evidence and changed enrollment limit conclusions; never turn unavailable data into poor performance.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The teacher can explain a support action from permitted learning evidence.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed.
