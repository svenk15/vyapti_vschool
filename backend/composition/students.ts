import { PrismaClient } from "../../generated/prisma/client";
import type { Prisma } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaPersonIdentity } from "../modules/people/infrastructure/person-identity";
import { createPersonIdentityUseCases } from "../modules/people/application/person-identity";
import { PrismaCommandEvidence } from "../modules/platform/infrastructure/command-evidence";
import { createEnlistedStudentRegistrationUseCases, createStudentUseCases } from "../modules/students/application/students";
import { PrismaStudentRepository } from "../modules/students/infrastructure/students";
import { PrismaScheduledSessions } from "../modules/attendance/infrastructure/scheduled-sessions";
import { capabilityReleaseManifest, isModuleId, type ModuleId } from "../modules/tenancy/domain/entitlements";
import { PrismaVerifiedDatabaseContext } from "../modules/tenancy/infrastructure/verified-db-context";
import {AccessError} from '../modules/access/contracts';

export type StudentsServiceConfiguration=Readonly<{databaseUrl:string;cursorSecret:string;releasedModules:readonly ModuleId[];now?:()=>Date}>;

export function validateStudentsServiceConfiguration(config:StudentsServiceConfiguration):StudentsServiceConfiguration{
  if(typeof config.databaseUrl!=='string'||config.databaseUrl.trim().length===0)throw new AccessError('UNAVAILABLE');
  if(typeof config.cursorSecret!=='string'||config.cursorSecret.length<32||config.cursorSecret.trim().length<32)throw new AccessError('UNAVAILABLE');
  if(!Array.isArray(config.releasedModules)||config.releasedModules.some(moduleId=>!isModuleId(moduleId)))throw new AccessError('UNAVAILABLE');
  if(config.now!==undefined&&typeof config.now!=='function')throw new AccessError('UNAVAILABLE');
  return config;
}

export function createStudentsServices(input:StudentsServiceConfiguration){
  const config=validateStudentsServiceConfiguration(input);
  const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]});
  const people=createPersonIdentityUseCases(new PrismaPersonIdentity());
  const manifest=capabilityReleaseManifest(config.releasedModules);
  const databaseContext=new PrismaVerifiedDatabaseContext();
  const attendanceImpact={hasFrozenSessions:(transaction:object,input:Parameters<PrismaScheduledSessions["hasFrozenSessions"]>[0])=>new PrismaScheduledSessions(transaction as Prisma.TransactionClient).hasFrozenSessions(input)};
  const repository=new PrismaStudentRepository(db,tx=>new PrismaCommandEvidence(tx),people,config.now,config.cursorSecret,manifest,attendanceImpact,databaseContext);
  return {...createStudentUseCases(repository),enlistedRegistration:createEnlistedStudentRegistrationUseCases(repository),disconnect:()=>db.$disconnect()};
}
