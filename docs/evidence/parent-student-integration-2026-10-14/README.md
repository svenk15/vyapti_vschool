# Parent/Student integration closure — 14 October 2026

Implementation commit: `41e2469`. Human acceptance is **PENDING**. The approved Parent and Student HTML files remain unchanged; the reference font, native VoiceOver/NVDA, actual browser zoom and TEN-03 gates remain pending.

## Closed integration gaps

- Administrator registration now ends with a receipt action that opens the exact new Student's guarded Parent-access composition. The Student command and Guardian authorization remain separate commits. A simulated post-commit delivery failure leaves one Student and one Guardian authorization; replay returns the original Student rather than creating another.
- STW-04 now has a repeat-safe synthetic account with two separately authorized and accepted Student contexts in different fictional Institutions. Server projection, browser switching, stale-identity clearance and revocation of only one link were verified without inferred cross-school identity.
- Parent and Student Timetable projections resolve the effective immutable publication independently for each date. Their DTOs include configured teaching days and ordered LESSON/BREAK periods. A six-day fixture proves Saturday and breaks render on desktop/mobile; absent publication still uses the genuine empty state.

No schema or migration changed. Application authorization, module checks, exact Student/Person binding, dated Enrollment/Placement and Parent purpose grants remain active.

## Focused verification

| Check | Result |
|---|---|
| `pnpm test:functional test/functional/student-portal.test.ts --reporter=verbose` | 5/5 passed against real `vyapti_vschool_test`; 48 migrations, none pending |
| `pnpm test:functional test/functional/guardians.test.ts --reporter=verbose` | 6/6 passed against real `vyapti_vschool_test`; 48 migrations, none pending |
| Student registration Playwright, Chromium/mobile, one worker | 1/1 each; receipt handoff and delivery-failure persistence verified |
| Student workspace Playwright, Chromium/mobile, one worker | 1/1 each; two contexts, switch isolation, scoped revocation and six-day Timetable verified |
| Parent workspace Playwright, Chromium/mobile, one worker | 1/1 each; wrong-account, revocation, role separation and six-day Timetable verified |
| `pnpm typecheck`, focused ESLint, `pnpm check:backend`, `pnpm check:boundaries` | Passed |
| `VSCHOOL_E2E=1 pnpm build` | Passed on current implementation source |
| `pnpm demo:seed` | Completed; required Parent/Student seeders succeeded and preserved existing data/credentials. Existing independent TEN-02/ACA-01/BRD-02 refresh conflicts were retained and reported, not represented as passes. |

One mobile Student assertion initially targeted the hidden desktop table, and one Parent assertion assumed punctuation absent from the rendered date. Both were selector defects. A later screenshot inspection found a real mobile spacing defect between an empty period's label and status; the CSS was corrected, the affected mobile journey rerun, and the final capture inspected.

## Reference/application evidence map

Approved authorities:

- Parent: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html`
- Student: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Student_Design/VSchool_Student_Review.html`

| Surface | Reference/application evidence | Current result |
|---|---|---|
| Parent home and child selection | `../parent-guardian-foundation-2026-10-13/reference-home-*` and `application-home-*`; unchanged shell/navigation re-exercised by current Playwright | Direct comparison remains applicable; real child counts may differ from prototype examples. |
| Parent Attendance | `../parent-guardian-foundation-2026-10-13/reference-attendance-*` and `application-attendance-*`; unchanged route re-exercised | Direct comparison remains applicable; unsupported explanation/query actions stay separate owner gaps. |
| Parent Timetable | Earlier matched pair above plus `parent-timetable-{chromium,mobile}.png` | Current source inspected. Configured Saturday and break rows/cards render without a five-day assumption. Extra-day rendering is a consistent owner-data extension, not a hard-coded reference value. |
| Parent Account | Current route/sign-out re-exercised desktop/mobile; approved `#/account` is the reference state | Functional current-source evidence exists. Exact body parity remains partial because notification preferences, contact update and privacy-request owners are not implemented; no dead controls are shown. |
| Student home/context selection | `../student-workspace-2026-10-14/reference-home-*`, earlier `application-home-*`, and `student-context-{chromium,mobile}.png` | Two authorized contexts appear; selected-context data replaces the previous identity and a revoked candidate falls back to the surviving binding. |
| Student Profile | `/student/profile` current-source browser evidence | This minimal read-only self projection is an explicitly recorded extension; the Edition 01 reference has no separate profile page. |
| Student Timetable | `../student-workspace-2026-10-14/reference-timetable-*` plus `student-timetable-{chromium,mobile}.png` | Current source inspected. Six configured days, period labels and breaks render; mobile label/status spacing was corrected. |
| Student Attendance | `../student-workspace-2026-10-14/reference-attendance-*` and `application-attendance-*`; unchanged route re-exercised | Direct comparison remains applicable; own factual rows only. |
| Student Account | Current route/sign-out re-exercised; approved `#/account` is the reference state | Supported current-session sign-out/help are real. Preferences, cross-session inventory and privacy-request actions remain omitted owner-contract gaps. |
| Parent/Student setup and activation | `../parent-guardian-foundation-2026-10-13/reference-invitation-*` / `application-invitation-*` and `../student-workspace-2026-10-14/reference-activation-*` / `application-activation-*` | Intentional anonymous public-auth compositions retain generic errors and intended-account checks; the prototype's authenticated review shell is not copied as authority. |
| Administrator registration handoff | `registration-entry-*`, `registration-receipt-*`, `registration-parent-failure-*` | Current source directly inspected. The receipt clearly separates committed registration from guarded Parent onboarding and exposes the supported next action. |

The new screenshots use Playwright project viewports (`chromium` desktop and `mobile` 390×844), not native browser zoom. Screenshots were opened and inspected for hierarchy, spacing, clipping, responsive composition and stale identity. Functional success is not treated as human visual acceptance.

## Remaining partial workflows

| Workflow | Exact remaining gap | Classification |
|---|---|---|
| PAR-18 | Calendar/event list, event detail and response lifecycle beyond the completed published Timetable slice | Missing Events owner design/implementation; not a Timetable defect |
| PAR-50 | Other-session inventory and revocation beyond working current-session sign-out | Missing approved cross-session owner contract and implementation |
| STW-06 | Real next-class/learning-task plan beyond current class, Timetable and Attendance links | Missing Learning/task owner projection |
| STW-44 | Other-session inventory/revocation beyond working current-session sign-out | Missing approved cross-session owner contract and implementation |
| STW-46 | Actionable privacy/accessibility request route, routing and lifecycle | Missing Requests owner/product contract |

STW-04 is no longer partial: its functional/security and direct current-source visual evidence are complete. Human review remains **PENDING** for every row.

## Demo

- Entry: `http://127.0.0.1:3400/sign-in`
- Seed: `pnpm demo:seed`
- Administrator credentials: ignored `artifacts/people-02/private-demo.json`
- Parent credentials: ignored `artifacts/guardians-01/private-demo.json`
- Student credentials: ignored `artifacts/students-portal/private-demo.json`

The Student artifact records the preserved second-context fixture identifiers but never prints credentials or tokens. Demo rows are fictional and repeat runs do not overwrite user-created records.
