# UX revamp navigation corrections — 19 October 2026

## Scope

The exact pre-edit route mapping is recorded in [NAVIGATION_CORRECTION_MAP.md](../../execution/UX_REVAMP/NAVIGATION_CORRECTION_MAP.md). This checkpoint changes presentation grouping only. Existing route destinations, module/capability checks, accepted-context purpose filters and page/API authorization remain in force.

- Administrator: direct daily destinations, then Teaching, Staff, Communication, My work, School settings and conditional School operations.
- Teacher: static My day, Teaching, Learning, My work and Account groups.
- Student: direct My day, then Learning, School life and Personal.
- Parent: direct Home/My children, then Learning, School day, Communication and Account. Mobile shortcuts keep a stable Home → Attendance → Timetable → Messages (when authorized) → More order.
- Principal: existing operational hierarchy retained; conditional destinations are labelled School operations and utilities are labelled Account & access.

Navigation visibility remains a convenience. Every destination continues to authorize independently.

## Verification

- `pnpm exec vitest run test/unit/workspace-navigation.test.ts test/unit/principal-navigation.test.ts --config vitest.config.ts` — PASS (7 tests): route uniqueness/group mapping, conditional Teacher items and Principal-specific route selection.
- Focused ESLint over the changed navigation files and tests — PASS.
- `pnpm typecheck` — PASS after correcting the typed navigation configuration.
- Integrated browser checks and desktop/mobile screenshots are pending the role-specific landing checkpoint and final candidate build.

## State

- Migration: none.
- Functional/security behavior: unchanged; grouping logic is verified.
- Visual comparison: pending integrated captures.
- Human acceptance: PENDING.
