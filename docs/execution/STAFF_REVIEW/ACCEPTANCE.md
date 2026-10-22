# Staff slice acceptance cases

## Common functional/security cases

1. Current authorized branch facts load; foreign branch and revoked membership return safe denial.
2. Release, entitlement, activation and capability are rechecked at the destination and owner operation.
3. Successful writes persist after reload and append the expected owner receipt/audit/history once.
4. Lost response uses the original exact payload/key; replay returns one original result and creates no duplicate effect.
5. Changed input with the same key conflicts.
6. Receipt/status lookup rechecks current authority; revoked authority cannot read the protected prior result.
7. Stale version shows safe current versus attempted facts; retry needs a fresh version and a new reviewed intent.
8. Confirmed write plus failed refresh remains confirmed; recovery performs GET only and Close/Cancel/Escape never says unresolved.
9. Saving one correction section preserves unsaved safe values in another section.
10. No logs, ordinary DTOs or screenshots expose credentials, tokens, raw restricted evidence or real personal data.

## Journey-specific cases

- **Directory:** name/code semantics; full-authorized-set filter combinations; deterministic duplicate-name/state ordering; null/unknown handling; tampered, query-mismatched and owner-revision-stale cursors; Back/Forward and branch switch clearing. A page-local Teaching/Access sort cannot pass.
- **Existing Person:** exact ID only, bounded DTO, attester required, same-branch Employee conflict, cross-organization denial, concurrent creation leaves one Employee.
- **Profile/corrections:** active/ended/non-teaching/no-account; separate Person/Employee versions; code uniqueness; contact correction does not change login; unsafe date change blocks without rewriting history. For both Person and Employee operations, freeze only the submitted section's payload/version/key; disable both Save actions while either operation is unknown while leaving both drafts editable; retain the pending operation and drafts across Close/reopen; recover the exact operation; then permit the other owner save; append one history entry per operation across repeated recovery; show current and attempted stale facts separately; and use GET only after a confirmed save whose refresh failed.
- **Eligibility:** valid bounds, no overlap, every assignment contained, frozen/session impact, concurrent change, Access role independence.
- **Access:** email/hybrid/operator paths, pending/failed/expired/consumed/revoked, reasoned resend replaces old token, last-admin, immediate next-request denial, provider result remains honest.
- **End employment:** every row in `EMPLOYMENT_END_FAILURE_CONTRACT.md`; branch-local date captured once and retained across midnight; assignment and last-admin blocks before mutation; Access-unknown recovery uses its original key and prevents People from starting; Access-confirmed/People-rejected and People-unknown remain resumable; no relevant membership means no Access key or receipt; no false complete; revoked recovery denial; no automatic Access compensation; global/other-branch/family/student access preserved.
- **Rejoin:** immutable prior episode, non-overlap, no automatic membership/invite/eligibility/assignment restoration.

## Interaction/visual cases

- Inspect matching states at 1440×1000, 900×1000, 390×844 and 360×800.
- Inspect directory, profile and correction drawer in Forest, Amethyst, Linen and Porcelain with identical geometry.
- Tab order follows visible order; Enter applies search; drawer/dialog Escape obeys the guarded-close contract; focus returns to the invoker.
- Mobile navigation and drawers remain scrollable above safe areas; no root horizontal overflow.
- Long fictional names/codes, translated-length labels, validation and recovery feedback expand without clipping.
- Reference comparisons are labelled exact only where an approved exact state exists; new profile/recovery states are documented extensions.

## Status dimensions

Track separately for every task: **functional/security**, **interaction**, **visual comparison**, **verification**, **human acceptance**, and **deployment readiness**. Prototype behavior is never functional production evidence.
