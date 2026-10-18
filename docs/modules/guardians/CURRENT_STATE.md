# Guardians — current state

Last updated: 16 October 2026.

FAM-01 through FAM-04 are **ENGINEERING_VERIFIED** at implementation commit `41e2469`. FAM-05 is **ENGINEERING_VERIFIED** at `7d52491`. FAM-06 is engineering-verified with COM-01. FAM-07 is engineering-verified with ATT-05 for fictional local/test data. Human review is **PENDING**.

The combined Parent/Student handover, current build/migration provenance and manual walkthrough are recorded in [15 October consolidated evidence](../../evidence/parent-student-consolidated-2026-10-15/README.md).

**LEA-01 supported slice (15 October 2026):** Guardian access now supports the independent, non-backfilled `learning.assignment.read_child` purpose. Learning freezes the exact accepted Guardian binding at assignment publication and rechecks the same live access/purpose for every Parent read. Later grants do not add recipients retroactively. Focused Learning PostgreSQL and desktop/mobile browser evidence passed; PAR-20 remains a supported partial workflow because returned feedback, questions and its richer reference workflow are not implemented. See [Learning evidence](../../evidence/learning-publication-2026-10-15/README.md). Human review remains PENDING.

## Implemented

- FAM-01: designated branch-scoped `family.access.manage`, fixed three-purpose child bundle, dedicated single-use invitation, new/existing account acceptance, resend, per-child removal and family-aware account recovery.
- FAM-02: authenticated Parent shell, minimal child/current-school summary and multi-child selection from server-authorized links.
- FAM-03: Attendance-owned submitted history projection, exact child-purpose verification and `access_from` lower bound.
- FAM-04: Academics-owned effective published Timetable projection, exact child-purpose verification, active placement join, `access_from` lower bound, configured teaching days/LESSON/BREAK periods and navigable week selection.
- FAM-05: approved PAR-50 My account → End access → Confirm composition using the Access-owned safe account projection and session directory; final-only current/selected-session sign-out, retained Back state, privacy-safe labels and no token material.
- FAM-06: new invitations may independently grant `communication.notice.read`; existing accepted links are not widened, and Communication rechecks the exact live purpose for list, detail, read and acknowledgement.
- FAM-07: a designated manager can independently enable or revoke `attendance.explanation.submit` for one exact accepted child link. Existing links are not widened automatically; Attendance rechecks the live purpose on every Parent explanation read/write.
- Student registration remains independently atomic. Its receipt now enters the guarded Parent setup for the exact new Student; lack of `family.access.manage` or invitation-delivery failure cannot roll back or duplicate registration.
- `pnpm demo:seed` incrementally prepares two accepted child links, a wrong-account pending invitation, retained revoked access and populated Attendance. Existing historical Timetable fixtures are preserved rather than moved to today.

## Verification evidence

- Migration `20261013223000_guardian_access_foundation` is applied to development and `vyapti_vschool_test`; the test harness reported 47 migrations and no pending test migration.
- Real PostgreSQL: `test/functional/guardians.test.ts` passes 6/6 against `vyapti_vschool_test`, covering designated-manager/self denial, no staff membership, exact replay/conflict, new/existing/wrong-account/expired/revoked/reused invitation behavior, acceptance/removal serialization, safe delivery failure after Student registration, per-child removal, cross-child tampering, authorization-date bounds, a six-day published pattern and mixed staff/family recovery policy.
- Playwright: `test/e2e/guardians.spec.ts` passes sequential Chromium desktop and mobile journeys for Administrator link, activation/sign-in, child home, Attendance, configured six-day Timetable, mobile drawer focus return, sign-out, delivery failure/resend/removal and access loss after an open Parent page reload. The registration journey separately proves receipt → Parent setup and persistence through delivery failure.
- At `7d52491`, the focused Parent Playwright journey passes 1/1 separately in desktop Chromium and mobile Chromium with one worker after 48 migrations. It proves PAR-50 stage focus, retained selection after Back, final-only sign-out and protected browser Back. `VSCHOOL_E2E=1 pnpm build`, TypeScript, focused ESLint, `check:backend` and `check:boundaries` pass. No database contract changed. Evidence: [PAR-50 account](../../evidence/parent-account-par-50-2026-10-14/README.md).
- The 16 October PAR-50 extension passes 1/1 focused Parent journey separately at desktop and mobile sizes after 61 migrations. It proves two real Parent sessions, retained non-current selection through Back, final-only selective revoke and denial in the revoked browser. Existing ACC-01 PostgreSQL evidence supplies foreign-account isolation, concurrent idempotency, expiry and account-wide invalidation. Evidence: [PAR-50 cross-session extension](../../evidence/parent-sessions-par-50-2026-10-16/README.md).
- Build and repository boundary/design checks are recorded in [checkpoint evidence](../../evidence/parent-guardian-foundation-2026-10-13/README.md).
- ATT-05 focused evidence covers versioned purpose management, current-purpose revocation, active-case exclusion, real PostgreSQL lifecycle checks and desktop/mobile Parent/Admin comparison: [Attendance explanations](../../evidence/attendance-explanations-2026-10-15/README.md).
- Direct screenshots compare the approved home, invitation, Attendance and published Timetable states with the real application at desktop/mobile sizes. The current integration evidence directly inspects registration handoff and six-day Timetable presentation. Unsupported prototype review tools, Messages, Requests, absence explanations and attendance queries are excluded because their owner contracts are outside this approved slice. The application uses configured break periods but does not fabricate rooms or change notices.

## Schema and migration state

The forward migration adds `vs_guardians_access_manager_grant`, `vs_guardians_child_access`, `vs_guardians_purpose_grant` and `vs_guardians_invitation`, with scoped keys, checks and indexes registered in `docs/database/TABLE_REGISTRY.json`. These are TEN-ADR-006 Path A tables: application authorization is active; database RLS enforcement remains deferred to TEN-03 and blocks production/real-client release.

ATT-05 migration `20261015140000_attendance_explanations` extends the purpose check with `attendance.explanation.submit`; it does not backfill or auto-grant that purpose. Attendance-owned explanation/reviewer tables are registered separately. Development and test retain 54 applied migrations with no reset or history rewrite.

## Limitations and next action

- The shipped reference uses embedded font assets whose redistribution provenance is not established; the application retains the documented Inter/system fallback. Exact font portability and human visual acceptance remain pending.
- Native VoiceOver/NVDA, production email/provider review and TEN-03 remain release gates.
- PAR-18 is partial: published child Timetable is implemented, while the broader Calendar/Events owner is absent.
- PAR-50 is engineering-complete. Its approved optional other-session path is now supported through ACC-01 without adding Parent/child authority. Human review remains pending.
- Other Parent workflows remain at their existing product-decision or owner-design gates. The next implementation action is the smallest independently authorized workflow after consolidated human review or a resolved owner contract; do not infer approval for later Fees, messaging, consent, custody or wellbeing behavior.

## M01 current demo persona verification — 18 October 2026

The existing fictional Parent account has two accepted, unrevoked child links and no staff membership. The live build redirects it from the shared chooser to `/family`; both child contexts render at desktop/mobile sizes. Focused real-PostgreSQL Guardians tests passed 6/6, including intended-account/wrong-account handling, no staff side effect, delivery failure isolation, per-child removal and concurrency. No Guardian data, purpose, schema or migration changed. Evidence: [M01](../../evidence/must-have-m01-2026-10-18/README.md). Human review and release gates remain PENDING.
