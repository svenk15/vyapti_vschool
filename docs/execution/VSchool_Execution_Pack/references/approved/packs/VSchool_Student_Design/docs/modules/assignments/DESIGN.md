# Assignments & submissions — DESIGN
Design status: DESIGNED_FOR_UX_REVIEW. Production implementation: NOT_ASSESSED. Human acceptance: PENDING.
Owner: Learning + Files. Earliest proposed phase: 3.

## Purpose and screens
Private drafts, safe files and explicit versioned submissions.
Use the shared UX_SYSTEM.md. Reference boards (desktop/mobile): Assignments, Assignment-details, Private-draft, Ready-file, Blocked-file, Submission-review, Submission-receipt, Confirmation-pending, Revision, Closed-assignment, Poor-connection, Draft-conflict. Every workflow also has a guided review under flow/STW-xx. Specialist walkthroughs are proposals, not fully connected downstream implementations.

## Domain and low-level boundary
Entities/tables to reconcile: Assignment; Recipient; PrivateDraft; FileAssetVersion; SubmissionAttempt; CommandReceipt.
Application ports: ListOwnAssignments / SavePrivateDraft / SubmitAssignment / GetSubmissionOutcome.
Repository workflow: Follow SUBMISSION_LLD.md transactions and DB_CONTRACT_PROPOSAL.md composite joins. Same intent and fingerprint returns one receipt; accepted text/file versions are immutable. Current policy rechecked on consumption.
Prerequisite: Teacher assignment publication/review/return contracts; trusted upload/scan pipeline; exact shared lock order; live authorization and restricted database role.

## Permission and transport
Authenticate server principal; derive current verified student enrollment. Check released module, institution entitlement, branch enablement, capability and object/audience scope on every read, command, status and download. Route/form identifiers are references only. Do not rely on client visibility or caller-settable tenant GUCs. HTTP DTOs cannot contain private teacher/guardian/peer data.

Use domain values for IDs, versions, publication state and school time. Commands validate before mutation, follow shared lock order, commit evidence atomically and return typed outcomes. Exact replay must reauthorize reads and return the same owner result. Do not hold DB locks over external provider I/O. Query DTOs are bounded/paginated.

## Shared failure states
Loading, legitimate empty state, recoverable request failure, session expiry, revoked access, version conflict and module unavailable. For mutating journeys, distinguish definitive rejection from transport uncertainty and preserve the intent. Full-page errors should not silently clear unsaved work. Every confirm/dialog action is keyboard accessible and has a safe cancellation path.

## STW-10 — Find and organize assignments
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Locate work by subject, status and deadline.
1. **Choose search attribute** — Default Assignment name; Enter applies search.
2. **Refine results** — Fluid multiselect filters and a separate Sort drawer; Cancel does not apply changes.
3. **Outcome:** Stable, scoped results with clear status.

**Permission/invariant:** Draft, Submitted, Returned, Missing and Excused are distinct; due date alone cannot mean failed.
**Failure/recovery:** No results offers clear filter removal; loading does not erase a changed draft.
**Persistence/data:** Published Assignment + recipient + own draft/attempt summary.
**Join/write contract:** Follow SUBMISSION_LLD.md transactions and DB_CONTRACT_PROPOSAL.md composite joins. Same intent and fingerprint returns one receipt; accepted text/file versions are immutable. Current policy rechecked on consumption.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-11 — Understand an assignment
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Know what is required before starting.
1. **Read requirements** — Show instructions, teacher, subject, due time/timezone, submission modes and published rubric.
2. **Choose action** — Start/resume draft or open the exact submitted attempt.
3. **Outcome:** Requirements and next action are clear.

**Permission/invariant:** Policy revision is visible and rechecked on submission.
**Failure/recovery:** Withdrawn/unpublished assignment blocks new writes and links to school help.
**Persistence/data:** Assignment published version + audience + SubmissionPolicy + criteria.
**Join/write contract:** Follow SUBMISSION_LLD.md transactions and DB_CONTRACT_PROPOSAL.md composite joins. Same intent and fingerprint returns one receipt; accepted text/file versions are immutable. Current policy rechecked on consumption.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-12 — Open learning resources
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Read authorized material safely.
1. **Choose resource** — Show title, type and size before download.
2. **Open or download** — Reauthorize resource access; use short-lived scoped links only in implementation.
3. **Outcome:** Permitted resource delivered.

**Permission/invariant:** No arbitrary URL fetching; no unscanned/private resource exposure.
**Failure/recovery:** Expired download retries through authorization, not reuse of a permanent object URL.
**Persistence/data:** Learning resource link + file asset scan state + owner authorization.
**Join/write contract:** Follow SUBMISSION_LLD.md transactions and DB_CONTRACT_PROPOSAL.md composite joins. Same intent and fingerprint returns one receipt; accepted text/file versions are immutable. Current policy rechecked on consumption.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-13 — Save and resume my draft
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Keep unfinished work without submitting it.
1. **Write response** — Type answer and attach supported work; label Unsaved changes.
2. **Save draft** — Save against expected draft version; show acknowledged saved time.
3. **Outcome:** Private draft saved, still not submitted.

**Permission/invariant:** Draft belongs to student and assignment; teachers/guardians see no content by default.
**Failure/recovery:** Conflict offers comparison/reload without silently overwriting either version.
**Persistence/data:** AssignmentDraft keyed student/assignment; optimistic version; attachment references.
**Join/write contract:** Follow SUBMISSION_LLD.md transactions and DB_CONTRACT_PROPOSAL.md composite joins. Same intent and fingerprint returns one receipt; accepted text/file versions are immutable. Current policy rechecked on consumption.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-14 — Attach and check a file
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Include valid work with clear readiness.
1. **Choose file** — Show configured type, size and count limits before selection.
2. **Wait for checks** — Show upload/check/ready/blocked separately; retry only failed upload.
3. **Outcome:** Clean, student-owned attachment ready for review.

**Permission/invariant:** Uploading is not submitted; only clean same-draft assets can enter an attempt.
**Failure/recovery:** Offline, oversized, unsupported, blocked and expired uploads have distinct recovery.
**Persistence/data:** UploadSession, quarantined FileAsset, scan verdict and DraftAttachment.
**Join/write contract:** Follow SUBMISSION_LLD.md transactions and DB_CONTRACT_PROPOSAL.md composite joins. Same intent and fingerprint returns one receipt; accepted text/file versions are immutable. Current policy rechecked on consumption.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-15 — Review and submit work
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Make one deliberate, confirmed submission.
1. **Review work** — Show assignment revision, answer, ready files, effective due date and late status.
2. **Submit assignment** — Recheck current rights, assignment policy and draft version; commit one attempt and receipt.
3. **Outcome:** Immutable attempt reference, number and accepted time.

**Permission/invariant:** No implicit submit on upload/save; no mutable file reference that changes an accepted attempt.
**Failure/recovery:** Validation preserves draft; concurrent policy/draft change requires renewed review.
**Persistence/data:** SubmissionAttempt snapshot + attachment snapshots + command receipt + safe audit.
**Join/write contract:** Follow SUBMISSION_LLD.md transactions and DB_CONTRACT_PROPOSAL.md composite joins. Same intent and fingerprint returns one receipt; accepted text/file versions are immutable. Current policy rechecked on consumption.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-16 — Recover an uncertain submission
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Find out whether the school accepted the work.
1. **See confirmation pending** — Preserve unchanged intent; disable a new submit or context switch.
2. **Check status** — Reauthorize and query same command key before retry; exact replay returns the same receipt.
3. **Outcome:** Existing accepted receipt or verified safe retry.

**Permission/invariant:** A timeout is not a failure; never create a second attempt speculatively.
**Failure/recovery:** Still unknown stays pending with help/reference; no false success.
**Persistence/data:** Scoped CommandReceipt + submission attempt; immutable payload fingerprint.
**Join/write contract:** Follow SUBMISSION_LLD.md transactions and DB_CONTRACT_PROPOSAL.md composite joins. Same intent and fingerprint returns one receipt; accepted text/file versions are immutable. Current policy rechecked on consumption.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-17 — Submit under late or extended rules
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Understand whether work can still be accepted.
1. **Read effective deadline** — Show school-local deadline, explicit extension if granted and late policy.
2. **Review allowed action** — Allow late submission only under current policy; otherwise offer extension/support request.
3. **Outcome:** Accepted on-time/late attempt or a clear closed state.

**Permission/invariant:** Server clock and approved per-student extension decide lateness; requesting one never grants it.
**Failure/recovery:** A deadline crossing during review forces policy re-evaluation, preserving work.
**Persistence/data:** Assignment policy + approved extension + server received_at and effective_due_at.
**Join/write contract:** Follow SUBMISSION_LLD.md transactions and DB_CONTRACT_PROPOSAL.md composite joins. Same intent and fingerprint returns one receipt; accepted text/file versions are immutable. Current policy rechecked on consumption.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-18 — Revise and resubmit returned work
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Respond to teacher feedback without losing prior evidence.
1. **Read returned feedback** — Show exact attempt and whether revisions are allowed.
2. **Create revised draft** — Create from an explicit prior attempt; submit a new numbered immutable attempt.
3. **Outcome:** New attempt; previous submission and feedback remain traceable.

**Permission/invariant:** Feedback return does not itself reopen submission; policy/teacher permission must allow it.
**Failure/recovery:** Closed window or revoked permission blocks new attempt without altering old evidence.
**Persistence/data:** Attempt revision chain + reopened policy + draft + feedback version.
**Join/write contract:** Follow SUBMISSION_LLD.md transactions and DB_CONTRACT_PROPOSAL.md composite joins. Same intent and fingerprint returns one receipt; accepted text/file versions are immutable. Current policy rechecked on consumption.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-19 — Withdraw a submission when allowed
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Correct an accidental submission through a controlled transition.
1. **Review eligibility** — Show withdraw only when policy permits and review has not locked it.
2. **Confirm withdrawal** — Recheck expected attempt version; retain evidence and explicitly offer a new draft.
3. **Outcome:** Withdrawn attempt with audit trail.

**Permission/invariant:** Withdrawal does not delete evidence, reset original accepted time or silently reopen a deadline.
**Failure/recovery:** If teacher review began concurrently, deny withdrawal and offer a teacher query.
**Persistence/data:** Attempt lifecycle/version + teacher review lock + withdrawal event.
**Join/write contract:** Follow SUBMISSION_LLD.md transactions and DB_CONTRACT_PROPOSAL.md composite joins. Same intent and fingerprint returns one receipt; accepted text/file versions are immutable. Current policy rechecked on consumption.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-20 — Request more time
Phase: 3. Explicit scope extension; allocate/approve before coding.

**Intent:** Ask for an extension without fabricating approval.
1. **Describe request** — Choose assignment, requested deadline and brief reason; avoid compulsory sensitive detail.
2. **Submit request** — Show requested, not approved; retain current deadline until an authorized decision.
3. **Outcome:** Pending extension request and trackable reference.

**Permission/invariant:** Student cannot approve own extension; a support request is not an entitlement.
**Failure/recovery:** Duplicates link existing pending request; unavailable category routes to school help.
**Persistence/data:** Owned request + Assignment reference; authorized extension decision.
**Join/write contract:** Follow SUBMISSION_LLD.md transactions and DB_CONTRACT_PROPOSAL.md composite joins. Same intent and fingerprint returns one receipt; accepted text/file versions are immutable. Current policy rechecked on consumption.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-21 — Continue safely on a poor connection
Phase: 3. Explicit scope extension; allocate/approve before coding.

**Intent:** Avoid losing work or duplicating submission.
1. **Recognize connection state** — Show unsaved, locally held and server-saved states distinctly.
2. **Reconnect and reconcile** — Reauthorize, reconcile draft version and check uncertain command before submitting.
3. **Outcome:** Work recovered only after a verified state check.

**Permission/invariant:** No silent background submission; persistent device draft is opt-in and separately threat-modeled.
**Failure/recovery:** Shared-device default keeps no sensitive persistent cache; do not promise recovery after tab closure.
**Persistence/data:** Memory editor + optional approved device store; draft version; command status.
**Join/write contract:** Follow SUBMISSION_LLD.md transactions and DB_CONTRACT_PROPOSAL.md composite joins. Same intent and fingerprint returns one receipt; accepted text/file versions are immutable. Current policy rechecked on consumption.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.
