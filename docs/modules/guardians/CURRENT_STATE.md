# Guardians — current state

Last updated: 14 October 2026.

FAM-01 through FAM-04 are **ENGINEERING_VERIFIED** at implementation commit `41e2469`. Human review is **PENDING**.

## Implemented

- FAM-01: designated branch-scoped `family.access.manage`, fixed three-purpose child bundle, dedicated single-use invitation, new/existing account acceptance, resend, per-child removal and family-aware account recovery.
- FAM-02: authenticated Parent shell, minimal child/current-school summary and multi-child selection from server-authorized links.
- FAM-03: Attendance-owned submitted history projection, exact child-purpose verification and `access_from` lower bound.
- FAM-04: Academics-owned effective published Timetable projection, exact child-purpose verification, active placement join, `access_from` lower bound, configured teaching days/LESSON/BREAK periods and navigable week selection.
- Student registration remains independently atomic. Its receipt now enters the guarded Parent setup for the exact new Student; lack of `family.access.manage` or invitation-delivery failure cannot roll back or duplicate registration.
- `pnpm demo:seed` incrementally prepares two accepted child links, a wrong-account pending invitation, retained revoked access and populated Attendance. Existing historical Timetable fixtures are preserved rather than moved to today.

## Verification evidence

- Migration `20261013223000_guardian_access_foundation` is applied to development and `vyapti_vschool_test`; the test harness reported 47 migrations and no pending test migration.
- Real PostgreSQL: `test/functional/guardians.test.ts` passes 6/6 against `vyapti_vschool_test`, covering designated-manager/self denial, no staff membership, exact replay/conflict, new/existing/wrong-account/expired/revoked/reused invitation behavior, acceptance/removal serialization, safe delivery failure after Student registration, per-child removal, cross-child tampering, authorization-date bounds, a six-day published pattern and mixed staff/family recovery policy.
- Playwright: `test/e2e/guardians.spec.ts` passes sequential Chromium desktop and mobile journeys for Administrator link, activation/sign-in, child home, Attendance, configured six-day Timetable, mobile drawer focus return, sign-out, delivery failure/resend/removal and access loss after an open Parent page reload. The registration journey separately proves receipt → Parent setup and persistence through delivery failure.
- Build and repository boundary/design checks are recorded in [checkpoint evidence](../../evidence/parent-guardian-foundation-2026-10-13/README.md).
- Direct screenshots compare the approved home, invitation, Attendance and published Timetable states with the real application at desktop/mobile sizes. The current integration evidence directly inspects registration handoff and six-day Timetable presentation. Unsupported prototype review tools, Messages, Requests, absence explanations and attendance queries are excluded because their owner contracts are outside this approved slice. The application uses configured break periods but does not fabricate rooms or change notices.

## Schema and migration state

The forward migration adds `vs_guardians_access_manager_grant`, `vs_guardians_child_access`, `vs_guardians_purpose_grant` and `vs_guardians_invitation`, with scoped keys, checks and indexes registered in `docs/database/TABLE_REGISTRY.json`. These are TEN-ADR-006 Path A tables: application authorization is active; database RLS enforcement remains deferred to TEN-03 and blocks production/real-client release.

## Limitations and next action

- The shipped reference uses embedded font assets whose redistribution provenance is not established; the application retains the documented Inter/system fallback. Exact font portability and human visual acceptance remain pending.
- Native VoiceOver/NVDA, production email/provider review and TEN-03 remain release gates.
- PAR-18 is partial: published child Timetable is implemented, while the broader Calendar/Events owner is absent.
- PAR-50 is partial: account/help/current-session sign-out is implemented; cross-session inventory/revocation is not part of the authorized slice.
- Other Parent workflows remain at their existing product-decision or owner-design gates. The next implementation action is the smallest independently authorized workflow after consolidated human review or a resolved owner contract; do not infer approval for later Fees, messaging, consent, custody or wellbeing behavior.
