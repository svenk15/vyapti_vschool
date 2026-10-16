# LEA-10 — Follow up multiple missing registers safely

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Coordination. This names responsibility, not proof that an owner module exists.
- Product decisions: D01. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F01. See execution queue.
- Reference: approved Principal catalogue LEA-10; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/follow-ups/batches/new`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe W from 04_PRODUCTION_UX.md.

## Target product definition
Retain the live 1–50 explicit-selection contract. Preview eligibility and common assignee, confirm once, independent outcomes per source. Filter/context changes clear selection visibly.

## Lifecycle, data and ownership
PROCESSING → COMPLETED/PARTIAL; PENDING → CREATED/ALREADY_EXISTS/FAILED. Preserve stable derived item keys and crash recovery between source commit and item receipt.

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
- WF-10-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-10-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-10-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-10-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-10-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
One created, one already existing and one denied produces truthful per-item outcomes; resume does not duplicate the created request.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Follow up multiple missing registers safely
**Delivery:** phase 2 · Later · Explicit scope extension
**Trigger:** Several due sessions need action.
**Actors:** Principal; Coordination owner
**Preconditions:** All selected rows reauthorized; bulk capability explicitly enabled; single-item workflow proven.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Select explicit visible sessions. | Selection count and scope remain visible across filters. |
| 2 | System | Build a server-side review preview. | Identify already resolved, duplicate, ineligible and eligible rows. |
| 3 | Principal | Confirm recipients, common due time and per-item effects. | No hidden select-all across unreviewed pages. |
| 4 | System | Process independent owner commands. | Per-session succeeded/skipped/failed results and references returned. |
| 5 | Principal | Retry only known failures. | Uncertain items use status lookup; successful items are not resent. |

**Inputs and validation**

- **Selection:** Explicit bounded ID list; proposed max 25.
- **Assignee rule:** Per-session validated coordinator or approved routing.
- **Reason/due:** Previewed before confirmation.

**Outcome:** Honest per-item outcomes with no duplicate follow-ups.
**Authorization:** Bulk authority cannot exceed single-item authority. No bulk attendance marking/correction.
**Data read:** Same records as single follow-up plus versioned preview.
**Data written:** One coordination command receipt per session, plus non-sensitive batch summary.

**Alternate and failure paths**

- Permission/source changes after preview: that item is denied/skipped without rollback of unrelated successes.
- Filter change does not silently change confirmed payload.

**Demo acceptance:** 3 selected with 1 resolved and 1 denied yields 1 new, 1 skipped, 1 denied; no false batch-success label.
