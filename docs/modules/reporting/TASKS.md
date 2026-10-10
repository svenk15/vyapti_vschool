# Attendance review, completeness and exports — execution tasks

Phase 1. Each task is a vertical slice with a running demo. Follow the matching named flow in DESIGN.md and shared agent runbook. No task completion is claimed by this document.

## SA-COMP-01 — Derive administrator setup readiness and daily exceptions

Workflows: SA-04, SA-05. Depends on the existing verified Access, Tenancy, Academics, People, Students, Imports and Attendance owner slices.

Outcome: the School Administrator overview and setup pages show one consistent, authorized snapshot of enabled setup prerequisites and actionable attendance/import/staff exceptions, with source-workspace links and distinct empty/failure states. No source fact is mutated.

Acceptance: live `school.manage` and current branch scope are rechecked; ineffective modules are omitted; counts use complete scoped queries rather than paginated results; absent context, revoked access and cross-branch access fail closed; PostgreSQL and browser evidence passes; seed data yields a coherent populated demonstration. Human review remains PENDING.

## RPT-01 — Review school attendance with explainable totals

Depends on: ATT-03

Design: [flow RPT-01](DESIGN.md). Scope and API: GET /api/v1/reports/attendance; GET /api/v1/reports/attendance/sessions.

### Implementation instructions

1. Resolve current actor and scoped filter references; reject invalid/foreign filters before aggregation.
2. Read consistent snapshot of sessions and records; calculate expected/submitted/pending/future/cancelled counts separately.
3. Calculate P/L/A/E and rate with explicit zero denominator; no inferred absent from missing records.
4. Join readable class/subject labels and bounded drilldown list; return asOf and calculation explanation.
5. Render filters/cards/list and links to existing session history.

Files: extend `backend/modules/reporting/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/reporting`, `test/functional/reporting` and `test/e2e/reporting` as the suite grows.

### Acceptance and test strategy

- Unit / application: 2 present +1 late+1 absent+1 excused yields75%; all excused→unavailable; pending distinct.
- Real PostgreSQL: Cross-school join denial; REPEATABLE READ consistency while correction commits.
- Browser: Filter, inspect metrics, drill down with same range; compare to hand-counted fixture.
- Failure contract: Unauthenticated→401; teacher/current permission denial→403; foreign scoped filter→404; missing/reversed/>31-day range or invalid cursor→422; inactive entitlement/branch activation/release denied; database failure distinct from empty. Filters remain available to correct invalid input.
- Required DB effect: Read-only; no derived total writes. Operational metrics may be non-sensitive, no product analytics dependency.
- Database evidence: Use real PostgreSQL for current scoped joins and the correction/report REPEATABLE READ race. Capture the scoped offering/date plan with `EXPLAIN (ANALYZE, BUFFERS)`; no migration or table-registry change is expected.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Open a day with submitted and pending sessions; explain numerator/denominator; drill into an absence; correct it and refresh to see both history and recalculated totals.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.

## Experience overlay consumption

EX-12 adopts the existing attendance overview, server-filtered detail and authorized CSV export. Preserve owner denominator/as-of semantics, formula-safe export and ExportRun audit; never compute school totals from one cursor page or export rendered DOM rows.

## RPT-02 — Export a scoped report and review audit history

Depends on: RPT-01, ATT-04

Design: [flow RPT-02](DESIGN.md). Scope and API: GET /api/v1/reports/attendance.csv; GET /api/v1/audit?module=attendance&resourceId=.

### Implementation instructions

1. Authorize current actor/filter scope and take consistent report snapshot.
2. Refuse >10,000rows or >31days; generate UTF-8 CSV with quoted cells and formula-safe text.
3. Recheck access immediately before streaming and record ExportRun metadata plus export audit (no student payload).
4. Return no-store attachment; history query filters scope/module/resource and paginates occurredAt/id.
5. Present export result and immutable correction/cancellation timeline; label generated/downloaded distinction accurately.

Files: extend `backend/modules/reporting/domain`, `application`, `contracts` and `infrastructure`; wire in `backend/composition`; add thin routes/screens named in DESIGN; add reviewed `prisma/migrations` only for listed writes. For cross-owner work, call enlisted public facades and change those owners through their contracts. Tests belong in `test/unit/reporting`, `test/functional/reporting` and `test/e2e/reporting` as the suite grows.

### Acceptance and test strategy

- Unit / application: CSV quoting/BOM policy and dangerous prefix neutralization; no raw staff notes.
- Real PostgreSQL: Scoped filter/session/roster/record joins; current membership, `attendance.export` and `attendance.read_school` rechecks; cross-school and teacher denial; ExportRun and safe Platform audit atomicity/rollback; event audit module/resource filters; cursor pagination; bounded-row refusal; FAILED metadata after authorized generation failure.
- Browser: Export matches visible selected range; spreadsheet-safe synthetic names; history shows reason/old/new.
- Failure contract: Too broad→422; access revoked before stream→403; failure→FAILED metadata; replay export is a new authorized read, not a stale download permission.
- Required DB effect: forward migration for `vs_reporting_export_run`, scoped export audit in existing `vs_platform_audit_entry`; attendance/revision/history are read-only. Export audit resource references the ExportRun UUID and contains only safe filters/count/hash metadata. Verify foreign keys and registered Path A classification; no CSV bytes or pupil data in export metadata/audit.

Design readiness: [RPT-02 design note](DESIGN.md#rpt-02--export-a-scoped-report-and-review-audit-history) resolves shared audit ownership through the Platform writer port and uses Attendance's existing scoped revision-history facade. No human acceptance dependency blocks implementation.

Run `pnpm check`, applicable `pnpm test:functional`, `pnpm test:e2e`, and `pnpm build`. Extend test filters when the suite grows; do not skip the risk named above. Write actual commands/results, source revision and limitations in CURRENT_STATE.md. No acceptance from an unexecuted test description.

### Demo and checkpoint

Filter one section/day, download CSV and compare row counts/statuses with screen; inspect correction audit; attempt another-school ID and verify no data is returned.

Start and verify the server, give the user the URL and this script, record human review as PENDING, then request review. Mark VERIFIED only with passing automated evidence and a stable demo. Preserve feedback and exact build identity; failed feedback takes priority over dependent tasks.
