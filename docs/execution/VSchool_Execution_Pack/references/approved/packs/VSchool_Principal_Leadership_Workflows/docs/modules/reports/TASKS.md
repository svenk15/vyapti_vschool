# Reports & accountability — TASKS

Proposed demo-able slices. Map LEA-* workflow IDs to actual task IDs and owner prerequisites. Do not override real dependency/review gates. Each slice extends shared components and fictional idempotent pnpm demo:seed; no teardown work now.

## [ ] LEA-39 — Drill into a metric and export permitted evidence
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 1. Scope extension must be allocated before coding.
Prerequisites: Versioned metric definition, bounded query and distinct export permission.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Report job/download audit; no source-record mutation.
4. Enforce invariant: Aggregate access does not imply pupil-level rows or unrestricted bulk export.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Report total agrees with the same scoped evidence snapshot.
Recovery acceptance: Large export: bounded asynchronous job with explicit readiness, reauthorization and expiry if supported. Suppressed small groups must not be reconstructible via totals or overlapping filter exports.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-40 — Compare branches responsibly
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Owner release and exact capability contract must exist.
Prerequisites: Comparable definitions, time basis, granted branch set and suppression rules.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: None, unless an explicitly authorized report export is requested.
4. Enforce invariant: Cross-branch analytics, branch detail and pupil evidence are separate capabilities.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Weighted total uses underlying counts; unavailable branch is never treated as zero.
Recovery acceptance: Different calendars or missing data: show Not comparable rather than rank. Partial branch grant loss: recompute safely without revealing withheld totals.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-41 — Prepare a leadership review brief
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Owner release and exact capability contract must exist.
Prerequisites: Approved audience and access-filtered report sources.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Report draft/version; approved sharing command only on explicit confirmation.
4. Enforce invariant: Brief generation and external sharing are separate grants.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Reviewer can trace each number to the same permitted snapshot.
Recovery acceptance: Missing baseline: no invented trend. A restricted source cannot be exposed through an apparently harmless summary.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-42 — Review decision and follow-up history
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Owner release and exact capability contract must exist.
Prerequisites: Purpose-specific audit/event-read grant.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Optional review finding, never audit rewrite.
4. Enforce invariant: General audit excludes raw messages, answers, health detail, tokens and file contents.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Closed/reopened/reassigned history cannot be overwritten to erase responsibility.
Recovery acceptance: Actor later inactive: historical attribution retained safely. Source unavailable/restricted: audit shows safe reference, not leaked contents.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.
