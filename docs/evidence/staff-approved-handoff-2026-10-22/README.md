# Approved Administrator Staff implementation — 22 October 2026

## Provenance

- Application source: `ba43e6089ec8f44048013075a41749b27b04d745`.
- Production build ID: `RE-cPsN_n2Nv1qhGEL37U`.
- Demo: `http://127.0.0.1:3400`; `/api/health` returned `ready:true` after the clean build started.
- Private synthetic credential file: `artifacts/people-02/private-demo.json` (path only; excluded from evidence and package).
- Frozen design authority: Site commit `fc33c8b991134ade6d02e27fbe467ef67d86b085`, copied without modification to `docs/execution/STAFF_REVIEW/references/approved-20261022/`.
- Manifest verification: all 17 declared files matched SHA-256; no declared file was missing or changed.
- No schema, migration, seed, domain rule, permission or owner command changed in this presentation slice.

The production build was generated from the exact application files committed at the application source above. The commit also records the verified reference and a narrow TypeScript exclusion for two review-only partial source snapshots; neither changes runtime output.

## Implementation result

| Journey | Functional/security verification | Visual fidelity | Remaining boundary |
| --- | --- | --- | --- |
| Profiles directory | Current Chromium and mobile journeys exercise People-owned search, filters, sort, URL history and protected reads | Directly compared at 1440×1000, 900×1000, 390×844 and 360×800 | Fixture count differs; People exposes no authorized total, so the footer reports a truthful loaded range |
| Directory pagination | Owner query applies predicates/order before signed-cursor pagination; 25/50/100 are passed to the owner | Quiet footer and controls follow the frozen composition | Production demo currently has one page; the frozen mock's 36 records were not copied into production |
| Name/Profile and Manage | Name opens the exact guarded Profile; Manage retains existing guarded owner actions; return query survives navigation | Direct desktop/mobile Profile and Manage comparison completed | Personal/Employment Edit controls are absent because PD-STF-02 is unapproved |
| Add staff | Existing People create/idempotency/status flow retained; lost-response case uses one key and one committed Employee; failed Profile GET retries GET only | Direct desktop/mobile comparison completed; form is 760 CSS px inside a 900 CSS px page at desktop | Production retains structured first/last fields required by the People command instead of parsing the mock's Full name field |
| Dated teaching eligibility | Academics remains owner; impact rejection, exact replay and persisted result are covered by the current focused journey and unchanged PostgreSQL evidence | Current 1440/900/390/360 and theme captures inspected | Reference has no exact failure-state screen; this is a bounded existing-product extension |
| Staff access directory | Access remains owner; live `user.manage`, membership, trust-mode and target checks remain server enforced | Direct desktop/mobile Access comparison completed | Access list provides a 50-row cursor without total/previous/page-size; ordinary invitation status is shown as `—` unless the owner supplies a known state |
| Invitation review/recovery | Current focused journey covers delivery failure, required resend reason, exact-key unknown recovery, and committed-save/failed-refresh GET-only recovery | Current desktop/mobile and four-theme invitation captures inspected | This detailed recovery state is a bounded design extension because the frozen reference does not contain an exact equivalent |
| Restricted authority | Existing focused browser and owner evidence denies protected Staff operations after authority loss | Denial remains an application state, not a simulated mock result | Human and native assistive-technology review remain pending |

## Direct comparison evidence

Reference and application captures in this directory use identical CSS viewport sizes and 100% browser zoom:

- `reference-directory-desktop.png` / `application-directory-desktop.png`
- `reference-profile-desktop.png` / `application-profile-desktop.png`
- `reference-add-desktop.png` / `application-add-desktop.png`
- `reference-manage-desktop.png` / `application-manage-desktop.png`
- `reference-access-desktop.png` / `application-access-desktop.png`
- matching `*-mobile.png` pairs at 390×844
- application-only 900×1000, 360×800 and four-theme directory captures

`measurements.json` records rendered font, heading, toolbar, first-row bounds and root overflow. The clean-build Add staff measurement is 900 CSS px for the page and 760 CSS px for the form. Inter loaded through the approved application font pipeline. Font rasterization and real data lengths remain environment/content differences.

## Verification

- `pnpm exec eslint <changed Staff files>`: passed.
- `pnpm exec tsc --noEmit --pretty false`: passed after excluding only the two review-only partial source snapshots from compilation.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm test:e2e test/e2e/people-employees.spec.ts --project=chromium --workers=1`: four passed; one failed only because the test's `Back to staff` locator matched two valid links. The locator was narrowed without changing product code.
- The corrected single Chromium case passed 1/1.
- `VSCHOOL_E2E_BUILT=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm test:e2e test/e2e/people-employees.spec.ts --project=mobile --workers=1`: passed 5/5.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build`: passed; build ID `RE-cPsN_n2Nv1qhGEL37U`.

One earlier command mistakenly passed a literal `--` to the browser wrapper and began the broad suite. It was stopped after one unrelated case; no broad-suite result is claimed. The first 2 GiB build attempt exhausted memory; the established 4 GiB configuration passed. A first production capture revealed stale generated CSS, so the disposable `.next` output was isolated and rebuilt; all evidence in this directory comes from the clean build.

## Explicitly incomplete

- STF-01B Teaching/Access directory filters and sorts require versioned full-result Academics and Access projections.
- PD-STF-01 existing-Person attestation/evidence rules remain unapproved.
- PD-STF-02 mutable Personal/Employment fields, correction grants, reasons and immutable histories remain unapproved.
- PD-STF-03 employment-end Access disposition and partial-recovery semantics remain unapproved.
- Rejoining remains deferred.
- Human acceptance, TEN-03, native accessibility and production release gates remain pending.

## Short walkthrough

1. Sign in using the Administrator persona in the private credential file and open `/admin/teachers`.
2. Search by Name or Employee code; apply a People-owned Category/Employment filter and supported sort; use browser Back/Forward to confirm URL restoration.
3. Open a name to view Profile, then return to the same directory query. Use Manage separately for the currently authorized contextual actions.
4. Choose Add staff, create a fictional profile and open the authoritative Profile receipt result.
5. From Profile, review dated teaching eligibility and the existing assignment-impact guard.
6. Open View access for employee-specific invitation state/recovery, or choose the Access local tab for the branch access directory and reasoned resend.

Human acceptance is PENDING.
