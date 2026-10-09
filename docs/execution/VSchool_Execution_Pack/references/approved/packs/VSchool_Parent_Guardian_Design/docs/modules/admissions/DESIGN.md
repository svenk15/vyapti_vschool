# Applications — Parent design

Edition 01 · First phase 3 · Owner(s): Admissions

Manage applicant records separately from enrolled-child access.

Status: DESIGNED_FOR_UX_REVIEW. The current physical schema and implementation have not been assessed. Reconcile the actual owning DESIGN.md before code; see ../../ARCHITECTURE_HANDOFF.md and ../../DB_CONTRACT_PROPOSAL.md. Use the shared UX_SYSTEM; do not duplicate the component library.

## PAR-37 — Start or resume an application

Phase **3**. Reconcile current approved module scope.

Purpose/condition: **applicant self-scope; separate from enrolled child grant**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Application** — Use the school’s offered intake and a minimal applicant record.
   - Applicant name: `text`; required.
   - Intake: `select`; required; options: 2027–28 · School-offered entry.
2. **Save or submit** — A submitted application is not enrollment or portal access.
   - Action: `select`; required; options: Save application draft, Submit for school review.
   - I have reviewed the information for accuracy.: `checkbox`; required.

### Outcome

An applicant-scoped draft or submitted application has a reference.

### Domain and authorization invariant

An applicant is not matched to an existing pupil by email/DOB alone. Keep evidence, fee and relationship verification separate.

### Failure and recovery

Duplicate claims, withdrawal, document failure and intake closure do not create student records automatically.

### Database workflow / ownership

Admissions Application/version/owner actor; approved admission later invokes verified Students/Guardians onboarding.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-38 — Track application requirements

Phase **3**. Reconcile current approved module scope.

Purpose/condition: **own application read + allowed evidence upload**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Application checklist** — See only school-requested items and status.
   - Application reference: `text`; required.
2. **Respond** — Use restricted evidence handling and retain a clear receipt.
   - Action: `select`; required; options: Review outstanding requirement, Respond to school query, Withdraw the application.

### Outcome

The applicant understands what remains outstanding and the school’s next decision.

### Domain and authorization invariant

Evidence is not a public attachment or ordinary message. File size/type/scan policy and review access must be defined before implementation.

### Failure and recovery

Rejected evidence has a safe reason and resubmission path; do not erase previously reviewed versions.

### Database workflow / ownership

ApplicationRequirement → evidence artifact/version → school disposition; object access is purpose scoped.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-39 — Respond to an admission offer

Phase **3**. Reconcile current approved module scope.

Purpose/condition: **intended offer recipient + current version**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Offer** — Review the school, intake, conditions and response deadline.
   - Offer reference: `text`; required.
2. **Decision** — Acceptance is distinct from enrollment completion.
   - Response: `select`; required; options: Accept offer, Decline offer.
   - I have reviewed the offer conditions.: `checkbox`; required.

### Outcome

The response is recorded and remaining enrollment steps are visible.

### Domain and authorization invariant

Offer acceptance cannot independently create a verified guardian relationship, settle a fee or assign a class.

### Failure and recovery

Expired/superseded offer, pending payment or missing evidence leads to a precise incomplete state.

### Database workflow / ownership

Offer/version → response; admission completion orchestrates separate approved enrollment and guardian commands.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.
