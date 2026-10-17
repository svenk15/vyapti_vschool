# LEA-31 uncertain-decision recovery evidence

Status: ENGINEERING_COMPLETE for every currently registered decision owner. Visual comparison: DIRECT_COMPARISON_COMPLETE_WITH_DEVIATIONS. Human review: PENDING. Deployment: synthetic-only; production gates unchanged.

The approved reference is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow `LEA-31`. It is a workflow explorer. The application uses the recorded production recipe at `/leadership/decisions/COORDINATION_VERIFICATION/:id` and the owner-specific status route `/api/v1/decisions/COORDINATION_VERIFICATION/:id/status`.

Verified behavior:

- A lost response retains the exact action, expected version, normalized reason and original key; another decision is disabled.
- Owner status rechecks live authority and registered source access before reading the Coordination receipt.
- No receipt at the unchanged owner version is `UNKNOWN`, never failure; only status check or exact original retry remains available.
- A matching committed receipt returns one original result. PostgreSQL retains one receipt and one verified event.
- Changed owner state reports attempted/current version and state and requires fresh review before a new intent.
- Revoked authority clears protected evidence and denies receipt disclosure; restoration recovers the original safe result for the reason-free verification case.

Verification performed on the current checkpoint worktree:

- `pnpm exec vitest run --config vitest.config.ts test/unit/coordination-requests.test.ts`: 12/12 passed.
- `pnpm test:functional test/functional/coordination-requests.test.ts`: 15/15 passed against `vyapti_vschool_test`; 87 migrations, none pending.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/coordination.spec.ts --project=chromium --grep "typed owner decision|approved LEA-31"`: 2/2 passed, one worker.
- Equivalent `--project=mobile`: 2/2 passed, one worker.
- Normal `pnpm build` and isolated `VSCHOOL_E2E=1 pnpm build`: passed.

Desktop/mobile reference and application captures are stored beside this file. Direct inspection confirmed the routed layout has no horizontal overflow and clearly separates pending, unknown, revoked, recovered and changed states. The explorer-dialog versus production-route composition and the existing font portability exception remain explicit deviations. Native VoiceOver/NVDA and actual browser 200% zoom remain unperformed release gates.

One initial functional invocation incorrectly included a standalone `--`, causing Vitest to start unrelated files; it was stopped after an existing `institution-context` failure appeared. The corrected focused command above passed. No result from the accidental broader invocation is claimed.
