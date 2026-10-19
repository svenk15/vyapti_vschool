# Administrator experience revamp — shell and Students checkpoint

Captured 19 October 2026 from the production build created from working source based on `a4992e03c9084860045938668fca599e70c20984`. Build ID: `XA1lhsCC01kFAWxYMOBsz`.

## Directly inspected

- Application Today, expanded/collapsed navigation, populated Students directory, Student record and registration entry at 1440×1000, 900×1000, 390×844 and 360×800 CSS pixels.
- Connected Students, record and registration reference at 1440×1000 and 390×844.
- `metrics.json` records CSS viewport, device pixel ratio, computed font stack, sidebar/row dimensions and root-overflow result. These captures use CSS viewport emulation at DPR 1; they are not evidence of browser zoom.
- Images were inspected for hierarchy, spacing, action prominence, wrapping, table/card density and mobile drawer reachability. No root horizontal overflow was found.

## Verification

- Focused ESLint: passed.
- `pnpm exec tsc --noEmit --pretty false`: passed after duplicate stale compiler processes were stopped and one check was run.
- `pnpm exec vitest run --config vitest.config.ts test/unit/workspace-navigation.test.ts`: 3/3 passed.
- `pnpm check:docs`: passed, 30 tasks.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build`: passed; 119 migrations were unchanged.
- `pnpm test:e2e test/e2e/admin-experience-navigation.spec.ts --project=chromium --workers=1`: 2/2 passed against `vyapti_vschool_test` after rebuilding `.next-e2e`.
- Same command with `--project=mobile`: 2/2 passed using the current isolated build.

The first browser attempt exposed an obsolete `.next-e2e` build and two locator defects in the new test. The isolated build and locators were corrected before the passing runs; no product assertion was weakened.

## Scope and remaining work

This checkpoint verifies the shared Administrator shell, navigation behavior, Staff local navigation wiring, connected reference mechanics, and the main Students compositions. Existing Students domain behavior and prior owner evidence remain unchanged. Direct inspection of later registration stages used the write-free connected reference; existing current owner tests remain the functional evidence for production mutation, replay and stale handling.

Human visual acceptance, native accessibility, TEN-03 and production release remain pending.
