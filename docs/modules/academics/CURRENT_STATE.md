# Academic setup and teaching context — current state

Last updated: 2026-10-04. Fresh independent-project state; no imported task completion. Design revision 3. No active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| ACA-01 | VERIFIED | PENDING | [Local verification](../../evidence/academics-01-local/verification.json); 63 unit, 48 PostgreSQL and 58 desktop/mobile browser tests passed |
| ACA-02 | VERIFIED | PENDING | [Local verification](../../evidence/academics-02-local/verification.json); 65 unit, 50 PostgreSQL and 58 desktop/mobile browser tests passed |
| ACA-03 | NOT_STARTED | NOT_REQUESTED | Depends on ACA-02 and PER-02 |

## Current checkpoint

ACA-01 source commit `fc3fc6c294be5ec51c9abbb5c4481ace10809679`. It implements the first academic setup slice: trusted release and tenant guards, draft year with unpublished calendar, adjacent nonoverlapping terms, grade/subject catalogs, sections, transactional evidence and the shared-token screen. ACA-02 source commit `69fb440a4427249c73fc45d2b06b33682adf2466` adds immutable calendar publication/evaluation and guarded year open/close, including failure states. The unrelated untracked `.puku-cli/` directory remains untouched and excluded.

Migrations `20261004000900_academic_setup` and `20261004001000_academic_calendar` are applied to `vyapti_vschool` and `vyapti_vschool_test`. The local migrated business table count is 31. The dedicated test database is separate from the development database; neither database was reset or deleted. ACA-02 JUnit reports and exact build/test metadata are in the linked evidence directory.

## Demo and manual review

ACA-01's production snapshot remains at http://127.0.0.1:3407. ACA-02's production-mode local snapshot for source commit `69fb440a4427249c73fc45d2b06b33682adf2466` is running at http://127.0.0.1:3408 (build ID `4vhyqb3lnk32X0VH1Itfk`). Its trusted process releases only `academic_core`; the default server manifest remains deny-all. The existing synthetic IAM demo account is enabled through TEN-02 application commands. On the ACA-02 snapshot, live health returned 200, unauthenticated workspace API returned 401, protected screen redirected 307, and synthetic account sign-in reached the Academic setup workspace.

ACA-02 manual journey at http://127.0.0.1:3408:

1. Sign in at `/sign-in` with the existing synthetic IAM demo account and open `/admin/academics`.
2. Create a year with a unique code such as `AYDEMO28`, name `Academic Demo 2028–29`, from 2028-04-01 through last included day 2029-03-31. Expect a DRAFT year with an unpublished calendar.
3. Save the two adjacent terms, then select Monday–Friday, set a holiday on 2028-10-02 labelled `Founders Day`, and publish. Expect immutable revision 1 to appear in the history.
4. Evaluate 2028-10-02. Expect “Non-teaching day · SCHOOL_EXCEPTION · Founders Day”; evaluate 2028-10-03. Expect “Teaching day · WEEKLY_RULE”.
5. Open the year. Expect status OPEN and the term-save control disabled. Close this empty year; expect CLOSED and a message that its terms/calendar can no longer change.

Human review remains PENDING until owner feedback is received. Automated verification does not change acceptance status. Preserve the running snapshot while review is pending; address reported defects before dependent work.

## Next action

ACA-02 automated verification is complete; human review remains PENDING and no acceptance is inferred. Continue with the next eligible task from `pnpm next-task`, honoring explicit dependencies. Keep both academic snapshots stable during their pending reviews. The ACA-02 session-impact empty adapter may only ship while Attendance session storage/creation is absent; ATT-01 must replace it before session workflows are released.

## Pending decisions / limitations

Pilot deployment/provider, staff activation delivery procedure, backup/restore targets and school retention requirements must be resolved in FND-02 before real-data release. ACA-02's explicit `NO_ATTENDANCE_SESSIONS` adapter is valid only while attendance session storage/creation does not exist. ATT-01 must replace the adapter and add the real close-versus-schedule serialization test before session workflows are released. Tests and demo use synthetic records only.

## Evidence history

### ACA-01 — 4 October 2026

Source/tested commit: `fc3fc6c294be5ec51c9abbb5c4481ace10809679`; build ID `-DXsQ7qoiBBSjZnBWIGIx`. Changed paths cover academic domain/application/infrastructure, composition and HTTP/UI adapters, shared DTOs, schema/migration/catalog/design and tests. Migration `20261004000900_academic_setup` applied to both named local databases.

`pnpm check` passed (lint, typecheck, docs, database design, boundaries, backend compilation and 63 unit tests). `pnpm test:functional` passed 48 tests against real `vyapti_vschool_test`. `pnpm test:e2e` passed all 58 desktop/mobile journeys; the ACA-01 journey creates and refreshes the setup, then verifies overlap and duplicate failures. `pnpm build` passed. `git diff --check` passed. Reports: [unit](../../evidence/academics-01-local/unit.junit.xml), [functional](../../evidence/academics-01-local/functional.junit.xml), [Playwright](../../evidence/academics-01-local/e2e.junit.xml).

Demo: http://127.0.0.1:3407, production snapshot for the tested commit; health 200, sign-in 200, protected route redirect 307, unauthenticated API 401, synthetic authenticated setup page visible, workspace API 200. Manual feedback: PENDING. Next task: ACA-02.

### ACA-02 — 4 October 2026

Source/tested commit: `69fb440a4427249c73fc45d2b06b33682adf2466`; build ID `4vhyqb3lnk32X0VH1Itfk`. Implementation includes framework-free calendar rules and impact port, guarded Prisma repository writes, four thin routes, shared DTOs, calendar/year controls on the existing academic screen, immutable revision/exception schema, and the ACA-02 design reconciliation. Forward migration `20261004001000_academic_calendar` is applied to both `vyapti_vschool` and `vyapti_vschool_test`; it adds `CalendarRevision`, `CalendarException`, scoped/deferred current pointer FK and append-only triggers. The local business table count is 31.

`pnpm check` passed: lint, typecheck, docs, DB design (48 contracts), boundaries, backend compile and 65 unit tests. `pnpm test:functional` passed 50 tests against real PostgreSQL, including publication rollback on session impact, deferred current pointer, immutable history, missing calendar and pending-session close rejection. `pnpm test:e2e` passed all 58 desktop/mobile browser tests; the ACA-02 journey publishes/evaluates a holiday, opens the year, verifies term edit denial and closes a separate empty year. An initial full run had three unrelated mobile timing failures; those four tests passed in isolation and the subsequent full run passed cleanly. `pnpm build` passed on Next.js 16.3.8; `git diff --check` passed. Reports: [unit](../../evidence/academics-02-local/unit.junit.xml), [functional](../../evidence/academics-02-local/functional.junit.xml), [Playwright](../../evidence/academics-02-local/e2e.junit.xml).

Demo: http://127.0.0.1:3408; production snapshot for the tested commit. Live health 200; unauthenticated API 401; protected page redirect 307; synthetic sign-in and Academic setup workspace passed. Manual owner review: PENDING. ACA-01 human review remains PENDING on its unchanged port-3407 snapshot. Next task is selected by `pnpm next-task` after this checkpoint.
