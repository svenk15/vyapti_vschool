# Local merged-source verification

Verified on 24 October 2026 (Asia/Kolkata) after applying the corrected Attendance package to baseline `26b569cd45daf7d73ba7ed3183aa9ecc322a0bee` and retaining the surrounding working tree.

## Provenance

- Package ZIP SHA-256: `c47207d8a5d5c8068937e7f18b3c9ddfde9a72ad1927d9b774735b90ba5acbf9`.
- Package manifest: 92/92 entries matched the recorded size and SHA-256.
- Baseline verifier: passed every affected-file hash.
- `git apply --check`: passed before the patch was applied normally.
- Frozen reference: `/Users/venky/Downloads/VSchool_Attendance_Source_Completion_20261024/approved-reference/approved-c.html` with its supplied assets, unchanged.
- Production build ID: `XVWEjCcC5xkrftgU8lkmb`.
- Demo: `http://127.0.0.1:3400` from the production build above.

## Direct comparison

The reference and application were opened in Chromium at 100% browser zoom, device scale factor 1, and matched CSS viewports: 1440×1000, 900×1000, 390×844 and 360×800. `measurements.json` records computed font, viewport, DPR, document width, selected component geometry and overflow offenders. Both rendered Inter; the application used its locally bundled `next/font` Inter asset.

The files in this directory directly compare Registers, Filters, Sort, scheduling, register detail, correction, history, cancellation, Requests and request review, Reports, report-period calendar, and missing-register drilldown. Four theme captures use the existing client theme attributes as a non-persistent screenshot harness; they do not alter stored appearance settings.

Observed production data differs from the fictional reference counts and names. The implemented hierarchy, table/card switch, control sizing, action placement, status treatment, drawers and responsive composition follow the frozen reference. Direct inspection found and corrected one integration defect: the browser default dialog maximum width left a 34px strip beside mobile Attendance drawers. The Attendance drawer now explicitly uses the full mobile viewport. No root horizontal overflow was recorded at any required viewport.

## Verification

- Attendance unit suite: 8 files, 33 tests passed.
- Guarded PostgreSQL functional suite: 3 files, 17 tests passed against `vyapti_vschool_test`; 123 migrations applied.
- Connected Attendance E2E: Chromium passed; mobile passed; one worker and sequential projects. The mobile journey was rerun after the final drawer-width correction.
- TypeScript, changed-source ESLint, backend boundary checks, architecture boundaries and database-design validation passed.
- Production build passed with the established 4 GiB Node heap.

The connected journey covers authorized scheduling, retained stage edits, Teacher submission, lost-response submission recovery, class coverage and direct CSV export, exact-payload correction recovery, immutable revision history, guarded cancellation, retained records, and cross-scope denial.

## Remaining limits

- Reference/application captures were inspected directly, but human visual acceptance remains pending.
- Actual 200% browser zoom and native VoiceOver/NVDA were not run.
- Reference-only fictional variety (multiple classes and every request terminal state) is not fabricated in the development database; functional tests cover the corresponding owner contracts.
- The in-app browser integration was unavailable because its installed launcher referenced a missing older browser-service path. Existing repository Playwright/Chromium tooling produced the captures and connected verification instead.
- Production readiness, TEN-03 and the repository's existing release gates remain unchanged.
