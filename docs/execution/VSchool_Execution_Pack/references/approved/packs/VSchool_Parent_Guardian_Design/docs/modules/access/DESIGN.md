# Family access — Parent design

Edition 01 · First phase 2 · Owner(s): Access, Guardians

Accept school-verified access and recover it safely.

Status: DESIGNED_FOR_UX_REVIEW. The current physical schema and implementation have not been assessed. Reconcile the actual owning DESIGN.md before code; see ../../ARCHITECTURE_HANDOFF.md and ../../DB_CONTRACT_PROPOSAL.md. Use the shared UX_SYSTEM; do not duplicate the component library.

## PAR-01 — Accept a school invitation

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **school-verified relationship + account binding**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **School invitation** — The public invitation identifies the school; child details appear only after the required identity checks.
   - I am using the school’s verified invitation channel.: `checkbox`; required.
2. **Review permitted access** — The school has already verified the relationship and its allowed purposes.
   - The invited identity has been verified through the school’s required process.: `checkbox`; required.
   - I have reviewed the child and permitted purposes.: `checkbox`; required.

### Outcome

The verified child link becomes active for this account, with its exact permitted purposes.

### Domain and authorization invariant

Email possession alone cannot prove a guardian relationship. Bind a single-use invitation to the verified relationship and intended account; never let the parent choose a child or expand grants.

### Failure and recovery

Expired, wrong-account, revoked and delivery-failed invitations show safe help. Replaying a completed acceptance returns the existing outcome.

### Database workflow / ownership

Guardians owns relationship verification/purpose grant; Access owns account and invitation token hash. Atomic acceptance rechecks both before activation.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-02 — Sign in through the school page

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **active account; child-purpose authorization after sign-in**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Sign in** — Published school branding gives context, not access.
   - Email address: `email`; required.
   - Password: `password`; required.
2. **Choose a workspace** — Only currently permitted family contexts appear.
   - Start with: `select`; required; options: My family overview, My selected child.

### Outcome

The parent enters an authorized family workspace and sees the current child context.

### Domain and authorization invariant

No admission-number plus birth-date public child lookup. Account identity and relationship authority remain separate. Safe internal return URLs only.

### Failure and recovery

Use generic credential rejection. Empty links lead to school contact; suspended access does not reveal child names.

### Database workflow / ownership

Access session → active GuardianRelationship/PurposeGrant → minimal permitted child summaries.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-03 — Activate or recover account access

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **institution trust mode + account-wide recovery policy**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Account help** — Use the recovery channel allowed by the school and every relevant stricter membership.
   - Account email: `email`; required.
   - Help needed: `select`; required; options: Activate invited account, Recover password, Mailbox no longer safe.
2. **Next step** — A generic acknowledgement protects account existence.
   - I will follow the verified instructions from the school.: `checkbox`; required.

### Outcome

The parent receives a safe acknowledgement or verified support route.

### Domain and authorization invariant

Global account recovery must not bypass a stricter institution. Recheck policy when issuing and consuming a token. Compromised-inbox recovery uses the verified owner route.

### Failure and recovery

Expired/revoked/consumed/failed-delivery tokens fail safely. Do not send a second identity’s invitation to a newly entered mailbox.

### Database workflow / ownership

Access token hash, delivery state, session invalidation and policy evidence; no secrets or raw tokens in logs.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-04 — Review my verified child links

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **relationship self-read with purpose-filtered child summary**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **My children** — A separate grant exists for each child, school and purpose.
   - Review: `select`; required; options: Active linked children, Access purposes for selected child.
2. **Access question** — A relationship label does not imply every capability.
   - Next step: `select`; required; options: Open permitted child dashboard, Ask the school about access.

### Outcome

The parent understands the children and purposes they can access.

### Domain and authorization invariant

No unrestricted household or co-guardian directory. Do not reveal private reasons for restrictions or compare children.

### Failure and recovery

Revoked/ended links disappear from protected lists; old deep links fail without leaking details.

### Database workflow / ownership

GuardianRelationship → effective PurposeGrant → child/enrollment summary, constrained by institution and branch.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-05 — Ask about a missing child link

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **authenticated support request; no child-record access**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Contact the school** — Submit a claim for verification, not a search across school records.
   - School name: `text`; required.
   - School-issued reference: `text`; optional.
   - Issue: `select`; required; options: My child is missing, My access looks incorrect, Invitation has not arrived.
2. **Review request** — Use the school’s approved identity-verification process.
   - Brief description: `textarea`; required.
   - I have not included passwords, identity documents or private custody details.: `checkbox`; required.

### Outcome

A support request is pending verification; no child access is added automatically.

### Domain and authorization invariant

Do not confirm whether a named child exists. Only a designated school verifier can establish the relationship and purpose grants.

### Failure and recovery

Duplicate request shows prior reference. Missing proof uses a private school channel; an ordinary request is not evidence.

### Database workflow / ownership

Support claim is owned by Family requests; verified relationship remains a separate Guardians command.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-06 — Handle changed or withdrawn access

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **live relationship and purpose check**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Access changed** — Show only a safe message and support reference.
   - Next step: `select`; required; options: Return to permitted children, Contact the school.
2. **Leave safely** — Clear protected screen state when access changes.
   - I understand that previous access may no longer be available.: `checkbox`; required.

### Outcome

Protected child data is cleared and the parent receives a safe next step.

### Domain and authorization invariant

Recheck on reads, writes, downloads and delivery. Child-switch caches, search results and back navigation must not retain revoked data.

### Failure and recovery

Never expose the private restriction reason, another guardian’s details or a previously authorized attachment.

### Database workflow / ownership

Access/Guardians revocation event invalidates purpose caches; owner queries enforce current grants independently.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.
