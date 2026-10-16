import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import type {ModuleId} from '../../shared/contracts/modules';
import {AccessError} from '../modules/access/contracts';
import {createAdmissionsUseCases} from '../modules/admissions/application/admissions';
import {PrismaAdmissionsRepository} from '../modules/admissions/infrastructure/admissions';
import {capabilityReleaseManifest} from '../modules/tenancy/domain/entitlements';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
export function createAdmissionsServices(config:{databaseUrl:string;releasedModules:readonly ModuleId[];now?:()=>Date}){if(!config.databaseUrl.trim())throw new AccessError('UNAVAILABLE');const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),repo=new PrismaAdmissionsRepository(db,capabilityReleaseManifest(config.releasedModules),new PrismaVerifiedDatabaseContext(),config.now);return {...createAdmissionsUseCases(repo),disconnect:()=>db.$disconnect()};}
