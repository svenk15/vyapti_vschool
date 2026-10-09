# Home & my children — Parent design

Edition 01 · First phase 2 · Owner(s): Guardians, authorized owner read models

Know which child needs an action without comparing siblings.

Status: DESIGNED_FOR_UX_REVIEW. The current physical schema and implementation have not been assessed. Reconcile the actual owning DESIGN.md before code; see ../../ARCHITECTURE_HANDOFF.md and ../../DB_CONTRACT_PROPOSAL.md. Use the shared UX_SYSTEM; do not duplicate the component library.

## PAR-07 — Review my family overview

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **current minimal summary for each active relationship**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Family overview** — Summaries are limited to currently permitted children and sources.
   - Show: `select`; required; options: Actions needing me, My linked children.
2. **Next action** — Every item names its child and school.
   - Open: `select`; required; options: Selected child dashboard, A school request, An unread school notice.

### Outcome

The parent reaches a relevant action without a school-wide dashboard or sibling comparisons.

### Domain and authorization invariant

No combined attendance percentage, combined cross-school payment basket or hidden child counts. Avoid labeling a child as at risk from incomplete data.

### Failure and recovery

Partial module failure identifies the unavailable source and last-updated time without inventing a zero.

### Database workflow / ownership

Compose authorized owner summaries per relationship; all-school counts never enter the parent read model.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-08 — Switch child and school context

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **active destination relationship and specific purposes**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Select a child** — The child card includes school, branch and class to avoid mistakes.
   - Destination: `select`; required; options: Aarav · Greenwood · Whitefield, Nila · Greenwood · Indiranagar, Mira · Westbridge · North campus.
2. **Review unsaved work** — Records remain attached to their original child.
   - I have reviewed any unsent work before switching.: `checkbox`; required.

### Outcome

The entire workspace switches to the selected child and re-evaluates modules and permissions.

### Domain and authorization invariant

No independent branch switch that leaves the previous child selected. Cancel or confirm dirty input; clear prior child view state. Persisted pending payments stay tied to their original invoice.

### Failure and recovery

If a destination grant changes, leave the parent in a safe permitted context. Never carry messages, attachments or request drafts across children.

### Database workflow / ownership

Relationship/child/context DTO drives owner calls. Draft and pending-intent keys include actor, institution, child and purpose.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-09 — Manage school notification preferences

Phase **2**. Reconcile current approved module scope.

Purpose/condition: **self preferences by child/purpose**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Choose updates** — Preferences do not change the underlying access grant.
   - Update category: `select`; required; options: School notices, Attendance updates, Learning updates, Payment updates.
2. **Choose channel** — Show any school-required service notices separately.
   - Preferred channel: `select`; required; options: In-app only, In-app and verified email.
   - I have reviewed which service notices remain required.: `checkbox`; required.

### Outcome

Preferences are saved for the selected permitted category and verified channel.

### Domain and authorization invariant

An opt-in is not a guardian grant; an opt-out cannot erase an outstanding request or legal/service notice. No sensitive content in push previews.

### Failure and recovery

Unverified contact details cannot receive private updates. Record a delivery failure without marking a notice read.

### Database workflow / ownership

Preferences keyed by actor, child/purpose/category; Communication resolves verified channels and current recipient grants.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.
