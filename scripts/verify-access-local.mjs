// Local operator verification only: synthetic provision, real HTTP session,
// migration history, and separate temporary failure servers. No DB reset.
import { config } from "dotenv";
import { Client } from "pg";
import { randomBytes,randomUUID,createHash } from "node:crypto";
import { readFileSync,writeFileSync,mkdirSync } from "node:fs";
import { spawn,spawnSync } from "node:child_process";
import assert from "node:assert/strict";
config({path:".env.local",quiet:true});config({quiet:true});
const base="http://127.0.0.1:3400",demo=JSON.parse(readFileSync("artifacts/iam-01/private-demo.json","utf8")),report={observedAt:new Date().toISOString(),checks:[]};
const envHash=createHash("sha256").update(readFileSync(".env")).digest("hex");
const check=(name)=>report.checks.push({name,passed:true});
const jar=new Map();
function cookieHeader(){return [...jar].map(([key,value])=>`${key}=${value}`).join("; ");}
function saveCookies(response){for(const cookie of response.headers.getSetCookie()){const pair=cookie.split(";")[0],separator=pair.indexOf("=");const key=pair.slice(0,separator),value=pair.slice(separator+1);if(value)jar.set(key,value);else jar.delete(key);}}
async function request(path,options={}){const response=await fetch(base+path,{...options,redirect:"manual",headers:{cookie:cookieHeader(),...options.headers},signal:AbortSignal.timeout(10000)});saveCookies(response);return response;}
function cli(input,extraEnv={}){const args=Object.entries(input).filter(([key])=>key!=="password").flatMap(([key,value])=>[`--${key}`,value]);return spawnSync(process.execPath,["--import","tsx","scripts/provision-school.ts",...args,"--password-stdin"],{env:{...process.env,...extraEnv},input:input.password+"\n",encoding:"utf8",timeout:20000});}
async function temporary(overrides,action){
 const origin="http://127.0.0.1:3402",child=spawn(process.execPath,["node_modules/next/dist/bin/next","start","--hostname","127.0.0.1","--port","3402"],{env:{...process.env,NEXTAUTH_URL:origin,...overrides},stdio:["ignore","pipe","pipe"]});
 let logs="";child.stdout.on("data",chunk=>{logs+=chunk;});child.stderr.on("data",chunk=>{logs+=chunk;});
 try{
  let ready=false;for(let i=0;i<60;i++){try{if((await fetch(origin+"/api/health/live",{signal:AbortSignal.timeout(1000)})).ok){ready=true;break;}}catch{}await new Promise(resolve=>setTimeout(resolve,250));}
  assert(ready);await action(origin);assert(!logs.includes(process.env.NEXTAUTH_SECRET));assert(!logs.includes(demo.password));
 }finally{child.kill("SIGTERM");await new Promise(resolve=>{child.once("exit",resolve);setTimeout(()=>{child.kill("SIGKILL");resolve();},5000).unref();});}
}
async function run(){
 const client=new Client({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:5000});
 const target=new URL(process.env.DATABASE_URL??"");assert.equal(target.pathname,"/vyapti_vschool");assert(["127.0.0.1","localhost","[::1]"].includes(target.hostname));await client.connect();
 let foreign;
 try{
  const organization=(await client.query("SELECT name FROM vs_access_organization WHERE id=$1",[demo.organizationId])).rows[0];
  const duplicate={organizationName:organization.name,schoolCode:"MAIN",schoolName:demo.schoolName,timezone:"Asia/Kolkata",adminEmail:demo.email,password:demo.password};
  const result=cli(duplicate);assert.equal(result.status,1);assert.equal(result.stderr.trim(),"PROVISION_CONFLICT");check("CLI duplicate refuses without implicit recovery");
  assert.equal(cli({...duplicate,timezone:"Invalid/Zone"}).stderr.trim(),"VALIDATION");assert.equal(cli(duplicate,{VSCHOOL_OPERATOR_ID:"unverified"}).status,1);assert.equal(cli(duplicate,{DATABASE_URL:process.env.TEST_DATABASE_URL}).status,1);check("CLI invalid zone, operator and database guards");
  const suffix=randomUUID(),input={organizationName:`Synthetic CLI verification ${suffix}`,schoolCode:"MAIN",schoolName:"Synthetic foreign scope",timezone:"Asia/Kolkata",adminEmail:`cli-${suffix}@vschool.example`,password:randomBytes(24).toString("base64url")};
  const created=cli(input);assert.equal(created.status,0);foreign=JSON.parse(created.stdout);assert.equal((await client.query("SELECT count(*)::int AS count FROM vs_platform_audit_entry WHERE resource_id=$1",[foreign.schoolId])).rows[0].count,1);check("Restricted CLI provisions a synthetic school with atomic evidence");report.foreignSchoolId=foreign.schoolId;
 }finally{await client.end();}
 const previous=JSON.parse(readFileSync("docs/evidence/fnd-01-local/verification.json","utf8"));report.databases=[];
 for(const [name,value] of [["vyapti_vschool",process.env.DATABASE_URL],["vyapti_vschool_test",process.env.TEST_DATABASE_URL]]){
  const db=new Client({connectionString:value,connectionTimeoutMillis:5000});assert.equal(new URL(value).pathname,"/"+name);await db.connect();try{
   const migrations=(await db.query('SELECT migration_name,finished_at IS NOT NULL AS applied,rolled_back_at IS NOT NULL AS rolled_back FROM "_prisma_migrations" ORDER BY migration_name')).rows;assert.equal(migrations.length,4);assert(migrations.every(m=>m.applied&&!m.rolled_back));
   const marker=(await db.query("SELECT id,created_at FROM vs_platform_setup_check WHERE id='starter'")).rows;assert.equal(marker[0].created_at.toISOString(),previous.databases.find(d=>d.database===name).marker[0].created_at);
   const tables=(await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'vs_%' ORDER BY table_name")).rows.map(r=>r.table_name);assert.equal(tables.length,10);report.databases.push({database:name,migrations,marker,tables});
  }finally{await db.end();}
 }check("Both databases preserve foundation marker timestamps and all migration history");
 const health=await request("/api/health");assert.equal(health.status,200);assert.equal((await health.json()).ready,true);check("Production health ready");
 assert.equal((await request("/api/v1/school")).status,401);assert.equal((await request("/admin")).status,307);check("Logged-out production routes deny access");
 const csrf=await(await request("/api/auth/csrf")).json();
 const login=await request("/api/auth/callback/credentials",{method:"POST",headers:{origin:base,"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({email:demo.email,password:demo.password,csrfToken:csrf.csrfToken,callbackUrl:base+"/admin",json:"true"})});assert.equal(login.status,200);assert.equal(new URL((await login.json()).url).pathname,"/admin");
 const signedCookie=cookieHeader(),home=await request("/api/v1/school");assert.equal(home.status,200);assert.equal((await home.json()).scope.schoolId,demo.schoolId);assert.equal((await request(`/api/v1/school?schoolId=${foreign.schoolId}`)).status,404);assert.equal((await request("/admin/setup")).status,200);check("Production login, own scope, foreign denial and setup");
 await temporary({DATABASE_URL:"postgresql://unavailable@127.0.0.1:1/vyapti_vschool"},async origin=>{
  const denied=await fetch(origin+"/api/v1/school",{headers:{cookie:signedCookie}});assert.equal(denied.status,503);assert.deepEqual(await denied.json(),{error:"SERVICE_UNAVAILABLE"});
  const page=await fetch(origin+"/admin",{headers:{cookie:signedCookie}});assert((await page.text()).includes("School service unavailable"));
  const authCsrfResponse=await fetch(origin+"/api/auth/csrf");const authCsrf=await authCsrfResponse.json(),cookies=authCsrfResponse.headers.getSetCookie().map(c=>c.split(";")[0]).join("; ");
  const failure=await fetch(origin+"/api/auth/callback/credentials",{method:"POST",headers:{origin,cookie:cookies,"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({email:demo.email,password:demo.password,csrfToken:authCsrf.csrfToken,json:"true"}),redirect:"manual"});const text=await failure.text();assert.equal(failure.status,401);assert(text.includes("UNAVAILABLE"));assert(!/Prisma|postgres|password_hash|DATABASE_URL/.test(text));
  let limited;for(let i=0;i<101;i++)limited=await fetch(origin+"/api/auth/signout",{method:"POST",headers:{origin,"content-type":"application/x-www-form-urlencoded"},body:"csrfToken=invalid",redirect:"manual"});assert.equal(limited.status,429);assert.equal(limited.headers.get("retry-after"),"60");
 });check("Isolated DB outage returns safe 503/page and redacted auth failure; POST limiter returns 429");
 await temporary({NEXTAUTH_SECRET:""},async origin=>{const response=await fetch(origin+"/api/auth/csrf");assert.equal(response.status,503);assert.deepEqual(await response.json(),{error:"SERVICE_UNAVAILABLE"});});check("Missing auth secret fails closed without changing private configuration");
 const logout=await request("/api/auth/signout",{method:"POST",headers:{origin:base,"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({csrfToken:csrf.csrfToken,callbackUrl:base+"/sign-in",json:"true"})});assert.equal(logout.status,200);assert.equal((await request("/api/v1/school")).status,401);check("Production sign-out clears access");
 assert.equal(createHash("sha256").update(readFileSync(".env")).digest("hex"),envHash);check("Private .env unchanged");
 mkdirSync("artifacts/iam-01",{recursive:true});writeFileSync("artifacts/iam-01/verification.json",JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify({checks:report.checks,report:"artifacts/iam-01/verification.json"}));
}
run().catch(()=>{console.error(`IAM_LOCAL_PROBE_FAILED after ${report.checks.length} successful checks. No credentials or adapter diagnostics were logged.`);process.exitCode=1;});
