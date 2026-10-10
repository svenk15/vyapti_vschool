# SA-COMP-06 integrated School Administrator evidence

Verified 10 October 2026 on source `6f8983b1927d84380d727ec48185a9c0877f52e0` (application behavior commit `31a40ba458bac8a4201c60e8ddc9626791a4227c`). Human review is **PENDING**.

> Status correction, 10 October 2026: the [evidence-based completion review](../sa-completion-review/README.md) preserves these executed integration results but supersedes the earlier claim that 28 complete approved workflows were proved. Six approved workflow bodies are partial and SA-08 remains blocked.

## Demonstrable outcome

The connected synthetic Phase 1 demo provides the authorized School Administrator workspaces for overview/readiness, settings, branch metadata and activation, branding, staff access and profiles, academics, classes and teachers, students, roster import, attendance scheduling/reporting and privacy-safe branch activity. Teacher sign-in provides the assigned-day and roll-call journey. The commercial request portion of SA-08 remains `BLOCKED_BY_PRODUCT_DECISION`; `/admin/modules` truthfully manages approved branch activation and explains that blocked selections do not create a request.

No SA-COMP-06 schema or migration was added. The existing 33 forward migrations are current in the test database during both PostgreSQL and browser setup. `pnpm demo:seed` completed against guarded local `vyapti_vschool`, preserved existing records and credentials, and reported the connected teacher date `2026-10-06` with three assigned sessions.

## Automated evidence

- `pnpm check`: passed; lint, TypeScript, documentation, 52-table database design, boundaries, portable backend compilation and 120 unit tests.
- `pnpm test:functional`: 115/115 passed across 17 files on real `vyapti_vschool_test` PostgreSQL.
- `pnpm test:e2e`: 94/94 passed across desktop and mobile Chromium using real APIs and PostgreSQL.
- `pnpm build`: passed on source `6f8983b`; all production routes compiled.
- Rendered audit: [64 route/view observations](route-audit.json) passed at 1440×1000, 390×844 and a 720 CSS-pixel layout equivalent for 200% zoom, with no document overflow.
- `pnpm demo:seed`: passed after the integrated tests; it did not reset or overwrite manually owned records.
- Final health probe at `http://127.0.0.1:3400/api/health`: `ready: true`.

The broad browser run emitted existing Node `pg` concurrent-query deprecation warnings and one transient closed screenshot stream message; all 94 assertions completed successfully. Native browser zoom, VoiceOver and NVDA were not executed and remain release evidence gates.

## Visual inspection

The captured administrator overview, module access, activity, student directory, import workspace, branded sign-in and populated teacher day were inspected for hierarchy, spacing, alignment, action placement, density and overflow. Representative evidence:

- [Administrator overview desktop](admin-overview-desktop.png) and [mobile](admin-overview-mobile.png)
- [Branch module access desktop](module-access-desktop.png) and [mobile](module-access-mobile.png)
- [Branch activity desktop](branch-activity-desktop.png) and [mobile](branch-activity-mobile.png)
- [Student directory desktop](student-directory-desktop.png) and [mobile](student-directory-mobile.png)
- [Roster import desktop](import-workspace-desktop.png) and [mobile](import-workspace-mobile.png)
- [Teacher day mobile](teacher-day-mobile.png)
- [School-branded sign-in](branded-sign-in-desktop.png)

The first audit correctly exposed a startup configuration mismatch: the server had been started without `VSCHOOL_RELEASED_MODULES`, so the student workspace failed closed despite valid branch activation. The candidate was restarted with the documented Phase 1 release manifest. No authorization fallback, hardcoded display data or database mutation was used to mask the failure.

## Stable local demo

Entry URL: `http://127.0.0.1:3400/sign-in`

Startup configuration:

```bash
VSCHOOL_RELEASED_MODULES=academic_core,attendance,staff_core,student_core pnpm start --hostname 127.0.0.1 --port 3400
```

Seed command: `pnpm demo:seed`

Private local credentials are in ignored files; their values are not committed or printed:

- School Administrator and teacher: `artifacts/people-02/private-demo.json`
- Institution Administrator: `artifacts/iam-01/private-demo.json`

The published fictional school brand is available at `http://127.0.0.1:3400/sign-in/vschool-demo-69a6f7fe`.

## Consolidated manual walkthrough

1. Sign in with the School Administrator persona. Confirm the overview shows the current branch, today's attendance summary, setup exceptions and common actions. Open School setup and School settings; verify the institution/branch context remains visible.
2. Open Staff access and Staff profiles. Review current membership state, the invitation recovery action and teacher eligibility. Open Academic setup and Classes and teachers to review the active year, grade/section/subject catalog, offering and assigned teacher.
3. Open Students, search the synthetic directory, open a detail record and review placement/history. Use the name-correction form only with a fictional record and reason. Open Roster preview and upload `artifacts/imports-01/sample-roster.csv`; preview before any confirmation.
4. Open Schedule sessions, the attendance report and Branch activity. Review a session and its safe activity detail. The report range `2026-10-06` through `2026-10-07` exercises the connected data.
5. Sign out and use the teacher persona. Open My teaching day, choose `2026-10-06`, then confirm three assigned sessions appear with scheduled/submitted actions. Open a session to review or take attendance according to its state.
6. Sign out and use the Institution Administrator persona. Open Branch module access. Confirm current contracts/releases are server-derived; preview an unavailable selection and verify it is blocked without creating a commercial request.
7. Open the branded sign-in URL above and confirm the fictional school identity appears before authentication without granting tenant access.

## Remaining gates and blockers

- SA-08 commercial capability request submission has no approved owner, permission, lifecycle, receipt or persistence contract and remains `BLOCKED_BY_PRODUCT_DECISION`.
- TEN-03 RLS enforcement, restricted runtime connection and non-forgeable context proof remain incomplete; production and real-client onboarding stay blocked.
- Native VoiceOver, NVDA and native 200% browser zoom evidence remains outstanding. The CSS layout-equivalent check is not a substitute.
- Production mail/provider review, restore/reconciliation, retention/legal review and pilot/load evidence remain outstanding.
- Human visual and product acceptance is PENDING. This evidence does not claim production readiness.
