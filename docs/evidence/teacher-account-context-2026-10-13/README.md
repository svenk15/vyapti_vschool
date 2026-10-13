# TEA-03 Teacher workspace exit evidence

Engineering status: IMPLEMENTED_AND_VERIFIED. Human review: PENDING.

## Authority and scope

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Teacher_Design/VSchool_Teacher_Review.html#/account` and workflow `TEA-03`.
- Live routes: `/account` and `/account/context`.
- Access owns `getHome`, the server-filtered context directory and guarded context switch. Attendance owns command-status recovery. No table, migration, business write or new capability was added.
- A target is a browser candidate only. Final confirmation rechecks the live account/token and active target branch membership. Unknown Attendance submission payloads remain page-memory only and cannot be abandoned through shared branch/sign-out controls.

## Verification performed

- `pnpm typecheck`: passed during implementation.
- `pnpm check`: passed all repository gates with 146/146 unit tests; the one reported unused-import warning was removed and the focused lint rerun passed.
- `pnpm build`: passed from the final application source; build ID `dAX5SIveLnt72jzx7LBAA`.
- Focused Chromium Attendance lost-response recovery: 1/1 passed after correcting an unrelated ambiguous text locator. It proves sign-out is refused while the exact submission is unresolved, then status recovery confirms one submission.
- Focused real-PostgreSQL multi-branch Teacher browser journey: Chromium 1/1 and mobile 1/1 passed sequentially with one worker. It covers authorized-only branch display, explicit workspace selection, retained Back/Continue state, confirmation focus, simulated target revocation with unchanged context, successful retry, hard navigation and responsive containment.
- All 46 migrations were current in `vyapti_vschool_test`; no migration was created or applied by this slice.
- Direct visual inspection compared the approved account at 1440×1000 and 390×844 with the matching application account states. Card widths, two-column/stacked composition, branch row density, actions and staged confirmation were inspected rather than inferred from assertions.

Initial mobile reruns reused a production build created before the Access-route gate correction and are not passing evidence. A fresh production build was then produced and the current-source focused desktop/mobile cases passed. A final locator change only derives the selected target from its authorized link and does not change application behavior.

## Captures

- `reference-account-chromium.png`, `reference-account-mobile.png`
- `application-account-chromium.png`, `application-account-mobile.png`
- `application-confirm-chromium.png`, `application-confirm-mobile.png`

The application uses real synthetic institution/branch names and a generic “Teacher account” label because the current safe Access home DTO does not expose an account display name. That remaining projection belongs to TEA-04. The documented font portability difference, native VoiceOver/NVDA and TEN-03 remain pending release gates.

## Manual demo

Use `pnpm demo:seed`, sign in with the ignored private Teacher credentials at `artifacts/people-02/private-demo.json`, and open `/account`. If the seeded identity has more than one active branch, select **Switch**; otherwise the account truthfully shows only the authorized current branch. Continue, acknowledge unsaved work, review confirmation, and confirm. Use **Leave workspace** to inspect staged sign-out. Never print the private credential values.
