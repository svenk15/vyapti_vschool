# Staff Manage consolidation checkpoint

Date: 24 October 2026 (Asia/Kolkata)

Baseline HEAD: `58e1bbd32112be9107ad3393989ef5b1c0cd6cb9`

Verified production build ID: `pJxbc1Eq1Kq4JeDHlUHkr`

## User decision and resulting composition

The user rejected a separate **Access administration** secondary action because it duplicated the Staff directory and Profile. The normal Staff experience now has one primary directory and one row-level **Manage** entry. Its **Portal access** action opens the selected Staff Profile, where the existing Access-owned setup, invitation, role, suspension, reinstatement and revocation controls remain available.

The previous same-day secondary-action checkpoint is superseded only for this presentation choice. `/admin/users`, `/admin/users/grant` and `/admin/users/change` remain guarded routes for account-level exceptions and administrators whose live authority includes `user.manage` without People-directory authority. They are no longer advertised as a duplicate destination from Profiles. No Access or People owner command, authorization check, API, schema, migration or fixture changed.

## Verification

- Focused Access-management Chromium journey passed 1/1 and proves Profiles has neither an Access tab nor an Access-administration action while the guarded account route remains functional.
- Focused People/Staff Chromium and Mobile journeys passed 1/1 each. They exercise **Manage → Portal access → Staff access → Change roles**, plus existing identity binding, teaching eligibility and employment protections.
- Focused ESLint, TypeScript and `git diff --check` passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` passed and produced build `pJxbc1Eq1Kq4JeDHlUHkr`.
- The rebuilt demo health endpoint reported ready at `http://127.0.0.1:3400`.
- The following 1440×1000 and 390×844 captures were directly inspected. The directory has only **Add staff**, Manage presents **Portal access**, and the selected Profile drawer exposes the authoritative access actions without root overflow.

## Current-build captures

- [Profiles desktop](profiles-desktop.png)
- [Manage desktop](manage-desktop.png)
- [Embedded Profile access desktop](profile-access-desktop.png)
- [Profiles mobile](profiles-mobile.png)
- [Manage mobile](manage-mobile.png)
- [Embedded Profile access mobile](profile-access-mobile.png)

Human visual acceptance, native accessibility, TEN-03 and production release gates remain pending.
