import {afterAll,beforeAll,describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAccessServices} from '../../backend/composition/access';
import {createAcademicServices} from '../../backend/composition/academics';
import {createCoordinationServices} from '../../backend/composition/coordination';
import {createTenancyServices} from '../../backend/composition/tenancy';
import {activeStaffFixture,schoolInput} from '../fixtures/access-management';

const url=process.env.TEST_DATABASE_URL??'';
if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated Coordination PostgreSQL test DB required');
const released=['academic_core','attendance','student_core','staff_core'] as const;
const access=createAccessServices({databaseUrl:url});
const tenancy=createTenancyServices({databaseUrl:url,releasedModules:released});
const academics=createAcademicServices({databaseUrl:url,releasedModules:['academic_core']});
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]});
const now=new Date('2026-10-16T12:30:00.000Z');
const coordination=createCoordinationServices({databaseUrl:url,releasedModules:released,mode:'synthetic',now:()=>now});
const operator={operatorId:randomUUID(),verified:true as const};
const reason='Synthetic Coordination integration';
let scope:Awaited<ReturnType<typeof access.provisionSchool>>;
let creator:{accountId:string;tokenVersion:number};
let worker:{accountId:string;tokenVersion:number};
let workerAccountId:string;
let offeringId:string;
let calendarRevisionId:string;

async function source(status:'SCHEDULED'|'SUBMITTED'|'CANCELLED'='SCHEDULED'){
 const id=randomUUID(),version=status==='SCHEDULED'?1:2;
 await db.attendanceSession.create({data:{id,organizationId:scope.organizationId,schoolId:scope.schoolId,offeringId,schoolDate:new Date('2026-10-16T00:00:00.000Z'),startsAt:new Date('2026-10-16T03:30:00.000Z'),endsAt:new Date('2026-10-16T04:15:00.000Z'),occurrenceKey:`COORD-${randomUUID()}`,calendarRevisionId,status,version,stateUpdatedAt:now,...(status==='SUBMITTED'?{openedAt:new Date('2026-10-16T03:30:00.000Z'),submittedAt:new Date('2026-10-16T04:16:00.000Z'),submittedBy:workerAccountId,rosterRevision:'a'.repeat(64)}:{}),...(status==='CANCELLED'?{cancelledAt:new Date('2026-10-16T04:16:00.000Z')}:{})}});
 return {id,version,status};
}
const commandKey=()=>`coordination-${randomUUID()}`;

beforeAll(async()=>{
 scope=await access.provisionSchool(schoolInput(),operator);
 worker={accountId:scope.accountId,tokenVersion:1};workerAccountId=scope.accountId;
 await access.institutionOperation({kind:'SetInstitutionGrant',organizationId:scope.organizationId,accountId:scope.accountId,status:'ACTIVE',expectedVersion:0,key:randomUUID(),reason},operator);
 for(const moduleId of released)await tenancy.setEntitlement(operator,{kind:'SetOrganizationEntitlement',organizationId:scope.organizationId,actorAccountId:scope.accountId,moduleId,state:'ACTIVE',startsAt:'2026-01-01T00:00:00.000Z',endsAt:null,expectedVersion:0,manifestVersion:1,limits:{},key:randomUUID(),reason});
 const preview=await tenancy.preview(worker,scope.organizationId,scope.schoolId,['attendance']);
 await tenancy.confirm(worker,scope.organizationId,scope.schoolId,{enabled:['attendance'],expectedVersions:preview.expectedVersions,previewHash:preview.previewHash,expectedInstitutionRevision:preview.institutionRevision,expectedBranchRevision:preview.branchRevision,key:randomUUID(),reason});
 const year=await academics.createYear(worker,scope.organizationId,scope.schoolId,{code:`CO${randomUUID().slice(0,6)}`,name:'Coordination year',startsOn:'2026-04-01',endsOn:'2027-04-01',key:randomUUID(),reason});
 await academics.publishCalendar(worker,scope.organizationId,scope.schoolId,year.calendarId,{expectedVersion:1,teachingWeekdays:[1,2,3,4,5,6,7],exceptions:[],key:randomUUID(),reason});
 await academics.transitionYear(worker,scope.organizationId,scope.schoolId,year.id,{expectedVersion:1,target:'OPEN',key:randomUUID(),reason});
 const grade=await academics.createGrade(worker,scope.organizationId,scope.schoolId,{code:`CO${randomUUID().slice(0,5)}`,name:'Coordination grade',key:randomUUID(),reason});
 const subject=await academics.createSubject(worker,scope.organizationId,scope.schoolId,{code:`CO${randomUUID().slice(0,5)}`,name:'Coordination subject',key:randomUUID(),reason});
 const section=await academics.createSection(worker,scope.organizationId,scope.schoolId,{yearId:year.id,gradeId:grade.id,campusId:null,code:'A',name:'Section A',key:randomUUID(),reason});
 offeringId=(await academics.create(worker,scope.organizationId,scope.schoolId,{yearId:year.id,sectionId:section.id,subjectId:subject.id,code:'CO-A',key:randomUUID(),reason})).id;
 calendarRevisionId=(await db.schoolCalendar.findUniqueOrThrow({where:{id:year.calendarId},select:{currentRevisionId:true}})).currentRevisionId!;
 const principal=await activeStaffFixture(db,scope,['PRINCIPAL']);creator=principal.identity;
 for(const capability of ['coordination.create','coordination.assign','coordination.verify','coordination.manage'] as const)await coordination.grant(operator,{organizationId:scope.organizationId,schoolId:scope.schoolId,accountId:creator.accountId,capability});
 await coordination.grant(operator,{organizationId:scope.organizationId,schoolId:scope.schoolId,accountId:worker.accountId,capability:'coordination.work'});
});

afterAll(async()=>{await coordination.disconnect();await academics.disconnect();await tenancy.disconnect();await access.disconnect();await db.$disconnect();});

describe('Coordination Attendance follow-ups in PostgreSQL',()=>{
 it('enforces designation, active uniqueness, scope and exact idempotent creation',async()=>{
  const attendance=await source(),key=commandKey(),input={sessionId:attendance.id,kind:'MISSING_REGISTER',concern:'MISSING_REGISTER',note:'Operational note unique to audit exclusion 72ec.',dueLocal:'2026-10-16T19:00',key} as const;
  const created=await coordination.create(creator,scope.organizationId,scope.schoolId,input);
  expect(created).toMatchObject({status:'OPEN',version:1,replayed:false});
  expect(await coordination.create(creator,scope.organizationId,scope.schoolId,input)).toMatchObject({...created,replayed:true});
  await expect(coordination.create(creator,scope.organizationId,scope.schoolId,{...input,note:'different'})).rejects.toMatchObject({code:'IDEMPOTENCY_CONFLICT'});
  await expect(coordination.create(creator,scope.organizationId,scope.schoolId,{...input,key:commandKey()})).rejects.toMatchObject({code:'CONFLICT'});
  await expect(coordination.get(worker,scope.organizationId,scope.schoolId,created.requestId)).rejects.toMatchObject({code:'NOT_FOUND'});
  await expect(coordination.get(creator,scope.organizationId,randomUUID(),created.requestId)).rejects.toMatchObject({code:'FORBIDDEN'});
  const audit=await db.auditEntry.findFirstOrThrow({where:{module:'coordination',resourceId:created.requestId}});
  expect(JSON.stringify(audit)).not.toContain('Operational note unique');
 });

 it('supports assignment, return, independent verification, reopen and current-authority denial',async()=>{
  const attendance=await source(),created=await coordination.create(creator,scope.organizationId,scope.schoolId,{sessionId:attendance.id,kind:'MISSING_REGISTER',concern:'MISSING_REGISTER',note:null,dueLocal:null,key:commandKey()});
  const assigned=await coordination.assign(creator,scope.organizationId,scope.schoolId,{requestId:created.requestId,assigneeAccountId:worker.accountId,dueLocal:'2026-10-16T18:30',expectedVersion:created.version,reason:'Assign to attendance administrator',key:commandKey()});
  expect((await coordination.list(worker,scope.organizationId,scope.schoolId,{assignment:'mine'})).items).toHaveLength(1);
  const started=await coordination.start(worker,scope.organizationId,scope.schoolId,{requestId:created.requestId,expectedVersion:assigned.version,reason:null,key:commandKey()});
  const submitted=await coordination.submit(worker,scope.organizationId,scope.schoolId,{requestId:created.requestId,expectedVersion:started.version,kind:'NO_CHANGE_NEEDED',revision:null,reason:'Register is now present; no correction needed.',key:commandKey()});
  await coordination.grant(operator,{organizationId:scope.organizationId,schoolId:scope.schoolId,accountId:worker.accountId,capability:'coordination.verify'});
  await expect(coordination.verify(worker,scope.organizationId,scope.schoolId,{requestId:created.requestId,expectedVersion:submitted.version,reason:null,key:commandKey()})).rejects.toMatchObject({code:'FORBIDDEN'});
  const returned=await coordination.returnResolution(creator,scope.organizationId,scope.schoolId,{requestId:created.requestId,expectedVersion:submitted.version,reason:'Add clearer evidence.',key:commandKey()});
  const resubmitted=await coordination.submit(worker,scope.organizationId,scope.schoolId,{requestId:created.requestId,expectedVersion:returned.version,kind:'NO_CHANGE_NEEDED',revision:null,reason:'Register confirmed in the authoritative session.',key:commandKey()});
  const resolved=await coordination.verify(creator,scope.organizationId,scope.schoolId,{requestId:created.requestId,expectedVersion:resubmitted.version,reason:null,key:commandKey()});
  expect(resolved.status).toBe('RESOLVED');
  const reopened=await coordination.reopen(creator,scope.organizationId,scope.schoolId,{requestId:created.requestId,expectedVersion:resolved.version,reason:'A new check is required.',key:commandKey()});
  expect(await coordination.get(creator,scope.organizationId,scope.schoolId,created.requestId)).toMatchObject({status:'OPEN',assignee:null,resolution:null,version:reopened.version});
  await expect(coordination.assign(creator,scope.organizationId,scope.schoolId,{requestId:created.requestId,assigneeAccountId:worker.accountId,dueLocal:null,expectedVersion:resolved.version,reason:'stale',key:commandKey()})).rejects.toMatchObject({code:'STALE_VERSION'});
  await coordination.revoke(operator,{organizationId:scope.organizationId,schoolId:scope.schoolId,accountId:worker.accountId,capability:'coordination.work'});
  await coordination.revoke(operator,{organizationId:scope.organizationId,schoolId:scope.schoolId,accountId:worker.accountId,capability:'coordination.verify'});
  await expect(coordination.list(worker,scope.organizationId,scope.schoolId,{})).rejects.toMatchObject({code:'FORBIDDEN'});
  await coordination.grant(operator,{organizationId:scope.organizationId,schoolId:scope.schoolId,accountId:worker.accountId,capability:'coordination.work'});
 });

 it('accepts only exact Attendance-owned correction and cancellation evidence',async()=>{
  const submittedSource=await source('SUBMITTED'),correctionRequest=await coordination.create(creator,scope.organizationId,scope.schoolId,{sessionId:submittedSource.id,kind:'SESSION_SETUP_REVIEW',concern:'WRONG_TIME',note:null,dueLocal:null,key:commandKey()});
  const assigned=await coordination.assign(creator,scope.organizationId,scope.schoolId,{requestId:correctionRequest.requestId,assigneeAccountId:worker.accountId,dueLocal:null,expectedVersion:1,reason:'Review submitted register',key:commandKey()}),started=await coordination.start(worker,scope.organizationId,scope.schoolId,{requestId:correctionRequest.requestId,expectedVersion:assigned.version,reason:null,key:commandKey()});
  await expect(coordination.submit(worker,scope.organizationId,scope.schoolId,{requestId:correctionRequest.requestId,expectedVersion:started.version,kind:'ATTENDANCE_CORRECTION',revision:2,reason:'Correction completed.',key:commandKey()})).rejects.toMatchObject({code:'CONFLICT'});
  await db.attendanceRevision.create({data:{id:randomUUID(),organizationId:scope.organizationId,schoolId:scope.schoolId,sessionId:submittedSource.id,number:2,kind:'CORRECT',actorAccountId:worker.accountId,occurredAt:now,reason:'Synthetic correction',changes:{schemaVersion:1}}});
  expect(await coordination.submit(worker,scope.organizationId,scope.schoolId,{requestId:correctionRequest.requestId,expectedVersion:started.version,kind:'ATTENDANCE_CORRECTION',revision:2,reason:'Correction completed.',key:commandKey()})).toMatchObject({status:'AWAITING_VERIFICATION'});
  const cancelledSource=await source('CANCELLED'),cancelRequest=await coordination.create(creator,scope.organizationId,scope.schoolId,{sessionId:cancelledSource.id,kind:'SESSION_SETUP_REVIEW',concern:'DUPLICATE',note:null,dueLocal:null,key:commandKey()}).catch(error=>error);
  expect(cancelRequest).toMatchObject({code:'CONFLICT'});
 });

 it('serializes concurrent active request creation without duplicates',async()=>{
  const attendance=await source(),create=(key:string)=>coordination.create(creator,scope.organizationId,scope.schoolId,{sessionId:attendance.id,kind:'MISSING_REGISTER',concern:'MISSING_REGISTER',note:null,dueLocal:null,key}),results=await Promise.allSettled([create(commandKey()),create(commandKey())]);
  expect(results.filter(result=>result.status==='fulfilled')).toHaveLength(1);
  expect(await db.coordinationRequest.count({where:{organizationId:scope.organizationId,schoolId:scope.schoolId,sourceId:attendance.id,kind:'MISSING_REGISTER',status:{in:['OPEN','IN_PROGRESS','AWAITING_VERIFICATION']}}})).toBe(1);
 });
});
