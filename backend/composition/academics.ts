import {PrismaClient} from '../../generated/prisma/client';
import type {Prisma} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAcademicSetupUseCases,type CalendarImpactPort} from '../modules/academics/application/setup';
import {PrismaAcademicSetupRepository} from '../modules/academics/infrastructure/setup';
import {createAcademicOfferingUseCases,type AssignmentImpactPort} from '../modules/academics/application/offerings';
import {PrismaAcademicOfferingRepository} from '../modules/academics/infrastructure/offerings';
import {createTimetablePatternUseCases} from '../modules/academics/application/timetable';
import {PrismaTimetablePatternRepository} from '../modules/academics/infrastructure/timetable';
import {createTimetableDraftUseCases} from '../modules/academics/application/timetable-draft';
import {PrismaTimetableDraftRepository} from '../modules/academics/infrastructure/timetable-draft';
import {createTimetableReconciliationUseCases} from '../modules/academics/application/timetable-reconciliation';
import {PrismaTimetableReconciliationRepository} from '../modules/academics/infrastructure/timetable-reconciliation';
import {createTeacherTimetableUseCases} from '../modules/academics/application/teacher-timetable';
import {PrismaTeacherTimetableRepository} from '../modules/academics/infrastructure/teacher-timetable';
import {createTeacherClassesUseCases} from '../modules/academics/application/teacher-classes';
import {PrismaTeacherClassesRepository} from '../modules/academics/infrastructure/teacher-classes';
import {createTeacherReadinessUseCases} from '../modules/academics/application/teacher-readiness';
import {PrismaTeacherReadinessRepository} from '../modules/academics/infrastructure/teacher-readiness';
import {PrismaTeacherClassRoster} from '../modules/students/infrastructure/teacher-class-roster';
import {PrismaTeacherSessionReadiness} from '../modules/attendance/infrastructure/teacher-session-readiness';
import {PrismaAttendanceTimetablePlanning} from '../modules/attendance/infrastructure/timetable-planning';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
import {PrismaScheduledSessions} from '../modules/attendance/infrastructure/scheduled-sessions';
import {PrismaInstitutionEvidence} from '../modules/tenancy/infrastructure/evidence';
import {capabilityReleaseManifest,isModuleId,type ModuleId} from '../modules/tenancy/domain/entitlements';
import {AccessError} from '../modules/access/contracts';
export type AcademicServiceConfiguration={databaseUrl:string;releasedModules:readonly ModuleId[];now?:()=>Date;calendarImpact?:CalendarImpactPort;assignmentImpact?:AssignmentImpactPort};
export function validateAcademicServiceConfiguration(config:AcademicServiceConfiguration){
 if(typeof config.databaseUrl!=='string'||!config.databaseUrl.trim())throw new AccessError('UNAVAILABLE');
 if(!Array.isArray(config.releasedModules)||config.releasedModules.some(moduleId=>!isModuleId(moduleId)))throw new AccessError('UNAVAILABLE');
 if(config.now!==undefined&&typeof config.now!=='function')throw new AccessError('UNAVAILABLE');
 return config;
}
export function createAcademicServices(input:AcademicServiceConfiguration){
 const config=validateAcademicServiceConfiguration(input),db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules),databaseContext=new PrismaVerifiedDatabaseContext();
 const evidence=(tx:Prisma.TransactionClient)=>new PrismaInstitutionEvidence(tx),calendarImpact=config.calendarImpact??{publicationAffectsSessions:(input:Parameters<CalendarImpactPort['publicationAffectsSessions']>[0],transaction?:unknown)=>new PrismaScheduledSessions(transaction as Prisma.TransactionClient).calendarPublicationAffectsSessions(input),hasPendingSessions:(input:Parameters<CalendarImpactPort['hasPendingSessions']>[0],transaction?:unknown)=>new PrismaScheduledSessions(transaction as Prisma.TransactionClient).hasPendingSessions(input)},assignmentImpact=config.assignmentImpact??{hasFutureSessions:(input:Parameters<AssignmentImpactPort['hasFutureSessions']>[0],transaction?:unknown)=>new PrismaScheduledSessions(transaction as Prisma.TransactionClient).hasFutureAssignmentSessions(input)};
 return {...createAcademicSetupUseCases(new PrismaAcademicSetupRepository(db,evidence,manifest,databaseContext,config.now,calendarImpact)),...createAcademicOfferingUseCases(new PrismaAcademicOfferingRepository(db,evidence,manifest,databaseContext,config.now,assignmentImpact)),...createTimetablePatternUseCases(new PrismaTimetablePatternRepository(db,manifest,databaseContext,evidence,config.now)),...createTimetableDraftUseCases(new PrismaTimetableDraftRepository(db,manifest,databaseContext,evidence,config.now)),...createTimetableReconciliationUseCases(new PrismaTimetableReconciliationRepository(db,manifest,databaseContext,new PrismaAttendanceTimetablePlanning(manifest,config.now),evidence,config.now)),...createTeacherTimetableUseCases(new PrismaTeacherTimetableRepository(db,manifest,databaseContext,config.now)),...createTeacherClassesUseCases(new PrismaTeacherClassesRepository(db,manifest,databaseContext,new PrismaTeacherClassRoster(),config.now)),...createTeacherReadinessUseCases(new PrismaTeacherReadinessRepository(db,manifest,databaseContext,new PrismaTeacherSessionReadiness(),config.now)),disconnect:()=>db.$disconnect()};
}
