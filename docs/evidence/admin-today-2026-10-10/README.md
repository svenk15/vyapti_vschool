# Administrator Today alignment — 10 October 2026

Human visual acceptance is **PENDING**. This checkpoint compares the unchanged approved Administrator reference `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/home` with the production `/admin` route. Both were captured in Chromium at 1440 × 1000 and 390 × 844 CSS pixels after `document.fonts.ready` resolved.

| State | Approved reference | Current application |
|---|---|---|
| Populated desktop | [reference](reference-populated-desktop.png) | [application](application-populated-desktop.png) |
| Populated mobile | [reference](reference-populated-mobile.png) | [application](application-populated-mobile.png) |
| Mobile navigation | Reference navigation is represented in the captures above | [application drawer](application-populated-mobile-navigation.png) |
| 200% equivalent viewport | — | [application at 720 CSS px](application-200-percent-equivalent.png) |

The shared Administrator shell now orders authorized operational destinations as Today, Attendance, Students, Staff & access, Academics and Reports. Existing setup, staff-profile, roster-import, class, module, branding and activity routes remain available under Management. The 240px desktop sidebar, 60px header, declared body stack, type sizes, active marker, card spacing, metric icons and mobile 260px drawer follow the embedded component contract. The header shows the real current branch, current/open academic year and an exact linked account/employee display name when one exists; the synthetic administrator has no accepted Person binding, so its truthful role label remains visible.

`pnpm demo:seed` now prepares an idempotent, connected fictional branch for school-local 2026-10-10: three active placed students, submitted registers, one started register requiring action, a future scheduled session, one review-state import and one pending staff-access item. Existing records, credentials and historical sessions are preserved. The current demo reconciles to 2 submitted of 4 non-cancelled sessions and three attention items. Deep actions restore the exact attendance session, import preview and membership item; View all carries the branch-local `[2026-10-10, 2026-10-11)` report range.

Verification on the current worktree:

- `pnpm lint` and `pnpm typecheck` passed.
- Focused People and Attendance real-PostgreSQL tests passed 20/20 before the presentation-only CSS follow-up; no persistence code changed afterward.
- `pnpm demo:seed` passed twice against guarded `vyapti_vschool`; repeat execution preserved records and command keys.
- `pnpm build` passed. The relevant Playwright Administrator/teacher attendance journey passed 1/1 against `vyapti_vschool_test` with all 38 migrations applied; it covers the genuine empty dashboard before scheduling, the populated attendance workflow, authorization denial and reports. The branch-context journey initially exposed an obsolete heading assertion after the approved Today heading replaced the school-name heading; the locator was corrected to the labelled context group and the focused rerun passed 1/1. The other two tenancy cases passed in the initial run.
- `scripts/verify-admin-today-local.mjs` passed the matched visual capture, navigation order, mobile keyboard focus/return, horizontal-overflow, 200%-equivalent viewport and exact deep-link journeys. Machine-readable results are in [comparison.json](comparison.json).

Known deviations: the approved sidebar embeds `VSchool Navigation`, but the supplied files do not establish redistribution rights. Production therefore retains the declared approved body stack and its available system fallback instead of copying an unlicensed font. The approved reference contains its own fictional school/person/session values; production evidence uses connected VSchool fixtures. Only one selectable branch exists in the development persona, so branch switching was verified in the isolated Playwright tenancy fixture rather than by silently changing the demo context.

No schema or migration changed. TEN-03, native VoiceOver/NVDA and other production release gates remain incomplete.
