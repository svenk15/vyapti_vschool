# School branding and sign-in identity — tasks

Read DESIGN.md and Bible v4.1. These are vertical slices; previews do not prove persistence or authorization.

## BRD-01 — Review reusable brand palettes and school login previews

Depends on: FND-01, DS-01

### Implementation instructions

Review the included synthetic fixture profiles, palette validator and school sign-in pages. Verify two institutions and two branches, unknown slug not-found, labeled inputs, password reveal and explicit non-auth preview result. Update source/evidence after owner visual review; no credentials should be sent/stored.

### Acceptance and test strategy

Run pnpm check, applicable PostgreSQL functional and Playwright suites, and production build. Capture source fingerprint/commit and actual test commands/exits. Validate the documented negative cases, not only the happy path. Update module state and affected Bible/ADRs in the same checkpoint.

### Demo and checkpoint

Open Greenwood North, Greenwood South and Aster Central sign-in URLs. Compare identity/palette. Use sample form values and confirm preview message, not a signed-in session.

Start/check the server, give URL and steps, request user review, and mark review PENDING. Do not mark human acceptance until actual feedback.

## Experience overlay consumption

EX-05 adopts the approved branding workspace through the existing draft, isolated preview, publish, rollback and public-brand contracts. Prototype branding never grants tenant access, and no presentation change broadens host verification or asset policy.

## BRD-02 — Publish authorized school branding and connect real sign-in

Depends on: TEN-02, IAM-03, BRD-01

### Implementation instructions

Implement BrandProfile/Revision/Asset/VerifiedBrandHost and preview/publish/rollback contracts. Add safe logo pipeline and exact public DTO. Integrate real NextAuth flow with current tenant membership and context selector. Unknown host/slug fails closed; no arbitrary CSS or redirects. Validate exact scoped asset refs, canonical PNG sanitization, contrast, stale/publication races, evidence rollback, immutable history, wrong-host mapping, no-store public identity and mobile/keyboard error states. Custom-host use also requires the separately provisioned TLS/trusted-forwarding release condition in DESIGN.md.

### Acceptance and test strategy

Run pnpm check, applicable PostgreSQL functional and Playwright suites, and production build. Capture source fingerprint/commit and actual test commands/exits. Validate the documented negative cases, not only the happy path. Update module state and affected Bible/ADRs in the same checkpoint.

### Demo and checkpoint

Edit a branch logo/palette/welcome, preview and publish; open canonical sign-in; unauthorized branch edit denied; rollback produces a new version and actual sign-in reaches only permitted branches.

Start/check the server, give URL and steps, request user review, and mark review PENDING. Do not mark human acceptance until actual feedback.
