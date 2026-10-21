# Administrator → Students final closure evidence

This directory is the current acceptance-evidence set for the two bounded closure items. Historical Student screenshots elsewhere in `docs/evidence` remain historical and are not used as current acceptance evidence here.

## Provenance

- Application source: `64aad1adc314bd5a894e6e296a53e96da5b1ddcd`
- Guardian saved-result implementation checkpoint: `b7dff6e33440c31329a94e319366241a01ab6ea1`
- Production build ID: `zbOHqJcsZybbjDe2yr_FR`
- E2E build ID: `p4NQjn45q6AealKXWjQMj`
- Demo: `http://127.0.0.1:3400`
- Captured with Playwright Chromium at CSS viewports `1440×1000` and `390×844`; browser zoom was not changed by the harness and device scale emulation was not used.
- Data is generated fictional test data in the guarded E2E database.

## Closure results

1. **Guardian saved-result close handling — PASSED (engineering).** A confirmed committed invitation followed by a failed list refresh remains labelled as saved after Escape closes the drawer. The Profile retains a read-only **Refresh current access** action. The test asserts one POST before closure, a second GET during recovery, no further POST, and two durable Guardian access records for the two intentional operations in the scenario. The genuinely unknown first operation remains in its drawer and continues to require exact replay.
2. **Current-build visual evidence — PASSED (engineering and direct visual inspection).** The ordinary Profile is captured without the registration-success notice; registration success is captured separately. Guardian add/manage and the committed-save refresh state are current-build captures. A computed geometry assertion verifies the Profile composition centre matches the authenticated main-content centre within one CSS pixel at desktop, and the mobile capture has no root overflow.

Human visual acceptance remains **PENDING**.

## Current application evidence

| State | Desktop | Mobile |
| --- | --- | --- |
| Ordinary Profile, no registration banner | `application/profile-ordinary-desktop.png` | `application/profile-ordinary-mobile.png` |
| Registration success | `application/registration-success-desktop.png` | `application/registration-success-mobile.png` |
| Add guardian | `application/guardian-add-desktop.png` | `application/guardian-add-mobile.png` |
| Manage guardian | `application/guardian-manage-desktop.png` | `application/guardian-manage-mobile.png` |
| Confirmed saved result with refresh recovery | `application/guardian-saved-refresh-desktop.png` | `application/guardian-saved-refresh-mobile.png` |

## Approved reference evidence

The exact approved source is `docs/ux/references/student-onboarding-approved/refined-onboarding.html`.

| State | Desktop | Mobile |
| --- | --- | --- |
| Profile | `reference/profile-desktop.png` | `reference/profile-mobile.png` |
| Guardian access | `reference/guardian-desktop.png` | `reference/guardian-mobile.png` |

Registration success and the committed-save/read-refresh recovery are production states without exact prototype frames. They use the approved shared feedback and Profile composition and are labelled as application extensions rather than exact reference matches.

## Verification

Passed against the final E2E build and 119 applied test migrations:

```text
env VSCHOOL_E2E_BUILT=1 node scripts/database.mjs e2e \
  test/e2e/students-registration.spec.ts --workers=1 \
  --grep 'completes connected Student onboarding|keeps an unknown guardian invitation'

4 passed (desktop and mobile)
```

Also passed: focused ESLint for the affected page, Guardian component, arrival notice and E2E spec; `git diff --check`; final production build with `NODE_OPTIONS=--max-old-space-size=4096`.

