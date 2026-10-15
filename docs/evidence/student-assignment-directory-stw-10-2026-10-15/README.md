# LEA-02 / STW-10 Student assignment directory

Date: 15 October 2026. Human review: **PENDING**.

## Supported behavior

The exact authorized Student assignment set now supports bounded Assignment name and Subject search, Due date/Assignment name/Subject ordering in either direction and query-bound cursor pagination. PostgreSQL applies filtering and ordering before the page limit with assignment UUID as a stable tie-breaker. Each request repeats live account, Student access, independent Learning purpose, current enrollment, branch and module checks before joining the exact frozen Student binding to the immutable current published version. Detail reauthorizes separately.

No migration, table, write path, grant or seed changed. The cursor is a positioning token, not authority; changing any query criterion invalidates it and every page still resolves the current server-side recipient binding.

## Approved comparison

- Reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Student_Design/VSchool_Student_Review.html#/assignments`
- Reused reference captures: `docs/evidence/learning-publication-2026-10-15/reference-student-assignments-chromium.png` and `reference-student-assignments-mobile.png`
- Current captures: `application-chromium.png` and `application-mobile.png` in this directory

The images were inspected directly. The application matches the supported reference hierarchy: page heading, compact search attribute/value group, separate Sort action, table columns/density, row action and mobile record composition. Real school, class, subject and due values replace prototype fixtures.

The approved Filters action remains a documented difference. Its Draft, Submitted, Returned, Closed and Excused values depend on learner draft/submission/feedback lifecycles outside LEA-01/02. The application does not infer those states from due time or expose a dead Filters button. The richer assignment detail resources, criteria and submission actions also remain absent. The font-portability exception remains.

## Verification

- Focused ESLint and `pnpm typecheck` — passed.
- `pnpm test:functional test/functional/learning-publication.test.ts` — 4/4 passed against real `vyapti_vschool_test`; 57 migrations applied, none pending. Query coverage includes title and subject search, deterministic first/second pages, descending due order and changed-query cursor rejection.
- `VSCHOOL_E2E=1 pnpm build` — passed.
- Focused desktop Chromium, one worker — 1/1 passed.
- Focused Mobile Chromium, one worker — 1/1 passed.

The browser journey applies Subject search with Enter, verifies URL state and matching data, uses browser Back, applies Assignment name/Descending in the Sort drawer, captures the responsive directory and opens the independently authorized detail. One initial desktop run failed only because `getByLabel('Search assignments')` also matched the clear button; the selector was corrected to the searchbox role before the passing rerun. Native VoiceOver/NVDA, actual browser zoom, font portability, TEN-03 and human acceptance remain pending.

The current local demo at `http://127.0.0.1:3400/sign-in` was rebuilt from application source `2c0e7aca123b88c472d9b2f8f5664345fad9a5de`; health returned ready and sign-in returned HTTP 200.
