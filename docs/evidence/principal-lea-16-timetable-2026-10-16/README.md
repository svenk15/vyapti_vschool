# LEA-16 Principal timetable exception evidence

Status: supported read slice engineering verified; full workflow partial; direct visual comparison complete with documented capability deviations; human review pending.

The approved authority is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow **LEA-16 — Review timetable conflicts and uncovered classes**, together with its Timetable integration notes. The application route is `/leadership/timetable`.

The application selects the current effective immutable publication and presents its durable reconciliation outcomes. It shows exact occurrence date/time, class, subject, current Teacher, outcome, and a trusted manual-conflict Attendance source link. The linked source independently reauthorizes the Principal and exposes scheduled context and state without roster or marks. The Principal receives no Timetable edit, cover, Attendance cancellation, correction or marking control.

## Verification

- Focused ESLint and `tsc --noEmit`: passed.
- Access capability unit test: 10/10 passed; Principal receives `timetable.read_leadership` and no `timetable.manage`.
- Real PostgreSQL `test/functional/timetable-reconciliation.test.ts`: 6/6 passed against `vyapti_vschool_test`; all 64 migrations applied with none pending. Coverage includes mixed manual/domain outcomes, stable bounded continuation, current publication/assignment joins, Principal-only and cross-branch denial, resolution clearing, existing exact replay, concurrency and frozen-session behavior.
- Focused Playwright, sequentially with one worker: Chromium 2/2 and mobile 2/2 passed. It covers the role-aware Principal entry, protected route/navigation, populated conflict, exact Attendance evidence link, absent mutation controls, keyboard focus, mobile drawer focus return, no horizontal viewport overflow, and untouched reference capture.
- Production build completed in the Playwright web-server gate. No schema or migration changed.
- The guarded local verifier `node --import tsx scripts/demo-principal-timetable.ts` passed against the existing deterministic development publication/manual-conflict seed without changing records. The full `pnpm demo:seed` command exited 0 and the LEA-16 step passed; its optional TEN-02, ACA-01, and BRD-02 refreshes reported existing local-fixture conflicts/unavailability and explicitly preserved their prior records.

## Direct visual inspection

The images were opened and compared directly at 1440×1000 and 390×844. The first application mobile capture retained a desktop table and clipped columns; the route was changed to use the established responsive Leadership list composition, then both projects passed and the images were recaptured. Final hierarchy, status, metrics, occurrence facts and evidence action are readable at both sizes.

- Desktop: [approved reference](reference-chromium.png), [application](application-chromium.png).
- Mobile: [approved reference](reference-mobile.png), [application](application-mobile.png).

The approved reference includes general uncovered-class, absence-driven cover, acknowledgement and coordinator/delegated action states. The live owner schema currently provides trusted reconciliation exceptions but no general Teacher absence source or settled cover authority lifecycle. The production page therefore implements the smallest consistent read-only subset and does not render dead cover actions. Exact font portability, native VoiceOver/NVDA, TEN-03, production controls and human acceptance remain pending.

Seed credentials remain only in ignored mode-0600 `artifacts/leadership-01/private-demo.json`; no secret is included here.
