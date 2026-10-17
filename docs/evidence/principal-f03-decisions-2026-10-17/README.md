# F03 typed decision facade evidence

Status: **ENGINEERING_COMPLETE** for F03. Human review remains **PENDING**. LEA-27, LEA-29 and LEA-31 are supported partial workflows; LEA-28 and LEA-30 remain not started.

## Authority and scope

On 17 October 2026 the repository owner approved D02–D19 for synthetic-only implementation exactly as recorded in `docs/execution/PRINCIPAL_COMPLETION_PACK/02_PRODUCT_DECISIONS.md`, with no exceptions. F03 implements D03 with Coordination verification as the first typed owner adapter. D01 is unchanged. This checkpoint does not authorize production enablement, real messages, purchases, providers or real-client data.

There is no generic decision persistence or approve-anything command. Leadership owns only the typed registry and presentation contract. Coordination continues to own item visibility, source evidence, independent verification, optimistic versioning, audit and exact replay. Unknown owners are rejected before dispatch.

## Routes and reference

- Inbox: `/leadership/decisions`
- Review: `/leadership/decisions/COORDINATION_VERIFICATION/:requestId`
- Approved immutable source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`
- Compared states: LEA-27 “Work from a purpose-scoped decision inbox” and LEA-29 “Approve, reject or return an assigned item”

The approved source is a workflow explorer rather than a complete production page. The application maps the same source facts, owner-defined actions, consequence review and receipt stages into the agreed production Principal shell. That routed shell/dialog difference is explicit; it is not claimed as pixel identity.

## Verification

- Unit: `test/unit/coordination-requests.test.ts` — 5/5 passed.
- PostgreSQL: `test/functional/coordination-requests.test.ts` — 11/11 passed against `vyapti_vschool_test` with all 70 migrations.
- Browser: focused current-source decision journey and immutable reference capture — 2/2 Chromium and 2/2 mobile, sequentially with one worker.
- Repository gates: focused ESLint, `pnpm typecheck`, `pnpm check:backend`, `pnpm check:boundaries`, `pnpm check:docs` and `pnpm build` passed.

The PostgreSQL test covers typed listing/detail, unknown-owner rejection, proposer exclusion, owner commit, revocation-before-replay denial, restored exact replay, changed-payload conflict and a single committed result. The browser test covers inbox/detail navigation, stage focus, committed-response loss, retained same intent, revoked retry denial, restored original receipt and desktop/mobile containment.

No schema or migration changed. Development and test remain at 70 applied migrations. The targeted Coordination seed creates a new awaiting-verification synthetic item only when the prior synthetic example is no longer awaiting, retaining historical records and credentials.

## Captures inspected

- `reference-lea-27-{chromium,mobile}.png`
- `reference-lea-29-{chromium,mobile}.png`
- `application-inbox-{chromium,mobile}.png`
- `application-review-{chromium,mobile}.png`
- `application-recovered-{chromium,mobile}.png`

Direct inspection confirmed the shared Principal navigation, scoped school context, hierarchy, responsive staged composition, action placement and no horizontal overflow. The mobile review evidence is a viewport capture at the top of the routed composition so the sticky shell is represented accurately; it is not a stitched full-page rendering.

## Remaining gaps and gates

- LEA-27: multiple owners, type/state/due filters, reference search and stable due/submitted sort.
- LEA-29: owner-specific actions beyond Coordination verify/return.
- LEA-31: cross-owner status route and stale-evidence restart; current adapter proves exact retry and revoked receipt protection.
- LEA-28 information request and LEA-30 recusal are not implemented.
- Human review, font portability, native VoiceOver/NVDA, TEN-03, retention/restore/load and production/provider enablement remain pending.
