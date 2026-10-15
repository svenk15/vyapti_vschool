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
