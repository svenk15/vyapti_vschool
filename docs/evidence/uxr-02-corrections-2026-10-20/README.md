# UXR-02 bounded registration correction — 20 October 2026

## Provenance and status

- Baseline documentation HEAD: `23d0b5f5f9a96e5da31f0df34ec029c1a484c5fe`.
- Expected application baseline: `d5c50c437d93d17f3a0bf6dfc1001e027891bc33`.
- Verified implementation commit: `73f0e5b6e1e7ce4187116c2aeb80ace0d5efe371`.
- Production build ID: `flG3xp-fzkE0BlK_tM_xm` (`NODE_OPTIONS=--max-old-space-size=4096 pnpm build`).
- The focused screenshots were captured from the exact implementation working tree that became `73f0e5b`; the isolated E2E build used one worker and the dedicated `vyapti_vschool_test` PostgreSQL database with 119 applied migrations and none pending.
- Engineering verification: complete for this bounded slice. Visual inspection: complete for the listed registration states. Human acceptance: PENDING. Production readiness: blocked by the existing TEN-03 and release gates.
- Schema/migrations/seeds/navigation: unchanged.

## Corrected contracts and behavior

1. Existing identities use `{kind:"EXISTING", personId}` and are resolved by the People owner. New identities retain separately validated first/last fields. The server-returned identity is rendered on success.
2. The legacy application input remains an explicit adapter. Its schema-v1 receipt hash retains the original field names and order; current discriminated commands use schema v2.
3. Inline errors use `aria-invalid` and associated descriptions. A focused summary links to invalid fields, retains safe values and clears each field error as it is corrected.
4. Admission-date guidance uses the authenticated branch timezone and date. The server repeats that boundary check.
5. A lost response retains the exact payload and key only in live component memory for same-page replay. Reload retains only the opaque key in the URL and checks the actor/institution/branch/command-scoped receipt. It never auto-replays and UNKNOWN is not treated as failure.
6. Cancel/sidebar/Back navigation warns while an outcome is unresolved, then allows the user to leave. Native `beforeunload` is best effort. No Student details, credentials or tokens are placed in local/session storage.
7. Receipt actions come from current server projections. Open record, enrollment and Parent access destinations each reauthorize independently.
8. Registration spacing now has one owner: 6px label/control, 4px control/hint, 16px field-stack/section gaps, 20px columns, 24px section/action separation, and 24px desktop/16px narrow card padding. Lookup input/action align on desktop. Long receipt identities wrap within their cell.
9. Shared fields/buttons use intrinsic minimum height: 40px desktop and at least 44px narrow. The enlarged-text probe grows to 60px/58px without clipping or root overflow.

## Visual evidence inspected

The pre-correction captures remain in the [baseline directory](../uxr-00-02-2026-10-20/):

- [Before desktop new-record form](../uxr-00-02-2026-10-20/before-student-registration-desktop.png)
- [Before mobile new-record form](../uxr-00-02-2026-10-20/before-student-registration-mobile.png)
- [Earlier existing-record desktop](../uxr-00-02-2026-10-20/student-registration-existing-desktop.png)
- [Earlier existing-record mobile](../uxr-00-02-2026-10-20/student-registration-existing-mobile.png)

Current corrected states, directly inspected:

| State | Desktop | Mobile |
|---|---|---|
| New record with linked inline future-date error | [image](inline-errors-chromium.png) | [image](inline-errors-mobile.png) |
| Authoritative existing identity resolved and confirmed | [image](existing-resolved-chromium.png) | [image](existing-resolved-mobile.png) |
| Broad authorized saved receipt and long-name containment | [image](broad-receipt-chromium.png) | [image](broad-receipt-mobile.png) |
| Lost response before reload/status recovery | [image](pending-chromium.png) | [image](pending-mobile.png) |
| Genuinely unknown status after reload | [image](unresolved-chromium.png) | [image](unresolved-mobile.png) |
| Saved receipt with limited post-registration authority | [image](limited-receipt-chromium.png) | [image](limited-receipt-mobile.png) |

[Measured registration geometry](registration-measurements.json) covers 1440×1000, 900×900, 390×844 and 360×800, plus the enlarged-text/text-spacing probe. The probe is not native browser zoom. The unchanged normal-size shared-control baseline for actual Administrator, Teacher, Principal, Parent and Student routes remains in [workspace-control-metrics.json](../uxr-00-02-2026-10-20/workspace-control-metrics.json); the current slice changed fixed heights to equal minimum heights and verified growth through the production shared controls and all four theme tokens. This is not claimed as a new five-workspace visual review.

## Verification

| Check | Result |
|---|---|
| `pnpm test:unit test/unit/students.test.ts` | 7/7 passed |
| `pnpm test:functional test/functional/students-registration.test.ts` | 15/15 passed against real PostgreSQL; includes legacy replay, current exact replay, long existing identity, scoped status recovery and revoked-authority denial |
| Current isolated E2E bundle, focused Chromium cases | 6/6 passed with one worker |
| Current isolated E2E bundle, focused mobile cases | 4/4 passed with one worker |
| Targeted ESLint | passed |
| `pnpm exec tsc --noEmit` | passed |
| `pnpm check:backend` | passed |
| `pnpm check:boundaries` | passed |
| `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` | passed; build ID `flG3xp-fzkE0BlK_tM_xm` |
| `pnpm check:docs` | failed only on two pre-existing/unrelated dirty presentation-revamp links listed below |

Documentation failures:

- `docs/execution/WORKSPACE_PRESENTATION_REVAMP/CURRENT_STATE.md` → missing `../../evidence/workspace-presentation-route-pass-2026-10-20/README.md`
- `docs/execution/WORKSPACE_PRESENTATION_REVAMP/PAGE_COVERAGE.md` → the same missing target

## Remaining bounded evidence

- Actual browser 200% zoom was unavailable in the automated runtime and remains pending.
- Native VoiceOver/NVDA checks remain pending.
- The registration screens were inspected in the current active application theme. Four-theme geometry was exercised using the same production shared controls; this checkpoint does not claim a full visual inspection of every registration state in every theme.
- Human review remains PENDING.

## Demo

- URL: `http://127.0.0.1:3400/admin/students/register`
- Private fictional credentials: `artifacts/people-02/private-demo.json` (ignored; values are not recorded here).
- The health endpoint returned `{"service":"vschool","release":"fresh-0.3.0","alive":true}` for the production build above.
