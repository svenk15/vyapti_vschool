# F04 safe Coordination history evidence

Date: 17 October 2026. Human acceptance: **PENDING**.

Verified product source: `94c7679d25e8a77b5b3042b109e400cf6204e535`.

## Outcome

The synthetic-only Principal workspace exposes `/leadership/history` only to a current `coordination.history` designation. It searches immutable Coordination events by exact follow-up reference, retained organization actor or an inclusive branch-local date range of at most 90 days. The projection omits notes, reasons, evidence narrative/revision, source identifiers/content and command data. A linked follow-up is opened through its own current authorization check.

F04 and LEA-42 are engineering-complete for the approved synthetic-only scope. In addition to safe search, event sequence and authorized source opening, a separately operator-designated actor can review an exact event and append an immutable finding or escalation. The record does not change the request, source owner or prior events; general history readers cannot see its protected text.

The LEA-42 closure migration is `20261018010000_coordination_history_findings`. Development and test each retain 87 forward migrations. No database was reset and no applied migration changed.

## Verification

- `pnpm exec vitest run test/unit/coordination-requests.test.ts` — 10/10 passed.
- `pnpm test:functional test/functional/coordination-requests.test.ts` — 15/15 passed against `vyapti_vschool_test` with all 87 migrations applied.
- Focused ESLint, `pnpm typecheck`, `pnpm check:backend`, `pnpm check:boundaries` and `pnpm check:db-design` passed.
- `pnpm build` — passed; current normal production build `BftvXrMHfVnML5bwvM2QZ`.
- Isolated browser build `qnG7oQXhVh9N-nY_3Rkaw` passed.
- Focused finding journey with one worker — Chromium 1/1 and mobile 1/1 passed sequentially. It covers keyboard search, protected-field omission, staged finding review, persisted reload, authorized source opening, live history revocation, responsive composition and overflow. The first run exposed a stale isolated build and the next a fuzzy test locator; the current isolated build passed without weakening product assertions.
- `pnpm check` passed lint, TypeScript, 30 documentation checks, 136 database contracts, boundaries, portable backend compilation and 44 unit files / 209 tests.
- The incremental fictional Coordination seed passed twice and preserves its private finding reference without replacing credentials or existing records.

The first Playwright attempt served the prior `.next-e2e` output and returned a route-level 404. The normal build already contained the route. Rebuilding the separate isolated browser output fixed the environment mismatch; no assertion or authorization rule was weakened.

## Direct visual comparison

Approved source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, LEA-42 “Review decision and follow-up history”.

Application captures:

- `application-chromium.png` — 1440×1000 viewport, populated exact-reference search.
- `application-mobile.png` — 390×844 viewport, populated exact-reference search.
- `application-finding-chromium.png` — 1440×1000 viewport, persisted separate finding.
- `application-finding-mobile.png` — 390×844 viewport, persisted separate finding.

Reference captures:

- `reference-lea-42-chromium.png`
- `reference-lea-42-mobile.png`

The images were directly inspected. Both preserve the approved safe-search and event-sequence hierarchy. The reference is a workflow-explorer dialog; production uses the recorded recipe-L page, persistent shell, bounded search form and safe event table. The optional finding is the smallest consistent extension below that table. Desktop alignment, action placement, status treatment and spacing are consistent with the Principal screen map. Mobile controls stack cleanly and the wide event table remains horizontally scrollable within its card without page overflow. Exact explorer pixel identity is not claimed. The existing application font decision remains unchanged and font portability is pending.

## Migration and release status

Forward migration `20261017150000_coordination_history_capability` extends the allowlisted capability CHECK only. No prior migration changed and no database was reset. Application authorization remains active on every protected read. TEN-03, retention/backup deletion, native VoiceOver/NVDA, font portability, human acceptance and production enablement remain open gates.
