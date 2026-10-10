# EX-06 browser evidence

Playwright captures the real Staff access and Staff profiles workspaces against the dedicated PostgreSQL test database at desktop and mobile viewports. The journeys exercise persisted access creation/lifecycle, last-administrator protection, immediate revocation, separate same-name profiles, teaching eligibility, verified binding, conflicting identity selection and employment end.

Implementation source: `42dd2db48ecbe80ee908f167d00d60aeb662bcd1`.

- `pnpm test:functional test/functional/people-employees.test.ts test/functional/access-management.test.ts`: 16/16 passed against real PostgreSQL; all 31 migrations were current.
- `pnpm test:e2e test/e2e/people-employees.spec.ts`: 2/2 desktop/mobile passed after the final layout correction.
- `pnpm test:e2e test/e2e/access-management.spec.ts`: 4/4 desktop/mobile passed after the final compact-action correction. The preceding combined Access/IAM-04 run passed 10/10.
- `pnpm check`: lint, types, docs, 51-table database design, boundaries, portable backend compile and 111/111 unit tests passed.

No schema, migration or seed contract changed. Human visual review remains pending. Production email-provider review, native assistive technology and TEN-03 remain separate release gates.
