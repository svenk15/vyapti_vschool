# F02 / LEA-03 temporary leadership delegation evidence

Status: engineering verification complete for synthetic-only D02 scope; direct reference comparison complete with the routed-production deviation described below; human acceptance PENDING. Production enablement, school approver/action configuration, TEN-03, font portability and native VoiceOver/NVDA remain pending.

Product checkpoint: `a3c7da1` (`Complete temporary Principal delegation`). Normal production build: `qCk9yMBZEprYlJB1zrOXP`.

## Delivered outcome

- Access owns a branch-scoped delegation root, exact allowlisted action rows, trusted-operator issue/revoke receipts and immutable events.
- Issue requires an active scoped membership, exact AccountPersonBinding and active People Employee. It rejects self-issue, wildcard/onward authority, windows over 30 days and overlapping same-action grants.
- Runtime resolution rechecks live account/token, branch membership, binding, Employee, half-open window, revocation and exact action on every protected request.
- Source authorization remains active. Communication is the first real consumer and separately checks release, organization entitlement, branch activation and `communication.read_leadership` before returning its bounded projection.
- The acting user chooses “Acting leadership”, sees the temporary role, exact actions, reason and branch-local window at `/leadership/delegations`, and loses the workspace immediately after revoke/expiry. Fixed roles are unchanged.
- `pnpm demo:seed` now invokes the repeat-safe F02 provisioner after the existing Teacher identity and Communication fixtures. It creates a new seven-day grant only when no active synthetic grant remains and never overwrites credentials or deletes history.

## Persistence and migrations

Forward migration `20261017190000_access_leadership_delegations` adds:

- `vs_access_leadership_delegation`
- `vs_access_leadership_delegation_action`
- `vs_access_leadership_delegation_receipt`
- `vs_access_leadership_delegation_event`

All four are BRANCH-class Path-A tables registered for TEN-03 closure. The database-design check then identified that the already-applied table-creation migration lacked its canonical SQL table comments. Forward-only migration `20261017190500_access_delegation_rls_metadata` adds only those comments; no applied migration was edited. `vyapti_vschool` and `vyapti_vschool_test` have all 79 migrations. Existing data was preserved; no reset, reverse migration or history rewrite occurred.

## Verification

| Check | Result |
|---|---|
| `pnpm exec vitest run test/unit/access-delegations.test.ts --config vitest.config.ts` | 6/6 passed |
| `pnpm test:functional test/functional/access-delegations.test.ts` | 1/1 passed against real PostgreSQL; 79 migrations current |
| `pnpm check:db-design` | Passed with 118 registered physical table contracts |
| `pnpm check:backend` / `pnpm check:boundaries` | Passed |
| `pnpm check:docs` / Principal package validator | Passed; 46 workflows and dependency DAG valid |
| `pnpm build` | Passed; normal production build `qCk9yMBZEprYlJB1zrOXP` includes `/leadership/delegations` |
| `pnpm typecheck` | Passed |
| Focused ESLint for F02 owner/UI/test files | Passed; the sole initial unused-request warning was corrected |
| Focused Playwright Chromium, one worker | 2/2 passed |
| Focused Playwright mobile, one worker | 2/2 passed |
| `node --import tsx scripts/demo-principal-delegation.ts` | Prepared or preserved the development fixture without printing secrets |

The first browser attempt exposed a test-fixture window beyond D02's 30-day maximum; the fixture was corrected rather than weakening validation. Two later failures were strict locator assumptions, while the application state was correct. The final desktop/mobile runs above supersede them. A build-reuse retry initially lacked sandbox permission for local PostgreSQL and failed with `EPERM`; the authorized retry used the same build and designated test database.

The focused commands validate the source committed as `a3c7da1`; the documentation-only provenance update does not change application behavior.

## Direct visual comparison

Authority: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow `LEA-03` (“Work under a temporary leadership delegation”). The explorer dialog supplies outcomes/stages. `docs/execution/PRINCIPAL_COMPLETION_PACK/SCREEN_MAP.md` maps it to the production recipe-W acting workspace rather than a browser grant-management dialog.

Directly inspected captures:

- [Application desktop](application-chromium.png)
- [Approved reference desktop](reference-chromium.png)
- [Application mobile](application-mobile.png)
- [Approved reference mobile](reference-mobile.png)

At 1440×1000 the application uses the established 240px Principal sidebar, compact top bar and bounded delegation card. At 390×844 it uses the accessible drawer shell and a single-column card with no page overflow. Both display acting status, exact scope, expiry and revocation consequence. The explorer's delegator/approver steps are not copied into the acting-user page because trusted issue/revoke has no browser route. This is the recorded production mapping, not a claim of pixel identity to the catalogue dialog.

## Demo

The normal demo entry is `http://127.0.0.1:3400`; its `/api/health` returned `ready:true` after starting build `qCk9yMBZEprYlJB1zrOXP` from checkpoint `a3c7da1`. Private credentials and seed-owned delegation identifiers remain in ignored `artifacts/leadership-01/private-demo.json`; values are never committed or printed. Run `pnpm demo:seed` for the connected suite or `node --import tsx scripts/demo-principal-delegation.ts` after its prerequisites. Sign in with the Teacher persona, choose **Acting leadership**, open **My acting access**, confirm the exact actions/window, then open **Notice coverage**. Trusted revocation is intentionally not exposed to the browser.
