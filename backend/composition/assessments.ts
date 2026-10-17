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
export function createAssessmentsServices(config:{databaseUrl:string;releasedModules:readonly ModuleId[];mode:'disabled'|'synthetic';now?:()=>Date}){const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),repository=new PrismaAssessmentsRepository(db,new PrismaVerifiedDatabaseContext(),capabilityReleaseManifest(config.releasedModules),config.mode,new PrismaAssessmentAcademicPlanning(),new PrismaAssessmentCohort(),new PrismaAssessmentMarkAuthority(),config.now);return {...createAssessmentsUseCases(repository),disconnect:()=>db.$disconnect()};}
