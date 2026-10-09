# Access & leadership context — DESIGN

Owner: Access + Tenancy. Product proposal, not implementation evidence. Reconcile actual Bible, permission registry, source-owner LLD and schema first.

## LEA-01 — Enter the correct leadership workspace
**Delivery:** phase 1 · First release
**Trigger:** Principal signs in or holds more than one role.
**Actors:** Principal; Access service
**Preconditions:** Active account, leadership assignment and at least one explicit branch grant; required foundations released.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Use school-branded sign-in. | Existing trust and authentication policy applies. |
| 2 | System | Resolve permitted roles and branches from the current account. | Leadership appears only with a grant; no student/finance access inferred. |
| 3 | Principal | Choose Leadership and a permitted branch. | Header shows institution, branch, role and school-local date. |
| 4 | System | Load only enabled and authorized navigation. | A complete attendance-only experience is possible. |

**Inputs and validation**

- **Workspace:** Only server-returned roles.
- **Branch:** Only currently granted branches; never inferred from institution ownership.

**Outcome:** Correct branch-scoped leadership home.
**Authorization:** Principal role is not a wildcard. Protected reads and mutations reauthorize independently.
**Data read:** UserAccount; active role/grant; organization/school state; released/entitled/branch-enabled modules.
**Data written:** Existing session/context selection only; no role creation.

**Alternate and failure paths**

- No leadership grant: show permitted workspace choices, not a broken dashboard.
- Session expiry: clear protected content and return through sign-in.

**Demo acceptance:** Unrelated branch, school-slug forgery and revoked role cannot open the workspace.


## LEA-02 — Switch branches without losing context
**Delivery:** phase 1 · First release
**Trigger:** Leader oversees multiple explicitly granted branches.
**Actors:** Principal or institution leader
**Preconditions:** Destination branch grant exists; any pending command has been reconciled.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open the branch selector. | Each allowed option names institution and branch. |
| 2 | System | Check unsaved work or unresolved commands. | Save/discard prompt for editable draft; unresolved decision must be checked first. |
| 3 | Principal | Confirm destination. | Server re-resolves module and object permissions. |
| 4 | System | Clear prior branch filters and data. | New branch context reloads; a deep link from the previous branch is not silently reused. |

**Inputs and validation**

- **Destination:** A returned branch reference, not an arbitrary UUID.
- **Unfinished work:** Remain, save draft if supported, or discard explicitly.

**Outcome:** New branch view with consistent scope and capabilities.
**Authorization:** Cross-branch aggregate authority is separate from branch switching.
**Data read:** Current branch grants; module availability; pending command references.
**Data written:** Existing context-selection/session state only.

**Alternate and failure paths**

- Destination grant revoked while chooser is open: remain in old authorized context.
- Different timezone: date is recalculated in destination school timezone.

**Demo acceptance:** A stale selection is rejected; no old branch record flashes or leaks.


## LEA-03 — Work under a temporary leadership delegation
**Delivery:** phase 2 · Later · Explicit scope extension
**Trigger:** Approved acting principal or deputy covers a defined period.
**Actors:** Delegator; acting leader; Access owner
**Preconditions:** School-approved delegation policy, eligible delegate and bounded grant management authority.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Delegator | Choose eligible colleague, branch, allowed actions and effective window. | Preview excludes authorities the delegator cannot delegate. |
| 2 | Authorized approver | Confirm purpose and expiry. | Access owner records a dated delegation. |
| 3 | Acting leader | Enter delegated workspace. | Visible Acting role, scope and expiry; no misleading permanent title. |
| 4 | System | Recheck expiry on every protected action. | Expired or revoked authority stops new decisions. |

**Inputs and validation**

- **Delegate:** Active eligible school staff identity.
- **Scope:** Specific actions/branch; no wildcard.
- **Window:** Starts before ends; maximum determined by approved policy.
- **Reason:** Bounded non-sensitive note.

**Outcome:** Time-limited delegated authority with clear accountability.
**Authorization:** Grant issuance and delegated operation are different capabilities; originator identity remains visible.
**Data read:** Access grant/delegation rules; active staff assignment.
**Data written:** Delegation through Access owner, safe audit, approved recipient notification if enabled.

**Alternate and failure paths**

- Self-delegation or privilege expansion: deny.
- Pending work outlives delegation: route to currently authorized owner.

**Demo acceptance:** Delegate cannot approve outside scope or after expiry; existing receipts remain attributable.


## LEA-04 — Handle access changes during a leadership action
**Delivery:** phase 1 · First release
**Trigger:** Role, branch permission or module availability changes while a page is open.
**Actors:** Leader; Access and source owner
**Preconditions:** All protected operations and receipt lookups use current server authorization.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Leader | Open an item from the current screen. | The owner checks live scope before returning its contents. |
| 2 | System | Detect revoked/expired access. | Sensitive content is removed; generic unavailable state is shown. |
| 3 | Leader | Use school support or another permitted context. | No client-side override is offered. |
| 4 | System | Reauthorize any saved status reference later. | Receipt identity is not itself access permission. |

**Inputs and validation**

- **Recovery destination:** Only a currently permitted context or school contact.

**Outcome:** No unauthorized read or write following permission loss.
**Authorization:** Apply to reads, downloads, exports, retries and exact replay, not only navigation.
**Data read:** Current grants/module policy; owner command status under access policy.
**Data written:** Only safe audit of denial; no protected record mutation.

**Alternate and failure paths**

- Outcome of a previous command is unknown: keep a non-sensitive reference, not the hidden item details.
- Disabled module does not erase owner records or obligations.

**Demo acceptance:** A command checked after revocation is denied; denied page does not disclose private details.
