# EX-09 browser and owner evidence

Implementation source: `624d5b0b795229c85d85ac7c13d7a19441ec9bf1`.

- `pnpm check` passed lint, types, documentation, 51-table database design, boundaries, portable backend compilation and 113/113 unit tests.
- `pnpm test:functional test/functional/import-preview.test.ts` passed 11/11 against the dedicated PostgreSQL test database with all 31 migrations current. It covers preview non-writes, explicit invalid-row handling, confirmation, bounded processing, replay, cancellation, retention, rollback and authorization failures.
- `pnpm test:e2e test/e2e/import-preview.spec.ts` passed 4/4 across desktop and mobile. The journeys exercise mixed-validity preview, explicit skip, persisted completion after reload, bounded cancellation, safe error report download and the 2 MiB upload rejection.
- `pnpm demo:seed` passed against guarded `vyapti_vschool` and preserved the existing fictional mixed-validity and multi-batch CSV fixtures and private credentials.
- The four desktop/mobile captures in this directory were inspected for hierarchy, action placement, table containment and narrow-screen overflow. Wide row data remains horizontally scrollable on mobile.

The production page now presents file selection, server preview/approval and durable processing/recovery as three explicit stages with exact counts. Existing authorization, storage, transaction, receipt, size and retention contracts are unchanged. No schema or migration changed.

Human visual review remains PENDING. TEN-03, production-provider/retention review and native VoiceOver/NVDA/200% zoom evidence remain release gates.
