# First release: attendance oversight that reaches a verified outcome
Build one narrow leadership experience using released source owners. The read-only slice can ship independently; coordination requires its own explicit release and authority.

## Worked example — fictional branch
At 11:00 IST, Greenwood / Whitefield has 24 sessions scheduled today. Fifteen registers are due by the configured cutoff policy. Twelve have an authoritative submission; three are awaiting submission. The other nine are not due yet. The UI shows **12 of 15 due registers received; 3 awaiting**. It does not say 3 pupils are absent.

1. **My school today.** Principal sees current branch, date, 11:00 as-of time and the three due registers. Data coverage and freshness are shown separately.
2. **Attendance oversight.** Open Awaiting submission. Rows name exact class, subject, session time, expected teacher, due status and existing follow-up, with a compact explicit View action.
3. **Session evidence.** Inspect Grade 6 A Mathematics. A current source read confirms Awaiting submission. The principal has oversight, not a Mark attendance shortcut.
4. **Follow-up review.** Choose an eligible attendance coordinator, due time and a short operational note. Show the existing responsible teacher and explain that assigning a follow-up does not change teaching assignment.
5. **Confirm once.** Recheck source state, current permissions and duplicate-active-follow-up key. Create one coordination item and one intent receipt. Show Assigned; message delivery is a separate state. If teacher submitted meanwhile, show source receipt and skip obsolete creation.
6. **Owner acts.** Coordinator follows school process. The eligible teacher submits through the existing teacher attendance journey. Leadership never impersonates them.
7. **Evidence ready.** The follow-up displays Source submission received / Ready to verify. Coverage now shows 13 of 15 due registers received. The follow-up has not silently become verified closed.
8. **Verify resolution.** Authorized verifier opens exact receipt, checks current source and expected follow-up version, then closes with evidence. Show verifier, time and source revision.
9. **Later change.** A valid invalidation or owner correction can reopen the follow-up through an explicit authorized reason. Previous closure history remains.

## Minimum screens
My school today; Attendance oversight; Session detail/evidence; Follow-up creation and review; Outcome/status; My follow-ups; Verify resolution; History; context chooser; unavailable/loading/empty/error states. Same shared navigation/toolbar/table/dialog/receipt components as other personas.

## Demo variants
| Variant | Required result |
|---|---|
| Source submitted before confirmation | No obsolete follow-up; current source shown |
| Double click or exact retry | Same follow-up/receipt, no duplicate notification |
| Lost acknowledgement | Confirmation pending; authorized status lookup before retry |
| Existing active follow-up | Open existing; reassignment is separate |
| Assignee becomes ineligible | Reject assignment; preserve entered note |
| Source data stale/unavailable | Do not claim resolved; show source cutoff/gap |
| Principal loses grant | No protected read/command/export |
| Assignee claims done, source still missing | Evidence ready claim cannot pass verification |
| Reassignment races with closure | Version conflict; fresh review required |
| No registers due yet | No denominator percentage; no fabricated all-complete state |

## Proposed task slices
| ID | Work | Dependency | Demo |
|---|---|---|---|
| LDR-01 | Reconcile leadership grants + scoped context + shared shell | Existing Access/Tenancy/DS; actual gates checked | Permitted branch opens; another branch denied |
| LDR-02 | Due-register metric and evidence list | LDR-01 + Attendance read contracts | 12 of 15 due, exact 3 missing; no due case |
| LDR-03 | Session evidence and source freshness | LDR-02 | Source update removes stale missing state |
| LDR-04 | Single follow-up with eligible assignee and intent | LDR-03 + approved Coordination extension | One item; duplicate/changed-source branches |
| LDR-05 | Lost-outcome recovery and reassignment | LDR-04 | Check status, same receipt, versioned transfer |
| LDR-06 | Verify/close/reopen with source evidence | LDR-04/05 + source-owner proof | Submission received, explicit verified closure |
| LDR-07 | Scoped history/export + accessibility integration | LDR-06 + export grant if enabled | Explain exact source; keyboard/mobile error recovery |

Do not implement bulk follow-up, AI, complex cross-branch comparisons or generic approvals before this slice is solid. This is a sequencing decision, not a promise of a 24-hour production delivery.

## Test/seed checkpoint
Extend existing pnpm demo:seed with fictional principal, coordinator, eligible teacher, two authorized/unauthorized branch contexts, due/not-due/cancelled sessions, missing/received records, duplicate follow-up and stale-version fixture. Seed incrementally and idempotently; preserve existing testing data/credentials. No teardown addition now.

Use focused TypeScript domain tests, real PostgreSQL scope/transaction tests and real browser paths in the actual repository. This pack has specification/explorer checks only. Preserve current TEN-03/release gates and never claim RLS enforcement from this design.
