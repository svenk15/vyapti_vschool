import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaCommandEvidence} from '../modules/platform/infrastructure/command-evidence';
import {capabilityReleaseManifest,releasedModuleIds,type ModuleId} from '../modules/tenancy/domain/entitlements';
import {createImportsUseCases} from '../modules/imports/application/imports';
import {PrismaImportsRepository} from '../modules/imports/infrastructure/imports';
import {createStudentsServices} from './students';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
export function createImportsServices(config:{databaseUrl:string;cursorSecret?:string;now?:()=>Date;releasedModules?:readonly ModuleId[]}){
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules??releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES)),students=createStudentsServices({...config,databaseUrl:config.databaseUrl});
 return {...createImportsUseCases(new PrismaImportsRepository(db,tx=>new PrismaCommandEvidence(tx),config.now,config.cursorSecret??process.env.NEXTAUTH_SECRET??'',manifest,new PrismaVerifiedDatabaseContext(),students.enlistedRegistration)),disconnect:async()=>{await db.$disconnect();await students.disconnect();}};
}
