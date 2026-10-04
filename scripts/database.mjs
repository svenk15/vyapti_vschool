import "dotenv/config";
import { spawnSync } from "node:child_process";
import { Client } from "pg";
const mode=process.argv[2];
if (!["dev","functional","e2e"].includes(mode)) throw new Error("Choose dev, functional or e2e.");
const key=mode==="dev"?"DATABASE_URL":"TEST_DATABASE_URL";
const value=process.env[key];
let url; try {url=new URL(value??"");} catch {console.error(`Missing ${key}. Run pnpm setup:local${mode==="dev"?"":" --test"}.`);process.exit(1);}
const expected=mode==="dev"?"/vyapti_vschool":"/vyapti_vschool_test";
if (!["postgres:","postgresql:"].includes(url.protocol)||!["localhost","127.0.0.1","[::1]"].includes(url.hostname)||url.pathname!==expected||url.search) {console.error("Refusing an unexpected database target or URL options.");process.exit(1);}
const env={...process.env,DATABASE_URL:value,TEST_DATABASE_URL:mode==="dev"?process.env.TEST_DATABASE_URL:value};
function run(path,args){const r=spawnSync(process.execPath,[path,...args],{env,stdio:"inherit"});if(r.status!==0)process.exit(r.status??1);}
run("node_modules/prisma/build/index.js",["generate"]);
run("node_modules/prisma/build/index.js",["migrate","deploy"]);
const client=new Client({connectionString:value,connectionTimeoutMillis:5000});
try {await client.connect();await client.query('INSERT INTO vs_platform_setup_check (id) VALUES ($1) ON CONFLICT (id) DO NOTHING',["starter"]);} finally {await client.end();}
if(mode==="functional")run("node_modules/vitest/vitest.mjs",["run","--config","vitest.functional.config.ts",...process.argv.slice(3)]);
else if(mode==="e2e")run("node_modules/@playwright/test/cli.js",["test",...process.argv.slice(3)]);
else console.log("Fresh development database is ready. Run pnpm dev.");
