# LEA-12 — Review factual pupil attendance patterns

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Attendance + Coordination. This names responsibility, not proof that an owner module exists.
- Product decisions: D07. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F06,F04. See execution queue.
- Reference: approved Principal catalogue LEA-12; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/attendance/pupils`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe L from 04_PRODUCTION_UX.md.

## Target product definition
Explicit pupil-level grant permits branch Student name/admission reference and factual submitted marks only. Window 1–90 days. User selects absent-session threshold 1–90; no hidden risk score or automatic contact. Show submitted eligible sessions and missing coverage separately.

## Lifecycle, data and ownership
Read projection over frozen roster and latest effective submitted mark revisions; route support only using an approved scoped Coordination kind. No medical/family inference or bulk identity export.

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
- WF-12-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-12-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-12-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-12-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-12-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Two absent sessions on one date remain two sessions and one date; OPEN sessions do not increase absence counts.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Review factual pupil attendance patterns
**Delivery:** phase 2 · Later
**Trigger:** School policy calls for a review of recorded absence patterns.
**Actors:** Principal or attendance lead; authorized student support coordinator
**Preconditions:** Explicit pupil-level attendance purpose; defined date window and outcome rules.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose recorded period and approved review criterion. | Show source coverage before any pattern list. |
| 2 | System | Group factual submitted outcomes by permitted pupil. | Count sessions/dates explicitly; no speculative risk label. |
| 3 | Principal | Open the record evidence. | Separate late, absent, excused and unsubmitted sessions. |
| 4 | Principal | Route a support follow-up if warranted. | Guardian contact/relationship and care information require their own grants. |

**Inputs and validation**

- **Window:** Bounded school dates.
- **Criterion:** Approved rule with version; no secret default scoring.
- **Follow-up purpose:** Attendance support; no inferred medical/family reason.

**Outcome:** Evidence-based human review and authorized next action.
**Authorization:** Attendance purpose is not health, safeguarding or unrestricted family access.
**Data read:** Submitted session outcomes; frozen roster; scoped student summary; rule version.
**Data written:** Only an approved coordination/support request if confirmed.

**Alternate and failure paths**

- Incomplete registers: disclose missing coverage; do not manufacture absence.
- Restriction on pupil detail: show authorized aggregate or deny; do not expose identity in export.

**Demo acceptance:** Same pupil with multiple absent sessions is counted as one pupil only when metric explicitly says unique pupils.
