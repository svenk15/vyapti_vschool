import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import type {ModuleId} from '../modules/tenancy/domain/entitlements';
import {capabilityReleaseManifest} from '../modules/tenancy/domain/entitlements';
import {createAttendanceReportUseCases} from '../modules/reporting/application/attendance-report';
import {PrismaAttendanceReportRepository} from '../modules/reporting/infrastructure/attendance-report';
import {PrismaPlatformAuditWriter} from '../modules/platform/infrastructure/audit-writer';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
export function createReportingServices(config:{databaseUrl:string;releasedModules:readonly ModuleId[];now?:()=>Date}){const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules);return {...createAttendanceReportUseCases(new PrismaAttendanceReportRepository(db,manifest,config.now,tx=>new PrismaPlatformAuditWriter(tx),new PrismaVerifiedDatabaseContext())),disconnect:()=>db.$disconnect()};}
