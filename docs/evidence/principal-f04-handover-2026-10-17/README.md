# F04 bounded Coordination handover evidence

Status: implementation and direct visual comparison complete for the Coordination-only handover slice; LEA-26 remains PARTIAL because Access delegation/revocation is the independent F02 counterpart. Human review, font portability, native accessibility, TEN-03 and production retention gates remain PENDING.

## Contract and source

- Approved workflow: `LEA-26` in `references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`.
- Production mapping: `/leadership/handover` and `/leadership/handover/[id]`, recipe W followed by recipe R.
- Build ID: `-Xor-S2bH0KZvG5edlNv2`.
- Schema: 71 forward migrations in development and test; `20261017140000_coordination_handover` adds the two Path-A Coordination-owned tables. No reset or historical migration edit occurred.

The approved HTML is a workflow explorer. Its modal establishes the ordered semantics: explicit transferable work, independently eligible successor, retained evidence, per-item confirmation, and separate Access retirement. The production route implements those semantics as the approved staged-operation and receipt recipes rather than reproducing the catalogue modal as an application page.

## Verification

- Coordination unit: 8/8 passed.
- Real PostgreSQL Coordination functional: 12/12 passed. The handover case proves one success plus one stale item, unchanged failed ownership, immutable reassignment history, exact replay, changed-payload conflict and protected-receipt denial after `coordination.assign` revocation.
- Focused Playwright, one worker and sequential projects: Chromium 2/2; mobile 2/2. The journey proves selection, eligible successor, retained review state, final-only mutation, a committed response loss, exact recovery, two persisted transfers, receipt navigation and no horizontal overflow.
- Typecheck, focused lint, backend extraction, boundaries, database design, documentation and production build passed.
- An initial wrapper invocation accidentally forwarded `--` and began the broad functional suite. It was stopped after unrelated failures were observed; it is not recorded as a batch result. The corrected focused command then passed.

## Visual evidence

- `reference-lea-26-chromium.png`, `reference-lea-26-mobile.png`: unchanged approved workflow explorer.
- `application-review-chromium.png`, `application-review-mobile.png`: production impact review with owners, reason, explicit items and the Access separation notice.
- `application-result-chromium.png`, `application-result-mobile.png`: durable owner-confirmed receipt and request links.

The screenshots were inspected directly at 1440×1000 and 390×844. The production page follows the existing Principal shell, 28px production title, 800px staged-operation width, shared cards/buttons/badges and mobile stacking. The intentional explorer-versus-production composition difference remains recorded. The existing application font decision and native VoiceOver/NVDA checks remain open; screenshots do not establish human acceptance.
