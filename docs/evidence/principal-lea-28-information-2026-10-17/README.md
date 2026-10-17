# LEA-28 — request information before deciding

Status: **ENGINEERING_COMPLETE / DIRECT_COMPARISON_COMPLETE_WITH_DEVIATIONS / HUMAN_REVIEW_PENDING / SYNTHETIC_ONLY**.

Tested source: the final checkpoint working tree based on `43385c9`; the committed checkpoint is recorded in the programme handoff. Both local databases have 89 forward migrations through `20261018103000_coordination_information_requests`.

## Implemented contract

- Leadership dispatches the question through the registered typed owner adapter; it stores no generic decision, question, recipient or receipt.
- Coordination resolves the recipient as the current resolution proposer and rechecks that actor's current work and registered-source eligibility.
- One bounded OPEN child question is allowed. Request and reply each increment the owner version; decision actions are absent while waiting.
- The recipient answers in the owning Coordination screen. A fresh owner read exposes the response and requires a new expected-version confirmation.
- Exact request/reply replay returns one original result. Changed payloads conflict. Revoked or former participants cannot disclose/replay or answer, and a stale reply cannot overwrite an answered, cancelled or decided request.
- Questions and answers remain outside the general audit/safe-history payload. Coordination stays synthetic-only pending its real-data retention/backup-deletion policy and TEN-03.

## Verification

- Unit: `pnpm exec vitest run --config vitest.config.ts test/unit/coordination-requests.test.ts` — 13/13 passed.
- PostgreSQL: `pnpm test:functional test/functional/coordination-requests.test.ts` — 16/16 passed against `vyapti_vschool_test`.
- Chromium, one worker: focused real journey and immutable LEA-28 reference — 2/2 passed; current source was built by the Playwright server.
- Mobile, one worker, sequentially reusing that build: focused real journey and immutable reference — 2/2 passed.
- The first Chromium run exposed missing focus transfer into the question stage; the implementation was corrected before the passing captures.
- The first two mobile wrapper starts failed inside Prisma's migration engine before any test. The same already-migrated test database and verified build then passed through direct focused Playwright startup. No failed run is counted as a pass.
- The guarded synthetic Coordination seed passed twice and preserved the same LEA-28 child request and existing records.

## Direct visual inspection

The approved source is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow `LEA-28`. It is the workflow explorer. The production mapping uses the established recipe-D decision page and the owner Coordination detail page, retaining the approved identify → preview → confirm → later response order.

Application and reference captures were inspected directly at 1440×1000 and 390×844. Question receipt, owner response, refreshed evidence, focus, action order and viewport containment are clear. The persistent shell/routed-page composition and documented portable-font exception remain deviations. Native VoiceOver/NVDA and actual browser 200% zoom were not performed.

Files:

- `reference-lea-28-chromium.png`, `reference-lea-28-mobile.png`
- `application-request-chromium.png`, `application-request-mobile.png`
- `application-response-chromium.png`, `application-response-mobile.png`
- `application-received-chromium.png`, `application-received-mobile.png`

## Manual walkthrough

1. Sign in as the synthetic Principal and open **My decisions**.
2. Open the prepared Coordination verification, choose **Request information**, enter an actionable question and confirm. Expect **Question recorded**, with no approved/rejected result.
3. Sign in as the synthetic administrator/worker, open **Assigned follow-ups**, open that request, answer **Respond to requested information**, and send it.
4. Return as Principal and reopen the decision. Expect **Requested information received** and the answer. Continue only after reviewing this refreshed evidence.
5. Confirm the decision. Expect the owner-confirmed receipt and one persisted outcome.

Private scenario identifiers are in ignored `artifacts/coordination-01/private-demo.json`; sign-in credentials remain in ignored `artifacts/people-02/private-demo.json`. No credentials are committed here.
