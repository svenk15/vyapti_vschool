# EX-03 controlled list and command-state evidence

Implementation completed 10 October 2026 from baseline `f856f64`. The focused commit containing this record is the executable checkpoint; human review is PENDING.

## Demo outcome

The design-system gallery now demonstrates the production ListToolbar, FilterDrawer, SortDrawer and CommandFeedback compositions with fictional records. Search commits on Enter, Clear commits an empty search, changing the selected attribute does not focus the search input, and Filters/Sort remain adjacent to the flexible search control. Drawer drafts change only on Apply; Cancel and Escape discard them and return focus. Multi-select filters stay expanded. Sort by and Order by start expanded. Unknown command feedback retains the same displayed request key for Check status and Retry same request.

The real Students directory consumes the same toolbar and filter drawer. It calls the existing protected Students server listing for combined name/admission search and `ACTIVE`, `ARCHIVED` or `ALL` status. Applied query state is represented only by these validated URL fields, browser Back/Forward restores it, and every change drops the prior cursor. No partial client page is filtered as though it were complete. The screen has no Sort control because the Students owner currently exposes no server sort contract.

No owner facade, API response, persistence write, transaction, idempotency rule, table, migration or dependency changed. The shared contract added here is browser-safe presentation state only.

## Verification executed

- `pnpm lint` and `pnpm typecheck` passed during implementation.
- `pnpm test:e2e test/e2e/design-system.spec.ts test/e2e/starter.spec.ts test/e2e/students-registration.spec.ts test/e2e/student-transfer.spec.ts` passed 26/26 on desktop and mobile after resolving a search-landmark accessible-name ambiguity.
- New attribute-focus and browser Back/Forward cases were then added. The next combined run passed 24/26; its only failures were the test assumption that Playwright `selectOption` focuses a select. The control was focused explicitly to model keyboard use. The final affected gallery rerun passed 10/10.
- The final real Students rerun passed 2/2 after visual inspection led to compact directory-cell padding and a short visible View action with a student-specific accessible name. The unchanged starter and transfer journeys passed 14/14 in the immediately preceding build.
- These browser runs used real `vyapti_vschool_test` PostgreSQL, built the production application and reported all 31 migrations applied with none pending.
- Guarded `pnpm demo:seed` completed against local `vyapti_vschool`, reused the existing fictional People, Students, Academics and Attendance fixtures and preserved private credential files.

The screenshots were inspected for hierarchy, toolbar spacing, table/action visibility, dialog proportion and document overflow. The populated Students directory fits all desktop columns at 1440×1000; mobile retains the table inside its horizontal scroll region with no document overflow. The filter drawer is proportionate on desktop and fills the available mobile workspace without clipping its Apply/Cancel actions.

- [Students desktop](students-chromium.png)
- [Students mobile](students-mobile.png)
- [Gallery desktop](gallery-chromium.png)
- [Gallery mobile](gallery-mobile.png)
- [Filter drawer desktop](filter-drawer-chromium.png)
- [Filter drawer mobile](filter-drawer-mobile.png)
- [Gallery computed observation](gallery-observation.json)

The repository in-app browser launcher still references a missing browser-service module, so repository Playwright produced this evidence. Native VoiceOver, NVDA and native 200% zoom remain separate DS-02 gates. TEN-03 remains an incomplete production gate.

## Manual demo

Entry URL: `http://127.0.0.1:3400/sign-in`. Use the fictional administrator in ignored `artifacts/people-02/private-demo.json`; do not copy its values into documentation or source control.

1. Run `pnpm demo:seed`, sign in as the People administrator, and open Students. Expect the populated authorized directory, compact search toolbar, `Filters (1)` and a visible named View action.
2. Type an admission number and press Enter. Expect the URL and server result to update without a Search button. Use Back and Forward; expect the query text and server rows to restore. Click Clear; expect the default active list.
3. Open Filters, choose Archived students and Cancel. Expect the active list to remain. Reopen, choose Archived students and Apply filters. Expect the URL/status and server rows to change and focus to return to Filters.
4. Open `/design-system#data`. Change Search by from Student to Class and confirm the search input does not steal focus. Open Filters, choose two statuses and Cancel, then apply them on the next open. Open Sort and apply Class descending.
5. In Feedback, inspect “The outcome is not known.” Expect the fictional request key to remain visible when using Check status or Retry same request. Narrow to 390px; expect the toolbar to stack, drawer actions to remain reachable, and no page-level horizontal overflow.

Known limits: the gallery sort/filter is fictional component evidence. The real Students listing supports one combined search and one status selector only. Native assistive-technology and owner visual acceptance remain PENDING.
