import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { Client } from "pg";
import { it,expect } from "vitest";
const url=process.env.TEST_DATABASE_URL??"";
if(new URL(url).pathname!=="/vyapti_vschool_test")throw new Error("Dedicated test database required");
const history=["20261003000100_foundation","20261003000200_vora_naming","20261003000300_vs_prefix","20261003000400_access_bootstrap","20261004000100_staff_management","20261004000200_account_activation","20261004000300_institution_context","20261004000400_institution_history_indexes","20261004000500_module_entitlements"];
const sql=(name:string)=>readFileSync(`prisma/migrations/${name}/migration.sql`,"utf8").replace(/^BEGIN;\s*$/gm,"").replace(/^COMMIT;\s*$/gm,"");
for(const prior of [false,true])it(`rehearses ${prior?"previous-checkpoint upgrade with preserved marker":"clean installation"} in an isolated rolled-back schema`,async()=>{
 const client=new Client({connectionString:url,connectionTimeoutMillis:5000});await client.connect();
 try{
  await client.query("BEGIN");const schema=`iam_rehearsal_${randomUUID().replaceAll("-","")}`;
  await client.query(`CREATE SCHEMA "${schema}"`);await client.query(`SET LOCAL search_path TO "${schema}"`);
  for(const name of history.slice(0,3))await client.query(sql(name));
  const marker=randomUUID(),timestamp="2026-10-03T00:00:00.123Z";
  if(prior)await client.query("INSERT INTO vs_platform_setup_check(id,created_at) VALUES($1,$2)",[marker,timestamp]);
  await client.query(sql(history[3]));
  const institution=randomUUID();
  if(prior)await client.query("INSERT INTO vs_access_organization(id,name,status,version,created_at) VALUES($1,'Synthetic preserved institution','ACTIVE',3,$2)",[institution,timestamp]);
  await client.query(sql(history[4]));
  await client.query(sql(history[5]));
  await client.query(sql(history[6]));
  await client.query(sql(history[7]));
  await client.query(sql(history[8]));
  if(prior){const row=await client.query("SELECT name,version,created_at FROM vs_access_organization WHERE id=$1",[institution]);expect(row.rows).toEqual([{name:"Synthetic preserved institution",version:3,created_at:new Date(timestamp)}]);}
  const tables=await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema=$1",[schema]);expect(tables.rows).toHaveLength(19);
  if(prior){const row=await client.query("SELECT id,created_at FROM vs_platform_setup_check WHERE id=$1",[marker]);expect(row.rows).toEqual([{id:marker,created_at:new Date(timestamp)}]);}
  const fks=await client.query("SELECT c.conname FROM pg_constraint c JOIN pg_namespace n ON n.oid=c.connamespace WHERE n.nspname=$1 AND c.contype='f'",[schema]);expect(fks.rows).toHaveLength(27);
  await client.query("ROLLBACK");
  expect((await client.query("SELECT 1 FROM pg_namespace WHERE nspname=$1",[schema])).rowCount).toBe(0);
 }finally{await client.query("ROLLBACK");await client.end();}
});
