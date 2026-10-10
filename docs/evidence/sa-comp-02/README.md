# SA-COMP-02 verification

Workflow SA-10 is implementation VERIFIED on the current tested worktree; human review is PENDING. The Academics workspace now shows dependency counts and supports prospective, versioned retirement of grades, sections and subjects. Historical catalog, offering, placement and attendance rows remain in place. No schema or migration changed.

Executed evidence:

- `pnpm check` passed: lint, typecheck, documentation, database design, extraction boundaries, backend compilation and 116/116 unit tests.
- The first broad real PostgreSQL run passed 107 existing tests and exposed one new-fixture failure: its synthetic year was still DRAFT when the test created an offering. The fixture was corrected to publish its calendar and open the year. The focused guarded rerun passed 9/9, then the final broad `pnpm test:functional` passed 108/108. It proves accurate dependency counts, exact replay, changed-input rejection, cascading retirement, unresolved-session rollback, and preservation of retired records.
- `pnpm test:e2e test/e2e/academics-setup.spec.ts` passed 4/4 across desktop Chromium and 390px mobile after updating the pre-existing section assertion to the new catalog composition. The retirement journey requires a bounded reason, persists inactive state after refresh, and checks viewport overflow.
- `pnpm demo:seed` completed against guarded local `vyapti_vschool`, preserving existing credentials and records. The existing academic fixtures already exercise populated catalog state. The current date is a non-teaching day, so the seed honestly skipped creating new same-day attendance sessions and preserved the connected 6 October three-session walkthrough.

Rendered inspection:

- [Desktop academic catalog](catalog-retirement-chromium.png)
- [Mobile academic catalog](catalog-retirement-mobile.png)

The desktop composition keeps the wider grade/section workspace beside a compact subject catalog. Mobile stacks every control and catalog row without page-level horizontal overflow. Full-page capture can visually repeat fixed navigation chrome; this is a screenshot artifact rather than content overlap in the tested viewport.

Manual review remains PENDING. Sign in with the existing synthetic school administrator, open `/admin/academics`, create a uniquely named subject, choose **Retire**, enter a reason of at least five characters, and confirm. Expect the record to remain visible as retired after reload and to be absent from active selectors. A catalog item with current/future placements or a scheduled/open attendance session must show counts and prevent confirmation until the dependent workflow is resolved.
