import type { Prisma } from "../../../../generated/prisma/client";
import type { ScheduledSessionQuery } from "../contracts/scheduled-sessions";
export class PrismaScheduledSessions implements ScheduledSessionQuery {
 constructor(private readonly tx:Prisma.TransactionClient){}
 async hasAny(organizationId:string,schoolId:string){
  const relation=await this.tx.$queryRaw<{present:boolean}[]>`SELECT to_regclass('public.vs_attendance_session') IS NOT NULL AS present`;
  if(!relation[0].present)return false;
  const rows=await this.tx.$queryRaw<{present:boolean}[]>`SELECT EXISTS(SELECT 1 FROM public.vs_attendance_session WHERE organization_id=${organizationId}::uuid AND school_id=${schoolId}::uuid) AS present`;
  return rows[0].present;
 }
}
