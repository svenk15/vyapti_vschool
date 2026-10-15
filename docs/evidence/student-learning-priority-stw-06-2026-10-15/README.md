# STW-06 Student Learning-priority checkpoint

Date: 15 October 2026. Human review: **PENDING**.

## Implemented supported slice

The Student **My day** page now composes the existing guarded next-class read with the LEA-01 Student assignment projection. **Focus on next** shows at most three future-due published assignments in the Learning owner's deterministic `(due_at,id)` order. Every row came from an exact frozen Student recipient and is reauthorized by `learning.assignment.read_self`; the browser cannot select tenant scope or recipient authority. The action opens the immutable assignment detail. Empty and temporary-failure states are distinct and a failed Learning read does not hide the independent timetable result.

No table, migration, write, transaction, idempotency contract, seed record or backend DTO changed. Existing LEA-01 real-PostgreSQL evidence remains applicable.

## Reference comparison

- Approved source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Student_Design/VSchool_Student_Review.html#/home`
- Approved captures: `docs/evidence/student-workspace-2026-10-14/reference-home-desktop.png` and `reference-home-mobile.png`
- Current application captures: `application-chromium.png` and `application-mobile.png` in this directory

The captures were inspected directly. The application now places the Learning priority first in the wider desktop column and first after the heading on mobile, with the approved outlined book icon treatment, assignment hierarchy, due badge and adjacent action. Real Student, school, class and due data replace prototype fixtures.

Remaining differences are explicit. The current e2e state has no published timetable occurrence, so it correctly renders the no-more-classes state while the separate next-class fixture proves the populated state. Returned feedback, room-change details, school updates and support requests are absent when their owner projections are absent. Existing profile/record cards remain available below the priority area. The established font-portability exception remains.

## Focused verification

- Focused ESLint for the Student page and Learning browser journey — passed.
- `pnpm typecheck` — passed.
- `VSCHOOL_E2E=1 pnpm build` — passed.
- Desktop Chromium, one worker: `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/learning-publication.spec.ts --project=chromium --workers=1` — 1/1 passed against `vyapti_vschool_test`, 57 migrations applied and none pending.
- Mobile Chromium, one worker: the equivalent `--project=mobile` command — 1/1 passed against the same dedicated test database.

The journey publishes through the Teacher UI, reads through the Parent session, signs in as the exact Student, verifies the due assignment on **My day**, keyboard-focuses and follows **Open assignment**, and reloads the assignment workspace/detail. Native VoiceOver/NVDA, actual browser zoom, font portability, TEN-03 and human acceptance remain pending gates.
