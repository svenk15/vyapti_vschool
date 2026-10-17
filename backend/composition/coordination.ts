import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import type {ModuleId} from '../modules/tenancy/domain/entitlements';
import {capabilityReleaseManifest} from '../modules/tenancy/domain/entitlements';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
import {PrismaPlatformAuditWriter} from '../modules/platform/infrastructure/audit-writer';
import {PrismaAttendanceCoordinationEvidence} from '../modules/attendance/infrastructure/coordination-evidence';
import {PrismaLearningCoordinationEvidence,PrismaLearningFeedbackCoordinationEvidence} from '../modules/learning/infrastructure/coordination-evidence';
import {createCoordinationUseCases} from '../modules/coordination/application/requests';
import {PrismaCoordinationRepository} from '../modules/coordination/infrastructure/requests';
import {CoordinationSourceRegistry} from '../modules/coordination/infrastructure/source-registry';

export function createCoordinationServices(config:{databaseUrl:string;releasedModules:readonly ModuleId[];mode:'disabled'|'synthetic';now?:()=>Date}){const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules),context=new PrismaVerifiedDatabaseContext(),attendance=new PrismaAttendanceCoordinationEvidence(manifest,context,config.now),learning=new PrismaLearningCoordinationEvidence(manifest,context,config.now),feedback=new PrismaLearningFeedbackCoordinationEvidence(manifest,context,config.now),sources=new CoordinationSourceRegistry([attendance,learning,feedback]),repository=new PrismaCoordinationRepository(db,config.mode,sources,context,tx=>new PrismaPlatformAuditWriter(tx),config.now);return {...createCoordinationUseCases(repository),disconnect:()=>db.$disconnect()};}
