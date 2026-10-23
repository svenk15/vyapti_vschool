# People and staff identity — current state

## Staff Profile consistency and in-context management — 23 October 2026

Staff Manage and Sort now reuse the Student directory glyphs and interaction hierarchy. Staff Profile exposes the already-approved Employee-category correction as an in-context Employment drawer with mandatory reason, optimistic version and exact-key recovery. Dated teaching eligibility now opens as an in-context Profile drawer while preserving the Academics preview, assignment-impact acknowledgement, stale protection and final owner save. The compatibility eligibility route remains available for existing deep links.

Change roles now shows every assigned branch role. `PRINCIPAL` is checked and locked because the existing membership command does not authorize changing it; `SCHOOL_ADMIN` and `TEACHER` remain editable. The implementation explanation was removed, Reason is visibly required, and identity content is aligned consistently across Staff drawers. Personal correction and additional Employment fields remain blocked by unapproved PD-STF-02 rather than being represented as working controls.

Changed-file lint and TypeScript passed. Clean 4 GiB production and E2E builds passed (`J3vMCFl4lT0S6BW1tO3A5`, `yTvOqpC1W7LlHOAmaIEMU`). Focused Chromium checks passed for the mixed-role lifecycle, Employment category correction, dated eligibility exact replay and invitation recovery. [Evidence](../../evidence/staff-consistency-2026-10-23/README.md). Human visual acceptance remains PENDING.

## Staff direct role save and checkbox consistency — 23 October 2026

Following explicit user approval, Staff Profile **Change roles** now saves directly from the role-and-reason form; the redundant review screen has been removed. The resulting request still uses the Access owner's guarded `UpdateMembership` command with `SET_ROLES`, selected roles, required reason, expected version, command key and existing recovery behavior. Staff role checkboxes now use the same compact visual recipe as Student onboarding: 16×16 controls, 9px gap and 20px row height, with matching 12px desktop and 13px mobile label text.

Changed-file ESLint, TypeScript and a clean 4 GiB production build passed. Build ID: `kdWrEI9bH4dskYZyjX2V9`. Focused Playwright verification at 1440×1000 and 390×844 confirmed direct Save, exact computed checkbox parity, keyboard focus and no root overflow; the intercepted verification request was not persisted. See [direct role save evidence](../../evidence/staff-direct-role-save-2026-10-23/README.md). Human visual acceptance remains PENDING.

## Staff access action-drawer alignment — 23 October 2026

The Staff Profile **View access** drawer was exercised through Change roles, role review, Suspend access and Revoke access at 1440×1000 and 390×844 against the frozen 22 October Staff reference. A broad identity-text selector had overridden the avatar's grid centring, and viewport-derived form heights stretched short action compositions. The avatar initials and identity copy are now centred, forms and footers are content-driven, mobile Back/primary proportions match the reference, and Suspend/Reinstate/Revoke show the authorized sign-in email and current state already available from the Access projection. Summary-row arrows were measured and were already centred within 0.5 CSS px.

Focused interactive comparison passed for every listed CTA without submitting a mutation; changed-file ESLint, diff validation and the clean 4 GiB production build passed. Build ID: `5JUBIQ9N3yPp3sb1kJnKb`. No owner command, authorization, recovery, schema, migration or fixture changed. See [action alignment evidence](../../evidence/staff-access-action-alignment-2026-10-23/README.md). Human visual acceptance remains PENDING.

## Administrator Staff full-fidelity checkpoint — 23 October 2026

The current working-tree candidate based on `c28f80d59b4db85deadb9045c9de44a7765d68bd` aligns every independently authorized Administrator Staff state with the frozen Staff reference: Profiles directory, Filter and Sort drawers, Manage dialog, Profile, assignments and portal drawers, Add Staff, Access directory, independent invitation and the two-step access-management drawer. People-owned category/employment filtering and name/code/employment ordering run across the complete authorized result before cursor pagination. URL state, Back/Forward, exact recovery, live authorization and owner boundaries remain intact.

Focused People unit 4/4 and PostgreSQL 14/14 checks passed; backend and boundary checks passed; focused directory/pagination browser checks passed 2/2 and the changed Access lifecycle passed 1/1 with one Chromium worker. The 4 GiB production build passed with build ID `aYyd35WOsz-nLsnM8Mcgu`. Direct reference/application captures cover 1440×1000 and 390×844, with additional 900×1000, 360×800 and four-theme evidence. [Full-fidelity evidence](../../evidence/staff-full-fidelity-2026-10-23/README.md).

No schema, migration, seed, permission or domain transaction changed. STF-01B and PD-STF-01–03 remain outside the implemented scope. Human visual acceptance, native accessibility, TEN-03 and production readiness remain PENDING.

## Administrator Staff C01–C09 correction — 23 October 2026

Application source `6266c38c` completes the bounded correction against frozen Staff Site commit `fc33c8b991134ade6d02e27fbe467ef67d86b085`. Directory header/navigation/toolbars, table alignment and responsive density, Manage, Profile and Add Staff now follow the approved Staff composition. People confirmed-save/failed-refresh is distinct from UNKNOWN; the completed mutation cannot be resubmitted and recovery reads only. Signed cursor history, query reset and loaded-range wording no longer treat a page count as an authoritative total.

People PostgreSQL verification passed 14/14, the full Staff browser file passed 6/6 on desktop and 6/6 on mobile, and the final focused directory/pagination regression passed 2/2 per viewport. The clean 4 GiB production build passed with build ID `AeoqXwEgSTp5_voNlOn4w`. Direct current-source captures and measurements cover all four required viewports and themes. [C01–C09 evidence](../../evidence/staff-c01-c09-correction-2026-10-22/README.md). No schema, migration, seed, owner permission or domain rule changed. PD-STF-01–03, human acceptance, TEN-03 and native accessibility remain pending.

## Approved Staff handoff composition — 22 October 2026

Application source `ba43e6089ec8f44048013075a41749b27b04d745` implements the frozen Administrator Staff reference at Site commit `fc33c8b991134ade6d02e27fbe467ef67d86b085`. Profiles and Access use the approved local navigation; the People directory uses Name/Profile versus Manage semantics and 25/50/100 server-side cursor pagination; Add staff uses the compact one-page composition while preserving the structured People command; Profile uses the approved Personal, Employment, Teaching assignments, Staff portal and history order; and Access uses the approved account-state columns and hierarchy. No owner command, authorization rule, schema, migration or seed changed.

Focused Staff browser verification passed all five journeys on desktop and mobile after one test-only locator correction. Changed-file ESLint, TypeScript and the clean 4 GiB production build passed; build ID `RE-cPsN_n2Nv1qhGEL37U`. Direct reference/application captures at 1440×1000 and 390×844, plus 900×1000, 360×800 and four-theme application checks, were inspected. [Evidence and deviations](../../evidence/staff-approved-handoff-2026-10-22/README.md). STF-01B and PD-STF-01–03 remain explicitly incomplete; human acceptance, TEN-03 and native accessibility remain PENDING.

## STF-04A/B Staff command recovery — 22 October 2026

People Staff creation/management and Access membership management now retain one immutable owner command key and payload after a lost response. Their separate owner status routes return only `FOUND` or `UNKNOWN` after live administrator, scope and target checks; revoked authority blocks receipt disclosure. While UNKNOWN, another owner save is disabled. A confirmed commit followed by failed refresh is labelled saved and offers a GET-only refresh, without mutation replay. The unapproved PD-STF-02 correction surface remains absent.

Focused verification passed: People unit 4/4, Access unit 5/5, People PostgreSQL 13/13, Access PostgreSQL 9/9, backend compilation, boundaries, and the recovery browser journeys on desktop and mobile with one worker. One initial functional wrapper invocation included a literal separator and began the broad suite; it was stopped after an unrelated Finance failure, then the two intended files passed with corrected arguments. The first mobile browser attempt found local PostgreSQL unavailable; the existing service was restarted without reset and the unchanged case then passed. Evidence: [STF-04A/B](../../evidence/staff-stf-04ab-2026-10-22/README.md). Human review remains PENDING; no schema or migration changed.

Last updated: 2026-10-17. Human review is tracked separately from implementation evidence. No imported completion or active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| PER-01 | VERIFIED | PENDING | [Local verification](../../evidence/people-01-local/verification.json), JUnit reports, source `45ca6d6` |
| PER-02 | VERIFIED | PENDING | [Local verification](../../evidence/people-02-local/verification.json), JUnit reports, tested source `e72125d` |

## STF-03A authorized Staff Profile — 22 October 2026

The dedicated `/admin/teachers/{employeeId}` destination now reads an exact same-branch Employee through the guarded People facade and composes browser-safe Academics and Access projections through typed owner ports. Academics rechecks `class.manage`, release, entitlement and activation before returning eligibility/assignments. Access rechecks `user.manage` before returning binding, membership roles and safe invitation lifecycle. People does not read either owner's private tables, does not expose tokens or verification evidence, and performs a final live guard/resource check after composition. Missing owner authority/module support renders an explicit unavailable panel without inferring owner facts.

The current Profile matches the frozen content-width hero, Employment, Teaching, Access, operations and history composition on inspected 1440×1000 and 390×844 captures. Active linked, active no-account and ended states were exercised. People PostgreSQL passed 12/12, focused desktop and mobile Playwright passed 2/2 per viewport, and the 4 GiB production build passed with build ID `31F-Og17Ps0lWxswztc6d`. A stale generated E2E webpack cache was isolated after visual inspection exposed missing CSS; only screenshots from the confirmed current stylesheet are retained as acceptance evidence. [STF-03A evidence](../../evidence/staff-stf-03a-2026-10-22/README.md).

PD-STF-02 correction controls remain absent. Dated eligibility remains STF-05, invitation operations remain STF-06 and employment-end composition remains separately gated. Human visual acceptance is PENDING; TEN-03, font portability and native accessibility gates remain unchanged.

## STF-01A People-native Staff directory — 22 October 2026

The production `/admin/teachers` query now applies name or Employee-code search, People-owned category/employment filters and name/code/employment ordering to the complete authorized branch result before pagination. Signed bidirectional cursors bind actor token version, branch configuration version and the full normalized query; query or authority changes invalidate them. Search/filter/sort/cursor state is URL-backed and browser Back/Forward reloads the protected server result. Teaching and Access filters/sorts remain the explicit STF-01B owner-projection dependency.

Focused source checks passed: TypeScript, changed-file ESLint, People unit 4/4, People PostgreSQL 11/11, backend compilation, boundary validation, and Staff Chromium/mobile browser journeys 2/2 per viewport with one worker. The verified production build ID is `QvIkW5cz6ehAB5eKhxR-V`; desktop 1440×1000 and mobile 390×844 captures were inspected after isolating a stale generated webpack cache. One initial wrapper invocation incorrectly began the broad functional suite and was stopped; its unrelated Finance failure is not attributed to this slice. `pnpm check:docs` continues to report only the two pre-existing broken `workspace-presentation-route-pass-2026-10-20` links in unrelated dirty WORKSPACE_PRESENTATION_REVAMP files. Current screenshots and reference links are recorded in [STF-01A evidence](../../evidence/staff-stf-01a-2026-10-22/README.md). Human visual acceptance remains PENDING; TEN-03 and native accessibility gates remain unchanged.

## UX-11 Staff directory presentation — 19 October 2026

The `/admin/teachers` presentation now follows the approved directory-first Staff composition: Add staff routes to the existing dedicated staged workflow, server-backed search and signed cursor pagination remain intact, rows present actual current category/employment/access/teaching states, and one Manage dialog exposes the existing guarded actions. The duplicated inline creation form was removed from the directory without removing the owner command or route. No People, Access or Academics contract, schema, migration, authorization rule or seed changed.

Focused Chromium and Mobile Chromium journeys passed 1/1 each against real PostgreSQL, including duplicate and validation failures plus category, teaching, verified binding and employment transitions. Type checking and the standard 4 GiB build passed. Exact reference/application desktop and mobile captures were directly inspected; a mobile first-column width defect was corrected before checkpoint. [Evidence](../../evidence/ux-revamp-11-staff-directory-2026-10-19/README.md). Human visual acceptance and existing release gates remain pending.

## F07-A / LEA-23 safe operational availability — 17 October 2026

Implementation is ENGINEERING_COMPLETE at `e62445d`; human review remains PENDING. The People owner now provides separately designated recorder authority, branch-timezone bounded safe availability intervals, immutable expected-version revisions, exact-payload recovery, a safe Principal projection and a minimal `BUSY`/`FREE`/`UNKNOWN` cross-branch collision port. Private leave, payroll and medical narratives are excluded from the stored command contract and Principal response. Default dates use the selected branch timezone and invalid normalized calendar dates fail validation.

Forward migration `20261017200000_people_operational_availability` is applied to development and test (80 migrations each). The three new People tables are registered under TEN-ADR-006 Path A; application authorization remains active and TEN-03 RLS verification is still a production gate. Focused unit 4/4, real-PostgreSQL functional 2/2, database-design/backend/boundary/type checks, current-source Chromium 2/2 and mobile 2/2 passed. `pnpm demo:seed` added or preserved fictional availability without changing credentials or manual records. [Evidence](../../evidence/principal-f07-availability-2026-10-17/README.md).

F07 remains PARTIAL: D09 exact-occurrence cover approval, substitute acceptance, fresh collision/eligibility checks and Attendance-safe activation have not been implemented. No open/submitted Attendance reassignment is implied.

## Current checkpoint

**Must-have M02 connected checkpoint (18 October 2026):** The current demo's verified same-branch Teacher account was exercised from the Administrator's dated assignment in `/admin/classes` through the scoped `/teacher/classes` projection. The Teacher saw one authorized class; the normal People and Academics PostgreSQL suites passed 19/19, including verified same-branch binding, current permission denial, assignment overlap/version checks and employment cutoff rollback. See [M02 evidence](../../evidence/must-have-m02-2026-10-18/README.md). Human review and the existing production gates remain pending.

**Administrator account display projection (10 October 2026):** People now exposes a read-only current-account display-name query through its existing portable facade and Prisma adapter. It returns an active scoped Employee name only for an already verified AccountPersonBinding and rechecks live account/token, organization, branch and membership context. It creates no binding and does not grant a role. The synthetic administrator has no accepted binding, so the portal truthfully falls back to “School administrator”; bound teacher coverage is included in the focused People PostgreSQL test. No schema or migration changed. [Dashboard evidence](../../evidence/admin-today-2026-10-10/README.md); human review PENDING.

**SA-COMP-04 / SA-20 — exclusive Student Person name correction (10 October 2026):** implementation VERIFIED at `d3059ada9f82efe289dc0dcfe02fdc2825195796`; human review PENDING. The approved school-administrator exception to PER-ADR-002 applies only when the selected branch Student is the Person's sole Student reference in the institution and no Employee references that Person. People owns normalization, Person CAS and immutable name history; Students owns branch selection, `student.manage`, exclusivity and the command envelope. Shared identities return `PERSON_SHARED` without record counts or foreign-branch detail. Forward migration `20261010009000_person_name_revisions` is applied to both designated databases and preserves existing Person rows. Path A table classification is recorded; TEN-03 RLS remains incomplete. `pnpm check` passed with 117 unit tests; the broad real-PostgreSQL checkpoint passed 110/110 and final focused Students passed 12/12; focused desktop/mobile Playwright passed 2/2. Guarded `pnpm demo:seed` passed without replacing fixtures. [Evidence](../../evidence/sa-comp-04/README.md).

**EX-06 presentation adoption (10 October 2026):** Implementation VERIFIED at `42dd2db48ecbe80ee908f167d00d60aeb662bcd1`; human review PENDING. `/admin/teachers` now separates profile creation from the full-width staff directory and uses per-record dialogs for verified account binding and employment end. Existing People/Academics/Access ownership, out-of-band identity verification, scoped authorization, locking, versions and idempotency are unchanged. Focused People/Access PostgreSQL tests passed 16/16; final desktop/mobile People browser journeys passed 2/2. No schema, migration or seed changed. Evidence: `docs/evidence/ex-06/README.md`.

**Design readiness (4 October 2026):** PER-02 LLD/task clarify owner-enlisted Teacher/AccountPersonBinding writes, scoped uniqueness, account→Organization→School locking and explicit out-of-band school-admin verification reference; account email or activation alone is not proof. At that review, the dated dependency snapshot was PER-01 VERIFIED/PENDING, IAM-03 VERIFIED/PENDING, ACA-01 VERIFIED/PENDING. PER-01 and ACA-01 review may remain PENDING. The implementation status table remains authoritative.

**Partial PER-02 work before gate reconciliation (4 October 2026):** Work began before the explicit IAM-03 acceptance gate was noticed. Migration `20261004001400_teacher_eligibility` has been applied to local `vyapti_vschool` and `vyapti_vschool_test`; it creates the Academics-owned, scoped Teacher table under the Path A TEN-03 closure rule. Focused PostgreSQL tests passed 5/5 and PER-02 desktop/mobile Playwright journeys passed 2/2 against the test DB. These are partial-work checks, not a verified task checkpoint. The code and migration are preserved in branch history at WIP commit `d57ae73`; this checkpoint is not task verification or acceptance. No stable PER-02 review demo was prepared. On 5 October, IAM-03's explicit acceptance gate was satisfied for source `e0f262a78d7e020919cd36be80d508c9032d1e07`; PER-02 resumes from its existing code and applied migration without branch switching or database reset.

## PER-02 local verification and running demo — 5 October 2026

Implementation VERIFIED; human acceptance PENDING. Tested source commit: `e72125d4545e48c4b5c69c4ba3c9a646f7eea5d1`; production build ID `M14FdBP2K8Hgq60j29NAE`. The isolated frozen demo is running at http://127.0.0.1:3421 against the guarded development database. Health returned `alive:true`; Chromium smoke verified administrator sign-in, both seeded unbound profiles, the protected employees API (200), teacher sign-in and server-side denial of staff management. No demo records were mutated during smoke verification.

IAM-03's explicit dependency gate is PASSED for accepted source `e0f262a78d7e020919cd36be80d508c9032d1e07`. PER-01 and ACA-01 are VERIFIED; their human reviews remain PENDING as allowed by the dependency contract.

The existing Academics Teacher migration `20261004001400_teacher_eligibility` is applied to both `vyapti_vschool` and `vyapti_vschool_test`; each has 22 applied migrations and no pending migrations. This PER-02 checkpoint adds no schema migration. The Teacher table remains Academics-owned, scope-keyed and protected by its documented composite foreign key and uniqueness constraints. `pnpm check:db-design` reports 51 registered table contracts consistent with Prisma and the LLD.

Database enforcement distinction: application authorization remains active on every protected read/write. Real PostgreSQL tests verify current `class.manage` and `user.manage`, account status/version, branch membership, same-branch active TEACHER membership, module entitlement and branch activation. A read-only development-role check found no restricted runtime role among the documented names, and `vs_academics_teacher` has RLS disabled. Under TEN-ADR-006 Path A, database RLS enforcement remains planned for TEN-03; no restricted-role or RLS enforcement is claimed here.

`pnpm demo:seed` completed using the local development guard and file-only mail sink. It created a separate synthetic school, two unbound employee profiles and an active, email-verified teacher account through the existing Access invitation and acceptance use cases. Repeated PER-02 seeding reuses the private command keys and does not duplicate those records. Credentials/account IDs are in ignored mode-0600 `artifacts/people-02/private-demo.json`; invitation tokens remain in the ignored local `artifacts/mail-sink/` directory and are not printed. No real message was sent.

Checks on this checkpoint:

- `pnpm check` passed: lint, TypeScript, documentation, 51-table database design, extraction boundaries, backend compilation and 84 unit tests. [JUnit](../../evidence/people-02-local/unit.junit.xml).
- `pnpm test:functional` passed 90 tests across 14 files against real PostgreSQL `vyapti_vschool_test`. PER-02 specifically verifies owner writes followed by injected rollback, binding uniqueness race, inactive/unverified/wrong-branch account rejection, permission denial, scoped Teacher and binding writes, and same-day offboarding. [JUnit](../../evidence/people-02-local/functional.junit.xml).
- `pnpm test:e2e test/e2e/people-employees.spec.ts` passed 2 desktop/mobile Chromium journeys for profile creation, eligibility, verified binding, conflict feedback, offboarding, persistence and layout. [JUnit](../../evidence/people-02-local/e2e.junit.xml).
- `pnpm build` passed. The protected employee, teacher-profile, account-binding and end-employment routes were included in the production build.
- `pnpm demo:seed` passed; read-only browser smokes verified the live admin and teacher paths. The focused commit contains only PER-02 checkpoint, seed and verification additions; unrelated untracked workspace files remain untouched.

Manual review (PENDING):

1. Open http://127.0.0.1:3421/sign-in and use the administrator email/password in `artifacts/people-02/private-demo.json`; then open `/admin/teachers`. Expect Avery and Jordan's synthetic profiles, both unlinked and not teaching-eligible.
2. Enable teaching for Avery. Expect ENABLED; refresh and confirm it persists.
3. Bind `teacherAccountId` from the private file to Avery using an out-of-band verification reference and reason. Expect active portal access. Try the same account on Jordan; expect a safe conflict and no second binding.
4. End Avery's employment using today's displayed school-local date. Expect ENDED and teaching eligibility DISABLED after refresh.
5. Sign out, sign in with the synthetic teacher credentials, then open `/admin/teachers`. Expect the server-side staff-profile access-denied state.

PER-01 creates a distinct organization-local Person and school-scoped Employee record in one guarded transaction. Contact similarity never merges people. Authorized staff see a branch-scoped list and a separate portal-link status. Creating a profile does not create a login, bind an account or enable teaching eligibility. Access owns the `AccountPersonBinding` table; it is installed now with no rows, and only the explicit identity-verified PER-02 flow may add bindings.

## PER-01 verification — 4 October 2026

Source commit: `45ca6d6cf19ba321c814099d405b7581f9bd77e2` (`Implement PER-01 staff profiles`). The frozen production-mode local demo is http://127.0.0.1:3409, build `b13AmUy8w1SEA5TLimWdc`. `verification.json` records the tested revision, observed status probes and database migration state. The existing ACA-02 demo on port 3408 remains untouched.

The forward migration `20261004001100_people_staff_profiles` is applied to development `vyapti_vschool` and test `vyapti_vschool_test`. Each database has 15 successful forward migrations and no pending migrations. The test migration ledger retains two earlier rolled-back attempts; no history or rows were deleted. Prisma schema comparison is empty. The checkpoint has 34 migrated tables. No database reset/reseed or environment overwrite occurred; no dependency was added.

Checks on the tested source:

- `pnpm check` passed: lint, TypeScript, docs, database design, backend boundaries/compile and 67 unit tests. [JUnit](../../evidence/people-01-local/unit.junit.xml).
- `pnpm test:functional` passed 53 tests across 10 files against real PostgreSQL `vyapti_vschool_test`, including atomic rollback, scoped foreign keys, same-name nonmerge, duplicate races, authorization, cursor scope and safe evidence. [JUnit](../../evidence/people-01-local/functional.junit.xml).
- `node scripts/database.mjs e2e` passed all 60 desktop/mobile Playwright journeys on the final run. Two earlier complete attempts exposed intermittent failures in unrelated branding journeys; their isolated reruns and the final full run passed. [JUnit](../../evidence/people-01-local/e2e.junit.xml).
- `pnpm build` passed; production build ID `b13AmUy8w1SEA5TLimWdc`.
- The frozen demo returned live health 200, unauthenticated employee API 401 and protected staff page redirect 307. A synthetic authenticated browser smoke created two distinct same-name profiles, refreshed and confirmed both records plus “Not linked to account”.

Manual review (human acceptance remains PENDING):

1. Open http://127.0.0.1:3409/sign-in and use the existing synthetic credentials in the ignored `artifacts/iam-01/private-demo.json` file. Expect the protected school home.
2. Open `/admin/teachers`. Create two profiles with the same name and different staff numbers. Expect two separate rows, each marked “Not linked to account”.
3. Refresh the page. Expect both rows and statuses to remain.
4. Try the same staff number again. Expect a safe duplicate conflict and no extra row. Try an invalid contact email and expect field validation.

The browser smoke already used two clearly synthetic names/numbers in the development database; the records are retained. No real personal data or credentials are included in committed evidence.

## Limitations and next action

PER-01 does not create a login or account binding and does not make the employee eligible to teach. PER-02 implementation is VERIFIED; its human review remains PENDING for source `e72125d4545e48c4b5c69c4ba3c9a646f7eea5d1`. IAM-03 human acceptance was recorded on 5 October for the exact reviewed source `e0f262a78d7e020919cd36be80d508c9032d1e07`; this satisfies PER-02's explicit acceptance gate. ACA-03 and ATT-01 now provide assignment/session impact guards; restricted runtime RLS enforcement remains TEN-03. PER-01 and ACA-01 human reviews remain PENDING and are not PER-02 acceptance gates. Next action is `pnpm next-task` after ATT-01's implementation checkpoint.

### SA-COMP-11 / SA-13 staff category — 10 October 2026

SA-13 is implementation-VERIFIED with human review PENDING. Employee creation requires Teaching, Administration or Support; existing rows were preserved as UNCLASSIFIED by forward migration `20261010013000_employee_staff_category`; the branch directory displays category and provides a reasoned versioned correction. Category remains descriptive and does not alter Access or Academics state. The migration is applied to `vyapti_vschool` and `vyapti_vschool_test` (36 applied migrations each). Focused unit and 10-case PostgreSQL People checks passed; desktop and mobile production-build journeys passed after correcting an ambiguous test locator. `pnpm demo:seed` passed twice and added one fictional categorized support profile without changing existing staff. Evidence: [SA-COMP-11](../../evidence/sa-comp-11/README.md). TEN-03 and native accessibility gates remain; no production readiness is claimed.

### SA-13 direct reference composition — 11 October 2026

SA-13 remains functionally VERIFIED and human review PENDING. `/admin/teachers/create` now composes the existing scoped People command as the approved three-stage Staff details → Employment → Confirm workflow, with a persisted receipt and links into Staff profiles and SA-14. The existing directory creation surface remains available. No People contract, table or migration changed. The combined Staff/access desktop and mobile journey creates the real Employee and continues through identity-bound access, activation and membership changes. Screenshots were inspected against the exact SA-13 reference. Evidence: [Administrator Staff/access checkpoint](../../evidence/admin-staff-access-2026-10-11/README.md).

### STF-05 Staff Profile handoff — 22 October 2026

The authorized Staff Profile now exposes the dated teaching-eligibility handoff without moving eligibility policy into People. People supplies scoped Employee facts through a typed port; Academics owns eligibility revisions and assignment impact, and Attendance owns frozen-session impact. The Profile projection includes the current period and immutable revision history. Focused current-source evidence is in `docs/evidence/staff-stf-05-2026-10-22/`; engineering verification is complete and human review remains PENDING.

## Administrator Staff production correction — 22 October 2026

The bounded STF-01A/STF-03A/STF-04A/B/STF-05/STF-06 presentation correction is checkpointed at application source `223d62332401f972e7407f0dc977e7e990a1446c`, normal build `bPsKDL8Z3tqD1DUJBNreD`. Directory state now carries through Add Staff → receipt → Profile → Back, Profile is the primary row destination, Teaching and Access remain separate display facts, Profile panels are content-sized, and the dated-eligibility Reason/action geometry matches the frozen production reference. No owner command, schema, migration or authorization rule changed.

Focused People PostgreSQL passed 14/14 and focused Staff Chromium passed 5/5. The assignment-impact rejection, exact replay, restricted authority and Profile GET-only recovery are covered. Current-build desktop/mobile, 900/360 and four-theme evidence was visually inspected. See [production correction evidence](../../evidence/staff-production-correction-2026-10-22/README.md). PD-STF-01–03, STF-01B and rejoining remain outside this batch. Human acceptance and release gates remain PENDING.

## Staff Profile and directory drawers pinpoint correction — 23 October 2026

The bounded `/admin/teachers` Filter/Sort drawers and `/admin/teachers/[id]` Profile were directly remeasured and visually compared with the frozen 22 October Staff reference. Drawer dimensions, option density, actions, Profile typography, record width, section spacing, assignment composition and responsive alignment now match the approved surfaces at 1440×1000 and 390×844. Dated eligibility remains reachable through the assignments drawer. URL state, Back restoration and keyboard focus were verified with a focused read-only browser journey. No owner behavior, authorization, schema, migration or fixture changed. Evidence: [Staff pinpoint correction](../../evidence/staff-pinpoint-2026-10-23/README.md). PD-STF-02 Edit controls remain deliberately absent pending approval; human visual acceptance remains PENDING.

## Staff Profile and Filter/Sort follow-up — 23 October 2026

The Staff Filter and Sort triggers and drawer Cancel actions now compute to a 1px pale theme border, matching the frozen reference rather than the previously inherited dark secondary outline. The Profile's assignment drawer now contains the approved identity and compact assignment composition with no extra footer action, and pending invitation state uses the reference's `View invitation` trigger with `Staff access` drawer title. Active access is composed inside the Profile with authoritative identity/status facts and the existing guarded Change roles, Suspend/Reinstate and Revoke operations; role changes use the reference's edit → review → save stages while retaining the Access owner's expected-version, exact-key recovery and live authorization behavior. Final build `wcBTqLXJ3Sk4fQixRsRl9` from implementation commit `5e89fd59b4bfe1a7c61e300a4345be6d1711abe8` was directly inspected at 1440×1000 and 390×844, including access summary, role-edit and role-review states. Production data and owner behavior remain authoritative. Personal and Employment Edit controls remain excluded behind unapproved PD-STF-02; no fake action was added. Evidence: [Staff pinpoint follow-up](../../evidence/staff-pinpoint-followup-2026-10-23/README.md). Human visual acceptance remains PENDING.

The subsequent `View access` alignment correction gives Invitation and Manage branch access their reference section structure, left-aligns action labels, and constrains the Close footer to the approved 28px desktop and 20px mobile end insets. A clean-cache production build `jKk3n_k2IoDq_QjnHWHf6` and the same focused 1440×1000/390×844 comparison passed. No owner command or permission changed; human visual acceptance remains PENDING.

## Staff Profile edit actions and drawers — 23 October 2026

The Staff Profile now exposes the frozen Personal details and Employment pencil actions, identity-header drawer composition and aligned Teaching assignment/eligibility actions. The existing Staff-category correction remains the only mutable employment field: it still requires a reason and preserves the People owner's expected-version and exact-key recovery behavior. PD-STF-02 remains unapproved, so Personal correction inputs, Employee code and historical Joining date are read-only and no unsupported mutation is presented. Desktop and mobile reference/application captures were directly inspected after clean build `cnQyWg2vSFtsSsCosagkd`; both Teaching icons render at 14×14, the narrow layout no longer overlaps, and root overflow is absent. Evidence: [Staff Profile actions](../../evidence/staff-profile-actions-2026-10-23/README.md). Human visual acceptance remains PENDING.
