import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {GuardianError} from '../modules/guardians/contracts';
import {BcryptPasswords} from '../modules/access/infrastructure/passwords';
import {OpaqueActivationTokens} from '../modules/access/infrastructure/activation-tokens';
import {createFamilyAccessUseCases,type FamilyEmailSender} from '../modules/guardians/application/family-access';
import {PrismaFamilyAccessRepository} from '../modules/guardians/infrastructure/family-access';
import {PrismaGuardianChildAccessVerifier} from '../modules/guardians/infrastructure/access-verification';
import {createFamilyReadUseCases} from '../modules/guardians/application/family-reads';
import {PrismaGuardianAttendanceHistory} from '../modules/attendance/infrastructure/guardian-history';
import {PrismaGuardianTimetable} from '../modules/academics/infrastructure/guardian-timetable';
import {PrismaCommandEvidence} from '../modules/platform/infrastructure/command-evidence';
import {capabilityReleaseManifest,isModuleId,type ModuleId} from '../modules/tenancy/domain/entitlements';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';

export type GuardiansServiceConfiguration=Readonly<{databaseUrl:string;releasedModules:readonly ModuleId[];emailSender:FamilyEmailSender;now?:()=>Date}>;

export function createGuardiansServices(config:GuardiansServiceConfiguration){
 if(!config.databaseUrl||!Array.isArray(config.releasedModules)||config.releasedModules.some(moduleId=>!isModuleId(moduleId)))throw new GuardianError('UNAVAILABLE');
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]});
 const manifest=capabilityReleaseManifest(config.releasedModules),context=new PrismaVerifiedDatabaseContext(),repository=new PrismaFamilyAccessRepository(db,manifest,context,tx=>new PrismaCommandEvidence(tx),config.now),verifier=new PrismaGuardianChildAccessVerifier(manifest,context,config.now);
 return {...createFamilyAccessUseCases(repository,config.emailSender,new OpaqueActivationTokens(),new BcryptPasswords(),config.now),...createFamilyReadUseCases(new PrismaGuardianAttendanceHistory(db,verifier),new PrismaGuardianTimetable(db,verifier)),disconnect:()=>db.$disconnect()};
}
