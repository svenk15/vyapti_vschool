<!-- TT-01 contract -->
## TT-01 supersedes the timetable outline
For LEA-16, LEA-24, follow [Shared timetable workflows](../../timetable/WORKFLOWS.md), [physical LLD](../../timetable/LLD.md), [one task queue](../../timetable/TASKS.md) and [checkpoint](../../timetable/CURRENT_STATE.md). The timetable-specific outline below is retained as historical context; do not implement it as an independent queue. Other module workflows remain current. First release is a weekly cycle; two-week cycle remains future scope.

# Academic oversight — TASKS

Proposed demo-able slices. Map LEA-* workflow IDs to actual task IDs and owner prerequisites. Do not override real dependency/review gates. Each slice extends shared components and fictional idempotent pnpm demo:seed; no teardown work now.

## [ ] LEA-16 — Review timetable conflicts and uncovered classes
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 3. Owner release and exact capability contract must exist.
Prerequisites: Published recurring timetable and coverage owner; manual attendance sessions alone are insufficient.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Owner-specific cover request/decision only.
4. Enforce invariant: No general timetable-edit or attendance-mark authority from a principal role.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Assigned substitute cannot clash with another occurrence; cancelled sessions remain traceable.
Recovery acceptance: Concurrent timetable edit requires refreshed review. No eligible cover: show unresolved status and escalation, not an invented allocation.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-17 — Review assignment completion with the right denominator
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 3. Owner release and exact capability contract must exist.
Prerequisites: Learning oversight grant and published assignment audience/extension rules.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Optional internal coordination action.
4. Enforce invariant: Default leadership oversight does not expose private drafts or all student response content.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Extended/not-yet-due and excused pairs follow the documented denominator policy.
Recovery acceptance: Unavailable submission data is not non-completion. A second attempt does not count as a second pupil.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-18 — Review feedback awaiting return
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 3. Owner release and exact capability contract must exist.
Prerequisites: Learning oversight and an approved turnaround definition; teacher draft privacy preserved.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Optional coordination record; no teacher feedback edits.
4. Enforce invariant: Feedback oversight is separate from permission to read full learner work.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Teacher Save private draft does not clear Awaiting return.
Recovery acceptance: Returned then withdrawn feedback is shown under owner policy, not counted as permanently delivered. Incomplete timestamps block unsupported average.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-19 — Coordinate an evidence-based learning concern
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 3. Scope extension must be allocated before coding.
Prerequisites: Approved learning-support purpose; school process and authorized coordinator.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Restricted educational follow-up only; separate specialist referral if needed.
4. Enforce invariant: No automatic mental-health inference, grading change or disciplinary action.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: General school dashboards never reveal confidential support narrative.
Recovery acceptance: Sensitive care concern routes to the specialist workspace. No access to evidence: assign authorized reviewer without exposing it.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-20 — Check assessment and report readiness
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 4. Owner release and exact capability contract must exist.
Prerequisites: Assessment readiness projection and explicit branch oversight grant.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Coordination actions only unless separately delegated.
4. Enforce invariant: Leadership read does not imply mark entry, moderation approval or publication.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: 100% readiness cannot be displayed while a mandatory outcome is unresolved.
Recovery acceptance: Absent, Exempt and Not entered cannot collapse into numeric zero. Revised scheme invalidates stale readiness snapshot.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-21 — Perform an explicitly delegated moderation decision
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 4. Owner release and exact capability contract must exist.
Prerequisites: Distinct moderation grant; conflict-of-interest rule and current evidence version.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Assessment-owned moderation command, receipt and audit.
4. Enforce invariant: Moderation and result publication are separate grants.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Decision inbox cannot bypass the assessment owner’s guards.
Recovery acceptance: Changed marks or assignment after preview: conflict, re-review. Unknown response: status check before a new intent.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-22 — Authorize or hand off report publication
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 4. Owner release and exact capability contract must exist.
Prerequisites: Explicit publication delegation, audience and required separation of duties.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Assessment publication command and approved communication handoff.
4. Enforce invariant: Principal role alone cannot publish or access all guardian recipients.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Stale or unapproved report cannot be published.
Recovery acceptance: Duplicate publish returns same result. Post-publication correction uses new revision/withdrawal policy, not silent overwrite.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.
