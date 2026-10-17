# Programme resume

Task/subtask: F10 / WF-33 / LEA-33 is **ENGINEERING_COMPLETE** at executable checkpoint `3a84a3a`. F10 now combines the earlier LEA-34 durable portal-reminder slice with D13 exact-revision notice author/reviewer/publisher separation. LEA-32 is **PARTIAL** because F12 Documents/attachments and its own direct reference comparison remain. Human review remains **PENDING**.

Approved decisions: D01 preserves the existing COORD-02/LEA-10 contract. On 17 October 2026 the repository owner explicitly approved D02–D19 for synthetic-only implementation exactly as recorded in `02_PRODUCT_DECISIONS.md`, with no exceptions. This does not authorize production enablement, purchases, provider selection, real external messages or payments, or invented emergency procedures. Human acceptance remains separate.

Current matrix: 21 ENGINEERING_COMPLETE, six PARTIAL and 19 NOT_STARTED; all 46 Principal workflows are accounted for exactly once. LEA-33 is complete for the required text-only exact-digest decision outcome. LEA-32 is not promoted by that completion because its approved attachment outcome still depends on F12.

Current verified executable source: `3a84a3a22822f97115ae9cfb87325ba6bf1e1314`. Production build ID: `neoUrp8NYWHGZhYlRoVU6`. The current-source demo is reachable at `http://127.0.0.1:3400`; `/api/health` returned HTTP 200 with `ready:true`. Private Administrator/acting-Principal personas remain in ignored `artifacts/people-02/private-demo.json`; Communication Parent credentials and proposal IDs remain in ignored `artifacts/communication-01/private-demo.json`.

Development and test databases retain 83 forward migrations, including `20261017220000_communication_notice_review` and forward-only canonical metadata migration `20261017221000_communication_notice_review_metadata`. Neither database was reset and no applied migration was edited. Development `prisma migrate status` reports up to date; the focused test runner applied the same 83 migrations before the passing PostgreSQL suite.

Verification for `3a84a3a`: `pnpm check` passed lint, TypeScript, docs, 127-table DB design, boundaries, portable backend and 202 unit tests. Focused Communication PostgreSQL passed 5/5. `pnpm build` passed. The guarded Communication seed passed twice. Sequential focused Playwright verification passed at 1440×1000 and 390×844, and the captures were directly inspected against approved LEA-33. Evidence: `docs/evidence/principal-f10-notice-review-2026-10-17/README.md`.

The exact next eligible work is F05, the earliest approved dependency-ready foundation in queue order: Reporting briefs and compatible comparison contracts under D06. Read only F05, D06, LEA-40/41, Reporting live state and the existing snapshot/export contracts; write a narrow owner LLD before persistence or code. Do not imply institution-wide access from Principal role or combine incompatible metrics/calendars.

Pending gates: human review, font portability, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03, provider/retention/restore/load review and production enablement. Do not mark these passed.
