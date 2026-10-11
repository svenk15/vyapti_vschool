# SA-03 branch switch and sign-out

Functional/security verification is **VERIFIED** for the checkpoint containing this record. Direct reference comparison is complete; human visual acceptance remains **PENDING**.

## Contract and implementation

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-03`.
- Measured workflow/screen: `implementation-spec/administrator/workflows/SA-03.md` and `screens/SA-03-entry.md`.
- Production route: `/admin/context`; protected top-bar destination selection and portal sign-out enter this route.
- Owner behavior: existing TEN-01 context directory/switch and NextAuth session termination. No backend owner port, persistence adapter, table, migration or seed changed.

The portal now implements Destination → Leave this workspace → Confirm. It retains the selected authorized destination and unsaved-work acknowledgement across Back/Continue, leaves the active branch unchanged until final confirmation, and executes either the guarded branch switch or sign-out once. Successful switching performs a full navigation and reloads other tabs. The source tab ignores its own context broadcast until it reaches `/admin`, which fixes the navigation race found during the first focused run. An unavailable target leaves the existing branch active and shows safe recovery. The disabled draft action is honest because durable protected drafts are not contracted.

## Verification

- Focused ESLint and TypeScript checks passed.
- The final current-source PostgreSQL-backed Playwright run passed 2/2 at desktop/mobile. It built the production application and used `vyapti_vschool_test` with all 38 migrations current.
- The journey covers server-projected destinations, Back retention, final-only switch, cross-tab invalidation, source-tab navigation, unavailable-target recovery, foreign/ungranted and forged-origin denial, staged sign-out, keyboard focus, forced-colors focus visibility and 200% CSS zoom overflow.
- Earlier TEN-01 PostgreSQL transaction/authorization evidence remains applicable because the owner use cases and adapters are unchanged.

Two failed iterations are not passes: the first exposed the source-tab broadcast race; the second exposed an ambiguous test locator after the behavior succeeded. Both causes were corrected before the final passing run.

## Visual inspection

Reference and application were captured at 1440×1000 and 390×844, device scale factor 1, light scheme, reduced motion, `en-GB` and `Asia/Kolkata`. The approved HTML was served unchanged. Comparable selected-destination, acknowledgement and confirmation states were inspected directly for stage hierarchy, 760px/352px desktop composition, mobile stacking, typography, spacing, control/action geometry, disabled state and overflow.

- `reference-{destination,leave}-{desktop,mobile}.png`
- `application-{destination,leave,confirm}-{chromium,mobile}.png`

Live school/branch labels and enabled navigation differ from the prototype's fictional fixture and unsupported modules. The documented font fallback, native browser zoom, VoiceOver and NVDA remain outstanding. Human acceptance is PENDING.

## Manual demo

Open the running demo, sign in and select a branch. From the top-bar branch control choose another authorized branch. Review Destination, acknowledge unsaved work, inspect Confirm, use Back to verify retained values, then confirm; expect Today to reload in the chosen branch and any other open portal tab to refresh. Use portal **Sign out** and complete the same stages; expect `/sign-in` and an unauthenticated session. Credentials remain only in ignored private artifact files.
