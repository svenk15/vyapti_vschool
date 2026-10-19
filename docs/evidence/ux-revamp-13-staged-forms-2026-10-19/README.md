# UX-13 staged forms, review, receipts and recovery

Date: 19 October 2026 (Asia/Kolkata)

Candidate parent: `8c10388` plus the focused UX-13 changes recorded in this checkpoint

Standard build: `k8TnjrEVlWq3TyBY6C3mJ`

Isolated E2E build: `216VbkdMnLvqYNdXRef1Z`

Migrations: unchanged; development and test retain 118 forward migrations

## Outcome

- Teacher Learning creation now follows the exact expanded TEA-27 reference order: Task, Submission, Publication review, Confirm. Task fields remain in memory through Back/Continue; the existing owner command persists the draft at the Submission boundary; publication still occurs only from final confirmation.
- The page states the implemented written-response, late-work and receipt rules. It does not expose the prototype's unsupported file, in-class or late-review choices.
- Communication authoring retains exact revision review, separated publication authority, private scanned attachments and fail-closed scanner behavior while replacing implementation terminology with school-office language.
- Student registration, roster import, Attendance correction and Student work/receipt compositions were inspected as the remaining finite M01–M08 representatives. Their existing owner behavior did not require application changes.
- Assessment planning is carried into UX-14 because it is a specialized assessment-entry surface. Student file submission remains an owner-capability gap and is not presented as working UI.

## Reference and visual evidence

The exact Teacher source is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Teacher_Design/VSchool_Teacher_Review.html#/flow/TEA-27`, expanded to show all four stages. `reference-tea27-*` and `learning-create-final-*` are directly compared at 1440×1000 and 390×844. `communication-compose-final-*` records the corrected design extension at the same viewports. `corrected-metrics.json` records loaded Inter, zero root overflow and absence of the removed technical wording.

The registration, import, assessment and Student-work captures record representative current-source states. Historical exact functional/reference evidence remains authoritative for SA-18, SA-23, SA-27 and LEA-03; these screenshots are not relabelled as new owner verification.

## Verification

- `pnpm exec eslint components/learning-publish-flow.tsx components/notice-proposal-author-flow.tsx test/e2e/learning-publication.spec.ts` — passed.
- `pnpm exec tsc --noEmit` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; standard build above.
- `NODE_OPTIONS=--max-old-space-size=4096 VSCHOOL_E2E=1 pnpm build` — passed; isolated build above.
- `NODE_OPTIONS=--max-old-space-size=4096 VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/learning-publication.spec.ts --project=chromium --workers=1` — 1 passed in 20.1s against real PostgreSQL after 118 migrations.
- The same focused command with `--project=mobile` — 1 passed in 22.7s.

The final browser journey covers publication, immutable Parent/Student reads, Student submission lost-response recovery, Teacher feedback lost-response recovery and denial after access revocation. An early sandbox database-engine failure, a known 2 GiB build OOM, one accidentally unfiltered run that was stopped, and one stale isolated-build run are not counted as verification. No assertions or authorization boundaries were weakened.

## Gates

Human acceptance is PENDING. Native VoiceOver/NVDA, actual browser 200% zoom, TEN-03 and production release remain pending.
