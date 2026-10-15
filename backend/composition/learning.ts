import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {createLearningUseCases} from '../modules/learning/application/assignments';
import {PrismaLearningRepository} from '../modules/learning/infrastructure/assignments';
import {capabilityReleaseManifest,type ModuleId} from '../modules/tenancy/domain/entitlements';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';

export function createLearningServices(config:{databaseUrl:string;releasedModules?:readonly ModuleId[];now?:()=>Date}){if(!config.databaseUrl)throw new Error('DATABASE_URL_REQUIRED');const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl}),log:[]}),repository=new PrismaLearningRepository(db,capabilityReleaseManifest(config.releasedModules),new PrismaVerifiedDatabaseContext(),config.now);return {...createLearningUseCases(repository),disconnect:()=>db.$disconnect()};}
