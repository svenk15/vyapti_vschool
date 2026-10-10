# EX-05 browser evidence

Playwright captures these real application states against the dedicated PostgreSQL test database at 1440×900 desktop and 390×844 mobile viewports:

- school overview with owner-provided daily totals;
- school setup work areas;
- school settings with read-only timezone;
- published branding editor and revision state.

The source SHA and exact verification commands are recorded here after the implementation commit. These images are browser evidence, not human acceptance. Human review remains pending.

Tested implementation source: `486f5d9ed90c3f985d2ca53f78cb0350f5e47a6b`.

- `pnpm check`: passed; lint, types, docs, 51-table design registry, boundaries, backend compile and 111 unit tests.
- `pnpm test:functional test/functional/access-management.test.ts`: passed 7/7 against `vyapti_vschool_test`.
- `pnpm test:e2e test/e2e/access-management.spec.ts test/e2e/branding-management.spec.ts`: passed 6/6 desktop/mobile journeys. A final branding capture rerun passed 2/2.
- `pnpm build`: passed; production build `MMrxiLdHnnKBzy-N3V_AQ`.
- `pnpm demo:seed`: passed against guarded local `vyapti_vschool` and preserved existing records/private credentials.
- Live smoke at `http://127.0.0.1:3400`: administrator entry, published brand, teacher entry and teacher day passed with zero browser page errors.

No schema or migration changed. The 31 existing migrations were current in the PostgreSQL test runs. TEN-03, native assistive-technology checks and human visual acceptance remain pending.
