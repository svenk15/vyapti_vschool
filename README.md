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

Preview data is synthetic. Branded `/sign-in/<slug>` screens remain non-authenticating previews; `/sign-in` provides real IAM-01 administrator authentication and `/admin` checks current school access. TEN-02 provides entitlement and branch activation; ACA-01 now provides academic setup. Remaining school business workflows remain planned. IAM-01 installs access bootstrap and shared evidence tables alongside SetupCheck. Reference entitlement policies do not yet provide production module enforcement. See [verification](docs/VERIFICATION.md).

Database design uses VS-branded physical names with explicit Prisma mappings. [Database design](docs/DATABASE_DESIGN.md) indexes 48 table contracts and links their complete module LLDs; BRD-02 applied its branding migrations, and ACA-01 adds six academic setup tables, bringing the local migrated set to 29 tables. pnpm check includes a naming/catalog consistency gate.

Portable backend lives in backend/modules and backend/composition. Next hosting adapters live in lib/server and browser-safe contracts in shared/contracts. [NestJS extraction contract](docs/BACKEND_EXTRACTION.md) explains what is reused, which adapters change and the cutover tests. pnpm check includes independent backend compilation and dependency gates.

Local development database: vyapti_vschool. Dedicated test database: vyapti_vschool_test. Existing database rename instructions are in START_ON_MAC.md; credentials and migration history are preserved.

## Synthetic local demo data

Run `pnpm demo:seed` to prepare the implemented IAM-01/IAM-03, TEN-01/TEN-02, ACA-01, BRD-02 and IMP-01 demos in the guarded local development database. It composes their existing feature-owned provisioners; reruns preserve their private artifacts and reuse their command keys. Generated email addresses use `vschool.example`; outbound mail is not sent. The command prints private file locations only, never passwords or tokens. It refuses any database other than local `vyapti_vschool` and does not reset or delete rows.

The seed prepares IAM access/activation, tenant context and a deliberately unreleased Attendance entitlement, Academic access, a published synthetic brand and a fictional roster CSV for preview. It does not unlock Attendance or PER-02, infer IAM-03 acceptance or seed the IAM-04 test-cluster demo. The IMP-01 sample is an upload file only; previews do not write students. Existing STU-01/STU-02 synthetic records are retained and not recreated. Use the task-specific URLs and 3–5 step manual journeys in each module's [current state](docs/modules/access/CURRENT_STATE.md), [tenancy](docs/modules/tenancy/CURRENT_STATE.md), [branding](docs/modules/branding/CURRENT_STATE.md), [academics](docs/modules/academics/CURRENT_STATE.md), [people](docs/modules/people/CURRENT_STATE.md), [students](docs/modules/students/CURRENT_STATE.md) and [imports](docs/modules/imports/CURRENT_STATE.md). Credentials remain in ignored mode-0600 files such as `artifacts/iam-01/private-demo.json`, `artifacts/iam-03/private-demo.json` and `artifacts/iam-03/private-activation.json`; the roster sample is `artifacts/imports-01/sample-roster.csv`.

## IAM-01 local administrator demo

Run `pnpm setup:auth` once to create private authentication-only `.env.local` while preserving `.env`; existing files are preserved. Run `pnpm db:setup`, then `pnpm demo:access` to provision one synthetic institution/school/admin atomically. Credentials are generated into ignored `artifacts/iam-01/private-demo.json` with mode 0600; rerunning preserves the demo. Start with `pnpm build && pnpm start` and open http://127.0.0.1:3400/sign-in.

For a separately verified local operator, `pnpm provision-school --organizationName '<institution>' --schoolCode MAIN --schoolName '<school>' --timezone Asia/Kolkata --adminEmail '<administrator email>'` prompts for a hidden password. `--password-stdin` supports a private pipe. Never pass passwords as command arguments. The command requires the configured operator UUID, only targets local `vyapti_vschool`, refuses duplicate institution names/emails, and has no public HTTP provisioning endpoint. File/terminal access establishes this local operator trust boundary; production operator controls are FND-02 work.

Sessions last eight hours. Five failed credential comparisons lock an active account for 15 minutes; disabled, unknown, wrong and locked credentials share generic feedback. Membership/status/tokenVersion changes are checked on every protected server request. Setup currently describes the next task; editable settings/staff are IAM-02. No business module is enabled by this bootstrap.

IAM-03 activation and recovery use the restricted local operator configuration.
New staff remain pending until the operator verifies the intended identity and
records a non-sensitive case reference and reason. Tokens are never emailed.

```sh
pnpm issue-activation --accountId <account UUID> --membershipIds <pending membership UUIDs separated by commas> --caseReference <case> --reason <non-sensitive reason> --output artifacts/private-activation-<unique>.json
pnpm recover-account --accountId <account UUID> --caseReference <case> --reason <non-sensitive reason> --output artifacts/private-recovery-<unique>.json
```

Open the newly created mode-0600 private file locally, paste its token into
`/activate`, and set a new password. Initial activation binds only the explicitly
selected pending memberships. Recovery immediately invalidates old sessions and
credentials across branches, preserving suspended/revoked memberships. The
operator flow rejects disabled accounts and never overwrites a private output
file. If private file writing fails after issuance, issue a fresh token using a
new path; the old token cannot be recovered from its stored hash.

`pnpm demo:activation` prepares synthetic private review instructions.
`pnpm demo:task IAM-03 3403` snapshots a committed standalone build for local
review while later tasks proceed. Snapshot output lives only in ignored artifacts;
this starts a localhost server and performs no deployment. To restart an older snapshot after further commits, pass its full tested commit SHA as the third argument. Set the process-only
`VSCHOOL_DEMO_URL` for operator instructions when reviewing on another port.
Functional/E2E commands accept test filenames after the command to run the
applicable slice; the guarded dedicated test database setup remains mandatory.


## TEN-01 institution and branch context

`pnpm demo:tenancy` uses the already provisioned synthetic IAM-01 administrator, verifies local configuration, creates a second branch and a second institution, and writes only IDs and a local URL to ignored mode-0600 `artifacts/tenancy-01/private-demo.json`. It never copies the account credentials. Sign in with the existing private IAM-01 file. Institution grant/membership changes use the trusted local terminal CLI; branch administrators cannot grant operational membership or enable modules:

```sh
pnpm institution-operator create-institution --organizationId <new UUID> --accountId <existing account UUID> --name '<institution>' --key <UUID> --reason '<non-sensitive reason>'
pnpm institution-operator set-institution-grant --organizationId <UUID> --accountId <existing account UUID> --status REVOKED --expectedVersion 1 --key <UUID> --reason '<non-sensitive reason>'
pnpm institution-operator set-branch-membership --organizationId <UUID> --schoolId <UUID> --accountId <existing account UUID> --status ACTIVE --roles '["SCHOOL_ADMIN"]' --expectedVersion 0 --key <UUID> --reason '<non-sensitive reason>'
```

`pnpm demo:task TEN-01 3404` snapshots a committed build for review. The institution/branch selector is request-authorized on every read and write; changing context requires confirmation and reloads the page. New branch metadata grants neither staff membership nor module access. The operator is local file/terminal trust; authenticated production operator controls and database RLS remain release gates.
