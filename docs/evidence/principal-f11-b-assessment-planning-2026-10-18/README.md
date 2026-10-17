# F11-B assessment planning evidence

Status: **ENGINEERING VERIFIED / HUMAN REVIEW PENDING**.

## Outcome

An explicitly designated School Administrator can define an exact scoring scale, save a versioned assessment cycle/subject plan, recover a committed response loss with the original command key, reload the persisted draft and freeze the Students-owned dated cohort. Principal readiness remains read-only and separately authorized.

The workflow explorer contains LEA-20 readiness rather than an exact Administrator planning production screen. `/admin/assessments` therefore applies the approved production form/table recipes recorded in `SCREEN_MAP.md`; it does not claim pixel identity to a fictional explorer dialog. The existing LEA-20 reference/application comparison remains in `docs/evidence/principal-lea-20-assessments-2026-10-18/`.

## Verification

- Focused Assessments unit reconciliation: 4/4 passed.
- Real PostgreSQL planning/security/concurrency: 3/3 passed against `vyapti_vschool_test`.
- Database design: 167 registered contracts passed.
- Prisma generation, TypeScript and focused ESLint passed.
- Isolated E2E build passed with `NODE_OPTIONS=--max-old-space-size=4096`; build ID `rgwLvxYAKxxef2acPH7FA`. The normal demo build from commit `6aa7a4b` also passed with build ID `7HIqyszW3O4hChyKbhbQT` and is reachable at `http://127.0.0.1:3402`.
- One-worker Chromium: 3/3 passed.
- One-worker mobile (390px project): 3/3 passed after correcting the cohort-table overflow.
- Focused `scripts/demo-assessments.ts` seed passed twice and retained one deterministic planning fixture. Aggregate `pnpm demo:seed` stopped earlier in its unchanged LDR-01 authentication step and is not recorded as passed.

Both designated databases contain 100 migrations through `20261019000000_assessments_cycle_planning`. No database was reset and no applied migration was changed.

## Visual inspection

- [Desktop application](application-chromium.png): two-column scale/plan composition, feedback, persisted cycles and actions inspected at 1440×1000.
- [Mobile application](application-mobile.png): stacked forms, bounded record cards, readable labels/actions and no viewport overflow inspected at 390px.

Keyboard evidence covers the cohort action and mobile navigation focus return. Native VoiceOver/NVDA, actual browser 200% zoom, font portability and human visual acceptance remain pending.

## Remaining F11 work

F11-C must add assigned-Teacher mark revisions. LEA-20 also still needs authorized Principal cycle selection and a typed Assessments-to-Coordination source handoff. F11-D moderation and F11-E publication remain separate slices. TEN-03 and production enablement remain gates.
