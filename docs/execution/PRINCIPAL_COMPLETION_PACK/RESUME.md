# Programme resume

Current checkpoint: F13 / WF-36 / LEA-36 is **ENGINEERING_COMPLETE** in the working tree and ready for its focused commit; human review remains **PENDING**. F11-A/B/C/D remain verified. F11 as a foundation stays **PARTIAL** because LEA-20 still needs authorized Principal cycle selection and a typed Assessments-to-Coordination handoff, while LEA-22 report publication depends on the incomplete real-scanned Documents path.

Approved decisions: D01 preserves the existing COORD-02/LEA-10 contract. On 17 October 2026 the repository owner explicitly approved D02-D19 for synthetic-only implementation exactly as recorded in `02_PRODUCT_DECISIONS.md`, with no exceptions. This does not authorize production enablement, purchases, provider selection, real external messages or payments, real complaint data, or invented emergency procedures. Human acceptance remains separate.

Queue accounting: the 46 workflow rows now count 38 ENGINEERING_COMPLETE, two PARTIAL and six NOT_STARTED. Before the LEA-31 checkpoint the rows counted 28/2/16. The five workflows promoted through that checkpoint were LEA-28 (`69814ef`), LEA-30 (`1b90a48`/`0185853`), LEA-31 (`67a7a8c`), LEA-25 (`6d1fd2e`) and LEA-35 (`d2de45c`). LEA-12, LEA-13, LEA-14, LEA-21 and LEA-36 completed afterward. The partial rows are LEA-20 and LEA-32. LEA-27 and LEA-29 cover every currently registered decision owner, now including `ASSESSMENTS_MODERATION`; each later decision owner still requires its own typed registration and evidence.

F11-D verification: focused unit 2/2; real-PostgreSQL moderation lifecycle/security 4/4; Prisma validation, TypeScript, focused lint, database design, documentation, boundary and portable-backend checks passed. The focused seed passed twice. The final 4 GiB isolated build passed with build ID `JOQrlPRb_fBFqYo3O9Etm`. Sequential one-worker Playwright passed 2/2 Chromium and 2/2 mobile after the final header-state correction. Direct desktop/mobile inspection is recorded in `docs/evidence/principal-f11-d-assessment-moderation-2026-10-19/`.

F13 owner-foundation verification: focused unit 2/2; real-PostgreSQL lifecycle/security 2/2; Prisma validation, TypeScript, focused lint, database design, documentation, boundary and portable-backend checks passed. The tests prove explicit manager authority, participant provenance, accepted completion and replay without duplicate actions, decline denial and staff-access revocation. This does not yet establish the complete workflow or visual fidelity.

Database state: development and test databases contain 103 forward migrations through `20261019021000_coordination_meeting_action_source`. Neither database was reset and no applied migration was edited.

Next action: commit the verified F13 slice, then select the next eligible foundation from the task graph. F12/LEA-32 remains blocked from engineering-complete by a real scanner and authenticated serving/link contract; an adapter double is not sufficient. F14 under approved D15/D16 is the next independently designable synthetic-only owner foundation, beginning with the exact restricted referral/procedure contract and no invented emergency procedure.

Remaining workflows: LEA-20 PARTIAL; LEA-32 PARTIAL; LEA-22 NOT_STARTED and blocked by complete F12; LEA-37/38 through F14; LEA-43 through F15; LEA-44 through F16; LEA-45 through F17. Missing provider configuration for one foundation must not stop another independent task.

Demo credentials remain in ignored `artifacts/people-02/private-demo.json` and related private artifact files; never copy their values into Git or documentation. Before handoff, make a normal 4 GiB build from the latest committed source and run one demo server at `http://127.0.0.1:3402`.

Pending release gates: human review, font portability, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03, real-data retention/backup deletion and disclosure policy, provider/restore/load review and production enablement.
