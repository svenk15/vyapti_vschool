# UX revamp shared corrections — 19 October 2026

## Scope

This checkpoint corrects the shared landing calendar, attention summary and session presentation used by the five workspace landing pages. It also restores the Administrator landing-page summary-to-content spacing. No business command, database schema or authorization contract changed.

The calendar now records its loaded date range and whether that range is complete. Navigation remains bounded to that range unless a future owner reader supplies another authorized range. Dates outside a complete range are described as not loaded rather than as having no events. Timed events use the branch timezone; all-day events retain date-only semantics. Cancellation and school closure are separate display states.

## Verification

- `pnpm exec vitest run test/unit/landing-calendar-model.test.ts --config vitest.config.ts` — PASS (3 tests): branch-timezone date boundaries, timed multi-day ranges, date-only all-day ranges, week bounds and range completeness.
- `pnpm exec eslint components/landing-calendar-model.ts components/landing-page.tsx components/landing-reference-gallery.tsx components/teacher-sessions.tsx app/admin/page.tsx app/student/page.tsx app/family/page.tsx app/leadership/page.tsx test/unit/landing-calendar-model.test.ts` — PASS.
- `pnpm typecheck` — PASS.
- `git diff --check` — required before commit.

## State

- Migration: none.
- Functional verification: focused shared-component/model checks pass.
- Visual comparison: pending the integrated navigation and role-specific landing candidate.
- Human acceptance: PENDING.
- Production gates: unchanged, including TEN-03 and native accessibility evidence.
