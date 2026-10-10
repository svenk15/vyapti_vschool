# SA-COMP-11 — SA-13 descriptive staff category

SA-13 is implementation-VERIFIED on the 10 October 2026 checkpoint; human review remains PENDING. New Employee profiles require Teaching, Administration or Support. Existing Employee rows are preserved as UNCLASSIFIED until an administrator explicitly corrects them with a reason and current version. Category is displayed in the real staff directory and has no effect on accounts, memberships, grants, teaching eligibility or setup responsibility.

Persistence and migration:

- Forward migration `20261010013000_employee_staff_category` adds the non-null checked column and backfills existing rows through the `UNCLASSIFIED` default. It is applied to `vyapti_vschool` and `vyapti_vschool_test`; each has 36 applied migrations.
- The People owner retains the serializable account → Organization → School guard and current `class.manage` authorization. Category corrections CAS Employee version and atomically append the existing receipt, audit and outbox evidence.
- Prisma, the People LLD, table registry and physical table page agree. No category index is needed for the current scoped staff-number ordered read.

Verification:

- Focused People unit suite: 4/4 passed, covering accepted create values, client denial of UNCLASSIFIED and normalized correction input.
- Guarded real PostgreSQL People suite: 10/10 passed. It covered default/NOT NULL contract, explicit category persistence, replay, stale correction, foreign-scope denial, safe audit before/after and unchanged active Teacher state.
- Desktop and mobile production-build People journeys passed 1/1 each. They created categorized same-name staff, persisted/reloaded categories, made a reasoned correction, retained NOT_ENABLED teaching state, and preserved existing duplicate, validation, binding and employment recovery paths. An initial desktop attempt failed only because a label locator also matched the dialog close button; the corrected exact accessible-label locator passed without changing product behavior.
- `pnpm demo:seed` passed twice against the guarded development database. The first run added fictional `Robin Support`; the second preserved it without duplicates. Existing staff, records and credentials were not overwritten.
- `pnpm check:db-design` and `pnpm typecheck` passed before the browser runs. The integrated repository check is recorded at the focused commit checkpoint.

Visual evidence: `staff-profiles-chromium.png` and `staff-profiles-mobile.png`. The shared form, table and mobile scroll behavior were inspected; category is aligned with other status columns and the page itself has no horizontal overflow.

TEN-03 restricted-role/RLS proof and native VoiceOver/NVDA evidence remain separate gates. This checkpoint does not claim production readiness.
