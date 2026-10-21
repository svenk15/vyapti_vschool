# Administrator Student onboarding and Profile — 21 October 2026

Human visual acceptance is **PENDING**. This evidence is limited to the bounded Administrator onboarding/Profile checkpoint and does not change navigation, other workspaces or production readiness.

## Provenance

- Approved source: `docs/ux/references/student-onboarding-approved/refined-onboarding.html`
- Verified SHA-256: `4a0c5a72b7e5512bfb9b30647b5fb10f82c9c42b04e746fe6f0cae4799792bbe`
- Reference states: `#add`, `#profile`, `#guardian`
- Application routes: `/admin/students/register` and `/admin/students/:id`
- Production build ID: `zqojKBm521UKFb4kmitjr`
- Isolated E2E build ID: `vMgTxM8y_Hoxsil07IOpx`
- Browser: Playwright Chromium; CSS viewports `1440×1000`, `900×1000`, `390×844` and `360×800`; browser zoom was not changed.
- Guarded test database: 119 forward migrations, none pending. This slice adds no schema or migration.

## Direct comparison

| State | Reference | Application |
|---|---|---|
| Add Student desktop | [reference](reference/add-desktop.png) | [application](application/add-desktop.png) |
| Add Student mobile | [reference](reference/add-mobile.png) | [application](application/add-mobile.png) |
| Student Profile desktop | [reference](reference/profile-desktop.png) | [application](application/profile-desktop.png) |
| Student Profile mobile | [reference](reference/profile-mobile.png) | [application](application/profile-mobile.png) |
| Add Guardian desktop | [reference](reference/guardian-desktop.png) | [application](application/guardian-desktop.png) |
| Add Guardian mobile | [reference](reference/guardian-mobile.png) | [application](application/guardian-mobile.png) |

Additional application evidence covers [900px](application/profile-900.png), [360px](application/profile-360.png) and Profile captures for Forest, Amethyst, Porcelain and Linen at desktop and mobile sizes (`application/profile-{theme}-{project}.png`). The images were directly inspected for hierarchy, spacing, action placement, wrapping, drawer geometry and root overflow.

## Verified behavior

- Fully confirmed onboarding navigates directly to the authorized Profile, preserves `returnTo`, shows concise success feedback and focuses it.
- A deliberately lost committed onboarding response remains unknown until the exact unchanged command is retried; one Student, Enrollment, Placement and Guardian access persist.
- Partial and post-reload status recovery retain their existing truthful receipt limits.
- Profile actions reflect no enrollment, current placement and current server-derived authority. Placement/history/identity commands remain on their guarded owner routes.
- Current Student portal access is selected by owner authorization time rather than input array order, and every existing status has a distinct label/action state.
- The Add Guardian drawer preserves one selected-Student context, focuses `Full name`, uses the real fixed owner-purpose bundle and retains dirty-close/focus-return/removal-confirmation behavior.

Focused checks on the final application source:

- `pnpm exec vitest run test/unit/student-portal-summary.test.ts` — 2/2 passed.
- `pnpm exec tsc --noEmit` — passed.
- Targeted ESLint and `git diff --check` — passed.
- `pnpm check:backend` and `pnpm check:boundaries` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; production build ID above.
- One-worker connected Playwright — 1/1 desktop and 1/1 mobile passed against real PostgreSQL.
- Focused lost-response/reload/unknown/limited-authority Playwright — 4/4 passed.

One longer aggregate identity/search browser case exposed two stale presentation assertions and was corrected, but its final rerun stalled in a later unchanged interaction and was interrupted. It is not reported as passed here. Existing owner-level exact-identity, scope and duplicate evidence remains applicable; the current connected checkpoint independently verifies the changed handoff and Profile composition.

## Necessary deviations and pending gates

- The prototype review toolbar, simulated backend behavior, fictional shell values and reference-only navigation are excluded.
- The Guardians owner has no relationship field or contact-only aggregate, so those prototype controls are omitted rather than fabricated.
- Core Guardian purposes remain read-only owner policy; only existing optional-purpose commands are actionable.
- The application preserves real school context, production navigation and server-authorized action visibility.
- Actual native browser 200% zoom, VoiceOver, NVDA, human acceptance, TEN-03 and production message-provider review remain pending.
