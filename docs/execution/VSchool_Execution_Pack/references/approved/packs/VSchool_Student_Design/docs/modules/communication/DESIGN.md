# Messages & notices — DESIGN
Design status: DESIGNED_FOR_UX_REVIEW. Production implementation: NOT_ASSESSED. Human acceptance: PENDING.
Owner: Communication. Earliest proposed phase: 2.

## Purpose and screens
Published student notices and staff-scoped conversations.
Use the shared UX_SYSTEM.md. Reference boards (desktop/mobile): Messages, Notice, Notice-acknowledged, Teacher-conversation. Every workflow also has a guided review under flow/STW-xx. Specialist walkthroughs are proposals, not fully connected downstream implementations.

## Domain and low-level boundary
Entities/tables to reconcile: PublishedNoticeVersion; Recipient; Acknowledgement; ConversationGrant; Message.
Application ports: ReadNotice / AcknowledgeNoticeVersion / SendGrantedMessage.
Repository workflow: Recheck intended audience/participants. Acknowledgement unique student/version. Message intent commits once with owner delivery state; no private draft/recipient data in general event payload.
Prerequisite: Student notice audiences and direct staff conversations approved; message retention/reporting/delivery-failure contract.

## Permission and transport
Authenticate server principal; derive current verified student enrollment. Check released module, institution entitlement, branch enablement, capability and object/audience scope on every read, command, status and download. Route/form identifiers are references only. Do not rely on client visibility or caller-settable tenant GUCs. HTTP DTOs cannot contain private teacher/guardian/peer data.

Use domain values for IDs, versions, publication state and school time. Commands validate before mutation, follow shared lock order, commit evidence atomically and return typed outcomes. Exact replay must reauthorize reads and return the same owner result. Do not hold DB locks over external provider I/O. Query DTOs are bounded/paginated.

## Shared failure states
Loading, legitimate empty state, recoverable request failure, session expiry, revoked access, version conflict and module unavailable. For mutating journeys, distinguish definitive rejection from transport uncertainty and preserve the intent. Full-page errors should not silently clear unsaved work. Every confirm/dialog action is keyboard accessible and has a safe cancellation path.

## STW-27 — Read a school notice
Phase: 2. Reconcile with owner release/dependency gates.

**Intent:** Read updates intended for my enrollment.
1. **Open notice** — Show title, sender, audience-safe description and publication time.
2. **Read permitted attachments** — Reauthorize attachments; show deadlines/actions explicitly.
3. **Outcome:** Published notice read.

**Permission/invariant:** Read does not mean acknowledged or consented.
**Failure/recovery:** Retracted notice becomes unavailable with safe context.
**Persistence/data:** Published notice version + audience membership + file asset.
**Join/write contract:** Recheck intended audience/participants. Acknowledgement unique student/version. Message intent commits once with owner delivery state; no private draft/recipient data in general event payload.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-28 — Acknowledge a notice
Phase: 2. Reconcile with owner release/dependency gates.

**Intent:** Explicitly confirm the exact notice version was read.
1. **Review notice** — Show what acknowledgement means.
2. **Acknowledge** — Commit one response per student and notice version.
3. **Outcome:** Timestamped acknowledgement.

**Permission/invariant:** Acknowledgement never supplies guardian consent or event permission.
**Failure/recovery:** Revised notice may need fresh acknowledgement; stale version prompts review.
**Persistence/data:** NoticeAcknowledgement unique recipient/notice_version.
**Join/write contract:** Recheck intended audience/participants. Acknowledgement unique student/version. Message intent commits once with owner delivery state; no private draft/recipient data in general event payload.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-29 — Message a permitted teacher
Phase: 2. Reconcile with owner release/dependency gates.

**Intent:** Communicate within the school-approved channel.
1. **Open conversation** — Use explicit assignment/enrollment-specific participant grant.
2. **Compose and send** — Review bounded text and safe attachments; clear pending/sent state.
3. **Outcome:** Accepted message reference.

**Permission/invariant:** No open peer messaging or access to classmates; block/report route is school-owned.
**Failure/recovery:** Participant revocation clears thread; unresolved sends are checked before retry.
**Persistence/data:** ConversationGrant + participant + Message + DeliveryAttempt.
**Join/write contract:** Recheck intended audience/participants. Acknowledgement unique student/version. Message intent commits once with owner delivery state; no private draft/recipient data in general event payload.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-30 — Recover a message delivery problem
Phase: 2. Reconcile with owner release/dependency gates.

**Intent:** Know whether a message was accepted or failed.
1. **Inspect status** — Distinguish accepted by school, pending and definitive failure.
2. **Recover deliberately** — Check same intent first; resend only after known failure under current grant.
3. **Outcome:** Single traceable message.

**Permission/invariant:** Browser success is not staff read confirmation.
**Failure/recovery:** Show contact/help for persistent failure without exposing provider details.
**Persistence/data:** Message command receipt + delivery attempt safe status.
**Join/write contract:** Recheck intended audience/participants. Acknowledgement unique student/version. Message intent commits once with owner delivery state; no private draft/recipient data in general event payload.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.
