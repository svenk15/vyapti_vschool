# Programme resume

Current checkpoint: F11-A, F11-B, F11-C and F11-D are **VERIFIED**. WF-21 / LEA-21 is **ENGINEERING_COMPLETE** at implementation source `428a444`; human review remains **PENDING**. F11 as a foundation stays **PARTIAL** because LEA-20 still needs authorized Principal cycle selection and a typed Assessments-to-Coordination handoff, while LEA-22 report publication depends on the incomplete real-scanned Documents path.

Approved decisions: D01 preserves the existing COORD-02/LEA-10 contract. On 17 October 2026 the repository owner explicitly approved D02-D19 for synthetic-only implementation exactly as recorded in `02_PRODUCT_DECISIONS.md`, with no exceptions. This does not authorize production enablement, purchases, provider selection, real external messages or payments, real complaint data, or invented emergency procedures. Human acceptance remains separate.

Queue accounting: the 46 workflow rows now count 37 ENGINEERING_COMPLETE, two PARTIAL and seven NOT_STARTED. Before the LEA-31 checkpoint the rows counted 28/2/16. The five workflows promoted through that checkpoint were LEA-28 (`69814ef`), LEA-30 (`1b90a48`/`0185853`), LEA-31 (`67a7a8c`), LEA-25 (`6d1fd2e`) and LEA-35 (`d2de45c`). LEA-12, LEA-13, LEA-14 and LEA-21 completed afterward. The partial rows are LEA-20 and LEA-32. LEA-27 and LEA-29 cover every currently registered owner, now including `ASSESSMENTS_MODERATION`; each later owner still requires its own typed registration and evidence.

F11-D verification: focused unit 2/2; real-PostgreSQL moderation lifecycle/security 4/4; Prisma validation, TypeScript, focused lint, database design, documentation, boundary and portable-backend checks passed. The focused seed passed twice. The final 4 GiB isolated build passed with build ID `JOQrlPRb_fBFqYo3O9Etm`. Sequential one-worker Playwright passed 2/2 Chromium and 2/2 mobile after the final header-state correction. Direct desktop/mobile inspection is recorded in `docs/evidence/principal-f11-d-assessment-moderation-2026-10-19/`.

Database state: development and test databases contain 101 forward migrations through `20261019010000_assessments_moderation`. Neither database was reset and no applied migration was edited. The final browser run first exposed an unresponsive local PostgreSQL service before Playwright started; restarting the local service restored access, and both focused projects then passed with no pending migrations.

Next eligible task: F13 / WF-36 / LEA-36. D14 is approved and F04 is engineering-complete. Read the existing Meetings package definition and relevant Communication/Requests owner contracts, then write the narrow owner LLD for scheduling, explicit purpose-granted participants, versioned participant responses and reviewed follow-up actions before substantive code. Decline must never mean held, removed participants must lose future summary access, and meeting membership must not grant source case/HR/student access.

Remaining workflows: LEA-20 PARTIAL; LEA-32 PARTIAL; LEA-22 NOT_STARTED and blocked by complete F12; LEA-36 eligible through F13; LEA-37/38 through F14; LEA-43 through F15; LEA-44 through F16; LEA-45 through F17. Missing provider configuration for one foundation must not stop another independent task.

Demo credentials remain in ignored `artifacts/people-02/private-demo.json` and related private artifact files; never copy their values into Git or documentation. Before handoff, make a normal 4 GiB build from the latest committed source and run one demo server at `http://127.0.0.1:3402`.

Pending release gates: human review, font portability, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03, real-data retention/backup deletion and disclosure policy, provider/restore/load review and production enablement.
