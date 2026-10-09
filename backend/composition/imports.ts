import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaCommandEvidence} from '../modules/platform/infrastructure/command-evidence';
import {capabilityReleaseManifest,type ModuleId} from '../modules/tenancy/domain/entitlements';
import {createImportsUseCases} from '../modules/imports/application/imports';
import {PrismaImportsRepository} from '../modules/imports/infrastructure/imports';
import {createStudentsServices,validateStudentsServiceConfiguration} from './students';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
export function createImportsServices(input:{databaseUrl:string;cursorSecret:string;now?:()=>Date;releasedModules:readonly ModuleId[]}){
 const config=validateStudentsServiceConfiguration(input),db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules),students=createStudentsServices(config);
 return {...createImportsUseCases(new PrismaImportsRepository(db,tx=>new PrismaCommandEvidence(tx),config.now,config.cursorSecret,manifest,new PrismaVerifiedDatabaseContext(),students.enlistedRegistration)),disconnect:async()=>{await db.$disconnect();await students.disconnect();}};
}
