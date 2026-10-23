# Staff Access and Profiles presentation consistency

Date: 23 October 2026  
Application route: `/admin/users`  
Reference: `docs/execution/STAFF_REVIEW/references/approved-20261022/mock/index.html`, frozen by `docs/execution/STAFF_REVIEW/REFERENCE_FREEZE.md`
Implementation commit: `cc4ede34c`  
Production build ID: `KXLRu5Z0BW0_KlH9MKaQ`

## Change

The Access directory now follows the accepted Profiles directory treatment without changing the Access owner contract. Its Manage action uses the same sliders icon and compact text action as Profiles. At mobile width, every Access-specific fact remains visible in a compact two-column card: Roles with Account status, then Branch access with Invitation. The action sits beneath a pale divider instead of leaving fixed empty table-row space.

Search, Filter and Sort were not added to Access. The current Access query exposes a scoped forward cursor but does not provide the cross-owner, full-result query contract tracked as STF-01B. The separate Profiles and Access tabs, their routes, server authorization and mutation behavior remain unchanged.

## Visual comparison

- [Reference desktop](reference-desktop.png)
- [Application desktop](application-desktop.png)
- [Reference mobile](reference-mobile.png)
- [Application mobile](application-mobile.png)

The captures were directly inspected. Column order, local navigation, grant actions, status treatment and Manage action match the frozen composition. Production fixtures intentionally show real authorized Access records and fewer rows than the fictional reference catalogue. The application capture also shows the truthful saved invitation feedback produced by the focused journey.

## Verification

- `pnpm exec eslint components/access-management.tsx test/e2e/access-management.spec.ts` — passed.
- `pnpm typecheck` — passed.
- `pnpm test:e2e test/e2e/access-management.spec.ts --grep "pending staff persists" --project=chromium --workers=1` — passed before the mobile-only layout correction; the component and desktop styles were unchanged afterward.
- `pnpm test:e2e test/e2e/access-management.spec.ts --grep "pending staff persists" --project=mobile --workers=1` — passed after a clean `.next-e2e` rebuild. It verifies visible Roles, Account status and Branch access, aligned mobile metadata, the Manage icon, pending invitation persistence, last-administrator protection, lifecycle authorization and responsive containment.

No API, domain rule, authorization, database schema, migration or fixture changed. Human visual acceptance, native accessibility and existing release gates remain PENDING.
