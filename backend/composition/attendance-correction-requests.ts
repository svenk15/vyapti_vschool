import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {createAttendanceCorrectionRequestUseCases} from '../modules/attendance/application/correction-requests';
import {PrismaAttendanceCorrectionRequestRepository} from '../modules/attendance/infrastructure/correction-requests';
import {PrismaAttendanceCorrectionRequester} from '../modules/attendance/infrastructure/correction-requester';
import {PrismaSessionRepository} from '../modules/attendance/infrastructure/sessions';
import {PrismaGuardianChildAccessVerifier} from '../modules/guardians/infrastructure/access-verification';
import {PrismaStudentSelfAccessVerifier} from '../modules/students/infrastructure/portal-verification';
import {PrismaStudentRepository} from '../modules/students/infrastructure/students';
import {PrismaPersonIdentity} from '../modules/people/infrastructure/person-identity';
import {createPersonIdentityUseCases} from '../modules/people/application/person-identity';
import {PrismaCommandEvidence} from '../modules/platform/infrastructure/command-evidence';
import {PrismaInstitutionEvidence} from '../modules/tenancy/infrastructure/evidence';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
import {capabilityReleaseManifest,isModuleId,type ModuleId} from '../modules/tenancy/domain/entitlements';
import {AttendanceCorrectionRequestError} from '../modules/attendance/domain/correction-requests';
export function createAttendanceCorrectionRequestServices(config:{databaseUrl:string;releasedModules:readonly ModuleId[];protectedCorrectionStorageEnabled:boolean;now?:()=>Date}){if(!config.databaseUrl||config.releasedModules.some(id=>!isModuleId(id)))throw new AttendanceCorrectionRequestError('UNAVAILABLE');const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules),context=new PrismaVerifiedDatabaseContext(),guardian=new PrismaGuardianChildAccessVerifier(manifest,context,config.now),student=new PrismaStudentSelfAccessVerifier(manifest,context,config.now),students=new PrismaStudentRepository(db,tx=>new PrismaCommandEvidence(tx),createPersonIdentityUseCases(new PrismaPersonIdentity()),config.now,undefined,manifest,undefined,context),sessions=new PrismaSessionRepository(db,tx=>new PrismaInstitutionEvidence(tx),manifest,config.now,students,context),repository=new PrismaAttendanceCorrectionRequestRepository(db,manifest,context,new PrismaAttendanceCorrectionRequester(guardian,student),sessions,tx=>new PrismaCommandEvidence(tx),config.protectedCorrectionStorageEnabled,config.now);return {...createAttendanceCorrectionRequestUseCases(repository),disconnect:()=>db.$disconnect()};}
