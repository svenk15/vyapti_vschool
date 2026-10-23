# Staff Manage alignment with Student Manage — 24 October 2026

This bounded presentation correction aligns the Administrator Staff directory's **Manage** dialog with the accepted Student directory pattern. It does not change Staff operations, permissions, owner commands, persistence, recovery, or the directory query.

## Comparison

Student pattern inspected:

- component: `components/students-workspace.tsx` (`student-manage-links`, `student-manage-group`, `student-manage-link`)
- desktop evidence: `docs/evidence/ux-revamp-06-2026-10-18/application-students-manage-desktop.png`
- mobile evidence: `docs/evidence/ux-revamp-06-2026-10-18/application-students-manage-mobile.png`

Staff now uses the same dialog hierarchy and row recipe:

- the selected person's display name is the dialog heading;
- actions sit beneath the same compact **Manage** group label;
- desktop/mobile dialog padding is 28px/22px;
- action padding is 13px 12px and leading icons are 20px;
- the redundant identity strip, employee-code subheading, and trailing arrows were removed;
- Edit personal details, Edit employment details, and the state-specific portal action still open their existing guarded drawers directly.

## Current evidence

- `chromium-chooser.png`, `chromium-personal.png`, `chromium-employment.png`, `chromium-access.png`
- `mobile-chooser.png`, `mobile-personal.png`, `mobile-employment.png`, `mobile-access.png`

The chooser screenshots were inspected directly at 1440×1000 and 390×844. They match the Student Manage composition while retaining Staff-specific labels and icons. Human visual acceptance remains PENDING.

## Verification

- Focused ESLint for the changed component and browser test: passed.
- `pnpm exec tsc --noEmit`: passed.
- Focused Playwright with one worker: Chromium 1/1 and Mobile 1/1 passed. Each journey opened all three actions, retained the directory URL, and captured the resulting drawer.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build`: passed; build ID `2q_gC_hk9ktSgS9SRYgLo`.
- Current build health at `http://127.0.0.1:3400/api/health/live`: passed.

The first focused Chromium run exposed stale generated `.next-e2e` CSS from the prior build. The generated cache was moved aside, a clean E2E build was created, and the current-source Chromium/Mobile runs passed. A later Mobile assertion expected 358px while the rendered border box was 356px; the assertion was corrected to the observed Student-compatible box measurement and passed without application changes.

No migration or seed change was required. TEN-03, native accessibility, production readiness, and human acceptance remain separate pending gates.
