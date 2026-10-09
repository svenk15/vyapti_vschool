# Communication & family escalations — TASKS

Proposed demo-able slices. Map LEA-* workflow IDs to actual task IDs and owner prerequisites. Do not override real dependency/review gates. Each slice extends shared components and fictional idempotent pnpm demo:seed; no teardown work now.

## [ ] LEA-32 — Prepare a targeted school notice
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Owner release and exact capability contract must exist.
Prerequisites: Draft/publish grants separate; recipient-purpose model active.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Communication draft/approval/publication via owner.
4. Enforce invariant: Broadcast authority is separate from reading private family conversations.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: No message is sent merely by selecting audience or saving a draft.
Recovery acceptance: Audience changes before send: regenerate preview. Not authorized to publish: draft/approval handoff, not hidden direct send.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-33 — Approve or return a proposed communication
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Owner release and exact capability contract must exist.
Prerequisites: Assigned reviewer, permitted content/audience and publication policy.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Communication approval state/receipt; publication follows owner contract.
4. Enforce invariant: Only current delegated publishing/approval authority can act.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Approval of version 2 cannot publish unseen version 3.
Recovery acceptance: Author edits during approval: conflict, re-review. Self-approval prohibited by school rule: independent reviewer.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-34 — Follow up delivery or acknowledgement gaps
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Owner release and exact capability contract must exist.
Prerequisites: Purpose-scoped delivery/acknowledgement projection; manual resend policy.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Approved manual reminder/send intent and safe outcomes.
4. Enforce invariant: No visibility into another guardian’s private relationship restrictions.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Delivery accepted does not increment acknowledgement count.
Recovery acceptance: No acknowledgement requirement: do not manufacture an engagement deficit. Revoked guardian purpose: stop future contact under that purpose.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-35 — Handle an escalated family concern or complaint
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 2. Owner release and exact capability contract must exist.
Prerequisites: Explicit case purpose and independent route for conflicts.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Case-owner coordination and public outcome events; controlled communication.
4. Enforce invariant: Leadership hierarchy does not grant all case content.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: General home, search, export and audit omit restricted complaint narrative.
Recovery acceptance: Complaint concerns principal: route independently without revealing narrative to implicated user. Another guardian lacks purpose: not added automatically. Urgent safety issue: invoke designated school protocol, not ordinary queue promises.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.

## [ ] LEA-36 — Run a family or staff meeting with follow-up actions
Status: PROPOSED / CODE NOT_ASSESSED. Owner phase: 3. Scope extension must be allocated before coding.
Prerequisites: Meeting scheduling scope approved; participant permissions and availability policy.
1. Reconcile DESIGN entry, metric (if any), source API, physical data model and actual authorization.
2. Implement read-only evidence and required state screens with shared UX.
3. Add only the owner-authorized command: Meeting owner and coordination records only.
4. Enforce invariant: Meeting membership does not transfer access to full student/HR/case records.
5. Seed the success and at least one stated failure case without replacing existing testing data.
6. Verify meaningful unit/domain, dedicated PostgreSQL and browser checks appropriate to the changed risk; record real results.
Demo: Sharing the summary excludes private staff/case notes.
Recovery acceptance: Declined invitation does not mean meeting occurred. A participant loses access: remove future visibility and recheck sharing.
Checkpoint: record source commit, routes, seed refs, migration/test evidence, residual limitations and next eligible task in CURRENT_STATE.md. Human review remains pending until actually performed.
