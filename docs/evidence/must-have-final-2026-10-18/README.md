# Must-have integrated checkpoint

Date: 18 October 2026 (Asia/Kolkata)

## Candidate

- Application source: `c7b2abd`
- Normal production build: `lA2wtzNon2bc8hg3fJSJN`
- Included journey checkpoints: M01 `2cb27e9`, M02 `1fdb4a9`, M03 `7134780`, M04 `dae79cf`, M05 `3b683f7`, M06 `d165806`, M07 `8cd20f7`, M08 `99a669f`
- Database migration state: development and dedicated test databases each have 117 applied migrations and no pending migration.

## Integrated verification

- `pnpm check` passed: lint, TypeScript/Next route types, documentation validation, 204 database table contracts, boundary checks, portable backend compilation and 257 unit tests across 58 files.
- `pnpm test:functional` exercised the full PostgreSQL suite. It passed 263 of 265 tests and identified two assertion drifts against newer accepted contracts. No product write failed.
- After the assertion repairs, `pnpm test:functional test/functional/institution-context.test.ts test/functional/reporting-leadership-brief.test.ts` passed 2 files and 7 tests. The broad suite was not repeated because the other 263 tests and application code were unchanged.
- Focused ESLint passed for all final repair files.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` passed and produced build `lA2wtzNon2bc8hg3fJSJN`.
- The M01–M08 evidence directories contain each journey's focused PostgreSQL, one-worker browser and inspected desktop/mobile evidence. M07 and M08 additionally used isolated production build `Wrd7P85a7tJo0u_ZOsWfN` before this integrated normal build.

## Evidence index

- [M01](../must-have-m01-2026-10-18/README.md)
- [M02](../must-have-m02-2026-10-18/README.md)
- [M03](../must-have-m03-2026-10-18/README.md)
- [M04](../must-have-m04-2026-10-18/README.md)
- [M05](../must-have-m05-2026-10-18/README.md)
- [M06](../must-have-m06-2026-10-18/README.md)
- [M07](../must-have-m07-2026-10-18/README.md)
- [M08](../must-have-m08-2026-10-18/README.md)

## Remaining gates

Human acceptance is pending. TEN-03 restricted-runtime-role/RLS proof, native VoiceOver/NVDA evidence, font portability, restore/load evidence and the recorded owner-specific production provider, retention, scanner and real-data policies remain open. This synthetic checkpoint is not production readiness and does not authorize real pupil data.
