import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {resolveTxt} from 'node:dns/promises';
import {createBrandingUseCases} from '../modules/branding/application/brands';
import {PrismaBrandingRepository,PrismaCurrentBrandPermission} from '../modules/branding/infrastructure/brands';
import {PrismaInstitutionEvidence} from '../modules/tenancy/infrastructure/evidence';
import {NodePngSanitizer} from '../modules/branding/infrastructure/png';
import {NodeBrandingSecurity} from '../modules/branding/infrastructure/security';
export function createBrandingServices(config:{databaseUrl:string;resolveTxt?:(name:string)=>Promise<string[][]>}){
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),repository=new PrismaBrandingRepository(db,tx=>new PrismaInstitutionEvidence(tx)),permission=new PrismaCurrentBrandPermission(db),hostPort={async txt(name:string){const records=await (config.resolveTxt??resolveTxt)(name);return records.map(parts=>parts.join(''));}};
 return {...createBrandingUseCases(repository,permission,hostPort,new NodePngSanitizer(),new NodeBrandingSecurity()),disconnect:()=>db.$disconnect()};
}
