import {PrismaClient} from '../../generated/prisma/client';
import type {Prisma} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAcademicSetupUseCases,type CalendarImpactPort} from '../modules/academics/application/setup';
import {PrismaAcademicSetupRepository} from '../modules/academics/infrastructure/setup';
import {createAcademicOfferingUseCases,type AssignmentImpactPort} from '../modules/academics/application/offerings';
import {PrismaAcademicOfferingRepository} from '../modules/academics/infrastructure/offerings';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
import {PrismaScheduledSessions} from '../modules/attendance/infrastructure/scheduled-sessions';
import {PrismaInstitutionEvidence} from '../modules/tenancy/infrastructure/evidence';
import {capabilityReleaseManifest,releasedModuleIds,type ModuleId} from '../modules/tenancy/domain/entitlements';
export function createAcademicServices(config:{databaseUrl:string;releasedModules?:readonly ModuleId[];now?:()=>Date;calendarImpact?:CalendarImpactPort;assignmentImpact?:AssignmentImpactPort}){
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules??releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES)),databaseContext=new PrismaVerifiedDatabaseContext();
 const evidence=(tx:Prisma.TransactionClient)=>new PrismaInstitutionEvidence(tx),calendarImpact=config.calendarImpact??{publicationAffectsSessions:(input:Parameters<CalendarImpactPort['publicationAffectsSessions']>[0],transaction?:unknown)=>new PrismaScheduledSessions(transaction as Prisma.TransactionClient).calendarPublicationAffectsSessions(input),hasPendingSessions:(input:Parameters<CalendarImpactPort['hasPendingSessions']>[0],transaction?:unknown)=>new PrismaScheduledSessions(transaction as Prisma.TransactionClient).hasPendingSessions(input)},assignmentImpact=config.assignmentImpact??{hasFutureSessions:(input:Parameters<AssignmentImpactPort['hasFutureSessions']>[0],transaction?:unknown)=>new PrismaScheduledSessions(transaction as Prisma.TransactionClient).hasFutureAssignmentSessions(input)};
 return {...createAcademicSetupUseCases(new PrismaAcademicSetupRepository(db,evidence,manifest,databaseContext,config.now,calendarImpact)),...createAcademicOfferingUseCases(new PrismaAcademicOfferingRepository(db,evidence,manifest,databaseContext,config.now,assignmentImpact)),disconnect:()=>db.$disconnect()};
}
