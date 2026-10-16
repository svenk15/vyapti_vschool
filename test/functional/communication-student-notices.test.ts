import {afterAll,expect,it} from 'vitest';
import {randomBytes,randomUUID} from 'node:crypto';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {createAccessServices} from '../../backend/composition/access';
import {createCommunicationServices} from '../../backend/composition/communication';
import {createStudentPortalServices} from '../../backend/composition/student-portal';
import {schoolInput} from '../fixtures/access-management';

const url=process.env.TEST_DATABASE_URL??'';
if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated Communication PostgreSQL test DB required');
const modules=['academic_core','communication','family','student_core'] as const;
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]});
const access=createAccessServices({databaseUrl:url});
const communication=createCommunicationServices({databaseUrl:url,releasedModules:modules});
const operator={operatorId:randomUUID(),verified:true as const};
let deliveredToken='';
const students=createStudentPortalServices({databaseUrl:url,releasedModules:modules,emailSender:{sendStudentInvite:async input=>{deliveredToken=input.token;return {ok:true};}}});
afterAll(async()=>{await students.disconnect();await communication.disconnect();await access.disconnect();await db.$disconnect();});

async function fixture(){
 const school=await access.provisionSchool(schoolInput(),operator),admin={accountId:school.accountId,tokenVersion:1},now=new Date(),from=new Date(now),until=new Date(now);
 from.setUTCFullYear(from.getUTCFullYear()-1);until.setUTCFullYear(until.getUTCFullYear()+1);
 await db.$transaction(async tx=>{await tx.organization.update({where:{id:school.organizationId},data:{trustMode:'EMAIL'}});for(const moduleId of modules){await tx.organizationEntitlement.create({data:{id:randomUUID(),organizationId:school.organizationId,moduleId,state:'ACTIVE',startsAt:from,endsAt:null,limits:{},manifestVersion:1,version:1}});await tx.branchActivation.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,moduleId,state:'ACTIVE',version:1,enabledAt:now}});}});
 await students.grantManager(operator,{organizationId:school.organizationId,schoolId:school.schoolId,accountId:school.accountId});
 await communication.grantPublisher(operator,{organizationId:school.organizationId,schoolId:school.schoolId,accountId:school.accountId});
 const suffix=randomUUID().slice(0,6).toUpperCase(),year=await db.academicYear.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,code:`SY${suffix}`,name:'Student notice year',startsOn:from,endsOn:until,status:'OPEN',version:1}}),grade=await db.gradeLevel.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,code:`SG${suffix}`,name:'Grade 7',sortOrder:7,active:true,version:1}}),section=await db.section.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,yearId:year.id,gradeId:grade.id,code:`A${suffix}`,name:'Section A',active:true,version:1}}),otherSection=await db.section.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,yearId:year.id,gradeId:grade.id,code:`B${suffix}`,name:'Section B',active:true,version:1}});
 async function createStudent(label:string,noticeRead:boolean){const person=await db.person.create({data:{id:randomUUID(),organizationId:school.organizationId,firstName:label,lastName:'Learner',version:1,createdAt:now}}),student=await db.student.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,personId:person.id,admissionNumber:`${label}-${suffix}`,admittedOn:from,status:'ACTIVE',version:1,createdAt:now}}),enrollment=await db.enrollment.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,studentId:student.id,yearId:year.id,validFrom:from,validTo:until,version:1}}),placement=await db.sectionPlacement.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,enrollmentId:enrollment.id,yearId:year.id,sectionId:section.id,validFrom:from,validTo:until}}),email=`${label.toLowerCase()}-${randomUUID()}@example.test`,password=randomBytes(24).toString('base64url');deliveredToken='';const issued=await students.authorize(admin,{organizationId:school.organizationId,schoolId:school.schoolId,studentId:student.id,email,confirmed:true,noticeRead,key:randomUUID(),requestId:randomUUID()}),accepted=await students.accept(null,{token:deliveredToken,initialPassword:password,confirmation:password,requestId:randomUUID()});return {student,enrollment,placement,issued,identity:{accountId:accepted.accountId,tokenVersion:1}};}
 return {school,admin,year,section,otherSection,from,until,eligible:await createStudent('Eligible',true),later:await createStudent('Later',false)};
}

it('freezes exact Student recipients, preserves same-branch transfer access, and protects withdrawal',async()=>{
 const setup=await fixture(),key=randomUUID(),request={sectionId:setup.section.id,title:'Student learning evening',body:'Please read the arrangements for the learning evening.',requiresAcknowledgement:true,key},published=await communication.publish(setup.admin,setup.school.organizationId,setup.school.schoolId,request,randomUUID());
 expect(published).toMatchObject({recipientCount:1,replayed:false});
 expect(await communication.listStudent(setup.eligible.identity,setup.eligible.student.id)).toContainEqual(expect.objectContaining({noticeId:published.noticeId,status:'PUBLISHED',readAt:null}));
 const laterAccess=(await students.listForStudent(setup.admin,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,studentId:setup.later.student.id}))[0]!;
 await students.setNoticePurpose(setup.admin,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,accessId:laterAccess.accessId,expectedVersion:laterAccess.version,enabled:true,key:randomUUID(),requestId:randomUUID()});
 expect(await communication.listStudent(setup.later.identity,setup.later.student.id)).toEqual([]);

 const movedAt=new Date();movedAt.setUTCDate(movedAt.getUTCDate()-1);
 await db.$transaction(async tx=>{await tx.sectionPlacement.update({where:{id:setup.eligible.placement.id},data:{validTo:movedAt}});await tx.sectionPlacement.create({data:{id:randomUUID(),organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,enrollmentId:setup.eligible.enrollment.id,yearId:setup.year.id,sectionId:setup.otherSection.id,validFrom:movedAt,validTo:setup.until}});});
 await expect(communication.detailStudent(setup.eligible.identity,setup.eligible.student.id,published.noticeId)).resolves.toMatchObject({body:request.body,status:'PUBLISHED'});
 await communication.markStudentRead(setup.eligible.identity,{studentId:setup.eligible.student.id,noticeId:published.noticeId,versionId:published.versionId});
 const ackKey=randomUUID();await expect(communication.acknowledgeStudent(setup.eligible.identity,{studentId:setup.eligible.student.id,noticeId:published.noticeId,versionId:published.versionId,key:ackKey},randomUUID())).resolves.toMatchObject({replayed:false});await expect(communication.acknowledgeStudent(setup.eligible.identity,{studentId:setup.eligible.student.id,noticeId:published.noticeId,versionId:published.versionId,key:ackKey},randomUUID())).resolves.toMatchObject({replayed:true});
 const withdrawKey=randomUUID(),withdrawn=await communication.withdraw(setup.admin,setup.school.organizationId,setup.school.schoolId,published.noticeId,{expectedRevision:1,reason:'The published arrangements contained superseded details.',key:withdrawKey},randomUUID());expect(withdrawn).toMatchObject({status:'WITHDRAWN',revision:2,replayed:false});await expect(communication.withdraw(setup.admin,setup.school.organizationId,setup.school.schoolId,published.noticeId,{expectedRevision:1,reason:'The published arrangements contained superseded details.',key:withdrawKey},randomUUID())).resolves.toMatchObject({replayed:true});
 await expect(communication.detailStudent(setup.eligible.identity,setup.eligible.student.id,published.noticeId)).resolves.toMatchObject({status:'WITHDRAWN',title:'Notice withdrawn',body:null,requiresAcknowledgement:false});
 await expect(communication.acknowledgeStudent(setup.eligible.identity,{studentId:setup.eligible.student.id,noticeId:published.noticeId,versionId:published.versionId,key:randomUUID()},randomUUID())).rejects.toThrow('CONFLICT');
 const eligibleAccess=(await students.listForStudent(setup.admin,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,studentId:setup.eligible.student.id}))[0]!;await students.setNoticePurpose(setup.admin,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,accessId:eligibleAccess.accessId,expectedVersion:eligibleAccess.version,enabled:false,key:randomUUID(),requestId:randomUUID()});await expect(communication.detailStudent(setup.eligible.identity,setup.eligible.student.id,published.noticeId)).rejects.toThrow('NOT_FOUND');
});

it('rejects stale withdrawal and cross-Student disclosure',async()=>{const setup=await fixture(),published=await communication.publish(setup.admin,setup.school.organizationId,setup.school.schoolId,{sectionId:setup.section.id,title:'Scoped notice',body:'Only frozen eligible recipients may read this.',requiresAcknowledgement:false,key:randomUUID()},randomUUID());await expect(communication.detailStudent(setup.eligible.identity,setup.later.student.id,published.noticeId)).rejects.toThrow('NOT_FOUND');await expect(communication.withdraw(setup.admin,setup.school.organizationId,setup.school.schoolId,published.noticeId,{expectedRevision:2,reason:'This stale request must not change the notice.',key:randomUUID()},randomUUID())).rejects.toThrow('STALE_VERSION');expect((await communication.detailStudent(setup.eligible.identity,setup.eligible.student.id,published.noticeId)).status).toBe('PUBLISHED');});
