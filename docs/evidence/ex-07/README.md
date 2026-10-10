# EX-07 browser evidence

Playwright captures the real Academic setup and Classes and teachers workspaces against the dedicated PostgreSQL test database at desktop and mobile viewports. Implementation source: `61ffda2a8e51571b93e19780a4c85dcea75b8d4a`.

- `pnpm check`: lint, types, docs, 51-table database design, boundaries, backend compile and 113/113 unit tests passed.
- `pnpm test:functional test/functional/academics-setup.test.ts`: 8/8 passed against real PostgreSQL; all 31 migrations were current.
- Final `academics-setup.spec.ts` and `academics-offerings.spec.ts` runs: 2/2 desktop/mobile each. The offering flow also verifies a stale end request returns 409 and preserves the current assignment.
- `pnpm demo:seed`: passed against guarded `vyapti_vschool`, reused the existing academic fixture and did not overwrite credentials or manual data.

No schema or migration changed. Human visual review remains pending. TEN-03, native accessibility and later timetable/substitution work remain separate gates.
