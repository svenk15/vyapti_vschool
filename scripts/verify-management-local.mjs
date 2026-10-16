// Synthetic local production demo verification. No cleanup, reset or credentials exported.
import { config } from "dotenv";
import { Client } from "pg";
import { randomUUID,createHash } from "node:crypto";
import { readFileSync,writeFileSync,mkdirSync } from "node:fs";
import assert from "node:assert/strict";
config({path:'.env.local',quiet:true});config({quiet:true});
const base='http://127.0.0.1:3400',demo=JSON.parse(readFileSync('artifacts/iam-01/private-demo.json','utf8')),checks=[],jar=new Map();
const envHash=createHash('sha256').update(readFileSync('.env')).digest('hex');
async function request(path,options={}){const r=await fetch(base+path,{...options,redirect:'manual',headers:{cookie:[...jar].map(([k,v])=>`${k}=${v}`).join('; '),...options.headers},signal:AbortSignal.timeout(15000)});for(const c of r.headers.getSetCookie()){const p=c.split(';')[0],i=p.indexOf('=');jar.set(p.slice(0,i),p.slice(i+1));}return r;}
function passed(name){checks.push({name,passed:true});}
async function command(path,method,body,key=randomUUID()){return request(path,{method,headers:{origin:base,'content-type':'application/json','idempotency-key':key},body:JSON.stringify(body)});}
async function run(){
 assert((await request('/api/health')).ok);passed('Production health ready');
 const csrf=await(await request('/api/auth/csrf')).json();const signed=await request('/api/auth/callback/credentials',{method:'POST',headers:{origin:base,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrfToken:csrf.csrfToken,email:demo.email,password:demo.password,callbackUrl:base+'/account',json:'true'}).toString()});assert.equal(signed.status,200);
 for(const path of ['/admin/school','/admin/users']){const r=await request(path);assert.equal(r.status,200);assert(!(await r.text()).includes(demo.password));}passed('Existing accepted administrator signs in and both management screens render');
 const settings=await(await request('/api/v1/school')).json();const key=randomUUID(),body={payload:{name:settings.name,timezone:settings.timezone},expectedVersion:settings.version};
 const saved=await command('/api/v1/school','PATCH',body,key);assert.equal(saved.status,200);const result=await saved.json();assert.equal(result.version,settings.version+1);const replay=await command('/api/v1/school','PATCH',body,key);assert.equal(replay.status,200);assert.equal((await replay.json()).replayed,true);assert.equal((await command('/api/v1/school','PATCH',body)).status,409);passed('Production settings commit, exact replay and stale-version rejection');
 const code='PROBE-'+randomUUID().slice(0,8),campus={payload:{code,name:'Synthetic verification campus'}};assert.equal((await command('/api/v1/campuses','POST',campus)).status,201);assert.equal((await command('/api/v1/campuses','POST',campus)).status,409);passed('Campus persists and duplicate is rejected');
 const staff={payload:{email:`local-${randomUUID()}@vschool.example`,roles:['TEACHER']}},created=await command('/api/v1/memberships','POST',staff);assert.equal(created.status,201);const member=await created.json();assert.equal(member.status,'PENDING');
 for(const [action,version,status] of [['SUSPEND',1,'SUSPENDED'],['REINSTATE',2,'PENDING']]){const r=await command('/api/v1/memberships/'+member.resourceId,'PATCH',{payload:{action,reason:'Synthetic local demo verification'},expectedVersion:version});assert.equal(r.status,200);assert.equal((await r.json()).status,status);}passed('Pending staff persists, suspension and reinstatement never manufacture credentials');
 const last=await command('/api/v1/memberships/'+demo.membershipId,'PATCH',{payload:{action:'REVOKE',reason:'Synthetic last administrator verification'},expectedVersion:1});assert.equal(last.status,409);assert.equal((await last.json()).code,'LAST_ADMIN');passed('Last active administrator remains protected');
 const prior=JSON.parse(readFileSync('docs/evidence/fnd-01-local/verification.json','utf8')),databases=[];
 for(const [name,url] of [['vyapti_vschool',process.env.DATABASE_URL],['vyapti_vschool_test',process.env.TEST_DATABASE_URL]]){assert.equal(new URL(url).pathname,'/'+name);assert(['127.0.0.1','localhost','[::1]'].includes(new URL(url).hostname));const db=new Client({connectionString:url,connectionTimeoutMillis:5000});await db.connect();try{const migrations=(await db.query('SELECT migration_name,finished_at IS NOT NULL AS applied,rolled_back_at IS NOT NULL AS rolled_back FROM "_prisma_migrations" ORDER BY migration_name')).rows;assert.equal(migrations.length,5);assert(migrations.every(m=>m.applied&&!m.rolled_back));const marker=(await db.query("SELECT id,created_at FROM vs_platform_setup_check WHERE id='starter'")).rows;assert.equal(marker[0].created_at.toISOString(),prior.databases.find(d=>d.database===name).marker[0].created_at);databases.push({database:name,migrations,marker});}finally{await db.end();}}
 passed('Five forward migrations in both databases; original foundation markers preserved');assert.equal(createHash('sha256').update(readFileSync('.env')).digest('hex'),envHash);passed('Private environment preserved');
 const report={observedAt:new Date().toISOString(),checks,databases,demoUrl:base,buildId:readFileSync('.next/BUILD_ID','utf8').trim()};mkdirSync('docs/evidence/iam-02-local',{recursive:true});writeFileSync('docs/evidence/iam-02-local/verification.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({checks:checks.length,passed:true,demoUrl:base,buildId:report.buildId}));
}
run().catch(()=>{console.error('LOCAL_MANAGEMENT_VERIFICATION_FAILED');process.exitCode=1;});
