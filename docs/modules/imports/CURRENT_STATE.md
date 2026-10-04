# Previewed, resumable student roster import — current state

Last updated: 2026-10-03. Fresh baseline; no imported task completion. Design revision 1 is present; local owner acceptance is pending. No active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| IMP-01 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |
| IMP-02 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |
| IMP-03 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |

## Current checkpoint

**Design readiness (4 October 2026):** IMP-01 LLD/task now align on Imports-only preview storage, immutable source/hash/revision, 2 MiB/retention bounds, exact source mapping, no student writes, current scope authorization, failure states and TEN-ADR-006 migration requirements. No implementation started. Dependency gate: STU-02.

No module business code or tables are implemented. DESIGN.md and TASKS.md are specifications only.

## Next action

Wait for dependencies in EXECUTION_INDEX.md, then inspect and execute the first unstarted task. Resolve any new contradiction in the design before coding.

## Pending decisions / limitations

No product completion is assumed. Pilot deployment/provider, staff activation delivery procedure, backup targets and school retention requirements must be resolved in FND-02 before real-data release. Module-specific risks are listed in DESIGN.md.

## Evidence history

Append dated task records here using docs/AGENT_RUNBOOK.md. Include source commit, changed files, schema version, commands/results, demo URL, manual feedback and next action. Do not store credentials or real pupil data.
