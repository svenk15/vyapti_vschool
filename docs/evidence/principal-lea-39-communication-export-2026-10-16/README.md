# LEA-39 notice-coverage export evidence

Source checkpoint: working tree after `b3fc632` on 16 October 2026; the executable commit is recorded after verification. Human review remains PENDING.

The immutable authority is Principal workflow LEA-39. `/leadership/communication` opens `/leadership/reports/communication`; generation uses `/api/v1/leadership/reports/communication.csv`. Reporting consumes Communication's authorized `notice-coverage.v1` port. The owner selects current immutable versions before applying the bound and returns its exact total. The CSV includes one summary plus no more than 50 safe coverage rows and excludes recipient/account/Student identity, body, contact/family detail, delivery inference and reminder/resend authority.

Verification:

- `pnpm typecheck` — PASS.
- `pnpm exec vitest run test/unit/reporting-export.test.ts` — PASS after the final bound test, 14/14.
- `pnpm test:functional test/functional/communication-notices.test.ts -t "reports and exports complete bounded"` — PASS, 1/1 against real `vyapti_vschool_test`; 67 migrations applied. It proves a two-notice total with a one-row owner page, no automatic export grant, explicit designation/revocation, formula neutralization and private-field exclusion.
- Focused one-worker Playwright Communication journey — PASS 3/3 Chromium and 3/3 mobile. Each run used the isolated production build; the mobile download emitted a harmless closed-destination-stream server diagnostic after Playwright completed the download, with all assertions passing.

Visual evidence:

- `application-chromium.png`
- `application-mobile.png`
- `reference-chromium.png`
- `reference-mobile.png`

The captures were directly inspected. Scope/cutoff, distinct coverage measures, bounded field preview, explicit exclusions and authorized download follow immutable LEA-39 through the production Principal shell. The reference is a workflow dialog rather than an exact full-page composition. Font portability, native accessibility, TEN-03, production-provider gates and human review remain pending.
