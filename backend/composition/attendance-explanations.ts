import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {createAttendanceExplanationUseCases} from '../modules/attendance/application/explanations';
import {AttendanceExplanationError} from '../modules/attendance/domain/explanations';
import {PrismaAttendanceExplanationRepository} from '../modules/attendance/infrastructure/explanations';
import {PrismaGuardianChildAccessVerifier} from '../modules/guardians/infrastructure/access-verification';
import {PrismaCommandEvidence} from '../modules/platform/infrastructure/command-evidence';
import {capabilityReleaseManifest,isModuleId,type ModuleId} from '../modules/tenancy/domain/entitlements';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
export type AttendanceExplanationConfiguration=Readonly<{databaseUrl:string;releasedModules:readonly ModuleId[];protectedExplanationStorageEnabled:boolean;now?:()=>Date}>;
export function createAttendanceExplanationServices(config:AttendanceExplanationConfiguration){if(!config.databaseUrl||!Array.isArray(config.releasedModules)||config.releasedModules.some(id=>!isModuleId(id))||typeof config.protectedExplanationStorageEnabled!=='boolean')throw new AttendanceExplanationError('UNAVAILABLE');const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules),context=new PrismaVerifiedDatabaseContext(),guardian=new PrismaGuardianChildAccessVerifier(manifest,context,config.now),repository=new PrismaAttendanceExplanationRepository(db,manifest,context,guardian,tx=>new PrismaCommandEvidence(tx),config.protectedExplanationStorageEnabled,config.now);return {...createAttendanceExplanationUseCases(repository),disconnect:()=>db.$disconnect()};}
