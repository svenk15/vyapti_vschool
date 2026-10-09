# School assistant — Parent design

Edition 01 · First phase 7 · Owner(s): Assistant, authorized domain owners

Get source-linked explanations without delegating consequential decisions.

Status: DESIGNED_FOR_UX_REVIEW. The current physical schema and implementation have not been assessed. Reconcile the actual owning DESIGN.md before code; see ../../ARCHITECTURE_HANDOFF.md and ../../DB_CONTRACT_PROPOSAL.md. Use the shared UX_SYSTEM; do not duplicate the component library.

## PAR-52 — Ask the school assistant

Phase **7**. Reconcile current approved module scope.

Purpose/condition: **permission-filtered evidence for selected child/purpose**. Future capability names are design labels, not a claim that the permission registry already includes them.

### User journey and fields

1. **Question** — Ask about published school information and permitted records.
   - Topic: `select`; required; options: Explain a published school notice, Explain an attendance label, Find an approved next step.
   - Your question: `textarea`; required.
2. **Review evidence** — Check the source and date before relying on a response.
   - I have reviewed the cited school sources and any uncertainty.: `checkbox`; required.

### Outcome

The parent receives a source-linked explanation or a clear cannot-answer state.

### Domain and authorization invariant

No autonomous payments, consent, messages, medical advice or attendance/result changes. Child content stays isolated; retrieved text cannot override access rules.

### Failure and recovery

Missing/stale/conflicting evidence is disclosed; provide the correct human school contact. Reauthorize sources at retrieval and action.

### Database workflow / ownership

Assistant retrieves minimal purpose-filtered owner DTOs; provenance and draft disposition exclude raw sensitive content from general analytics.

Bind this logical contract to actual owner tables, keys and joins. Derive actor/institution/branch/child/purpose server-side; validate current references and effective dates before returning data or committing. Use expected versions and owner idempotency for commands; keep minimal audit metadata, never secrets/private care evidence or message bodies in general audit. Parent is a persona, not the database owner.

### Screen/state acceptance

Use the selected child/school context, shared labels and controls. Design loading, empty, invalid input, permission loss, expiry, stale version and relevant pending/unknown/delivery-failure states. Preserve unsent values on recoverable failure; clear protected values on revoked access. Do not show a capability merely because a sibling or the same global account has it elsewhere.

### Demo

Complete the journey from the parent workspace, show the stated outcome and its reference/state. Repeat the named failure recovery. Try a sibling without the required purpose and an unrelated institution; no record or sensitive label may leak. A generic prototype review receipt is not evidence of a production transaction.
