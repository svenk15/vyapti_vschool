# M02 — school setup to an operational class

Status: engineering verified for the must-have journey on 18 October 2026; human review pending.

## Supported journey

The current release composes the existing owner operations rather than inventing a cross-owner setup command:

1. An authorized School Administrator creates and opens an academic year, publishes its calendar, and creates a grade, section and subject in `/admin/academics`.
2. The administrator creates a course offering and a dated assignment for a verified, active Teacher in `/admin/classes`.
3. That Teacher signs in and sees only the currently authorized class in `/teacher/classes`.

The connected development fixture contains an open `Synthetic Academic Year 2026–27`, Grade 8, sections A/B, Mathematics, offering `DEMO-MATH8A`, and one dated assignment to Avery Example. The Teacher projection shows Demo Section A with three pupils. These are persisted owner records; the UI does not fabricate totals or authority.

## Current-source verification

- Application source: `d6c9120`; documentation/verifier baseline at `2cb27e9`; live build ID `jCObsKqoFwjNr2pibKzUn`.
- Demo: `http://127.0.0.1:3400` (health ready during this checkpoint).
- `pnpm test:functional test/functional/academics-setup.test.ts test/functional/people-employees.test.ts` — **19/19 passed** against `vyapti_vschool_test`, with all 117 forward migrations applied and none pending.
- The PostgreSQL cases cover scoped setup persistence, duplicate-section serialization, foreign-branch/revoked-permission denial, rollback, immutable calendar publication, offering foreign keys, overlapping assignment rejection, versioned assignment end, employment cutoff, verified same-branch account binding and Teacher authorization denial.
- A connected Playwright smoke used the normal administrator and Teacher personas and inspected `/admin/academics`, `/admin/classes` and `/teacher/classes` at 1440×1000 and 390×844. It observed one grade, one subject, two sections, one offering, one dated Teacher assignment and one authorized Teacher class.

## Visual evidence

- [Academic setup desktop](academic-setup-desktop.png)
- [Academic setup mobile](academic-setup-mobile.png)
- [Classes and teachers desktop](classes-desktop.png)
- [Classes and teachers mobile](classes-mobile.png)
- [Teacher classes desktop](teacher-classes-desktop.png)
- [Teacher classes mobile](teacher-classes-mobile.png)

The current captures were inspected for hierarchy, control alignment, wrapping, responsive stacking and unauthorized data exposure. They remain consistent with the approved shared compositions previously compared in [EX-07](../ex-07/README.md) and [Teacher classes](../teacher-classes-2026-10-13/README.md). This checkpoint does not promote broader SA-09/SA-10/SA-11 catalogue semantics beyond the supported separate operations.

## Remaining gates

Human review is pending. Native VoiceOver/NVDA evidence, font portability and TEN-03 restricted-role/RLS proof remain release gates. No production readiness is claimed.
