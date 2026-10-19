# Administrator navigation spacing correction

Status: **ENGINEERING VERIFIED / VISUAL COMPARISON COMPLETE / HUMAN REVIEW PENDING**

## Scope and authority

- Application route: `/admin`
- Baseline source: `15470e44046a3a53479ac875e59a17d45f7c61a8`
- Baseline build: `FnDUkbvFIP6IQWBb04_Ju`
- Corrected build: `iylIRaTKp1v_T3arvMibu`
- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html`, Administrator Today / SA-01 navigation state
- Component contract: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/COMPONENTS.md`

This checkpoint changes Administrator presentation only. Navigation destinations, visibility rules, route authorization, account controls and owner behavior are unchanged.

## Finding and correction

The shared shell's 24px navigation gap was being applied between every collapsed Administrator disclosure. On desktop, `School administration` and `Additional services` also wrapped and made their rows 64px high. The result was a loose, uneven list that did not follow the approved compact navigation rhythm.

The Administrator frame now supplies a scoped shell class. Within that scope:

- the direct `Today` item retains a 24px separation from grouped navigation;
- collapsed sibling groups use a 4px gap;
- an expanded group uses 12px before the following group;
- disclosure and destination rows retain a 44px minimum target, 10px × 12px padding, 11px icon gap, 13px labels and 7px radius;
- long disclosure labels remain one 44px row with visual ellipsis while their complete accessible name remains in the DOM.

The shared shell supports the scoped class without changing any other workspace.

## Measured and visual evidence

All measurements use CSS pixels at device pixel ratio 1.

| State | Before | Corrected |
|---|---:|---:|
| Collapsed sibling group gap | 24px | 4px |
| Today-to-first-group separation | 24px | 24px |
| Expanded-group separation | 24px | 12px |
| Standard disclosure height | 44px | 44px |
| Long desktop disclosure height | 64px | 44px |
| Expanded child height | 44px | 44px |

- [Before desktop, collapsed](before-desktop-collapsed.png)
- [Before desktop, expanded](before-desktop-expanded.png)
- [Corrected desktop, collapsed](after-desktop-collapsed.png)
- [Corrected desktop, expanded](after-desktop-expanded.png)
- [Before mobile, collapsed](before-mobile-collapsed.png)
- [Before mobile, expanded](before-mobile-expanded.png)
- [Corrected mobile, collapsed](after-mobile-collapsed.png)
- [Corrected mobile, expanded](after-mobile-expanded.png)
- [Before measurements](before-metrics.json)
- [Corrected measurements](after-metrics.json)

Direct image inspection confirmed consistent icon/label alignment, selected-row treatment and group rhythm. The corrected desktop and mobile pages have no root horizontal overflow. At 390×844 the final authorized group is fully visible above the fixed account footer; the navigation scroll area reports 553px client and content height for the collapsed fixture.

The JSON timestamps are UTC (`2026-10-19T21:18Z` and `2026-10-19T21:22Z`), corresponding to 20 October 2026 in Asia/Kolkata.

## Verification

- `pnpm exec eslint components/portal/portal-shell.tsx components/admin-portal-frame.tsx` — passed.
- `pnpm exec tsc --noEmit` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; build `iylIRaTKp1v_T3arvMibu`.
- Focused desktop Playwright: `node scripts/database.mjs e2e test/e2e/admin-experience-navigation.spec.ts --project=chromium --grep "Administrator task navigation"` with the established 4 GiB heap — 1/1 passed against `vyapti_vschool_test`, 119 migrations.
- Focused mobile Playwright: the same command with `--project=mobile` — 1/1 passed.
- Focused live-demo geometry/capture at 1440×1000 and 390×844 — passed.
- `GET http://127.0.0.1:3400/api/health` — ready after the corrected build was started.

One first focused E2E attempt failed before running because the web server exhausted the default 2 GiB heap. A subsequent incorrectly separated wrapper command began the wider suite; it was stopped after one unrelated passing case. Neither attempt is claimed as navigation evidence. The two corrected direct commands above are the applicable results.

## Remaining gates

Human visual acceptance, native VoiceOver/NVDA, actual-browser 200% zoom, TEN-03 and production release remain pending.
