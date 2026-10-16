# LEA-20 — Check assessment and report readiness

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Assessments. This names responsibility, not proof that an owner module exists.
- Product decisions: D11. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F11. See execution queue.
- Reference: approved Principal catalogue LEA-20; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/assessments`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe L from 04_PRODUCTION_UX.md.

## Target product definition
Show versioned assessment-cycle readiness: eligible subjects, missing marks, moderation pending, approved reports, withheld and published. Distinguish not assessed, absent and excused from zero.

## Lifecycle, data and ownership
Assessment plan, frozen cohort, mark revision, moderation decision and report revision are owned by Assessments. Released cycles remain immutable.

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
- WF-20-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-20-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-20-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-20-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-20-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Readiness total reconciles to frozen cohort; missing marks cannot be converted to zero or published as complete.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Check assessment and report readiness
**Delivery:** phase 4 · Later
**Trigger:** School approaches a report publication milestone.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Assessment readiness projection and explicit branch oversight grant.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose assessment cycle. | Show configured requirements and source cutoff. |
| 2 | Principal | Inspect missing marks, unresolved outcomes or pending moderation. | Different readiness blockers remain distinct. |
| 3 | Principal | Assign coordination to the responsible owner. | No fabricated marks or implicit publication rights. |
| 4 | System / owner | Recheck owner evidence. | Ready means prerequisites satisfied, not Published. |

**Inputs and validation**

- **Cycle:** Exact scheme/version.
- **Readiness rule:** Owner-defined; optional assessments labelled.
- **Coordinator:** Eligible assessment lead.

**Outcome:** An explainable readiness checklist and remaining blockers.
**Authorization:** Leadership read does not imply mark entry, moderation approval or publication.
**Data read:** Assessment scheme; outcome completeness; moderation state; publication prerequisites.
**Data written:** Coordination actions only unless separately delegated.

**Alternate and failure paths**

- Absent, Exempt and Not entered cannot collapse into numeric zero.
- Revised scheme invalidates stale readiness snapshot.

**Demo acceptance:** 100% readiness cannot be displayed while a mandatory outcome is unresolved.
