import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {AccessError} from '../modules/access/contracts';
import {createFinanceUseCases} from '../modules/finance/application/finance';
import {PrismaFinanceRepository} from '../modules/finance/infrastructure/finance';
import {capabilityReleaseManifest,isModuleId,type ModuleId} from '../modules/tenancy/domain/entitlements';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
export function createFinanceServices(config:{databaseUrl:string;releasedModules:readonly ModuleId[];now?:()=>Date}){if(!config.databaseUrl||config.releasedModules.some(id=>!isModuleId(id)))throw new AccessError('UNAVAILABLE');const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),repo=new PrismaFinanceRepository(db,capabilityReleaseManifest(config.releasedModules),new PrismaVerifiedDatabaseContext(),config.now);return {...createFinanceUseCases(repo),disconnect:()=>db.$disconnect()};}
