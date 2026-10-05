import { PrismaClient } from "../../generated/prisma/client";
import type { Prisma } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaPersonIdentity } from "../modules/people/infrastructure/person-identity";
import { createPersonIdentityUseCases } from "../modules/people/application/person-identity";
import { PrismaCommandEvidence } from "../modules/platform/infrastructure/command-evidence";
import { createEnlistedStudentRegistrationUseCases, createStudentUseCases } from "../modules/students/application/students";
import { PrismaStudentRepository } from "../modules/students/infrastructure/students";
import { PrismaScheduledSessions } from "../modules/attendance/infrastructure/scheduled-sessions";
import { capabilityReleaseManifest, releasedModuleIds, type ModuleId } from "../modules/tenancy/domain/entitlements";

export function createStudentsServices(config:{databaseUrl:string;cursorSecret?:string;now?:()=>Date;releasedModules?:readonly ModuleId[]}){
  const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]});
  const people=createPersonIdentityUseCases(new PrismaPersonIdentity());
  const manifest=capabilityReleaseManifest(config.releasedModules??releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES));
  const attendanceImpact={hasFrozenSessions:(transaction:object,input:Parameters<PrismaScheduledSessions["hasFrozenSessions"]>[0])=>new PrismaScheduledSessions(transaction as Prisma.TransactionClient).hasFrozenSessions(input)};
  const repository=new PrismaStudentRepository(db,tx=>new PrismaCommandEvidence(tx),people,config.now,config.cursorSecret??process.env.NEXTAUTH_SECRET??"",manifest,attendanceImpact);
  return {...createStudentUseCases(repository),enlistedRegistration:createEnlistedStudentRegistrationUseCases(repository),disconnect:()=>db.$disconnect()};
}
