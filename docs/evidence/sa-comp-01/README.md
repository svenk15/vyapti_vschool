# SA-COMP-01 verification

Workflows SA-04 and SA-05 are implementation VERIFIED on the 10 October 2026 working tree; human visual review is PENDING. The administrator dashboard now shows current attendance/import/staff exceptions, and School setup shows derived readiness for each effective Phase 1 module. Both use one Reporting-owned, read-only projection over existing owner tables. No schema or migration changed.

Executed evidence:

- `pnpm lint`, `pnpm typecheck`, `pnpm check:backend` and `pnpm check:docs` passed.
- Unit suite passed 115/115, including input validation and repository delegation.
- Guarded real PostgreSQL functional suite passed 107/107 across 16 files. The SA-COMP case proved populated readiness, complete scoped totals, foreign-branch denial, disabled-module omission and live membership revocation.
- Playwright passed 84/84 journeys across desktop Chromium and 390px mobile. The setup journey checks progress, action routing, keyboard-reachable links and no horizontal overflow; the run also produced a successful production build.
- `pnpm demo:seed` completed against guarded `vyapti_vschool` outside the network sandbox. It preserved existing credentials/data, prepared all implemented feature fixtures, and retained the connected 6 October attendance scenario with three assigned sessions.

Rendered inspection:

- [Desktop setup](school-setup-chromium.png)
- [Mobile setup](school-setup-mobile.png)
- [Desktop administrator overview](admin-overview-chromium.png)
- [Mobile administrator overview](admin-overview-mobile.png)

The screenshots show the empty/first-use branch fixture. The current layout has a single page action, bounded progress card, aligned setup rows, full-width mobile actions, and no observed overflow. Populated owner data is covered by PostgreSQL and the development seed; final populated development screenshots remain part of SA-COMP-06 visual reconciliation.

Known release gates are unchanged: human visual review, native VoiceOver/NVDA, TEN-03 restricted-role/RLS proof, production mail/provider review, restore/load evidence and real-client onboarding remain outstanding.
