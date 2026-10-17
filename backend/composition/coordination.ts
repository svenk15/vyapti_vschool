import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import type {ModuleId} from '../modules/tenancy/domain/entitlements';
import {capabilityReleaseManifest} from '../modules/tenancy/domain/entitlements';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
import {PrismaPlatformAuditWriter} from '../modules/platform/infrastructure/audit-writer';
import {PrismaAttendanceCoordinationEvidence} from '../modules/attendance/infrastructure/coordination-evidence';
import {PrismaAttendancePupilPatternCoordinationEvidence,PrismaAttendancePupilReviewPolicy} from '../modules/attendance/infrastructure/pupil-review';
import {PrismaLearningCoordinationEvidence,PrismaLearningFeedbackCoordinationEvidence} from '../modules/learning/infrastructure/coordination-evidence';
import {PrismaMeetingActionCoordinationEvidence} from '../modules/events/infrastructure/coordination-evidence';
import {PrismaFacilitiesCoordinationEvidence} from '../modules/facilities/infrastructure/coordination-evidence';
import {PrismaAssessmentsCoordinationEvidence} from '../modules/assessments/infrastructure/coordination-evidence';
import {createCoordinationUseCases} from '../modules/coordination/application/requests';
import {PrismaCoordinationRepository} from '../modules/coordination/infrastructure/requests';
import {CoordinationSourceRegistry} from '../modules/coordination/infrastructure/source-registry';

export function createCoordinationServices(config:{databaseUrl:string;releasedModules:readonly ModuleId[];mode:'disabled'|'synthetic';now?:()=>Date}){const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules),context=new PrismaVerifiedDatabaseContext(),attendance=new PrismaAttendanceCoordinationEvidence(manifest,context,config.now),pupilPolicy=new PrismaAttendancePupilReviewPolicy(manifest,context,config.mode,config.now),pupilPattern=new PrismaAttendancePupilPatternCoordinationEvidence(pupilPolicy),learning=new PrismaLearningCoordinationEvidence(manifest,context,config.now),feedback=new PrismaLearningFeedbackCoordinationEvidence(manifest,context,config.now),meetingAction=new PrismaMeetingActionCoordinationEvidence(manifest,context,config.now),facilities=new PrismaFacilitiesCoordinationEvidence(manifest,context,config.now),assessments=new PrismaAssessmentsCoordinationEvidence(manifest,context,config.now),sources=new CoordinationSourceRegistry([attendance,pupilPattern,learning,feedback,meetingAction,facilities,assessments]),repository=new PrismaCoordinationRepository(db,config.mode,sources,context,tx=>new PrismaPlatformAuditWriter(tx),config.now);return {...createCoordinationUseCases(repository),disconnect:()=>db.$disconnect()};}
