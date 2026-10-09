# School access — TASKS
Proposed tasks; reconcile with the actual execution index. None is marked implemented. Read DESIGN.md, the current Bible/ADRs and actual schema first. Preserve existing unrelated work and dependency/human-release gates.

Owner readiness: Account-enabled school policy; real trust-mode LLD; verifier workflow; account-wide recovery enumeration.

## Definition of done per slice
- Owner LLD and affected physical table contracts are reconciled before code.
- Shared tokens/components used; parity with desktop/mobile reference reviewed.
- Server authorization, scope and state/version invariants enforced and meaningful negative tests pass.
- Fictional, incremental, idempotent data extends the existing pnpm demo:seed command. Preserve existing testing records/credentials; do not introduce teardown now.
- Focused tests plus required repository gates pass. No redundant blanket reruns without a changed risk.
- Demo server starts from the tested source; record URL/route, commit, commands, seed identifiers and evidence.
- Update per-module CURRENT_STATE.md with what is implemented, verified, pending and next eligible task; never infer human acceptance from automated checks.

## [ ] STW-01 — Find the correct school sign-in
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-F01 shared authorization contract; Access + Students owner contracts. 
**Deliverable:** Enter the school-issued workspace.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: A public school slug is branding, never authorization.
4. Implement failure/recovery: Invalid school link offers school contact; invalid credentials remain generic.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Published BrandProfile; UserAccount; verified StudentAccountLink; active Enrollment. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Check school name and branch; use the school-issued sign-in link. Then Use the student account assigned by school; no account enumeration or public pupil search. Verify: Own permitted enrollment contexts. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-02 — Activate an issued student account
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-01; Access + Students owner contracts. 
**Deliverable:** Accept the exact school-verified account binding.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Mailbox possession does not establish pupil identity; a guardian token cannot activate student authority.
4. Implement failure/recovery: Expired, wrong-account or failed-delivery token routes to school help; no self-link.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Access invitation + StudentAccountLink + non-sensitive verification reference. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** See intended school and a safe account hint; do not select another child. Then Authenticate intended identity and accept a valid, unrevoked invitation under school policy. Verify: Account link active with school-defined capabilities. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-03 — Recover access
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-01; Access + Students owner contracts. 
**Deliverable:** Regain account access using the permitted policy.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Preserve OPERATOR_CLI/HYBRID/EMAIL and stricter cross-institution recovery checks.
4. Implement failure/recovery: No guarantee that an email was sent; delivery failure and operator-assisted routes remain explicit.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Access recovery tokens, organization trust modes, active identity memberships. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Submit school identifier and permitted account identifier through a generic response. Then Follow account-wide trust policy; use school/operator assistance if required. Verify: Access restored and sessions handled by existing recovery policy. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-04 — Switch enrollment context
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-01, STW-02; Access + Students owner contracts. 
**Deliverable:** Move safely between own authorized school contexts.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Never keep one child identity with another branch; no independent arbitrary branch selector.
4. Implement failure/recovery: Revoked or stale destination becomes unavailable; clear protected cached content.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** StudentAccountLink + Enrollment + module entitlements + course assignment. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** List only active verified enrollments with institution, branch and academic year. Then Save/discard a changed draft; unresolved submission must be reconciled first. Verify: Destination context and capabilities are reloaded together. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.

## [ ] STW-05 — Handle expired or withdrawn access
Status: PROPOSED / NOT_ASSESSED. Dependencies: STW-01; Access + Students owner contracts. 
**Deliverable:** Understand why a workspace is unavailable.
**Implementation instructions**
1. Confirm the corresponding DESIGN.md entry and owner use case/schema exist; document unresolved decisions before implementing irreversible assumptions.
2. Build the shared screen and exact scoped read contract; add the owner command only if this journey mutates state.
3. Enforce: Historical access does not authorize current reads, downloads or status lookup.
4. Implement failure/recovery: Unknown submissions keep a reference; do not claim a failure or discard evidence.
5. Extend fictional seed for this success and failure branch; attach no real pupil data.
**Persistence:** Session + account status + current account link/enrollment; command receipt. Use the module's documented joins and atomic/versioned write contract.
**Unit checks:** valid state; disallowed actor/state; boundary value/version. Avoid tests that only mirror component markup.
**Real-PostgreSQL checks:** own/cross-student and cross-institution scope; current grant removal; relevant composite FK/version or replay invariant. Read-only tasks prove no writes.
**E2E demo:** Clear protected content and explain sign-in or school help is needed. Then Reauthenticate and recheck current assignment before recovering work. Verify: Authorized continuation or safe support route. Repeat on mobile and exercise the recovery branch.
**Evidence:** route/seed/source, command results and residual limitations in CURRENT_STATE.md. Leave human review PENDING until actually performed.
