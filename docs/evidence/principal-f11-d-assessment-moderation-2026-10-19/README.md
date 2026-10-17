# F11-D independent assessment moderation

Engineering source: `428a444`. Human review: **PENDING**.

## Outcome

An assigned Teacher can submit one complete plan item for moderation from `/teacher/assessments`. Assessments computes and stores the exact aggregate evidence version and digest, chooses one currently designated independent reviewer, and exposes the item through the typed leadership decision registry. Principal status alone grants no moderation authority.

The assigned reviewer can request bounded information from the current Teacher originator, recuse to another currently designated moderator, return, reject or approve the exact evidence. A response advances evidence and requires fresh review. The recorder cannot review their own submission. Approval records an Assessments owner result and never publishes a report. Exact replay produces one result; status lookup returns `UNKNOWN` honestly and rechecks current authority before disclosing `FOUND`.

The forward migration `20261019010000_assessments_moderation` adds the explicit reviewer grant and immutable event/information persistence and expands the moderation state. Development and test databases contain 101 forward migrations. Neither database was reset and no applied migration was edited.

## Verification

- Unit: `pnpm exec vitest run test/unit/assessment-moderation.test.ts` — 2/2 passed.
- PostgreSQL: `pnpm test:functional test/functional/assessment-moderation.test.ts` — 4/4 passed against `vyapti_vschool_test`. Coverage includes submit/replay/status, aggregate evidence without pupil details, information response and stale review, approve/replay/revoked disclosure, return/resubmit, self-review denial and recusal routing.
- Prisma validation, TypeScript, focused ESLint, database-design, documentation, boundary and portable-backend checks passed.
- `pnpm exec tsx scripts/demo-assessments.ts` passed twice without duplicate moderation records.
- Final isolated 4 GiB build passed with build ID `JOQrlPRb_fBFqYo3O9Etm`.
- Playwright ran sequentially with one worker after the final header correction: Chromium 2/2 and mobile 2/2 passed in `test/e2e/principal-assessments.spec.ts`.
- The first final browser invocation failed before Playwright because the local PostgreSQL service was unresponsive. The service was restarted, migration status confirmed at 101 with no pending migrations, and both focused projects then passed. The failed setup run is not counted as browser evidence.

## Direct visual comparison

Reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, LEA-21 expanded moderation state. Production uses the approved Screen Map routed composition: Teacher submission at `/teacher/assessments`, decision inbox at `/leadership/decisions`, and owner review at `/leadership/decisions/ASSESSMENTS_MODERATION/:id`.

Reference and application captures were directly inspected at 1440×1000 and 390×844. The production screens preserve the reference's exact-evidence review, information, recusal and final-decision hierarchy while using real routed recovery states. A misleading fixed readiness badge was removed after inspection and the focused journeys recaptured. Status is `DIRECT_COMPARISON_COMPLETE_WITH_DEVIATIONS`; routed production pages are not claimed pixel-identical to the workflow explorer.

- `reference-chromium.png`, `reference-mobile.png`
- `teacher-submitted-chromium.png`, `teacher-submitted-mobile.png`
- `principal-approved-chromium.png`, `principal-approved-mobile.png`

## Manual path

1. Sign in with the fictional Teacher from ignored `artifacts/people-02/private-demo.json`; open **Assessment marks**.
2. In **Moderation hand-off**, submit **Independent moderation check**. Expect an owner-confirmed submitted result and no publication claim.
3. Sign out, sign in with the fictional Principal from the same private file, and open **My decisions**.
4. Open the Assessments moderation item. Inspect aggregate counts/digest, request information or use an available decision action. Pupil names and marks must not appear.
5. Approve the refreshed exact evidence. Expect **Owner evidence approved** after reload and one retained owner result.

Font portability, actual browser 200% zoom, native VoiceOver/NVDA, TEN-03, human acceptance and production enablement remain pending.
