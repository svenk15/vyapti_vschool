# vyapti_vschool — experience and tenancy foundation

Start with [START_HERE.md](START_HERE.md). This independent Next.js / TypeScript / Prisma / PostgreSQL starter contains Bible v4.4, connected Phase 1 designs and execution tasks, and a runnable shared UI foundation.

| Route | What works now |
|---|---|
| `/` | Landing page, illustrative workspace and real database readiness |
| `/design-system` | Shared controls, form states, searchable/sortable/paginated table, keyboard tabs and dialogs |
| `/configure` | Synthetic institution/branch switching, module dependencies and temporary brand preview |
| `/sign-in/greenwood-north` | Forest school sign-in preview |
| `/sign-in/aster-central` | Indigo school sign-in preview |
| `/api/health`, `/api/health/live` | Database readiness and liveness |

Preview data is synthetic. Module activation is not persisted, sign-in does not authenticate, and school business workflows are planned tasks. Only SetupCheck is migrated in PostgreSQL. Reference domain policies are unit-tested, but do not yet provide production tenant isolation. See [verification](docs/VERIFICATION.md).

Database design uses VS-branded physical names with explicit Prisma mappings. [Database design](docs/DATABASE_DESIGN.md) indexes 47 table contracts and links their complete module LLDs; only vs_platform_setup_check is migrated. pnpm check includes a naming/catalog consistency gate.

Portable backend lives in backend/modules and backend/composition. Next hosting adapters live in lib/server and browser-safe contracts in shared/contracts. [NestJS extraction contract](docs/BACKEND_EXTRACTION.md) explains what is reused, which adapters change and the cutover tests. pnpm check includes independent backend compilation and dependency gates.

Local development database: vyapti_vschool. Dedicated test database: vyapti_vschool_test. Existing database rename instructions are in START_ON_MAC.md; credentials and migration history are preserved.
