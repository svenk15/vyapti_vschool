# LEA-23 — Review staffing availability without private reasons

## Identity and readiness
- Current status: ENGINEERING_COMPLETE at `e62445d`; human review PENDING. The broader F07 cover foundation remains PARTIAL.
- Owner: People + Timetable. This names responsibility, not proof that an owner module exists.
- Product decisions: D09. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F07. See execution queue.
- Reference: approved Principal catalogue LEA-23; locate its actual explorer trigger in HTML, do not invent a hash route.
- Production route: `/leadership/staff/availability`; designated recorder counterpart: `/admin/teachers/availability`.
- Production composition: recipe L from 04_PRODUCTION_UX.md.

## Target product definition
Designated People operator records available/unavailable intervals for operational planning; leaders see state/time only, never private leave reasons. No record = unknown. Read across branches only through conflict port returning busy/free/unknown, not foreign details.

## Lifecycle, data and ownership
Versioned availability intervals with explicit timezone and provenance; staff requests feed them only through approved owner transitions.

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
- WF-23-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-23-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-23-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-23-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-23-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Foreign-branch busy check prevents collision without exposing the foreign class or leave reason.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

Current evidence: `docs/evidence/principal-f07-availability-2026-10-17/README.md`. It proves the People recorder → persisted interval → safe Principal projection journey, exact replay/version history and minimal collision port. It does not claim the later Timetable cover transition.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Review staffing availability without private reasons
**Delivery:** phase 3 · Later
**Trigger:** Principal checks whether the school day can be covered.
**Actors:** Principal; authorized People + Timetable + Requests owner
**Preconditions:** People/timetable availability projection; purpose-specific leadership grant.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose date and branch. | Show available/unavailable and relevant assignment coverage. |
| 2 | Principal | Open an uncovered occurrence. | No medical, payroll or private leave narrative. |
| 3 | Principal | Coordinate with eligible staff owner. | Availability is advisory until assignment conflict checks pass. |
| 4 | System / owner | Recheck published cover result. | Operational gap is resolved by owner evidence. |

**Inputs and validation**

- **Date:** School-local date.
- **Availability detail:** Minimum needed for cover.
- **Action:** Coverage coordination, not staff-performance scoring.

**Outcome:** Operational staffing view.
**Authorization:** Availability oversight is not full HR-record access.
**Data read:** People safe availability projection; dated teaching assignments.
**Data written:** Optional cover request only.

**Alternate and failure paths**

- Missing availability data shown Unknown.
- A staff member working another branch is not presumed free.

**Demo acceptance:** Private leave reason cannot appear in a list, export or notification.
