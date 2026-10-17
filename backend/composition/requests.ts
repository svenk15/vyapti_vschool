import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import type {ModuleId} from '../modules/tenancy/domain/entitlements';
import {capabilityReleaseManifest} from '../modules/tenancy/domain/entitlements';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
import {PrismaPlatformAuditWriter} from '../modules/platform/infrastructure/audit-writer';
import {createRequestsUseCases} from '../modules/requests/application/requests';
import {PrismaRequestsRepository} from '../modules/requests/infrastructure/prisma-requests-repository';
export function createRequestsServices(config:{databaseUrl:string;releasedModules:readonly ModuleId[];mode:'disabled'|'synthetic';now?:()=>Date}){const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),context=new PrismaVerifiedDatabaseContext(),repository=new PrismaRequestsRepository(db,config.mode,capabilityReleaseManifest(config.releasedModules),context,tx=>new PrismaPlatformAuditWriter(tx),config.now);return {...createRequestsUseCases(repository),disconnect:()=>db.$disconnect()};}
