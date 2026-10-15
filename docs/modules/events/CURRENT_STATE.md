# Events current state

## EV-01

Status: ENGINEERING_VERIFIED_SUPPORTED_SLICE / DIRECT_COMPARISON_PARTIAL / HUMAN_REVIEW_PENDING

The narrow one-off Calendar/Events contract was established on 15 October 2026 under the authorized eight-hour Parent/Student programme. It uses an Events-owned publisher grant and persistence boundary, the existing communication release, exact frozen Student recipients, independently provisioned Parent/Student purposes and versioned publication evidence.

Schema/migration: forward migrations `20261015150000_events_calendar_foundation` and `20261015151000_events_calendar_purposes` are applied to both `vyapti_vschool` and `vyapti_vschool_test`. The databases report 56 applied migrations. Six `vs_events_*` tables are registered as Path A tenant tables whose RLS enforcement remains at the TEN-03 production gate. The foundation migration also adds the scoped Section key required by the Events composite foreign key.

Implementation: designated publishers can create/resume drafts, publish an immutable first version, publish a revised immutable version and cancel without deleting the frozen audience. Parent and Student access requires an independently provisioned calendar purpose and exact access binding frozen at publication. Reads recheck the live account, purpose, original branch and module state. Timed input and display use the branch timezone.

Verification on the source prepared for the EV-01 commit:

- `pnpm test:functional test/functional/events-calendar.test.ts` — PASS, 3/3 using real PostgreSQL. Covers replay, frozen audience, later-grant non-retroactivity, Parent/Student reads, revision, cancellation retention, stale version, live purpose revocation, cross-school/cross-child denial, concurrent draft updates and revoked publisher denial.
- `pnpm test:e2e test/e2e/events-calendar.spec.ts --project=chromium` — PASS, one worker at 1440×1000.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/events-calendar.spec.ts --project=mobile` — PASS, one worker at 390×844.
- `pnpm check:db-design` — PASS; registry and Prisma agree on 86 physical tables.
- `pnpm check:boundaries` — PASS.
- `pnpm check:backend` — PASS.
- `pnpm check:docs` — PASS before this final evidence-only update.
- `pnpm lint` — PASS.
- `pnpm build` — PASS on the final current application source.
- `pnpm demo:seed` — the Calendar seed completed and preserved its deterministic private scenario. Existing independent TEN-02, ACA-01 and BRD-02 refresh steps reported preservation warnings and continued; they were not represented as Calendar failures or successful refreshes.
- Direct screenshots and reference captures are in `docs/evidence/events-calendar-2026-10-15/`.

Visual comparison: the Parent PAR-18 and Student STW-31 references were opened unchanged and directly inspected beside the application. The application matches the established shared shell, context, card, action and responsive recipes. The approved screens describe wider multi-stage Calendar workflows: PAR-18 includes category/date agenda composition and STW-31 also includes assessments and interest language. EV-01 is therefore a truthful supported subset rather than full reference fidelity. The administrator publisher is a narrow reference-less extension using approved shared composition patterns.

Limitations: recurrence, RSVP/interest, consent, capacity, attachments, external delivery, mixed timetable/event agenda, assessment dates and payments are excluded. Font portability, native accessibility, TEN-03 and human review remain pending.

Next action: create the focused checkpoint, restart the demo from that commit and select the smallest eligible shared capability from the recorded backlog.

## EV-02

Status: ENGINEERING_VERIFIED_SUPPORTED_SLICE / DIRECT_COMPARISON_PARTIAL / HUMAN_REVIEW_PENDING

EV-02 adds the approved Parent agenda controls without changing EV-01 audience authority. New drafts require `HOLIDAY`, `MEETING` or `CLASS_EVENT`; pre-EV-02 records remain `GENERAL`. Category is copied into each immutable publication version. Parent From/category reads and calendar export reauthorize the exact accepted Guardian access, independent purpose, original branch, module state and frozen current-version recipient. Export contains permitted event facts only and does not include child identity, other recipients, staff data or tokens.

Schema/migration: forward migration `20261016120000_events_agenda_categories` is applied to both `vyapti_vschool` and `vyapti_vschool_test`. Each reports 62 applied migrations. It adds category checks and scoped agenda indexes to the existing BRANCH-classified Events tables. TEN-03 remains the RLS enforcement gate.

Verification on the EV-02 checkpoint source:

- `pnpm test:unit test/unit/events.test.ts` — PASS, 2/2.
- `pnpm test:functional test/functional/events-calendar.test.ts` — PASS, 3/3 against PostgreSQL. Covers typed publication, school-local From/category filtering, minimal export, frozen recipients, purpose revocation, cross-scope denial, replay, stale version and concurrent draft protection.
- focused desktop Chromium Playwright — PASS, 1/1 with one worker.
- focused mobile Playwright — PASS, 1/1 with one worker.
- `pnpm typecheck`, focused ESLint, `pnpm check:db-design` and the E2E-mode production build — PASS.
- `pnpm check:docs`, `pnpm check:boundaries`, `pnpm check:backend` and the final normal `pnpm build` — PASS.
- Database-design validation reports 96 physical table contracts in agreement.
- `pnpm demo:seed` — the Events fixtures completed idempotently and preserved prior records; private data remains in the ignored `artifacts/events-01/private-demo.json`. Independent TEN-02, ACA-01 and BRD-02 refresh steps reported preservation warnings and continued; they are not represented as Events failures or successful refreshes.
- New screenshots and the comparison record are in `docs/evidence/events-agenda-par-18-2026-10-16/`.

Visual comparison: the approved PAR-18 Calendar stage and the populated live Parent agenda were inspected side by side at desktop and mobile sizes. The application follows the shared Parent shell, content width, typography scale, field/button sizing and responsive stacking. The approved artifact is a three-stage review prototype; the live current-release route is a real read-only agenda with From/category filtering, privacy-minimal export and authorized detail navigation. That structural difference remains explicitly unaccepted rather than being described as exact fidelity. The standard font portability exception remains.

Limitations: PAR-18 remains partial for a combined Timetable/Event agenda, academic closure semantics and advanced event interactions. EV-02 does not add recurrence, RSVP, consent, capacity, payments, attachments or assessment-date ownership. Native accessibility, font portability, TEN-03 and human review remain pending.

Next action: checkpoint EV-02, serve that exact source and select the next independently eligible Parent/Student capability.

## EV-03

Status: ENGINEERING_VERIFIED_SUPPORTED_SLICE / DIRECT_COMPARISON_PARTIAL / HUMAN_REVIEW_PENDING

EV-03 applies the approved STW-31 upcoming-agenda rule to the exact Student Events projection. The page sends the current branch-local civil date; the repository repeats live Student account/access/purpose/module and frozen-recipient checks, then includes only current versions whose all-day or timed interval has not ended. The Student sees the immutable category, school-local schedule, audience label, description and canceled state. Direct event detail retains its independent authorization and is not hidden merely because the event has moved outside the list window.

No schema, migration, purpose or write path changed. Both databases remain at 62 applied migrations. The existing EV-02 indexes support the predicate.

Verification:

- `pnpm typecheck` and focused ESLint — PASS.
- `pnpm test:functional test/functional/events-calendar.test.ts` — PASS, 3/3 against PostgreSQL, including the Student From/category boundary.
- focused Chromium desktop Playwright — PASS, 1/1 with one worker.
- focused mobile Playwright — PASS, 1/1 with one worker.
- `pnpm check:docs`, `pnpm check:boundaries` and `pnpm check:backend` — PASS.
- isolated E2E and final normal production builds — PASS.
- Direct desktop/mobile inspection against the approved `STW-31` workflow and Calendar shell is recorded in `docs/evidence/events-student-agenda-stw-31-2026-10-16/`.

Visual comparison: the live screen follows the approved Student shell, hierarchy, content width, card/button sizing and mobile stacking. The approved `STW-31` state is a generic guided-review form; the live screen is an operational, authorized populated agenda. That difference is a labelled composition extension, not a claim of exact screen parity. Fictional reference assessment details were not copied into production.

Limitations: STW-31 remains partial until an Assessment owner defines and publishes schedule facts. Venue, participation requirements and contact are shown only when truthfully present in the bounded event description; they are not fabricated as new fields. STW-32 interest, capacity and consent remain an explicit unapproved extension. Font portability, native accessibility, TEN-03 and human review remain pending.

Next action: checkpoint EV-03, serve that exact source and continue with the next independently eligible Parent/Student owner capability.

## EV-04

Status: ENGINEERING_VERIFIED_SUPPORTED_SLICE / DIRECT_COMPARISON_PARTIAL / HUMAN_REVIEW_PENDING

EV-04 closes PAR-18's independently implementable combined-read gap. `/family/calendar` now shows the effective published teaching week containing the selected From date, followed by the permitted one-off Events agenda. Timetable and Events remain independently authorized on the server. The teaching section is omitted unless the selected exact child currently has `timetable.read_child`; event rows still require `calendar.event.read_child` and the frozen current-version recipient. Child/date changes resolve both projections again and the full-timetable/event links retain the authorized child context.

Schema/migration: none. The read-only page composition adds no transaction, lock, receipt, purpose or cross-owner write. Development and test databases remain at 62 applied migrations.

Verification on the EV-04 checkpoint source:

- `pnpm typecheck` — PASS.
- focused ESLint for `app/family/calendar/page.tsx` and `test/e2e/events-calendar.spec.ts` — PASS.
- normal production build and isolated E2E production build — PASS.
- focused Chromium Playwright — PASS, 1/1 with one worker.
- focused mobile Playwright — PASS, 1/1 with one worker.
- the browser fixture proves current accepted Parent access, required module dependencies, independent calendar/timetable purposes, one class-scoped published event and an effective six-day published teaching pattern.
- unchanged real-PostgreSQL evidence remains applicable: EV-02 Events filtering/scope/revocation passed 3/3 and Guardian Timetable effective-day/scoped-access evidence passed on unchanged backend owners.
- screenshots and the direct inspection record are in `docs/evidence/parent-combined-calendar-par-18-2026-10-16/`.

The first browser attempt served a stale `.next-e2e` build; the trace identified the old page. After rebuilding the correct isolated artifact, the next attempt correctly failed because the focused fixture had omitted Timetable's documented `staff_core` entitlement dependency. Adding that test entitlement resolved the setup defect. No application permission or assertion was weakened.

Visual comparison: the unchanged PAR-18 review prototype and current application were inspected at 1440×1000 and 390×844. The operational page follows the approved Parent shell, hierarchy, dimensions, controls, card density and responsive stacking. The reference has no exact mixed read screen, so this remains a transparent supported composition extension rather than exact fidelity. The day grid demonstrates six teaching days and does not assume Monday–Friday.

Limitations: PAR-18 remains partial for academic-closure semantics and advanced event interactions. An Events `HOLIDAY` category never changes the academic calendar. Recurrence, response/withdrawal, capacity and consent remain separately owned gaps. Font portability, native accessibility, TEN-03 and human review remain pending.

Next action: commit and serve EV-04, then select the smallest independently implementable Parent/Student gap whose product contract is already approved.
