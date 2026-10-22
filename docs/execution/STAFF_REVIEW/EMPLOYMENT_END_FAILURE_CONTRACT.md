# Proposed employment-ending failure contract

Status: proposed under PD-STF-03; no production authority or lifecycle is created by this document.

The first-release recommendation supports school-local **end today** only. When a relevant active membership requires suspension, an administrator must hold both proposed `staff.manage` and existing `user.manage` authority to initiate or resume. When Access authoritatively reports that no relevant membership exists, the Access step is `NOT_REQUIRED` and `staff.manage` is the required command authority. The durable state belongs to a People employment-end intent, not to generic Coordination. Access keeps any membership receipt; People keeps the employment receipt. Neither owner receipt is copied into an ordinary browser DTO.

## Keys, receipts and recovery

- `accessCommandKey` belongs to the exact Access `SUSPEND` payload: organization, branch, membership, expected membership version, reason and intent ID.
- `employmentCommandKey` belongs to the exact People `endEmployment` payload: organization, branch, Employee, expected Employee version, branch-local effective date, reason and intent ID.
- A status lookup or exact replay reuses the applicable original owner key. Changed target, evidence, version, reason, effective date or payload requires fresh review and a new key.
- Every lookup rechecks current account, token version, active membership, the capabilities required by the intent's Access disposition and the target relationship before returning a protected result.
- No recovery step automatically reinstates access. The operator may continue only the missing forward step after a fresh impact and authority review.
- An Access outcome must be confirmed before People employment ending begins. `UNKNOWN` is not a rejection and is never treated as proof that nothing committed.

## State and action table

| Durable state | What is committed | What the administrator sees | Available action | Who may resume | Exact key/receipt behavior |
|---|---|---|---|---|---|
| A — `NOT_STARTED` | Nothing | “No changes made.” Current employment, assignment impact and planned branch-access disposition remain visible. | Resolve known assignment or last-administrator blocks, then create a reviewed intent. Cancel changes nothing. | Current administrator with both grants | No key is replayed. Confirmation creates the intent and exact owner keys. |
| B — `ACCESS_UNKNOWN` | Access result is unknown; People has not started | “Branch-access result still being checked.” Employment remains shown as active and its action is disabled. | Check/replay the original Access operation. `FOUND` advances to `ACCESS_COMMITTED`; `UNKNOWN` remains here; a proven safe failure returns to a newly reviewed `NOT_STARTED` plan. | Any current administrator with both grants | Reuse the exact Access payload, target, expected membership version and `accessCommandKey`. Do not create another key or invoke People while unresolved. |
| C — `ACCESS_COMMITTED` + People rejection | Access suspension confirmed; employment remains active | “Branch access suspended; employment still active.” The safe People rejection and affected assignment/current fact are shown. It never says completion succeeded. | Resolve the People-owned blocker. Resume only if the exact employment payload remains valid; changed evidence requires a fresh reviewed People intent/key while retaining the Access receipt. | Any current administrator with both grants | Access receipt is reauthorized and retained; Access is not rerun. The unchanged People payload may reuse `employmentCommandKey`. |
| D — `EMPLOYMENT_UNKNOWN` | Access suspension confirmed; People result unknown | “Branch access suspended; employment result still being checked.” A second end action is disabled. | Check/replay the original People result. `FOUND` advances to complete; `UNKNOWN` remains unresolved; denial reveals no protected receipt. | Any current administrator with both grants | Reuse the exact `employmentCommandKey`. Never generate a replacement while unknown. Access key/receipt remains read-only evidence. |
| E — `COMPLETE` | All required steps confirmed | With a relevant membership: “Employment ended and branch access suspended.” Without one: “Employment ended; no branch access change was needed.” | Close or view Staff history. Refresh is read-only. | Any currently authorized profile reader; protected receipt details still require command authority | Existing owner receipts remain immutable. No mutation runs on refresh or close. No Access receipt exists when suspension was not required. |
| F — `RECOVERY_DENIED` | Any prior durable state, but current operator lost authority | “You no longer have access to recover this change.” Protected outcome and receipt details are withheld. | A currently authorized institution administrator with the grants required by the stored Access disposition may resume the same People intent. No Coordination item is created. | Another current administrator with both grants when suspension is required, or `staff.manage` when Access is `NOT_REQUIRED` | The subsequent operator uses the same intent and original unresolved key after full reauthorization. The revoked actor receives no protected receipt. |

## No relevant active membership

If Access authoritatively reports no relevant active branch membership, the reviewed intent records `accessDisposition=NOT_REQUIRED`; it does not fabricate an Access command, key or receipt. People employment ending may proceed after the same assignment and authority checks. Completion copy states only that employment ended and that no active branch membership needed changing. Other branch/account relationships remain unchanged.

## Known blockers and races

- A known current/future assignment or frozen Attendance impact blocks before any owner mutation. The UI names the safe affected assignment and links to its authorized owner screen.
- Last-administrator protection blocks before any owner mutation.
- A blocker discovered after Access commits is state C, not the normal assignment-blocked path and not a complete outcome.
- Employment ending never rewrites assignment or Attendance history.
- A technical failure with a provably uncommitted owner command remains at its prior durable state.

## Crossing branch-local midnight

The reviewed effective date is part of the immutable People payload and plan hash. Crossing branch-local midnight does not silently replace it under the existing `employmentCommandKey`. Resolve any Access or People `UNKNOWN` outcome first. If nothing committed and the original date is no longer permitted, abandon that uncommitted plan and create a newly reviewed intent with a new date and new keys. If Access already committed, retain that evidence and require a fresh People review/key for a changed effective date; never rerun or compensate the Access step automatically.

The local prototype includes all six states, the known blockers and the no-membership case as reviewer-labelled simulations. It is not production verification and does not establish approval of PD-STF-03.
