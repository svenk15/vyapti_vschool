import {createHash} from 'node:crypto';
import {config} from 'dotenv';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../generated/prisma/client';
import {createAssessmentsServices} from '../backend/composition/assessments';
import {localAccessConfig} from './access-local-config';

config({path:'.env.local',quiet:true});config({quiet:true});
const peoplePath='artifacts/people-02/private-demo.json',directory='artifacts/assessments-01',privatePath=`${directory}/private-demo.json`;
type People={organizationId:string;schoolId:string;accountId:string};
const id=(value:string)=>{const hash=createHash('sha256').update(`vschool-assessments-demo:${value}`).digest('hex').slice(0,32);return `${hash.slice(0,8)}-${hash.slice(8,12)}-4${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20)}`;};
const digest=(value:string)=>createHash('sha256').update(value).digest('hex');

async function main(){
 let stage='configuration';
 const local=localAccessConfig();if(!existsSync(peoplePath))throw new Error('PEOPLE_DEMO_REQUIRED');
 const people=JSON.parse(readFileSync(peoplePath,'utf8')) as People,now=new Date(),scope={organizationId:people.organizationId,schoolId:people.schoolId},db=new PrismaClient({adapter:new PrismaPg({connectionString:local.databaseUrl,max:1}),log:[]});let cycleId='',planItemId='',cohortMemberId='';
 try{
  stage='scope';
  const placement=await db.sectionPlacement.findFirst({where:{...scope,enrollment:{student:{status:'ACTIVE'}}},orderBy:[{validFrom:'desc'},{id:'asc'}],include:{enrollment:true,section:{include:{year:true}}}});if(!placement)throw new Error('ASSESSMENTS_PLACEMENT_REQUIRED');
  const subject=await db.subject.findFirst({where:{...scope,active:true},orderBy:{id:'asc'}});if(!subject)throw new Error('ASSESSMENTS_SUBJECT_REQUIRED');
  stage='availability';await db.organizationEntitlement.upsert({where:{organizationId_moduleId:{organizationId:scope.organizationId,moduleId:'assessments'}},create:{id:id(`${scope.organizationId}:entitlement`),organizationId:scope.organizationId,moduleId:'assessments',state:'ACTIVE',startsAt:new Date('2026-01-01T00:00:00.000Z'),limits:{},manifestVersion:1,version:1},update:{}});
  await db.branchActivation.upsert({where:{organizationId_schoolId_moduleId:{...scope,moduleId:'assessments'}},create:{id:id(`${scope.schoolId}:activation`),...scope,moduleId:'assessments',state:'ACTIVE',version:1,enabledAt:now},update:{}});
  const scaleId=id(`${scope.schoolId}:scale`),planId=id(`${scope.schoolId}:plan:${subject.id}`),cohortId=id(`${scope.schoolId}:cohort:${placement.enrollment.studentId}`),outcomeId=id(`${scope.schoolId}:outcome:${planId}:${cohortId}`);cycleId=id(`${scope.schoolId}:cycle`);planItemId=planId;cohortMemberId=cohortId;
  stage='scale';if(!await db.assessmentsScale.findUnique({where:{id:scaleId}}))await db.assessmentsScale.create({data:{id:scaleId,...scope,code:'DEMO-PERCENT',name:'Synthetic percentage scale',minimumScaled:0,maximumScaled:10000,precision:2,rounding:'HALF_UP',status:'ACTIVE',version:1,createdAt:now}});
  stage='cycle';if(!await db.assessmentsCycle.findUnique({where:{id:cycleId}}))await db.assessmentsCycle.create({data:{id:cycleId,...scope,academicYearId:placement.yearId,sectionId:placement.sectionId,scaleId,code:'DEMO-TERM-1',name:'Synthetic term readiness',schemeVersion:1,state:'MODERATION',sourceCutoff:now,version:1,createdAt:now,updatedAt:now}});
  stage='plan';if(!await db.assessmentsPlanItem.findUnique({where:{id:planId}}))await db.assessmentsPlanItem.create({data:{id:planId,...scope,cycleId,subjectId:subject.id,maximumScaled:10000,weightBasisPoints:10000,required:true,position:1}});
  stage='cohort';if(!await db.assessmentsCohortMember.findUnique({where:{id:cohortId}}))await db.assessmentsCohortMember.create({data:{id:cohortId,...scope,cycleId,studentId:placement.enrollment.studentId,enrollmentId:placement.enrollmentId,placementId:placement.id,yearId:placement.yearId,state:'ACTIVE',position:1,frozenAt:now}});
  stage='outcome';if(!await db.assessmentsOutcome.findUnique({where:{id:outcomeId}})){await db.assessmentsOutcome.create({data:{id:outcomeId,...scope,cycleId,planItemId:planId,cohortMemberId:cohortId,state:'NUMERIC',scoreScaled:0,recorderAccountId:people.accountId,currentRevision:1,version:1,updatedAt:now}});await db.assessmentsOutcomeRevision.create({data:{id:id(`${outcomeId}:revision:1`),...scope,outcomeId,number:1,state:'NUMERIC',scoreScaled:0,recorderAccountId:people.accountId,recordedAt:now}});}
  stage='moderation';const moderationId=id(`${scope.schoolId}:moderation:${planId}`);if(!await db.assessmentsModeration.findUnique({where:{id:moderationId}}))await db.assessmentsModeration.create({data:{id:moderationId,...scope,cycleId,planItemId:planId,evidenceVersion:1,evidenceDigest:digest(`${cycleId}:${planId}:1`),status:'PENDING',version:1,updatedAt:now}});
  stage='report';const reportId=id(`${scope.schoolId}:report:${cohortId}:1`);if(!await db.assessmentsReportRevision.findUnique({where:{id:reportId}}))await db.assessmentsReportRevision.create({data:{id:reportId,...scope,cycleId,cohortMemberId:cohortId,number:1,sourceCycleVersion:1,sourceDigest:digest(`${cycleId}:${cohortId}:1`),status:'WITHHELD',createdAt:now}});
 }catch(error){if(process.env.VSCHOOL_SEED_DEBUG==='1'&&error instanceof Error)console.error(error.message);const code=error&&typeof error==='object'&&'code' in error&&typeof error.code==='string'&&/^[A-Z0-9_]+$/.test(error.code)?error.code:null,message=error instanceof Error&&/^[A-Z0-9_]+$/.test(error.message)?error.message:null;throw new Error(`ASSESSMENTS_DEMO_${stage.toUpperCase()}_${message??code??'FAILED'}`);}finally{await db.$disconnect();}
 const assessments=createAssessmentsServices({databaseUrl:local.databaseUrl,releasedModules:['academic_core','assessments','student_core'],mode:'synthetic'});
 try{stage='grant';await assessments.grantOversight(local.operator,{...scope,accountId:people.accountId});stage='verification';const view=await assessments.leadershipReadiness({accountId:people.accountId,tokenVersion:1},scope.organizationId,scope.schoolId,cycleId);if(view.counts.numeric!==1||view.counts.moderationPending!==1||view.counts.reportsWithheld!==1||view.readyForApproval)throw new Error('ASSESSMENTS_SCENARIO_INVALID');mkdirSync(directory,{recursive:true,mode:0o700});writeFileSync(privatePath,`${JSON.stringify({...scope,cycleId,planItemId,cohortMemberId},null,2)}\n`,{mode:0o600});console.log(`Prepared or preserved synthetic Assessments readiness data. Private scenario: ${privatePath}`);}catch(error){const code=error&&typeof error==='object'&&'code' in error&&typeof error.code==='string'&&/^[A-Z0-9_]+$/.test(error.code)?error.code:null,message=error instanceof Error&&/^[A-Z0-9_]+$/.test(error.message)?error.message:null;throw new Error(`ASSESSMENTS_DEMO_${stage.toUpperCase()}_${message??code??'FAILED'}`);}finally{await assessments.disconnect();}
}
main().catch(error=>{const code=error&&typeof error==='object'&&'code' in error&&typeof error.code==='string'&&/^[A-Z0-9_]+$/.test(error.code)?error.code:null,message=error instanceof Error&&/^[A-Z0-9_]+$/.test(error.message)?error.message:null;console.error(message??code??'ASSESSMENTS_DEMO_ERROR');process.exitCode=1;});
