import {PrismaClient} from '../../generated/prisma/client';
import type {Prisma} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAcademicSetupUseCases,NO_ATTENDANCE_SESSIONS,type CalendarImpactPort} from '../modules/academics/application/setup';
import {PrismaAcademicSetupRepository} from '../modules/academics/infrastructure/setup';
import {createAcademicOfferingUseCases,NO_ASSIGNMENT_SESSIONS,type AssignmentImpactPort} from '../modules/academics/application/offerings';
import {PrismaAcademicOfferingRepository} from '../modules/academics/infrastructure/offerings';
import {PrismaInstitutionEvidence} from '../modules/tenancy/infrastructure/evidence';
import {capabilityReleaseManifest,releasedModuleIds,type ModuleId} from '../modules/tenancy/domain/entitlements';
export function createAcademicServices(config:{databaseUrl:string;releasedModules?:readonly ModuleId[];now?:()=>Date;calendarImpact?:CalendarImpactPort;assignmentImpact?:AssignmentImpactPort}){
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules??releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES));
 const evidence=(tx:Prisma.TransactionClient)=>new PrismaInstitutionEvidence(tx);
 return {...createAcademicSetupUseCases(new PrismaAcademicSetupRepository(db,evidence,manifest,config.now,config.calendarImpact??NO_ATTENDANCE_SESSIONS)),...createAcademicOfferingUseCases(new PrismaAcademicOfferingRepository(db,evidence,manifest,config.now,config.assignmentImpact??NO_ASSIGNMENT_SESSIONS)),disconnect:()=>db.$disconnect()};
}
