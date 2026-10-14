# COM-01 / PAR-14 communication notice checkpoint

Human review: **PENDING**.

## Outcome

An explicitly authorized School Administrator can publish one immutable text notice to a current Section. The server resolves a frozen account audience from current placement plus an independently accepted `communication.notice.read` Guardian purpose. The selected Parent reads the exact version, records first read separately, explicitly acknowledges it and sees the acknowledgement after reload. No email is sent or inferred.

Administrator reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-35`.

Parent reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html#/communication/notice/n1` (PAR-14).

Application routes: `/admin/communication`, `/admin/communication/new`, `/family/notices`, `/family/notices/[id]`.

## Verification

- Unit: `test/unit/communication-notices.test.ts` — 2/2 passed.
- Real PostgreSQL: `test/functional/communication-notices.test.ts` — 2/2 passed against `vyapti_vschool_test` with 52 migrations.
- Browser: `test/e2e/communication-notices.spec.ts` — 1/1 desktop Chromium and 1/1 mobile Chromium passed sequentially with one worker. The journey publishes, switches identities, reads, acknowledges and reloads the persisted result.
- Repository gates: TypeScript, lint, `check:backend`, `check:boundaries`, `check:db-design`, `check:docs` and production build passed.
- Development seed: `pnpm demo:seed`; private values are written to ignored `artifacts/communication-01/private-demo.json` and are not included here.

The PostgreSQL checks cover publisher denial, exact purpose/audience selection, replay, read/ack separation, acknowledgement replay and denial after child-access revocation. The test audience includes another current Parent who lacks the new purpose and is excluded.

## Direct visual comparison

The following matched states were inspected, rather than merely captured:

| State | Approved reference | Application |
|---|---|---|
| Administrator compose, 1440×1000 | `reference-admin-compose-desktop.png` | `admin-compose-chromium.png` |
| Administrator compose, 390×844 | `reference-admin-compose-mobile.png` | `admin-compose-mobile.png` |
| Parent notice, 1440×1000 | `reference-parent-notice-desktop.png` | `parent-notice-chromium.png` |
| Parent notice, 390×844 | `reference-parent-notice-mobile.png` | `parent-notice-mobile.png` |
| Published/acknowledged results | reference flow state | `admin-published-*.png`, `parent-acknowledged-*.png` |

The implemented composition matches the applicable Message → Recipients → Review stage order, notice-title detail heading, single reading card, acknowledgement CTA, Back action, shared desktop shell and mobile navigation. Visual inspection found and fixed a mobile CSS cascade that had left the desktop guidance column active at 390 px.

## Deliberate current-slice boundaries

The approved pack's durable draft, approval, scheduling, provider delivery, correction, withdrawal, attachment and delivery-follow-up controls are not rendered because their owner contracts are outside COM-01. Prototype review tools and fictional values are also absent. These are remaining SA-35/SA-36 work, not accepted visual exclusions or fake completed controls. The application uses the documented Inter/system font substitution; font portability, native VoiceOver/NVDA and human visual acceptance remain pending. TEN-03 and production provider/security gates remain pending.

## Migration history

Development and test contain 52 migrations. The initial local base-migration attempt exposed an invalid Section composite foreign key after PostgreSQL retained the first two tables. The failed record was handled through Prisma state, then the forward-only recovery migration completed the remaining objects; no database reset, table deletion or applied-history rewrite occurred. A fresh test database path applied the corrected base plus recovery successfully. `20261015123000_communication_path_a_metadata` records the final Path A owner/policy metadata additively.
