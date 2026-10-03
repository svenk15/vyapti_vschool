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

Preview data is synthetic. Branded `/sign-in/<slug>` screens remain non-authenticating previews; `/sign-in` provides real IAM-01 administrator authentication and `/admin` checks current school access. Module activation and other school business workflows remain planned. IAM-01 installs access bootstrap and shared evidence tables alongside SetupCheck. Reference entitlement policies do not yet provide production module enforcement. See [verification](docs/VERIFICATION.md).

Database design uses VS-branded physical names with explicit Prisma mappings. [Database design](docs/DATABASE_DESIGN.md) indexes 47 table contracts and links their complete module LLDs; 10 tables are migrated for foundation and IAM-01. pnpm check includes a naming/catalog consistency gate.

Portable backend lives in backend/modules and backend/composition. Next hosting adapters live in lib/server and browser-safe contracts in shared/contracts. [NestJS extraction contract](docs/BACKEND_EXTRACTION.md) explains what is reused, which adapters change and the cutover tests. pnpm check includes independent backend compilation and dependency gates.

Local development database: vyapti_vschool. Dedicated test database: vyapti_vschool_test. Existing database rename instructions are in START_ON_MAC.md; credentials and migration history are preserved.

## IAM-01 local administrator demo

Run `pnpm setup:auth` once to create private authentication-only `.env.local` while preserving `.env`; existing files are preserved. Run `pnpm db:setup`, then `pnpm demo:access` to provision one synthetic institution/school/admin atomically. Credentials are generated into ignored `artifacts/iam-01/private-demo.json` with mode 0600; rerunning preserves the demo. Start with `pnpm build && pnpm start` and open http://127.0.0.1:3400/sign-in.

For a separately verified local operator, `pnpm provision-school --organizationName '<institution>' --schoolCode MAIN --schoolName '<school>' --timezone Asia/Kolkata --adminEmail '<administrator email>'` prompts for a hidden password. `--password-stdin` supports a private pipe. Never pass passwords as command arguments. The command requires the configured operator UUID, only targets local `vyapti_vschool`, refuses duplicate institution names/emails, and has no public HTTP provisioning endpoint. File/terminal access establishes this local operator trust boundary; production operator controls are FND-02 work.

Sessions last eight hours. Five failed credential comparisons lock an active account for 15 minutes; disabled, unknown, wrong and locked credentials share generic feedback. Membership/status/tokenVersion changes are checked on every protected server request. Setup currently describes the next task; editable settings/staff are IAM-02. No business module is enabled by this bootstrap.
