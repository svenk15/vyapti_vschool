import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {AccessError} from '../modules/access/contracts';
import {createEventsUseCases} from '../modules/events/application/events';
import {createMeetingUseCases} from '../modules/events/application/meetings';
import {PrismaEventsRepository} from '../modules/events/infrastructure/events';
import {PrismaMeetingsRepository} from '../modules/events/infrastructure/meetings';
import {capabilityReleaseManifest,isModuleId,type ModuleId} from '../modules/tenancy/domain/entitlements';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
export function createEventsServices(config:{databaseUrl:string;releasedModules:readonly ModuleId[];now?:()=>Date}){if(!config.databaseUrl||config.releasedModules.some(id=>!isModuleId(id)))throw new AccessError('UNAVAILABLE');const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules),context=new PrismaVerifiedDatabaseContext(),repository=new PrismaEventsRepository(db,manifest,context,config.now),meetings=new PrismaMeetingsRepository(db,manifest,context,config.now);return {...createEventsUseCases(repository),meetings:createMeetingUseCases(meetings),disconnect:()=>db.$disconnect()};}
