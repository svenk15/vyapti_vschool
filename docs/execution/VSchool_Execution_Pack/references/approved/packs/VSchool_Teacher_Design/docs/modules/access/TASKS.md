# Account & access — Proposed teacher tasks

Status: design handoff, not a replacement for existing repository tasks. Each slice must be demoable. Map the TEA reference to the current execution index before implementation. Never duplicate or retire current tasks implicitly.

Prerequisites: owning module released and enabled; specific permission approved; schema/API/transaction LLD reconciled. Follow earlier phase dependencies; resolve any explicit current acceptance gates.


## TEA-01 — Sign in to the school workspace

- [ ] Reconcile this contract, phase 1, capability `active account + branch membership` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: School entry → Authorized workspace.
- [ ] Prove invariant: Resolve permissions server-side. A Teacher role alone does not establish employee identity, dated eligibility or class assignment.
- [ ] Prove recovery: Generic credential rejection; revoked/suspended access exposes no roster. Safe return URLs only.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: My Teaching Day opens in the authorized branch.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-02 — Activate or recover a teacher account

- [ ] Reconcile this contract, phase 1, capability `Access activation/recovery policy` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Account help → Next steps.
- [ ] Prove invariant: Existing operator-issued and email-issued paths coexist. A stricter active institution can prevent an account-wide email reset at issue and consumption.
- [ ] Prove recovery: Expired/revoked/consumed/failed-delivery tokens fail safely. Resend and compromised-inbox recovery use their documented owner workflows.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: A generic acknowledgement explains the permitted next step.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-03 — Switch branch or leave the workspace

- [ ] Reconcile this contract, phase 1, capability `active target-branch grant / own session` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: Destination → Unsaved work.
- [ ] Prove invariant: Warn before discarding input; clear old-branch protected state/caches. A saved or submitted record belongs to its original branch.
- [ ] Prove recovery: Permission lost during switch shows a safe destination. Unknown submission must be resolved before the draft is discarded.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: Context switches after authorization, or the current session ends.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed. 

## TEA-04 — Review my account and sessions

- [ ] Reconcile this contract, phase 1, capability `self.read; self-service session actions must match existing Access contract` and current task dependencies.
- [ ] Complete the owning physical LLD: records/joins, DTO validation, scope, transaction/version/replay and audit exclusions.
- [ ] Implement the shared-component screen and the owner use-case integration for: My account → Account action.
- [ ] Prove invariant: No self-service role escalation, arbitrary branch addition or global identity editing. Listing/revoking other own sessions is an extension unless the repository already supports it.
- [ ] Prove recovery: A stale or expired session returns to school sign-in; never disclose token material.
- [ ] Extend deterministic local demo seed for this journey; preserve existing data.
- [ ] Run targeted behavior, real-DB and browser checks appropriate to this slice.
- [ ] Bring up/reuse the demo server and show: The teacher understands their identity, access and permitted account actions.
- [ ] Record exact source, evidence, demo steps and outstanding review in the actual CURRENT_STATE.

**Checkpoint:** demoable and verified by evidence; human review stays PENDING until performed.
