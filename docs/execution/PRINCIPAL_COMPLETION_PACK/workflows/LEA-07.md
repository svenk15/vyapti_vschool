# LEA-07 — Run the weekly leadership review

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Reporting + Coordination. This names responsibility, not proof that an owner module exists.
- Product decisions: D04,D06. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F01,F04,F05. See execution queue.
- Reference: approved Principal catalogue LEA-07; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/reviews/new`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe W from 04_PRODUCTION_UX.md.

## Target product definition
Choose at most 31 branch-local dates, supported aggregate sections and authorized staff audience. Review missing sources explicitly. Select existing follow-ups or create each through its owner; no automatic batch publication.

## Lifecycle, data and ownership
Draft → finalized immutable review brief; action status remains live and separately labelled. Carry-over links do not copy restricted notes.

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
- WF-07-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-07-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-07-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-07-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-07-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Source outage is unavailable rather than zero; finalizing a brief neither closes nor duplicates its actions.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Run the weekly leadership review
**Delivery:** phase 2 · Later · Explicit scope extension
**Trigger:** Scheduled school review meeting.
**Actors:** Principal; authorized coordinators
**Preconditions:** Approved meeting purpose and source access; follow-up coordination enabled for actions.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose period and permitted scope. | Brief shows coverage, outstanding actions and relevant published changes. |
| 2 | Group | Inspect a concern and agree an action. | Owner, due time, source reference and completion evidence are explicit. |
| 3 | Principal | Confirm action list. | Each action is routed to its owning team; recipients are previewed. |
| 4 | Principal | Review carried-over actions next week. | Reassignment and verified outcomes remain traceable. |

**Inputs and validation**

- **Period:** Explicit start/end and school timezone.
- **Action owner:** Current eligible staff identity.
- **Due time:** School-local input converted to an instant.
- **Completion evidence:** Source-state condition or permitted attachment reference.

**Outcome:** Actionable review brief and owned follow-ups.
**Authorization:** A meeting participant does not gain the principal’s source privileges.
**Data read:** Approved report snapshots and follow-up history.
**Data written:** Internal follow-up records and approved meeting action references only.

**Alternate and failure paths**

- No reliable comparison period: omit trend claim.
- Action falls outside participants’ authority: hand off instead of exposing private records.

**Demo acceptance:** Next review distinguishes open, overdue, evidence-ready and verified closed actions.

# Attendance oversight
