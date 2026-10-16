import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import type {ModuleId} from '../modules/tenancy/domain/entitlements';
import {capabilityReleaseManifest} from '../modules/tenancy/domain/entitlements';
import {createAttendanceReportUseCases} from '../modules/reporting/application/attendance-report';
import {PrismaAttendanceReportRepository} from '../modules/reporting/infrastructure/attendance-report';
import {PrismaPlatformAuditWriter} from '../modules/platform/infrastructure/audit-writer';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
import {createSchoolAdminOverviewUseCases} from '../modules/reporting/application/school-admin-overview';
import {PrismaSchoolAdminOverviewRepository} from '../modules/reporting/infrastructure/school-admin-overview';
import {createLeadershipCoverageUseCases} from '../modules/attendance/application/leadership-coverage';
import {PrismaLeadershipCoverageRepository} from '../modules/attendance/infrastructure/leadership-coverage';
import {createLeadershipExportUseCases} from '../modules/reporting/application/leadership-export';
import {PrismaLeadershipExportRepository} from '../modules/reporting/infrastructure/leadership-export';
export function createReportingServices(config:{databaseUrl:string;releasedModules:readonly ModuleId[];now?:()=>Date}){const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules),context=new PrismaVerifiedDatabaseContext(),coverage=createLeadershipCoverageUseCases(new PrismaLeadershipCoverageRepository(db,manifest,config.now,context));return {...createAttendanceReportUseCases(new PrismaAttendanceReportRepository(db,manifest,config.now,tx=>new PrismaPlatformAuditWriter(tx),context)),...createSchoolAdminOverviewUseCases(new PrismaSchoolAdminOverviewRepository(db,manifest,config.now,context)),...createLeadershipExportUseCases({attendanceCoverage:(actor,organizationId,schoolId,input)=>coverage.get(actor,organizationId,schoolId,input)},new PrismaLeadershipExportRepository(db,manifest,config.now,tx=>new PrismaPlatformAuditWriter(tx),context)),disconnect:()=>db.$disconnect()};}
