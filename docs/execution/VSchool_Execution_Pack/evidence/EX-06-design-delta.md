# EX-06 design delta

Date: 2026-10-10

- Routes `/admin/users` and `/admin/teachers` retain separate Access membership/invitation and People employee identities. The UI presents their relationship without merging stores or treating contact email as verified identity.
- Existing Access create/invite/resend/role/lifecycle commands and People create/enable-teaching/verified-binding/end-employment commands remain the only mutations. Current account, organization, branch, module and capability checks remain active in their owner use cases and guarded repositories.
- Access mutations retain expected versions, idempotency receipts, current authorization, last-admin protection and atomic evidence. People mutations retain the account → Organization → School lock order, owner-enlisted transaction, version and command key.
- Presentation groups page actions, forms, directory state, delivery failures and per-record actions. Staff profile, portal access, membership status and teacher eligibility remain visibly distinct. Permission, empty, loading, validation, conflict, delivery failure and acknowledged success states use shared components.
- No schema, migration, gateway or backend operation changes are required. Focused verification covers the existing People and Access PostgreSQL mutations and their desktop/mobile administrator journeys, including denied/revoked access and invitation retry where configured.
- Remaining gaps: invitation delivery still uses the development sink; production provider review remains FND-02. Assignment-impact behavior remains owned by ACA-03/ATT-01. Human visual review remains pending.
