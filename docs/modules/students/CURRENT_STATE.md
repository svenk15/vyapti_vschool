# Students, enrollment and placement history — current state

Last updated: 2026-10-04. This is an independent project checkpoint; no completion was imported.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| STU-01 | VERIFIED | PENDING | Real PostgreSQL, desktop/mobile Playwright, repository checks and build passed; local demo available |
| STU-02 | VERIFIED | PENDING | Depends on STU-01 and ACA-02 implementation; both are VERIFIED/PENDING and neither declares human PASSED as a dependency gate |
| STU-03 | NOT_STARTED | NOT_REQUESTED | Depends on STU-02 and ATT-01 |

## Current checkpoint

**STU-01 — Register and inspect students (4 October 2026):** implemented on `work/stu-01-after-per02-wip`; source commit and follow-up evidence commit are recorded below. The branch retains its explicit ancestry at the PER-02 WIP checkpoint; PER-02 remains BLOCKED/PENDING IAM-03 owner acceptance on `wip/per-02-before-iam03-acceptance`. STU-01 does not invoke PER-02 Teacher workflows and is implemented independently.

People owns organization-local Person creation and exact authorized Person lookup. Students owns branch Student registration. A new Person is the default; selecting an existing Person is explicit and exact-name lookup is separate from normal student list search. The Student migration adds `vs_students_student` with branch-scoped admission/person uniqueness, organization-qualified Person and School foreign keys, bounded status/name/admission reads and a scope/status list index. Tenant classification is BRANCH with `(organization_id,school_id)` scope; policy intent and TEN-03 closure are recorded under temporary Path A. Database RLS is **not enforced**; application authorization, release/entitlement/activation checks and scoped reads remain active.

Mutations serialize through account → Organization → School guards and commit People, Student, School revision and Platform-owned audit/outbox/receipt together. Failure rolls a new Person back. Read queries reauthorize on every request without write locks. Search cursors are signed and scope-bound. Receipts and outbox payloads exclude names and admission numbers.

## Evidence — STU-01

- Tested source commits: `f9e84b9f82335349e0387fffeccd54d05831b213` and focused cursor correction `3e5f825542656b2fb17ad784c4a57e1c29f0d991`; base checkpoint before task edits: `7308dcb` (`wip/per-02-before-iam03-acceptance`). The current-state evidence commit is documentation-only.
- Changed implementation: `backend/modules/{people,students}/`, `backend/composition/students.ts`, `backend/modules/platform/contracts/command-evidence.ts`, `backend/modules/platform/infrastructure/command-evidence.ts`, `shared/contracts/students.ts`, `lib/server/{student-http,students}.ts`, `app/api/v1/{people,students}/`, `app/admin/students/`, `app/admin/page.tsx`, `components/students-workspace.tsx`, `prisma/schema.prisma`, `prisma/migrations/20261004001500_student_registration/`.
- Changed task contract/catalog: `docs/modules/students/{DESIGN,TASKS,CURRENT_STATE}.md`, `docs/database/TABLE_REGISTRY.json`, `docs/DATABASE_DESIGN.md`; the same checkpoint also records the validated Path A/dependency/IMP/PER design reconciliations across affected LLDs and tenancy policy documents.
- Migration: `20261004001500_student_registration` is applied to local `vyapti_vschool` and `vyapti_vschool_test`; both configured migration ledgers reported 19 found/19 applied, with no pending migrations. No reset or destructive operation was used.
- Verification: `pnpm check` passed (lint, typecheck, docs: 30 tasks, DB design: 50 table contracts, boundaries, backend compile, unit: 80/80 across 12 files). `pnpm test:functional` passed against real PostgreSQL (71/71 across 13 files, including 4 STU-01 tests). `pnpm test:e2e test/e2e/students-registration.spec.ts` passed (2/2 desktop/mobile). `pnpm build` passed on Next.js 16.3.8. Reports: `artifacts/unit.junit.xml`, `artifacts/functional.junit.xml`, `artifacts/e2e.junit.xml`.
- Full browser-suite note: `pnpm test:e2e` ran 66 tests; 60 passed and 6 failed. The first run exposed STU-01 E2E fixture/test issues, subsequently fixed and the targeted desktop/mobile STU-01 journey passed. Other failures were in mobile branding-management and tenancy journeys under the full serial run; they remain unrelated, unresolved repository-wide E2E failures and are not represented as passing.
- Database status is physical migration evidence only. Table-level RLS is planned for TEN-03. Restricted runtime role, `ENABLE/FORCE ROW LEVEL SECURITY`, cross-tenant restricted-role tests and pooled context-leak tests have not been implemented.
- Local demo: `http://127.0.0.1:3412/admin/students`; task-specific standalone snapshot `artifacts/demos/STU-01/3e5f825542656b2fb17ad784c4a57e1c29f0d991/`, build ID `3_eAy6yTjxJ5FnFuZv4Vf`, with `student_core` release enabled. Health endpoint returned `alive:true`; `/sign-in` and `/admin/students` both returned HTTP 200. Demo account is the existing synthetic account in ignored `artifacts/iam-01/private-demo.json`; it has a local `student_core` entitlement and active branch configuration applied through Tenancy use cases. No credential is copied into this document.
- Human review: PENDING. Automated evidence is not owner acceptance.

## Evidence — STU-02 (4 October 2026)

- Implementation commit: `2cf3c9da357e24f0e10d09b4df2324618b35c3ef` on `work/stu-01-after-per02-wip`. The branch preserves the earlier PER-02 WIP ancestry; `wip/per-02-before-iam03-acceptance` remains unchanged and PER-02 stays BLOCKED until explicit IAM-03 human acceptance.
- Added Students-owned `Enrollment` and `SectionPlacement`, with `vs_` physical names, snake_case columns, scoped Student/AcademicYear/Section composite FKs, one Student/year unique key, date/version/roll checks, and timeline/roster indexes. Migration `20261004001600_student_enrollment` was applied forward to local `vyapti_vschool` and `vyapti_vschool_test`; both reported 20 migrations found/applied and no pending migration. No database reset or migration rewrite occurred.
- BRANCH classification, organization/school scope columns, policy intent, owner, and TEN-03 closure are in `TABLE_REGISTRY.json` under TEN-ADR-006 Path A. Runtime RLS remains unimplemented and deferred to TEN-03; application tenant/resource authorization remains active on every read/write. Academic labels/history are hidden if `academic_core` is inactive while Student access remains available.
- Verification passed: `pnpm check` (lint/typecheck/docs 30 tasks/DB design 50 contracts/boundaries/backend/unit 81/81); `pnpm test:functional` against real PostgreSQL (75/75 across 13 files, including enrollment races, rollback, scope/permissions, module suspension and history); focused Playwright enrollment journey desktop/mobile (2/2); `pnpm build` on Next.js 16.3.8. After adding list-summary presentation, lint/typecheck and the same desktop/mobile E2E passed again. A direct smoke test against the immutable demo snapshot passed (1/1); DB migration status was current. Reports are in `artifacts/unit.junit.xml`, `artifacts/functional.junit.xml` and `artifacts/e2e.junit.xml` (ignored local artifacts).
- Demo snapshot: `http://127.0.0.1:3413/admin/students`, tested commit `2cf3c9da357e24f0e10d09b4df2324618b35c3ef`, build `XEByftuaHQmRxBtt1p15b`, release manifest `academic_core,student_core`. Health returned `alive:true`; Playwright signed into the snapshot, opened the synthetic Student, verified the active Academic year choice and confirmed the student was still unenrolled. Private synthetic demo file `artifacts/students-02/private-demo.json` has mode 0600. Use it locally for the sign-in and student/year/section identifiers; no credentials are included here.
- Manual review: sign in at `http://127.0.0.1:3413/sign-in` using the private fixture; open Students and the fixture's admission number; choose its listed Academic year and Section A; set First included day and Last included day from the fixture, enter roll `0007`, and enroll. Expect saved feedback, history with the same inclusive dates and roll text, and active roster count 1. Refresh and verify history/list summary persist. Submit the same year again and expect a conflict; automated checks also confirm wrong-year section and duplicate requests fail without extra writes. Human review remains PENDING.

## Next action

Keep ports 3412 (STU-01) and 3413 (STU-02) available for review. Select the next task only when its implementation does not depend on pending feedback and its documented acceptance gates are met. PER-02 remains blocked until explicit IAM-03 acceptance.

## Pending decisions / limitations

TEN-03 must implement and verify RLS before multi-client production release. Migration 016 is installed locally but its tables are not RLS-enforced. Pilot provider, real-data privacy/retention and backup decisions remain release gates in FND-02.

## Evidence history

Append later task records without deleting this checkpoint. Human review remains PENDING until explicit owner feedback.
