# LEA-43 Finance exception evidence

Status: **ENGINEERING_COMPLETE** for approved D17 synthetic-only scope. Visual status: **DIRECT_COMPARISON_COMPLETE_WITH_DEVIATIONS**. Human review: **PENDING**. Production enablement: **BLOCKED** by existing provider, policy and release gates.

The approved authority is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, explorer state `LEA-43`. Production entry is `/leadership/finance/exceptions`; the requester counterpart is `/admin/finance/exceptions/new`.

## Verified contract

- Finance owns exact-currency synthetic ledger facts, bounded allocations, immutable reconciliation snapshots and assigned exception decisions. Leadership consumes a minimized projection and never writes Finance tables.
- Provider event and source references deduplicate exact facts. Allocation cannot exceed a charge or payment. Reconciliation visibly distinguishes unmatched charge and unallocated payment and never claims provider settlement.
- Requester and reviewer differ. Review authority requires a current branch grant, exact currency, non-null configured limit and amount within that limit. Principal role and inbox visibility grant no Finance action.
- Request and decision recovery retain the original owner key. Exact replay returns one result, changed payload conflicts, concurrent outcomes serialize to one version and revoked authority denies receipt disclosure.
- Approval records only bounded owner approval. It changes no ledger row and does not initiate a payment/refund or prove settlement.

## Verification

- Unit: `test/unit/finance.test.ts` — 3/3 passed.
- Real PostgreSQL: `test/functional/finance.test.ts` — 4/4 passed against `vyapti_vschool_test`, covering provider deduplication, exact arithmetic, bounds, separation, limits, replay, typed decision registration, cross-scope/revoked denial and concurrent decision serialization.
- `pnpm exec tsc --noEmit`, focused ESLint, `pnpm check:db-design`, `pnpm check:docs`, `pnpm check:boundaries` and `pnpm check:backend` passed.
- The 4 GiB current-source E2E build passed. Sequential one-worker Playwright passed 2/2 Chromium at 1440×1000 and 2/2 mobile at 390×844 after correcting the shared Leadership content gutter exposed by direct screenshot inspection.
- Development and test databases each contain 111 forward migrations. The focused development seed passed twice and preserved existing records. Private scenario data remains ignored at `artifacts/finance-01/private-demo.json`.

## Direct visual inspection

| State | Desktop | Mobile |
|---|---|---|
| Approved LEA-43 explorer | `reference-lea-43-chromium.png` | `reference-lea-43-mobile.png` |
| Requester recovered receipt | `requester-recovered-chromium.png` | `requester-recovered-mobile.png` |
| Principal recovered approval | `principal-approved-chromium.png` | `principal-approved-mobile.png` |

The approved source is a workflow explorer rather than a complete production page. Direct inspection confirmed the shared shell, standard page gutters, bounded receipt cards, exact consequence labels, responsive stacking, focus movement and no viewport overflow. Production deliberately adds the owner evidence and recovery controls required for durable authorization and retry semantics.

Live payment/refund execution, actual provider settlement, production limits and policy, retention, TEN-03, font portability, native VoiceOver/NVDA, actual browser 200% zoom and human acceptance remain unavailable or pending.
