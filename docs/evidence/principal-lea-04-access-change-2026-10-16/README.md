# LEA-04 Principal live-access change evidence

Status: existing read subset verified; workflow partial; direct visual comparison complete with documented composition deviation; human review pending.

The approved authority is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow **LEA-04 — Handle access changes during a leadership action**. The exercised application route is an exact `/leadership/attendance/sessions/:id` source page with role-aware recovery to `/admin` when School Administrator is the only remaining authorized workspace.

The journey opens a real scoped Attendance source, deactivates Attendance, reloads, restores Attendance, reloads, removes the Principal role, and retries the saved Leadership URL. Deactivation removes class and Teacher facts and produces the generic unavailable state without deleting the owner row. Principal-role removal removes Leadership content and routes to the account's still-permitted Administrator workspace. The browser receives no override control.

## Verification

- Focused ESLint and `tsc --noEmit`: passed.
- Focused Playwright, sequentially with one worker: Chromium 2/2 and mobile 2/2 passed against `vyapti_vschool_test`; all 64 migrations were applied with none pending.
- The first two Chromium attempts expected a chooser after Principal removal. The actual role-aware recovery selects `/admin` because the exact School Administrator role remains authorized, and `/choose-workspace` likewise auto-selects its single remaining context. The final assertions verify this permitted destination and retain the strict protected-data absence checks.
- Existing LDR-01 Access and LDR-03/LEA-08 Attendance PostgreSQL authorization evidence remains applicable. This checkpoint changes no product code, schema, migration, permission, transaction or seed behavior.

## Visual inspection

Direct inspection at 1440×1000 and 390×844 confirmed that the authorized detail is readable, the module-unavailable state contains no class/Teacher facts, and the Principal-removed state is a clearly different authorized Administrator workspace. The approved source remains a fictional workflow dialog while the application demonstrates the behavior in production pages.

- Desktop: [approved LEA-04](reference-chromium.png), [authorized source](application-authorized-chromium.png), [module unavailable](application-module-unavailable-chromium.png), [Principal removed](application-principal-removed-chromium.png).
- Mobile: [approved LEA-04](reference-mobile.png), [authorized source](application-authorized-mobile.png), [module unavailable](application-module-unavailable-mobile.png), [Principal removed](application-principal-removed-mobile.png).

The workflow remains partial because the approved saved command/status receipt path cannot be exercised: the first-release Principal workspace has no write command or receipt. School Administrator commands are not substituted. Dialog/page composition, font portability, native VoiceOver/NVDA, TEN-03, production controls and human acceptance remain pending.
