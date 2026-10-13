# Guardians — current state

Last updated: 14 October 2026.

FAM-01 through FAM-04 are **ENGINEERING_VERIFIED** on the working tree based on `20cdd8b5ce9ac73bb5f50719660c39db2912d193`; the focused checkpoint commit is recorded in the handoff after commit. Human review is **PENDING**.

## Implemented

- FAM-01: designated branch-scoped `family.access.manage`, fixed three-purpose child bundle, dedicated single-use invitation, new/existing account acceptance, resend, per-child removal and family-aware account recovery.
- FAM-02: authenticated Parent shell, minimal child/current-school summary and multi-child selection from server-authorized links.
- FAM-03: Attendance-owned submitted history projection, exact child-purpose verification and `access_from` lower bound.
- FAM-04: Academics-owned published Timetable projection, exact child-purpose verification, active placement join, `access_from` lower bound and navigable week selection.
- Student registration remains independent. Guardian setup is an explicit post-registration boundary; lack of `family.access.manage` cannot roll back or impersonate Student registration.
- `pnpm demo:seed` incrementally prepares two accepted child links, a wrong-account pending invitation, retained revoked access and populated Attendance. The existing published Timetable fixture is reachable by week navigation without rewriting its dates.

## Verification evidence

- Migration `20261013223000_guardian_access_foundation` is applied to development and `vyapti_vschool_test`; the test harness reported 47 migrations and no pending test migration.
- Real PostgreSQL: `test/functional/guardians.test.ts` covers designated-manager/self denial, no staff membership, exact replay/conflict, new/existing/wrong-account/expired/revoked/reused invitation behavior, acceptance/removal serialization, safe delivery failure, per-child removal, cross-child tampering, authorization-date bounds and mixed staff/family recovery policy.
- Playwright: `test/e2e/guardians.spec.ts` passes sequential Chromium desktop and mobile journeys for Administrator link, activation/sign-in, child home, Attendance, Timetable empty state, mobile drawer focus return, sign-out, delivery failure/resend/removal and access loss after an open Parent page reload.
- Build and repository boundary/design checks are recorded in [checkpoint evidence](../../evidence/parent-guardian-foundation-2026-10-13/README.md).
- Direct screenshots compare the approved home, invitation, Attendance and published Timetable states with the real application at desktop/mobile sizes. Unsupported prototype review tools, Messages, Requests, absence explanations and attendance queries are excluded because their owner contracts are outside this approved slice. The application’s week timetable uses only fields exposed by the approved owner projection and therefore does not fabricate rooms, breaks or change notices.

## Schema and migration state

The forward migration adds `vs_guardians_access_manager_grant`, `vs_guardians_child_access`, `vs_guardians_purpose_grant` and `vs_guardians_invitation`, with scoped keys, checks and indexes registered in `docs/database/TABLE_REGISTRY.json`. These are TEN-ADR-006 Path A tables: application authorization is active; database RLS enforcement remains deferred to TEN-03 and blocks production/real-client release.

## Limitations and next action

- The shipped reference uses embedded font assets whose redistribution provenance is not established; the application retains the documented Inter/system fallback. Exact font portability and human visual acceptance remain pending.
- Native VoiceOver/NVDA, production email/provider review and TEN-03 remain release gates.
- PAR-18 is partial: published child Timetable is implemented, while the broader Calendar/Events owner is absent.
- PAR-50 is partial: account/help/current-session sign-out is implemented; cross-session inventory/revocation is not part of the authorized slice.
- Other Parent workflows remain at their existing product-decision or owner-design gates. The next implementation action is the smallest independently authorized workflow after consolidated human review or a resolved owner contract; do not infer approval for later Fees, messaging, consent, custody or wellbeing behavior.
