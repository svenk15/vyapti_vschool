import { createInstitutionUseCases } from "../modules/access/application/institutions";
import { PrismaInstitutionRepository } from "../modules/access/infrastructure/institutions";
import { PrismaInstitutionEvidence } from "../modules/tenancy/infrastructure/evidence";
import { createActivationUseCases } from "../modules/access/application/activation";
import { PrismaActivationRepository } from "../modules/access/infrastructure/activation";
import { OpaqueActivationTokens } from "../modules/access/infrastructure/activation-tokens";
import { PrismaAccessSecurityEvidence } from "../modules/platform/infrastructure/access-security-evidence";
import { createManagementUseCases } from "../modules/access/application/management";
import { PrismaManagementRepository } from "../modules/access/infrastructure/management";
import { PrismaCommandEvidence } from "../modules/platform/infrastructure/command-evidence";
import { PrismaScheduledSessions } from "../modules/attendance/infrastructure/scheduled-sessions";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createAccessUseCases } from "../modules/access/application/services";
import { PrismaAccessRepository } from "../modules/access/infrastructure/repository";
import { BcryptPasswords } from "../modules/access/infrastructure/passwords";
import { PrismaProvisionEvidence } from "../modules/platform/infrastructure/provision-evidence";
export function createAccessServices(config:{databaseUrl:string;now?:()=>Date;cursorSecret?:string}) {
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]});
 const repository=new PrismaAccessRepository(db,tx=>new PrismaProvisionEvidence(tx),config.now);
 const management=createManagementUseCases(new PrismaManagementRepository(db,tx=>new PrismaCommandEvidence(tx),tx=>new PrismaScheduledSessions(tx),config.cursorSecret??randomUUID(),config.now));
 const activation=createActivationUseCases(new PrismaActivationRepository(db,tx=>new PrismaAccessSecurityEvidence(tx),config.now??(()=>new Date())),new BcryptPasswords(),new OpaqueActivationTokens(),config.now??(()=>new Date()));
 const core=createAccessUseCases(repository,new BcryptPasswords(),randomUUID);
 const institutions=createInstitutionUseCases(new PrismaInstitutionRepository(db,tx=>new PrismaInstitutionEvidence(tx),(identity,schoolId)=>core.getAccountHome(identity,schoolId),config.now));
 return {...institutions,...activation,...management,...core,disconnect:()=>db.$disconnect()};
}
