# Finance current state

Last updated: 19 October 2026.

Status: **F15 ENGINEERING_COMPLETE / LEA-43 ENGINEERING_COMPLETE / HUMAN_REVIEW_PENDING** for the approved D17 synthetic-only scope.

Finance now owns exact-currency synthetic charge/payment facts, bounded allocations, immutable reconciliation snapshots, explicit branch purpose grants and assigned concession/refund-review decisions. A Principal receives no Finance authority from role or inbox visibility. The reviewer must hold a current currency-specific non-null limit, differ from the requester and stay within that limit. Approval records an owner decision only; it neither changes the ledger nor initiates or settles money.

Development and test databases contain 111 forward migrations through `20261019052000_finance_path_a_contract_comments`; neither database was reset and no applied migration was edited. Focused unit 3/3 and real-PostgreSQL 4/4 passed, including provider deduplication, allocation/reconciliation arithmetic, exact replay, revocation, typed owner registration, cross-scope denial and concurrent decision serialization. Sequential one-worker Playwright passed 2/2 Chromium and 2/2 mobile, including requester lost-response recovery with the original key, assigned Principal approval recovery, persisted owner history, unchanged ledger facts, focus and no horizontal overflow. The 4 GiB current-source build passed. Evidence is in `docs/evidence/principal-lea-43-finance-2026-10-19/`.

The repeat-safe fictional seed is included in `pnpm demo:seed`; its ignored scenario file is `artifacts/finance-01/private-demo.json`. Live provider authentication, payment/refund initiation, settlement confirmation, production limits/policy, retention, TEN-03, font portability, native accessibility and human acceptance remain blocked or pending.
