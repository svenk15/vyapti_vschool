import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../../generated/prisma/client";
import type { SetupProbe } from "../application/get-setup-status";
import type { SetupState } from "../domain/readiness";
// One cached pool for the currently configured URL, never a cross-URL client.
const cache = globalThis as unknown as { vschoolProbe?: { url: string; client: PrismaClient } };
export class PrismaSetupProbe implements SetupProbe {
 constructor(private readonly connectionString: string | undefined) {}
 async inspect(): Promise<SetupState> {
  const value = this.connectionString;
  if (!value) return "not_configured";
  try { if (!["postgres:","postgresql:"].includes(new URL(value).protocol)) return "not_configured"; }
  catch { return "not_configured"; }
  if (cache.vschoolProbe && cache.vschoolProbe.url !== value) { await cache.vschoolProbe.client.$disconnect(); cache.vschoolProbe = undefined; }
  const client = cache.vschoolProbe?.client ?? new PrismaClient({adapter:new PrismaPg({connectionString:value, connectionTimeoutMillis:2500, query_timeout:2500, max:2}),log:[]});
  cache.vschoolProbe = {url:value,client};
  try {
   await client.$queryRaw`SELECT 1`;
   return await client.setupCheck.findUnique({where:{id:"starter"}}) ? "ready" : "seed_missing";
  } catch(error) {
   if (typeof error === "object" && error !== null && "code" in error && error.code === "P2021") return "schema_missing";
   return "unavailable";
  }
 }
}
