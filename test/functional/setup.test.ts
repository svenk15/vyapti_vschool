import { randomUUID } from "node:crypto";
import { afterAll, it, expect } from "vitest";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const value=process.env.TEST_DATABASE_URL;
if (!value || new URL(value).pathname!=="/vyapti_vschool_test" || !["localhost","127.0.0.1","[::1]"].includes(new URL(value).hostname)) throw new Error("Use the guarded test:functional command with the dedicated test database.");
const db=new PrismaClient({adapter:new PrismaPg({connectionString:value,connectionTimeoutMillis:5000})});
afterAll(()=>db.$disconnect());
it("persists one marker across repeated commands",async()=>{ const id=randomUUID();try{for(let i=0;i<2;i++)await db.setupCheck.upsert({where:{id},create:{id},update:{}});expect(await db.setupCheck.count({where:{id}})).toBe(1);}finally{await db.setupCheck.deleteMany({where:{id}});} });
it("rolls back an interrupted real transaction",async()=>{const id=randomUUID();await expect(db.$transaction(async tx=>{await tx.setupCheck.create({data:{id}});throw new Error("injected failure");})).rejects.toThrow("injected failure");expect(await db.setupCheck.count({where:{id}})).toBe(0);});
it("has a database-backed readiness marker",async()=>{expect(await db.setupCheck.findUnique({where:{id:"starter"}})).not.toBeNull();});

it("maps ORM fields to the VS physical schema",async()=>{
 const tables=await db.$queryRaw<{name:string|null}[]>`SELECT to_regclass('public.vs_platform_setup_check')::text AS name`;
 expect(tables[0].name).toBe("vs_platform_setup_check");
 const legacy=await db.$queryRaw<{name:string|null}[]>`SELECT to_regclass('public."SetupCheck"')::text AS name`;
 expect(legacy[0].name).toBeNull();
 const prior=await db.$queryRaw<{name:string|null}[]>`SELECT to_regclass('public.vora_platform_setup_check')::text AS name`;
 expect(prior[0].name).toBeNull();
 const columns=await db.$queryRaw<{column_name:string;data_type:string;is_nullable:string}[]>`SELECT column_name,data_type,is_nullable FROM information_schema.columns WHERE table_schema='public' AND table_name='vs_platform_setup_check' ORDER BY ordinal_position`;
 expect(columns).toEqual([{column_name:"id",data_type:"text",is_nullable:"NO"},{column_name:"created_at",data_type:"timestamp with time zone",is_nullable:"NO"}]);
 const keys=await db.$queryRaw<{conname:string}[]>`SELECT conname FROM pg_constraint WHERE conrelid='public.vs_platform_setup_check'::regclass AND contype='p'`;
 expect(keys.map(k=>k.conname)).toEqual(["vs_platform_setup_check_pkey"]);
 const row=await db.setupCheck.findUniqueOrThrow({where:{id:"starter"}});
 expect(row.createdAt).toBeInstanceOf(Date);
});
