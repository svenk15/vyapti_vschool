# School branding and sign-in identity — current state

BRD-01 locally verified on 3 October 2026; owner review pending. No active timer. Public previews do not imply authentication or tenant access.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| BRD-01 | VERIFIED | PENDING | [Local evidence](../../evidence/brd-01-local/verification.json); 38 unit, 4 PostgreSQL and 28 browser tests passed |
| BRD-02 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |

## Implemented now

Validated palette/brand primitives and exact synthetic profile resolution; Forest, Clay and Indigo branded previews; native sample validation, reveal reset and focused informational feedback; long-label wrapping. No credentials sent/stored by the application, auth success, asset upload or persistent brand publishing.

## Next action

Pause for explicit BRD-01 demo feedback. Repair failed feedback first. After acceptance and permission to continue, run pnpm next-task (expected IAM-01). Do not start another task while this review is pending.

## Evidence and feedback

Append exact source revision, test reports, DB migration state, demo identity, limitations and human feedback here. No live institution or pupil data is bundled.

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
