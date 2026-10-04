import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createTenancyModuleUseCases} from '../modules/tenancy/application/modules';
import {PrismaInstitutionEvidence} from '../modules/tenancy/infrastructure/evidence';
import {PrismaTenancyModuleRepository,PrismaCurrentModulePermission} from '../modules/tenancy/infrastructure/modules';
import {capabilityReleaseManifest} from '../modules/tenancy/domain/entitlements';
export function createTenancyServices(config:{databaseUrl:string;now?:()=>Date}){
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]});
 const manifest=capabilityReleaseManifest(),repository=new PrismaTenancyModuleRepository(db,tx=>new PrismaInstitutionEvidence(tx),manifest,config.now);
 return {...createTenancyModuleUseCases(repository,new PrismaCurrentModulePermission(db),manifest),disconnect:()=>db.$disconnect()};
}
