# School branding and sign-in identity — current state

BRD-01 locally verified and accepted on 3 October 2026. No active timer. Public previews do not imply authentication or tenant access.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| BRD-01 | VERIFIED | PASSED | [Local evidence](../../evidence/brd-01-local/verification.json); 38 unit, 4 PostgreSQL and 28 browser tests passed |
| BRD-02 | VERIFIED | PENDING | [Local evidence](../../evidence/branding-02-local/verification.json); 59 unit, 44 PostgreSQL and 56 desktop/mobile browser tests passed |

## Implemented now

BRD-01 remains available as the synthetic preview described below. BRD-02 adds branch-authorized profile/draft/publish/rollback, same-scope immutable canonical PNG assets, exact DNS TXT host verification, allowlisted no-store public identity, immutable content URLs and a real NextAuth branded sign-in. UI mutations obtain the current account/branch scope server-side and each use case rechecks current membership and `branding.manage`; client scope forgery is denied. Published history is append-only and rollback creates a new published revision.

## Next action

Human review for BRD-02 is PENDING. Keep the task demo available, address any reported defect before dependent work, and continue with the next eligible task under the current execution policy. TEN-02 and IAM-03 dependency reviews remain PENDING; their implementations are VERIFIED, and BRD-01 was explicitly PASSED.

## Evidence and feedback

Append exact source revision, test reports, DB migration state, demo identity, limitations and human feedback here. No live institution or pupil data is bundled.

### BRD-02 local verification and demo — 4 October 2026

Implementation VERIFIED; human review PENDING. Intended demo outcome: an authorized school administrator edits a branch logo/palette/welcome, previews and publishes it, sees that published identity at the canonical sign-in, and rolls back by creating another immutable version. Unauthorized branch edits, wrong-host public lookups and unknown slugs fail closed. Authentication still grants no tenant access by itself; active memberships determine available current school contexts.

Implemented portable use cases and typed contracts under `backend/modules/branding` and `shared/contracts`; Prisma infrastructure and PNG/DNS security adapters under `backend/modules/branding/infrastructure`; factories in `backend/composition`; Next gateways/routes under `lib/server` and `app/api`; and the reused shared-component admin workspace. No business rule or Prisma write was placed in a page, route handler or server action. The BRD-01 sample preview remains explicit and does not authenticate. `SCHOOL_ADMIN` now receives `branding.manage`; branch activation and exact current permission are rechecked on the server. No new package or lockfile change was needed.

Physical schema: four registered `vs_branding_*` tables with explicit snake_case mappings and same-owner guards. Forward migrations `20261004000600_branding_publish`, `20261004000700_branding_check_corrections` and `20261004000800_brand_asset_immutable` are applied to both configured databases. `pnpm db:setup` applied them to `vyapti_vschool` without reset; `pnpm test:functional`/`pnpm test:e2e` confirmed migration deployment on `vyapti_vschool_test`. Both report all 12 migrations current. During test-database rehearsal, the first 007 attempt encountered the existing index created by 006; that attempt was marked rolled back in Prisma migration metadata, 007 was corrected with an idempotent index create, and the corrected migration plus 008 then applied. No rows or migration files were deleted or rewritten. The checked-in migration history is forward-only. Registry now has 48 table contracts.

Evidence and commands: `pnpm check` passed (lint, typecheck, documentation links/task graph, 48-table database design, backend boundaries/compilation, 59 unit tests). `pnpm test:functional` passed 44 tests across eight files against real `vyapti_vschool_test`; this includes two branding PostgreSQL tests for current permission, scope isolation, evidence rollback, PNG derivative, immutable assets/history, DNS host binding, stale publication and concurrent publishers. `pnpm test:e2e` passed all 56 desktop and mobile journeys; the BRD-02 journey creates and publishes, uses the real sign-in, rejects unknown/wrong host and forged context, and rolls back as revision 3. `pnpm build` passed on Next 16.3.8 (build ID `SWGrRA6qlltLdUKZFeR-q`). `git diff --check` passed. JUnit reports: [unit](../../evidence/branding-02-local/unit.junit.xml), [functional](../../evidence/branding-02-local/functional.junit.xml), [Playwright](../../evidence/branding-02-local/e2e.junit.xml). Test-only PII is generated per run and no raw student data or credentials are included in these reports.

The local development demo is provisioned through the same branding use cases using the existing synthetic IAM account and branch in ignored `artifacts/iam-01/private-demo.json`. Only the sanitized derivative is persisted. Production-mode snapshot is running at http://127.0.0.1:3406/sign-in/vschool-demo-69a6f7fe; admin workspace: http://127.0.0.1:3406/admin/branding. The committed demo returned health 200, public no-store identity 200, immutable PNG 200, unknown slug and wrong Host 404, canonical sign-in 200, and unknown sign-in 404. Tested source commit and build ID are recorded in [verification evidence](../../evidence/branding-02-local/verification.json). The local demo command stores its idempotency keys in ignored mode-0600 artifacts; no credential is copied into tracked evidence.

Manual review steps:

1. Sign in at http://127.0.0.1:3406/sign-in using the existing synthetic IAM demo credentials from the private local artifact, then open `/admin/branding`. Expect the branch’s published profile, current draft, revision history and logo preview.
2. Change the welcome message or palette; choose Preview draft. Expect a clearly private preview notice and no public change. Save the draft and publish; expect a new immutable revision and success status.
3. Open `/sign-in/vschool-demo-69a6f7fe`. Expect the canonical published school identity/logo and the real sign-in form. An invalid password receives the normal authentication failure; a valid synthetic administrator sign-in reaches only the account’s current permitted branches.
4. Return to Branding, publish an edited version, then choose “Publish this version again” and accept the confirmation. Expect rollback to appear as a new published revision, with prior published revisions retained.
5. Open `/sign-in/not-a-school` and expect 404. For wrong-host behavior, request the public identity API with an unrelated Host header; expect 404. The E2E test also forges a foreign `vschool-context` cookie and expects the private branding workspace to deny it.

Limitations: the demo uses only the configured canonical host. Custom-host DNS verification is implemented, but serving a custom host is gated on separately provisioned TLS and trusted host forwarding. There is no object-store/CDN production adapter; canonical approved image bytes live in PostgreSQL. The schema supports institution defaults but this task’s management UI is branch-admin-only. Production RLS/restricted database runtime roles remain later release work. Native browser zoom and assistive-technology certification are not claimed.

### BRD-01 started — 3 October 2026

Branch main; initial Git status clean at 08aeb86. FND-01 and DS-01 accepted explicitly; pnpm next-task suggested BRD-01. Intended demo: all three approved palettes across two institutions and two branches, exact unknown-slug 404, native form validation/password reveal, focused preview feedback and cleared sample fields with no auth request/storage. Resolve existing validator/documentation length mismatch first. No new dependency, business table or migration is needed. Brand publication and real sign-in remain BRD-02 work.

### BRD-01 local verification and demo — 3 October 2026

Implementation VERIFIED; human review PENDING. Branch main; baseline `08aeb86cec7aaa89f565b0cc58fbdf647fe06976`. Tested dirty-source fingerprint `b0be9e6a6bac267e74a05df0c3f61cf79765ee7597ca2ca84d0fd473fd4ded28`: SHA-256 over sorted changed executable paths + NUL + contents + NUL, combined with the clean baseline. Paths: app/globals.css, components/login-preview.tsx, lib/demo-schools.ts, shared/contracts/branding.ts, test/unit/branding.test.ts, test/e2e/branding.spec.ts. The source checkpoint is the commit containing this record, identifiable via Git history; the SHA is reported in the owner handoff to avoid self-reference. No executable change followed final verification/build.

Implemented: aligned shared runtime projection bounds with the branding LLD; malformed/missing fields return false; inherited palette names remain rejected. Exact synthetic fixture resolution validates the projection and returns no fallback. Greenwood North uses Forest, South Clay, Aster Central Indigo. All three public identities retain synthetic support addresses and shared components/tokens. Valid preview submission clears both fields, hides password reveal and focuses the informational summary, including repeated identical submissions. Help focuses informational feedback without claiming account recovery. Native required/email/minimum-password constraints prevent invalid sample submission. Shared login layout wraps unbroken public labels at supported lengths and preserves the monogram’s size.

Affected documents: branding DESIGN and Bible changelog reconcile old 1–60 slug/120-character name validation with planned 3–80 slug/160-character public display names and 254-character support email. This changes no institution-account schema. DS CURRENT_STATE records explicit owner acceptance for source 08aeb86. No earlier project was modified.

Environment: owner’s macOS, Node 24.20.0, pnpm 11.25.0, PostgreSQL 16.15 (Homebrew), Next 16.3.8. Sanitized configuration inspection confirms local development `vyapti_vschool` and dedicated test `vyapti_vschool_test`, no URL options. Private .env is unchanged. No new dependency, lockfile, schema, table contract or migration change. Test deploy reports all three foundation migrations applied, none pending. Only the existing platform setup marker is installed; branding tables remain planned BRD-02 work. No database reset/deletion occurred.

Executed verification:

- `pnpm check`: exit 0 after final CSS/source update; lint, types, docs, DB-design catalog, portable boundaries/backend compilation and 38 unit tests passed. [Unit JUnit](../../evidence/brd-01-local/unit.junit.xml). Covers all palette contrast pairs already approved, malformed runtime values, invalid/prototype-key palettes, slug/name/monogram/welcome/support bounds and safe color input. A later `pnpm lint` after final test refinement exited 0.
- `pnpm test:functional`: exit 0, 4 tests against real dedicated PostgreSQL passed. [Functional JUnit](../../evidence/brd-01-local/functional.junit.xml). BRD-01 has no persistence; foundation replay/rollback/catalog tests remain the applicable regression suite. Publication uniqueness/assets/immutable revisions are BRD-02 tests, not claimed executed here.
- `pnpm test:e2e`: initial 26 journeys passed. Added contract-length layout stress; one attempt was blocked by sandbox PostgreSQL connection (exit 1), approved retry ran 28 tests with 2 layout failures. Fixed wrapping centrally; refined overflow assertions to inspect text containers rather than intentionally clipped decorative artwork. Final approved `pnpm test:e2e` exited 0 with 28 passed (14 desktop + 14 mobile). [Final browser JUnit](../../evidence/brd-01-local/e2e.junit.xml).
- Browser evidence: two institutions/two Greenwood branches and all three palettes; exact support feedback; four unknown/case/prototype/partial slugs return 404 without school fallback. Missing/invalid email and short password block submission. Valid and repeated sample submissions clear both fields, reset reveal and focus information, remain on the same preview URL, make no mutating requests and leave cookies/localStorage/sessionStorage unchanged. Keyboard email→password→reveal order, 360px viewport, reduced motion and synthetic contract-length DOM label stress at 360px/200% CSS layout zoom pass. DOM label stress tests layout only; unit tests independently verify actual DTO bounds. Native browser zoom remains a manual gate.
- `pnpm build`: final source exit 0, production compilation/typechecking/route generation passed. Build ID recorded in the [demo identity](../../evidence/brd-01-local/verification.json).
- `pnpm start`: stable production session 65805 at http://127.0.0.1:3400. HTTP health reports ready=true. Each of the three production sign-in routes returned 200 with its correct institution/branch/palette and explicit non-authentication notice; no database URL appears in markup. The prior accepted DS demo was stopped for the authorized update.
- `pnpm check:docs` and `git diff --check` passed after evidence/document updates.

Reviewed desktop North and 360px Clay/South screenshots: institution/branch identity, shared form labels, preview notice, reveal focus outline and submit controls remain visible and in bounds. [North desktop](../../evidence/brd-01-local/greenwood-north-desktop.png), [South desktop](../../evidence/brd-01-local/greenwood-south-desktop.png), [Aster desktop](../../evidence/brd-01-local/aster-central-desktop.png), [South 360px](../../evidence/brd-01-local/greenwood-south-360px.png). Other screenshots/layout stress outputs stay in ignored local artifacts.

Manual review:

1. Open http://127.0.0.1:3400/sign-in/greenwood-north (Forest), /sign-in/greenwood-south (Clay) and /sign-in/aster-central (Indigo). Expect distinct branch/institution identity, correct palette and explicit design-preview notice.
2. Submit empty/invalid sample fields. Expect native validation and no preview success or navigation. Use synthetic values only, such as synthetic@school.example and sample-only-123.
3. Reveal the sample password and submit valid samples. Expect both fields to clear, password to become hidden, and focus to move to Preview information stating no credentials were sent/stored. Repeat; expect the same behavior.
4. Click Need help on each preview. Expect that profile’s synthetic support address and focused informational summary, with no recovery/activation claim.
5. Open /sign-in/not-a-school. Expect 404 and no fallback school. Narrow to 360px or try native browser 200% zoom; inspect labels, controls and keyboard navigation.

Limitations: no real authentication/session, account recovery, tenant provisioning, entitlement permission, persistent branding, logo upload, custom host, CSP asset pipeline or publish/cache workflow is implemented by BRD-01. Only synthetic profiles and local code-drawn illustration are used. Native browser zoom, VoiceOver/NVDA, Safari/Firefox and full accessibility certification remain release checks; CSS zoom is not a native browser zoom certification. Human acceptance remains PENDING for this source. Next action: keep the demo stable and await owner feedback before IAM-01 or any other task.

### BRD-01 owner acceptance — 3 October 2026

Owner feedback: “Pass, please go-ahead and implement the next task”. Human review PASSED for source e95ee2d4a982e971b310e950916f11a3eec00737. IAM-01 authorized; pause again at its demo review.

### BRD-02 selected — 4 October 2026

Selected by `pnpm next-task` after TEN-02 and IAM-03 reached VERIFIED (both reviews PENDING) and BRD-01 was PASSED. Intended demo: an authorized branch administrator edits a safe logo and palette/welcome, previews and publishes a versioned public brand, sees that exact identity on the branch sign-in, and can create a new rollback version. Unauthorized branch edits and unknown slug/host fail closed; successful credentials still resolve only current authorized memberships. Read the branding LLD/task/state, connected DB contract, backend extraction and installed Next Route Handler/caching/image docs. Existing sign-in uses global credentials with an access-only session; public slug routes are preview-only. No branding tables or storage port exist yet. Working-tree review found the unrelated untracked `.puku-cli/`; preserve and exclude it.

### Portal palette propagation checkpoint — 5 October 2026

The authenticated workspace reads only the approved published palette for the active verified organization/branch member. A published branch profile overrides the institution default; drafts never affect another page/user. This read returns only an allowlisted palette token and adds no branding-management capability. The admin/teacher layouts are dynamic and uncached; branch switching reloads scope and theme, and successful publish/rollback refreshes the shell. The local branding preview uses production primitives in an isolated subtree and cancel removes it without persisting. A file-upload refresh now preserves unsaved palette/form edits instead of resetting them to the previous draft.

Verification: real PostgreSQL functional branding coverage confirms active-member authorization, foreign-scope denial, draft isolation, publish propagation and rollback. The full functional suite passed 102/102. Desktop/mobile Playwright branding journeys passed 1/1 each and `/design-system` passed 8/8. No schema or migration changed. Broad route-by-route rendered review and human visual acceptance remain pending; `BRD-02` stays VERIFIED/PENDING and VoiceOver/NVDA remain independent accessibility gates.
