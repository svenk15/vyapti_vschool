# SA-24 Administrator reconciliation evidence

## Scope

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-24`
- Application route: `/admin/imports/manage`
- Advanced cancellation/recovery route: `/admin/imports/operations?jobId=…`
- Browser conditions: desktop 1440×1000 and mobile 390×844 CSS pixels, device scale factor 1. These are viewport/device-emulation settings, not native browser zoom or native assistive-technology evidence.

## Implemented contract

The application follows Confirm preview → Review partial results → Confirm. The selector reads real branch imports in deterministic newest-first pages of 50 through a signed account/branch cursor. The selected real job supplies current eligibility. Confirmation and processing reuse the verified preview/hash/version guards, transaction locking, bounded batches and receipts. If a confirmation response is interrupted, the UI queries the durable status and does not issue a second intent. The subsequent process action creates the supported row once and the persisted status remains `COMPLETED` after reload.

The approved reference offers a disabled Save draft and leave control; production does the same because no durable-draft lifecycle is approved. Cancellation and advanced row recovery remain linked through the established full interface instead of being hidden or reimplemented in the staged page.

## Verification

- Focused real PostgreSQL: `pnpm test:functional test/functional/import-preview.test.ts -t "lists branch-scoped imports"` — PASS, 1 passed/11 skipped; 38 migrations applied. Covers 51 branch jobs, second-page retrieval and tampered cursor rejection.
- Focused repository checks: TypeScript and changed-file ESLint — PASS.
- Focused Playwright: `pnpm test:e2e test/e2e/import-preview.spec.ts --project=chromium --project=mobile -g "confirms and processes a selected import"` — PASS, 2/2 in 2.9 minutes on the final source. The journey uses real PostgreSQL, simulates a response lost after commit, recovers the receipt, processes once and verifies durable completion.
- The first browser rerun reached the expected persisted result but retained an obsolete stage-two status assertion after the reference-alignment edit. That assertion was corrected to verify the selected terminal import and authorized status API. A later rerun had a transient generated-account sign-in failure; direct fixture authentication plus the focused successful rerun distinguish setup from product behavior.
- No migration or seed change. Current application authorization remains active; TEN-03 stays a production gate.

An accidental command with an extra argument delimiter earlier attempted the broad browser suite and stopped on an unrelated Academics setup failure. It is not counted as SA-24 evidence.

## Visual inspection

Reference and application captures were opened and compared for all three stages. The application retains real institution/branch labels and real job references, so fictional reference strings intentionally differ. Structure, stage order, labels, field width, cards, notes, actions, desktop grid and mobile stack match the approved composition. The application keeps a visible focus ring on the programmatically focused stage heading; the static reference capture does not show that keyboard state. The shared application top bar currently displays the authorized active destination (`Imports`) rather than the reference's two-part destination/title breadcrumb. The documented font fallback also remains visible and unaccepted. Native VoiceOver/NVDA, actual browser zoom and human visual acceptance remain PENDING.

Files:

- `reference-{preview,results,confirm}-{desktop,mobile}.png`
- `application-{preview,results,confirm}-{chromium,mobile}.png`
- `reference-capture.json`

## Manual walkthrough

1. Sign in with the private local Administrator credential and open `/admin/imports/manage`.
2. Select a REVIEW import and continue. Expect the approved action selector with Confirm valid preview enabled.
3. Continue to Review and confirm, use Confirm, then choose Review another action. Expect Resume unprocessed rows without losing the selected import.
4. Confirm the resume action. Expect a durable row receipt with one success and no duplicate Student.
5. Reload the route. Expect the same import to show `COMPLETED`; use the advanced recovery link for retained cancellation/error controls.

Human review: **PENDING**.
