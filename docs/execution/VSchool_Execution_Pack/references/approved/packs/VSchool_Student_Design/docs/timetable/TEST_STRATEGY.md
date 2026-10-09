# Verification strategy

## Levels
| Layer | Verify | Avoid |
|---|---|---|
| Domain unit tests | Interval boundaries, day/period rules, teacher eligibility, revision applicability, conflict resolution, cover/restore state transitions, stable occurrence identity | Tests that merely repeat the implementation or snapshot every CSS class |
| Application tests | Current-scope and purpose rechecks; expected version/receipt semantics; owner ports; request/cover authority; safe DTO projection | Mock-only claims of PostgreSQL isolation or security |
| Real PostgreSQL functional tests | Scope-inclusive FKs, uniqueness, published interval integrity, stale updates, concurrent publication/cover/open, rollback+outbox atomicity and idempotent generation | HBase substitutes or SQLite behavior as proof for this PostgreSQL app |
| E2E | Publish → role-specific read → dated change → teacher handoff → preserved attendance; child/branch switching; failures; keyboard and mobile | Rebuilding the whole unrelated suite for every label or spacing edit |
| Release evidence | Current-source build, runtime role/RLS gate, provider behavior, restore exercise, load profile, real assistive technology where required | Claiming production readiness from fictional preview tests |

The current stack is TypeScript/Next.js/PostgreSQL. Use its existing test runner. The old request for a “JUnit strategy” maps to equivalent domain/application unit coverage here; no Java service or HBase database is introduced.

## Critical functional scenarios
1. Two teachers/rooms/classes with equal boundary times do not collide; true interval overlap is rejected across classes and multiple assignments for the same teacher person.
2. Simultaneous publish commands with different keys cannot create overlapping active revisions. Same key/same payload returns one receipt; same key/different payload is rejected.
3. Attendance open races with cover/move/cancel. Exactly one ordering wins under the existing guard; no old teacher gains a new roster after cover is committed.
4. Revoking a membership/cover/family purpose after rendering denies the next read/command. Do not trust cached UI state.
5. A weekly change preserves open/submitted session source. Removing a future slot cancels its scheduled occurrence without deleting history or changing pupil outcomes.
6. A move followed by cover preserves the moved time. Restoring a lesson rechecks conflicts. A stale cover acknowledgement cannot affect a replacement assignment.
7. Context A→B on reused connection leaves no stale tenant state, according to the actual TEN-03 implementation. Forged-scope attempts are tested under restricted runtime credentials when enforcement ships.
8. A notice recipient is resolved from current assignment/relationship and purpose, not from an old email list. Failed/unknown delivery does not change the timetable or imply acknowledgement.
9. License removal affects Timetable only, across the institution’s branches; re-adding does not implicitly activate. Operator read-only and school-admin operational grants cannot edit commercial licensing.
10. Date boundary, holidays, academic-year limits, effective midweek revision and time-zone conversion are explicit. Ambiguous/nonexistent local times must be rejected or handled by a documented policy before supporting such zones.

## Browser review coverage
Admin grid/editor/publish/recovery, cover candidates and denial, request return, mobile day selector, fluid filters and expanded sort groups, native dialog Escape/focus, teacher acknowledgement/decline, attendance demo handoff, parent purpose/child switch, student enrollment switch, principal read-only exceptions and operator license/activation preview.

Old reports in the persona packs are **baseline evidence from earlier editions**. The coordinated release's `evidence/` and each pack’s `timetable-evidence.json` identify checks run for TT-01 and the final HTML SHA. Do not reinterpret baseline counts as a rerun on this source.

## Load and query evidence for production
Use the existing target of **5,000 pupils per branch × 20 branches (100,000 pupils total)**. Attendance submit **p95 < 1 second excluding client network** remains the existing gate; it is not a claim of 100,000 records per branch. Derive teachers/classes/slots and retained occurrence counts explicitly from the configured fixture. Record hardware, concurrency, warm/cold behavior, sample count and dataset cardinalities.

Run published class-week, teacher/date, substitution candidate and offering/date-overlap queries under the restricted runtime role once available. Record EXPLAIN (ANALYZE, BUFFERS), index use and bounded scope. Benchmark generation separately from attendance submission; never generate a full term inside a request. No load or restore result is claimed by this prototype pack.

## Accessibility and product review
Check useful table captions/headers, lesson accessible names, visible focus, keyboard editing without drag-and-drop dependency, modal containment/return, error announcement, 360px viewport, 200% zoom and palette contrast. Native VoiceOver/NVDA review remains a separate unperformed check until actually completed. Do not claim WCAG conformance.
