# SA-01 sign-in and workspace selection

Functional/security verification is **VERIFIED** for the focused checkpoint containing this record. Direct reference comparison is complete; human visual acceptance remains **PENDING**.

## Contract and source

- Approved workflow: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-01`.
- Measured specification: `implementation-spec/administrator/workflows/SA-01.md` and `screens/SA-01-entry.md`.
- Production routes: `/sign-in`, `/sign-in/[school]`, `/choose-workspace`, `/account`, then the role-appropriate protected workspace.
- Owner contracts: existing Access authentication plus TEN-01 `getContexts` and guarded `switchContext`. No table, migration, owner repository or permission rule changed.

## Implemented outcome

Successful authentication now sends the account through `/choose-workspace`. One selectable branch skips the chooser. Multiple current branches require an explicit authorized selection, review and final confirmation. The final action calls the existing same-origin context switch, which rechecks identity, institution, branch and membership before setting hosting context. Foreign and unselectable branches are absent. Back from confirmation retains the choice; returning to sign-in signs out. The disabled prototype draft affordance remains honest because durable auth-flow drafts are neither useful nor contracted.

The approved prototype shows Administrator navigation before credentials have been verified. Production deliberately retains the established public authentication shell until a branch is confirmed; exposing a protected workspace shell before identity/scope resolution would conflict with the Access boundary. This shell difference is explicit and is not claimed as a visually accepted deviation. Within the workflow body, the approved stage order, labels, select, review facts, outcome, action placement, spacing and responsive composition are matched.

## Focused verification

- `pnpm exec eslint components/access-login.tsx components/workspace-chooser.tsx app/choose-workspace/page.tsx test/e2e/tenancy.spec.ts` — passed with no warnings.
- `pnpm exec tsc --noEmit --pretty false` — passed.
- `pnpm check` — passed lint, type generation/checking, documentation, 54-table database design, backend boundaries/compilation and 128/128 unit tests.
- `pnpm test:e2e test/e2e/tenancy.spec.ts` — passed 6/6 on the first current-behavior run against real `vyapti_vschool_test` with all 38 migrations current.
- `pnpm test:e2e test/e2e/tenancy.spec.ts --grep "context lists"` — final comparable-fixture run passed 2/2 desktop/mobile. It verifies authorized-only options, no foreign branch, retained Back state, confirmation, guarded persistence of the selected context, later branch switching and scoped reads.
- One intermediate evidence rerun passed desktop and failed mobile before browser execution because both projects used the same fixed synthetic institution name and correctly hit `PROVISION_CONFLICT`. The fixture was restored to unique readable names; no application assertion was weakened.
- `pnpm test:e2e test/e2e/access.spec.ts --grep "administrator signs in|wrong, unknown|current membership suspension"` — passed 6/6 desktop/mobile. This proves single-branch skip, generic credential recovery, sign-out/foreign denial and immediate suspended-membership rejection on the final source. Existing deeper Access PostgreSQL authorization evidence remains applicable because backend code did not change.
- Final combined current-source gate: `pnpm test:e2e test/e2e/tenancy.spec.ts test/e2e/access.spec.ts --grep "context lists|administrator signs in|wrong, unknown|current membership suspension"` — passed 8/8 desktop/mobile after the unavailable/denied and Back-sign-out recovery states were added. The Playwright harness built the production application for this source.

## Visual inspection

Reference and application were captured with Chromium at 1440×1000 and 390×844, device scale factor 1, light scheme, reduced motion, `en-GB` and `Asia/Kolkata`. The approved HTML was served unchanged on port 3471. All eight workflow/body images were inspected directly for stage hierarchy, type scale, field/action geometry, wrapping, disabled state and overflow.

- `reference-entry-{desktop,mobile}.png`
- `reference-workspace-{desktop,mobile}.png`
- `reference-confirm-{desktop,mobile}.png`
- `application-entry-before-{desktop,mobile}.png`
- `application-workspace-{chromium,mobile}.png`
- `application-confirm-{chromium,mobile}.png`

Known differences: the security-required public authentication shell described above; the documented VSchool Navigation font redistribution/fallback difference; synthetic organization suffixes in isolated test captures. Native browser zoom, VoiceOver and NVDA were not performed and remain separate release gates.

## Manual demo

Use `pnpm demo:seed`, then open the published school URL from ignored `artifacts/iam-01/private-demo.json` (or `/sign-in`) and use credentials from that private file. A single-branch persona proceeds to Today without a chooser. A persona with two current branch memberships sees only those branches, reviews one, confirms, and lands on Today in that branch. Human review remains PENDING.
