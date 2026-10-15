# COM-02 / STW-27–28 evidence — 15 October 2026

## Outcome

An independently authorized Student can now open the Messages destination, read a frozen exact-class text notice, record separate read evidence and deliberately acknowledge the current immutable version. A designated Student-access manager can add or remove only the `communication.notice.read_self` purpose using the versioned access command. Publication freezes typed Student recipient provenance; later access does not backfill the audience, transfer does not rewrite it, and current access, purpose, enrollment, account and branch authority are rechecked on every protected read and write.

The publishing Administrator can withdraw a notice through the staged reason/review/confirm composition. Withdrawal retains immutable evidence while Student and Parent recipients receive only a safe withdrawn summary; the protected body and acknowledgement action are unavailable. Attachments are not implemented because no approved scanned-file owner/download contract exists, so STW-27 remains **PARTIAL**. STW-28 is **ENGINEERING_COMPLETE** for the approved text-notice acknowledgement outcome. Human review is **PENDING**.

## Approved reference and direct comparison

- Reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Student_Design/VSchool_Student_Review.html#/messages/n1`.
- Reference desktop: [reference-notice-chromium.png](reference-notice-chromium.png)
- Application desktop: [student-notice-chromium.png](student-notice-chromium.png)
- Reference mobile: [reference-notice-mobile.png](reference-notice-mobile.png)
- Application mobile: [student-notice-mobile.png](student-notice-mobile.png)
- Safe withdrawal extension desktop/mobile: [student-withdrawn-chromium.png](student-withdrawn-chromium.png), [student-withdrawn-mobile.png](student-withdrawn-mobile.png)

The final images were inspected directly at 1440×1000 and 390×844, device scale factor 1. The comparison corrected the content-card width, full-width acknowledgement callout, question icon, action placement and mobile Messages destination. Data names/dates differ because the application uses isolated fictional database records. Unimplemented Student Learning, conversations, Requests and Calendar destinations remain omitted rather than faked. The approved font redistribution provenance is unresolved; the existing documented application fallback remains. The withdrawal state is the smallest consistent extension because the reference has no exact withdrawn-notice screen.

## Verification

- Unit: `test/unit/communication-notices.test.ts` — 3/3 passed.
- Real PostgreSQL focused Student projection: `test/functional/communication-student-notices.test.ts` — 2/2 passed against `vyapti_vschool_test` with 53 migrations.
- Existing Parent projection regression: `test/functional/communication-notices.test.ts` — 2/2 passed.
- Coherent functional checkpoint: 26 files / 156 tests passed in 96.09s. This broader run occurred once because the initial filter was forwarded incorrectly; it was not repeated.
- Playwright current-source desktop: `communication-notices.spec.ts`, Chromium, one worker — 2/2 passed.
- Playwright current-source mobile: `communication-notices.spec.ts`, mobile, one worker — 2/2 passed. One preceding run encountered a transient Next 404 during the withdrawal transition; inspection showed the 404 rather than a relaxed assertion, and an unchanged focused rerun passed.
- `pnpm check:db-design`, `pnpm check:boundaries`, `pnpm check:backend`, `pnpm check:docs` and TypeScript passed for the implemented slice. The isolated E2E build passed after the final visual correction.

The PostgreSQL cases cover exact purpose, same-class frozen membership, no later backfill, transfer preservation, read/acknowledgement replay, withdrawal, purpose revocation, foreign Student denial and stale withdrawal revision. The browser journey covers Administrator publish → Parent read/acknowledge → Student read/acknowledge → staged Administrator withdrawal → safe Student recovery.

## Schema and migration state

Forward migration `20261015130000_student_notice_projection` extends the constrained Student access-purpose value set and adds `vs_communication_student_recipient_binding` with organization/school/Student/access/recipient scope. It is applied to both designated local development and test databases; both report 53 applied migrations. No database was reset and no applied migration was edited.

## Remaining gates

Human visual/product review, native VoiceOver/NVDA, actual-browser 200% zoom, font portability, TEN-03 RLS/context proof and production provider/release review remain pending. No production readiness is claimed.
