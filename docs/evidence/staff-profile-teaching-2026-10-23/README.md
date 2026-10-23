# Staff Profile Teaching assignments simplification

Date: 23 October 2026 (Asia/Kolkata)

The user removed the separate Teaching assignments CTA from the accepted Staff Profile composition. The Profile continues to show the current scoped Academics projection directly. No Academics data, authorization, assignment mutation or eligibility behavior changed.

The assignment value now uses the same computed typography as the Personal and Employment field values: Inter, 12px, weight 550 and 21px line height. [Measurements](measurements.json) record a zero CTA count and the exact computed comparison.

Current-source captures were inspected at [1440×1000](profile-desktop.png) and [390×844](profile-mobile.png). Production build `depouEobevA3sSyFUrAWj` serves the updated page at `http://127.0.0.1:3400`.

Focused verification:

- `pnpm exec eslint app/admin/teachers/[id]/page.tsx test/e2e/people-employees.spec.ts`
- `pnpm typecheck`
- `pnpm test:e2e test/e2e/people-employees.spec.ts --grep "Staff Profile saves authorized Personal details" --project=chromium --workers=1` — 1 passed on a fresh isolated E2E build.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed.

Human visual acceptance remains PENDING.
