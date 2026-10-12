# TT-02 weekly timetable draft — 12 October 2026

## Authority and scope

TT-02 is governed by the timetable-specific contract in `docs/modules/academics/DESIGN.md` and `docs/modules/academics/TASKS.md`, backed by the approved coordinated-pack records `references/approved/shared/docs/TASKS.md` (TT-02) and `WORKFLOWS.md` (TT-W02). Those records explicitly authorize a private branch/year timetable draft, expected-version save/resume/discard, unsaved-leave handling and retained history. They do not establish generic draft semantics for Students, Staff, Admissions or Reports.

The visual authority is `references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-41`, Administrator state **Edit timetable → Draft revision**. TT-01 and TT-02 are engineering tasks beneath SA-41. Their completion does not complete the parent workflow: TT-03 conflict/impact preview, TT-04 immutable publication and TT-05 idempotent Attendance handoff remain outstanding.

## Implemented result

Implementation source commit: `7e3d9d1` (`Complete private weekly timetable drafts`). The final evidence/documentation commit is separate so the source identity remains explicit.

- The Administrator opens a real branch/year weekly grid, chooses a class and effective date, and edits each lesson cell through a focus-contained drawer. Mobile uses an equivalent keyboard-operable list.
- Save writes the complete private aggregate with current authorization, module/entitlement/activation checks, expected-version CAS, exact-input receipt, audit and outbox evidence. A reload resumes the saved version.
- Unsaved edits survive class changes inside the active flow; same-origin navigation and browser unload warn before loss.
- A stale save preserves local edits and offers an explicit stored-version reload. A lost response retries the exact retained payload and idempotency key.
- Discard transitions the revision to `DISCARDED`; its slots/history remain stored and published content is untouched. Lost discard acknowledgement uses the exact retained command.
- `pnpm demo:seed` invokes the feature-owned idempotent fixture. The final run preserved the existing pattern, weekly draft and lesson plan without replacing user-created data. Optional older TEN-02, ACA-01 and branding refreshes reported their existing unavailable/conflict states and were preserved; the command completed successfully.

## Verification

| Check | Result |
|---|---|
| `pnpm check` | Passed: lint, type generation/typecheck, docs, 61-table DB design, boundaries, portable backend and 139 unit tests. |
| Focused domain | `timetable-pattern.test.ts` + `timetable-draft.test.ts`: 4/4 passed. |
| Focused PostgreSQL | `timetable-pattern.test.ts`: 3/3 passed against `vyapti_vschool_test`, covering TT-01 plus save/reopen, replay, stale state, discard retention, scoped authorization and evidence rollback. |
| Desktop browser | TT-01/TT-02 file passed 2/2 with one Chromium worker; after the final grid selector adjustment the TT-02 journey passed again 1/1. |
| Mobile browser | TT-01 passed 1/1 and final TT-02 passed 1/1 at 390 px with one worker. |
| Production build | Passed; build ID `X-B18ejoYOuD2JGC9yIjd`. |
| Development migrations | Prisma reports 41 repository migrations and an up-to-date `vyapti_vschool`; TT-02 migration `20261012110000_timetable_drafts` remains applied. |
| Test migrations | Each focused browser/PostgreSQL run reported 41 migrations and none pending in `vyapti_vschool_test`. |

The browser journey verifies populated save/resume, retained edits, actionable validation, stale recovery, exact-key lost-response recovery, retained-history discard, no viewport overflow and direct focus of the date, class and lesson controls. Backend evidence remains authoritative for cross-tenant denial and transaction behavior.

## Direct visual comparison

- [Approved draft desktop](reference-draft-desktop.png)
- [Application desktop](application-chromium.png)
- [Approved draft mobile](reference-draft-mobile.png)
- [Application mobile](application-mobile.png)

The captures were inspected directly. TT-02 now follows the approved weekly class/day grid on desktop, compact class/effective-date controls, draft status/actions, cell hierarchy and responsive list/drawer composition. The production data is intentionally smaller than the fictional reference and uses real eligible offerings rather than copied sample values.

Remaining SA-41 differences are explicit: **Review & publish**, **View published**, conflict/impact presentation and published timetable comparison require TT-03/TT-04; Attendance occurrence generation requires TT-05. The coordinated contract defers two-week cycles, and the accepted nullable-room boundary omits a room selector until a Facilities-owned room source exists. The documented font portability deviation remains. Native VoiceOver/NVDA and native browser zoom were not executed. Human review is **PENDING**.

## Demo

Route: `http://127.0.0.1:3400/admin/timetable`

Credentials: ignored private file `artifacts/people-02/private-demo.json` (values are never recorded here).

1. Sign in as the synthetic School Administrator and open **Timetable**.
2. Choose the seeded class and effective date. Open an empty or occupied cell, choose the eligible Mathematics lesson and apply it.
3. Choose **Save draft**, reload, and confirm the cell persists as the saved private draft.
4. Change a cell and navigate between classes; confirm the in-flow edit remains. Use **Discard draft** only when you want to retain the draft as discarded history.
5. Choose **School day** to inspect TT-01’s teaching days and ordered lesson/break intervals, then return to the weekly draft.

Human acceptance is PENDING. TEN-03 restricted-role/RLS proof, font portability, native accessibility and production provider/restore/load gates remain separate release blockers.
