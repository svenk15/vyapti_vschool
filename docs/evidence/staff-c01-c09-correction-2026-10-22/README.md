# Administrator Staff C01–C09 correction evidence

Human acceptance is **PENDING**. This checkpoint does not approve PD-STF-01–03, rejoining, TEN-03, native accessibility or production release.

## Provenance

- Frozen reference: `docs/execution/STAFF_REVIEW/references/approved-20261022/`
- Frozen Site commit: `fc33c8b991134ade6d02e27fbe467ef67d86b085`; manifest verified 17/17.
- Application source: `6266c38c` (primary correction `ae0050cf`).
- Production build ID: `AeoqXwEgSTp5_voNlOn4w`; demo: `http://127.0.0.1:3400`.
- Final capture: 23 October 2026 Asia/Kolkata (`measurements.json` retains the exact UTC timestamp).
- Chromium, device scale factor 1; CSS viewports 1440×1000, 900×1000, 390×844 and 360×800.
- Synthetic data only. Credentials remain in ignored `artifacts/people-02/private-demo.json` and are excluded from evidence.
- No schema, migration or seed changed.

## Correction matrix

| ID | Observed discrepancy / risk | Root cause and correction | Verification | Remaining deviation |
| --- | --- | --- | --- | --- |
| C01 | Header, tabs, Add action and toolbar differed. | Scoped Staff title/tab/action geometry; removed the inherited outer toolbar surface; restored composed search and icons without changing query behavior. | Direct four-viewport comparison; search/filter/sort browser journey. | At 900px production uses the shared tablet shell while the standalone mock retains its sidebar until 700px. |
| C02 | Headers/actions misaligned; mobile rows were stretched. | Staff-only table recipe restores type, cell insets, separators, avatar/action alignment and explicit mobile tracks. | Desktop equivalent geometry is within 0–1.5 CSS px; mobile vertical geometry is within 0–1.4 CSS px. | Text widths differ with authoritative fictional names. |
| C03 | Manage was a generic explanatory dialog. | Compact identity block, icon-led authorized actions, reference width/padding, Escape/close and guarded portal shortcut. | Desktop/mobile captures and full browser journey. | Real category/eligibility/employment actions remain; unapproved correction controls remain absent. |
| C04 | Profile was too wide/tall and activity was inside its record surface. | Reference width, external identity/activity, four-column Employment facts and compact Teaching/Access sections. | Desktop/mobile direct comparison and Profile navigation. | Dated eligibility remains as a compact contract-required extension; PD-STF-02 edits remain absent. |
| C05 | Add form hierarchy and spacing differed. | Reference width, icons, email placement, padding and footer while retaining structured first/last name inputs. | Desktop/mobile captures plus validation/create/lost-response flow. | Structured names intentionally differ from the mock Full name field. |
| C06 | A committed People write plus failed refresh could remain actionable. | Commitment is retained before refresh; the mutation disappears; saved recovery performs GET only; UNKNOWN retains exact payload/key. | Focused E2E observes `PATCH, GET, GET`, exactly one PATCH and the persisted value. | Recovery state is intentionally in-flow, not durable across reload. |
| C07 | A committed resend plus failed refresh could expose stale resend. | Confirmed replacement/delivery is retained across close/reopen; refresh is GET-only; UNKNOWN retains exact-key recovery. | Focused E2E observes `POST, GET, GET`, exactly one POST and no duplicate invitation. | Production delivery provider remains a release gate. |
| C08 | Loaded count was presented as total and could gate pagination. | Traced `total` to loaded rows; ranges are truthful and next/previous use signed cursor history. Query/page-size changes invalidate cursor state. | PostgreSQL 14/14 and desktop/mobile multi-page first/next/previous, page-size, search, sort and history tests. | Access owner API is forward-only; no total, Previous or page-size support is fabricated. |
| C09 | Access delivery failures dominated and states were conflated. | Compact actionable failure treatment; account, membership, invitation and delivery remain distinct. | Desktop/mobile Access captures and invitation recovery flow. | Email-only identities remain email-only; unknown invitation state stays explicit. |

## Visual evidence

`reference-*` and `application-*` are matched current captures. `measurements.json` records reference and application boxes and typography. Directory states cover all four widths; Manage, Profile, Add and Access cover desktop/mobile. `application-directory-{forest,amethyst,porcelain,linen}-900.png` uses the same route, data and viewport.

Equivalent 1440px and 390/360px layout elements meet the two-CSS-pixel target except content-driven text widths. The 900px absolute horizontal difference is the documented shared-shell breakpoint; relative vertical positions, heights and density match. The mock has 36 rows and the standing demo has 10. Browser verification creates isolated authorized rows to prove pagination without rewriting demo records.

## Verification

- `pnpm test:functional test/functional/people-employees.test.ts` — 14/14 passed on real PostgreSQL.
- `pnpm test:e2e test/e2e/people-employees.spec.ts --project=chromium` — 6/6 passed, one worker.
- Same file with `--project=mobile` — 6/6 passed, one worker.
- Final focused directory/pagination regression — Chromium 2/2 and Mobile 2/2.
- `pnpm check:backend`, `pnpm check:boundaries`, targeted ESLint and TypeScript — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed for `6266c38c`; build ID `AeoqXwEgSTp5_voNlOn4w`.
- `pnpm check:docs` retains only two previously recorded unrelated `WORKSPACE_PRESENTATION_REVAMP` broken links.

One initial functional wrapper command with a literal separator started the broad suite and was stopped after an unrelated Finance failure; the intended Staff file then passed 14/14. A sandboxed browser attempt could not open local process sockets; the identical focused command passed with local Chromium/PostgreSQL permission. Neither was a product failure.

## Demo and fixtures

`pnpm demo:seed` remains the aggregate fictional seed; its separately recorded LDR-02 Principal gate is unchanged. Existing Staff functional/browser fixtures are repeat-safe, isolated and preserve the standing demo. No C01–C09 seed code changed. Review `/admin/teachers` with the Administrator persona in the ignored credential file named above.
