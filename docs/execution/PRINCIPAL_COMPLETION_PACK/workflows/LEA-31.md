# LEA-31 — Recover an uncertain or outdated decision

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Each decision owner + Access. This names responsibility, not proof that an owner module exists.
- Product decisions: D03. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F03. See execution queue.
- Reference: approved Principal catalogue LEA-31; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/decisions/status/:reference`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe R from 04_PRODUCTION_UX.md.

## Target product definition
Keep original intent after timeout. Check owner status under live authorization; unknown stays unknown, committed returns original protected receipt only if still authorized. Stale evidence requires fresh review and new intent after original outcome is known.

## Lifecycle, data and ownership
Strong owner receipt lookup; never use read-replica not-found as proof of noncommit. No protected browser draft retained after scope revocation.

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
- WF-31-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-31-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-31-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-31-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-31-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Revoke between commit and receipt recovery denies contents; restored authority recovers one original result.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Recover an uncertain or outdated decision
**Delivery:** phase 2 · Second release
**Trigger:** A decision response is lost or evidence changes mid-review.
**Actors:** Principal; authorized Each owning module owner
**Preconditions:** Stable intent, expected version and authorized status use case exist.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Keep intent and show Confirmation pending. | Do not offer another different decision while unresolved. |
| 2 | Principal | Check status under current authorization. | Accepted receipt, still pending or verified not-found returned. |
| 3 | Principal | If evidence changed, reopen review. | Display new permitted state and require fresh confirmation. |
| 4 | System / owner | Resolve the original operation. | No duplicate downstream effect and no false failure label. |

**Inputs and validation**

- **Reference:** Original opaque intent key.
- **New decision:** Only after original status is known and current policy permits.

**Outcome:** Known, attributable outcome.
**Authorization:** Retry/replay/status endpoints apply the same current owner guard.
**Data read:** Command receipt plus current owner version.
**Data written:** Exact replay only; no new effect on duplicate.

**Alternate and failure paths**

- Stale replica absence is not proof of failure.
- Permission revoked: safe support reference only, no protected receipt body.

**Demo acceptance:** Lost response followed by status check returns one original decision.

# Communication & family escalations
