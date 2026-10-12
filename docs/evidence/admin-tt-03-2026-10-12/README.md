# TT-03 whole-branch conflict preview evidence

Date: 12 October 2026. Human acceptance: **PENDING**.

Authority: `implementation-spec/administrator/workflows/SA-41.md`, approved Administrator reference `VSchool_School_Admin_Review.html#/flow/SA-41` after **Edit timetable → Review & publish**, and the coordinated timetable TT-03/TT-W03 contracts. The implementation stops before TT-04 acknowledgment/publication.

Implemented: authenticated branch-scoped preview of the current saved draft/version; class interval and Teacher Person conflict checks across the whole draft; current published-calendar and dated-assignment evaluation over a bounded 42-day horizon; protected open/submitted Attendance warning count; added/changed/removed summary; scoped SHA-256 evidence digest; safe stale/foreign paths. The repository read uses a repeatable-read snapshot and no mutation locks. No schema or migration changed.

Verification on the implementation source:

- `pnpm check`: passed, including 142 unit tests and all boundary/database-design checks.
- TT-03 domain tests: 3/3 passed; same Person across assignment rows conflicts, adjacent half-open periods pass, nonteaching exceptions are excluded, mid-horizon assignment expiry and missing calendar block readiness.
- `pnpm test:functional test/functional/timetable-preview.test.ts`: 1/1 passed against `vyapti_vschool_test`; 41 migrations, none pending. It covers scoped persistence reads, current authorization/module guards, teacher/calendar/assignment conflicts, protected Attendance count, digest, stale version and foreign branch denial.
- Sequential one-worker Chromium and mobile TT-02/TT-03 journeys: 1/1 each passed. They cover save/reload, focus, exact-key response-loss recovery, staged conflict review, Back to draft, stale recovery, discard retry and retained history.
- `pnpm build`: passed; build ID `7xsq2y9ismCsh8IB9dsap`.

Directly inspected comparison:

- [Approved draft entry](reference-draft-desktop.png)
- [Approved desktop review](reference-preview-desktop.png)
- [Approved mobile review](reference-preview-mobile.png)
- [Application desktop review](application-preview-chromium.png)
- [Application mobile review](application-preview-mobile.png)

The application follows the approved heading, two-card impact/check composition, protected-Attendance callout, desktop proportions and single-column mobile reflow. It uses real authorized fixture names and counts. Remaining differences belong to later or accepted boundaries: TT-04 owns acknowledgment and Publish timetable; TT-05 owns exact occurrence reconciliation; room validation is not applicable until an approved room owner/reference exists; two-week cycles remain deferred. Reference-only review controls and fictional identities are absent. Font portability and native accessibility remain pending.

An accidentally mis-forwarded functional command ran the existing functional suite once: 130 existing tests passed and only the new TT-03 fixture failed its lowercase code constraint. After correcting that fixture, the focused TT-03 PostgreSQL test passed. This is recorded as diagnostic evidence, not a claim that the full functional suite passed on the final source.
