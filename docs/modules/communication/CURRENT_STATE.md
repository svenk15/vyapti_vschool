# Communication — current state

Last updated: 15 October 2026.

COM-01 is **ENGINEERING_VERIFIED**. The portable domain/application boundary, Prisma adapter, composition/server gateway, forward migrations, Administrator staged publication, Parent Messages/read/acknowledgement and focused unit/PostgreSQL/browser checks are implemented. Human review is **PENDING**.

## Evidence so far

- Unit: `test/unit/communication-notices.test.ts` 2/2 passed.
- Real PostgreSQL: `test/functional/communication-notices.test.ts` 2/2 passed against `vyapti_vschool_test` after 52 migrations. It proves exact notice purpose, explicit publisher grant, frozen recipient manifest, publication replay, separate read/ack evidence, acknowledgement replay, Administrator aggregate and denial after child-access revocation.
- Playwright: the complete Administrator publish → Parent read → acknowledge → reload journey passed 1/1 in desktop Chromium and 1/1 in mobile Chromium, sequentially with one worker. Direct 1440×1000 and 390×844 reference/application captures were inspected; the initial mobile capture exposed a grid cascade defect, which was corrected and recaptured.
- `pnpm check:db-design`, `pnpm check:boundaries`, `pnpm check:backend`, `pnpm check:docs`, `pnpm lint`, TypeScript and the production build passed for this slice. `pnpm demo:seed` includes the Communication fixture and writes private credentials only to the ignored `artifacts/communication-01/private-demo.json`.
- Development and test schemas contain four forward migration checkpoints. The first local development attempt exposed a Section composite-key mismatch and retained two DDL objects; it was recorded rolled back/applied through Prisma, and the additive recovery migration completed the missing schema without reset or deletion. Fresh test application applied the base and recovery migrations successfully. The final additive metadata migration records Path A ownership without rewriting applied history.

## Remaining limitations and next action

SA-35 remains partial beyond this narrow notice slice: durable drafts, tabs for drafts/delivery follow-up, scheduling, email/provider delivery, corrections, withdrawal, teacher authoring and private conversations are unimplemented and were not represented as working controls. PAR-14 is engineering-complete for the approved Parent read/acknowledge outcome. The approved-reference font has unresolved redistribution provenance, so the documented Inter/system substitution remains. Human review, native accessibility, TEN-03 and production provider review remain pending. Evidence: `docs/evidence/communication-par-14-2026-10-15/README.md`.

The next same-owner projection, STW-27/STW-28, is blocked on an actual grant-policy decision rather than technical design alone. The live Student portal intentionally carries only three exact self-read purposes. The prototype specifies audience behavior but does not authorize who may grant `communication.notice.read_self`, automatic/backfill behavior, frozen membership across transfers or the Administrator withdrawal capability needed for its retracted-notice recovery. The recommended contract and executable COM-02A–D split are recorded in `docs/execution/COMMUNICATION_STUDENT_PROJECTION_DECISION.md`; no Student authority was added.
