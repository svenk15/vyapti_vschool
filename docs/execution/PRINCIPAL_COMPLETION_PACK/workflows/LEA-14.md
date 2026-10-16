# LEA-14 — Review an attendance correction request

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Attendance requests + Attendance. This names responsibility, not proof that an owner module exists.
- Product decisions: D07,D08. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F06,F03,F04. See execution queue.
- Reference: approved Principal catalogue LEA-14; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/attendance/correction-requests/:id`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe W from 04_PRODUCTION_UX.md.

## Target product definition
Explicit purpose allows a Parent to flag own linked child, Student to flag own record or assigned Teacher to flag permitted roster record. Principal routes unless separately correction-authorized. Proposed outcome is not a changed mark.

## Lifecycle, data and ownership
SUBMITTED → IN_REVIEW → AWAITING_INFORMATION or APPLIED/DECLINED/WITHDRAWN; one active request per record/revision; APPLIED requires exact committed correction receipt.

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
- WF-14-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-14-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-14-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-14-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-14-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Newer source mark forces review; linking another child or revision as correction evidence is denied.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Review an attendance correction request
**Delivery:** phase 2 · Later
**Trigger:** Teacher, student or parent flags a potential record error.
**Actors:** Delegated attendance reviewer; principal as coordinator
**Preconditions:** Correction capability separately granted to actual decision maker; source version available.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Inspect minimal request and route to authorized reviewer. | No edit action appears without correction grant. |
| 2 | Reviewer | Compare original mark and allowed evidence. | Source revision, reason and current conflict checks are visible. |
| 3 | Reviewer | Review and confirm correction through Attendance owner. | Expected-version command appends correction evidence. |
| 4 | System | Update permitted report/read projections. | History retains original and corrected outcome; notifications follow owner policy. |

**Inputs and validation**

- **Record:** Exact student/session reference.
- **New outcome:** Attendance policy allowlist; no bulk default.
- **Reason:** Required bounded reason, evidence reference if policy requires.

**Outcome:** Authorized corrected revision or reasoned rejection.
**Authorization:** Coordination does not confer correction permission; no principal mark-all shortcut.
**Data read:** Current attendance revision; request; authorized evidence.
**Data written:** Owner correction command plus audit/receipt, if explicitly permitted.

**Alternate and failure paths**

- Submitted record changed during review: re-read before correction.
- Insufficient evidence: request clarification or reject, preserving history.

**Demo acceptance:** Concurrent correction does not overwrite a newer revision.
