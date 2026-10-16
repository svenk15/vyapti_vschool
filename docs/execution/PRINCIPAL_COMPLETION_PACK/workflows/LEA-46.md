# LEA-46 — Manage sessions, preferences and school support

## Identity and readiness
- Baseline: PARTIAL; human review PENDING.
- Owner: Access + school configuration. This names responsibility, not proof that an owner module exists.
- Product decisions: D05. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F18. See execution queue.
- Reference: approved Principal catalogue LEA-46; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/account`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe D from 04_PRODUCTION_UX.md.

## Target product definition
Keep existing session controls. Add own table density compact/comfortable and reduced-motion preference; preserve keyboard/touch targets. School support comes from explicit trusted branch contact configuration, not hardcoded fictional contact.

## Lifecycle, data and ownership
Preferences versioned own-account keys; no timezone/identity/email edits here. Support published config includes label/contact/hours/timezone and no promise of24h monitoring.

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
- WF-46-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-46-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-46-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-46-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-46-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Preference update cannot change another account or mandatory security notices; unconfigured support is honest unavailable.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Manage sessions, preferences and school support
**Delivery:** phase 1 · First release
**Trigger:** Leader signs out, checks session security or changes personal preferences.
**Actors:** Principal; authorized Access + Preferences owner
**Preconditions:** Existing Access/session policy and own-account identity.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open My account. | Show own sessions and allowed preferences. |
| 2 | Principal | Change an approved preference or revoke a session. | Identity/contact changes follow existing verification, not a direct profile write. |
| 3 | Principal | Confirm sensitive action if policy requires. | Server acknowledges revocation before claiming success. |
| 4 | System / owner | Sign out from the separate session action. | Clear protected context and local drafts under documented policy. |

**Inputs and validation**

- **Preferences:** Own allowed keys; required security notices labelled.
- **Session:** Own session reference only.
- **Support:** School-approved contact route.

**Outcome:** Controlled personal account state.
**Authorization:** Own-account management grants no staff-user administration.
**Data read:** Own sessions/preferences and safe support configuration.
**Data written:** Access owner revocation/preference/verified-change workflow.

**Alternate and failure paths**

- Unsaved draft: save/discard before leaving; unknown command: preserve safe reference and reconcile.
- Failed revoke cannot say session ended.

**Demo acceptance:** Sign out is visually separate from name/role and protects shared-device data.
