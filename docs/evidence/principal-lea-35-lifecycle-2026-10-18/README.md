# LEA-35 protected family concern lifecycle

## Outcome

LEA-35 is engineering-complete for the approved D12 synthetic-only scope. The journey now covers protected submission, leadership-conflict routing, explicit acknowledgement and review date, information return/response, public outcome, one configured independent appeal/reopen tier, fresh appeal acknowledgement, final outcome, withdrawal and reload. Human review remains PENDING.

Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, LEA-35. Production routes: `/family/concerns/:id` and `/leadership/concerns/:id`.

## Verification

- `pnpm exec vitest run --config vitest.config.ts test/unit/requests.test.ts` — 4/4 passed.
- `pnpm test:functional test/functional/requests.test.ts` — 7/7 passed against real `vyapti_vschool_test` PostgreSQL with 92 migrations.
- PostgreSQL evidence covers acknowledgement replay, branch-local date validation, initial decision, appeal exact replay, changed-payload rejection, single independent tier, previous-reviewer exclusion, immutable history, expired window, concurrent decision, cross-branch denial and revoked protected receipt disclosure.
- One-worker Playwright passed 3/3 Chromium and 3/3 mobile sequentially. The family journey submits an implicated-reviewer concern, proves omission from that reviewer, acknowledges and decides through the conflict route, appeals, reassigns to the configured third reviewer, acknowledges and decides again, then verifies the Family outcome after reload.
- Isolated E2E build, lint, typecheck and database-design checks passed. The current-source production build passed with `NODE_OPTIONS=--max-old-space-size=4096`; the default 2 GiB Node heap had first failed during webpack without a code or test failure. No applied migration was edited and neither database was reset.

## Direct visual comparison

The reference and application captures were opened and inspected. The application preserves the source's protected-case order—assigned evidence, acknowledgement, dated ownership, outcome, appeal and receipt—inside the approved routed Family/Principal page recipes. It does not reproduce the explorer's fictional timetable backdrop or modal shell. Desktop and mobile hierarchy, content width, state badge, action placement, timeline grouping and absence of horizontal overflow were inspected. The established font portability and native accessibility exceptions remain.

| Evidence | Desktop | Mobile |
|---|---|---|
| Approved LEA-35 explorer | `reference-lea-35-chromium.png` | `reference-lea-35-mobile.png` |
| Family submitted state | `application-family-receipt-chromium.png` | `application-family-receipt-mobile.png` |
| Independent appeal outcome and retained timeline | `application-independent-review-chromium.png` | `application-independent-review-mobile.png` |

## Persistence and release limits

Migration `20261018190000_requests_family_lifecycle` adds the optional third reviewer, review checkpoint fields and immutable `vs_requests_case_event`. Existing data is preserved and receives no inferred appeal authority. Demo configuration is fictional, repeat-safe and recorded only in ignored `artifacts/requests-01/private-demo.json`. Real complaint content remains disabled until school retention/disclosure policy, named reviewers, TEN-03 and production release gates are satisfied.
