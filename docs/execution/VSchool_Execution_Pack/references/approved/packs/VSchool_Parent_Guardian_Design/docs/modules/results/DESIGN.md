# Results — Parent design

Edition 01 · First phase 4 · Owner(s): Assessments

Read only published result versions and raise a clarification.

Status: DESIGNED_FOR_UX_REVIEW. The current physical schema and implementation have not been assessed. Reconcile the actual owning DESIGN.md before code; see ../../ARCHITECTURE_HANDOFF.md and ../../DB_CONTRACT_PROPOSAL.md. Use the shared UX_SYSTEM; do not duplicate the component library.

## PAR-23 — Read published results

Phase **4**. Reconcile current approved module scope.

Purpose/condition: **results.read_child**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Published report** — Choose a published reporting period.
   - Reporting period: `select`; required; options: Term 1 · Published version 1.
2. **Understand outcomes** — Show the scheme, scale and teacher comments that were approved for release.
   - View: `select`; required; options: Subject outcomes, Published comments, Scale explanation.

### Outcome

The parent understands the official published result version.

### Domain and authorization invariant

Unentered, Absent and Exempt do not become zero. Draft marks/moderation are excluded. No sibling/class ranking by default.

### Failure and recovery

Withheld, unpublished, superseded and unavailable have different user messages without leaking private reasons.

### Database workflow / ownership

PublishedResultVersion → child’s approved outcomes + SchemeVersion and permitted comments.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-24 — Download an authorized report

Phase **4**. Reconcile current approved module scope.

Purpose/condition: **results.download_child**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Report version** — Choose the exact published report.
   - Report: `select`; required; options: Term 1 report · Version 1.
2. **Download** — Confirm the device and intended child.
   - I am using a device suitable for this child’s school records.: `checkbox`; required.

### Outcome

A permitted report download is issued and its version is clear.

### Domain and authorization invariant

Authorize every download; use short-lived delivery links. URLs are not permanent authorization. No other child in filenames or shared caches.

### Failure and recovery

Revoked access or superseded report requires a fresh authorized request.

### Database workflow / ownership

Document owner references immutable published result version; audit only minimal download metadata.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-25 — Request a result clarification

Phase **4**. Reconcile current approved module scope.

Purpose/condition: **published results read + permitted query**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Result context** — A clarification does not change a published mark.
   - Report reference: `text`; required.
   - Subject: `text`; required.
2. **Question** — The assessment owner follows the school’s review process.
   - What would you like clarified?: `textarea`; required.

### Outcome

A tracked clarification reaches the authorized school reviewer.

### Domain and authorization invariant

No direct parent grade edits, guaranteed revaluation or automatic publication of revised results.

### Failure and recovery

Closed review window, duplicate query and a superseded result produce clear next steps.

### Database workflow / ownership

FamilyRequest references PublishedResultVersion/subject; Assessments owns any correction and republication.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.
