import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {BcryptPasswords} from '../modules/access/infrastructure/passwords';
import {OpaqueActivationTokens} from '../modules/access/infrastructure/activation-tokens';
import {createStudentPortalAccessUseCases,type StudentPortalEmailSender} from '../modules/students/application/portal-access';
import {createStudentPortalReadUseCases} from '../modules/students/application/portal-reads';
import {StudentPortalError} from '../modules/students/domain/portal-policy';
import {PrismaStudentPortalAccessRepository} from '../modules/students/infrastructure/portal-access';
import {PrismaStudentSelfAccessVerifier} from '../modules/students/infrastructure/portal-verification';
import {PrismaStudentAttendanceHistory} from '../modules/attendance/infrastructure/student-history';
import {PrismaStudentTimetable} from '../modules/academics/infrastructure/student-timetable';
import {PrismaCommandEvidence} from '../modules/platform/infrastructure/command-evidence';
import {capabilityReleaseManifest,isModuleId,type ModuleId} from '../modules/tenancy/domain/entitlements';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
export type StudentPortalServiceConfiguration=Readonly<{databaseUrl:string;releasedModules:readonly ModuleId[];emailSender:StudentPortalEmailSender;now?:()=>Date}>;
export function createStudentPortalServices(config:StudentPortalServiceConfiguration){if(!config.databaseUrl||!Array.isArray(config.releasedModules)||config.releasedModules.some(moduleId=>!isModuleId(moduleId)))throw new StudentPortalError('UNAVAILABLE');const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules),context=new PrismaVerifiedDatabaseContext(),repository=new PrismaStudentPortalAccessRepository(db,manifest,context,tx=>new PrismaCommandEvidence(tx),config.now),verifier=new PrismaStudentSelfAccessVerifier(manifest,context,config.now);return {...createStudentPortalAccessUseCases(repository,config.emailSender,new OpaqueActivationTokens(),new BcryptPasswords(),config.now),...createStudentPortalReadUseCases(new PrismaStudentAttendanceHistory(db,verifier),new PrismaStudentTimetable(db,verifier)),disconnect:()=>db.$disconnect()};}
