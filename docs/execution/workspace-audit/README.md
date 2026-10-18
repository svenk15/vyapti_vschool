# Five-workspace implementation audit

Audit date: 18 October 2026 (Asia/Kolkata). This is a read-only implementation audit. No product behavior, route, permission, database row, migration or navigation configuration was changed.

## Baseline

| Item | Observed state |
|---|---|
| Repository | `vyapti_vschool`, branch `work/stu-01-after-per02-wip` |
| HEAD | `d6c91206eec2c9d641c6f2dccc58765613f2f0b4` (`Regroup Principal navigation by workflow`) |
| Working tree at audit start | 172 pre-existing modified/untracked paths, primarily historical screenshot evidence and local review material; none was cleaned, reset, stashed or included in this audit commit |
| Inspected current source | HEAD plus the pre-existing working tree; no uncommitted application source change affected the audit findings |
| Demo | `http://127.0.0.1:3400`; `/api/health` returned `ready: true` |
| Served build | Next build ID `jCObsKqoFwjNr2pibKzUn`; standalone process working directory `.next/standalone`; build timestamp 18 October 2026 09:17:26 IST |
| Source/build provenance | The build predates the HEAD commit by about one minute and was produced from the then-uncommitted navigation changes later committed as HEAD. No Git SHA is embedded in the build, so the build ID is the exact executable identity and HEAD equivalence is a repository-content inference, not a cryptographic assertion. |
| Development database | `vyapti_vschool`: 117 applied migrations; schema up to date |
| Test database | `vyapti_vschool_test`: 117 applied migrations; schema up to date |

The five authoritative catalogues contain 250 workflows. Institution Administrator/shared administration is identified where it appears in the School Administrator shell, but is not added to the 63-workflow School Administrator count. Platform Operator workflows are outside this audit.

> **18 October follow-up:** M01 current-source verification found that the Parent and Student rows were valid. `/choose-workspace` intentionally exposes only staff options and directly redirects an authorized personal account to `/family` or `/student`. The audit capture sampled for a selector option instead of awaiting that redirect, so the “no authorized option” observation is superseded by [`must-have-m01-2026-10-18`](../../evidence/must-have-m01-2026-10-18/README.md). The original capture remains historical evidence.

## Reconciled status

| Workspace | Total | Engineering complete | Partial | In progress | Not started | Needs revalidation | Human accepted |
|---|---:|---:|---:|---:|---:|---:|---:|
| School Administrator | 63 | 29 | 9 | 0 | 23 | 2 | 1 scoped |
| Teacher | 42 | 19 | 4 | 0 | 19 | 0 | 0 |
| Student | 47 | 15 | 7 | 0 | 25 | 0 | 0 |
| Parent/Guardian | 52 | 14 | 2 | 0 | 36 | 0 | 0 |
| Principal | 46 | 45 | 1 | 0 | 0 | 0 | 0 |
| **Total** | **250** | **122** | **23** | **0** | **103** | **2** | **1 scoped** |

No workspace has every documented workflow engineering-complete. Principal is closest: LEA-45 remains partial because no production AI provider, permitted-data/region/retention configuration or real-provider evaluation is approved. The single human-accepted item is SA-27, limited to the staged layout and normal correction journey recorded by the user; it does not accept other workflows or release gates.

`WORKFLOW_STATUS.csv` is the row-level reconciliation. Each engineering-complete row cites a code/evidence source. Supported-operation slices remain partial. Provider simulations and synthetic-only implementations retain their deployment restrictions.

## Source reconciliation

- School Administrator matrix rows SA-32–SA-34 were stale. The later Guardians foundation and registration integration provide real designated-manager, verified-link, intended-account invitation, resend and scoped revocation behavior. Those rows were corrected to `VERIFIED` with human review still pending.
- Student STW-33/STW-34 and Parent PAR-23/PAR-24 were stale after F11-E. Current Assessments/Documents evidence proves published synthetic report read/download and withdrawal behavior, so those rows were corrected.
- The Teacher matrix intentionally records only 17 milestones. The audit retains all 42 catalogue workflows. TEA-16, TEA-23, TEA-33 and TEA-34 are complete from later current owner evidence; TEA-20 and TEA-28 are partial. The remaining absent rows are not treated as complete merely because a related owner exists.
- Administrator SA-46 and SA-60 have substantial shared owner implementation but no complete Administrator-specific current-source comparison. They are `NEEDS_REVALIDATION`, not silently promoted.
- Principal's current regrouped navigation and 45/1 engineering split are supported by current code, matrices and evidence.

## Browser inspection

One installed Chromium instance was used sequentially at 1440×1000 and 390×844 against the existing server. Administrator, Teacher and Principal navigation rendered successfully. The current Student and Parent credential artifacts reached the workspace chooser with no authorized option, so their current seeded navigation could not be rendered; configured navigation was inspected in code and prior role-specific evidence remains indexed. This is a current demo-fixture/access discrepancy, not proof that the underlying completed code has regressed.

Captures and machine observations are under `navigation-captures/`. Account and school identity text was replaced in the browser DOM before sidebar-only screenshots; no credential, token, protected pupil content or database identifier is present.

## Conclusions

The product has strong implemented cores for Access, school setup, Student records, Attendance, Timetable, notices, text Learning, Assessments, Principal coordination and synthetic Documents. The largest remaining catalogue volume is in later owner capabilities: broader Learning lifecycles, requests/conversations, consent, admissions applicant journeys, Finance/payments, Transport, Library, activities/meals, restricted health/support, and provider-backed assistant work.

Navigation quality is uneven. Principal now has task-oriented collapsible groups. Administrator remains long and flat with 25 items for the seeded persona. Teacher is manageable but places all operational work in one group. Student and Parent use useful mobile bottom navigation, but purpose checks are inconsistent across destinations and the current demo personas cannot be selected. Proposed groupings preserve every destination and server guard; this audit applies none of them.

## Limitations

- No application build or test suite was rerun. Existing evidence is reused with source provenance.
- No destructive or state-changing workflow was exercised.
- Navigation capture verifies rendered structure, not every destination's server authorization.
- Native VoiceOver/NVDA, actual browser 200% zoom, font portability, TEN-03 restricted-role/RLS proof and production provider/policy reviews remain separate gates.
- Historical evidence timestamps are preserved as recorded. Evidence directories dated 19 October reflect UTC/IST checkpoint naming recorded by their authors and were not rewritten during this audit.
