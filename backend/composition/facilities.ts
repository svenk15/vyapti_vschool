import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {AccessError} from '../modules/access/contracts';
import {createFacilitiesUseCases} from '../modules/facilities/application/facilities';
import {PrismaFacilitiesRepository} from '../modules/facilities/infrastructure/facilities';
import {capabilityReleaseManifest,isModuleId,type ModuleId} from '../modules/tenancy/domain/entitlements';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
export function createFacilitiesServices(config:{databaseUrl:string;releasedModules:readonly ModuleId[];now?:()=>Date}){if(!config.databaseUrl||config.releasedModules.some(id=>!isModuleId(id)))throw new AccessError('UNAVAILABLE');const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),repo=new PrismaFacilitiesRepository(db,capabilityReleaseManifest(config.releasedModules),new PrismaVerifiedDatabaseContext(),config.now);return {...createFacilitiesUseCases(repo),disconnect:()=>db.$disconnect()};}
