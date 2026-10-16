# LEA-16 — Review timetable conflicts and uncovered classes

## Identity and readiness
- Baseline: PARTIAL; human review PENDING.
- Owner: Timetable + People. This names responsibility, not proof that an owner module exists.
- Product decisions: D09. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F07. See execution queue.
- Reference: approved Principal catalogue LEA-16; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/timetable`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe L from 04_PRODUCTION_UX.md.

## Target product definition
Retain current publication/reconciliation view and add dated availability/uncovered occurrences, substitute status and owner-approved cover action. Unknown availability is not absence or available.

## Lifecycle, data and ownership
Join immutable occurrence and current cover state through owner projections. Submitted/open registers block reassignment; cancelled/revoked cover remains historical.

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
- WF-16-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-16-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-16-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-16-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-16-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Cover acceptance changes only eligible scheduled occurrence; an OPEN register is unchanged and reports conflict.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Review timetable conflicts and uncovered classes
**Delivery:** phase 3 · Later
**Trigger:** A class is uncovered or a published schedule changes.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Published recurring timetable and coverage owner; manual attendance sessions alone are insufficient.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open affected period and branch. | List published uncovered/conflicting occurrences with evidence. |
| 2 | Principal | Inspect the exact occurrence. | Show current assignment and impact without private staff absence reasons. |
| 3 | Principal | Route to timetable coordinator or open delegated cover action. | Eligible staff and conflict checks come from the owner. |
| 4 | System / owner | Confirm owner result. | Publication/version refreshes; related attendance remains separate. |

**Inputs and validation**

- **Period:** School dates and times.
- **Occurrence:** Exact published version.
- **Proposed action:** Owner-defined cover/change request.

**Outcome:** Resolved cover arrangement or a traceable coordination request.
**Authorization:** No general timetable-edit or attendance-mark authority from a principal role.
**Data read:** Published occurrences; dated teacher eligibility and assignment; conflict projection.
**Data written:** Owner-specific cover request/decision only.

**Alternate and failure paths**

- Concurrent timetable edit requires refreshed review.
- No eligible cover: show unresolved status and escalation, not an invented allocation.

**Demo acceptance:** Assigned substitute cannot clash with another occurrence; cancelled sessions remain traceable.
