# Architecture and data handoff
This is a proposed product/domain boundary, not a physical migration design or a claim about the current schema.

## Owner-first architecture
Next.js adapters call framework-independent application use cases behind ports. Leadership reads compose minimized owner DTOs. Attendance, Academics, Learning, Requests, Communication, Assessments and specialist modules remain authoritative. Preserve extraction to Nest.js by keeping business policy outside React/routes.

Global UserAccount, institution grants, branch authority, temporary delegation and purpose-level case access are distinct. Current guard protocol and TEN-03/ADR decisions remain unchanged. Caller-provided IDs, role names or pooled GUCs are not authority.

## Candidate new aggregate: LeadershipFollowUp
Reuse an existing coordination/request aggregate only if it already supports these invariants. Do not duplicate it merely to match a proposed name.
- Scope: organization, school, source owner/type/ID, purpose.
- Identity: follow_up_id; creator; current eligible assignee; verifier permission policy.
- State: Open, InProgress, EvidenceReady, Closed, Cancelled. Overdue is derived, not a terminal status.
- Evidence: source version/ref, explicit finish condition, claimed completion ref, verified closure ref/time/actor.
- Controls: due_at instant, school timezone for display, optimistic version, stable command intent receipt.
- Events: Created, Assigned/Reassigned, EvidenceClaimed, VerifiedClosed, Reopened, Cancelled. Preserve history; cancellation is not success.

Value objects: OrganizationId, SchoolId, SourceReference, Purpose, StaffIdentity, DueInstant, ExpectedVersion, IntentKey, EvidenceReference, SafeReason. Validate scope and dates at the application/domain boundary.

Proposed table labels if no current equivalent: vs_leadership_follow_up, vs_leadership_follow_up_event and an existing owner command-receipt/outbox table. Actual columns, composite FKs, indexes, retention and RLS policy must be designed against the real schema before code. Do not create a parallel universal approvals table.

## Create command contract
BEGIN → current actor/module/school policy → authoritative source read under compatible owner protocol → current assignee eligibility → deduplication key and intent check → insert follow-up/receipt/safe audit → COMMIT. If source resolved before commit, return current source/no obsolete creation. Same intent and same payload returns same receipt; changed payload is conflict.

One active item per source + purpose + permitted scope; enforce with owner-approved unique/partial index and transition rules. To prevent TOCTOU, source check and insert must use compatible transaction/version/lock strategy; a read followed by unrelated commit is insufficient. Exact actual lock order extends the existing account → Organization → School contract and is settled in LLD.

## Verification contract
Reauthorize verifier → check follow-up expected version → read exact current source evidence → check finish condition → append closure event and verified reference atomically. Assignee saying Done cannot substitute for source evidence. Source/permission failure keeps the item open. Reopening appends a new event; old closure is not edited.

## Decision inbox contract
Projection: source module, item reference, branch, safe title, assigned decision role, due time, state and current action availability. Detail/command dispatch returns to the source owner. The owner rechecks policy, conflict of interest, current evidence, expected version and intent. The inbox never writes an authoritative Approved flag for another module.

## Notifications and privacy
Creation, assignment, delivery and acknowledgement are different states. Use existing approved delivery seam/policy. Do not introduce background retries contrary to existing mail contracts. No tools in this design task send messages.

General audit records actor/scope/source/operation/result/version/time/correlation. Exclude private narrative, pupil health/family restrictions, passwords/tokens, file bytes and raw provider payload. Restricted evidence stays in its owner store; links reauthorize every read. Source access is not transferred merely because a follow-up exists.

## Verification before implementation
Real PostgreSQL tests must cover cross-tenant/branch writes, forged source/assignee IDs, concurrent duplicate creation, source-submitted-before-confirm, close/reassign race, revoked grants and pooled connection behavior under the actual runtime role. Unit tests cover state/intent policies. Browser tests cover the full principal → coordinator → teacher → principal loop. This workflow-definition pack has not run those production tests.

Performance uses the existing 5,000 pupils/branch × 20 branches baseline. Define leader-query concurrency, sessions per day, snapshots, list bounds and SLOs separately. Existing attendance submission p95 <1s excluding client network remains its own owner gate; no unsupported leadership performance claim.
