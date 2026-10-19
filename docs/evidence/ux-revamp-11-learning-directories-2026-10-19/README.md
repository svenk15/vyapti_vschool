# UX-11 Learning directory presentation evidence

Date: 19 October 2026 (Asia/Kolkata)

## Scope and provenance

- Base source: `059f51f`.
- Corrected source: the focused commit containing this record.
- Standard production build: `QuaJ3r3T5xBVFjJmQtowX` with the repository's established 4 GiB Node heap.
- Database: the focused browser journey used `vyapti_vschool_test` with all 118 migrations applied and none pending.
- No schema, migration, owner command, authorization, query or fixture changed in this presentation slice.

## Reference and application states

| Workspace | Exact approved reference | Application route | Relationship |
|---|---|---|---|
| Teacher | `VSchool_Teacher_Design/VSchool_Teacher_Review.html#/learning` | `/teacher/learning` | Exact directory reference within supported owner scope |
| Parent | `VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html#/learning` | `/family/learning?child=<authorized synthetic Student>` | Exact directory reference within supported owner projection |
| Student | `VSchool_Student_Design/VSchool_Student_Review.html#/assignments` | `/student/assignments?student=<authorized synthetic Student>` | Exact directory reference |

Equivalent populated states were captured before and after at 1440×1000 and 390×844 with device pixel ratio 1. The reference and application roots reported zero horizontal overflow. The before, corrected and reference images in this directory were directly inspected rather than treated as proof from DOM assertions alone.

## Corrected presentation

- Teacher and Parent assignment rows now use the shared compact directory composition: structured title/supporting metadata, aligned status and one clear row action.
- Mobile rows preserve readable metadata, a 42px action target, visible status and the existing workspace navigation without root overflow.
- Parent shows only owner facts it actually receives: `Published` or `Excused`. It does not infer Student response state.
- The Student directory already used the approved toolbar, responsive semantic table/card recipe, real server query state and correct status/action mapping; it was recaptured unchanged as the representative shared consumer.

## Explicit supported-scope deviations

- The Teacher reference includes search, filter, sort and additional tabs. `teacherWorkspace()` currently returns at most 100 authored assignments and exposes no query-bound search, filter, sort or pagination contract. No page-local subset sorting or unsupported tab destinations were added.
- The Parent reference displays Student work-state examples. The current Parent list projection exposes publication and excusal facts, not the Student's private submission state. The application therefore shows truthful publication state and records the missing owner projection rather than broadening Parent disclosure.
- The Student reference uses its historical `VSchool Sans` declaration. The application uses the approved locally served Inter assets; computed-font details are recorded in `before-metrics.json` and `after-metrics.json`.

## Verification

- `pnpm typecheck` — passed.
- `pnpm exec eslint app/teacher/learning/page.tsx app/family/learning/page.tsx` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; build `QuaJ3r3T5xBVFjJmQtowX`.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm test:e2e test/e2e/learning-publication.spec.ts --project=chromium --project=mobile --workers=1 --grep 'Teacher publishes one assignment and exact Parent and Student recipients can read it'` — passed 2/2 against real PostgreSQL. A server-side destination-stream-closed message occurred during navigation, but both journeys completed and Playwright exited successfully.

Human visual acceptance, native VoiceOver/NVDA, actual-browser 200% zoom, TEN-03 and production release remain pending.
