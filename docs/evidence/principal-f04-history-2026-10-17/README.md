# F04 safe Coordination history evidence

Date: 17 October 2026. Human acceptance: **PENDING**.

## Outcome

The synthetic-only Principal workspace exposes `/leadership/history` only to a current `coordination.history` designation. It searches immutable Coordination events by exact follow-up reference, retained organization actor or an inclusive branch-local date range of at most 90 days. The projection omits notes, reasons, evidence narrative/revision, source identifiers/content and command data. A linked follow-up is opened through its own current authorization check.

F04 is engineering-complete. LEA-42 is **PARTIAL** because its safe search, event sequence and authorized source-open path are implemented, while the optional separate review-finding record is not implemented or presented as a working action.

## Verification

- `pnpm test:unit test/unit/coordination-requests.test.ts` — 9/9 passed.
- `pnpm test:functional test/functional/coordination-requests.test.ts` — 13/13 passed against `vyapti_vschool_test` with all 72 migrations applied.
- Focused ESLint, `pnpm typecheck`, `pnpm check:backend`, `pnpm check:boundaries` and `pnpm check:db-design` passed.
- `pnpm build` — passed; normal production build `0d6U-0091B9yWK8fQSyZa`.
- `VSCHOOL_E2E=1 pnpm build` — passed; isolated browser build `lWjyMxALOz-8xeONh3hdv`.
- Focused Playwright with one worker — Chromium 2/2 and mobile 2/2 passed sequentially. It covers keyboard submission, protected-field omission, authorized source opening, live designation revocation, responsive composition and overflow.

The first Playwright attempt served the prior `.next-e2e` output and returned a route-level 404. The normal build already contained the route. Rebuilding the separate isolated browser output fixed the environment mismatch; no assertion or authorization rule was weakened.

## Direct visual comparison

Approved source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, LEA-42 “Review decision and follow-up history”.

Application captures:

- `application-chromium.png` — 1440×1000 viewport, populated exact-reference search.
- `application-mobile.png` — 390×844 viewport, populated exact-reference search.

Reference captures:

- `reference-lea-42-chromium.png`
- `reference-lea-42-mobile.png`

The images were directly inspected. Both preserve the approved safe-search and event-sequence hierarchy. The reference is a workflow-explorer dialog; production uses the recorded recipe-L page, persistent shell, bounded search form and safe event table. Desktop alignment, action placement, status treatment and spacing are consistent with the Principal screen map. Mobile controls stack cleanly and the wide event table remains horizontally scrollable within its card without page overflow. Exact explorer pixel identity is not claimed. The existing application font decision remains unchanged and font portability is pending.

## Migration and release status

Forward migration `20261017150000_coordination_history_capability` extends the allowlisted capability CHECK only. No prior migration changed and no database was reset. Application authorization remains active on every protected read. TEN-03, retention/backup deletion, native VoiceOver/NVDA, font portability, human acceptance and production enablement remain open gates.
