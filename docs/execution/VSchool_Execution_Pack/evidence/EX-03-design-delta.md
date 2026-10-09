# EX-03 design delta — controlled list and command-state recipes

Date: 9 October 2026
Status: VERIFIED; human review PENDING

- Reference and route: approved shared list recipes in `architecture/UI_LLD.md`; fictional gallery at `/design-system`; real owner-backed listing at `/admin/students`.
- Use case: commit a bounded search with Enter, stage and apply/cancel filters, stage and apply/cancel sort in the gallery, render semantic server rows, and explain confirmed/unknown/failed command outcomes without losing an unknown command key.
- Components/contracts: `components/portal/{list-toolbar,filter-drawer,sort-drawer,command-feedback}.tsx`, existing `components/ui/{forms,interactive,server-table}.tsx`, and browser-safe presentation types in `shared/contracts/portal.ts`.
- Real data path: the Students page reads validated `search` and `status` query fields, calls `studentsGateway.list`, and renders its authorized `StudentWorkspace` DTO. Search/filter navigation clears the cursor. No client-side filtering is presented as a complete Student result.
- Persistence: read-only Students list over existing Student/Person/Enrollment joins. No write table, transaction, idempotency key, schema or migration change.
- Authorization: existing page and Students facade checks remain active for account, membership, `student.read`, release, institution entitlement and branch activation. Toolbar state is only a query candidate.
- Focused verification: U09 and B11 through gallery interaction coverage; Students listing E2E through the real API and PostgreSQL; lint/type/boundary checks; desktop/mobile screenshots and overflow/focus inspection.
- Owner gaps: Students exposes combined name/admission search and one status selector. It has no supported server sort contract, so the real screen will not show Sort. The gallery demonstrates sorting with fictional rows only.

No unresolved product or security decision blocks this slice.
