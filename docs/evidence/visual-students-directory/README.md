# Administrator Students visual-fidelity checkpoint

Captured and inspected on 10 October 2026. Executable source: `3ce5ce5` on `work/stu-01-after-per02-wip`. Human visual acceptance remains **PENDING**. The existing 29/29 Administrator workflow statement remains limited to engineering verification.

## Compared state

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/students`
- Application: `/admin/students`, authenticated as the fictional administrator from ignored `artifacts/people-02/private-demo.json`
- Desktop viewport: 1440 × 1000 CSS pixels. Mobile viewport: 390 × 844 CSS pixels.
- The reference was served unchanged from a separate local static server. The application used real authorized development data and its actual Students API.

## Evidence

- [Reference desktop](reference-desktop.png) and [implementation desktop](application-desktop.png)
- [Reference mobile](reference-mobile.png) and [implementation mobile](application-mobile.png)
- [Reference Manage dialog](reference-drawer-before.png), [implementation Manage dialog](application-manage-dialog.png), and [implementation filter drawer](application-filter-drawer.png)
- Before captures remain in this directory to show the replaced extra directory heading/card, tall toolbar, raw columns and clipped mobile table.
- Computed measurements are in `reference-before-metrics.json`, `application-before-metrics.json` and `application-after-metrics.json`. Focused interaction results are in `browser-verification.json`.

## Corrected differences

- Removed duplicated institution/page context and the extra “Students in this branch” card heading.
- Matched the compact page header, active Students tab, 40 px search toolbar and 16 px toolbar-to-table gap.
- Replaced raw admission/name/status columns with a reference-style person cell, avatar, enrollment summary, status badge and Manage action.
- Added an accessible, focus-restoring Manage dialog containing only the implemented authorized student-record journey.
- Converted the table into readable two-column cards at mobile width; the 390 px and 200%-equivalent layouts have no page overflow.
- Kept the existing shared 248 px enhanced sidebar, visible focus treatment, real branch context, server authorization and API behavior.

## Intentional remaining differences

- The approved prototype contains fictional Drafts, separate name/admission search attributes, Sort, and future Manage actions. Those backend contracts are not implemented in the current release, so the application does not show dead or partial controls.
- Navigation is filtered to released and authorized real modules. The prototype review bar and its fictional school/year controls are not product UI.
- The application shows current fictional seed records and actual enrollment facts rather than copying prototype names or counts. Its 15 px body type and 248 px enhanced sidebar remain within the approved production token targets; the static prototype uses 14 px and 240 px.

## Verification

- `pnpm exec eslint app/admin/students/page.tsx components/students-workspace.tsx components/ui/server-table.tsx` — passed.
- `pnpm exec tsc --noEmit --pretty false` — passed.
- `pnpm build` — passed after the final CSS correction; the later source edit removed trailing whitespace only.
- Focused local Playwright verification — 11/11 passed: populated data, real search, Back/Forward restoration, filter cancel/apply, filter and Manage focus restoration, mobile cards/overflow, and 200%-equivalent layout.
- `pnpm check:docs` — passed for the execution-policy installation.

No backend contract, permission, schema, migration, seed or database row changed in this checkpoint.
