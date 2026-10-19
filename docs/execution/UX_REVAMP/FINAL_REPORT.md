# UX revamp final engineering report

Updated: 19 October 2026 (Asia/Kolkata)

This report closes the currently authorized presentation programme at its supported boundary. It does not claim that deferred workflows exist, that every route was independently screenshot-reviewed, or that human acceptance or production release has passed.

## Counts and provenance

- Inventoried implemented page routes: **203** in `SCREEN_MAP.md`. This is the finite route catalogue, not a count of directly inspected screenshots.
- Explicitly classified and directly reviewed production surfaces in the dashboard, directory and detail overlays: **29** (5 dashboards, 14 directory/queue surfaces and 10 detail/history surfaces).
- Route entry files changed during the revamp: **20**, counted from the UX baseline `a2ed44ca15913d2441188e9ad5f3914d46ce1914` to `46912c1ec504cdc3094ddcf5a487ac4087d8de85`. Shared component changes also affect additional routes and interaction states, so this count is deliberately narrower than the number of rendered consumers.
- Final landing batch: **5** protected workspace landing compositions corrected or normalized and directly inspected at 1440×1000 and 390×844. Administrator was also checked at intermediate widths and across all four themes.
- Integrated M01–M08 current-source regression: **11/11** protected/public persona states and **15** authorized destination routes passed sequential one-worker browser verification.
- Presentation tasks: UX-01–UX-14 verified, UX-16 and UX-17 verified for their supported scope, and UX-15 partial.
- Application source in the executable build: `784c5b9` (`Complete shared workspace landing compositions`). Documentation/verifier HEAD at this closure starts from `46912c1`.
- Executable build ID: `KHDj7BWHk8qO5UYriOnkC`.
- Local demo: `http://127.0.0.1:3400`, started through `pnpm demo:start` so the synthetic release manifest is present.
- Schema: 119 forward migrations in the designated development and test databases; the final landing and regression checkpoints added no migration.

## Conformance boundary

The 29 overlay surfaces are conforming within their recorded owner-supported contracts. Exact-reference comparisons are separated from shared-pattern design extensions in `SCREEN_MAP.md` and their evidence records. The remaining route catalogue retains the shared shell, tokens and recipe ownership recorded in `SCREEN_MAP.md`; those routes are not relabelled as individually inspected exact matches because overlay states and route rows are not a one-to-one partition.

No remaining concrete presentation defect is recorded for an independently implementable current-contract surface. The following are separate capability gaps and were not filled with inferred data:

- Teacher and Principal Events readers.
- Teacher bounded Learning-feedback attention aggregate.
- Principal bounded cross-owner landing composition.
- Student complete due, unread-feedback and notice aggregates.
- Parent consolidated acknowledgement, deadline and notice aggregate.

## Remaining presentation and release gaps

1. **UX-15 browser institution creation — authority-contract blocker.** Institution creation accepts an optional theme through the verified trusted local operator command, but the product has no authenticated platform-operator browser principal. A browser-supplied `verified` claim would violate the Access trust boundary. This is the one remaining implementation blocker in the presentation task sequence.
2. **Human visual acceptance — pending.** Direct engineering inspection does not imply user acceptance.
3. **Accessibility release evidence — pending.** Native VoiceOver/NVDA and actual browser 200% zoom have not been performed. Playwright viewport/device-scale checks are not browser zoom evidence.
4. **Security and production — pending.** TEN-03 restricted-role/RLS proof, production providers and policies, real-client-data authorization and release approval remain open.

## Representative five-workspace review route

Use the private credentials already stored under `artifacts/`; do not copy their values into review notes.

1. Administrator: open `/admin`, then Students, Register student, Attendance sessions and a submitted register/correction receipt through normal navigation.
2. Teacher: open `/teacher/today`, an assigned Attendance session, Learning, and Enter marks.
3. Parent/Guardian: open `/family`, select an accepted child, then Attendance, Learning and Results.
4. Student: open `/student`, select an accepted Student context, then Assignments, an assignment receipt, Attendance and Results.
5. Principal: open `/leadership`, then Assessment and report readiness and Operational follow-ups.
6. Public entry: publish/preview through the authorized Branding workspace and follow the real school-branded sign-in link. The institution-creation browser picker remains outside this route because its operator principal is not designed.

Evidence is in:

- `docs/evidence/ux-revamp-17-landings-2026-10-19/`
- `docs/evidence/ux-revamp-16-m01-m08-2026-10-19/`
- `docs/evidence/ux-revamp-15-settings-public-2026-10-19/`
- The UX-10 through UX-14 evidence paths linked from `CURRENT_STATE.md`.
