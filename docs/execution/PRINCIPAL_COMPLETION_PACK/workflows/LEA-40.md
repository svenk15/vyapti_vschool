# LEA-40 — Compare branches responsibly

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Reporting + Access. This names responsibility, not proof that an owner module exists.
- Product decisions: D06. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F05. See execution queue.
- Reference: approved Principal catalogue LEA-40; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/reports/compare`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe L from 04_PRODUCTION_UX.md.

## Target product definition
Distinct institution aggregate-comparison grant enumerates branch IDs and metric definitions. Compare at most20 branches over1–31 local dates with UTC cutoffs displayed. Use whole-branch operational metrics only initially; no pupil subsets or league-table ranking.

## Lifecycle, data and ownership
No materialized cross-tenant access. Per-branch owner read, compatible definitions and completeness; incomparable periods shown separately. Combined ratios use summed numerator/denominator only if compatible.

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
- WF-40-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-40-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-40-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-40-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-40-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Revoked branch disappears without residual totals; 1/2 and9/10 yields10/12, never average of percentages.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Compare branches responsibly
**Delivery:** phase 2 · Later
**Trigger:** Institution leader has explicit cross-branch analytics authority.
**Actors:** Principal; authorized Reporting + source owners owner
**Preconditions:** Comparable definitions, time basis, granted branch set and suppression rules.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Select authorized branches and period. | No implicit all-institution scope. |
| 2 | Principal | Review comparability. | Show module availability, calendar, coverage and definition differences. |
| 3 | Principal | Compare like-for-like metrics. | Display counts/denominators; no misleading simple average of percentages. |
| 4 | System / owner | Open a branch only where detailed authority exists. | A summary grant does not create full operational access. |

**Inputs and validation**

- **Branch set:** Explicit allowed set.
- **Metric:** Compatible definition version.
- **Comparison window:** Normalized school-day/period policy, visibly documented.

**Outcome:** Qualified comparison with limitations visible.
**Authorization:** Cross-branch analytics, branch detail and pupil evidence are separate capabilities.
**Data read:** Authorized aggregate snapshots and definition metadata.
**Data written:** None, unless an explicitly authorized report export is requested.

**Alternate and failure paths**

- Different calendars or missing data: show Not comparable rather than rank.
- Partial branch grant loss: recompute safely without revealing withheld totals.

**Demo acceptance:** Weighted total uses underlying counts; unavailable branch is never treated as zero.
