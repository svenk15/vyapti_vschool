# Staff access secondary-action checkpoint

Date: 24 October 2026 (Asia/Kolkata)

Baseline HEAD: `eeb6c27aac27e5d2d1d8f00933a873b0bb35ecde`

Verified production build ID: `hmZLmCgqluWhqzfX4L_zu`

## Decision and supported scope

The user approved removing **Access** as a peer Staff tab and retaining its distinct account-level functions as a secondary action. **Profiles** is now the sole Staff local destination. An authorized administrator reaches `/admin/users` through **Access administration** beside **Add staff**, and returns through **Back to Profiles**.

The account-level route remains necessary for independent invitations, accounts that are not linked to an Employee, invitation-delivery exceptions, and account-versus-branch-access state. Employee-linked access setup, roles and lifecycle actions remain embedded in the Staff Profile. The existing `/admin/users`, `/admin/users/grant`, and `/admin/users/change` routes and their Access-owner authorization are unchanged. An administrator who has `user.manage` without `class.manage` can still reach the Access destination through the server-filtered main Staff navigation.

No owner command, API, permission, schema, migration or fixture changed in this slice.

## Verification

- Focused ESLint passed for the two navigation components and the affected browser specification.
- `pnpm typecheck` passed.
- `git diff --check` passed.
- Focused Access-management Chromium journey passed 1/1 with one worker.
- The same focused Mobile journey passed 1/1 with one worker.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` passed and produced build `hmZLmCgqluWhqzfX4L_zu`.
- Desktop 1440×1000 and mobile 390×844 captures were inspected. Profiles has no Access tab, its two actions remain distinct, Access administration retains its exceptional account rows, and both layouts have an explicit return path.

## Current-build captures

- [Profiles desktop](profiles-desktop.png)
- [Profiles mobile](profiles-mobile.png)
- [Access administration desktop](access-administration-desktop.png)
- [Access administration mobile](access-administration-mobile.png)

Human visual acceptance, native accessibility, TEN-03 and production release gates remain pending.
