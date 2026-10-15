# Learning current state

## LEA-01

Status: ENGINEERING_VERIFIED_SUPPORTED_SLICE / HUMAN_REVIEW_PENDING

The bounded LEA-01 text-only publication slice is implemented through the Learning owner. A currently assigned Teacher can create, resume with revision CAS and publish one immutable assignment to a current CourseOffering. Publication freezes exact eligible Student recipients and exact accepted Guardian/Student access bindings. Parent and Student reads recheck the independent live Learning purpose and current access before returning the frozen version.

Forward migration `20261015170000_learning_assignment_publication` is applied to local development and `vyapti_vschool_test`; both ledgers contain 57 applied migrations with none pending. The five new Path A Learning tables are registered in the 91-table database registry. TEN-03 RLS enforcement remains a production gate.

Implementation commit `0e91106b64bafe99f5524439831c016b7df9c3ce` passed: focused real-PostgreSQL Learning publication tests 3/3; Chromium desktop Learning journey 1/1; Mobile Chromium Learning journey 1/1; database-design check for 91 tables; backend boundary/type checks; TypeScript; and normal plus isolated Playwright production builds. Direct screenshots were inspected at 1440×1000 and 390×844. The integrated `pnpm demo:seed` subsequently completed without replacing records after its Learning step was corrected to preserve the shared branch's full implemented module set. Evidence and exact reference paths are in [learning publication evidence](../../evidence/learning-publication-2026-10-15/README.md).

TEA-27 and PAR-20 reference entries are preview placeholders, so the real authoring/read compositions are documented narrow design extensions. STW-10/11 have a richer approved full assignment workspace. Search/filter/sort/pagination, resources, learner drafts/submissions, criteria, feedback and questions are not implemented by LEA-01; those workflow rows remain PARTIAL rather than complete. Human visual review, native accessibility, font portability, TEN-03 and production readiness remain pending.

## LEA-02

Status: ENGINEERING_VERIFIED_SUPPORTED_SLICE / HUMAN_REVIEW_PENDING

The Student assignment directory now supports server-side Assignment name/Subject substring search, deterministic Due date/Assignment name/Subject sorting in both directions and bounded query-bound cursor pagination over the complete exact authorized recipient set. Every page repeats live Student access/purpose/module/enrollment checks and fully scoped binding→recipient→current version→assignment→offering→subject joins. Search/sort state is URL-backed, Enter applies search, a separate drawer applies sort, and changing criteria clears the prior cursor. No schema, migration, write path, purpose or seed changed.

Focused real-PostgreSQL passed 4/4 including page-one/page-two ordering and changed-query cursor rejection. The current isolated production build passed; desktop and mobile one-worker Learning journeys each passed 1/1 and exercised search URL state, browser Back, Sort and detail navigation. Captures were directly compared with the approved STW-10 directory. Submission-status Filters remain absent because Draft/Submitted/Returned/Closed/Excused require the unimplemented learner submission and feedback owners; due time is not misrepresented as those states. Evidence: [STW-10 assignment directory](../../evidence/student-assignment-directory-stw-10-2026-10-15/README.md).

Next action: preserve this checkpoint and select the next capability whose product semantics and owner dependencies are already settled; do not widen LEA-01 implicitly.

Demo: `http://127.0.0.1:3400/sign-in` serves executable source `5f0d6810e5a8d97a49b62575a74e76073a0c7b72` (the verified application commit plus the seed-preservation follow-up). Live health and sign-in returned HTTP 200, and a signed-out Learning request redirected to sign-in. Teacher/Administrator credentials are in ignored `artifacts/people-02/private-demo.json`; Parent credentials are in `artifacts/guardians-01/private-demo.json`; Student credentials are in `artifacts/students-portal/private-demo.json`; Learning scenario identifiers are in `artifacts/learning-01/private-demo.json`. No credential is recorded in source.
