# Account & preferences — DESIGN

Owner: Access + Preferences. Product proposal, not implementation evidence. Reconcile actual Bible, permission registry, source-owner LLD and schema first.

## LEA-46 — Manage sessions, preferences and school support
**Delivery:** phase 1 · First release
**Trigger:** Leader signs out, checks session security or changes personal preferences.
**Actors:** Principal; authorized Access + Preferences owner
**Preconditions:** Existing Access/session policy and own-account identity.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open My account. | Show own sessions and allowed preferences. |
| 2 | Principal | Change an approved preference or revoke a session. | Identity/contact changes follow existing verification, not a direct profile write. |
| 3 | Principal | Confirm sensitive action if policy requires. | Server acknowledges revocation before claiming success. |
| 4 | System / owner | Sign out from the separate session action. | Clear protected context and local drafts under documented policy. |

**Inputs and validation**

- **Preferences:** Own allowed keys; required security notices labelled.
- **Session:** Own session reference only.
- **Support:** School-approved contact route.

**Outcome:** Controlled personal account state.
**Authorization:** Own-account management grants no staff-user administration.
**Data read:** Own sessions/preferences and safe support configuration.
**Data written:** Access owner revocation/preference/verified-change workflow.

**Alternate and failure paths**

- Unsaved draft: save/discard before leaving; unknown command: preserve safe reference and reconcile.
- Failed revoke cannot say session ended.

**Demo acceptance:** Sign out is visually separate from name/role and protects shared-device data.
