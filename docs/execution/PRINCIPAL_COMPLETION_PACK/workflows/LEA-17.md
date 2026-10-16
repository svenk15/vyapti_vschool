# LEA-17 — Review assignment completion with the right denominator

## Identity and readiness
- Baseline: PARTIAL; human review PENDING.
- Owner: Learning + Coordination. This names responsibility, not proof that an owner module exists.
- Product decisions: D10. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F08,F04. See execution queue.
- Reference: approved Principal catalogue LEA-17; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/learning`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe L from 04_PRODUCTION_UX.md.

## Target product definition
Extend frozen-recipient metrics with per-recipient due extensions and explicit excusal. Principal aggregate read still excludes pupil identities; separate evidence grant enables narrowly scoped status rows without draft/answer content. Create teaching follow-up only to an eligible assigned academic coordinator.

## Lifecycle, data and ownership
Due cohort uses effective individual deadline and excusal as-of cutoff. Count submitted and awaiting within same non-excused due cohort; show excused/future separately.

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
- WF-17-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-17-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-17-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-17-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-17-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Extension after an earlier snapshot cannot silently rewrite the snapshot; excused learner does not remain in awaiting denominator.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Review assignment completion with the right denominator
**Delivery:** phase 3 · Later
**Trigger:** Leader reviews work completion for a class or subject.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Learning oversight grant and published assignment audience/extension rules.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose class, subject and period. | Show expected learner-assignment pairs due by cutoff. |
| 2 | Principal | Open submitted, awaiting or excused group. | Latest accepted attempt per pair counts once; private drafts remain private. |
| 3 | Principal | Inspect permitted evidence and context. | Extensions and missing audience data are explicit. |
| 4 | System / owner | Create a scoped teaching follow-up if justified. | Action names class/task, owner and evidence goal; no bulk student penalty. |

**Inputs and validation**

- **Period/cutoff:** Explicit school time.
- **Population:** Published assignment audience as of documented snapshot.
- **Follow-up:** Optional, distinct from grade/discipline.

**Outcome:** Accurate completion review and an authorized educational next step.
**Authorization:** Default leadership oversight does not expose private drafts or all student response content.
**Data read:** Published assignment recipients; accepted attempts; extensions/excused policy.
**Data written:** Optional internal coordination action.

**Alternate and failure paths**

- Unavailable submission data is not non-completion.
- A second attempt does not count as a second pupil.

**Demo acceptance:** Extended/not-yet-due and excused pairs follow the documented denominator policy.
