import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {AccessError} from '../modules/access/contracts/index';
import {createAssistantUseCases} from '../modules/assistant/application/assistant';
import {PrismaAssistantRepository} from '../modules/assistant/infrastructure/assistant';
import {DeterministicAssistantModel} from '../modules/assistant/infrastructure/deterministic-model';
import {PrismaPlatformAuditWriter} from '../modules/platform/infrastructure/audit-writer';
import {ReportingSnapshotAssistantSource} from '../modules/reporting/infrastructure/assistant-source';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
import type {ModuleId} from '../modules/tenancy/domain/entitlements';
import {createReportingServices} from './reporting';

export function createAssistantServices(config:{databaseUrl:string;releasedModules:readonly ModuleId[];mode?:'disabled'|'synthetic';now?:()=>Date}){if(!config.databaseUrl)throw new AccessError('UNAVAILABLE');const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),reporting=createReportingServices({databaseUrl:config.databaseUrl,releasedModules:config.releasedModules,snapshotMode:config.mode==='synthetic'?'synthetic':'disabled',now:config.now}),repository=new PrismaAssistantRepository(db,config.mode??'disabled',new PrismaVerifiedDatabaseContext(),tx=>new PrismaPlatformAuditWriter(tx),config.now),facade=createAssistantUseCases(new ReportingSnapshotAssistantSource(reporting),new DeterministicAssistantModel(),repository);return {...facade,disconnect:async()=>{await Promise.all([db.$disconnect(),reporting.disconnect()]);}};}
