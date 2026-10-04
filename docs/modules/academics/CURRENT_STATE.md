# Academic setup and teaching context — current state

Last updated: 2026-10-04. Fresh independent-project state; no imported task completion. Design revision 2. No active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| ACA-01 | VERIFIED | PENDING | [Local verification](../../evidence/academics-01-local/verification.json); 63 unit, 48 PostgreSQL and 58 desktop/mobile browser tests passed |
| ACA-02 | NOT_STARTED | NOT_REQUESTED | Depends on ACA-01 implementation; human review is not an explicit dependency |
| ACA-03 | NOT_STARTED | NOT_REQUESTED | Depends on ACA-02 and PER-02 |

## Current checkpoint

ACA-01 source commit `fc3fc6c294be5ec51c9abbb5c4481ace10809679`. It implements the complete first academic setup slice: trusted release and tenant guards, draft year with unpublished calendar, adjacent nonoverlapping terms, grade/subject catalogs, sections, transactional evidence and the shared-token screen. The unrelated untracked `.puku-cli/` directory remains untouched and excluded.

Migration `20261004000900_academic_setup` is applied to `vyapti_vschool` and `vyapti_vschool_test`. The local migrated business table count is 29. The dedicated test database is separate from the development database; neither database was reset or deleted. JUnit reports and exact build/test metadata are in the linked evidence directory.

## Demo and manual review

The production-mode local snapshot for the tested source commit is running at http://127.0.0.1:3407. The trusted process releases only `academic_core`; the default server manifest remains deny-all. The existing synthetic IAM demo account is enabled for this branch through TEN-02 application commands. Authenticated screen/API and protected unauthenticated states were smoke-checked.

1. Open http://127.0.0.1:3407/sign-in and sign in with the existing synthetic IAM demo credentials from the private local artifact.
2. Open http://127.0.0.1:3407/admin/academics. Expect an empty setup workspace with school/institution context and accessible year, term, grade, subject and section forms.
3. Create year `AY2026`, name `Academic Year 2026–27`, from 2026-04-01 through last included date 2027-03-31. Expect a DRAFT year and an unpublished calendar draft.
4. Save the two adjacent terms. Expect T1 ending exclusively on 2026-10-01 and T2 beginning on 2026-10-01. Refresh and confirm both remain.
5. Add grade code `8`, Grade 8; subject `MATH`, Mathematics; and school-wide section `A`, Section A. Expect each saved in the workspace after refresh.
6. Move Term 2’s first included date to 2026-09-01 and save. Expect an overlap validation error with no stored changes. Add Section A again; expect a conflict error and no duplicate.

Human review remains PENDING until owner feedback is received. Automated verification does not change acceptance status. Preserve the running snapshot while review is pending; address reported defects before dependent work.

## Next action

ACA-02 is eligible: its documented dependency is ACA-01 implementation, and it does not require ACA-01 human acceptance. Continue with the calendar publication and year-transition vertical slice while preserving this ACA-01 build for review.

## Pending decisions / limitations

Pilot deployment/provider, staff activation delivery procedure, backup/restore targets and school retention requirements must be resolved in FND-02 before real-data release. ACA-01 creates an unpublished calendar only; publishing revisions and opening/closing years are ACA-02. ACA-01 synthetic local tests and demo contain no real pupil PII.

## Evidence history

### ACA-01 — 4 October 2026

Source/tested commit: `fc3fc6c294be5ec51c9abbb5c4481ace10809679`; build ID `-DXsQ7qoiBBSjZnBWIGIx`. Changed paths cover academic domain/application/infrastructure, composition and HTTP/UI adapters, shared DTOs, schema/migration/catalog/design and tests. Migration `20261004000900_academic_setup` applied to both named local databases.

`pnpm check` passed (lint, typecheck, docs, database design, boundaries, backend compilation and 63 unit tests). `pnpm test:functional` passed 48 tests against real `vyapti_vschool_test`. `pnpm test:e2e` passed all 58 desktop/mobile journeys; the ACA-01 journey creates and refreshes the setup, then verifies overlap and duplicate failures. `pnpm build` passed. `git diff --check` passed. Reports: [unit](../../evidence/academics-01-local/unit.junit.xml), [functional](../../evidence/academics-01-local/functional.junit.xml), [Playwright](../../evidence/academics-01-local/e2e.junit.xml).

Demo: http://127.0.0.1:3407, production snapshot for the tested commit; health 200, sign-in 200, protected route redirect 307, unauthenticated API 401, synthetic authenticated setup page visible, workspace API 200. Manual feedback: PENDING. Next task: ACA-02.
