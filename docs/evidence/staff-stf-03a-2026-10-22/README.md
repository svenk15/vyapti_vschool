# STF-03A authorized Staff Profile evidence

Frozen reference authority: [`profile-content-sized-desktop-1440x1000.png`](../../execution/STAFF_REVIEW/prototype/evidence-operation-recovery/profile-content-sized-desktop-1440x1000.png), executable prototype commit `ad78b1c95102ed33ecaa938f9a4b29e2c854d0e7` and combined prototype hash `67ca61b0204bac68c7bc7602e02b3c638305b448d377e79be4bbff9cce474a01`.

Current-source captures from production build `31F-Og17Ps0lWxswztc6d`:

- `application-profile-chromium.png` / `application-profile-mobile.png`: active, teaching-eligible, linked account state at 1440×1000 and 390×844.
- `application-profile-no-account-chromium.png` / `application-profile-no-account-mobile.png`: active teaching-eligible Employee with no verified account binding.
- `application-profile-ended-chromium.png` / `application-profile-ended-mobile.png`: ended employment with retained account truth and disabled teaching projection.

Direct inspection confirms the reference content-width hero, two-column desktop composition, single-column mobile flow, Employment facts, independently composed Teaching and Access panels, Staff operations, history and directory return path. The application uses real authorized records and therefore does not reproduce the prototype's sample assignment count. `Correct details` remains absent because PD-STF-02 is unapproved. Dated eligibility actions remain STF-05, invitation actions remain STF-06, and the existing employment mutation remains reachable from the directory Manage action until the separately gated STF-07 composition is approved.

Verification:

- `pnpm test:functional test/functional/people-employees.test.ts` — 12/12 PASS against real PostgreSQL, including protected People/Academics/Access composition, cross-branch denial and token-version revocation.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — PASS; `/admin/teachers/[id]` and `/api/v1/employees/[id]` are dynamic routes.
- focused Playwright desktop — 2/2 PASS with one worker after isolating stale generated webpack CSS.
- focused Playwright mobile — 2/2 PASS with one worker using the same build.

The first browser run correctly passed behavior but emitted stale generated CSS; those screenshots were overwritten only after the current stylesheet was confirmed in the served build. Human visual acceptance remains PENDING. Native accessibility, font portability and TEN-03 remain release gates.
