# Learning — Parent design

Edition 01 · First phase 3 · Owner(s): Learning, Documents

Support the child using published tasks and returned feedback.

Status: DESIGNED_FOR_UX_REVIEW. The current physical schema and implementation have not been assessed. Reconcile the actual owning DESIGN.md before code; see ../../ARCHITECTURE_HANDOFF.md and ../../DB_CONTRACT_PROPOSAL.md. Use the shared UX_SYSTEM; do not duplicate the component library.

## PAR-20 — Review published homework

Phase **3**. Reconcile current approved module scope.

Purpose/condition: **learning.read_child**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Assignment** — Read the teacher’s published task and deadline.
   - Assignment: `select`; required; options: Fractions in everyday life, Reading reflection.
2. **Support the child** — The student remains the author of submitted work.
   - Next action: `select`; required; options: Read instructions, Review submission status, Ask an allowed learning question.

### Outcome

The guardian understands the task, deadline and current learner submission state.

### Domain and authorization invariant

No submit-as-child or mark-as-complete shortcut unless a separately approved assisted-submission policy exists. Draft tasks are private.

### Failure and recovery

Missing and late are distinct; no submission is not proof of non-learning. Reauthorize attachments.

### Database workflow / ownership

Published Assignment/version → child audience/enrollment → minimal SubmissionStatus, with no unrelated classmates.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-21 — Read returned learning feedback

Phase **3**. Reconcile current approved module scope.

Purpose/condition: **feedback.read_child purpose + returned version**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Returned feedback** — Only feedback intentionally returned to the permitted audience appears.
   - Assignment: `select`; required; options: Fractions in everyday life.
2. **Support next steps** — Separate the teacher’s feedback from automated interpretation.
   - Next action: `select`; required; options: Review strengths and next steps, Ask a learning question.

### Outcome

The parent sees the returned revision and can support its next step.

### Domain and authorization invariant

Private draft feedback, moderation notes and unrelated student work never appear.

### Failure and recovery

Withdrawn/replaced feedback identifies the permitted current version; authorization applies to historical versions too.

### Database workflow / ownership

FeedbackRevision returned state + guardian learning purpose + submission/task references.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-22 — Ask a learning question

Phase **3**. Reconcile current approved module scope.

Purpose/condition: **learning read + approved communication grant**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Learning context** — Quote the relevant assignment, not a class-wide pupil list.
   - Assignment or feedback reference: `text`; required.
2. **Question** — Use the permitted teacher conversation.
   - Your question: `textarea`; required.

### Outcome

The question is routed to a permitted conversation with the child context attached.

### Domain and authorization invariant

No unrestricted new recipient selection or implicit result-appeal workflow.

### Failure and recovery

If the teacher’s assignment changes, the school resolves routing without exposing another private thread.

### Database workflow / ownership

Communication message references a permitted Learning resource/version; each owner rechecks its scope.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.
