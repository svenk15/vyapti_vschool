# LEA-45 — Review a source-linked leadership draft

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: AI application + Reporting. This names responsibility, not proof that an owner module exists.
- Product decisions: D19. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F17,F05. See execution queue.
- Reference: approved Principal catalogue LEA-45; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/assistant`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe W from 04_PRODUCTION_UX.md.

## Target product definition
Bounded question500 chars over selected permitted aggregate snapshots. Source-linked advisory text only; user edits and approves draft. No tool that mutates owners, no rankings or sensitive inference. Provider explicitly configured with minimization policy.

## Lifecycle, data and ownership
REQUESTED → GENERATED/FAILED → HUMAN_REVIEWED/DISCARDED. Each number validates against source; unsupported assertions flagged, missing source stops factual answer.

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
- WF-45-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-45-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-45-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-45-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-45-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Injected source instructions cannot widen retrieval or invoke commands; revoked source blocks reopening generated draft.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Review a source-linked leadership draft
**Delivery:** phase 7 · Later
**Trigger:** Leader asks for a summary of permitted school evidence.
**Actors:** Principal; authorized AI application + source owners owner
**Preconditions:** Approved AI provider/data policy, source access and evaluation gates.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose a bounded question and scope. | Preview permitted sources and source cutoff. |
| 2 | Principal | Generate an advisory draft. | Citations link to authorized source versions; gaps stated explicitly. |
| 3 | Principal | Review and edit every proposed conclusion/action. | No opaque pupil risk score, staff ranking or sensitive inference. |
| 4 | System / owner | Choose a separate authorized action if useful. | AI never publishes, approves, changes attendance or sends a message autonomously. |

**Inputs and validation**

- **Question:** Bounded; no secrets or unnecessary personal detail.
- **Sources:** Permission-filtered at retrieval and open time.
- **Action:** Explicit human-owned command with normal guards.

**Outcome:** Human-reviewed, evidence-linked assistance.
**Authorization:** Principal role does not widen AI retrieval; output is not a new authority source.
**Data read:** Minimized permitted published/operational sources and provenance.
**Data written:** Approved draft/evaluation metadata; no consequential automatic write.

**Alternate and failure paths**

- Missing/contradictory evidence: say uncertain, do not invent a policy or causal explanation.
- Untrusted source text cannot alter permissions or tool instructions.

**Demo acceptance:** A model-generated suggested approval cannot call the owner approval command.

# Account & preferences
