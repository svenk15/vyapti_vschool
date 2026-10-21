# Proposed Staff execution tasks

These tasks are dependency ordered. “Ready” means existing product semantics are sufficient; it does not pre-authorize production work beyond a later implementation instruction.

| Task | Outcome | Dependency | Decision status | Required evidence |
|---|---|---|---|---|
| STF-01 | URL-backed directory search attributes, filters, sort and safe pagination | Current People directory | Ready technical design | Unit query/cursor; PostgreSQL scope/order; browser Back/Forward/drawers; matched visual states |
| STF-04A | People create/manage exact-key, stale and committed-refresh recovery | Existing People receipts/CAS | Ready technical design | Lost response, revoked replay, GET-only refresh recovery, close/Escape |
| STF-04B | Access change/resend recovery normalization | STF-04A recipe; existing Access receipts | Ready technical design | Existing Access security evidence plus browser states |
| STF-02 | Exact existing-Person → Employee | PD-STF-01 | Product decision required | PostgreSQL scope/duplicate/race/rollback/replay; browser candidate/confirm/recovery |
| STF-03A | Scoped Staff profile composition | Existing typed owner reads | Ready technical design | Owner-port auth; revoked/foreign denial; desktop/mobile/profile states |
| STF-03B | Person/Employee corrections and history | STF-03A + PD-STF-02 | Product decision required | Separate versions/receipts; uniqueness/history; one-section draft preservation |
| STF-05 | Dated Teacher eligibility and impact | Existing approved SA-16 rule | Ready narrow Academics LLD/migration | Migration rehearsal; overlap/impact/concurrency; profile/browser/reference |
| STF-06 | Employee-context invitation review and reasoned resend | Existing approved SA-15 rule; STF-03A | Ready technical design | Pending/failed/expired/consumed/revoked; replacement/replay/provider truth |
| STF-07 | End today with explicit Access disposition | PD-STF-03; STF-03A/04B/05 | Product decision required | Assignment/last-admin blocks; partial recovery; no false complete; other-scope preservation |
| STF-08 | New employment episode for rejoin | PD-STF-04; STF-07 | Product decision required; higher cost | Populated migration; interval races; no authority restoration; profile history |
| STF-VIS | Current-source Staff visual pass | Each implemented slice | Evidence task | 1440/900/390/360, four themes on representative states, keyboard/focus |

## Slice exit rule

A slice is engineering complete only when its owner operation, counterpart composition, persistence/reload behavior, security negatives, recovery matrix, responsive visual inspection and source provenance are recorded. Human acceptance remains a separate status.
