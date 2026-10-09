# Requests & support — DESIGN
Design status: DESIGNED_FOR_UX_REVIEW. Production implementation: NOT_ASSESSED. Human acceptance: PENDING.
Owner: Requests + Students. Earliest proposed phase: 2.

## Purpose and screens
Track owned requests without changing official records.
Use the shared UX_SYSTEM.md. Reference boards (desktop/mobile): Requests-empty, School-support, Request-receipt. Every workflow also has a guided review under flow/STW-xx. Specialist walkthroughs are proposals, not fully connected downstream implementations.

## Domain and low-level boundary
Entities/tables to reconcile: OwnedRequest; student-visible event; category/subject reference.
Application ports: CreateOwnedRequest / ReadOwnRequest / WithdrawOwnRequest.
Repository workflow: Insert originator/student/school/category and minimal text under intent. Read actor-scoped requests and public events only. Withdrawal checks expected state/version; official records change only via owner decision.
Prerequisite: Allowed categories and recipient teams; response expectations, retention and support contact supplied by school.

## Permission and transport
Authenticate server principal; derive current verified student enrollment. Check released module, institution entitlement, branch enablement, capability and object/audience scope on every read, command, status and download. Route/form identifiers are references only. Do not rely on client visibility or caller-settable tenant GUCs. HTTP DTOs cannot contain private teacher/guardian/peer data.

Use domain values for IDs, versions, publication state and school time. Commands validate before mutation, follow shared lock order, commit evidence atomically and return typed outcomes. Exact replay must reauthorize reads and return the same owner result. Do not hold DB locks over external provider I/O. Query DTOs are bounded/paginated.

## Shared failure states
Loading, legitimate empty state, recoverable request failure, session expiry, revoked access, version conflict and module unavailable. For mutating journeys, distinguish definitive rejection from transport uncertainty and preserve the intent. Full-page errors should not silently clear unsaved work. Every confirm/dialog action is keyboard accessible and has a safe cancellation path.

## STW-36 — Create a school support request
Phase: 2. Reconcile with owner release/dependency gates.

**Intent:** Ask school for non-emergency help.
1. **Choose category** — Show only student-allowed categories and expected school response window if configured.
2. **Review and send** — State visible recipient team and submit bounded text.
3. **Outcome:** Pending request reference.

**Permission/invariant:** No claim of continuous emergency monitoring; show school emergency contact when configured.
**Failure/recovery:** Unknown submission checks same intent; validation preserves input.
**Persistence/data:** Owned request + category routing + command receipt.
**Join/write contract:** Insert originator/student/school/category and minimal text under intent. Read actor-scoped requests and public events only. Withdrawal checks expected state/version; official records change only via owner decision.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-37 — Track or withdraw my request
Phase: 2. Reconcile with owner release/dependency gates.

**Intent:** Know what happens next.
1. **Open own request** — View student-visible status history and requested follow-up.
2. **Respond or withdraw** — Reply or withdraw only in permitted state with expected version.
3. **Outcome:** Current status and next action.

**Permission/invariant:** Internal staff notes and other requesters remain private.
**Failure/recovery:** Concurrent resolution blocks outdated withdrawal; reload current version.
**Persistence/data:** Request + public timeline projection + optimistic version.
**Join/write contract:** Insert originator/student/school/category and minimal text under intent. Read actor-scoped requests and public events only. Withdrawal checks expected state/version; official records change only via owner decision.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-38 — Request a profile correction
Phase: 2. Reconcile with owner release/dependency gates.

**Intent:** Correct an official record through school review.
1. **Choose allowed field** — Display existing permitted field and proposed correction.
2. **Submit change request** — Explain school approval is required; contact verification follows Access policy.
3. **Outcome:** Pending correction, official data unchanged.

**Permission/invariant:** No student self-edit of identity, guardian links, enrollment, roles or grants.
**Failure/recovery:** Duplicate/stale source values require current review.
**Persistence/data:** Student profile projection + proposed change request; owner-only update.
**Join/write contract:** Insert originator/student/school/category and minimal text under intent. Read actor-scoped requests and public events only. Withdrawal checks expected state/version; official records change only via owner decision.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.
