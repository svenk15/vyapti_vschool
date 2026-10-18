# Must-have M07 — assessment to published report

Status: `VERIFIED_CURRENT_SOURCE / HUMAN_REVIEW_PENDING`

Source under test: `d165806`. Isolated production build: `Wrd7P85a7tJo0u_ZOsWfN` with the repository's documented 4 GiB Node ceiling.

## Connected journey

The focused current-source browser journey provisioned one fictional approved report revision and explicit Student plus Guardian audience. It then:

1. handed the exact revision to a separately authorized Principal publisher;
2. generated the visibly synthetic PDF and passed the exact bytes through private Documents quarantine and the real local ClamAV engine;
3. deliberately lost the publish response and recovered the original committed result with the original command key;
4. downloaded the clean immutable version through current-purpose Family and Student accounts;
5. withdrew serving access under the separate current withdrawal capability; and
6. confirmed that the Family route no longer offered the file and explained that an earlier download cannot be recalled.

## Verification

- `VSCHOOL_E2E=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; build `Wrd7P85a7tJo0u_ZOsWfN`.
- `VSCHOOL_E2E_BUILT=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm test:e2e test/e2e/principal-assessments.spec.ts --project=chromium --grep "publishes one scanned report" --workers=1` — **1/1 passed**.
- The same focused command with `--project=mobile` — **1/1 passed**.
- `pnpm test:functional test/functional/assessment-report-publication.test.ts` — **4/4 passed** against real PostgreSQL `vyapti_vschool_test`; **117 migrations**, none pending.

The first sandboxed browser invocation stopped at Prisma's local connection boundary before tests ran. Repeating the same focused command with authorized localhost database/server access passed; no code or assertion changed.

## Visual inspection

The handoff, recovered publication, Family results, Student results and withdrawn Family states were inspected directly at 1440×1000 and 390×844. The production routed screens retain the accepted publication hierarchy, explicit audience, synthetic warning, focus treatment, responsive cards and current-role navigation. The mobile full-page Principal capture shows the sticky application header at its stitched viewport boundary; the interactive viewport itself passed the overflow and focus assertions.

## Remaining gates

Human acceptance, production template/signatory approval, production storage/region/retention/scanner-service policy, font portability, native accessibility, TEN-03 and production readiness remain pending. No real pupil document or production provider was used.
