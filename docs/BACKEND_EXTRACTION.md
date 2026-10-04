# Portable backend and future NestJS extraction — v4.4

## Decision — CORE-012

Build a modular monolith now with a physically separate portable backend. Next.js owns presentation and its delivery adapters. A future NestJS host owns HTTP controllers, authentication transport, dependency injection, lifecycle and operations. Neither framework owns domain rules. Extraction should replace hosting and transport adapters while preserving domain/application code and module persistence contracts. It is not a promise of zero work: deployment, authentication/session boundaries and network failures still need implementation and verification.

## Actual starter structure

| Location | Responsibility | Future disposition |
|---|---|---|
| `app/`, `components/` | Next.js pages, HTTP delivery and shared UI | Remain in frontend project |
| `lib/server/` | Next-specific server/BFF adapter; reads environment, imports server-only | Replace local invocation with authenticated API gateway when extracting |
| `backend/modules/<module>/domain/` | Entities, values, invariants and pure rules | Reuse unchanged |
| `backend/modules/<module>/application/` | Use cases and required ports | Reuse unchanged |
| `backend/modules/<module>/contracts/` | Owner-approved cross-module server interfaces | Reuse unchanged; do not expose repositories to browser |
| `backend/modules/<module>/infrastructure/` | Prisma/provider adapters | Reuse with configuration/lifecycle review |
| `backend/composition/` | Framework-free factories, dependencies supplied by hosting adapter | Register factories as Nest providers |
| `shared/contracts/` | Browser-safe DTOs, public manifests and palette/validation primitives | Shared versioned package or generated compatible API client |
| `prisma/` | Schema and one authoritative forward migration history | Backend owns migration execution; frontend stops connecting to PostgreSQL |
| `test/unit/` and relevant functional suites | Domain, use-case and storage proofs | Retain for backend; add transport contract tests |
| `test/e2e/` | User journeys | Run frontend against actual Nest API after extraction |

Root package scripts still run Next.js and backend checks together; this is not a preinstalled NestJS service or a full workspace package split. `backend/tsconfig.json` checks portable source with Node types and no DOM/Next compiler plugin. Its current module configuration is ESNext/Bundler; the standalone host must explicitly choose compatible ESM/package resolution, build output and generated-client paths. Package-level publishing and dependency manifests are an extraction task, not assumed done.

## Enforced dependency direction

Domain depends only on domain values or safe shared contracts. Application depends on domain/ports and owner contracts. Infrastructure implements ports. Backend imports no Next.js, React, server-only, NestJS decorators or UI libraries. Future Nest decorators belong to a host adapter outside the portable backend. Neither core nor shared contracts reads process.env, cookies, headers, window or document. The hosting adapter resolves configuration and supplies it to factory constructors. Network, clock, IDs, authorization and storage are explicit ports.

Browser code imports shared contracts only, never backend repositories, use cases or composition. Client preview helpers are presentation calculations, not authorization. Protected commands always resolve/recheck account, membership, institution/branch scope, effective module and resource permissions in the server application. Cross-module imports use the owning module's contracts. Infrastructure-only ORM types cannot enter core parameters or response DTOs.

`pnpm check:boundaries` checks these static directions and `pnpm check:backend` compiles portable backend without UI types. These are architectural regression gates, not proof of authorization or every possible dynamic/transitive code behavior. Do not bypass the rules with a barrel, reflective dynamic import or untyped callback. Source review remains required.

## Current executable seam

`backend/composition/platform.ts` exports createPlatformServices({databaseUrl}), wiring the same GetSetupStatus application query to its Prisma adapter. It imports no hosting framework and does not read environment. `lib/server/platform.ts` supplies the Next.js environment and marks only the Next wrapper server-only. App page/health handlers use that wrapper. Shared synthetic branding/module previews import shared/contracts. This is a real separation, not an empty backend directory.

Each new business module must define a similar typed factory/service facade and a DTO contract. Route handlers and server actions validate transport, resolve authentication, invoke a named use case and serialize a response; they never perform domain decisions, raw Prisma writes or foreign-module mutations. A server action is an optional adapter, not the sole interface containing a business workflow. For business endpoints use the Bible's /api/v1 contracts; existing readiness endpoints keep their current operational paths.

## Stable transport and failure contract

Request/response contracts use JSON-safe explicit fields: IDs as strings, civil dates YYYY-MM-DD, instants ISO 8601, exact currency/amount representation, bounded page cursors and versioned enum/error labels. Do not expose Prisma objects, Next Request/Response, Nest ExecutionContext, JS Date instances or class-transformer/Nest DTO decorators to the portable use case. Runtime validation is reusable pure schema/function logic; any host validation/decorator wraps it. Error mapping is host-owned and consistent: unauthenticated/forbidden/not-found/validation/conflict/retryable failure must preserve module contracts without leaking foreign data.

Frontend server-side gateway helpers define module-specific interfaces; initially these may invoke local factories. Later an HTTP adapter implements the same interface. API_BASE_URL remains private server configuration rather than a browser-controlled destination. Browser interactions stay same-origin through the Next BFF where practical. No browser DATABASE_URL, service credential or Prisma import. A remote API migration must handle timeouts, cancellation, idempotency replay and unknown commit outcomes; never retry a monetary or attendance command with a new intent key because the network response was lost.

## Authentication and tenancy across the process boundary

A browser-supplied ActorContext is never authority. The Nest host authenticates the request and supplies a server-verified identity; application resolution still checks current grants/token revocation and current module configuration. If Next BFF forwards identity, define signed/audience-bound short-lived credentials or another reviewed authenticated session/token exchange; do not trust unsigned x-user/x-school headers merely because they came through a proxy. Specify issuer/audience/key rotation, service authentication, revocation, CSRF/origin, secure cookies and trusted proxy rules before cutover.

NextAuth 4.24.15 is the installed and locally verified hosting adapter. Credential/account activation/recovery domain rules and repositories must be framework-free; NextAuth-specific callbacks/cookies stay in delivery. During extraction either retain Next authentication with a reviewed API identity exchange or replace its host adapter. This is material migration work; it must not require rewriting pupil/attendance/finance rules. Tenant scope is request-local, never a singleton Nest provider's mutable currentSchool property. RLS scope remains transaction-local; background work carries explicit verified job scope.

## Step-by-step future extraction

1. Record the accepted source commit, API contracts, migration head and current test evidence. Keep Next functioning during the adapter transition.
2. Create the Nest project with a deliberately pinned compatible runtime/toolchain. Carry backend/, shared/contracts and prisma/ as a workspace package or unchanged source layout; regenerate the Prisma client rather than copying secrets/build artifacts. Keeping backend/ at project root preserves the current relative generated-client layout. Review generated output and ESM module resolution.
3. Register portable factories/use cases/repositories through Nest provider tokens/useFactory. Keep domain classes undecorated. Interfaces are erased at runtime; register explicit injection tokens instead of expecting an interface type to be a Nest DI token.
4. Implement thin controllers, identity adapter/guards, validation and error mapping for the exact versioned API contracts. Call the same application facades; no database CRUD in controllers.
5. Implement config/secrets, pool shutdown, workers/outbox, health/readiness, logging/rate limits, jobs and observability. Move migration ownership to the backend deployment; exactly one deployer runs migrations. Retain database identities and tenant constraints, not a duplicate database of school records.
6. Replace the Next local gateway with its HTTP implementation. Remove direct backend/Prisma imports and DB secrets from the frontend runtime. Keep shared UI/contracts and same user-facing routes.
7. Run the preserved unit/functional suites against real PostgreSQL; add controller/API compatibility, revoked identity, cross-tenant/branch denial, disabled module, replay/conflict, timeout and unknown-result tests. Run the same E2E journeys with Next and Nest running as separate processes.
8. Rehearse forward migration, backup/restore, deployment and rollback with compatible clients. Do not run two independent command owners or outbox workers that duplicate effects during cutover. Record the demonstrated commit/endpoints and owner acceptance in module CURRENT_STATE.

## Per-module implementation/review checklist

- Model invariants and use cases live under backend/modules, with no framework imports.
- Actor/scope/module/resource checks live in application policy and guarded transactions, not only route middleware.
- Storage/provider calls use ports; public DTOs are explicit and transport neutral.
- Route/server-action code is thin, and frontend uses the documented module gateway.
- Unit tests exercise the core without Next; PostgreSQL tests exercise persistence and isolation; API/E2E tests exercise adapters.
- Add/update this extraction contract, owning LLD and task evidence when a new host dependency is required.

NestJS references: [providers](https://docs.nestjs.com/providers), [controllers](https://docs.nestjs.com/controllers). Nest hosting/DI wrappers will be implemented at extraction time; no Nest runtime has been installed or validated in this starter.
