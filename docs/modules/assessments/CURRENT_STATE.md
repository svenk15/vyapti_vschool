# Assessments current state

Last updated: 18 October 2026.

Status: **F11-A VERIFIED / LEA-20 PARTIAL / HUMAN_REVIEW_PENDING**.

D11 is approved for synthetic-only implementation. Commit `7eb5cb7` records the narrow LLD. The working implementation adds nine BRANCH tables, scaled-integer reconciliation, an explicit oversight grant, a portable Assessments facade, one-snapshot Prisma readiness projection and the `/leadership/assessments` recipe-L route with gated navigation. Numeric zero, missing, not assessed, absent and excused remain distinct; moderation and report states remain separate.

Development and test databases contain 99 forward migrations. The initial development application of `20261018230000_assessments_readiness_foundation` retained DDL before PostgreSQL rejected an incorrectly scoped Subject FK. Prisma recorded that attempt, the FK was corrected to include `school_id`, and the forward idempotent `20261018230100_assessments_readiness_foundation_repair` added the remaining scoped keys and immutable guards without dropping/resetting data. A fresh test database path applied both migrations successfully. This compatibility history must be preserved.

Focused unit reconciliation passed 2/2. Real-PostgreSQL readiness/security passed 2/2, covering the frozen denominator, numeric zero, absent versus missing, pending moderation, explicit grant requirement and revocation. Database design passed with 165 registered contracts; Prisma generation, TypeScript and focused lint passed. The idempotent development provisioner passed twice. Sequential one-worker Chromium and mobile reference/application cases passed 2/2 per viewport; after direct inspection corrected mobile labels and the desktop metric row, the changed-state recaptures passed 1/1 per viewport. The 4 GiB isolated production build passed with build ID `9yGR2HpAHgIuovsqu5MG4`. Evidence: `docs/evidence/principal-lea-20-assessments-2026-10-18/`.

LEA-20 is PARTIAL: the factual readiness projection and recipe-L production screen are verified, while the authorized cycle selector, real counterpart cycle/mark operations and typed Assessments-to-Coordination source handoff remain. LEA-21 and LEA-22 remain NOT_STARTED. Human review, font portability, native accessibility, actual browser 200% zoom and TEN-03 remain pending.
