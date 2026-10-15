# LEA-03 private text submission evidence — 15 October 2026

Human review: **PENDING**. Implementation checkpoint: `c4f9014b`.

## Delivered journey

A currently assigned Teacher publishes a text assignment to an exact frozen audience. The eligible Student opens the assignment, saves one private versioned text draft, leaves and resumes it, reviews the exact response, and confirms one on-time immutable submission. The persisted receipt survives reload. The authoring Teacher lists and opens accepted content under a fresh live exact-offering authority check. Parents, other Students and unrelated Teachers cannot read draft or submitted content.

Routes:

- Teacher author/read: `/teacher/learning`, `/teacher/learning/[assignmentId]`, `/teacher/learning/[assignmentId]/submissions/[submissionId]`
- Student directory/detail/work: `/student/assignments`, `/student/assignments/[assignmentId]`, `/student/assignments/[assignmentId]?work=1`

The feature seed is part of `pnpm demo:seed`. Private persona and scenario locations are `artifacts/people-02/private-demo.json`, `artifacts/guardians-01/private-demo.json`, `artifacts/students-portal/private-demo.json` and `artifacts/learning-01/private-demo.json`; no credential or token is committed.

The current-source seed completed successfully against guarded `vyapti_vschool`, preserving existing records and producing or retaining an unsubmitted Learning scenario. Existing non-required TEN-02/ACA-01/Branding refresh warnings remained visible and did not prevent the required current-feature seeds from completing.

The live demo is `http://127.0.0.1:3400/sign-in`. A normal production build completed at evidence HEAD `afe5a94e2a549bc2c2a2023b8e6f61c58072b6a9`, which contains executable implementation `c4f9014b`; health returned `ready: true` and sign-in returned HTTP 200 before handoff.

## Reference comparison

Authoritative Student reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Student_Design/VSchool_Student_Review.html`, states `#/work/a1`, its review dialog and receipt. It was served unchanged for capture. The Student application uses the approved separate **Your work** composition, private-draft notice, response editor, review dialog and receipt hierarchy.

Reference captures:

- `reference-student-draft-desktop.png`, `reference-student-draft-mobile.png`
- `reference-student-review-desktop.png`, `reference-student-review-mobile.png`
- `reference-student-receipt-desktop.png`, `reference-student-receipt-mobile.png`

Current application captures:

- `student-draft-chromium.png`, `student-draft-mobile.png`
- `student-pending-chromium.png`, `student-pending-mobile.png`
- `student-receipt-chromium.png`, `student-receipt-mobile.png`
- `teacher-reader-chromium.png`, `teacher-reader-mobile.png`

The final captures were directly inspected. The implementation deliberately omits prototype file controls, returned-feedback promises and withdrawal because files, feedback and withdrawal have no LEA-03 contract. Teacher accepted-content reading is a narrow shared-pattern extension because the approved Teacher pack has no complete submission-reader state. Real fictional data replaces prototype samples. The documented font portability exception remains; native VoiceOver/NVDA and human visual acceptance were not performed.

## Persistence and security evidence

Forward migration `20261015193000_learning_text_submissions` is applied to both designated local databases. Prisma reported 58 migrations with none pending. The 93-table registry includes both branch-scoped Learning tables with TEN-03 Path A closure metadata. The migration was not rewritten and no database was reset.

- Focused unit: 3/3 passed for response normalization, bounds and exact command input.
- Focused real PostgreSQL: 11/11 passed for own-draft privacy, CAS/stale retention, deadline boundary, post-deadline receipt replay, duplicate concurrency, save-versus-submit serialization, cross-scope denial, access revocation, immutable attempts, Teacher accepted-content authority, Parent denial and actionable status filtering.
- Chromium desktop: 1/1 passed with one worker.
- Mobile Chromium: 1/1 passed with one worker.
- TypeScript, lint, backend compile, extraction boundaries and database-design checks passed.
- Each final Playwright project built the current application successfully before running.

The browser journey deliberately intercepts the first submission response after the server commits, then retries the exact retained payload/key and verifies the recovered receipt. It also reloads the saved draft and final receipt before the Teacher reader step. A `pg` deprecation warning about concurrent client queries remains visible in the existing harness; it did not fail assertions. An accidentally broad functional wrapper invocation was stopped after the focused Learning file had passed and is not counted as a repository-suite result.

## Remaining scope and gates

Files/resources, criteria, late and extension rules, reopening, resubmission, withdrawal, grading, feedback and questions remain separate Learning contracts. Parent assignment read remains metadata-only and does not grant response access. ATT-05 real protected text remains fail-closed outside the explicit synthetic development mode. TEN-03, font portability, native accessibility, human acceptance and production readiness remain pending.
