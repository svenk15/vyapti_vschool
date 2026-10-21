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

- **Directory:** name/code semantics, filter combinations, deterministic duplicate-name ordering, tampered/query-mismatched cursors, Back/Forward and branch switch clearing.
- **Existing Person:** exact ID only, bounded DTO, attester required, same-branch Employee conflict, cross-organization denial, concurrent creation leaves one Employee.
- **Profile/corrections:** active/ended/non-teaching/no-account; separate Person/Employee versions; code uniqueness; contact correction does not change login; unsafe date change blocks without rewriting history.
- **Eligibility:** valid bounds, no overlap, every assignment contained, frozen/session impact, concurrent change, Access role independence.
- **Access:** email/hybrid/operator paths, pending/failed/expired/consumed/revoked, reasoned resend replaces old token, last-admin, immediate next-request denial, provider result remains honest.
- **End employment:** branch date today, assignment impact, Access disposition, no false complete, replay/reconcile partial steps, global/other-branch/family/student access preserved.
- **Rejoin:** immutable prior episode, non-overlap, no automatic membership/invite/eligibility/assignment restoration.

## Interaction/visual cases

- Inspect matching states at 1440×1000, 900px width, 390×844 and 360px width.
- Inspect directory, profile and correction drawer in Forest, Amethyst, Linen and Porcelain with identical geometry.
- Tab order follows visible order; Enter applies search; drawer/dialog Escape obeys the guarded-close contract; focus returns to the invoker.
- Mobile navigation and drawers remain scrollable above safe areas; no root horizontal overflow.
- Long fictional names/codes, translated-length labels, validation and recovery feedback expand without clipping.
- Reference comparisons are labelled exact only where an approved exact state exists; new profile/recovery states are documented extensions.

## Status dimensions

Track separately for every task: **functional/security**, **interaction**, **visual comparison**, **verification**, **human acceptance**, and **deployment readiness**. Prototype behavior is never functional production evidence.
