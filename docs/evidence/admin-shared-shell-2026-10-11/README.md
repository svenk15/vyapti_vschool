# Administrator shared-shell visual correction — 11 October 2026

Human visual acceptance is **PENDING**. This presentation-only correction does not change authorization, API contracts, persistence, migrations, or production release gates.

## Authority and scope

- Approved source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html` with its ordered embedded sidebar override.
- Implementation specification: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/COMPONENTS.md` and `TYPOGRAPHY.md`.
- Compared reference state: SA-25 `#/flow/SA-25`, captured previously as `docs/evidence/admin-attendance-lifecycle-2026-10-11/reference-sa-25-desktop.png` at 1440 × 1000.
- Application routes inspected after the correction: `/admin/attendance/sessions`, `/admin/students`, and `/admin/users`; the Attendance mobile drawer was inspected at 390 × 844.

## Corrected shared causes

- Sidebar surface and text now use the approved `#173B32`, `#D8E5DC`, and `#C2D2C9` values rather than deriving a visibly different surface from the active school palette.
- Brand typography is 24px/600 with a 33 × 33px outlined mark, 12px gap, and the approved header spacing.
- Inactive navigation is 13px/400; only the active destination uses weight 600. The selected indicator is the approved pale green rather than the school accent token.
- Today, Attendance, Students, Staff, Academics, Imports, Reports, School, and Activity use the exact applicable SVG paths from the approved pack at 18px with 1.7px strokes.
- Shared Administrator and teacher page headings now use the approved 28px/35px/650 desktop composition. Existing page-specific 26px mobile rules remain intact.
- School identity, avatar, footer divider, and mobile drawer inherit the same approved spacing and colors.

## Evidence and verification

- `attendance-desktop.png`, `students-desktop.png`, and `staff-desktop.png` are current authenticated application captures at 1440 × 1000.
- `attendance-mobile-navigation.png` is the open accessible drawer at 390 × 844.
- `measurements.json` records computed styles and bounds. The focused verifier asserted a 240px sidebar, exact sidebar RGB, 24px/600 brand, 33px mark, 13px/400 inactive navigation, 13px/600 active navigation, the approved Attendance check path, 28px/35px/650 heading, and no document overflow.
- `pnpm typecheck`, focused ESLint, `pnpm build`, and `node scripts/verify-admin-shell-local.mjs` passed. The final browser run used the local PostgreSQL-backed production demo at `http://127.0.0.1:3400` and did not mutate product data.

## Remaining visual deviation

The reference embeds Nimbus Sans under the name `VSchool Navigation`. The supplied typography specification does not establish redistribution rights, so production continues to use the documented system fallback. This remains visible at some letter shapes and widths and is not claimed as pixel-identical typography. Functional verification and this visual comparison do not imply owner visual acceptance.
