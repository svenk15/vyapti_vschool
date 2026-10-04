# Institution, branch and module configuration — current state

Fresh v4.1 extension. No active timer. Design is specified; production runtime is not inferred from previews.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| TEN-01 | VERIFIED | PENDING | Source `c09519ca10bddd6286aba242d21aa9a5000ff0ae`; production build `fGxMmBd-8b7ScLU7mVhug`; local verification report and JUnit evidence below |
| TEN-02 | VERIFIED | PENDING | Source/build/test evidence: `docs/evidence/tenancy-02-local/`; owner review remains pending |
| TEN-03 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |

## Implemented now

TEN-01 delivers persisted institution/branch setup, operator-issued institution and membership grants, institution-admin metadata-only branch creation, bounded authorized context listing and switching, protected request reauthorization, context-change cache/draft clearing, and immutable transactional receipts/audit/outbox evidence. TEN-02 adds organization entitlements, branch activations, transactional configuration and evidence, current permission and release gates, module configuration API/screen, and local operator tooling. There are no released product modules in this checkout, so runtime activation correctly fails closed.

## Next action

Continue with the next task selected by `pnpm next-task`; TEN-01, IAM-03, and TEN-02 human reviews remain PENDING. TEN-03 remains gated on ATT-04 acceptance as recorded in the execution index.

## Evidence and feedback

Append exact source revision, test reports, DB migration state, demo identity, limitations and human feedback here. No live institution or pupil data is bundled.


### TEN-01 inspection and blocking design decision — 4 October 2026

Selected by pnpm next-task after IAM-03 verified handoff 11fa272 on clean main. Intended demo: provision two institutions and multiple branches, show only current authorized contexts, switch branches with protected drafts cleared, and deny ungranted branches without implicit operational access from institution authority.

Read owning DESIGN/TASKS/CURRENT_STATE, Bible tenancy and shared UX rules, database contract, extraction/runbook and current Access repository/use cases/factory/hosting/gateway/screens/tests. Actual storage has 13 tables and six migrations; InstitutionGrant is not implemented. Existing context resolution chooses the first authorized branch unless an explicit candidate is supplied; there is no persistent context switch or institution admin surface. Existing operator bootstrap explicitly refuses account reuse; TEN-01 therefore requires a deliberate ID-based owner flow. Development/test configurations were inspected without printing credentials: both are local and point to vyapti_vschool / vyapti_vschool_test; operator and auth configuration are present. Unrelated changes were absent. No schema, business code or database data changed for this inspection.

Blocking decision: DESIGN's Read joins and authorization says “Granting self operational access is a separately audited action allowed only within delegated policy.” The delegated policy, grant issuer authority and existing-account branch attachment authority are unspecified. Bible separates institution administration from operational access and forbids unaudited impersonation. Asked owner whether grants/attachments should be restricted to the verified operator (recommended), with institution administrators able to create branches but unable to grant themselves operational access, or whether administrators may also grant existing accounts branch memberships. This is a privilege-boundary decision; no broader authority is silently implemented. Choice remains pending, not accepted by elapsed time.

Independent preparation identifies reuse of current UserAccount/Organization/School storage and account → Organization → School guards; Access owner facade for grants/branch writes; sanitized context DTOs; shared UI; request-local candidate context reauthorized on every read/write; forward migration and PostgreSQL concurrency/isolation/rollback evidence plus Playwright desktop/mobile context clearing/denial journeys. Institution-level evidence must retain genuine institution scope rather than invent a branch. Complete the detailed write/error/evidence design after the authority decision, before migration/code.

Only documentation checks apply to this inspection checkpoint; implementation functional/browser/build gates have not been executed for TEN-01 and are not claimed passed. Human review NOT_REQUESTED. IAM-03 demo remains http://127.0.0.1:3403, tested source e0f262a78d7e020919cd36be80d508c9032d1e07, review PENDING. Next action: resolve the pending authority decision and resume TEN-01; no deployment, timer or external messaging.


### TEN-01 resumed — 4 October 2026

Owner: “Please go-ahead and implement the next task”. Proceed with the presented recommended operator-only authority policy; IAM-03 human review remains PENDING, not inferred PASSED. Clean main at cac1625. TEN-ADR-004 resolves command boundaries, evidence-table installation timing, error/replay policy and request-local context before coding. Demo outcome remains two institutions/multiple branches, explicit current authorized switching, persisted branch creation and ungranted-branch denial. Required checks are pending.

### TEN-01 implemented and verified — 4 October 2026

Implemented and committed as `c09519ca10bddd6286aba242d21aa9a5000ff0ae` (`Implement TEN-01 institution and branch context`). Human review is PENDING; no human acceptance is inferred. Production build ID is `fGxMmBd-8b7ScLU7mVhug`, frozen snapshot is serving at http://127.0.0.1:3404. Local probe results are in [verification.json](../../evidence/tenancy-01-local/verification.json); unit, functional and E2E JUnit reports are committed beside it.

Completed checks: `pnpm check` (including lint, TypeScript, docs, database design, boundaries, backend compile and 53 unit tests), `pnpm test:functional` (35 passed against PostgreSQL), `pnpm test:e2e` (52 passed desktop/mobile), `pnpm build`, and `pnpm verify:tenancy-local` (9 production-snapshot probes passed). Both `vyapti_vschool` and `vyapti_vschool_test` retain the original foundation marker and have eight forward migrations, 17 registered `vs_` tables and 24 foreign keys. Schema-to-database diff is empty. `.env` hash is unchanged. Test and demo records are synthetic and retained; no database reset/reseed was used. There are no new dependencies. No pupil data is logged or included.

Migration note: the first TEN-01 migration is preserved unchanged after application. Its later actor-history index correction is the separate forward migration `20261004000400_institution_history_indexes`. A first test-database attempt of that follow-up encountered an already-present index and rolled back; it was resolved with a migration-history rollback record on the dedicated test database only, then the corrected forward migration applied successfully. No table/data/migration was deleted or database reset.

Limitations: Tenancy does not yet persist or enforce module entitlement/branch activation (TEN-02). No production RLS, Person binding, deployment or production database readiness is claimed. Module management remains within the documented UI/API scope; trusted operator commands run only via the local CLI.

Manual review steps: sign in at http://127.0.0.1:3404/admin using the existing local IAM-01 synthetic demo account; switch to the second pre-attached branch and confirm the warning before discarding a protected draft; check another open tab reloads into the new scope; create a unique branch under the institution administration surface and confirm the success message says it grants no staff membership or module access; then use `/api/v1/context` to inspect its `selectable:false` entry and request `/api/v1/school?schoolId=<new-branch-id>` to confirm 404. A foreign/ungranted branch switch should also return 404. Credentials and private demo identifiers remain in ignored local artifacts.

Next action: continue to TEN-02 as authorized by the owner continuation policy; keep TEN-01 owner review PENDING and address any reported defect before work that depends on it.

### TEN-02 selected and design reconciled — 4 October 2026

`pnpm next-task` selected TEN-02 after TEN-01 was recorded VERIFIED/PENDING; TEN-01 acceptance remains pending. Before coding, the tenancy LLD/task and Bible changelog were reconciled: evidence tables were already installed by TEN-01, and no product module is released in this checkout. TEN-02 will add only OrganizationEntitlement and BranchActivation; production activation of Attendance/Fees must fail closed. Controlled test manifests prove positive configuration matrices without exposing a runtime override. Current release evidence is not yet complete.

### TEN-02 implemented and verified — 4 October 2026

Implemented with `vs_organization_entitlement` and `vs_branch_activation`, scoped API/application use cases, transactional concurrency/idempotency/evidence writes, branch and entitlement checks, a token-authenticated module configuration screen, and a local operator CLI. Design, task acceptance, Bible changelog, table registry and database contract were reconciled before implementation. There is no Attendance, Fees, Student, Academic or Staff business workflow released in this checkout. The production release manifest therefore has every module disabled. The live demo shows the Attendance contract and Fees dependencies, preview blockers, and rejects confirmation without activating the branch. Test-only immutable manifests exercise positive combinations.

Implementation is VERIFIED; human review is PENDING. Source implementation commit is recorded in `docs/evidence/tenancy-02-local/verification.json`. Production build ID is `RcBxf_F69gbU4tNYEfu5dd`; frozen demo URL is http://127.0.0.1:3405. The forward migration `20261004000500_module_entitlements` is applied to `vyapti_vschool` and `vyapti_vschool_test` (nine migrations each); migration diff from the development database to `prisma/schema.prisma` is empty. The existing synthetic demo entitlement was recorded at organization revision 6. No branch activation was written. No reset/reseed occurred and no dependency was added.

Checks: `pnpm check` passed (lint, typecheck, docs, database design, boundaries, standalone backend compile and 55 unit tests); `pnpm test:functional` passed (42 PostgreSQL tests across 7 files, including migration rehearsal and tenancy isolation, concurrency and rollback cases); `pnpm test:e2e` passed (54 desktop/mobile Playwright journeys); `pnpm build` passed; `pnpm prisma validate` passed; `pnpm prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script` returned `-- This is an empty migration.`; `git diff --check` passed. JUnit XML reports are committed alongside the verification record.

Manual review: sign in at http://127.0.0.1:3405/admin using the existing local IAM-01 synthetic demo account. Open Module access. Confirm Attendance is marked unavailable in the current release and the branch is disabled. Select Attendance and preview; expect `RELEASE_UNAVAILABLE` with the prerequisite modules shown. Confirm with a reason of at least five characters; expect an unavailable response and a message that activation was not applied. Reopen the screen and confirm the branch remains disabled. Select Fees and preview; expect its release/dependency blockers. Do not expect Attendance or Fees business screens in this checkout.

Limitations: no product module is released, production activation remains denied, resource-specific permissions fail closed until consumer-module owner ports exist, and no production RLS/deployment claim is made. These are design-aligned boundaries, not passing production entitlements. The private demo identifiers, command idempotency key and credentials remain in ignored local artifacts. The `.puku-cli/` untracked directory is unrelated and excluded from this task commit.
