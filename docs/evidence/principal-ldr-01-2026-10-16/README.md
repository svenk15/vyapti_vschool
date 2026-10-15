# LDR-01 Principal workspace evidence

Date: 16 October 2026. Human review: PENDING.

## Delivered behavior

- Explicit branch-scoped `PRINCIPAL` authority with only `leadership.read` and `self.read`.
- Trusted-operator provisioning through the existing versioned, replay-safe membership command.
- Staff-administrator denial for creation or alteration of Principal-bearing memberships.
- Live role-aware workspace selection, independently guarded `/leadership` entry, guarded branch switch, mobile navigation, self-account entry and immediate revocation denial.
- Honest owner-unavailable home state: no prototype values or inferred Attendance totals.
- Incremental guarded `pnpm demo:seed` support with the private result in ignored `artifacts/leadership-01/private-demo.json`.

## Database and verification

Forward migration `20261016000100_principal_branch_role` changes only `vs_access_role_grant_state_check` to allow `SCHOOL_ADMIN`, `TEACHER` and `PRINCIPAL`. It is applied to the designated development and test databases; both retain all 63 migrations. No database was reset and no prior migration was edited.

- Focused Access domain tests: 10/10 passed.
- Real PostgreSQL Access management: 8/8 passed, including operator provision, administrator denial, foreign scope denial and immediate revocation.
- Focused Playwright, one worker: 4/4 passed across Chromium desktop and mobile.
- Production build and isolated E2E build: passed.
- Repository checkpoint: lint, type generation, docs, 96-table database design, boundaries, portable-backend compilation and 164 unit tests passed. The first checkpoint detected a RoleGrant registry/LLD constraint mismatch; the registry was reconciled and the failed/remaining gates then passed.

JUnit evidence: [unit](unit.junit.xml), [functional](functional.junit.xml), [browser](e2e.junit.xml).

## Direct visual comparison

Authority: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, activities entry state. The source file initially opens its timetable subview; the test uses its own **Back to activities** control and does not modify the reference.

| View | Approved reference | Application |
|---|---|---|
| Desktop, 1440×1000 | [reference](reference-home-chromium.png) | [application](application-home-chromium.png) |
| Mobile, 390×844 | [reference](reference-home-mobile.png) | [application](application-home-mobile.png) |

The images were inspected directly. Shared hierarchy, restrained green palette, card borders/radii, responsive stacking, label scale and action emphasis are consistent. The reference is a fictional workflow explorer, while the application is the real authenticated portal shell with institution/branch controls and current authorization. The application therefore does not reproduce unreleased activity links, sample facts, design notes or reviewer controls. It shows explicit unavailable states until each owner projection is released. The reference capture itself renders one school-planning marker as a solid black shape under the local file runtime; no production component copies it.

Remaining deviations: the existing documented font-portability exception remains; native VoiceOver/NVDA was not performed. LEA-02 data-generation/stale-response proof awaits real LDR-02 projections. Human visual acceptance remains pending.
