# Student workspace checkpoint — 14 October 2026

Human acceptance is **PENDING**. Functional/security verification and visual comparison below are engineering evidence only.

## Authority and implemented slice

- Approved source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Student_Design/VSchool_Student_Review.html`, SHA-256 `74dc76af2e3b2000dfeb4b1258d49c6081aa255d6294f9ac6fe10ae59253cc9b` (matches `SOURCE_MANIFEST.json`).
- Application routes: `/student/invite`, `/student`, `/student/profile`, `/student/timetable`, `/student/attendance`, `/student/account`; Administrator management is composed on `/admin/students/[id]`.
- Implemented operations: operator designation, exact school authorization, intended-account activation, replacement invitation, per-Student revocation, OPERATOR_CLI assisted token issue, account-wide recovery affiliation, self profile/current class, published timetable and factual Attendance history.
- No public registration/search, Student impersonation, staff membership/role, Guardian grant, writable Student operation or fabricated future-owner data was added.

## Persistence and security evidence

- Forward migration `20261014100000_student_portal_access` is applied to local `vyapti_vschool` and `vyapti_vschool_test`; both recorded 48 applied migrations and no pending migration. It adds four Students-owned BRANCH tables registered under TEN-ADR-006 Path A. TEN-03 RLS/context enforcement remains incomplete and blocks production/real-client use.
- `pnpm test:functional test/functional/student-portal.test.ts --reporter=verbose`: 4/4 passed against real PostgreSQL. Cases cover exact Person binding, manager designation/self-grant denial, no staff/Guardian authority, classmate/foreign denial, per-Student revocation, account-wide recovery, concurrent acceptance/revocation and audited OPERATOR_CLI assistance.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/student-portal.spec.ts --project=chromium --workers=1`: 1/1 passed.
- The same command with `--project=mobile`: 1/1 passed. The journey covers authorization, setup, Student sign-in/home/profile/timetable/Attendance, keyboard focus containment/return and open-page revocation.
- `pnpm check` passed all lint/type/document/database-design/boundary/backend gates and 147/147 unit tests. `pnpm build` passed on Next.js 16.3.8. The production build is rerun after the final timetable composition below.
- An earlier accidental wrapper invocation included the complete functional suite. It passed 146 existing cases; the three new fixture cases then failed only because their generated Academic codes violated an existing uppercase constraint. The fixture was corrected and only the focused Student file was rerun. This failed run is not reported as a passing Student result.

## Direct visual comparison

The unmodified reference was served locally and compared with real application data at desktop 1440×1000 and mobile 390×844. Captures were opened and inspected, not merely generated.

| State | Reference | Application | Result |
|---|---|---|---|
| Home | `reference-home-{desktop,mobile}.png` | `application-home-{desktop,mobile}.png` | Shell, identity/context ribbon, hierarchy, cards and responsive navigation aligned. Real current-class/record content replaces unsupported prototype Learning/Communication cards. |
| Timetable | `reference-timetable-{desktop,mobile}.png` | `application-timetable-{desktop,mobile}.png` | Populated real week uses a five-day grid on desktop and day tabs/lesson rows on mobile. The capture uses the actual published week beginning 2026-10-26; genuine empty weeks remain supported. |
| Attendance | `reference-attendance-{desktop,mobile}.png` | `application-attendance-{desktop,mobile}.png` | Populated factual records align to the reference table/card density. Real record counts differ from prototype examples; OPEN is explicitly awaiting submission. |
| Activation | `reference-activation-{desktop,mobile}.png` | `application-activation-{desktop,mobile}.png` | Stages and visual language were compared. Application is a labelled anonymous security extension and therefore omits the authenticated Student shell/identity shown by the review prototype. |

Known deviations: the approved reference font assets are not redistributed by the application pending provenance/licensing approval; absent Learning, Communication, Requests, Results, Services and AI owners prevent exact body/content parity; room, break and substitution values are omitted when not present in owner data. Native VoiceOver/NVDA and actual-browser 200% zoom were not performed.

## Demo

- Entry: `http://127.0.0.1:3400/sign-in`
- Student credentials and pending setup token: ignored mode-0600 `artifacts/students-portal/private-demo.json` (values are never printed).
- Administrator/Teacher credentials: ignored `artifacts/people-02/private-demo.json`.
- Seed: `pnpm demo:seed` passed after correcting the Student feature seeder to reuse its already-bound active persona on repeat runs. Feature-owned scripts preserved existing credentials/records and did not reset the development database. Independent legacy TEN-02/ACA-01/BRD-02 refreshers reported their existing non-required NOT_FOUND/CONFLICT states and were explicitly preserved; every required seeder, including Admissions, Timetable, Parent and Student, succeeded.
- The Student timetable has real published occurrences beginning 2026-10-26. Attendance is populated for the seeded Student. The development fixture has same-class, pending and revoked Student cases; foreign denial is verified in the dedicated PostgreSQL database because the existing development fixture has no foreign-branch Student.
