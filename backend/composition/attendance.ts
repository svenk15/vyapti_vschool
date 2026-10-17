import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import type {ModuleId} from '../modules/tenancy/domain/entitlements';
import {capabilityReleaseManifest,releasedModuleIds} from '../modules/tenancy/domain/entitlements';
import {PrismaInstitutionEvidence} from '../modules/tenancy/infrastructure/evidence';
import {PrismaCommandEvidence} from '../modules/platform/infrastructure/command-evidence';
import {PrismaPersonIdentity} from '../modules/people/infrastructure/person-identity';
import {createPersonIdentityUseCases} from '../modules/people/application/person-identity';
import {PrismaStudentRepository} from '../modules/students/infrastructure/students';
import {createAttendanceUseCases} from '../modules/attendance/application/sessions';
import {PrismaSessionRepository} from '../modules/attendance/infrastructure/sessions';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
import {createLeadershipCoverageUseCases} from '../modules/attendance/application/leadership-coverage';
import {PrismaLeadershipCoverageRepository} from '../modules/attendance/infrastructure/leadership-coverage';
import {PrismaEffectiveOccurrenceTeacher} from '../modules/academics/infrastructure/timetable-cover';
export function createAttendanceServices(config:{databaseUrl:string;releasedModules?:readonly ModuleId[];now?:()=>Date}){
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules??releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES));
 const context=new PrismaVerifiedDatabaseContext(),students=new PrismaStudentRepository(db,tx=>new PrismaCommandEvidence(tx),createPersonIdentityUseCases(new PrismaPersonIdentity()),config.now,undefined,manifest,undefined,context);
 return {...createAttendanceUseCases(new PrismaSessionRepository(db,tx=>new PrismaInstitutionEvidence(tx),manifest,config.now,students,context,new PrismaEffectiveOccurrenceTeacher())),...createLeadershipCoverageUseCases(new PrismaLeadershipCoverageRepository(db,manifest,config.now,context)),disconnect:()=>db.$disconnect()};
}
