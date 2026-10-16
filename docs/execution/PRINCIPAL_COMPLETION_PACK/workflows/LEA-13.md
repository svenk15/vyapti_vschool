# LEA-13 — Review an absence explanation

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Attendance explanations. This names responsibility, not proof that an owner module exists.
- Product decisions: D07,D08. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F06,F03. See execution queue.
- Reference: approved Principal catalogue LEA-13; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/attendance/explanations/:id`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe D from 04_PRODUCTION_UX.md.

## Target product definition
Only an explicitly delegated reviewer can read protected explanation text and accept/decline. Add clarification via originator-only portal response; no automatic co-guardian disclosure. Principal without review grant sees only authorized routing metadata.

## Lifecycle, data and ownership
Existing disposition remains canonical. A separate open clarification child record pauses disposition until answered/closed; answer changes evidence version. Correction is a separate owner command.

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
- WF-13-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-13-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-13-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-13-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-13-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Accepting an explanation changes no mark; a revoked guardian cannot read or answer the clarification.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Review an absence explanation
**Delivery:** phase 2 · Later
**Trigger:** Guardian submits an explanation requiring school disposition.
**Actors:** Principal only if delegated; attendance office; guardian
**Preconditions:** Verified guardian-origin request and an explicit school-review capability.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Reviewer | Open assigned request. | See exact child/session/date and minimum explanation permitted for purpose. |
| 2 | Reviewer | Check related attendance and prior disposition. | Explanation status is separate from attendance outcome. |
| 3 | Reviewer | Record allowed disposition or ask for clarification. | Response communicates school review, not an automatic correction. |
| 4 | Authorized Attendance owner | If required, perform separate correction workflow. | Correction receipt is linked without impersonating teacher or guardian. |

**Inputs and validation**

- **Disposition:** Owner-allowed values only.
- **Clarification:** Bounded question; recipient is current authorized originator.
- **Correction reason:** Separate owner command and permission.

**Outcome:** Explained school decision with traceable handoff.
**Authorization:** Principal status alone does not grant family/care detail or correction authority.
**Data read:** Owned family request; current guardian purpose; exact attendance record/version.
**Data written:** Request disposition and permitted message; correction is separate.

**Alternate and failure paths**

- Restricted relationship changes: recheck before reply.
- Principal not delegated: view only permitted routing state, not explanation body.

**Demo acceptance:** Approving an explanation does not mutate an attendance mark.
