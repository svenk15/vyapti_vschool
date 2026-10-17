# LEA-30 owner recusal and independent routing evidence

Status: **ENGINEERING_COMPLETE / DIRECT_COMPARISON_COMPLETE_WITH_DEVIATIONS / HUMAN_REVIEW_PENDING / SYNTHETIC_ONLY**.

The approved source is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html#/flow/LEA-30`. The immutable explorer dialog is captured as `reference-lea-30-{chromium,mobile}.png`. The production mapping is the routed Principal decision composition: `application-route-*` shows the conflict/independent-route stage, `application-receipt-*` the minimal recusal receipt and `application-reviewed-*` the independently authorized owner result.

Direct inspection at 1440×1000 and 390×844 found the same approved order and consequence: detect/declare conflict, choose an eligible independent route, record minimal protected context, end the original reviewer's access and let the already-authorized reviewer act. The application uses the approved persistent Principal shell, real owner evidence, a final-only transaction and a durable receipt instead of the explorer's catalogue dialog. The known portable-font difference remains; native accessibility and actual browser 200% zoom were not performed.

Focused verification on the changed source:

- unit: `test/unit/coordination-requests.test.ts`, 14/14;
- real PostgreSQL: `test/functional/coordination-requests.test.ts`, 18/18 with 90 forward migrations;
- Playwright, one worker and sequential projects: recusal/retry/reviewer journey plus immutable reference capture, 2/2 Chromium and 2/2 mobile;
- lint, TypeScript, backend extraction, boundary and database-design checks passed;
- production build passed during Chromium Playwright startup; normal build ID `3WI-DraVmxxezxGi_SKrp` and isolated browser build ID `gS8x-rxS13-K_3UtE0mc6`;
- development and test databases both reached migration `20261018170000_coordination_decision_recusal`; neither database was reset.

The PostgreSQL evidence covers current actor/recipient/source authority, proposer and recused-actor separation, no capability grant, changed-payload conflict, exact replay with one recusal, protected-note exclusion from general audit/receipt, unassigned minimal steward queue, institution-steward routing, and denial after steward or reviewer authority is revoked. The browser deliberately loses the first recusal response and retries the original payload/key before the independent reviewer verifies the same owner item.

`pnpm demo:seed` preserved existing data but stopped at an older Principal credential mismatch before reaching this helper. The focused changed helper `pnpm exec tsx scripts/demo-coordination.ts` passed and preserves the independent reviewer in ignored `artifacts/coordination-01/private-demo.json`, referring to credentials in ignored `artifacts/attendance-01/private-demo.json` without printing them.

Production remains blocked by Coordination real-data retention/backup-deletion policy, TEN-03, native accessibility, provider/restore/load review and explicit production enablement. Human acceptance remains pending.
