# Assignments & submissions — TASKS
Proposed tasks; reconcile with the actual execution index. None is marked implemented. Read DESIGN.md, the current Bible/ADRs and actual schema first. Preserve existing unrelated work and dependency/human-release gates.

Owner readiness: Teacher assignment publication/review/return contracts; trusted upload/scan pipeline; exact shared lock order; live authorization and restricted database role.

## Definition of done per slice
- Owner LLD and affected physical table contracts are reconciled before code.
- Shared tokens/components used; parity with desktop/mobile reference reviewed.
- Server authorization, scope and state/version invariants enforced and meaningful negative tests pass.
- Fictional, incremental, idempotent data extends the existing pnpm demo:seed command. Preserve existing testing records/credentials; do not introduce teardown now.
- Focused tests plus required repository gates pass. No redundant blanket reruns without a changed risk.
- Demo server starts from the tested source; record URL/route, commit, commands, seed identifiers and evidence.
- Update per-module CURRENT_STATE.md with what is implemented, verified, pending and next eligible task; never infer human acceptance from automated checks.

## [ ] STW-10 — Find and organize assignments
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-04; Learning + Files owner contracts. 
**Deliverable:** Locate work by subject, status and deadline.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Draft, Submitted, Returned, Missing and Excused are distinct; due date alone cannot mean failed.
4. Implement failure/recovery: No results offers clear filter removal; loading does not erase a changed draft.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Published Assignment + recipient + own draft/attempt summary. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Default Assignment name; Enter applies search. Then Fluid multiselect filters and a separate Sort drawer; Cancel does not apply changes. Verify: Stable, scoped results with clear status. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-11 — Understand an assignment
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-10; Learning + Files owner contracts. 
**Deliverable:** Know what is required before starting.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Policy revision is visible and rechecked on submission.
4. Implement failure/recovery: Withdrawn/unpublished assignment blocks new writes and links to school help.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Assignment published version + audience + SubmissionPolicy + criteria. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show instructions, teacher, subject, due time/timezone, submission modes and published rubric. Then Start/resume draft or open the exact submitted attempt. Verify: Requirements and next action are clear. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-12 — Open learning resources
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-11; Learning + Files owner contracts. 
**Deliverable:** Read authorized material safely.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No arbitrary URL fetching; no unscanned/private resource exposure.
4. Implement failure/recovery: Expired download retries through authorization, not reuse of a permanent object URL.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Learning resource link + file asset scan state + owner authorization. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show title, type and size before download. Then Reauthorize resource access; use short-lived scoped links only in implementation. Verify: Permitted resource delivered. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-13 — Save and resume my draft
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-11; Learning + Files owner contracts. 
**Deliverable:** Keep unfinished work without submitting it.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Draft belongs to student and assignment; teachers/guardians see no content by default.
4. Implement failure/recovery: Conflict offers comparison/reload without silently overwriting either version.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** AssignmentDraft keyed student/assignment; optimistic version; attachment references. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Type answer and attach supported work; label Unsaved changes. Then Save against expected draft version; show acknowledged saved time. Verify: Private draft saved, still not submitted. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-14 — Attach and check a file
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-13; Learning + Files owner contracts. 
**Deliverable:** Include valid work with clear readiness.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Uploading is not submitted; only clean same-draft assets can enter an attempt.
4. Implement failure/recovery: Offline, oversized, unsupported, blocked and expired uploads have distinct recovery.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** UploadSession, quarantined FileAsset, scan verdict and DraftAttachment. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show configured type, size and count limits before selection. Then Show upload/check/ready/blocked separately; retry only failed upload. Verify: Clean, student-owned attachment ready for review. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-15 — Review and submit work
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-13; Learning + Files owner contracts. 
**Deliverable:** Make one deliberate, confirmed submission.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No implicit submit on upload/save; no mutable file reference that changes an accepted attempt.
4. Implement failure/recovery: Validation preserves draft; concurrent policy/draft change requires renewed review.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** SubmissionAttempt snapshot + attachment snapshots + command receipt + safe audit. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show assignment revision, answer, ready files, effective due date and late status. Then Recheck current rights, assignment policy and draft version; commit one attempt and receipt. Verify: Immutable attempt reference, number and accepted time. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-16 — Recover an uncertain submission
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-15; Learning + Files owner contracts. 
**Deliverable:** Find out whether the school accepted the work.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: A timeout is not a failure; never create a second attempt speculatively.
4. Implement failure/recovery: Still unknown stays pending with help/reference; no false success.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Scoped CommandReceipt + submission attempt; immutable payload fingerprint. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Preserve unchanged intent; disable a new submit or context switch. Then Reauthorize and query same command key before retry; exact replay returns the same receipt. Verify: Existing accepted receipt or verified safe retry. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-17 — Submit under late or extended rules
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-15; Learning + Files owner contracts. 
**Deliverable:** Understand whether work can still be accepted.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Server clock and approved per-student extension decide lateness; requesting one never grants it.
4. Implement failure/recovery: A deadline crossing during review forces policy re-evaluation, preserving work.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Assignment policy + approved extension + server received_at and effective_due_at. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show school-local deadline, explicit extension if granted and late policy. Then Allow late submission only under current policy; otherwise offer extension/support request. Verify: Accepted on-time/late attempt or a clear closed state. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-18 — Revise and resubmit returned work
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-15, STW-22; Learning + Files owner contracts. 
**Deliverable:** Respond to teacher feedback without losing prior evidence.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Feedback return does not itself reopen submission; policy/teacher permission must allow it.
4. Implement failure/recovery: Closed window or revoked permission blocks new attempt without altering old evidence.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Attempt revision chain + reopened policy + draft + feedback version. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show exact attempt and whether revisions are allowed. Then Create from an explicit prior attempt; submit a new numbered immutable attempt. Verify: New attempt; previous submission and feedback remain traceable. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-19 — Withdraw a submission when allowed
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-15; Learning + Files owner contracts. 
**Deliverable:** Correct an accidental submission through a controlled transition.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Withdrawal does not delete evidence, reset original accepted time or silently reopen a deadline.
4. Implement failure/recovery: If teacher review began concurrently, deny withdrawal and offer a teacher query.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Attempt lifecycle/version + teacher review lock + withdrawal event. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show withdraw only when policy permits and review has not locked it. Then Recheck expected attempt version; retain evidence and explicitly offer a new draft. Verify: Withdrawn attempt with audit trail. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-20 — Request more time
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-11, STW-36; Learning + Files owner contracts. Explicit scope allocation required.
**Deliverable:** Ask for an extension without fabricating approval.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Student cannot approve own extension; a support request is not an entitlement.
4. Implement failure/recovery: Duplicates link existing pending request; unavailable category routes to school help.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Owned request + Assignment reference; authorized extension decision. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Choose assignment, requested deadline and brief reason; avoid compulsory sensitive detail. Then Show requested, not approved; retain current deadline until an authorized decision. Verify: Pending extension request and trackable reference. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-21 — Continue safely on a poor connection
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-13, STW-16; Learning + Files owner contracts. Explicit scope allocation required.
**Deliverable:** Avoid losing work or duplicating submission.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: No silent background submission; persistent device draft is opt-in and separately threat-modeled.
4. Implement failure/recovery: Shared-device default keeps no sensitive persistent cache; do not promise recovery after tab closure.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Memory editor + optional approved device store; draft version; command status. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Show unsaved, locally held and server-saved states distinctly. Then Reauthorize, reconcile draft version and check uncertain command before submitting. Verify: Work recovered only after a verified state check. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.
