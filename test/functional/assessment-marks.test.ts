import {afterAll,beforeAll,describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAccessServices} from '../../backend/composition/access';
import {createTenancyServices} from '../../backend/composition/tenancy';
import {createAssessmentsServices} from '../../backend/composition/assessments';
import {activeStaffFixture,schoolInput} from '../fixtures/access-management';

const url=process.env.TEST_DATABASE_URL??'';if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated Assessments PostgreSQL test DB required');
const modules=['staff_core','student_core','academic_core','assessments'] as const,db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]}),access=createAccessServices({databaseUrl:url}),tenancy=createTenancyServices({databaseUrl:url,releasedModules:[...modules]}),assessments=createAssessmentsServices({databaseUrl:url,releasedModules:[...modules],mode:'synthetic',now:()=>new Date('2026-10-18T12:00:00.000Z')}),operator={operatorId:randomUUID(),verified:true as const},key=()=>randomUUID();
let scope:Awaited<ReturnType<typeof access.provisionSchool>>,admin:{accountId:string;tokenVersion:number},teacher:Awaited<ReturnType<typeof activeStaffFixture>>,unassigned:Awaited<ReturnType<typeof activeStaffFixture>>,cycleId:string,planItemId:string,cohortMemberId:string,assignmentId:string,firstKey:string;

beforeAll(async()=>{
 scope=await access.provisionSchool(schoolInput(),operator);admin={accountId:scope.accountId,tokenVersion:1};
 await access.institutionOperation({kind:'SetInstitutionGrant',organizationId:scope.organizationId,accountId:scope.accountId,status:'ACTIVE',expectedVersion:0,key:key(),reason:'Synthetic assessment marks'},operator);
 for(const moduleId of modules)await tenancy.setEntitlement(operator,{kind:'SetOrganizationEntitlement',organizationId:scope.organizationId,actorAccountId:scope.accountId,moduleId,state:'ACTIVE',startsAt:'2026-01-01T00:00:00.000Z',endsAt:null,expectedVersion:0,manifestVersion:1,limits:{},key:key(),reason:'Synthetic assessment marks'});
 const preview=await tenancy.preview(admin,scope.organizationId,scope.schoolId,[...modules]);await tenancy.confirm(admin,scope.organizationId,scope.schoolId,{enabled:[...modules],expectedVersions:preview.expectedVersions,previewHash:preview.previewHash,expectedInstitutionRevision:preview.institutionRevision,expectedBranchRevision:preview.branchRevision,key:key(),reason:'Synthetic assessment marks'});
 await assessments.grantPlanning(operator,{organizationId:scope.organizationId,schoolId:scope.schoolId,accountId:scope.accountId});teacher=await activeStaffFixture(db,scope,['TEACHER']);unassigned=await activeStaffFixture(db,scope,['TEACHER']);
 const yearId=key(),gradeId=key(),sectionId=key(),subjectId=key(),studentPersonId=key(),studentId=key(),enrollmentId=key(),placementId=key(),teacherPersonId=key(),employeeId=key(),teacherId=key(),offeringId=key();assignmentId=key();
 await db.$transaction(async tx=>{
  await tx.academicYear.create({data:{id:yearId,organizationId:scope.organizationId,schoolId:scope.schoolId,code:'AY-MARKS',name:'Marks year',startsOn:new Date('2026-04-01'),endsOn:new Date('2027-04-01'),status:'OPEN',version:1}});
  await tx.gradeLevel.create({data:{id:gradeId,organizationId:scope.organizationId,schoolId:scope.schoolId,code:'G9',name:'Grade 9',sortOrder:9,active:true,version:1}});
  await tx.section.create({data:{id:sectionId,organizationId:scope.organizationId,schoolId:scope.schoolId,yearId,gradeId,code:'A',name:'A',active:true,version:1}});
  await tx.subject.create({data:{id:subjectId,organizationId:scope.organizationId,schoolId:scope.schoolId,code:'MATH',name:'Mathematics',active:true,version:1}});
  await tx.person.create({data:{id:studentPersonId,organizationId:scope.organizationId,firstName:'Anika',lastName:'Example',version:1,createdAt:new Date()}});
  await tx.student.create({data:{id:studentId,organizationId:scope.organizationId,schoolId:scope.schoolId,personId:studentPersonId,admissionNumber:'MARK-001',admittedOn:new Date('2026-04-01'),status:'ACTIVE',version:1,createdAt:new Date()}});
  await tx.enrollment.create({data:{id:enrollmentId,organizationId:scope.organizationId,schoolId:scope.schoolId,studentId,yearId,validFrom:new Date('2026-04-01'),validTo:new Date('2027-04-01'),version:1}});
  await tx.sectionPlacement.create({data:{id:placementId,organizationId:scope.organizationId,schoolId:scope.schoolId,enrollmentId,yearId,sectionId,validFrom:new Date('2026-04-01'),validTo:new Date('2027-04-01')}});
  await tx.person.create({data:{id:teacherPersonId,organizationId:scope.organizationId,firstName:'Tara',lastName:'Teacher',contactEmail:teacher.email,version:1,createdAt:new Date()}});
  await tx.accountPersonBinding.create({data:{id:key(),organizationId:scope.organizationId,accountId:teacher.accountId,personId:teacherPersonId,verifiedAt:new Date(),verifiedBy:scope.accountId}});
  await tx.employee.create({data:{id:employeeId,organizationId:scope.organizationId,schoolId:scope.schoolId,personId:teacherPersonId,staffNumber:'MARK-T-001',category:'TEACHING',employedFrom:new Date('2026-04-01'),status:'ACTIVE',version:1}});
  await tx.teacher.create({data:{id:teacherId,organizationId:scope.organizationId,schoolId:scope.schoolId,employeeId,active:true,version:1}});
  await tx.courseOffering.create({data:{id:offeringId,organizationId:scope.organizationId,schoolId:scope.schoolId,yearId,sectionId,subjectId,code:'G9-A-MATH',active:true,version:1}});
  await tx.teacherAssignment.create({data:{id:assignmentId,organizationId:scope.organizationId,schoolId:scope.schoolId,offeringId,teacherId,validFrom:new Date('2026-04-01'),validTo:new Date('2027-04-01'),version:1}});
 });
 const scale=await assessments.createScale(admin,scope.organizationId,scope.schoolId,{code:'P100',name:'Percentage',minimumScaled:0,maximumScaled:10000,precision:2,rounding:'HALF_UP',key:key()}),cycle=await assessments.createCycle(admin,scope.organizationId,scope.schoolId,{academicYearId:yearId,sectionId,scaleId:scale.scaleId,code:'MARKS-T1',name:'Term 1 marks',sourceCutoff:'2026-10-18T12:00:00.000Z',items:[{subjectId,maximumScaled:10000,weightBasisPoints:10000,required:true}],key:key()});
 await assessments.freezeCohort(admin,scope.organizationId,scope.schoolId,{cycleId:cycle.cycleId,expectedVersion:1,key:key()});cycleId=cycle.cycleId;const workspace=await assessments.markWorkspace(teacher.identity,scope.organizationId,scope.schoolId);planItemId=workspace.assignments[0]!.planItemId;cohortMemberId=workspace.assignments[0]!.pupils[0]!.cohortMemberId;
});
afterAll(async()=>{await assessments.disconnect();await tenancy.disconnect();await access.disconnect();await db.$disconnect();});

describe('F11-C assigned Teacher mark revisions in PostgreSQL',()=>{
 it('enforces assignment scope and creates one immutable exact-replay revision',async()=>{
  expect((await assessments.markWorkspace(unassigned.identity,scope.organizationId,scope.schoolId)).assignments).toEqual([]);
  const input={cycleId,planItemId,cohortMemberId,state:'NUMERIC' as const,scoreScaled:0,expectedOutcomeVersion:0,reviewed:true as const,key:key()};firstKey=input.key;
  const [first,second]=await Promise.all([assessments.saveMark(teacher.identity,scope.organizationId,scope.schoolId,input),assessments.saveMark(teacher.identity,scope.organizationId,scope.schoolId,input)]);
  expect([first.replayed,second.replayed].sort()).toEqual([false,true]);expect(first.state).toBe('NUMERIC');expect(await db.assessmentsOutcome.count({where:{organizationId:scope.organizationId,schoolId:scope.schoolId,cycleId,planItemId,cohortMemberId}})).toBe(1);expect(await db.assessmentsOutcomeRevision.count({where:{organizationId:scope.organizationId,schoolId:scope.schoolId,outcomeId:first.outcomeId}})).toBe(1);
  await expect(assessments.saveMark(teacher.identity,scope.organizationId,scope.schoolId,{...input,state:'ABSENT',scoreScaled:null,expectedOutcomeVersion:1})).rejects.toMatchObject({code:'IDEMPOTENCY_CONFLICT'});
 });
 it('preserves explicit states and serializes concurrent revisions',async()=>{
  const absent=await assessments.saveMark(teacher.identity,scope.organizationId,scope.schoolId,{cycleId,planItemId,cohortMemberId,state:'ABSENT',scoreScaled:null,expectedOutcomeVersion:1,reviewed:true,key:key()});expect(absent).toMatchObject({state:'ABSENT',revision:2,version:2});
  await expect(assessments.saveMark(teacher.identity,scope.organizationId,scope.schoolId,{cycleId,planItemId,cohortMemberId,state:'EXCUSED',scoreScaled:null,expectedOutcomeVersion:1,reviewed:true,key:key()})).rejects.toMatchObject({code:'STALE_VERSION'});
  const outcomes=await Promise.allSettled([5000,6000].map(scoreScaled=>assessments.saveMark(teacher.identity,scope.organizationId,scope.schoolId,{cycleId,planItemId,cohortMemberId,state:'NUMERIC',scoreScaled,expectedOutcomeVersion:2,reviewed:true,key:key()})));
  expect(outcomes.filter(result=>result.status==='fulfilled')).toHaveLength(1);expect(outcomes.filter(result=>result.status==='rejected')).toHaveLength(1);expect((outcomes.find(result=>result.status==='rejected') as PromiseRejectedResult).reason).toMatchObject({code:'STALE_VERSION'});const row=await db.assessmentsOutcome.findFirstOrThrow({where:{organizationId:scope.organizationId,schoolId:scope.schoolId,cycleId,planItemId,cohortMemberId}});expect(row.version).toBe(3);expect(await db.assessmentsOutcomeRevision.count({where:{outcomeId:row.id}})).toBe(3);
 });
 it('reauthorizes protected status before disclosing the original result',async()=>{
  expect(await assessments.markStatus(teacher.identity,scope.organizationId,scope.schoolId,key())).toEqual({state:'UNKNOWN'});expect(await assessments.markStatus(teacher.identity,scope.organizationId,scope.schoolId,firstKey)).toMatchObject({state:'FOUND',result:{replayed:true,state:'NUMERIC'}});
  await db.teacherAssignment.update({where:{id:assignmentId},data:{validTo:new Date('2026-10-18'),version:{increment:1}}});await expect(assessments.markStatus(teacher.identity,scope.organizationId,scope.schoolId,firstKey)).rejects.toMatchObject({code:'FORBIDDEN'});await expect(assessments.saveMark(teacher.identity,scope.organizationId,scope.schoolId,{cycleId,planItemId,cohortMemberId,state:'ABSENT',scoreScaled:null,expectedOutcomeVersion:3,reviewed:true,key:key()})).rejects.toMatchObject({code:'FORBIDDEN'});
 });
});
