# F07-A / LEA-23 — safe operational staffing availability

Status: engineering complete for the D09 availability slice at `e62445d`; human review PENDING. F07 remains PARTIAL because exact-occurrence cover approval, substitute acceptance and Attendance-safe activation are a separate slice.

## Implemented outcome

- A separately designated People recorder can create or version an `AVAILABLE`/`UNAVAILABLE` interval for an active Teacher through `/admin/teachers/availability`.
- A Principal with current direct or delegated `leadership.read` sees only staff name, staff number, safe state and interval time at `/leadership/staff/availability`. Source references and private leave, medical or payroll narratives never enter the Principal DTO.
- Missing evidence is `UNKNOWN`. A minimal People collision port exposes only `BUSY`, `FREE` or `UNKNOWN` across branches.
- Every protected read/write rechecks the live account, membership, module release/entitlement/activation, resource purpose and current scope. Recorder authority is an explicit branch designation and is independent of role.
- Writes use account → Organization → School → interval locking, expected-version comparison, exact-payload idempotency, immutable revisions and atomic evidence/audit/outbox/receipt persistence.
- Default dates are calculated in the selected branch timezone. Calendar-normalized invalid dates are rejected.

## Persistence and migrations

Forward migration `20261017200000_people_operational_availability` adds three People-owned Path-A tables: recorder grants, availability intervals and immutable revisions. It is applied to both designated local databases; each reports 80 applied migrations and no pending migration. The registry contains 121 tables. No database was reset and no applied migration was edited. RLS enforcement remains deferred to TEN-03 and blocks production/real-client use.

## Verification

| Check | Result |
|---|---|
| `pnpm exec vitest run --config vitest.config.ts test/unit/people-availability.test.ts` | 4/4 passed: input bounds, state precedence, revision shape and exact school-date validation |
| `pnpm test:functional test/functional/people-availability.test.ts` | 2/2 passed against real PostgreSQL: create/replay/revise/stale/history, safe projection, recorder denial and minimal cross-branch collision |
| `pnpm check:db-design` | Passed with 121 registered tables |
| `pnpm check:backend` | Passed |
| `pnpm check:boundaries` | Passed |
| focused ESLint and `pnpm exec tsc --noEmit` | Passed |
| `pnpm build` | Passed from the final current source; build `z4pQqAZLYuGN_Fp_yPxa9` includes both availability routes |
| focused Playwright, Chromium, one worker | 2/2 passed; the browser created a real interval, then the Principal projection reloaded it |
| focused Playwright, mobile, one worker | 2/2 passed against the same E2E build |
| `pnpm demo:seed` | Passed through the guarded development target; existing records and credentials were preserved |

An initial functional invocation used the wrapper with an extra `--`, unintentionally starting the broad suite. It was interrupted after an unrelated `institution-context` failure; that run is not reported as a pass. The corrected focused invocation above passed. The first mobile retry hit a sandbox-denied local PostgreSQL connection during Prisma setup; the approved local-database rerun passed before Playwright execution.

## Visual comparison

Authority: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, LEA-23 explorer state. The explorer is a workflow specification dialog, while production uses recipe L from `04_PRODUCTION_UX.md`.

The reference, recorder and Principal production screens were directly inspected at 1440×1000 and 390×844. The production composition preserves the approved date/branch choice, safe availability facts, privacy boundary and advisory warning. It uses the shared Principal/Admin shells, a real recorder form, status badges and the operational table. Desktop hierarchy and spacing are coherent. At mobile width the wide facts table scrolls within its card; the full-page capture shows the clipped right edge of that scroll viewport rather than page overflow. The recorder capture also shows the sticky mobile header at a stitched scroll position. These are recorded presentation differences, not human visual acceptance.

- [Recorder desktop](recorder-chromium.png)
- [Recorder mobile](recorder-mobile.png)
- [Principal desktop](leadership-chromium.png)
- [Principal mobile](leadership-mobile.png)
- [Approved reference desktop](reference-chromium.png)
- [Approved reference mobile](reference-mobile.png)

## Demo

Run `pnpm demo:seed`, then `pnpm demo:start`. Open `http://127.0.0.1:3400`. Private credentials remain in ignored `artifacts/leadership-01/private-demo.json` and `artifacts/people-02/private-demo.json`; no credential is committed or printed.

1. Sign in as the designated synthetic administrator and open **Staff availability** under Management. Record an interval, review it, and confirm. Expect a saved status and the new safe interval in the table.
2. Sign out, sign in as the synthetic Principal, and open **Staff availability**. Expect the same state/time without the recorder's source reference or any private narrative.
3. Choose a date without evidence. Expect `UNKNOWN`, never an inferred `AVAILABLE` state.
4. Refresh after changing branch context. Expect the selected branch's data and date; prior-branch rows must not remain.

Pending: exact-occurrence cover (F07-B/LEA-24), human review, font portability, native VoiceOver/NVDA, real browser 200% zoom, TEN-03 and production policy/provider gates.
