# Proposed employment-ending failure contract

Status: proposed under PD-STF-03; no production authority or lifecycle is created by this document.

The first-release recommendation supports school-local **end today** only. An administrator must hold both proposed `staff.manage` and existing `user.manage` authority to initiate or resume. The durable state belongs to a People employment-end intent, not to generic Coordination. Access keeps the membership receipt; People keeps the employment receipt. Neither owner receipt is copied into an ordinary browser DTO.

## Keys and recovery

- `accessCommandKey` belongs to the exact Access `SUSPEND` payload: organization, branch, membership, expected membership version, reason and intent ID.
- `employmentCommandKey` belongs to the exact People `endEmployment` payload: organization, branch, Employee, expected Employee version, branch-local effective date, reason and intent ID.
- A status lookup or exact replay reuses the applicable original owner key. Changed evidence, versions, reason or payload require fresh review and a new key.
- Every lookup rechecks the current account, token version, active membership, both required capabilities and target relationship before returning a protected result.
- No recovery step automatically reinstates access. The operator may only continue the missing forward step after a fresh impact/authority review.

## State and action table

| Durable state | What is committed | What the administrator sees | Available action | Who may resume | Exact key/receipt behavior |
|---|---|---|---|---|---|
| `NOT_STARTED` | Nothing | “No changes made.” Current employment, assignment impact and planned branch-access suspension remain visible. | Resolve any assignment/last-admin block, then confirm the reviewed plan. Cancel leaves both owners unchanged. | Current administrator with both grants | No owner key is replayed. Final confirmation creates the intent and its two scoped keys. |
| `ACCESS_COMMITTED` + People rejection | Access suspension only; employment remains active | “Branch access suspended; employment still active.” The safe People rejection and affected assignment/current fact are shown. It never says offboarding is complete. | Resolve the rejected People condition through its supported owner flow. If the exact employment payload remains valid, resume; changed evidence requires a fresh plan and new People key. | Any current administrator with both grants | Access receipt is reauthorized and retained; `accessCommandKey` is never rerun. Reuse `employmentCommandKey` only for the unchanged payload. |
| `EMPLOYMENT_UNKNOWN` | Access suspension confirmed; People outcome unknown | “Branch access suspended; employment result still being checked.” A second end action is disabled. | Check the original employment result. `FOUND` advances to complete; `UNKNOWN` remains unresolved; denial reveals no receipt. | Any current administrator with both grants | Reuse the exact `employmentCommandKey` for People status/replay. Never generate a replacement key while unknown. Access key/receipt remains read-only evidence. |
| `COMPLETE` | Access suspension and People employment end | “Employment ended and branch access suspended.” Other branches and unrelated account relationships are explicitly unchanged. | Close or view Staff history. Refresh is read-only. | Any currently authorized profile reader; protected receipt details still require command authority | Both exact owner receipts remain immutable. No mutation runs on refresh or close. |
| `RECOVERY_DENIED` | Any of the above, but the current operator lost authority | “You no longer have access to recover this change.” No protected outcome or receipt details are disclosed. | Contact an institution administrator who currently has both grants. There is no automated Coordination item. | Another current administrator with both grants | The new operator resumes the same People intent and original applicable owner keys after full reauthorization. Revoked actor receives no protected receipt. |

## Additional terminal blocks

- Last-administrator protection blocks Access suspension before anything commits.
- Current/future assignment or frozen Attendance impact blocks the People step without rewriting history.
- If the operator lacks either required capability at preview or final confirmation, the operation does not start.
- A technical failure with a provably uncommitted owner command remains at its prior durable state. An unknown response is never converted into a rejection.

The local prototype includes all five table states as reviewer-selectable simulations. It is not production verification and does not establish approval of PD-STF-03.
