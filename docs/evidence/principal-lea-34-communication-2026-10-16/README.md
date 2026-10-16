# LEA-34 Principal notice coverage evidence

Status: supported read slice engineering-verified; complete LEA-34 partial; human review pending.

## Contract and source

- Approved workflow source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow `LEA-34` (“Follow up delivery or acknowledgement gaps”).
- Application entry: `/leadership/communication`.
- Owner: Communication `notice-coverage.v1`; Leadership only presents the browser-safe aggregate.
- No schema or migration change. Development and test retain the 64-migration LDR-03 schema.

## Verification

- `pnpm exec vitest run test/unit/access.test.ts`: 10/10 passed. The Principal capability set includes `communication.read_leadership` and excludes `communication.publish`.
- `pnpm test:functional test/functional/communication-notices.test.ts`: 3/3 passed against real `vyapti_vschool_test`. Coverage includes frozen eligible/read/acknowledgement arithmetic, absence of message body and account identifiers, and denial after Principal revocation.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/communication-notices.spec.ts --project=chromium --workers=1`: 3/3 passed.
- The same focused command with `--project=mobile`: 3/3 passed.
- Both browser projects confirmed 64 applied migrations. The build reused by these runs was produced from the same current source before the focused browser execution.

The first desktop attempt timed out because the generalized sign-in helper treated the Parent account's transient `/choose-workspace` server redirect as an Administrator chooser and waited for a Branch field. The retained trace identified the race. The helper now waits for the intended personal workspace, while Administrator/Principal branch selection remains explicit. The corrected source passed both projects without a timeout increase or weakened assertion.

## Direct visual inspection

- `application-chromium.png` and `reference-chromium.png` were inspected at 1440×1000.
- `application-mobile.png` and `reference-mobile.png` were inspected at 390×844.
- The application captures use the comparable incomplete state: two frozen eligible accounts, one first read and one explicit acknowledgement on a still-published notice.
- Application hierarchy, responsive cards/table, explicit state, selected navigation and absence of horizontal overflow are coherent in both captures.
- The approved source is a workflow-review dialog describing coverage, failed/unacknowledged inspection, targeted reminder/resend preview and durable outcomes. It does not define an exact production notice-coverage page. The application implements only the authorized aggregate-read stage in the shared Principal shell. It omits all follow-up actions whose owner contracts are missing. This is a recorded design extension, not an exact-fidelity or full-workflow claim.

Known visual deviation: the repository's documented approved-font redistribution issue remains; the application uses the established fallback. Native VoiceOver/NVDA evidence was not executed.

## Remaining work

Reminder/resend requires a Communication-owner command with trusted delivery outcomes, current recipient/purpose reauthorization, channel rules, idempotency/deduplication, replay and durable per-recipient result semantics. Until that exists, LEA-34 remains partial. TEN-03 and production-provider review also remain release gates.
