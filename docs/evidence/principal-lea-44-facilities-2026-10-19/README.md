# LEA-44 Facilities incident evidence

Status: **ENGINEERING_COMPLETE** for approved D18 synthetic-only scope. Visual status: **DIRECT_COMPARISON_COMPLETE_WITH_DEVIATIONS**. Human review: **PENDING**. Production enablement: **BLOCKED** by existing release gates.

The approved authority is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, explorer state `LEA-44`. Production entry is `/leadership/services/incidents`; the assigned Facilities counterpart uses `/admin/services/incidents/:id`.

## Verified contract

- Facilities owns factual affected facility/time/impact, explicit coordinator, immutable lifecycle and restoration evidence. Principal role alone grants no Facilities action.
- An assigned coordinator acknowledges and proposes factual restoration evidence. A separately granted actor verifies the exact current evidence; closure follows only after verification.
- Report and transition commands use expected state/version and exact-payload idempotency. A lost report response is recovered with the original `ReportFacilitiesIncident` key; `UNKNOWN` remains unknown.
- Status lookup rechecks current account, branch and incident authority before disclosing a protected receipt. Cross-branch IDs, stale versions and revoked authority are denied in focused PostgreSQL evidence.
- Coordination consumes the minimized typed `FACILITIES_INCIDENT` projection and can assign only the incident's exact current coordinator. It receives no Facilities mutation authority.
- Communication remains a separate protected workflow. Reporting, restoration verification and closure create no notice, delivery, read or acknowledgement evidence; the test database acknowledgement count remains unchanged.

## Verification

- Unit: `test/unit/facilities.test.ts` — 3/3 passed.
- Real PostgreSQL: `test/functional/facilities.test.ts` — 3/3 passed against `vyapti_vschool_test`, including report-key recovery, exact replay, independent verification, typed Coordination source, stale/cross-branch denial and revoked receipt disclosure.
- `pnpm exec tsc --noEmit`, `pnpm check:db-design`, `pnpm check:boundaries`, `pnpm check:backend` and `pnpm check:docs` passed.
- Production build (`8RinEH2n8DFR_q5gLK8s1`) and isolated E2E build (`oRZ40El5xa6T942e5d_rd`) passed with the established 4 GiB Node heap. The first browser attempt exposed a stale isolated build; a current `.next-e2e` build corrected source provenance. A later focused run exposed and led to fixes for initial stage focus and report receipt lookup.
- Sequential one-worker Playwright: 2/2 Chromium at 1440×1000 and 2/2 mobile at 390×844 passed. Both runs verify committed-response recovery, assigned coordination, independent restoration verification, closure, unchanged Communication acknowledgements, stage focus and no horizontal overflow.
- Development and test databases each contain 108 forward migrations. The focused development seed passed twice and preserved existing records. Private scenario data remains ignored at `artifacts/facilities-01/private-demo.json`.

## Direct visual inspection

| State | Desktop | Mobile |
|---|---|---|
| Approved explorer | `reference-lea-44-chromium.png` | `reference-lea-44-mobile.png` |
| Principal open incident | `principal-open-chromium.png` | `principal-open-mobile.png` |
| Coordinator restoration evidence | `coordinator-restoration-chromium.png` | `coordinator-restoration-mobile.png` |
| Principal verified closure | `principal-closed-chromium.png` | `principal-closed-mobile.png` |

The approved source is a workflow explorer, not a complete production screen. Direct inspection confirmed a readable production hierarchy, factual impact card, distinct action cards, immutable timeline, responsive labelled facts, content-sized actions and no viewport overflow. The mobile full-page captures stitch the sticky workspace header at its viewport position; this is a screenshot artifact rather than content overlap during normal scrolling.

Supported scope is Facilities only. Transport, library, telemetry, real emergency operations, production service roster/publication policy, font portability, native VoiceOver/NVDA and actual browser 200% zoom remain unavailable or pending. Human visual acceptance remains PENDING.
