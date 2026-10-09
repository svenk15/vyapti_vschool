# Attendance oversight — TASKS

Proposed demo-able slices. Map LEA-* workflow IDs to actual task IDs and owner prerequisites. Do not override real dependency/review gates. Each slice extends shared components and fictional idempotent pnpm demo:seed; no teardown work now.

## [ ] LEA-08 — Inspect register submission coverage
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 1. Owner release and exact capability contract must exist.
Prerequisites: Existing exact-session attendance contract and leadership read capability.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: None.
4. Enforce invariant: Read-only principal oversight does not grant attendance.mark or attendance.correct.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Received + awaiting = due for the same cutoff; each register counted once.
Recovery acceptance: No registers due: show No registers due yet, not 100%. Cancelled or future-not-due session: excluded from due denominator with explicit reason.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-09 — Create an accountable missing-register follow-up
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Scope extension must be allocated before coding.
Prerequisites: Fresh missing-session evidence, internal follow-up capability and eligible assignee.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Coordination follow-up, intent receipt and minimal audit; optional approved delivery event.
4. Enforce invariant: Assigning a follow-up grants no attendance marking, correction or new student data access.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Duplicate click makes one follow-up; session submission remains untouched.
Recovery acceptance: Teacher submitted before confirmation: do not create obsolete work; show current receipt. Existing open follow-up: open it or explicitly request authorized reassignment. Network uncertainty: check same intent before retry.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-10 — Follow up multiple missing registers safely
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Scope extension must be allocated before coding.
Prerequisites: All selected rows reauthorized; bulk capability explicitly enabled; single-item workflow proven.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: One coordination command receipt per session, plus non-sensitive batch summary.
4. Enforce invariant: Bulk authority cannot exceed single-item authority. No bulk attendance marking/correction.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: 3 selected with 1 resolved and 1 denied yields 1 new, 1 skipped, 1 denied; no false batch-success label.
Recovery acceptance: Permission/source changes after preview: that item is denied/skipped without rollback of unrelated successes. Filter change does not silently change confirmed payload.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-11 — Verify, close or reopen a follow-up
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Scope extension must be allocated before coding.
Prerequisites: Current follow-up scope; explicit close/reopen capability; fresh evidence read.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Versioned closure/reopen event and audit; no Attendance mutation.
4. Enforce invariant: No closure from a broad role alone; no privilege escalation through evidence links.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Teacher submission changes source to received; follow-up closes only under documented verification rule.
Recovery acceptance: Source still missing: cannot verify closure merely from assignee text. Stale follow-up version: show new owner/status before deciding. Source inaccessible: block verification and route to authorized verifier.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-12 — Review factual pupil attendance patterns
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Owner release and exact capability contract must exist.
Prerequisites: Explicit pupil-level attendance purpose; defined date window and outcome rules.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Only an approved coordination/support request if confirmed.
4. Enforce invariant: Attendance purpose is not health, safeguarding or unrestricted family access.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Same pupil with multiple absent sessions is counted as one pupil only when metric explicitly says unique pupils.
Recovery acceptance: Incomplete registers: disclose missing coverage; do not manufacture absence. Restriction on pupil detail: show authorized aggregate or deny; do not expose identity in export.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-13 — Review an absence explanation
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Owner release and exact capability contract must exist.
Prerequisites: Verified guardian-origin request and an explicit school-review capability.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Request disposition and permitted message; correction is separate.
4. Enforce invariant: Principal status alone does not grant family/care detail or correction authority.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Approving an explanation does not mutate an attendance mark.
Recovery acceptance: Restricted relationship changes: recheck before reply. Principal not delegated: view only permitted routing state, not explanation body.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-14 — Review an attendance correction request
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Owner release and exact capability contract must exist.
Prerequisites: Correction capability separately granted to actual decision maker; source version available.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Owner correction command plus audit/receipt, if explicitly permitted.
4. Enforce invariant: Coordination does not confer correction permission; no principal mark-all shortcut.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Concurrent correction does not overwrite a newer revision.
Recovery acceptance: Submitted record changed during review: re-read before correction. Insufficient evidence: request clarification or reject, preserving history.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-15 — Resolve an incorrect or duplicate scheduled session
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 1. Owner release and exact capability contract must exist.
Prerequisites: Source session read grant; administrative lifecycle command owned elsewhere.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Request only from leadership; source change through owning administrator.
4. Enforce invariant: Principal can inspect/route only within separate capabilities.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Removing a dashboard exception cannot erase a submitted attendance record.
Recovery acceptance: Already submitted: cannot casually cancel/delete to improve coverage. Related reports changed: surface revision rather than silently alter prior exported snapshot.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.
