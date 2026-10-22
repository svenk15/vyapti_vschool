# Staff product-decision register

Status date: 22 October 2026 (Asia/Kolkata)

This register separates existing approved rules from recommended rules that still require product approval. The prototype demonstrates recommendations without granting production authority.

## Settled rules reused without reopening

| Rule | Authority | Consequence |
|---|---|---|
| Existing-Person reuse is an explicit selection of one organization-local Person ID; name, email and fuzzy similarity never merge identities. | `docs/VSchool_Bible.md` §5 and approved Staff SA-13 invariant | Candidate reads and writes remain organization scoped and transactional. |
| Staff access is anchored to an exact active Employee and separately verified Account/Person relationship. | Access DESIGN; SA-COMP-13 evidence | Creating an Employee does not create access. Contact email is not login authority. |
| Teacher eligibility is date bounded and must review assignment impact. | Approved SA-16 Staff contract | An Access role does not establish teaching eligibility. |
| Invitation resend records a bounded administrator reason, replaces the token and reports delivery honestly. | Approved SA-15 contract and current Access resend lifecycle | Resend cannot revive an old token or claim delivery before provider confirmation. |
| Availability and exact-occurrence cover retain their existing explicit grants and owner checks. | F07-A/F07-B evidence | They are conditional handoffs, not general Staff authority. |

## Decisions still required

### PD-STF-01 — Existing-Person attestation and restricted evidence

**Exact question.** Which actor may attest that a selected organization Person is the same human being as the new branch Employee, which minimum fields may they see, and what restricted evidence must be retained?

**Relevant contract.** The Bible already forbids fuzzy/email/name matching and requires an exact selected Person ID rechecked inside the write transaction. `AccountPersonBinding` evidence is Access-owned and cannot be repurposed as a People linkage decision.

**Recommendation.** Require `class.manage` plus a separately configured organization identity-attester grant. Candidate lookup accepts an exact Person ID only and returns display name, masked contact reference when present, and an organization-issued non-sensitive verification reference. Final confirmation requires the Employee facts, a bounded reason and verification reference. People stores a restricted immutable linkage-evidence row containing identifiers, attester, purpose, reason, verification reference and timestamp; ordinary directory/profile DTOs expose only an evidence reference and outcome.

**Consequences.** Prevents broad organization Person browsing and makes the linkage accountable. It requires one new restricted evidence table and an attester-grant port; ordinary School administrators without the grant can create a new Person but cannot reuse an existing one.

**Precise approval needed.** Approve the new organization-scoped `person.identity_attest` capability as an explicit grant, the bounded candidate fields above, and People retention of the immutable restricted linkage-evidence row. Approval must state that `class.manage` or the School Administrator role alone does not confer attestation.

**Blocked workflows/tasks.** SA-13-E / STF-02 production implementation and exact existing-Person mode in Add staff.

### PD-STF-02 — Mutable Staff facts and correction authority

**Exact question.** Which Person and Employee facts may be corrected, by whom, with what reason/history, and what constraints apply after dated teaching or Attendance history exists?

**Relevant contract.** People owns Person and Employee; Access owns login identity; Academics owns Teacher/assignments. Current `updateCategory` changes only descriptive Employee category. Person name revision history exists, but it is not yet a general Staff correction authority.

**Recommendation.** Allow an explicitly granted Staff-record manager to correct Person legal/preferred display name and contact email, and Employee staff code/category, using separate expected versions and commands. Require a bounded reason. Retain immutable owner-specific revisions; prior staff codes remain historical and are not reusable in the same branch. Contact email never changes the Access login. Initial employment start may be corrected only before any assignment, timetable, Attendance or employment-end evidence; otherwise require a separately designed historical correction case.

**Consequences.** Produces honest owner histories and avoids cross-owner side effects. A combined drawer may retain drafts across sections, but each Save executes only the selected owner command. Shared Person corrections can affect another branch’s display, so they require organization-level attestation rather than branch-only authority.

**Precise approval needed.** Approve the exact mutable field lists, the organization-scoped `person.correct` grant for shared Person facts, the branch-scoped `staff.manage` grant for Employee facts, mandatory bounded reasons, immutable owner-specific revision visibility, and the rule that dated employment start becomes non-correctable after dependent evidence exists.

**Blocked workflows/tasks.** STF-PRO-02 / STF-03 Person corrections, Employee corrections beyond category, and start-date correction.

### PD-STF-03 — Employment end and Access disposition

**Exact question.** Must first-release end-employment completion suspend active branch access, and what happens when the actor can end employment but lacks Access authority?

**Relevant contract.** Current People `endEmployment` ends today, disables Teacher eligibility and checks assignment impact. Access membership has independent last-admin/version/role guards. No existing contract authorizes People to mutate Access tables.

**Recommendation.** Initial release supports branch-local **end today** only. The branch-local date is captured when the administrator confirms and remains the operation's effective date even if recovery crosses midnight. Confirmation shows employment, assignment/Teacher impact and current Access state. When a relevant branch membership exists, the initiating actor must currently hold both `staff.manage` and `user.manage`; otherwise the action is unavailable and the screen directs the operator to an institution administrator with both grants. When no relevant membership exists, Access is `NOT_REQUIRED`: no Access command key or receipt is created and `staff.manage` is sufficient for the People step. No Coordination item is created. The reviewed flow creates a People-owned employment-end intent with a People key and, only when needed, a separate Access key. It suspends the relevant membership first, then ends employment. An unknown Access outcome must be resolved with that original Access key before the People command can begin. Any currently authorized administrator with the required grants may resume that exact intent using its stored owner keys. Last-admin protection always wins. Never report offboarding complete while relevant branch access remains active, and never restore access automatically as compensation.

**Consequences.** A partial state can legitimately contain suspended branch access while employment remains active or unresolved. The People-owned intent makes this visible and resumable without inventing general Coordination authority. The flow is not described as atomic. Global account, other branches, and independent Parent/Student relationships remain intact.

**Precise approval needed.** Approve dual authority when a relevant membership exists; the no-membership `NOT_REQUIRED` exception; Access-first sequencing; immutable captured branch-local effective date across midnight; the People-owned intent fields/states in `PROPOSED_LLD.md`; the no-compensation rule; and the exact administrator-facing states in `EMPLOYMENT_END_FAILURE_CONTRACT.md`.

**Blocked workflows/tasks.** STF-EMP-01 / STF-07 complete end-employment experience and offboarding completion wording.

### PD-STF-04 — Rejoining and employment episodes

**Exact question.** How is a previously ended Employee represented when the same Person returns to the same branch?

**Relevant contract.** The current Employee table has one `employedFrom/employedTo/status` interval and a unique branch/Person relationship. Clearing `employedTo` would rewrite history; creating another Person violates identity rules.

**Recommendation.** Preserve the Person and branch Employee identity, add immutable employment episodes with non-overlapping half-open intervals, and create a new active episode through an expected-version command. Rejoin never restores branch membership, roles, invitations, Teacher eligibility or assignments; each is reviewed and re-established independently.

**Consequences.** Requires a forward migration, a populated backfill from current Employee dates, interval constraints, profile projection changes and owner concurrency tests. It is a higher-cost first-release enhancement; ending employment remains usable without it.

**Blocked workflows/tasks.** STF-EMP-02 / STF-08 rejoin flow and complete employment history. No current mandatory active-employment operation depends on it.

**Release position.** Deferred. PD-STF-04 does not block the mandatory first-release directory, add, profile, correction, teaching, access or end-today journey.

## Explicit exclusions

- Mistaken Person-link correction, Person merge and identity split are out of this package.
- Leave approval, payroll, recruitment and appraisal remain advanced People Operations work.
- No retained-access exception is proposed for an ended Employee. Such a lifecycle would need explicit purpose, authority, duration and review rules.
