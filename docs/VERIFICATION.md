# Starter verification — current and historical evidence

Prepared 3 October 2026. v4.4 physically separates portable backend, shared contracts and Next hosting adapters; the vs_ prefix is retained. Current source checks and build are listed separately; historical v4.2 PostgreSQL/browser evidence below is retained and does not verify the new live migration. Owner Mac verification and human acceptance remain pending.

## Current v4.4 checks

Naming/catalog checks passed for all 47 contracts; documentation checks passed for 29 tasks. Lint, TypeScript, Prisma generation, boundary checks and 26 unit tests passed. [Current unit evidence](evidence/starter/unit-v44.junit.xml). Production build passed. Independent backend compilation using Node types and no Next/DOM plugin passed. Portable composition ran under Node with a TypeScript loader without a Next host; undefined configuration produced the expected safe not_configured result. Three temporary dependency violations were rejected (Next in domain, React in shared contracts, backend in browser) and the clean source passed. [Extraction evidence](evidence/starter/backend-extraction-proof.json). The tsx CLI initially hit an IPC socket restriction; using its Node loader avoided opening that socket and the smoke check passed. No Nest runtime/controller/authentication cutover has been installed or tested.

The forward migration 20261003000300_vs_prefix and updated physical-schema functional assertion are supplied, but a live PostgreSQL rerun was not completed: this execution environment could not access/start the earlier temporary cluster under its non-root owner. No current PostgreSQL migration success is claimed. Run pnpm db:setup, pnpm test:functional and pnpm test:e2e locally before accepting FND-01.

## Historical v4.2 executed checks

| Check | Result |
|---|---|
| Frozen-lockfile dependency install | Passed, pnpm 11.25.0 |
| Lint, TypeScript, Prisma generation | Passed |
| Core import-boundary check | Passed; static check plus source review, not a security proof |
| Database design consistency | Passed: 47 physical table contracts; LLD/catalog and Prisma mappings agree |
| Migration upgrade / clean install | Passed: existing marker ID/timestamp preserved; clean two-migration deployment and repeat deploy verified |
| Documentation links / task design coverage / statuses / dependency cycles | Passed: 11 module packs, 29 tasks |
| Unit tests | 26 passed; readiness, module policy, dependency closure and palette validation |
| Functional tests | 4 passed against real PostgreSQL, including physical table/column/PK mapping |
| Browser tests | 12 passed across desktop/mobile projects |
| Production build | Passed with Next.js webpack |
| Screenshot review | Desktop and 390px mobile reviewed; no horizontal overflow in tested viewport |
| Next task selection | FND-01, read-only, no run/timer started |

Evidence: [unit](evidence/starter/unit.junit.xml), [functional](evidence/starter/functional.junit.xml), [browser](evidence/starter/e2e.junit.xml), [desktop landing](evidence/starter/landing-chromium.png), [mobile landing](evidence/starter/landing-mobile.png), [branded login](evidence/starter/login-chromium.png), [mobile login](evidence/starter/login-mobile.png), [configuration](evidence/starter/configuration-chromium.png), [table](evidence/starter/table-chromium.png), [component gallery](evidence/starter/gallery-chromium.png).

Commands executed: `pnpm install --frozen-lockfile --store-dir <temporary-store>`, `pnpm setup:local`, `pnpm setup:local --test`, `pnpm db:setup`, `pnpm check`, `pnpm test:functional`, `pnpm test:e2e`, `pnpm build`, `pnpm next-task`.

## Environment and limitations

Linux, Node 24.19.0, pnpm 11.25.0, Next 16.3.8, React 19.2.8, TypeScript 5.9.3, Prisma 7.10.0, Vitest 5.0.3, Playwright 1.63.0. Temporary isolated PostgreSQL 16.14 test cluster; the intended Mac installation is PostgreSQL 16.15 and must be verified locally. Development and test databases were separate with dedicated limited roles. No previous project data was used.

Restricted sandbox networking/subprocess behavior initially blocked install/DB/build commands; permitted retries succeeded. The environment's standard browser download was truncated; final E2E used the available Chromium executable through the documented optional PLAYWRIGHT_CHROMIUM_EXECUTABLE override. Mac instructions use Playwright's standard Chromium installation; that Mac download was not tested here. No test failure is hidden as a passing Mac run.

Mermaid diagrams were reviewed structurally but not rendered by an automated Mermaid renderer. Only vora_platform_setup_check (logical SetupCheck) is migrated. Shared UI components, synthetic configuration and login previews, and pure module/branding policies are implemented. Real authentication, persistent tenant and module settings, attendance, imports and school permission enforcement are not implemented yet. Their DB/security test strategies are specifications, not executed tests. The functional suite validates the foundation marker, transaction rollback and actual Vora physical schema, not tenant SQL isolation. No production deployment or production restore was performed. The starter is not a production release.

## Vora schema verification

Forward migration 20261003000200_vora_naming was applied to the previous synthetic test baseline. The original starter marker ID and created_at value remained identical; no DROP/CREATE or row copying was used. A separate disposable database applied both migrations successfully, then repeated deployment reported no pending migration, and a physical insert/read succeeded. The disposable database was removed afterwards. [Migration evidence](evidence/starter/migration-proof.json) records these checks. Initial verification attempts used the temporary cluster’s default port and failed to connect; the cluster was restarted on dedicated port 55441 before the successful runs.

## UI review and correction record

Reviewed desktop landing, configuration, login and data table plus 390px mobile landing/login screenshots. Browser checks cover table search/sort/pagination, keyboard tabs, dialog dismissal/focus return, brand scoping, Fees-only dependencies and non-persisting preview behavior. An initial browser run exposed two accessible-name selector mistakes and mobile overflow from a container and tooltip; these were corrected before the final passing run. A final CSS adjustment clips the unfocused skip link while retaining keyboard focus. No full WCAG certification, screen-reader review, Safari/Firefox run or production load test is claimed.

## Current source fingerprint

SHA-256 for shipped executable/config/test files, sorted relative paths separated from contents by NUL (documentation and CSV excluded):

`c862a0aee1e12266d49940076372c7f5624678466a78710eeea26156935aca4b`

SHA256SUMS.txt covers all packaged files except itself. No Git commit is claimed for the generated archive; create a local checkpoint after setup. Test databases, .env, generated client, dependencies and build artifacts are excluded. Selected sanitized reports/screenshots are deliberately included under docs/evidence.

## Project rename checkpoint

Project package and root folder were renamed to vyapti_vschool after the v4.4 source checks/build. This changes project metadata and setup instructions only; executable business/UI logic, lockfile dependencies and migrations are unchanged. Documentation/catalog/boundary checks were rerun after the rename. No new database or browser run is claimed for this metadata-only change.

## Database-name revision

Development setup/guards now require vyapti_vschool; test setup/guards require vyapti_vschool_test. The private environment file and any existing database are not automatically rewritten. Local rename instructions preserve the database owner, data and migrations. pnpm check passed for this revision, including lint, TypeScript, backend compilation, documentation/catalog/boundary gates and 26 unit tests. The setup script was also verified to reject the existing previous database path while preserving .env. a live database rename was not executed here. Historical PostgreSQL evidence retains its actual previous database names.
