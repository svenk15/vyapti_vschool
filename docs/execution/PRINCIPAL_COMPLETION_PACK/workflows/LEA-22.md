# LEA-22 — Authorize or hand off report publication

## Identity and readiness
- Baseline: ENGINEERING_COMPLETE for the approved synthetic scope; human review PENDING.
- Owner: Assessments + Documents. Assessments owns the report revision, handoff, publication, recipients, withdrawal and receipts; Documents owns quarantine, scan, immutable bytes, grants and authenticated serving.
- Product decisions: D11,D15. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F11,F12,F03. See execution queue.
- Reference: approved Principal catalogue LEA-22; locate its actual explorer trigger in HTML, do not invent a hash route.
- Production route: `/leadership/assessments/publications`, with `/family/results` and `/student/results` recipient counterparts.
- Production composition: recipe W from 04_PRODUCTION_UX.md.

## Target product definition
Explicit report publisher reviews approved immutable report version and audience. One action publishes to current authorized Student/Guardian purposes; Principal without publisher authority hands off.

## Lifecycle, data and ownership
Publication receipt pins report, scale/cohort/source versions and frozen audience; download still rechecks live link. Corrected report creates new publication revision; withdrawal removes serving.

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
- WF-22-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-22-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-22-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-22-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-22-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Unapproved report cannot publish; revoked guardian cannot download an old copied link.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

Implementation and direct-comparison evidence: `docs/evidence/principal-lea-22-report-publication-2026-10-18/`. Production template/signatory, storage/region/retention/scanner-service configuration, human review, native accessibility, actual browser 200% zoom and TEN-03 remain pending release gates.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Authorize or hand off report publication
**Delivery:** phase 4 · Later
**Trigger:** Reports are approved and ready for release.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Explicit publication delegation, audience and required separation of duties.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Inspect exact approved report version and audience. | Show release date, affected population and unresolved blockers. |
| 2 | Principal | Preview permitted publication effects. | No default all-branch or all-family audience. |
| 3 | Principal | Publish only if explicitly authorized; otherwise hand off. | Fresh prerequisites and conflict rules rechecked. |
| 4 | System / owner | Inspect owner publication receipt and delivery status. | Published is distinct from every recipient having received/read it. |

**Inputs and validation**

- **Version:** Exact immutable approved publication.
- **Audience:** Purpose-authorized student/guardian recipients.
- **Release time:** Explicit timezone and owner scheduling policy.

**Outcome:** Owner-confirmed publication or a pending handoff.
**Authorization:** Principal role alone cannot publish or access all guardian recipients.
**Data read:** Report readiness; approved version; authorized publication audience.
**Data written:** Assessment publication command and approved communication handoff.

**Alternate and failure paths**

- Duplicate publish returns same result.
- Post-publication correction uses new revision/withdrawal policy, not silent overwrite.

**Demo acceptance:** Stale or unapproved report cannot be published.

# Staff coordination
