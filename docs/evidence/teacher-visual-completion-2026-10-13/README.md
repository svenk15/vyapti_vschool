# Teacher visual completion — 13 October 2026

Human acceptance is **PENDING**. Functional/security verification, visual comparison and human review are recorded separately.

## Authority and states

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Teacher_Design/VSchool_Teacher_Review.html`.
- TEA-02 reference: `#/flow/TEA-02`; application: `/forgot-password` and the existing activation/reset routes.
- TEA-12 reference: `#/flow/TEA-12`; application: the unknown and recovered states at `/teacher/sessions/[id]`.
- TEA-13 reference: `#/flow/TEA-13`; application: the stale, canceled and revoked states at `/teacher/sessions/[id]`.
- TEA-22 reference: `#/planning`; application: `/teacher/timetable`.
- Reference captures were served unchanged on a local static origin. Capture details are in `reference-captures.json`.

The approved TEA-12 and TEA-13 pages are generic review wizards. The application states are integrated with the real register and are therefore **reference-less extensions** whose hierarchy, typography, feedback and actions were compared with the approved patterns. They are not claimed as exact page copies. Prototype review controls are intentionally omitted under the execution-pack instructions and are not a product deviation. Synthetic session counts are real fixture outcomes and need not equal prototype sample counts.

## Corrections and direct inspection

| Workflow | Functional/security | Visual result | Remaining difference |
|---|---|---|---|
| TEA-02 | Existing generic recovery, trust-mode and account-wide security evidence retained | Approved Account help fields/stages/acknowledgement, focus order and responsive controls now match; desktop/mobile pairs inspected | Public shared-auth shell replaces the prototype's already-signed-in Teacher shell; reference font portability remains unresolved |
| TEA-12 | Committed response-loss test proves exact-key recovery, one SUBMIT revision and three records after reload | Duplicate success feedback removed; unknown and recovered states use one clear heading/action and were inspected desktop/mobile | Integrated states are a design extension because no exact live-state reference exists |
| TEA-13 | Stale, canceled and revoked authority exercised independently | Stale preserves permitted attempted marks; canceled/revoked clear protected roster/draft content and present safe next actions; all states inspected desktop/mobile | Integrated states are a design extension because the reference is a generic chooser |
| TEA-22 | Current Teacher identity, scope, `timetable.read`, publication and trusted Attendance link remain server enforced | Published breaks and unassigned lesson periods now render in the weekly grid and mobile day cards; inspected desktop/mobile | Rooms, dated exceptions and cover/change actions remain absent for the owner-contract reasons below |

Application captures are named `application-tea-<workflow>-<state>-{chromium|mobile}.png`. Reference captures are named `reference-tea-<workflow>-{chromium|mobile}.png`. Images were inspected directly for hierarchy, spacing, typography, feedback/action placement, responsive containment and protected-data removal. The known reference-font portability exception remains; native VoiceOver/NVDA checks were not performed.

## TEA-22 supported partial classification

| Capability | Reference | Current owner support | Classification |
|---|---|---|---|
| Breaks | Required by the published schedule composition | Immutable published pattern periods already own kind/label/time | Implemented and visually verified in this checkpoint |
| Unassigned periods | Required by the published schedule composition | Published pattern periods plus absence of an authorized assigned slot are sufficient | Implemented and visually verified in this checkpoint |
| Rooms | Reference displays room information | No accepted room owner/table/FK exists; current slot contract is explicitly roomless | Product/data-owner decision plus later engineering; no value is invented |
| Dated exceptions | Reference provides a dated-exception view | Calendar dates exist, but no approved Teacher exception/change projection is implemented | Later Timetable owner work; absent, not faked |
| Cover/change actions | Separate TEA-23/TEA-24 reference workflows require them | No accepted cover lifecycle, capability grant or authority-transition contract exists | Product decision blocker; no dead action is rendered |

## TT-07 / TEA-23 readiness

The owner-contract review shows that a Teacher-only cover flow can depend on TT-05 plus the verified TT-06 Teacher projection; Student and Parent TT-06 projections are not needed to resolve an exact occurrence, current Teacher, candidate substitute or trusted Attendance session. The narrow proposal is recorded in `docs/modules/academics/DESIGN.md` and `TASKS.md`. It deliberately adds no capability or implementation. Decisions remain on assignment authority, whether acceptance precedes authority, lifecycle/reasons, dated eligibility, original-Teacher access and scheduled/open/submitted Attendance behavior.

## Verification

- `pnpm exec vitest run --config vitest.config.ts test/unit/teacher-timetable.test.ts`: **2/2 passed**.
- `pnpm exec tsc --noEmit`: **passed**.
- Focused Chromium Playwright, one worker: TEA-02/12/13/22 **4/4 passed**.
- Focused mobile Playwright, one worker: TEA-02 **1/1**, TEA-12 **1/1**, TEA-13/22 **2/2 passed**.
- `pnpm check`: **passed**, including lint, generated route/types, documentation, 63 database contracts, boundaries/backend compilation and **147/147 unit tests**.
- `pnpm test:functional test/functional/timetable-reconciliation.test.ts`: final **6/6 passed** against real PostgreSQL. The projection assertion covers the date-expanded immutable periods and existing scope/revocation behavior.
- `pnpm build`: **passed**, build ID `mnu0LWPknzd8hFZ6rc15n`.
- Test database: `vyapti_vschool_test`, **46 migrations applied, none pending**.
- The first combined mobile run exposed two test-locator issues: a desktop-only public-shell heading assertion and an ambiguous hidden desktop timetable element. A later TEA-12 run exposed selection of the covered top-bar close button rather than the visible drawer close button. Locators were corrected without weakening product assertions; focused reruns passed.
- Existing PostgreSQL authorization, replay, stale, revocation and branch-isolation evidence remains applicable because those owner contracts and schema were unchanged.

No schema, migration, seed or production data changed. TEN-03, provider/release gates, native accessibility and human acceptance remain pending.
