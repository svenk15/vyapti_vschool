# LEA-27 purpose-scoped decision inbox evidence

Status: engineering complete for the approved synthetic-only registered-owner scope; direct visual comparison complete with documented routed-shell/font deviations; human review pending.

Verified product source: `26fdc0f0216623d654042d4fcc368432156ca126`. Normal production build: `uvdcAQaNC1HS8F_B_SCVG`.

The approved authority is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow **LEA-27 — Work from a purpose-scoped decision inbox**. The production route is `/leadership/decisions` and uses recipe L from the adopted Principal production UX contract.

## Implemented outcome

- Exact search uses the displayed, unambiguous `COORD-<full request UUID>` and never broadens Person or source identity lookup.
- Filter values come from the registered owner contract: Attendance or Learning follow-up, Ready for review, and the factual due partitions overdue, next seven days, later or no due date.
- Due/submitted ordering and pagination run inside the scoped owner query with a stable request-ID tie-breaker. A cursor is bound to the full query and rejected after any search/filter/sort change.
- Every row remains branch scoped and current-authorized. Opening it re-reads owner evidence and allowed actions; inbox read still grants no decision authority.
- No schema or migration changed; development and test retain 87 migrations.

## Verification

- Focused unit: `test/unit/coordination-requests.test.ts` — 11/11 passed.
- Real PostgreSQL: `test/functional/coordination-requests.test.ts` — 15/15 passed against `vyapti_vschool_test`; exact lookup, type partition, no-due predicate, invalid cursor, scope/revocation and exact replay are covered.
- Sequential one-worker Playwright: the changed typed-owner journey passed 1/1 Chromium and 1/1 mobile. It exercises exact search, type/state/due filters, submitted-time sort, owner detail, response-loss recovery and revoked-result denial. The first desktop attempt failed only because a test locator also matched the Clear button; the locator was narrowed to the named searchbox and both viewports then passed.
- `pnpm check` passed lint, TypeScript, 30 documentation checks, 136 database contracts, backend boundaries/compilation and 210/210 unit tests.
- Normal production build `uvdcAQaNC1HS8F_B_SCVG` passed for exact source `26fdc0f0216623d654042d4fcc368432156ca126`.

## Direct visual inspection

`application-inbox-chromium.png` and `application-inbox-mobile.png` were opened beside `reference-lea-27-chromium.png` and `reference-lea-27-mobile.png`. The production route preserves the approved hierarchy and interactions through the established Principal shell: clear heading, one aligned list toolbar, visible applied-filter count, compact sort action, readable owner-backed table and content-sized row action. The mobile toolbar stacks without viewport overflow and the table becomes labelled records. The approved source is a workflow explorer rather than a complete production page, so the routed shell and persistent navigation are the accepted production mapping, not pixel identity. The documented font-portability exception, native accessibility and actual browser 200% zoom remain outstanding.

Human acceptance remains PENDING. TEN-03, retention/provider/restore/load and production-enable gates remain unchanged.
