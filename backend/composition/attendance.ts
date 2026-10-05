import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import type {ModuleId} from '../modules/tenancy/domain/entitlements';
import {capabilityReleaseManifest,releasedModuleIds} from '../modules/tenancy/domain/entitlements';
import {PrismaInstitutionEvidence} from '../modules/tenancy/infrastructure/evidence';
import {createAttendanceUseCases} from '../modules/attendance/application/sessions';
import {PrismaSessionRepository} from '../modules/attendance/infrastructure/sessions';
export function createAttendanceServices(config:{databaseUrl:string;releasedModules?:readonly ModuleId[];now?:()=>Date}){
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules??releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES));
 return {...createAttendanceUseCases(new PrismaSessionRepository(db,tx=>new PrismaInstitutionEvidence(tx),manifest,config.now)),disconnect:()=>db.$disconnect()};
}
