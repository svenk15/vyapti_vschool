# Institution, branch and module configuration — current state

Fresh v4.1 extension. No active timer. Design is specified; production runtime is not inferred from previews.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| TEN-01 | BLOCKED | NOT_REQUESTED | Delegated authority decision pending; inspection recorded below |
| TEN-02 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |
| TEN-03 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |

## Implemented now

Pure dependency/entitlement reference rules and a synthetic in-memory configuration preview. No tenant database tables, protected APIs or persistent activation yet.

## Next action

Resolve the TEN-01 delegated grant policy question, reconcile the Access/Tenancy design, then implement this complete slice. IAM-02 is accepted; IAM-03 is VERIFIED with review PENDING under the owner continuation policy. Do not bypass this decision by implementing dependent grant writes.

## Evidence and feedback

Append exact source revision, test reports, DB migration state, demo identity, limitations and human feedback here. No live institution or pupil data is bundled.


### TEN-01 inspection and blocking design decision — 4 October 2026

Selected by pnpm next-task after IAM-03 verified handoff 11fa272 on clean main. Intended demo: provision two institutions and multiple branches, show only current authorized contexts, switch branches with protected drafts cleared, and deny ungranted branches without implicit operational access from institution authority.

Read owning DESIGN/TASKS/CURRENT_STATE, Bible tenancy and shared UX rules, database contract, extraction/runbook and current Access repository/use cases/factory/hosting/gateway/screens/tests. Actual storage has 13 tables and six migrations; InstitutionGrant is not implemented. Existing context resolution chooses the first authorized branch unless an explicit candidate is supplied; there is no persistent context switch or institution admin surface. Existing operator bootstrap explicitly refuses account reuse; TEN-01 therefore requires a deliberate ID-based owner flow. Development/test configurations were inspected without printing credentials: both are local and point to vyapti_vschool / vyapti_vschool_test; operator and auth configuration are present. Unrelated changes were absent. No schema, business code or database data changed for this inspection.

Blocking decision: DESIGN's Read joins and authorization says “Granting self operational access is a separately audited action allowed only within delegated policy.” The delegated policy, grant issuer authority and existing-account branch attachment authority are unspecified. Bible separates institution administration from operational access and forbids unaudited impersonation. Asked owner whether grants/attachments should be restricted to the verified operator (recommended), with institution administrators able to create branches but unable to grant themselves operational access, or whether administrators may also grant existing accounts branch memberships. This is a privilege-boundary decision; no broader authority is silently implemented. Choice remains pending, not accepted by elapsed time.

Independent preparation identifies reuse of current UserAccount/Organization/School storage and account → Organization → School guards; Access owner facade for grants/branch writes; sanitized context DTOs; shared UI; request-local candidate context reauthorized on every read/write; forward migration and PostgreSQL concurrency/isolation/rollback evidence plus Playwright desktop/mobile context clearing/denial journeys. Institution-level evidence must retain genuine institution scope rather than invent a branch. Complete the detailed write/error/evidence design after the authority decision, before migration/code.

Only documentation checks apply to this inspection checkpoint; implementation functional/browser/build gates have not been executed for TEN-01 and are not claimed passed. Human review NOT_REQUESTED. IAM-03 demo remains http://127.0.0.1:3403, tested source e0f262a78d7e020919cd36be80d508c9032d1e07, review PENDING. Next action: resolve the pending authority decision and resume TEN-01; no deployment, timer or external messaging.
