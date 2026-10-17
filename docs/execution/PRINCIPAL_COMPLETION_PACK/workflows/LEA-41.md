# LEA-41 — Prepare a leadership review brief

## Identity and readiness
- Current status: ENGINEERING_COMPLETE for the D06 synthetic-only portal brief; human review PENDING. Real-data retention/disclosure and production gates remain open.
- Owner: Reporting. This names responsibility, not proof that an owner module exists.
- Product decisions: D06. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F05. See execution queue.
- Reference: approved Principal catalogue LEA-41; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/briefs/new`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe W from 04_PRODUCTION_UX.md.

## Target product definition
Compose immutable evidence-backed brief from supported report snapshots, chosen audience and bounded human narrative. Distinguish facts and interpretation. Share in portal only to recipients who retain rights to every included section; export separate.

## Lifecycle, data and ownership
DRAFT → FINALIZED → WITHDRAWN; source changes do not recalculate final brief. Adding section/audience creates new review version. One inaccessible section denies full download, or creates a separately reviewed reduced artifact.

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
- WF-41-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-41-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-41-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-41-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-41-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Recipient cannot obtain a restricted section via assembled PDF/CSV or stale share link.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Prepare a leadership review brief
**Delivery:** phase 2 · Later
**Trigger:** Leader needs an evidence-backed meeting or management summary.
**Actors:** Principal; authorized Reporting + source owners owner
**Preconditions:** Approved audience and access-filtered report sources.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose period, purpose and audience. | Only permitted source sections included. |
| 2 | Principal | Review key changes and unresolved actions. | Every claim links to a source/cutoff; distinguish fact from interpretation. |
| 3 | Principal | Edit and approve the narrative. | Exclude confidential cases and unsupported causal claims. |
| 4 | System / owner | Export or share only through authorized action. | Audience preview and delivery/receipt remain explicit. |

**Inputs and validation**

- **Audience:** Approved role/person set.
- **Narrative:** Human reviewed; no student/teacher labels unsupported by evidence.
- **Source versions:** Retained in report metadata.

**Outcome:** Reviewable brief with evidence and next actions.
**Authorization:** Brief generation and external sharing are separate grants.
**Data read:** Source metric snapshots; action status; publication-safe narrative.
**Data written:** Report draft/version; approved sharing command only on explicit confirmation.

**Alternate and failure paths**

- Missing baseline: no invented trend.
- A restricted source cannot be exposed through an apparently harmless summary.

**Demo acceptance:** Reviewer can trace each number to the same permitted snapshot.
