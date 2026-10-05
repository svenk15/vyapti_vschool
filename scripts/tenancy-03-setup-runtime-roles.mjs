import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Client } from "pg";

const databases=[
 {key:"development",name:"vyapti_vschool",ownerUrl:process.env.DATABASE_URL,role:"vyapti_vschool_runtime"},
 {key:"test",name:"vyapti_vschool_test",ownerUrl:process.env.TEST_DATABASE_URL,role:"vyapti_vschool_test_runtime"},
];
const secretsPath=path.resolve("artifacts/tenancy-03/private-runtime.json");
const localPort=Number(process.env.PGPORT??5432);
if(!Number.isInteger(localPort)||localPort<1||localPort>65535)throw new Error("PGPORT must be a valid local PostgreSQL port");
for(const item of databases){
 let target;try{target=new URL(item.ownerUrl??"");}catch{throw new Error(`Missing configured ${item.key} database URL`);}
 if(!["postgres:","postgresql:"].includes(target.protocol)||!["127.0.0.1","localhost","[::1]"].includes(target.hostname)||target.pathname!==`/${item.name}`||target.search)throw new Error(`Refusing a non-designated ${item.key} database target`);
}
const records=fs.existsSync(secretsPath)?JSON.parse(fs.readFileSync(secretsPath,"utf8")):null;
if(records&&databases.some(item=>records[item.key]?.role!==item.role||typeof records[item.key]?.password!=="string"))throw new Error("Existing private runtime credential file does not match expected role names; nothing was changed");
const maintenanceUrl=new URL(databases[0].ownerUrl);
const admin=new Client({host:"127.0.0.1",port:localPort,user:process.env.PGUSER||os.userInfo().username,password:process.env.PGPASSWORD,database:maintenanceUrl.searchParams.get("maintenance_database")||"postgres",connectionTimeoutMillis:5000});
try{
 await admin.connect();
 const adminRole=await admin.query("SELECT rolsuper,rolcreaterole FROM pg_roles WHERE rolname=current_user");
 if(!adminRole.rows[0]?.rolsuper&&!adminRole.rows[0]?.rolcreaterole)throw new Error("The local PostgreSQL setup role cannot create restricted runtime roles; no changes were made");
 const catalog=await admin.query("SELECT rolname,rolcanlogin,rolsuper,rolbypassrls,rolinherit,rolcreatedb,rolcreaterole FROM pg_roles WHERE rolname=ANY($1::text[])",[databases.map(item=>item.role)]);
 if(!records&&catalog.rowCount)throw new Error("A runtime role already exists but its ignored private credential file is absent; refusing to reset or replace it");
 const databaseRows=await admin.query("SELECT datname,pg_get_userbyid(datdba) AS owner FROM pg_database WHERE datname=ANY($1::text[])",[databases.map(item=>item.name)]);
 for(const item of databases){
  const db=databaseRows.rows.find(row=>row.datname===item.name);
  if(!db||db.owner===item.role)throw new Error(`Unexpected database owner for ${item.name}; nothing was changed`);
 }
 const passwords=records??Object.fromEntries(databases.map(item=>[item.key,{role:item.role,password:crypto.randomBytes(32).toString("hex")} ]));
 const existing=new Set(catalog.rows.map(row=>row.rolname));
 await admin.query("BEGIN");
 for(const item of databases)if(!existing.has(item.role)){
  const password=passwords[item.key].password;
  await admin.query(`CREATE ROLE "${item.role}" LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS PASSWORD '${password}'`);
 }
 for(const item of databases)await admin.query(`GRANT CONNECT ON DATABASE "${item.name}" TO "${item.role}"`);
 await admin.query("COMMIT");
 for(const item of databases)if(!existing.has(item.role)){
  const owner=new Client({connectionString:item.ownerUrl,connectionTimeoutMillis:5000});
  try{await owner.connect();await owner.query(`GRANT USAGE ON SCHEMA public TO "${item.role}"`);}finally{await owner.end();}
 }
 for(const item of databases){
  const runtimeUrl=new URL(item.ownerUrl);runtimeUrl.username=item.role;runtimeUrl.password=passwords[item.key].password;
  const runtime=new Client({connectionString:runtimeUrl.toString(),connectionTimeoutMillis:5000});
  try{
   await runtime.connect();
   const verify=await runtime.query("SELECT current_user AS role,current_database() AS database,(SELECT rolsuper OR rolbypassrls OR rolinherit OR rolcreatedb OR rolcreaterole FROM pg_roles WHERE rolname=current_user) AS privileged,has_schema_privilege(current_user,'public','CREATE') AS schema_create,(SELECT count(*)::int FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind IN ('r','p') AND (has_table_privilege(current_user,c.oid,'SELECT') OR has_table_privilege(current_user,c.oid,'INSERT') OR has_table_privilege(current_user,c.oid,'UPDATE') OR has_table_privilege(current_user,c.oid,'DELETE'))) AS dml_tables");
   if(verify.rows[0].role!==item.role||verify.rows[0].database!==item.name||verify.rows[0].privileged||verify.rows[0].schema_create||verify.rows[0].dml_tables!==0)throw new Error(`Restricted runtime role verification failed for ${item.name}`);
 }finally{await runtime.end();}
 }
 if(!records){
  fs.mkdirSync(path.dirname(secretsPath),{recursive:true,mode:0o700});
  fs.writeFileSync(secretsPath,`${JSON.stringify(passwords,null,2)}\n`,{flag:"wx",mode:0o600});
  fs.chmodSync(secretsPath,0o600);
 }
 console.log(`Restricted development/test roles verified. Private credentials: ${secretsPath}. No table DML was granted; the app must continue using the owner role until RLS context and policies pass.`);
}catch(error){
 try{await admin.query("ROLLBACK");}catch{}
 throw error;
}finally{await admin.end();}
