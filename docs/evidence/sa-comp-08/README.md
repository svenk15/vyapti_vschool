# SA-COMP-08 / SA-06 branch office profile evidence

Date: 10 October 2026. Human review: **PENDING**.

## Outcome

The real School settings screen now saves the approved branch display name, required office email, optional phone and required address with a mandatory non-sensitive reason. Existing timezone is read-only in the UI and rejected server-side if forged. Updates use current `school.manage`, the existing Access lock/transaction/idempotency path and redacted Platform evidence. A stale edit keeps the attempted values, loads the latest authorized values for comparison on demand and requires an explicit retry using the latest version.

Migration `20261010011000_school_office_details` adds nullable legacy-compatible columns and checks; existing rows/data were preserved. Both `vyapti_vschool` and `vyapti_vschool_test` report 34 applied migrations with none pending. No reset or migration rewrite was used.

## Verification

- `pnpm test:functional test/functional/access-management.test.ts`: **7/7 passed** on real PostgreSQL, including persistence/readback, no-op, idempotent replay, stale conflict, immutable timezone, rollback, authorization and redacted audit assertions.
- `pnpm test:e2e test/e2e/access-management.spec.ts`: **4/4 passed** after a production build across desktop/mobile. The journey saves office details, recovers a lost response with the same key, reloads persisted data, exercises stale current/attempted comparison and rejects forged timezone changes.
- The rendered desktop/mobile screenshots in ignored `artifacts/iam-02-settings-*.png` were inspected: labels, constrained form width, action placement and responsive stacking are aligned with the shared settings composition; no horizontal overflow was observed. Native screen-reader and human visual acceptance remain unperformed.
- Repository-wide checks and final source commit are recorded at the checkpoint commit.

## Seed and demo

`pnpm demo:seed` extends only its owned fictional People school when all three office fields are still empty. It never replaces any existing office value or credential; its stable command key stays in ignored `artifacts/people-02/private-demo.json` and no value is printed.

Manual path: sign in with `artifacts/people-02/private-demo.json`, open `/admin/school`, review the fictional office details, change one field with a reason and save. Refresh and expect persistence. In a second tab save another change, then submit the first tab; expect stale feedback, preserved attempted inputs, **Compare with latest**, and an explicit retry after adopting the latest version.

Production gates remain unchanged: TEN-03 restricted-role/RLS proof, native VoiceOver/NVDA, provider/restore/load evidence and human review are outstanding.
