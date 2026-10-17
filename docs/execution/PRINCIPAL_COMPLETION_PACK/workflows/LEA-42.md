# LEA-42 — Review decision and follow-up history

## Identity and readiness
- Current engineering status: PARTIAL; safe search/sequence/source-open path verified, optional separate review-finding record absent; human review PENDING.
- Owner: Coordination + decision owners + Reporting. This names responsibility, not proof that an owner module exists.
- Product decisions: D04. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F04,F03. See execution queue.
- Reference: approved Principal catalogue LEA-42; locate its actual explorer trigger in HTML, do not invent a hash route.
- Production route: `/leadership/history`.
- Production composition: recipe L from 04_PRODUCTION_UX.md.

## Target product definition
Search safe owner event timelines by exact reference, eligible actor or bounded dates up to90days. Current purpose and scope rechecked; arbitrary platform audit browsing prohibited. Separate review finding routes through Coordination.

Current implementation covers the read-only history projection and a link to the existing independently guarded Coordination request. It intentionally does not claim the optional separate review-finding record: no generic finding table or unsupported action was introduced.

## Lifecycle, data and ownership
Append-only events, safe IDs/transitions/time/attribution only; inactive actor retains historical display reference. Finding never rewrites source event.

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
- WF-42-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-42-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-42-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-42-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-42-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Source restriction hides contents but preserves permitted safe history; note text and tokens absent.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Review decision and follow-up history
**Delivery:** phase 2 · Later
**Trigger:** Leader audits why an action was taken or a case remains open.
**Actors:** Principal; authorized Reporting + source owners owner
**Preconditions:** Purpose-specific audit/event-read grant.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Search by reference, actor or bounded date. | Only visible scopes and safe event metadata returned. |
| 2 | Principal | Open event sequence. | Show intent, owner result, version and who acted. |
| 3 | Principal | Inspect linked source only with current permission. | Audit reference does not bypass access. |
| 4 | System / owner | Record a review finding or escalation if needed. | Prior audit events remain append-only. |

**Inputs and validation**

- **Search attribute:** Reference by default; actor/date allowlisted.
- **Window:** Bounded; no all-time unrestricted dump.
- **Finding:** Separate review record.

**Outcome:** Understandable accountability trail.
**Authorization:** General audit excludes raw messages, answers, health detail, tokens and file contents.
**Data read:** Append-only safe events; command/decision references.
**Data written:** Optional review finding, never audit rewrite.

**Alternate and failure paths**

- Actor later inactive: historical attribution retained safely.
- Source unavailable/restricted: audit shows safe reference, not leaked contents.

**Demo acceptance:** Closed/reopened/reassigned history cannot be overwritten to erase responsibility.

# Financial & service oversight
