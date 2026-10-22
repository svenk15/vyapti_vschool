# Administrator → Staff implementation handoff

Reference: `REFERENCE_FREEZE.md`

This handoff prepares the independently approved engineering slices. It does not authorize production implementation by itself and does not relax any task gate, authorization check or owner boundary.

## Recommended dependency order

### 1. STF-01A — People-native directory

**Supported scope.** Name and Employee-code search, category/employment filters, deterministic supported sorts, URL state and scoped keyset pagination over People-owned facts.

**Owner path.** Extend the People application query and infrastructure adapter; expose JSON-safe values through `shared/contracts/people.ts`, the existing server gateway and the current Staff directory composition.

**Required invariants.** Apply predicates/order before pagination; bind signed cursors to normalized query, branch, authorization/configuration revision and final tuple; use normalized Staff code and Employee ID tie-breakers; invalidate cursor on query/scope changes; never broaden Person identity resolution.

**Evidence.** Unit query/cursor validation, PostgreSQL full-set ordering and isolation, browser URL/Back/Forward/filter/sort/focus, desktop/mobile comparison.

**Explicit exclusion.** Teaching and Access filters/sorts remain STF-01B. They require the versioned Academics and Access read contracts in `PROPOSED_LLD.md`; client filtering of a People page is prohibited.

### 2. STF-03A — Authorized Staff Profile

**Supported scope.** Dedicated Employee-context Profile with People employment/history plus typed, independently authorized Academics responsibility and Access summaries.

**Owner path.** People profile facade composes minimal owner ports through `backend/composition`; route and page use the browser-safe Profile DTO. No foreign private-table reads.

**Required invariants.** Recheck current account/token, institution/branch, capability, release/entitlement/activation and exact Employee relationship at the destination and each foreign owner read. Return not-found-shaped denial where required. Do not expose tokens or restricted identity evidence.

**Evidence.** Authorized, revoked and cross-branch reads; unavailable owner projection; desktop/mobile active, non-teaching, ended, no-account and error states; validated return to the directory query.

### 3. STF-04A/B — People and Access recovery

**Supported scope.** Normalize presentation of owner-specific `UNKNOWN`, `FOUND`, `COMMITTED_REFRESH_FAILED`, `STALE_REVIEW_REQUIRED` and `DENIED` outcomes while retaining each owner's existing receipt/CAS authority.

**People first (STF-04A).** New Staff and People management retain the original exact key/payload. For the future PD-STF-02 correction surface, the frozen reference requires both Save actions disabled while either owner operation is unknown, both drafts retained, exact recovery, one history result and GET-only confirmed-refresh recovery.

**Access second (STF-04B).** Apply the same presentation distinctions to membership changes and invitation resend using Access receipts and current target authorization. No universal receipt repository or generic recovery authority.

**Evidence.** Lost response/exact replay, changed-payload conflict, one effect, revoked receipt disclosure, stale current-versus-attempted review, Close/Escape/focus return and confirmed write plus failed refresh issuing GET only.

### 4. STF-05 — Dated teaching eligibility

**Supported scope.** Approved dated Teacher eligibility with half-open bounds and assignment/frozen-session impact review. Access Teacher role remains separate.

**Owner path.** Narrow Academics LLD, forward migration for immutable eligibility periods, People facts through a typed port, Profile handoff through STF-03A.

**Required invariants.** No overlap, one current period, every assignment contained, frozen Attendance history unchanged, expected-version concurrency and exact replay. Existing boolean eligibility remains a compatibility projection during migration.

**Evidence.** Populated migration rehearsal, PostgreSQL overlap/concurrency/rollback, owner negative authorization, assignment impact, browser create/change/end and reference comparison.

### 5. STF-06 — Invitation review and reasoned resend

**Supported scope.** Employee-context pending, failed, expired, consumed and revoked invitation review plus the already-approved bounded administrator reason for resend.

**Owner path.** Keep Access token replacement, lock order, delivery result and receipt ownership. Add the bounded reason to input hash, restricted evidence and audit; Profile link depends on STF-03A.

**Required invariants.** Exact Employee binding, live `user.manage`, prior token invalidation, no token disclosure, honest delivery result, exact replay without resend and generic wrong-account public response.

**Evidence.** Lifecycle/race/provider-result PostgreSQL or functional checks, revoked authority, exact replay, wrong-account journey, desktop/mobile states and GET-only recovery after confirmed replacement.

## Work still gated

- **STF-01B:** engineering owner-read contracts are still required for full-result Teaching/Access selection, ordering, count and projection revisions.
- **STF-02 and STF-03B:** blocked by PD-STF-01 and PD-STF-02 respectively.
- **STF-07:** blocked by PD-STF-03.
- **STF-08:** PD-STF-04/rejoining remains deferred.

## Checkpoint discipline

Implement one slice at a time through existing hexagonal boundaries. Run focused owner/security/PostgreSQL/browser checks for the changed slice, then compare the applicable production screen with the frozen reference. Keep functional verification, visual comparison, human acceptance and deployment readiness separate. Production implementation must not modify this frozen reference; a deliberate reference revision requires a new hash and review checkpoint.
