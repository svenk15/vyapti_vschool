import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createTenancyModuleUseCases} from '../modules/tenancy/application/modules';
import {PrismaInstitutionEvidence} from '../modules/tenancy/infrastructure/evidence';
import {PrismaTenancyModuleRepository,PrismaCurrentModulePermission} from '../modules/tenancy/infrastructure/modules';
import {PrismaAccessTrustModeInvalidator} from '../modules/access/infrastructure/trust-mode-invalidation';
import {capabilityReleaseManifest,releasedModuleIds,type ModuleId} from '../modules/tenancy/domain/entitlements';
export function createTenancyServices(config:{databaseUrl:string;now?:()=>Date;releasedModules?:readonly ModuleId[]}){
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]});
 const manifest=capabilityReleaseManifest(config.releasedModules??releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES)),repository=new PrismaTenancyModuleRepository(db,tx=>new PrismaInstitutionEvidence(tx),manifest,config.now,new PrismaAccessTrustModeInvalidator());
 return {...createTenancyModuleUseCases(repository,new PrismaCurrentModulePermission(db),manifest),disconnect:()=>db.$disconnect()};
}
