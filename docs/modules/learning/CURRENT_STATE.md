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

Demo: `http://127.0.0.1:3400/sign-in` serves executable application source `2c0e7aca123b88c472d9b2f8f5664345fad9a5de`, including LEA-01 publication, STW-06 priority and LEA-02 directory query controls. A normal production build passed; live health returned ready and sign-in returned HTTP 200. Teacher/Administrator credentials are in ignored `artifacts/people-02/private-demo.json`; Parent credentials are in `artifacts/guardians-01/private-demo.json`; Student credentials are in `artifacts/students-portal/private-demo.json`; Learning scenario identifiers are in `artifacts/learning-01/private-demo.json`. No credential is recorded in source.

## LEA-03

Status: ENGINEERING_VERIFIED_SUPPORTED_SLICE / HUMAN_REVIEW_PENDING

Commit `c4f9014b` implements the text-only Teacher → Student → Teacher submission journey. One exact frozen Student recipient can create and CAS-update a private server draft, resume it after reload, review it in the approved staged composition, submit explicitly at or before the immutable version deadline, recover the exact committed receipt after an unknown response, and read the accepted snapshot after reload. The authoring Teacher can list and open accepted responses only while retaining the current exact CourseOffering assignment and Learning authority. Parent, other Student, unrelated Teacher and cross-scope reads are denied; no unsubmitted response text enters general audit, outbox or command-receipt payloads.

Forward migration `20261015193000_learning_text_submissions` adds `vs_learning_assignment_draft` and `vs_learning_submission_attempt`. It is applied to development and `vyapti_vschool_test`; both ledgers contain 58 migrations with none pending. Both Path A tables are registered among 93 contracts with explicit TEN-03 closure metadata. TEN-03 enforcement remains a production gate.

Current-source verification passed: unit 3/3; focused real-PostgreSQL Learning 11/11; TypeScript; lint; backend compile; extraction boundaries; database-design; and sequential one-worker Chromium desktop 1/1 plus Mobile Chromium 1/1. Each browser project produced a production build and exercised Teacher publication, Student draft save/reload, review, unknown-response exact retry, receipt persistence and Teacher accepted-content read. The Learning file passed before an accidentally broad functional invocation began unrelated Access tests; that broad invocation was stopped and is not reported as a suite pass. The retained `pg` concurrent-query deprecation warning is not a failed assertion.

Approved Student draft, review and receipt states were captured and directly compared at desktop/mobile sizes with the current application. The application intentionally omits file attachment controls, withdrawal, returned feedback and grading because LEA-03 has no such contract. Teacher submission reading remains a documented narrow extension where the approved Teacher reference has no complete reader state. The existing font portability exception and native accessibility evidence remain pending. Evidence: [LEA-03 text submission](../../evidence/learning-text-submission-lea-03-2026-10-15/README.md).

The incremental seed preserves an existing unsubmitted assignment and creates a new deterministic text-submission scenario only after the prior seeded assignment has been accepted; it never changes the accepted response or user credentials. Student matrix status is now 11 engineering complete, 7 partial and 29 blocked. Parent status is unchanged by LEA-03 because `learning.assignment.read_child` does not expose response content.

Demo: `http://127.0.0.1:3400/sign-in` is reachable and serves the normal production build made at evidence HEAD `afe5a94e2a549bc2c2a2023b8e6f61c58072b6a9`; the executable application implementation is `c4f9014b`. Health returned `ready: true` and sign-in returned HTTP 200. `pnpm demo:seed` completed against guarded `vyapti_vschool`, preserving existing records and preparing an unsubmitted Learning walkthrough. Private credentials remain in the ignored persona files listed above.

Next action: keep Human review PENDING and select the next independently eligible capability from the execution queue. Remaining Learning gaps are resources/files, criteria, late/extension rules, reopening/resubmission/withdrawal, grading/feedback and questions; none is implicitly authorized by LEA-03.
