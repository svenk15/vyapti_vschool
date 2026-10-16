import fs from "node:fs";
import os from "node:os";
import crypto from "node:crypto";
import { Client } from "pg";
import { parse } from "dotenv";
const isTest = process.argv.includes("--test");
const db = isTest ? "vyapti_vschool_test" : "vyapti_vschool";
const key = isTest ? "TEST_DATABASE_URL" : "DATABASE_URL";
const envFile = new URL("../.env", import.meta.url);
const existing = fs.existsSync(envFile) ? parse(fs.readFileSync(envFile)) : {};
if (existing[key]) {
  let configured;
  try { configured = new URL(existing[key]); } catch { configured = undefined; }
  if (!configured || configured.pathname !== `/${db}`) {
    console.error(`${key} points to a different database. Preserved .env without changes. See START_ON_MAC.md: Existing database rename.`);
    process.exit(1);
  }
  console.log(
    `${key} already exists. Preserved it without changes. Next: ${isTest ? "pnpm test:functional" : "pnpm db:setup"}`,
  );
  process.exit(0);
}
const port = Number(process.env.PGPORT || 5432);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("PGPORT must be a valid port number.");
  process.exit(1);
}
const admin = process.env.PGUSER || os.userInfo().username;
const password = crypto.randomBytes(24).toString("hex");
const client = new Client({
  host: "127.0.0.1",
  port,
  user: admin,
  password: process.env.PGPASSWORD,
  database: "postgres",
  connectionTimeoutMillis: 5000,
});
try {
  await client.connect();
  const present = await client.query(
    "SELECT 1 FROM pg_database WHERE datname=$1 UNION ALL SELECT 1 FROM pg_roles WHERE rolname=$1",
    [db],
  );
  if (present.rowCount) throw new Error("ALREADY_EXISTS");
  // Fixed identifiers and a generated hex password; no user text interpolated into SQL.
  await client.query(
    `CREATE ROLE "${db}" LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD '${password}'`,
  );
  await client.query(
    `CREATE DATABASE "${db}" OWNER "${db}" ENCODING 'UTF8' TEMPLATE template0`,
  );
  const connection = `postgresql://${db}:${password}@127.0.0.1:${port}/${db}`;
  fs.appendFileSync(envFile, `\n${key}="${connection}"\n`, { mode: 0o600 });
  fs.chmodSync(envFile, 0o600);
  console.log(`Created a dedicated local database and role: ${db}.`);
  console.log(`Saved ${key} privately in .env. No credentials printed.`);
  console.log(
    `Next: ${isTest ? "pnpm test:functional" : "pnpm db:setup, then pnpm dev"}`,
  );
} catch (error) {
  if (error instanceof Error && error.message === "ALREADY_EXISTS")
    console.error(
      "A database or role with this starter name already exists. Nothing was overwritten. Restore its existing .env or ask for help inspecting that local setup.",
    );
  else
    console.error(
      "Local setup failed. Check PostgreSQL, PGPORT and PGUSER. If the local admin requires a password, supply PGPASSWORD securely. Nothing was deleted. An interrupted create may need inspection before retry.",
    );
  process.exitCode = 1;
} finally {
  await client.end();
}
