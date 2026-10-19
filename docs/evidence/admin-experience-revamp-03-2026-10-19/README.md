# Administrator experience revamp — Attendance and Timetable

Source under test: `b13635f` plus the focused presentation changes committed with this evidence. Production build ID: `qCMRrY5t927FdEumilAx7`.

## Direct inspection

The production server at `http://127.0.0.1:3400` was exercised with the existing synthetic Administrator account at 1440×1000 and 390×844 CSS pixels. Sixteen route/view combinations returned HTTP 200. Screenshots in this directory cover:

- populated Attendance register monitoring and scheduling entry;
- populated explanation queue and the correction-request empty state;
- populated Attendance report and export review;
- timetable draft, readiness and populated cover coordination.

The screenshots were inspected directly. The Attendance subnavigation now maps to Registers, Corrections and Explanations; reporting stays in the separate Reports group. Permission-filtered Corrections navigation uses the existing `attendance.correct` capability and every destination retains its own server authorization. Disabled Attendance “Save draft” controls were removed because no durable draft contract exists. Timetable draft save remains because it has an implemented owner lifecycle.

The mobile Attendance report now presents every result as a labelled record instead of hiding columns in a horizontal table. Cover coordination uses the same labelled-record behavior and no longer overflows the 390-pixel viewport. Desktop tables remain semantic tables.

## Verification

- Focused ESLint: passed.
- TypeScript (`pnpm exec tsc --noEmit --pretty false`): passed.
- Navigation unit test run directly with Vitest: 3/3 passed.
- Production build with the established 4 GiB Node heap: passed.
- Sequential Playwright capture: 16/16 route/view combinations returned HTTP 200; root overflow was false after correction for every route.
- The first attempted focused unit invocation used a wrapper that did not forward the filter and ran 61 files. It produced 266 passes and one expected navigation assertion failure; the assertion was updated for the approved Attendance routes and the direct focused rerun passed.
- Database/schema/migrations: unchanged. Existing owner functional/security evidence remains applicable.

Human visual acceptance remains **PENDING**. Font portability, native accessibility and TEN-03 remain separate gates.
