# Staff Person correction evidence — 23 October 2026

This checkpoint implements the approved PD-STF-02 Person name/contact slice. It does not claim Employee-code or employment-start correction, human acceptance, TEN-03, native accessibility or production readiness.

## Candidate and behavior

- Application source: current focused checkpoint (commit recorded after verification).
- Production build: `cvfj0kxQBpcy6tsYiG02l`.
- Demo: `http://127.0.0.1:3400`, rebuilt and restarted after a stale served build was detected during the first capture.
- Migration: `20261023150000_staff_person_corrections`, applied to development and test without reset.
- Synthetic fixture: the existing ignored `artifacts/people-02/private-demo.json`; no credentials are included here.

The Profile Personal details drawer saves first name, last name and contact email with a mandatory bounded reason. The owner command requires live branch `class.manage` and an explicit organization `PERSON_CORRECT` grant, uses Person expected-version compare-and-swap, stores one immutable before/after revision, and supports exact-key replay and status recovery. An unresolved Personal or Employment mutation blocks both Save actions while preserving both drafts. A confirmed save followed by a failed profile refresh stays confirmed and exposes a GET-only refresh action.

## Verification

| Check | Result |
|---|---|
| `pnpm test:functional test/functional/people-employees.test.ts` | PASS — 15/15 against real PostgreSQL, including persistence, immutable revision, replay, stale version and revoked receipt disclosure |
| Focused `people-employees.spec.ts` Personal save/unknown/refresh cases, Chromium, one worker | PASS — 3/3 |
| `pnpm typecheck` | PASS |
| Focused ESLint plus `pnpm check:boundaries` and `pnpm check:backend` | PASS |
| `pnpm check:db-design` | PASS — 206 registered tables |
| `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` | PASS — build `cvfj0kxQBpcy6tsYiG02l` |
| Synthetic People seed | PASS — repeat-safe correction grant; private values retained only in ignored fixture |

## Visual inspection

- [Desktop Profile](profile-desktop.png)
- [Desktop Personal editor](personal-edit-desktop.png)
- [Mobile Profile](profile-mobile.png)
- [Mobile Personal editor](personal-edit-mobile.png)
- [Computed measurements](measurements.json)

The rebuilt current source was inspected at 1440×1000 and 390×844. The drawer uses the established Staff/Profile reference composition, Inter at 13px for controls, 40px desktop and 44px mobile fields, 1px outlines, consistent secondary Cancel and primary Save actions, and no root overflow. The mobile drawer occupies the viewport and keeps the action footer visible. Human visual acceptance remains PENDING.
