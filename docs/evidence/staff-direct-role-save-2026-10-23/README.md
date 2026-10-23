# Staff direct role save and shared checkbox parity — 23 October 2026

This bounded checkpoint implements the user-approved simplification of the Staff Profile **Change roles** drawer. It supersedes the earlier edit → review → save presentation while retaining the same Access owner command and recovery behavior. Human visual acceptance remains **PENDING**.

## Candidate

- Base commit: `7a70741ffd6b0e57a2e499d1838f61f330c526b0`
- Clean production build ID: `kdWrEI9bH4dskYZyjX2V9`
- Demo: `http://127.0.0.1:3400`
- Production route: `/admin/teachers/{employeeId}` → **View access** → **Change roles**
- Viewports: 1440×1000 and 390×844 CSS pixels

## Result

- Change roles now contains role selection, required reason, Back and **Save changes** in one drawer state.
- The intermediate **Review changes** screen and CTA were removed.
- Save still invokes one `UpdateMembership` PATCH with `SET_ROLES`, the selected roles, required reason and current expected version. Existing command-key generation, unknown-result recovery, stale handling, live authorization and server validation are unchanged.
- Staff role checkboxes now share the compact Student onboarding recipe rather than inheriting the larger global control treatment.

## Measured consistency

`verification.json` records the computed production values for the Student onboarding invitation checkbox and the Staff role checkbox.

| Viewport | Student | Staff | Result |
|---|---|---|---|
| 1440×1000 | 16×16; 12px label; 20px row; 9px gap | 16×16; 12px label; 20px row; 9px gap | Match |
| 390×844 | 16×16; 13px label; 20px row; 9px gap | 16×16; 13px label; 20px row; 9px gap | Match |

Both viewports retained visible keyboard focus and had no root horizontal overflow. `change-roles-desktop.png` and `change-roles-mobile.png` are current clean-build captures.

## Focused verification

- Changed-file ESLint: passed.
- TypeScript `tsc --noEmit`: passed.
- Clean 4 GiB production build: passed.
- Focused Playwright direct-save check: passed at desktop and mobile. No **Review changes** button was present; **Save changes** was visible.
- The desktop interaction changed one role, supplied a reason and clicked Save once. The intercepted non-persisting request contained one `SET_ROLES` payload and expected version; no demo record was mutated.
- Local health endpoint returned `ready:true` for build `kdWrEI9bH4dskYZyjX2V9`.

Existing Access owner tests remain the functional/security evidence for committed saves, exact-key recovery, stale versions and revoked authority. This presentation checkpoint does not weaken or replace those contracts.
