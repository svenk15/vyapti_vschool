import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {AccessError} from '../modules/access/contracts';
import {createCommunicationUseCases} from '../modules/communication/application/notices';
import {PrismaCommunicationRepository} from '../modules/communication/infrastructure/notices';
import {capabilityReleaseManifest,isModuleId,type ModuleId} from '../modules/tenancy/domain/entitlements';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
import {PrismaEmployeeAccessVerification} from '../modules/people/infrastructure/employee-access';
import {PrismaDelegatedAuthority} from '../modules/access/infrastructure/delegated-authority';
export function createCommunicationServices(config:{databaseUrl:string;releasedModules:readonly ModuleId[];now?:()=>Date}){if(!config.databaseUrl||config.releasedModules.some(id=>!isModuleId(id)))throw new AccessError('UNAVAILABLE');const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),context=new PrismaVerifiedDatabaseContext(),delegatedAuthority=new PrismaDelegatedAuthority(context,new PrismaEmployeeAccessVerification()),repository=new PrismaCommunicationRepository(db,capabilityReleaseManifest(config.releasedModules),context,delegatedAuthority,config.now);return {...createCommunicationUseCases(repository),disconnect:()=>db.$disconnect()};}
