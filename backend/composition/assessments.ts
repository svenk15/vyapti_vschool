import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import type {ModuleId} from '../modules/tenancy/domain/entitlements';
import {capabilityReleaseManifest} from '../modules/tenancy/domain/entitlements';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
import {createAssessmentsUseCases} from '../modules/assessments/application/assessments';
import {PrismaAssessmentsRepository} from '../modules/assessments/infrastructure/assessments';
import {PrismaAssessmentAcademicPlanning} from '../modules/academics/infrastructure/assessment-planning';
import {PrismaAssessmentCohort} from '../modules/students/infrastructure/assessment-cohort';
import {PrismaAssessmentMarkAuthority} from '../modules/academics/infrastructure/assessment-mark-authority';
import {createAssessmentsModerationUseCases} from '../modules/assessments/application/moderation';
import {PrismaAssessmentsModerationRepository} from '../modules/assessments/infrastructure/moderation';
import {createAssessmentReportPublicationUseCases} from '../modules/assessments/application/publication';
import {PrismaAssessmentReportPublicationRepository} from '../modules/assessments/infrastructure/publication';
export function createAssessmentsServices(config:{databaseUrl:string;releasedModules:readonly ModuleId[];mode:'disabled'|'synthetic';now?:()=>Date}){const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),context=new PrismaVerifiedDatabaseContext(),releases=capabilityReleaseManifest(config.releasedModules),markAuthority=new PrismaAssessmentMarkAuthority(),repository=new PrismaAssessmentsRepository(db,context,releases,config.mode,new PrismaAssessmentAcademicPlanning(),new PrismaAssessmentCohort(),markAuthority,config.now),moderation=new PrismaAssessmentsModerationRepository(db,context,releases,config.mode,markAuthority,config.now),publication=new PrismaAssessmentReportPublicationRepository(db,context,releases,config.mode,config.now);return {...createAssessmentsUseCases(repository),...createAssessmentsModerationUseCases(moderation),...createAssessmentReportPublicationUseCases(publication),disconnect:()=>db.$disconnect()};}
