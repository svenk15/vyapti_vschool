# Feedback & progress — DESIGN
Design status: DESIGNED_FOR_UX_REVIEW. Production implementation: NOT_ASSESSED. Human acceptance: PENDING.
Owner: Learning. Earliest proposed phase: 3.

## Purpose and screens
Only returned feedback and published criteria.
Use the shared UX_SYSTEM.md. Reference boards (desktop/mobile): Feedback, Revision. Every workflow also has a guided review under flow/STW-xx. Specialist walkthroughs are proposals, not fully connected downstream implementations.

## Domain and low-level boundary
Entities/tables to reconcile: SubmissionAttempt; student-facing FeedbackPublication; published rubric.
Application ports: ReadReturnedFeedback / AskFeedbackQuestion.
Repository workflow: Select own attempt and only Returned student-audience publication. Private feedback source table is excluded. A reply goes through explicit ConversationGrant or owned-request use case.
Prerequisite: Teacher return/revoke/version lifecycle; resubmission policy separate from feedback publication.

## Permission and transport
Authenticate server principal; derive current verified student enrollment. Check released module, institution entitlement, branch enablement, capability and object/audience scope on every read, command, status and download. Route/form identifiers are references only. Do not rely on client visibility or caller-settable tenant GUCs. HTTP DTOs cannot contain private teacher/guardian/peer data.

Use domain values for IDs, versions, publication state and school time. Commands validate before mutation, follow shared lock order, commit evidence atomically and return typed outcomes. Exact replay must reauthorize reads and return the same owner result. Do not hold DB locks over external provider I/O. Query DTOs are bounded/paginated.

## Shared failure states
Loading, legitimate empty state, recoverable request failure, session expiry, revoked access, version conflict and module unavailable. For mutating journeys, distinguish definitive rejection from transport uncertainty and preserve the intent. Full-page errors should not silently clear unsaved work. Every confirm/dialog action is keyboard accessible and has a safe cancellation path.

## STW-22 — Read returned teacher feedback
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Understand feedback tied to my work.
1. **Open returned item** — Show attempt number and returned time, student-facing comments and released rubric.
2. **Choose next step** — Revise if allowed or ask a permitted clarification.
3. **Outcome:** Actionable feedback with appropriate next action.

**Permission/invariant:** Private notes, draft marks and unreleased comments never enter student DTOs.
**Failure/recovery:** Feedback withdrawn/revised is reauthorized; show latest published revision and prior release policy.
**Persistence/data:** Returned FeedbackPublication + attempt + student-visible rubric.
**Join/write contract:** Select own attempt and only Returned student-audience publication. Private feedback source table is excluded. A reply goes through explicit ConversationGrant or owned-request use case.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-23 — Understand criteria and subject progress
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** See evidence of learning without misleading averages.
1. **Read criteria** — Explain score/outcome, maximum and published assessment scale.
2. **Open evidence** — Link to returned tasks and published report items.
3. **Outcome:** Transparent evidence, not a synthetic rank.

**Permission/invariant:** Zero, Not assessed, Absent and Exempt remain different; no denominator inventing.
**Failure/recovery:** No released evidence gets a useful empty state.
**Persistence/data:** Published criteria + released outcome projections; no private gradebook.
**Join/write contract:** Select own attempt and only Returned student-audience publication. Private feedback source table is excluded. A reply goes through explicit ConversationGrant or owned-request use case.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-24 — Ask about feedback
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Ask the responsible teacher a focused question.
1. **Select feedback** — Carry exact task/attempt reference into a permitted conversation.
2. **Send question** — Review recipient and text; only accepted delivery state is reported.
3. **Outcome:** Scoped question receipt.

**Permission/invariant:** No arbitrary staff/peer recipient search or guardian impersonation.
**Failure/recovery:** If messaging is unavailable, route to a school-owned request.
**Persistence/data:** Conversation grant + feedback reference + message receipt.
**Join/write contract:** Select own attempt and only Returned student-audience publication. Private feedback source table is excluded. A reply goes through explicit ConversationGrant or owned-request use case.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.
