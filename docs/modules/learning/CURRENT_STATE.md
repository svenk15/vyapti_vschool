# Learning current state

## LEA-01

Status: ENGINEERING_VERIFIED_SUPPORTED_SLICE / HUMAN_REVIEW_PENDING

The bounded LEA-01 text-only publication slice is implemented through the Learning owner. A currently assigned Teacher can create, resume with revision CAS and publish one immutable assignment to a current CourseOffering. Publication freezes exact eligible Student recipients and exact accepted Guardian/Student access bindings. Parent and Student reads recheck the independent live Learning purpose and current access before returning the frozen version.

Forward migration `20261015170000_learning_assignment_publication` is applied to local development and `vyapti_vschool_test`; both ledgers contain 57 applied migrations with none pending. The five new Path A Learning tables are registered in the 91-table database registry. TEN-03 RLS enforcement remains a production gate.

Implementation commit `0e91106b64bafe99f5524439831c016b7df9c3ce` passed: focused real-PostgreSQL Learning publication tests 3/3; Chromium desktop Learning journey 1/1; Mobile Chromium Learning journey 1/1; database-design check for 91 tables; backend boundary/type checks; TypeScript; and normal plus isolated Playwright production builds. Direct screenshots were inspected at 1440×1000 and 390×844. The integrated `pnpm demo:seed` subsequently completed without replacing records after its Learning step was corrected to preserve the shared branch's full implemented module set. Evidence and exact reference paths are in [learning publication evidence](../../evidence/learning-publication-2026-10-15/README.md).

TEA-27 and PAR-20 reference entries are preview placeholders, so the real authoring/read compositions are documented narrow design extensions. STW-10/11 have a richer approved full assignment workspace. Search/filter/sort/pagination, resources, learner drafts/submissions, criteria, feedback and questions are not implemented by LEA-01; those workflow rows remain PARTIAL rather than complete. Human visual review, native accessibility, font portability, TEN-03 and production readiness remain pending.

Next action: preserve this checkpoint and select the next capability whose product semantics and owner dependencies are already settled; do not widen LEA-01 implicitly.
