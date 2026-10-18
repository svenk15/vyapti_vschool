# M01–M08 assisted acceptance review

Prepared: 18 October 2026 (Asia/Kolkata)

Human acceptance: **PENDING**. This pack records engineering evidence and a shortened manual review; it does not declare production readiness.

## Bounded correction addendum

The external-review corrections are recorded in [M01–M08 bounded acceptance corrections](../../../evidence/m01-m08-acceptance-corrections-2026-10-18/README.md). That checkpoint updates presentation, demo linkage and obsolete browser coverage while retaining every owner/security contract. Its final review ZIP records the exact fix commit and executable build. The frozen candidate below remains the provenance for the earlier assisted review; it is not relabelled as the corrected source.

## Frozen candidate

| Item | Value |
|---|---|
| Repository HEAD when review started | `062eb68f8f313f4f35731e9d12eb7afe9dc37c2b` |
| Executable application source | `c7b2abd` |
| Normal demo build | `lA2wtzNon2bc8hg3fJSJN` |
| Current isolated E2E build | `g4-EoQgL-ZjpAo949JeiB` |
| Demo | `http://127.0.0.1:3400` |
| Database | development and dedicated test databases: 117 forward migrations applied; none pending in the recorded integrated checkpoint; the focused current-source E2E runs reconfirmed test at 117/117 |

The original assisted review added only acceptance-test maintenance and this review pack. The later bounded correction addendum changes presentation and synthetic seed linkage; it changes no business, authorization, schema or migration contract. Pre-existing modified historical screenshots and unrelated local files remain outside both checkpoints.

## Outcome

M01–M08 meet their bounded engineering acceptance criteria. Human review remains pending for every journey. The current candidate remains synthetic-only and subject to TEN-03, native accessibility, font portability, restore/load and owner-specific production provider, scanner, retention and real-data gates.

| Journey | Engineering | Current visual review | Human |
|---|---|---|---|
| M01 workspace access | PASS | current candidate desktop/mobile persona captures inspected | PENDING |
| M02 operational class | PASS | current regression plus direct historical reference comparisons | PENDING |
| M03 registration to access | PASS | current regression plus direct staged comparisons | PENDING |
| M04 timetable to Attendance | PASS | current regression plus direct timetable/Attendance comparisons | PENDING |
| M05 notice to acknowledgement | PASS | current regression plus shared production-pattern review | PENDING |
| M06 assignment to feedback | PASS | current regression plus role-specific production-pattern review | PENDING |
| M07 assessment to report | PASS | direct desktop/mobile publication and recipient-state comparison | PENDING |
| M08 source gap to resolution | PASS | direct desktop/mobile follow-up-state comparison | PENDING |

## Evidence reused

The detailed owner and journey evidence remains authoritative in:

- [`M01`](../../../evidence/must-have-m01-2026-10-18/README.md)
- [`M02`](../../../evidence/must-have-m02-2026-10-18/README.md)
- [`M03`](../../../evidence/must-have-m03-2026-10-18/README.md)
- [`M04`](../../../evidence/must-have-m04-2026-10-18/README.md)
- [`M05`](../../../evidence/must-have-m05-2026-10-18/README.md)
- [`M06`](../../../evidence/must-have-m06-2026-10-18/README.md)
- [`M07`](../../../evidence/must-have-m07-2026-10-18/README.md)
- [`M08`](../../../evidence/must-have-m08-2026-10-18/README.md)
- [`Integrated checkpoint`](../../../evidence/must-have-final-2026-10-18/README.md)

These records contain focused real-PostgreSQL owner tests, one-worker Playwright journeys, authorization failures, retry/concurrency evidence and direct visual inspection. Application code did not change after that checkpoint, so unchanged successful owner evidence was not repeated.

## New current-candidate checks

- `VSCHOOL_E2E=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; isolated build `g4-EoQgL-ZjpAo949JeiB`.
- Selected connected desktop Playwright batch — six maintained M02/M03/M06/M07/M08 tests passed before two obsolete harness assumptions were isolated.
- `pnpm test:e2e test/e2e/communication-notices.spec.ts --project=chromium --grep 'administrator authors'` with the documented 4 GiB Node heap — 1/1 passed; current AUTHOR → independent REVIEW → PUBLISH → Parent acknowledgement.
- `pnpm test:e2e test/e2e/teacher-attendance-milestone.spec.ts --project=chromium --grep 'Teacher completes and recovers'` with the documented 4 GiB Node heap — 1/1 passed; trusted occurrence → Teacher submission → exact-key recovery.
- `VSCHOOL_CAPTURE_PERSONAS=1 pnpm demo:verify-personas` — 11/11 current normal-demo persona/recovery states passed at 1440×1000 and 390×844.
- Focused ESLint for the two maintained E2E files — passed.

One accidental invocation inserted a standalone `--` after `pnpm test:e2e`, which caused Playwright to begin its full 318-test inventory. It was stopped after three unrelated passes. It is not reported as a release check. A first rerun omitted the known 4 GiB heap and the local Next process exhausted its 2 GiB default; the documented configuration was then used.

## Visual review

The ten `candidate-*` captures in [`screenshots/`](screenshots/) come from the normal demo build and were inspected directly. They show consistent shared shell hierarchy, desktop sidebar grouping, mobile navigation, focusable actions, bounded content widths and no observed root overflow. The additional `m02-*` through `m08-*` images are copied from the journey evidence and retain their original source provenance; they are included to show meaningful intermediate states rather than being relabelled as new captures.

No automated evidence is labelled as native VoiceOver/NVDA testing or actual browser zoom. The known approved-font portability exception remains open. No new visual deviation was found in the current persona surfaces. Exact approved production screens do not exist for every role/state; those cases are labelled shared-pattern reviews in [`COVERAGE.md`](COVERAGE.md).

## Review files

- [`Coverage`](COVERAGE.md)
- [`Defects`](DEFECTS.md)
- [`30–45 minute walkthrough`](HUMAN_WALKTHROUGH.md)
- [`Screenshots`](screenshots/)
