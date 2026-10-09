# Transaction, permission and persistence contract

## Concrete current guards
| Owner | Mutation locks observed | Read isolation / locking observed | Receipt store |
|---|---|---|---|
| Students | Account FOR UPDATE → Organization FOR SHARE → School FOR UPDATE | list/get use RepeatableRead with live checks and no mutation locks | vs_platform_command_receipt, scoped by organization/school/actor/command/key |
| Attendance | Account FOR UPDATE → Organization FOR UPDATE → School FOR UPDATE | reads use RepeatableRead with live checks and no mutation locks | vs_tenancy_tenant_command_receipt, scoped by organization/actor/command/key |

These lock strengths differ in current code. Do not replace this table with a universal “Organization FOR SHARE” assertion. Preserve owner ordering and strength during UI work. Any lock narrowing is a distinct concurrency/performance change with real PostgreSQL race tests. The all-design-packs prototype is not evidence to change this ordering.

For each write: establish the current database context through its port; lock/recheck account state and tokenVersion; lock/recheck organization and school; query current membership/grants; check released + licensed + active modules; check resource and person/assignment/date permission; only then inspect/replay receipt and mutate. For each read, the current protected read policy still applies; cached nav eligibility is not a grant.

## Atomic evidence and replay
Student mutation: Person owner operation if needed, Student/Enrollment/Placement write, school configuration revision, AuditEntry, OutboxEvent and CommandReceipt are one transaction. Failure to write any required evidence rolls back the business write.
Attendance mutation: session/roster/record/revision, school configuration revision and ConfigurationChange/TenantCommandReceipt/TenantOutbox are one transaction. AttendanceRevision is the business history; configuration evidence does not replace it.

A replay key is unique in its owner's real scope. Same key + different canonical input hash → IDEMPOTENCY_CONFLICT. Same key + same input → original semantic outcome, no duplicate write. Authorization is rechecked even when a receipt exists. For tenant-wide attendance receipt keys, verify current school/session scope before disclosing the result. Exact response reconstruction may differ by owner; preserve it rather than assume the receipt contains a full DTO snapshot.

Snapshot methods use different isolation choices: Student create/enroll/archive Serializable, transfer ReadCommitted under explicit guard; reads RepeatableRead. Do not standardize all to Serializable or ReadCommitted for aesthetics. SQLSTATE 40001/40P01 and Prisma conflict mapping need existing safe handling. A lower isolation level or new retry loop needs concurrency evidence.

## Parameterization and data boundaries
All SQL values are bound parameters; order/filter identifiers come from explicit server allowlists. Composite FKs bind resource references to organization/school, preventing cross-branch row assembly. No mutation trusts an organizationId, schoolId, accountId, role or verified flag from the browser as authority. UUID unpredictability is not access control.

No shared global tenant variable. No browser/database credentials. Every query/pagination cursor/cache key binds to actor/scope plus meaningful filter inputs. Protected responses are private/no-store under the existing adapters. Prevent old scope responses from replacing new scope state after branch switch. Abort old requests and compare context/request generation on response.

## RLS
TEN-03 remains a release blocker until actual restricted runtime roles, transaction-bound verified context, policies and WITH CHECK tests are present. Caller-settable PostgreSQL GUCs are not independent proof of authenticated context. This handoff does not prescribe an unreviewed cryptographic fix or claim existing context ports solve it. Use the actual TEN-03 LLD/security decision and keep absent-context/forged-context/pool-reuse evidence separate from app-level guard tests.

## Authentication recovery invariants retained
- Migration trust_mode default/backfill OPERATOR_CLI; new institutions explicitly choose HYBRID through the application rule.
- Global account reset policy checks all active institution memberships at issue AND consume. OPERATOR_CLI membership prevents email reset with generic public response.
- Trust tightening invalidates affected email tokens through the owner use case; no account-wide bypass from a permissive institution.
- Existing operator activation/recovery remains. Email failure is represented; never consume a token marked delivery-failed or claim delivery on provider failure.
- No raw token, password, pupil row or private recovery evidence in audit/error analytics.

Do not restyle a screen by altering these state machines. If an observed code path differs from canonical live security policy, isolate a defect ticket before enabling the affected action; continue unrelated work.
