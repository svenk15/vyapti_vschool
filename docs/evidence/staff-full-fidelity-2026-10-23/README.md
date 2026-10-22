# Administrator Staff full-fidelity checkpoint

## Candidate and reference

- Application source: working tree based on `c28f80d59b4db85deadb9045c9de44a7765d68bd`.
- Production build ID: `aYyd35WOsz-nLsnM8Mcgu`.
- Demo: `http://127.0.0.1:3400` (this working-tree build).
- Frozen reference: `docs/execution/STAFF_REVIEW/references/approved-20261022/mock/index.html`.
- Reference Site commit: `fc33c8b991134ade6d02e27fbe467ef67d86b085`; authority and hash are recorded in `docs/execution/STAFF_REVIEW/REFERENCE_FREEZE.md`.
- Browser comparison: Playwright Chromium at 100% default zoom and DPR 1. Desktop captures use 1440×1000; mobile captures use 390×844. Additional application checks cover 900×1000, 360×800 and all four themes.

`capture-provenance.json` records every URL, viewport, DPR and computed font. `final-measurements.json` records the measured toolbar, Filter button, table, Manage dialog and Profile section geometry.

## Reference/application comparison

| State | Desktop | Mobile | Result |
|---|---|---|---|
| Profiles directory | `reference-directory-desktop.png` / `application-directory-desktop.png` | `reference-directory-mobile.png` / `application-directory-mobile.png` | Header, tabs, toolbar, columns, rows, actions and pagination composition aligned. |
| Filters | `reference-filters-desktop.png` / `application-filters-desktop.png` | `reference-filters-mobile.png` / `application-filters-mobile.png` | Drawer, checkbox groups, action order and draft/apply behavior aligned. |
| Sort | `reference-sort-desktop.png` / `application-sort-desktop.png` | `reference-sort-mobile.png` / `application-sort-mobile.png` | Drawer, radio groups and action order aligned. |
| Manage | `reference-manage-desktop.png` / `application-manage-desktop.png` | `reference-manage-mobile.png` / `application-manage-mobile.png` | Dialog geometry, identity summary and action rows aligned; only authorized production actions are shown. |
| Profile | `reference-profile-desktop.png` / `application-profile-desktop.png` | `reference-profile-mobile.png` / `application-profile-mobile.png` | Hero, Personal, Employment, assignments, portal and history composition aligned to real owner data. |
| Assignments | `reference-assignments-desktop.png` / `application-assignments-desktop.png` | `reference-assignments-mobile.png` / `application-assignments-mobile.png` | Read-only drawer aligned; application retains the real dated assignment projection. |
| Portal/access from Profile | `reference-portal-desktop.png` / `application-portal-desktop.png` | `reference-portal-mobile.png` / `application-portal-mobile.png` | Drawer composition aligned to the authoritative account binding and invitation state. |
| Add staff | `reference-add-desktop.png` / `application-add-desktop.png` | `reference-add-mobile.png` / `application-add-mobile.png` | Compact form, controls and actions aligned while preserving the People create contract. |
| Access directory | `reference-access-desktop.png` / `application-access-desktop.png` | `reference-access-mobile.png` / `application-access-mobile.png` | Local navigation, account-state table and row action hierarchy aligned. |
| Manage access | `reference-access-manage-desktop.png` / `application-access-manage-desktop.png` | `reference-access-manage-mobile.png` / `application-access-manage-mobile.png` | Reference-style summary and action list precede the existing guarded change form. |

Theme captures are `application-directory-theme-{forest,amethyst,porcelain,linen}.png`. Intermediate/narrow captures use the `-intermediate` and `-narrow` suffixes.

## Implemented behavior

- People-owned category and employment filters and staff-name, employee-code and employment ordering now apply to the full authorized branch result before cursor pagination.
- Search, filters, sort and page size are URL-backed. Query changes clear stale cursors, and Back/Forward restores the protected server result.
- Directory and Profile actions use the frozen button, icon, type, spacing, dialog/drawer and responsive recipes.
- Staff Profile exposes the real assignments and dated teaching-eligibility owner projections without inventing mock data.
- Access management uses a reference-style account summary and explicit action rows, then invokes the existing versioned Access command. Current authorization and recovery behavior are unchanged.
- Unknown mutation outcomes remain distinct from confirmed saves whose refresh failed. Exact replay and GET-only refresh recovery remain intact.

No schema, migration, seed, permission or owner transaction changed.

## Verification

- `pnpm exec tsc --noEmit` — passed.
- People unit tests — 4/4 passed.
- `pnpm test:functional test/functional/people-employees.test.ts --reporter=default` — 14/14 passed against PostgreSQL.
- `pnpm check:backend` — passed.
- `pnpm check:boundaries` — passed.
- Staff directory query/pagination browser checks — 2/2 passed with one Chromium worker.
- Access lifecycle browser check — 1/1 passed with one Chromium worker after updating obsolete locators for the new two-step access drawer.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; build ID `aYyd35WOsz-nLsnM8Mcgu`.

One initial functional invocation contained an extra argument separator and began the broad suite. It was stopped after unrelated Finance/Learning failures; the corrected focused People command passed. One access-browser attempt failed before test execution because disposable Next caches filled the disk; only caches created by this pass were removed, and the unchanged focused test then ran. Its first assertion exposed an obsolete `Membership` cell locator after the Access table adopted the approved `Account status` and `Branch access` columns; the locator was corrected without weakening the assertion, and the test passed.

## Contract-bound differences

- The mock's Personal and Employment correction actions remain absent because PD-STF-02 is not approved.
- Exact existing-Person linkage remains absent pending PD-STF-01.
- The combined employment-ending/access-disposition workflow remains absent pending PD-STF-03.
- Cross-owner Teaching and Access directory filters/sorts remain STF-01B work; the implemented filters are People-owned category and employment fields.
- Add Staff keeps separate First name and Last name fields because that is the current People command contract; the mock's single Full name field is presentation-only.
- Access history does not show a mock-only historical invitation narrative that the current membership projection does not provide.
- At 900px the application uses the accepted shared compact-shell breakpoint, while the standalone mock retains its fixed desktop sidebar.
- Fictional names and row counts differ; production renders authorized synthetic records rather than the mock's in-memory catalogue.

These are explicit contract or shared-shell differences. Functional verification and direct visual comparison are complete for the independently authorized Staff scope. Human visual acceptance, PD-STF-01–03, STF-01B, native accessibility, TEN-03 and production readiness remain pending.
