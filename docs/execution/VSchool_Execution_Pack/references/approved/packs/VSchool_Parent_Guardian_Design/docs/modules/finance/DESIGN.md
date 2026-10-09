# Fees & payments — Parent design

Edition 01 · First phase 5 · Owner(s): Finance, Payments

Review authorized invoices and know the exact payment outcome.

Status: DESIGNED_FOR_UX_REVIEW. The current physical schema and implementation have not been assessed. Reconcile the actual owning DESIGN.md before code; see ../../ARCHITECTURE_HANDOFF.md and ../../DB_CONTRACT_PROPOSAL.md. Use the shared UX_SYSTEM; do not duplicate the component library.

## PAR-26 — Review a child’s fee invoice

Phase **5**. Reconcile current approved module scope.

Purpose/condition: **finance.read for explicit child/payer scope**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Invoice** — Review the issuing institution, invoice and currency.
   - Invoice: `select`; required; options: INV-GW-2026-104 · Tuition.
2. **Breakdown** — Distinguish charges, adjustments, receipts and outstanding balance.
   - Next action: `select`; required; options: Review line items, Read payment history, Query the school office.

### Outcome

The payer understands the exact payable balance for one issuing institution.

### Domain and authorization invariant

Guardian status alone does not grant fee or payer access. No cross-school combined basket. Never expose another payer’s private banking details.

### Failure and recovery

Disputed/adjusted invoice, stale balance or disabled online payment remains reviewable only under current grant.

### Database workflow / ownership

Finance Invoice/version → line items/adjustments → allocated settled payments. All money uses currency and exact minor units.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-27 — Pay an authorized invoice

Phase **5**. Reconcile current approved module scope.

Purpose/condition: **finance.pay + explicit payer mandate**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Payment review** — Confirm the invoice, child, merchant institution and exact amount.
   - Invoice: `select`; required; options: INV-GW-2026-104 · Tuition.
   - I have checked the displayed currency and exact amount.: `checkbox`; required.
2. **Payment handoff** — A provider redirect is not proof of settlement.
   - I understand that the receipt is issued only after verified confirmation.: `checkbox`; required.

### Outcome

One payment order is created; the result is Processing, Paid, Failed or Unknown until reconciled.

### Domain and authorization invariant

Server computes amount and issuer from the current invoice. Stable idempotency key, invoice version and payable-state guard prevent duplicate orders. Never collect card details in this portal.

### Failure and recovery

Changed balance requires re-review. Interrupted redirect or pending provider outcome uses Check status before any new payment.

### Database workflow / ownership

PaymentOrder → PaymentAttempt → verified provider event/reconciliation → ledger allocation/receipt in Finance. Prototype never contacts a provider.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-28 — Resolve an uncertain payment

Phase **5**. Reconcile current approved module scope.

Purpose/condition: **own payment status + current payer/read purpose**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Payment status** — Do not ask the parent to pay again while the result is unknown.
   - Payment order reference: `text`; required.
2. **Resolve** — Provider confirmation must be verified by the server.
   - Next action: `select`; required; options: Check payment status, Contact support with reference.

### Outcome

The existing order is resolved or remains visibly pending without another charge attempt.

### Domain and authorization invariant

Client callback, screenshot or success query parameter cannot mark an invoice Paid. Only verified settlement evidence changes the ledger.

### Failure and recovery

A pending order persists across navigation. Repeated status reads are safe; retries only after a definitive owner-approved failure state.

### Database workflow / ownership

PaymentAttempt status and provider event deduplication; Finance ledger allocation is atomic and idempotent.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-29 — Read receipts and payment history

Phase **5**. Reconcile current approved module scope.

Purpose/condition: **finance.receipt.read for explicit payer scope**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Payment history** — Filter by the permitted child and issuing school.
   - Payment state: `select`; required; options: Settled payments, Pending attempts, Failed attempts.
2. **Receipt** — A receipt belongs to a confirmed payment allocation.
   - Receipt or order reference: `text`; required.

### Outcome

The parent can reconcile the invoice and a verified receipt.

### Domain and authorization invariant

Pending orders do not produce settled receipts. A receipt identifies currency, issuer, amount, date and masked references only.

### Failure and recovery

Refunds/adjustments show a linked traceable event; a PDF download failure does not repeat the payment.

### Database workflow / ownership

Settled PaymentAllocation → Receipt/version plus safe PaymentAttempt history; downloads reauthorize.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-30 — Raise a fee or refund query

Phase **5**. Reconcile current approved module scope.

Purpose/condition: **finance.query within payer scope**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Query context** — A request is not an approved refund or adjustment.
   - Invoice or receipt reference: `text`; required.
   - Query type: `select`; required; options: Charge clarification, Possible duplicate payment, Refund request.
2. **Explain** — Share only the transaction reference the school needs.
   - Query details: `textarea`; required.

### Outcome

A financial query is tracked separately from settlement and approval.

### Domain and authorization invariant

No parent refund execution, auto-writeoff or trusted uploaded payment screenshot. Authorized finance review controls any ledger effect.

### Failure and recovery

Duplicate queries link to existing case. Keep Pending review distinct from Refund initiated and Refunded.

### Database workflow / ownership

FinanceCase references invoice/payment; approval, provider refund event and ledger adjustment are separate owner transactions.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.

## PAR-31 — Ask about payer access

Phase **5**. Reconcile current approved module scope.

Purpose/condition: **support claim; no self-grant of finance authority**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Payer access** — An emergency contact or guardian is not automatically a payer.
   - Issue: `select`; required; options: I cannot see the invoice, The payer relationship needs review, Payment access should be removed.
2. **School verification** — Use the school’s verified payer process.
   - Brief request: `textarea`; required.

### Outcome

The finance/relationship owner reviews a purpose-specific access request.

### Domain and authorization invariant

A payer-only contact must not gain academic or health access. No parent can add another payer or inherit their banking records.

### Failure and recovery

Changed mandate invalidates pending payer actions and rechecks owner-controlled in-flight obligations.

### Database workflow / ownership

PayerMandate/PurposeGrant remains owner controlled; FamilyRequest stores the claim and decision reference.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.
