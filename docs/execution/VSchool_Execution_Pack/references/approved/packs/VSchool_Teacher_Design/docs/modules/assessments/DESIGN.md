# Assessments — Teacher design

Edition 01 · First phase 4 · UX design proposal

Enter marks carefully and participate in controlled moderation and publication.

Domain owner(s): assessments. The teacher UI consumes these owners; it does not become a new shared-data owner. Resolve exact physical tables/capabilities against the current repository before coding.

## Common layout and states

Use the shared shell, typography, icons, context control, fluid Filter/Sort drawers and explicit outcomes from ../../UX_SYSTEM.md. All protected reads and commands recheck server scope. Include loading, empty, invalid input, permission loss, expired session, stale version and relevant unknown/delivery failure states. Keep institution/branch, school-local date and current assignment explicit.

## TEA-32 — Prepare an assessment within an approved scheme

Phase: 4 (Assessment). Reconcile the approved module scope before implementation.

Entry: `assessments`. Required capability/condition: **assessment.plan.write for assigned subject**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Assessment context** — Use the approved scheme version, boundaries and rounding rules.
   - Assigned class: `select`; required; choices: Grade 6 · A · Mathematics, Grade 6 · B · Mathematics, Grade 7 · A · Science.
   - Assessment name: `text`; required.
   - Scheme: `select`; required; choices: Approved term scheme · v1.
2. **Assessment details** — Make expectations clear before marks entry.
   - Assessment date: `date`; required.
   - Maximum score: `number`; required.
   - Assessment instructions: `textarea`; required.

### Outcome and domain invariant

A scoped assessment is prepared under a pinned scheme.

Teachers do not change the institution’s grading policy by editing a screen. Approved publication authority remains separate.

### Failure and recovery

Scheme revision, invalid max score, conflicting dates and lost subject assignment require review.

### Data workflow and ownership

Assessment with SchemeVersion reference; no marks or published result created at plan save.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-33 — Enter and validate marks

Phase: 4 (Assessment). Reconcile the approved module scope before implementation.

Entry: `assessments/gradebook/as1`. Required capability/condition: **assessment.mark.write for exact assigned assessment**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Student outcome** — Not entered, scored, absent and exempt are distinct.
   - Student in assigned class: `select`; required; choices: Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003.
   - Outcome: `select`; required; choices: Scored, Absent, Exempt, Not entered.
   - Score if scored: `number`; optional.
2. **Review before saving** — Validate bounds and completeness using the pinned scheme.
   - I have reviewed the marks and explicit non-score states.: `checkbox`; required.

### Outcome and domain invariant

A draft mark revision is saved without publishing results to families.

Exact validated score scale; zero is a legitimate score, not a stand-in for missing. Exemption authority may be separately required.

### Failure and recovery

Two-editor conflict, changed scheme, missing evidence and withdrawn enrollment do not silently overwrite.

### Data workflow and ownership

Assessment MarkRevision with state, exact score and expected version; draft save receipt/audit, no ResultPublication change.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-34 — Submit marks for moderation

Phase: 4 (Assessment). Reconcile the approved module scope before implementation.

Entry: `flow/TEA-34`. Required capability/condition: **assessment.submit for owned marks; moderator action separately delegated**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Readiness** — Check required marks and unresolved exceptions.
   - Assessment: `select`; required; choices: Fractions check · Grade 6 A.
   - The configured readiness checks are satisfied.: `checkbox`; required.
2. **Submit reviewed revision** — Moderators see the exact submitted version.
   - Message to moderator: `textarea`; required.

### Outcome and domain invariant

The selected revision is awaiting moderation or returned with a reason.

Teacher submission does not approve its own marks by default. Explicit delegation governs moderator actions.

### Failure and recovery

Any changed marks invalidate the previous approval scope; returned marks keep review history.

### Data workflow and ownership

Assessment moderation/approval request pins MarkRevisions; owner transaction prevents stale submit/approve races.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-35 — Review result publication and correct an error

Phase: 4 (Assessment). Reconcile the approved module scope before implementation.

Entry: `flow/TEA-35`. Required capability/condition: **own-subject result preview; correction request, not default publish**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Published version** — Read the approved result and its provenance.
   - Publication: `select`; required; choices: Grade 6 · Term 1 · Approved version.
2. **Error handoff** — A published result is corrected through reviewed republication.
   - Student in assigned class: `select`; required; choices: Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003.
   - Result reference: `text`; required.
   - Correction request reason: `textarea`; required.

### Outcome and domain invariant

An authorized publisher reviews any correction; the teacher sees the linked disposition.

No editing a published PDF or overwriting published mark history. Guardian access remains separately permitted.

### Failure and recovery

Withdrawn approval or changed underlying marks blocks publication until reconciled.

### Data workflow and ownership

ResultPublicationManifest references approved revisions; proposed correction request routes to assessment owner, preserving original publication.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.
