# Attendance — Parent design

Edition 01 · First phase 2 · Owner(s): Attendance, Family requests

Understand recorded sessions and submit explanations without changing the register.

Status: DESIGNED_FOR_UX_REVIEW. The current physical schema and implementation have not been assessed. Reconcile the actual owning DESIGN.md before code; see ../../ARCHITECTURE_HANDOFF.md and ../../DB_CONTRACT_PROPOSAL.md. Use the shared UX_SYSTEM; do not duplicate the component library.

## PAR-10 — Read my child’s attendance

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **attendance.read_child**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Attendance period** — Read submitted session outcomes in school-local time.
   - From date: `date`; required.
   - Until date: `date`; required.
2. **Inspect a session** — Unsubmitted and unavailable are not absence.
   - View: `select`; required; options: Submitted session detail, Unsubmitted session explanation, Correction history when permitted.

### Outcome

The parent understands the exact session status and source of the recorded outcome.

### Domain and authorization invariant

Show session granularity and exclude unsubmitted/cancelled sessions from any policy-defined attendance denominator. Do not invent a daily status or percentage.

### Failure and recovery

Pending data and revised records display honestly. Parent cannot edit marks.

### Database workflow / ownership

Submitted AttendanceSession → child frozen roster entry → effective AttendanceRecord/revision, scoped to current child purpose.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-11 — Submit an absence explanation

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **attendance.explanation.submit for selected child**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Absence details** — This is an explanation for school review, not an attendance mark.
   - From date: `date`; required.
   - Until date: `date`; required.
   - Reason category: `select`; required; options: Health-related absence, Family commitment, School-approved activity, Other.
2. **School note** — Share only what the office needs; use restricted channels for sensitive evidence.
   - Brief explanation: `textarea`; required.
   - I understand that the school reviews this explanation separately from attendance.: `checkbox`; required.

### Outcome

The explanation receives a reference and Pending review status; attendance remains unchanged.

### Domain and authorization invariant

Same-day date ranges are valid. Live grant and date/policy bounds apply at submit; duplicate intent is idempotent. No automatic Excused status.

### Failure and recovery

Failed save preserves draft. Lost response checks the same request reference. Sensitive documents need the separately approved upload route.

### Database workflow / ownership

FamilyRequest/AbsenceExplanation references child and dates; Attendance is read-only here. School disposition/correction is a separate owner command.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-12 — Track or withdraw an explanation

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **own explanation read/withdraw with current child grant**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Request status** — Pending, reviewed and withdrawn have different meaning.
   - Explanation reference: `text`; required.
2. **Next action** — The school’s disposition is not automatically an attendance correction.
   - Action: `select`; required; options: Read the school’s response, Withdraw a pending explanation.

### Outcome

The parent sees a traceable request status or withdrawal outcome.

### Domain and authorization invariant

Only an eligible pending request can be withdrawn; use its current version. Never delete the evidence of a reviewed decision.

### Failure and recovery

Concurrent school review wins by version; show the new state and safe next action.

### Database workflow / ownership

Explanation version/status and owner decision reference; append safe audit event, not destructive deletion.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-13 — Query an attendance discrepancy

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **attendance.read_child + permitted school request**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Exact session** — Quote the session the school recorded.
   - Session reference: `text`; required.
   - Issue: `select`; required; options: Recorded status appears incorrect, Explanation not reflected, Session details need clarification.
2. **Explain the concern** — The authorized school administrator decides any correction.
   - What should the school review?: `textarea`; required.

### Outcome

The parent receives a query reference; the submitted register remains unchanged.

### Domain and authorization invariant

No parent attendance.correct grant. A query is not an approved correction or evidence that the teacher was wrong.

### Failure and recovery

If the record changed, show the permitted new revision and retain the original query reference.

### Database workflow / ownership

FamilyRequest references child/session/revision; Attendance correction owner links any accepted outcome.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.
