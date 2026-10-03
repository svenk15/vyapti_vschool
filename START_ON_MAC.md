# Run VSchool on your Mac

Use a new folder named `vyapti_vschool`, outside the existing project. No Git reset/revert or old database migration is needed. Keep the previous project backup intact.

## 1. Open the new project

Extract the ZIP, open VS Code → File → Open Folder → vyapti_vschool, then Terminal → New Terminal. Verify `pwd` ends in this new folder. Commands below run there.

```bash
node --version
pnpm --version
```

Target Node 24.x and pnpm 11.25.0. If Node 24 is already installed, keep it. If necessary, `brew install node@24`, then follow Homebrew's displayed PATH instruction for your Mac architecture. If pnpm is missing or different, `npm install --global pnpm@11.25.0`; do not use sudo to repair an existing permission problem. This package-manager version is deliberately pinned to the toolchain used for this starter, not an instruction to upgrade your older project.

## 2. Install locked dependencies

```bash
pnpm install --frozen-lockfile
```

Do not replace the lockfile on an install failure. Save the error and ask the agent to diagnose it. Approved package build scripts are explicitly listed in pnpm-workspace.yaml.

## 3. Start your existing PostgreSQL service

```bash
brew services start postgresql@16
```

The setup script defaults to port 5432 and your macOS username as the local database administrator. If you configured another port, prefix the setup command with `PGPORT=your_port`; for another administrator use `PGUSER=your_role`. Password-protected local admins may need PGPASSWORD supplied privately; never paste it into chat or commit it.

## 4. Create a separate database and migrate it

```bash
pnpm setup:local
pnpm db:setup
```

Creates a new limited login role/database `vyapti_vschool`, writes a generated private connection to .env, then applies the starter migration chain and idempotent marker. It does not seed school users or student records. Re-running preserves existing configuration. If that role/database already exists without .env, the script stops rather than adopting or deleting it; have the agent inspect the conflict. An interrupted CREATE DATABASE may leave its role behind; do not remove it blindly.

## 5. Check and run

```bash
pnpm check
pnpm dev
```

Open http://127.0.0.1:3400. You should see the new landing page and Database connected. Open `/design-system` to inspect the controls, `/configure` to compare branch/module choices and `/sign-in/greenwood-north` to review a branded login preview. Use sample details only: the preview does not authenticate or save configuration. Keep this terminal running; use a second VS Code terminal for commands. Ctrl+C stops only this server. If port 3400 is busy, identify its owner before stopping a process; do not kill every Node process.

## 6. Verify the database and browser tests

In another terminal:

```bash
pnpm setup:local --test
pnpm test:functional
pnpm exec playwright install chromium
pnpm test:e2e
pnpm build
```

Tests use only `vyapti_vschool_test`, port 3401 for the browser server, and refuse unexpected database names/hosts. Browser tests start and stop their own server, never reuse your demo. Functional tests remove only their randomly named marker rows, not all tables or the database. Reports are under artifacts/. A PostgreSQL URL option such as `?schema=...` is rejected by the starter guard; this starter uses the default public schema.

## 7. Create your first local Git checkpoint

```bash
git init -b main
git status --short
```

Review the listed files; .env, generated clients, node_modules and artifacts must be absent. Stage intended source/docs (your agent can prepare the explicit list), inspect `git diff --cached --stat` and the actual diff, then commit with `git commit -m "Initialize fresh VSchool foundation"`. Add a remote only after you choose a repository; no remote is bundled. Never put a password or real student data in Git.

## Troubleshooting

| What you see | Next action |
|---|---|
| Setup needed | Run setup:local, then restart dev server so it reads .env |
| Not connected | Verify PostgreSQL service/port; do not print the URL |
| Connection works / Schema ready | Run db:setup on the new project only |
| Test database missing | Run setup:local --test |
| Browser executable missing | Run playwright install chromium |
| pnpm check succeeds | Foundation checks passed; business workflows are still planned |

Do not send .env, database dumps, browser authentication state or real school CSVs for troubleshooting. Send the error code and sanitized output.

## Existing fresh starter upgrade

If this exact independent fresh project already has its own .env, preserve it and its Git history. Stop its previous server, review the updated source/doc changes, install the frozen lockfile, then run pnpm db:setup and pnpm check before restarting. The forward VS migration preserves the marker row and its timestamp. Do not extract over an older unrelated VSchool/SchoolOS repository or reuse that database.

## Existing database rename

If you already created vschool_fresh_dev, stop this project's dev server and test processes first. Keep your existing .env; do not delete the database or recreate its users. Open a terminal with your existing local PostgreSQL administrator configuration (the default Homebrew administrator is your macOS user), then run:

```bash
psql -h 127.0.0.1 -p 5432 -d postgres -c 'ALTER DATABASE vschool_fresh_dev RENAME TO vyapti_vschool;'
```

Use your actual PostgreSQL port/administrator if different. The command refuses a name collision or active connections; inspect those conditions rather than terminating unrelated sessions. Database contents, owner role and migration history remain intact. Update only the database path at the end of DATABASE_URL in your private .env from /vschool_fresh_dev to /vyapti_vschool. Keep its username/password unchanged; an existing role need not have the same name as the renamed database.

If your old dedicated test database also exists, rename it separately:

```bash
psql -h 127.0.0.1 -p 5432 -d postgres -c 'ALTER DATABASE vschool_fresh_test RENAME TO vyapti_vschool_test;'
```

Update only TEST_DATABASE_URL's database path, keeping its credentials. If no test database exists, use pnpm setup:local --test instead. Do not run an ALTER command for a database that was never created. Then run pnpm db:setup, pnpm check, pnpm test:functional and pnpm dev. Never paste private connection strings into chat.
