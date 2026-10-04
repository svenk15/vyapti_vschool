import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAcademicSetupUseCases,NO_ATTENDANCE_SESSIONS,type CalendarImpactPort} from '../modules/academics/application/setup';
import {PrismaAcademicSetupRepository} from '../modules/academics/infrastructure/setup';
import {PrismaInstitutionEvidence} from '../modules/tenancy/infrastructure/evidence';
import {capabilityReleaseManifest,releasedModuleIds,type ModuleId} from '../modules/tenancy/domain/entitlements';
export function createAcademicServices(config:{databaseUrl:string;releasedModules?:readonly ModuleId[];now?:()=>Date;calendarImpact?:CalendarImpactPort}){
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules??releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES));
 return {...createAcademicSetupUseCases(new PrismaAcademicSetupRepository(db,tx=>new PrismaInstitutionEvidence(tx),manifest,config.now,config.calendarImpact??NO_ATTENDANCE_SESSIONS)),disconnect:()=>db.$disconnect()};
}
