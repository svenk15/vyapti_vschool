# UX-05 server theme resolution evidence

Date: 18 October 2026 (Asia/Kolkata)

Implementation source: `1157a6c9f2cce9d6b668a2cfb28b5770423c6558`

Migration state: development and test remain at 118 applied migrations; UX-05 adds no migration.

## Verified behavior

- Administrator, Teacher and Principal layouts resolve the active authorized branch's Access-owned effective theme before rendering.
- Institution-wide management renders the currently authorized institution theme.
- Parent and Student pages first authorize the selected child/self context through the owning module, then resolve that exact active Organization/School theme through a server-only composition seam. The browser cannot submit this proof.
- Generic entry and an unresolved chooser inherit the document's Forest default. Public school-slug sign-in continues to use only Branding's immutable published revision. A private preview or authenticated portal selection cannot leak to that public projection.
- A nested `BrandSurface` without an explicit theme now inherits the nearest authorized server theme. Preview and published-brand surfaces can still create an explicit bounded theme scope.
- Branch and Student context transitions perform a server navigation and resolve the destination theme. The tested Administrator transition changed Forest to explicit Linen across both tabs; the tested Student transition changed Amethyst to Linen and returned to Amethyst after revoking only the second context.

## Checks

- `pnpm exec eslint <25 changed source/test files>` — passed.
- `pnpm typecheck` — passed.
- `pnpm exec vitest run --config vitest.config.ts test/unit/access-appearance.test.ts` — 3/3 passed.
- `pnpm test:functional test/functional/institution-context.test.ts` — 11/11 passed against `vyapti_vschool_test`; 118 migrations, none pending.
- `pnpm check:docs` — passed.
- `pnpm check:boundaries` — passed.
- `pnpm check:backend` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; standard build ID `5cGXDumc0HK_gK-1zwhBrfYCHDUS`.
- `VSCHOOL_E2E=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; isolated E2E build ID `_v-SbfIeLnp7`.
- Appearance preview/save/reload/hydration assertions — Chromium 1/1 and mobile 1/1 passed, one worker and sequential viewports.
- Administrator context switch — Chromium changed journey 1/1 and mobile 1/1 passed. The same file's institution-creation test passed after its now-ambiguous Reason locator was made exact.
- Parent activation/revocation plus Porcelain owner-context rendering — Chromium 1/1 passed.
- Student activation, Amethyst/Linen multi-context switching and scoped revocation — Chromium 1/1 passed.
- Public Branding publication versus protected Access theme — Chromium 1/1 passed; public Linen publication did not change the protected Forest portal theme.

The first attempted functional command used `pnpm test:functional -- <file>`. The wrapper forwarded the separator in a form that Vitest did not filter, so unrelated tests began. That run was stopped and is not claimed as a suite result. The corrected focused command above passed. A full `tenancy.spec.ts` Chromium attempt proved the changed context test but also found one unrelated stale module-availability assertion; it remains outside UX-05 and is not reported as passed.

## Visual inspection

- [Appearance settings desktop](appearance-settings-chromium.png) and [mobile](appearance-settings-mobile.png) show the Amethyst institution theme, four choices, inherited branch option, readable controls and contained responsive stacking.
- [Administrator context desktop](context-switch-chromium.png) and [mobile](context-switch-mobile.png) prove the selected Linen context in test assertions. The screenshot still contains legacy Forest shell colors; UX-06 owns replacement of those hard-coded shell presentation rules.
- [Parent Porcelain context](family-porcelain-chromium.png) and [Student context](student-context-chromium.png) carry the verified theme attribute, but legacy workspace shell color rules remain visible and are explicitly UX-07 debt.
- [Published sign-in](published-sign-in-chromium.png) uses the immutable published Branding palette separately from the protected portal selection.

The captures were directly inspected for overflow, layout breakage, theme-picker hierarchy and context identity. UX-05 establishes correct server resolution and first-render attributes. It does not claim the UX-06/UX-07 shell migration or full visual fidelity across all workspaces.

## Outstanding gates

Human acceptance, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03 restricted-role/RLS proof, UX-06/UX-07 legacy shell migration, UX-08 cross-theme matrix and production release remain pending.
