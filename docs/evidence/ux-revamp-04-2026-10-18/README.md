# UX-04 authorized appearance picker evidence

Date: 18 October 2026 (Asia/Kolkata)

Human review: PENDING

Production readiness: BLOCKED by the existing release gates

## Outcome

One reusable `ThemePicker` now serves the authorized institution appearance settings, branch appearance settings, and branch-creation composition. It presents the four approved presets as accessible radio cards with semantic miniature previews. Branch creation and editing preserve the distinct `NULL` inheritance state and show the currently inherited institution theme. The existing verified operator-only institution creation command already accepts the optional theme selection; no browser operator authority or competing onboarding route was introduced.

Selection and preview stay in component state. Preview changes only the containing view and shows a persistent unsaved notice. Cancel restores the persisted selection. Save uses the UX-03 Access owner command with the current configuration version, reason, and idempotency key. A stale write refreshes the current value, retains the attempted selection, and requires a fresh confirmation. A lost response retains the exact payload/key for retry. Public Branding draft/publication remains a separate workflow.

## Verification

Tested candidate: parent HEAD `47b478112065750cc2ed0b2ae9d31c95aaf89e48` plus the UX-04 paths recorded by the implementation commit containing this evidence.

- Focused ESLint: passed for all changed application, component, gateway, owner, contract, and test files.
- `pnpm typecheck`: passed, including generated Next route types.
- `pnpm exec vitest run --config vitest.config.ts test/unit/access-appearance.test.ts`: 2/2 passed.
- `pnpm test:functional test/functional/institution-context.test.ts`: 10/10 passed against real `vyapti_vschool_test`; all 118 migrations were current.
- `pnpm check:docs`, `pnpm check:backend`, `pnpm check:boundaries`, and `pnpm check:db-design`: passed.
- `VSCHOOL_E2E=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm build`: passed; dedicated E2E build ID `HBOP0QRmwfI4njSjYp1EX`.
- Focused one-worker Playwright passed separately for `chromium` and `mobile`: 1/1 each. The journey proves keyboard selection/focus, preview and exit/cancel restoration, authorized branch save, reload persistence, real concurrent stale-write comparison and retry, institution save, inherited-name refresh, responsive containment, and current PostgreSQL persistence.

The first two desktop attempts rendered a stale `.next-e2e` distribution while the current manual build was in `.next`; this was an environment provenance failure, not an application assertion. The long-running development server was stopped, the dedicated `VSCHOOL_E2E=1` distribution was rebuilt, and both final viewport runs passed. A subsequent locator-only test correction changed no application code.

## Visual inspection

- [Desktop institution settings and branch creation](appearance-settings-chromium.png)
- [Mobile institution settings and branch creation](appearance-settings-mobile.png)

Both final images were directly inspected. The desktop picker uses two columns; mobile uses one. Preview areas remain 96px high, the entire card is selectable, the checkmark and border supplement colour, action controls stack on mobile, and neither viewport has root overflow. The institution setting remains a bounded form while the branch-creation choice set uses the available content width.

## Scope and remaining gates

No schema or migration changed in UX-04; UX-03's forward migration remains the persistence contract. No tenant theme is stored in cookies or browser storage. Server-rendered theme propagation across all protected/public workspaces and tenant switching belongs to UX-05. Native VoiceOver/NVDA, actual browser 200% zoom, human visual acceptance, TEN-03, provider/deployment configuration, and production release remain pending.
