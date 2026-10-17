import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {createLearningUseCases} from '../modules/learning/application/assignments';
import {createLearningSubmissionUseCases} from '../modules/learning/application/submissions';
import {createLearningFeedbackUseCases} from '../modules/learning/application/feedback';
import {createLeadershipLearningUseCases} from '../modules/learning/application/leadership';
import {createLearningRecipientPolicyUseCases} from '../modules/learning/application/recipient-policy';
import {PrismaLearningRepository} from '../modules/learning/infrastructure/assignments';
import {PrismaLearningSubmissionRepository} from '../modules/learning/infrastructure/submissions';
import {PrismaLearningFeedbackRepository} from '../modules/learning/infrastructure/feedback';
import {PrismaLeadershipLearningRepository} from '../modules/learning/infrastructure/leadership';
import {PrismaLearningRecipientPolicyRepository} from '../modules/learning/infrastructure/recipient-policy';
import {capabilityReleaseManifest,type ModuleId} from '../modules/tenancy/domain/entitlements';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';

export function createLearningServices(config:{databaseUrl:string;releasedModules?:readonly ModuleId[];recipientPolicyMode?:'disabled'|'synthetic';now?:()=>Date}){if(!config.databaseUrl)throw new Error('DATABASE_URL_REQUIRED');const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl}),log:[]}),manifest=capabilityReleaseManifest(config.releasedModules),context=new PrismaVerifiedDatabaseContext(),repository=new PrismaLearningRepository(db,manifest,context,config.now),submissions=new PrismaLearningSubmissionRepository(db,manifest,context,config.now),feedback=new PrismaLearningFeedbackRepository(db,manifest,context,config.now),leadership=new PrismaLeadershipLearningRepository(db,manifest,context,config.now),recipientPolicy=new PrismaLearningRecipientPolicyRepository(db,manifest,context,config.recipientPolicyMode??'disabled',config.now);return {...createLearningUseCases(repository),...createLearningSubmissionUseCases(submissions),...createLearningFeedbackUseCases(feedback),...createLeadershipLearningUseCases(leadership),...createLearningRecipientPolicyUseCases(recipientPolicy),disconnect:()=>db.$disconnect()};}
