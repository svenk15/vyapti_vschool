# EX-05 design delta

Date: 2026-10-10

## Target and existing operations

- Approved workflows: SA-04 through SA-08, with this slice implementing the existing-operation subset for school overview, setup, school settings and sign-in branding.
- Routes: `/admin`, `/admin/setup`, `/admin/school`, `/admin/branding`.
- Existing portable operations remain owned by Access, Reporting and Branding. The page and client components continue to call the existing server gateways and HTTP adapters; no Prisma access or business rule is added to a page.
- Today cards use `reportingGateway.overview` with the current school-local date and its returned `asOf`/owner totals. No prototype count or client-side page count is used.

## Read/write and authorization contract

- Reads: Access School/current context; Reporting attendance aggregates; Branding profile, draft, published revisions, assets and host state.
- Writes: Access `UpdateSchool` and `CreateCampus`; Branding create profile, preview, save draft, upload sanitized logo, publish, republish revision and host verification.
- Every protected read and write retains current account, membership, organization, school, capability and module checks. Public branding recognition grants no tenant access.
- Existing branch timezones are immutable in the approved SA-06 contract. The settings UI renders the value read-only, and the locked Access repository rejects any submitted value different from the stored School row with `TIMEZONE_IN_USE`. Branch creation remains the point at which timezone is selected. No schema or migration changes are required.

## Transactions, versions and recovery

- Access mutations retain the existing account/organization/school lock order, expected version, idempotency receipt and atomic audit/outbox transaction.
- Branding mutations retain profile version and command-key handling. Draft preview remains private; publish and republish create immutable revisions.
- Unknown Access command outcomes continue to retain the same key for retry. Branding failures remain explicit and focus their status message; no success is shown before the server response.

## Presentation and failure states

- Setup uses separate school-information and staff-access work areas rather than adjacent unlabelled actions.
- Branding uses one constrained identity editor, one primary publish action, a separate private preview, revision history and collapsed advanced host controls.
- Service, permission, unavailable aggregate, validation, conflict and stale-version behavior remain visible through the existing route and command feedback states.

## Focused verification

- Access unit/application and real PostgreSQL tests: name update/replay/stale behavior, immutable timezone rejection, rollback, authorization and scoped persistence.
- Playwright: settings happy path, forged timezone rejection, campus conflict, unknown-outcome replay, branding create/preview/logo/draft/publish/republish, public branded sign-in, cross-tenant denial, desktop/mobile overflow and advanced-control disclosure.
- Desktop/mobile screenshots are reviewed for hierarchy, spacing, form width and overflow. Human visual acceptance remains pending.

## Remaining owner gaps

- Approved branch contact email, phone, address and revision-comparison UI are not present in the current Access schema/DTO and are not fabricated in this presentation slice.
- Commercial module requests, browser operator operations and production custom-host activation remain outside the existing school-admin contract.
