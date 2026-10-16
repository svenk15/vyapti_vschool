# LEA-24 — Approve temporary cover when delegated

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Timetable + People. This names responsibility, not proof that an owner module exists.
- Product decisions: D02,D09. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F02,F07,F03. See execution queue.
- Reference: approved Principal catalogue LEA-24; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/cover/:id`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe W from 04_PRODUCTION_UX.md.

## Target product definition
Coordinator proposes exact occurrence and eligible substitute; independently delegated approver approves; substitute must accept before teaching/Attendance authority changes. Either order of approval/acceptance may be recorded, but activation requires both and fresh checks.

## Lifecycle, data and ownership
PROPOSED → awaiting approval/acceptance → ACTIVE; decline/reject/withdraw before activation; cancel active only before protected register state. Replacement is new proposal.

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
- WF-24-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-24-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-24-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-24-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-24-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Acceptance after grant expiry or register opening fails atomically; original teacher loses occurrence marking when valid cover activates.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Approve temporary cover when delegated
**Delivery:** phase 3 · Later
**Trigger:** Timetable coordinator proposes substitute coverage.
**Actors:** Principal; authorized People + Timetable + Requests owner
**Preconditions:** Delegated cover approval; verified teacher eligibility and time overlap checks.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Review proposed teacher, occurrence and effective period. | See alternatives and impact allowed by owner. |
| 2 | Principal | Check current eligibility and conflicts. | No assumption that any staff account can teach. |
| 3 | Principal | Approve, return or reject with reason. | Current source versions and separation rules checked. |
| 4 | System / owner | Confirm published dated assignment. | Teacher access derives from that assignment, not principal notification. |

**Inputs and validation**

- **Occurrence/version:** Exact class/time.
- **Substitute:** Eligible active teacher.
- **Decision/reason:** Owner policy.

**Outcome:** Valid time-bounded cover assignment or explicit rejection.
**Authorization:** Approver cannot create teacher identity or bypass eligibility.
**Data read:** Occurrence; verified teacher identity/eligibility; dated assignment overlap.
**Data written:** Timetable owner command and audit.

**Alternate and failure paths**

- Teacher becomes ineligible before commit: deny.
- Teacher/date overlap: reject rather than double-book.

**Demo acceptance:** Expired cover grants no continued marking authority.
