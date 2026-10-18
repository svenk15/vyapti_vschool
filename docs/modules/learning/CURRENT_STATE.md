# Learning current state

## M01–M08 acceptance correction — 18 October 2026

Student assignment guidance now reflects draft, submitted and feedback-available state. The connected Learning seed binds its narrow Parent/Student read purposes to the exact documented accounts and creates a fresh immutable publication audience when an older assignment lacks those bindings; it does not rewrite old assignments or history. Parent Learning and Student home use the shared card stack. Focused Learning Playwright passed 1/1, the guarded connected seed validator passed, and current desktop/mobile states were inspected. Evidence: [bounded correction pass](../../evidence/m01-m08-acceptance-corrections-2026-10-18/README.md). Human review remains PENDING.

## Must-have M06 current-source checkpoint (18 October 2026)

Status: VERIFIED_CURRENT_SOURCE / HUMAN_REVIEW_PENDING

The current source was exercised as one connected assignment-to-feedback journey across all permitted projections: Teacher assignment and accepted-response review, exact Student immutable submission with published guidance, assignment-only Parent read, and Principal aggregate completion. The Parent journey used the fixture with the exact `learning.assignment.read_child` purpose; the general Guardian fixture was not broadened. Parent access continues to exclude Student drafts, accepted response text and Teacher feedback.

Focused real-PostgreSQL Learning verification passed 19/19 against `vyapti_vschool_test` with all 117 repository migrations applied and none pending. Current-source browser inspection covered eight desktop and eight mobile states. Mobile measurements recorded `390px` client and scroll widths for every route, and direct screenshot review found the shared compositions usable without root overflow. Existing LEA-01–04 and LEA-17/18 owner evidence remains applicable; this checkpoint adds current-source cross-persona regression evidence rather than changing schema or business behavior. Evidence: [must-have M06](../../evidence/must-have-m06-2026-10-18/README.md).

Human visual review, font portability, native accessibility, TEN-03 and production readiness remain pending.

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

## LEA-04

Status: ENGINEERING_VERIFIED_SUPPORTED_SLICE / HUMAN_REVIEW_PENDING

LEA-04 implements the approved current-release feedback contract for TEA-29 and STW-22. The currently assigned Teacher for the exact accepted submission may save a two-field private draft with revision CAS, resume it after reload and explicitly publish it. Publication creates an immutable version, keeps the accepted Student submission unchanged and discloses only the latest published version to that exact Student. A later correction creates another immutable version while the previous publication remains visible until the replacement is published. Parent assignment access, another Student, an unrelated Teacher, revoked authority and cross-scope callers cannot read the text. Feedback text is excluded from general audit, logs and command-receipt payloads.

Forward migration `20261016020000_learning_feedback_publication` adds `vs_learning_feedback` and `vs_learning_feedback_version`. It is applied to development and `vyapti_vschool_test`; both migration ledgers contain 59 migrations. The two Path A tables are registered among 95 contracts with explicit TEN-03 owner and closure metadata. The initially failed local attempt referenced the wrong existing Teacher physical table; the transaction rolled back, the still-unapplied migration was corrected to `vs_academics_teacher`, Prisma recorded the failed attempt as rolled back, and the forward migration then applied. No applied migration was rewritten and no database was reset.

Current-source verification passed: `pnpm check` including lint, TypeScript/Next route types, docs, 95-table database design, extraction boundaries, backend compile and 158 unit tests; focused real-PostgreSQL Learning 14/14; normal production build; isolated Playwright production build; and sequential one-worker Chromium desktop 1/1 plus mobile 1/1. The browser journey exercises private save/reload, staged review, a deliberately lost publish response, same-key/payload recovery without a duplicate version, Student read and Parent non-disclosure. The deliberate response abort emits `destination stream closed early`; the recovered-receipt assertion passes. The latest visual-only refinements were rebuilt and rerun in both browser projects.

The approved Teacher `#/learning/review/w1` private and review states were captured at 1280×1000 and 390×844 and directly compared with current application captures. The application preserves the approved two-column/one-column hierarchy, labels, field order and staged confirmation. The current product contract uses **publish** rather than prototype **return** terminology, excludes Parent visibility, and adds receipt recovery/correction states absent from the static prototype. STW-22 is implemented as published guidance without Returned, grade, rubric, reply, reopen or resubmission semantics. Those differences follow the explicit LEA-04 product decision and do not authorize the omitted workflows. Font portability, native VoiceOver/NVDA, TEN-03 and human visual acceptance remain pending. Evidence: [LEA-04 feedback](../../evidence/learning-feedback-lea-04-2026-10-16/README.md).

The incremental Learning seed preserves existing manual records, credentials, accepted submissions and published feedback. It prepares a new deterministic assignment only after the preceding seeded submission already has published feedback, so repeated `pnpm demo:seed` runs do not overwrite the review scenario.

Next action: preserve LEA-04 and select the next independently eligible Parent/Student capability from the authorized programme. Parent feedback remains explicitly excluded from this release decision; PAR-21 therefore stays deferred rather than inheriting Student feedback access.

## LEA-17

Status: ENGINEERING_VERIFIED_SUPPORTED_SLICE / FULL_WORKFLOW_PARTIAL / HUMAN_REVIEW_PENDING

Commit `2e03897` adds the Learning-owned Principal completion projection and `/leadership/learning`. It counts frozen published learner-assignment pairs due by the server cutoff, counts at most one immutable accepted attempt per pair, keeps not-yet-due pairs separate, and exposes only assignment, class, subject, due and aggregate counts. It never returns Student identity, private drafts or response text. Exact class/subject/date filters run in PostgreSQL before stable query-bound pagination. Live Principal, branch, release, entitlement, activation and dependency checks repeat on every read. No schema or migration changed; development and test retain 64 migrations.

Verification passed: Access unit 10/10; Learning real-PostgreSQL 15/15; focused lint and TypeScript; normal production build; and sequential one-worker Playwright 2/2 Chromium plus 2/2 mobile against the isolated build. The first browser attempt served the stale `.next-e2e` target and returned a truthful 404; the corrected harness invocation rebuilt that target, after which both projects passed. Reference and application captures were directly inspected at 1440×1000 and 390×844. `pnpm demo:seed` completed after the historical fixture clock was bounded by the real synthetic entitlement start; it preserved existing records and prepared submitted plus awaiting due pairs. Evidence: [LEA-17 Principal Learning](../../evidence/principal-lea-17-learning-2026-10-16/README.md).

Full LEA-17 remains PARTIAL. Extension/excusal policy, permitted pupil-level evidence and the teaching follow-up owner do not exist, so the production page states those limits and offers no fabricated actions. Human review, font portability, native accessibility, TEN-03 and production controls remain pending.

## LEA-18

Status: ENGINEERING_VERIFIED_SUPPORTED_SLICE / FULL_WORKFLOW_PARTIAL / HUMAN_REVIEW_PENDING

The explicit 16 October 2026 policy is implemented as Learning-owned `feedback-turnaround.v1`. It counts accepted submissions in a bounded branch-timezone interval, distinguishes first successful feedback publication from awaiting feedback, and reports median elapsed clock seconds for only the published subset. Private feedback drafts never count, later immutable revisions do not reset the first-publication instant, unsubmitted work is excluded, and no Student/Teacher identity or response/feedback text enters the DTO. Class and subject predicates execute in PostgreSQL. No SLA, overdue flag, ranking or staff-performance label is created.

The dedicated Principal route `/leadership/learning/feedback` reuses live `learning.read_leadership`, release, entitlement, activation and branch checks on every read. The shared shell resolves nested destinations by the longest authorized path so only Feedback turnaround is selected and named on that route. This correction also preserves exact Assignment completion selection on its parent route.

No table, migration, write, lock or duplicate report store was introduced; both local databases retain 64 migrations. Focused real-PostgreSQL passed 16/16, including exact two-hour first publication, later-revision non-reset, awaiting and empty cohorts, filters, revocation and sensitive-field exclusion. Sequential one-worker desktop/mobile reference and application journeys passed; final changed route plus affected parent-navigation checks passed 2/2 per project. Captures were directly inspected and corrected for metric-grid, active-navigation and mobile-card layout. Evidence: [LEA-18 Principal feedback turnaround](../../evidence/principal-lea-18-feedback-2026-10-16/README.md).

Full LEA-18 remains PARTIAL. Subject-lead assignee authority, operational-note ownership, coordination state and verified follow-up are not approved, so the page offers no fabricated action. Human review, font portability, native accessibility, TEN-03 and production readiness remain pending.

## F08-A / LEA-17 recipient policy

Status: ENGINEERING_VERIFIED_SUPPORTED_SLICE / F08_PARTIAL / HUMAN_REVIEW_PENDING

Implementation commit: `6df25c98b2b8919b30384a41cf21257da734b931`.

Approved synthetic-only D10 is implemented for Learning-owned per-recipient deadline extensions, excusal and reversal. Exact class/subject manager and status-reader designations are independent. Reads and writes recheck live identity, membership, branch, release, entitlement, activation and the exact designation. Policy commands lock the account, organization, school, assignment and recipient in the documented order, use expected event version and exact-key replay, and append immutable owner history, safe audit, outbox and receipt evidence. Reasons remain restricted to Learning history and never enter named status DTOs, Parent/Student assignment DTOs or Principal aggregates.

Forward migration `20261017160000_learning_recipient_policy` is applied to development and `vyapti_vschool_test`; both have 73 applied migrations. It adds `vs_learning_manager_grant` and `vs_learning_recipient_policy_event`. The database registry now contains 111 passing contracts. TEN-03 Path A remains a production and real-client-data gate.

Student work uses the latest effective deadline and denies new drafts/submissions while excused. Accepted submissions and authorized receipt replay remain immutable. Parent/Student assignment reads expose only the allowed effective deadline and `EXCUSED` status. Principal `assignment-completion.v2` uses the non-excused effective-deadline cohort and separates future/excused pairs. The separate `/leadership/learning/evidence` route exposes named status only to an exact status-reader grant and stages manager changes through review and final confirmation.

Focused verification passed: 16/16 unit checks; 2/2 affected real-PostgreSQL Learning tests; focused lint and TypeScript; backend, boundary, docs and 111-table database checks; normal and isolated production builds; sequential one-worker Chromium desktop 1/1 and mobile 1/1. The browser journey deliberately loses the final response and recovers the same receipt without a second event. Final desktop/mobile list, review and unknown-outcome captures were directly inspected; evidence is in [F08-A recipient policy](../../evidence/principal-f08-recipient-policy-2026-10-17/README.md).

F08 remains PARTIAL. F08-B must register the typed Learning evidence adapter with Coordination, define eligible academic assignees through the approved D10/D04 boundary, and verify source reauthorization plus follow-up outcome. Human review, font portability, native accessibility, TEN-03, retained-note production policy and deployment remain pending.

## F08-B / LEA-17 / LEA-19 academic follow-up

Status: LEA-17_ENGINEERING_COMPLETE / LEA-19_ENGINEERING_COMPLETE / F08_PARTIAL / HUMAN_REVIEW_PENDING.

The exact named recipient evidence now links to a staged factual follow-up. The real published assignment version and latest policy event are resolved on the server. An assignee must simultaneously retain active branch membership, `coordination.work`, and exact `RECIPIENT_STATUS_READ` plus `RECIPIENT_POLICY_MANAGE` grants for the source class/subject. Learning verifies only its latest immutable policy event (or an explicit no-change claim); private response and feedback content remain excluded. Coordination preserves source reauthorization, exact replay, stale-evidence denial, separation of proposer/reviewer and immutable history.

Migrations `20261017170000_coordination_learning_source` and `20261017171000_coordination_source_pair_checks` are applied to both local databases; each has 75 migrations and none pending. Focused unit, real-PostgreSQL and sequential one-worker desktop/mobile evidence is recorded at [F08-B Learning follow-up](../../evidence/principal-f08-learning-followup-2026-10-17/README.md). Direct visual inspection found and corrected source-specific withdrawal language. The reference is a workflow explorer dialog, while the production implementation uses the approved routed evidence/create/receipt/detail recipe.

F08 remains PARTIAL for LEA-18: its aggregate feedback-turnaround cohort needs a distinct versioned owner source and subject-lead predicate. Named recipient evidence cannot be reused to imply that aggregate authority. Human review, font portability, native accessibility, TEN-03, retained-note production policy and deployment remain pending.

## F08-C / LEA-18 feedback-return follow-up

Status: ENGINEERING_COMPLETE / DIRECT_COMPARISON_COMPLETE_WITH_DEVIATIONS / HUMAN_REVIEW_PENDING.

The aggregate `feedback-turnaround.v1` contract remains aggregate. A separate safe projection now cursor-paginates exact accepted submissions with no first published feedback version. It returns assignment/class/subject and acceptance time, while excluding learner identity, response text, feedback drafts and Teacher-performance labels. A distinct `LEARNING_FEEDBACK_SUBMISSION` Coordination source resolves one immutable accepted attempt and its earliest immutable student-facing feedback publication.

Exact assignee authority requires active branch membership, `coordination.work` and an exact class/subject `FEEDBACK_FOLLOW_UP` Learning manager grant. A private draft is rejected as closure evidence. Publication version 1 for the exact submission is accepted; later versions do not reset the source fact. Principal read/create and independent verification continue through live `learning.read_leadership`, release, entitlement, activation and branch checks. Revoking the assignee's exact Learning grant removes protected request access.

Forward migration `20261017172000_coordination_learning_feedback_source` is applied to development and `vyapti_vschool_test`; both have 76 migrations. It extends existing value/pair constraints and the deferred conditional source-integrity trigger without changing applied history. The manager-grant and Coordination tables remain TEN-ADR-006 Path A and blocked from production/real-client use by TEN-03 and retained-note policy.

Verification on the current implementation: Coordination/reporting unit 23/23; full affected real-PostgreSQL Learning file 19/19; TypeScript, focused lint, backend, boundaries, docs and 111-table database design; normal and isolated production builds; filtered one-worker Chromium 3/3 and mobile 3/3 across the staged journey plus aggregate/reference states. The initial browser attempt reused a stale `.next-e2e` build and failed before exercising the new UI; rebuilding the isolated target resolved it without changing product assertions. Screenshots were directly inspected at 1440×1000 and 390×844. Evidence: [F08-C feedback follow-up](../../evidence/principal-f08-feedback-followup-2026-10-17/README.md).

F08 and LEA-17/18/19 are engineering-complete. Human review, font portability, native accessibility, Coordination operational-note retention/backup-deletion policy, TEN-03 and deployment remain pending.
