# Teaching & learning — Teacher design

Edition 01 · First phase 3 · UX design proposal

Plan, assign, review submissions and return useful feedback.

Domain owner(s): learning, documents. The teacher UI consumes these owners; it does not become a new shared-data owner. Resolve exact physical tables/capabilities against the current repository before coding.

## Common layout and states

Use the shared shell, typography, icons, context control, fluid Filter/Sort drawers and explicit outcomes from ../../UX_SYSTEM.md. All protected reads and commands recheck server scope. Include loading, empty, invalid input, permission loss, expired session, stale version and relevant unknown/delivery failure states. Keep institution/branch, school-local date and current assignment explicit.

## TEA-25 — Plan a lesson

Phase: 3 (Teaching and learning). Reconcile the approved module scope before implementation.

Entry: `learning`. Required capability/condition: **learning.plan.write for assigned offering**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Teaching context** — Prepare against a class, topic and date.
   - Assigned class: `select`; required; choices: Grade 6 · A · Mathematics, Grade 6 · B · Mathematics, Grade 7 · A · Science.
   - Lesson topic: `text`; required.
   - Lesson date: `date`; required.
2. **Plan** — Use clear objectives, activities and a check for understanding.
   - Learning objective: `textarea`; required.
   - Activities: `textarea`; required.
   - Check for understanding: `textarea`; required.
3. **Visibility** — Drafts stay private to authorized teaching staff.
   - Save as: `select`; required; choices: Teacher draft, Share with authorized teaching team.

### Outcome and domain invariant

A versioned lesson plan can be revisited and reused with deliberate context changes.

Copying a plan must not copy pupil responses or private notes. Lesson plan is not automatic publication to families.

### Failure and recovery

Concurrent edits preserve current revision; lost assignment removes protected content.

### Data workflow and ownership

Learning owns LessonPlan/revision referencing authorized Offering and safe ResourceReferences.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-26 — Add and reuse teaching resources

Phase: 3 (Teaching and learning). Reconcile the approved module scope before implementation.

Entry: `resources`. Required capability/condition: **learning.resource.write + document permissions**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Resource** — Attach only material the school is permitted to use.
   - Resource title: `text`; required.
   - Resource file: `file`; required.
2. **Audience** — File access follows the owning task/plan, not a public link.
   - Audience: `select`; required; choices: Teaching team draft, Assigned class after publication.
   - I have reviewed the resource and its intended audience.: `checkbox`; required.

### Outcome and domain invariant

A safe, versioned resource is attached to the intended lesson or assignment.

Scan before availability; sanitized preview; scope-bound short-lived downloads; accessible alternative instructions.

### Failure and recovery

Upload progress, interruption, scan rejection and revoked audience remain explicit.

### Data workflow and ownership

Documents FileAsset/ScanResult/DocumentVersion; Learning ResourceReference; read authorization rechecked at download.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-27 — Create and publish an assignment

Phase: 3 (Teaching and learning). Reconcile the approved module scope before implementation.

Entry: `learning/new`. Required capability/condition: **learning.assignment.write / publish for own class**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Task** — State what the learner should do and how it will be reviewed.
   - Assigned class: `select`; required; choices: Grade 6 · A · Mathematics, Grade 6 · B · Mathematics, Grade 7 · A · Science.
   - Assignment title: `text`; required.
   - Instructions: `textarea`; required.
2. **Submission** — Use explicit deadline and accepted mode.
   - Due date: `date`; required.
   - Submission type: `select`; required; choices: Text response, File upload, In-class work.
   - Late work: `select`; required; choices: Accept and label late, Require teacher review.
3. **Publication review** — Check audience, resources, accessibility and due date before publishing.
   - I have reviewed the class-facing task.: `checkbox`; required.

### Outcome and domain invariant

The exact published assignment version is visible to the eligible class.

Publication requires current assignment and enrollment grants. Do not confuse Save draft with Publish.

### Failure and recovery

Changed deadline publishes a reviewed revision and notice; unknown publish outcome uses a receipt.

### Data workflow and ownership

Learning Assignment/Version and audience criteria; durable publication manifest/event; Communication notice is separate from published content.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-28 — Review submissions and late work

Phase: 3 (Teaching and learning). Reconcile the approved module scope before implementation.

Entry: `learning/task/l1`. Required capability/condition: **learning.submission.read for assigned class**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Worklist** — Submitted, missing, late and returned are separate states.
   - Assignment: `select`; required; choices: Fractions in everyday life.
   - Submission status: `select`; required; choices: All, Submitted, Late, Missing, Returned.
2. **Review work** — Open only the current authorized submission revision.
   - Student in assigned class: `select`; required; choices: Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003.
   - Review action: `select`; required; choices: Read submitted work, Request missing work follow-up.

### Outcome and domain invariant

The teacher can act on each learner’s actual submission state.

Missing is not a numeric zero. Submission revisions and late policy are pinned; never leak one pupil’s work to another.

### Failure and recovery

Interrupted upload, withdrawn enrollment, missing file and malware rejection have distinct explanations.

### Data workflow and ownership

Learning SubmissionRevision + published Assignment version + enrollment grant; Documents enforces file readiness and download scope.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-29 — Draft feedback and return work

Phase: 3 (Teaching and learning). Reconcile the approved module scope before implementation.

Entry: `learning/review/s1`. Required capability/condition: **learning.feedback.write / return for own task**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Feedback** — Give actionable guidance on the selected work.
   - Student in assigned class: `select`; required; choices: Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003.
   - What worked well: `textarea`; required.
   - Next step for learning: `textarea`; required.
2. **Return review** — Preview exactly what the learner and permitted guardian will see.
   - Action: `select`; required; choices: Save private feedback draft, Return reviewed feedback.
   - I have checked the audience and selected work revision.: `checkbox`; required.

### Outcome and domain invariant

A private draft remains private; returned feedback identifies its published revision.

Saving feedback is not result publication or automatic assessment grading. Family visibility needs separate purpose and module grants.

### Failure and recovery

Submission changed while grading requires comparison; missing authority stops publication.

### Data workflow and ownership

Learning Feedback revision pins SubmissionRevision; explicit return manifest + safe audit/outbox; no unintended result-table writes.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-30 — Allow resubmission or revise a deadline

Phase: 3 (Teaching and learning). Reconcile the approved module scope before implementation.

Entry: `flow/TEA-30`. Required capability/condition: **learning.assignment.manage for own task**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Change scope** — Choose whole class or one authorized learner.
   - Scope: `select`; required; choices: Whole assigned class, Selected learner.
   - Student in assigned class: `select`; required; choices: Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003.
   - New deadline: `date`; required.
2. **Explain change** — Keep previous deadlines and submissions in history.
   - Reason: `textarea`; required.
   - I have reviewed who is affected and which version remains visible.: `checkbox`; required.

### Outcome and domain invariant

The revised policy and optional resubmission path are explicit to affected learners.

No silent retrospective penalty changes; preserve already published feedback and submission history.

### Failure and recovery

Concurrent publication, offline upload and revoked enrollment reconcile against the pinned policy.

### Data workflow and ownership

Assignment revision / per-learner exception and SubmissionRevision lineage; authorized notice event.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-31 — Review learning progress and plan support

Phase: 3 (Teaching and learning). Reconcile the approved module scope before implementation.

Entry: `learning/progress`. Required capability/condition: **learning.progress.read for assigned scope**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Review evidence** — Use visible source tasks and transparent completeness.
   - Assigned class: `select`; required; choices: Grade 6 · A · Mathematics, Grade 6 · B · Mathematics, Grade 7 · A · Science.
   - View: `select`; required; choices: Work completion, Feedback follow-up, Topic evidence.
2. **Plan next action** — Support decisions remain human and role-scoped.
   - Student in assigned class: `select`; required; choices: Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003.
   - Teaching follow-up: `textarea`; required.

### Outcome and domain invariant

The teacher can explain a support action from permitted learning evidence.

No opaque risk scores, permanent labels or inference from missing data. A confidential support case needs a separate grant.

### Failure and recovery

Sparse evidence and changed enrollment limit conclusions; never turn unavailable data into poor performance.

### Data workflow and ownership

Learning read projection of assignments, submissions and returned feedback; proposed support task references sources and minimizes pupil notes.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.
