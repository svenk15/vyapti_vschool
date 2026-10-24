# Attendance implementation — source completion and verification limits

Baseline: `26b569cd45daf7d73ba7ed3183aa9ecc322a0bee`, corrected complete-source export.
Approved reference: `b4bbb0d028e06484f5ff00777231b1972de6d7f8`, `approved-c.html` with its ordered refinement, Reports, workspace-alignment and report-period assets.

The previously identified source gaps have been implemented and then merged and verified locally. This is **not a claim of human acceptance or production readiness**. See `local-verified/README.md` for current-build PostgreSQL, browser, build and direct comparison evidence.

## Implemented journeys

| Journey | Implementation |
| --- | --- |
| Registers | Full authorized day projection; school date; attribute search; status/class filters; deterministic priority sorting; 25/50/100 pagination; URL/Back state; Teacher, time range and submitted counts. |
| Schedule | Details → review → guarded command; school-local time conversion; no mutation before confirmation; exact-key unknown recovery; close/reopen retention; dirty-close confirmation. |
| Register | Authoritative frozen roster; Students-owned admission-number read; name/admission search; paging; read-only pending/cancelled states. |
| Correct | Fixed Student context; status and reason together → review → final-only correction; stale refresh with attempted values retained; immutable exact-key retry; resource-bound receipt; revision history. |
| Cancel | Reason → review → final cancellation; same command recovery and stale protection; retained submitted records/history. |
| Requests | Awaiting review / All requests; type filter; counted bounded owner pages; independently current-authorized explanation/correction reads; no 100-row truncation masquerading as completeness. |
| Review requests | In-place drawers, accept/decline/clarification or correction decision; consequence review; changed-source handling; pending command retention; GET-only refresh after confirmed save. Existing deep links reuse this composition. |
| Reports | Whole-result class coverage independent of session cursor; due excludes future/cancelled; complete/missing/not-due filters; class search/sort/paging; compact inclusive period picker; missing-register drilldown and return state. |
| CSV | Complete filtered class set, no pupil fields; formula protection; current export authorization; audited filters/sort/as-of/hash; no new export grant. |

No schema, migration, role grant, provider configuration or production data was changed. Existing theme tokens remain authoritative.

## Reference comparison performed

The package pass compared source structures, styles, icon paths and interaction contracts. The merged-source pass then opened the unchanged reference and production build in Chromium at matched CSS viewports and inspected the captures directly. See `local-verified/`. The reference has fictional fixtures and simulated commands; the application retains owner authority, bounded periods and actual receipts.

## Original package verification provenance

- Full unit suite: 297/297 across 69 files.
- TypeScript: passed.
- Changed-source ESLint: passed.
- Portable backend compilation: passed.
- Architecture boundaries: passed.
- Database-design validation: passed, 206 table contracts.
- Original package production build: passed; build ID `Ww_5TTJ4DSqwILVcnyPLo`. The merged-source build is recorded under `local-verified/`.
- Original corrected export manifest: 3,158 entries verified during intake; omitted baseline mail adapter restored unchanged.
- Documentation validation: non-green because this sanitized export excludes historical evidence referenced throughout the docs. This is broader than the two old broken links.

## Local merged-source verification

The focused unit, guarded PostgreSQL functional, connected Chromium/mobile, boundary and production-build checks passed on the merged source. The connected browser test follows drawer scheduling, Teacher submission, class-coverage CSV, Student admission identifiers, lost-response correction with identical payload/key, immutable revision count, reviewed cancellation and persisted retained roster.

## Remaining verification boundary

1. Actual 200% zoom, VoiceOver/NVDA, human acceptance and existing production gates remain pending.
2. Four themes were visually inspected through existing theme attributes without persisting appearance changes; persisted theme behavior is unchanged evidence from the theme owner.
3. Unknown operations retain their exact payload/key in memory, including drawer close/reopen. Reload-durable status APIs were not invented; keep the page open until resolved.
4. Request ordering is deterministic explanations-first then corrections, with count-aware paging across both owners; no global chronology is claimed.
5. Individual source-register inspection from correction review opens a clearly labelled new tab to preserve the response draft and pending operation.

## Local verification procedure

Use the package baseline hashes and `git apply --check` on a clean review branch. Never overwrite unrelated changes. Then:

- Run unit, lint, TypeScript, backend, boundary and database-design checks.
- Inspect `scripts/database.mjs` forwarding and run focused functional files without an extra `--`: attendance-sessions, attendance-report, attendance-explanations, attendance-correction-requests.
- Run the updated `test/e2e/attendance-sessions.spec.ts` sequentially for Chromium/mobile against the dedicated test database.
- Review Requests pending/all with real assigned, terminal, clarification, revoked and changed-source cases. Exercise close/reopen, unknown retry and saved-result/failed-refresh independently.
- Render the approved reference unchanged beside the application with matching viewport, font, theme and equivalent fictional state. Verify every state in `REFERENCE_COMPARISON.md`; fix measured differences before claiming parity.

No deployment, external push or real mail delivery occurred.
