# LEA-25 — Decide an assigned staff request

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Requests + People. This names responsibility, not proof that an owner module exists.
- Product decisions: D12. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F09,F03. See execution queue.
- Reference: approved Principal catalogue LEA-25; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/staff/requests/:id`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe D from 04_PRODUCTION_UX.md.

## Target product definition
First supported staff types: operational availability request and classroom-resource request. Exact assigned approver; reject/return reason required. No salary, payroll, medical narrative or statutory leave calculation. Broader leave types require configured owner policy before enablement.

## Lifecycle, data and ownership
Owner-specific SUBMITTED/WAITING_INFORMATION/APPROVED/DECLINED/WITHDRAWN; availability effect is separate owner-confirmed result.

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
- WF-25-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-25-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-25-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-25-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-25-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Approval receipt cannot claim timetable or payroll updated; requester cannot self-approve.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Decide an assigned staff request
**Delivery:** phase 6 · Later
**Trigger:** A leave/resource/staff request reaches an authorized approver.
**Actors:** Principal; authorized People + Timetable + Requests owner
**Preconditions:** Request type is released; principal explicitly assigned and permitted.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open assigned request. | Minimal purpose-specific detail and policy are shown. |
| 2 | Principal | Inspect operational impact and conflicts. | Sensitive attachments require separate access. |
| 3 | Principal | Choose an allowed decision or request information. | Review reason and consequence. |
| 4 | System / owner | Commit through the request owner. | Receipt shows decision; downstream roster/payroll actions keep their own state. |

**Inputs and validation**

- **Request type:** Existing allowed owner category.
- **Decision:** Per-type transition allowlist.
- **Reason:** Required for refusal/return when policy says so.

**Outcome:** Attributed staff-request decision.
**Authorization:** No blanket HR, salary or medical authority.
**Data read:** Assigned request; policy/version; permitted operational impact.
**Data written:** People/service request decision only.

**Alternate and failure paths**

- Principal is requester or has a prohibited conflict: route to independent approver.
- Approval does not automatically update payroll or timetable.

**Demo acceptance:** Same inbox cannot approve a type the principal is not delegated for.
