# SA-09–SA-12 approved-composition readiness — 11 October 2026

This is the bounded design-readiness record for the four already implemented Academics capability families. It does not invalidate their existing functional/security evidence and does not claim approved-reference fidelity.

| Workflow | Existing verified operations | Exact composition contract still required | Why implementation cannot safely infer it |
|---|---|---|---|
| SA-09 | Scoped year creation; immutable calendar publication/evaluation; open/close; conflict and stale-version checks | Grammar, normalization and row-level errors for **Holiday dates and descriptions**; one transaction/idempotency contract for the reference outcome “valid year and immutable calendar revision” | The live calendar API accepts structured exceptions. Treating arbitrary textarea text as dates would invent product syntax; sequential create/publish can leave an unintended draft year after a calendar failure. |
| SA-10 | Grade/Subject/Section creation, scoped duplicate constraints, dependency counts and prospective retirement | How the wizard selects the Section’s required academic year and optional campus; whether final confirmation atomically creates both Section and Subject | Section persistence requires `yearId` and accepts `campusId`; neither is present in the approved card. Two independent commands can produce a partial outcome. |
| SA-11 | Offering creation, eligible-teacher projection, dated assignment with overlap/concurrency guards | Source/derivation and uniqueness rule for required offering code; atomic create-and-assign versus a specified recoverable two-command protocol | The reference has no offering-code field although the accepted owner command requires it. Silent code generation would be a new product rule. |
| SA-12 | Immutable calendar revision publication and guarded assignment end with future-session impact checks | Exact target selector (calendar or assignment), calendar revision values when that option is chosen, and the source/format/validation of **Reviewed impact reference** | A free-text reference cannot establish which stored object or conflict set the administrator reviewed. The provided fields are insufficient to execute either owner command. |

Smallest decisions needed:

1. SA-09: approve a machine-readable holiday entry format (recommended: one `YYYY-MM-DD | description` per line with line-numbered validation) and an atomic `CreateYearWithCalendar` command.
2. SA-10: add real authorized Academic year and optional Campus selectors; approve one atomic `CreateClassStructure` command for Section plus Subject, or change the outcome to two separately receipted steps.
3. SA-11: expose an Offering code field, or approve a deterministic branch/year-scoped code derivation; then specify whether offering and initial assignment commit atomically.
4. SA-12: add a real target selector and option-specific calendar/assignment fields; define the impact reference as a server-issued opaque preview token rather than administrator free text.

Recommended options preserve scoped identities, explicit idempotency, immutable calendar history and Attendance conflict guards. No code, schema, database row or migration changed in this readiness checkpoint.
