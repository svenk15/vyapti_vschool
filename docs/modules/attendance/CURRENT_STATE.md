# Session attendance and accountable corrections — current state

Last updated: 2026-10-03. Fresh baseline; no imported task completion. Design revision 1 is present; local owner acceptance is pending. No active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| ATT-01 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |
| ATT-02 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |
| ATT-03 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |
| ATT-04 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |

## Current checkpoint

**Design readiness (4 October 2026):** ATT-01 LLD/task align ownership, scoped session constraints/indexes, guarded schedule/calendar serialization, teacher-time clash rejection, current authorization, retry/failure behavior and Path A metadata. Dependency snapshot: ACA-03 IN_PROGRESS/NOT_REQUESTED; STU-02 NOT_STARTED. Current task table is authoritative.

No attendance workflow or tables are implemented. IAM-02 adds the owner-scoped ScheduledSessionQuery read contract and Prisma adapter for timezone protection. Absence of the not-yet-migrated session table yields false; database errors fail closed. ATT tasks remain NOT_STARTED.

## Next action

Wait for dependencies in EXECUTION_INDEX.md, then inspect and execute the first unstarted task. Resolve any new contradiction in the design before coding.

## Pending decisions / limitations

No product completion is assumed. Pilot deployment/provider, staff activation delivery procedure, backup targets and school retention requirements must be resolved in FND-02 before real-data release. Module-specific risks are listed in DESIGN.md.

## Evidence history

Append dated task records here using docs/AGENT_RUNBOOK.md. Include source commit, changed files, schema version, commands/results, demo URL, manual feedback and next action. Do not store credentials or real pupil data.
