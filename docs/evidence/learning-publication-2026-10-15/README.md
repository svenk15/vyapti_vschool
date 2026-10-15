# LEA-01 Learning publication evidence — 15 October 2026

## Verified supported slice

LEA-01 implements one bounded, text-only Learning assignment flow. A currently assigned Teacher creates and resumes a draft with optimistic revision checks, then publishes one immutable version to the exact current class audience. Publication freezes Student recipients and the accepted Guardian/Student portal bindings that were eligible at that instant. Parent and Student reads still recheck the exact live purpose, access, scope and module state.

Routes:

- Teacher: `/teacher/learning`, `/teacher/learning/new`, `/teacher/learning/[id]`
- Parent: `/family/learning`
- Student: `/student/assignments`

The feature-specific demo seed is integrated into `pnpm demo:seed`. It preserves existing records and credentials and writes private identifiers only to ignored `artifacts/learning-01/private-demo.json`.

## Approved references and direct comparison

The comparison used the unmodified approved files through the local reference server:

- Teacher TEA-27: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Teacher_Design/VSchool_Teacher_Review.html#/flow/TEA-27`
- Parent PAR-20: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html#/flow/PAR-20`
- Student STW-10/STW-11: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Student_Design/VSchool_Student_Review.html#/assignments`

Screens were captured and inspected at 1440×1000 and 390×844. TEA-27 and PAR-20 are preview-placeholder entries rather than complete production compositions. The implemented Teacher authoring and Parent read views are therefore narrow reference-less extensions using the established portal shell, staged form, context ribbon, card, feedback and responsive patterns.

The Student reference is a complete assignment workspace. The implemented page aligns its shell, heading, assignment information hierarchy, active mobile Work navigation and responsive cards, but it intentionally supports only the LEA-01 immutable text assignment list/detail. Search, filter, sort, pagination, resources, submission status and submission actions are absent. STW-10 and STW-11 remain partial.

Reference captures:

- `reference-teacher-tea27-chromium.png`, `reference-teacher-tea27-mobile.png`
- `reference-parent-par20-chromium.png`, `reference-parent-par20-mobile.png`
- `reference-student-assignments-chromium.png`, `reference-student-assignments-mobile.png`

Application captures:

- `teacher-compose-chromium.png`, `teacher-compose-mobile.png`
- `teacher-published-chromium.png`, `teacher-published-mobile.png`
- `parent-learning-chromium.png`, `parent-learning-mobile.png`
- `student-assignments-chromium.png`, `student-assignments-mobile.png`

The documented font-portability exception remains. Native VoiceOver/NVDA evidence was not produced.

## Persistence and security evidence

Implementation commit: `0e91106b64bafe99f5524439831c016b7df9c3ce`.

Forward migration `20261015170000_learning_assignment_publication` is applied to the designated development and test databases. Both migration ledgers reported 57 migrations applied with none pending. The database registry contains 91 table contracts, including the five Path A Learning tables. No database was reset and no migration was rewritten.

Focused real-PostgreSQL tests passed 3/3. They cover assigned-Teacher draft/update/publication, exact immutable frozen audiences, later-grant non-retroactivity, live purpose revocation, concurrent stale mutation, revoked Teacher denial and scoped Parent/Student reads. Persistence tests use the real `vyapti_vschool_test` database.

The browser journey passed 1/1 in Chromium desktop and 1/1 in Mobile Chromium with one worker. It creates and publishes through the Teacher UI, reloads the result, then reads the exact assignment through independent Parent and Student sessions. The initial test assumption that Teacher sign-in always redirects directly to `/teacher` was corrected to the approved shared `/account` entry; application behavior was not weakened.

Repository evidence for the implementation source:

- `pnpm check:db-design` — passed, 91 table contracts.
- `pnpm check:backend` — passed.
- `pnpm typecheck` — passed.
- `pnpm build` — passed.
- isolated Playwright production build with `VSCHOOL_E2E=1` — passed.
- focused Chromium and Mobile Chromium Playwright journeys — passed sequentially.

`pnpm demo:seed` completed after a seed-composition correction ensured the Learning step treats branch activation as a full desired set and preserves all implemented demo modules. It prepared or preserved the Learning assignment, Parent/Student access purposes and the preceding connected demo records without resetting or overwriting them. Older independent TEN-02/ACA-01/branding refreshes reported their existing non-required local-fixture warnings and were preserved; the command continued through every required current feature and exited successfully.

## Remaining scope and gates

Files/resources, learner drafts, submissions, late/extension rules, withdrawal, grading, criteria, feedback, questions, external delivery and offline storage are not implemented. They require their own owner contracts and are not presented as functional. Human acceptance is PENDING. TEN-03 RLS, font portability, native accessibility and production readiness remain separate gates.
