# SA-23 roster preview composition evidence

Recorded 11 October 2026. Human review is **PENDING**.

## Authority and routes

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-23`
- Application: `/admin/imports`
- Existing processing handoff: `/admin/imports/manage?jobId=<opaque id>`

The application matches the approved Target and template → Choose file → Review preview → Confirm composition. It replaces prototype totals with authorized server decisions and the fictional school shell with the current session's institution, branch, year and permitted navigation. The final action acknowledges the saved preview only; it does not confirm or process import rows.

## Visual evidence

Matching viewport captures are `reference-{target,file,review,confirm}-{desktop,mobile}.png` and `application-{target,file,review,confirm}-{chromium,mobile}.png`. Reference capture metadata is in `reference-capture.json`. The images were inspected directly after the final four-stage correction. Shared sizing, card/aside placement, step state, table density and final action placement align with the approved composition. Remaining deviations are the recorded body-font fallback, real authorized navigation/context/data, and the intentionally disabled durable-draft action because no accepted persistence contract exists.

## Verification

- `node scripts/capture-admin-sa23-reference.mjs` — PASS; approved reference captured at 1440×1000 and 390×844, device scale factor 1, with no horizontal overflow.
- `pnpm test:e2e test/e2e/import-preview.spec.ts --project=chromium --project=mobile -g "creates and reviews a roster preview"` — PASS, 2/2 in 2.1 minutes; desktop and mobile exercise all stages, heading focus, actual CREATE decision, confirmation and zero Student writes against `vyapti_vschool_test` with all 38 migrations applied.
- The unchanged full processing journey was previously rerun at `/admin/imports/manage` and passed on Chromium. Existing IMP-01/02/03 PostgreSQL authorization, replay, transaction and recovery evidence remains applicable because this slice changes presentation and route composition only.
- No schema, migration, seed, backend contract or authorization rule changed.

An earlier command included an extra `--`; the wrapper therefore started the broad 112-test suite. It was stopped after one unrelated Academics setup failure and produced no SA-23 result. The first correctly scoped run then found an ambiguous test locator and mobile focus race; both were fixed before the passing focused rerun. These attempts are not counted as passes.

## Manual walkthrough

1. Sign in as the private School Administrator persona and open `/admin/imports`.
2. Select the year, source namespace and effective date; Continue to choose a UTF-8 CSV.
3. Create the preview and inspect actual row decisions. Use Back and confirm the safe inputs remain.
4. Acknowledge the preview, Continue to the separate confirmation stage, then Confirm. Expect **Roster preview ready** and an explicit statement that no Student, Person, enrollment or placement changed.
5. Open **Review import actions** to continue the independently authorized SA-24 processing journey.

Native VoiceOver/NVDA/browser-zoom evidence, body-font resolution, production RLS and human visual acceptance remain pending release gates.
