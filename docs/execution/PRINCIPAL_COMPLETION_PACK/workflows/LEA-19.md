# LEA-19 — Coordinate an evidence-based learning concern

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Learning + Coordination. This names responsibility, not proof that an owner module exists.
- Product decisions: D10. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F08,F04. See execution queue.
- Reference: approved Principal catalogue LEA-19; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/learning/concerns/new`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe W from 04_PRODUCTION_UX.md.

## Target product definition
Record a factual learning concern linked to permitted assignment/status evidence. Assign designated academic coordinator; no sensitive labels, diagnosis or automatic family contact. Named learner evidence needs its own grant.

## Lifecycle, data and ownership
Open → work → evidence → independent verify using Coordination, with owner-specific eligibility and disposition. Notes bounded and synthetic until retention enabled.

All operations inherit the common tenant/capability/module/live-authority and command-recovery contract in 03_SHARED_ARCHITECTURE.md. Read permission never implies mutation, export or sensitive-case permission. Counterpart actors need real working screens and owner commands, not a seeded happy-path substitute.

## Screen and interaction contract
1. Entry shows authorized branch, source scope and freshness. Start from normal navigation or an authorized contextual source link.
2. Load current owner projection; show unavailable independently from an empty valid result.
3. For a write, collect only the fields named in this definition/source contract, validate and show source/consequence review before final confirmation. Read-only views have no artificial confirmation.
4. Keep Back/Continue edits within authorized context; clear protected data on scope loss. No durable draft unless owner schema and lifecycle explicitly support it.
5. Final action binds expected version and stable intent. Timeout displays Check status. A stale response shows current versus attempted permitted values and requires fresh confirmation.
6. Outcome shows owner-confirmed state, scope, timestamp and permitted next action. Never equate approval, delivery, receipt, acknowledgement and completion.
7. Default screen states: loading, empty, unavailable, forbidden, validation, changed evidence, changed actor eligibility, unknown outcome, known receipt and revocation. Add workflow-specific states from the source below.

## Implementation tasks
- WF-19-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-19-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-19-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-19-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-19-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Aggregate-only Principal cannot retrieve a named learner by crafting concern URL.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Coordinate an evidence-based learning concern
**Delivery:** phase 3 · Later · Explicit scope extension
**Trigger:** A teacher or authorized academic review identifies a learning concern.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Approved learning-support purpose; school process and authorized coordinator.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Review permitted task/assessment evidence. | Describe observable facts, not a diagnosis or predictive score. |
| 2 | Principal | Choose an educational follow-up. | Owner, review date and intended improvement are explicit. |
| 3 | Principal | Include family/student only through authorized channels. | Relationship and communication purposes rechecked. |
| 4 | System / owner | Review progress against agreed evidence. | Close or revise the support action; private specialist records remain separate. |

**Inputs and validation**

- **Concern:** Factual, bounded description.
- **Evidence:** Permitted published/returned source references.
- **Review date:** Explicit; no indefinite unresolved action.

**Outcome:** Human-owned learning support with a review checkpoint.
**Authorization:** No automatic mental-health inference, grading change or disciplinary action.
**Data read:** Authorized learning evidence and minimal student/class context.
**Data written:** Restricted educational follow-up only; separate specialist referral if needed.

**Alternate and failure paths**

- Sensitive care concern routes to the specialist workspace.
- No access to evidence: assign authorized reviewer without exposing it.

**Demo acceptance:** General school dashboards never reveal confidential support narrative.
