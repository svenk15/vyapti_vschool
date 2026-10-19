# Current state

## Shared shell and navigation

Status: **ENGINEERING VERIFIED / VISUALLY INSPECTED / HUMAN REVIEW PENDING**

The five workspace frames now use the same `PortalShell` and `PortalNavigationGroup` mechanics. Parent and Student keep their authorized context ribbons and mobile bottom navigation while sharing the desktop shell, modal drawer, focus containment, account footer and sign-out placement. Role-local Administrator spacing exceptions were removed; all roles use the canonical 240px/44px/4px/12px contract with explicit major-section metadata.

Verification on the current candidate:

- `pnpm exec vitest run --config vitest.config.ts test/unit/workspace-navigation.test.ts test/unit/principal-navigation.test.ts` — passed, 7 tests.
- `pnpm typecheck` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed, build `8Og_vUH3xC_eOFXGFel7t`.
- `admin-experience-navigation.spec.ts` — 2/2 desktop and 2/2 mobile passed.
- `guardians.spec.ts` — 1/1 desktop and 1/1 mobile passed.
- `student-portal.spec.ts` — 1/1 desktop and 1/1 mobile passed.
- `principal-foundation.spec.ts` — 2/2 desktop and 2/2 mobile passed after reconciling an obsolete unavailable-summary expectation with the current page.
- `attendance-sessions.spec.ts` — 1/1 desktop and 1/1 mobile passed after reconciling obsolete landing/empty-state selectors with the current production compositions.

All browser checks used the guarded real PostgreSQL test database with 119 applied migrations and one Playwright worker, with desktop and mobile runs sequential. No migration, schema, grant, business rule or production data changed.

Evidence: [`../../evidence/workspace-presentation-shell-2026-10-20/README.md`](../../evidence/workspace-presentation-shell-2026-10-20/README.md).

## Remaining presentation batches

The shell checkpoint does not itself reclassify every workflow page as visually complete. Administrator, Teacher, Student, Parent/Guardian and Principal route-level compositions remain accounted in [`PAGE_COVERAGE.md`](PAGE_COVERAGE.md), with prior evidence reused from [`../UX_REVAMP/SCREEN_MAP.md`](../UX_REVAMP/SCREEN_MAP.md) and missing current-programme inspection kept explicit.

Human acceptance, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03, provider/retention decisions and production release remain pending.
