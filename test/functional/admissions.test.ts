import {afterAll,beforeAll,describe,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAccessServices} from '../../backend/composition/access';
import {createTenancyServices} from '../../backend/composition/tenancy';
import {createAdmissionsServices} from '../../backend/composition/admissions';
import {schoolInput} from '../fixtures/access-management';

const url=process.env.TEST_DATABASE_URL??'';
if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated Admissions PostgreSQL test DB required');
const released=['student_core','admissions'] as const;
const access=createAccessServices({databaseUrl:url});
const tenancy=createTenancyServices({databaseUrl:url,releasedModules:released});
const admissions=createAdmissionsServices({databaseUrl:url,releasedModules:released,now:()=>new Date('2026-10-11T06:30:00.000Z')});
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]});
const operator={operatorId:randomUUID(),verified:true as const};
type School=Awaited<ReturnType<typeof access.provisionSchool>>;
let primary:School,identity:{accountId:string;tokenVersion:number},foreignIdentity:{accountId:string;tokenVersion:number},gradeId:string,cycleId:string;

async function provision(){
  const school=await access.provisionSchool(schoolInput(),operator),actor={accountId:school.accountId,tokenVersion:1};
  await access.institutionOperation({kind:'SetInstitutionGrant',organizationId:school.organizationId,accountId:school.accountId,status:'ACTIVE',expectedVersion:0,key:randomUUID(),reason:'Synthetic admissions test authority'},operator);
  for(const moduleId of released)await tenancy.setEntitlement(operator,{kind:'SetOrganizationEntitlement',organizationId:school.organizationId,actorAccountId:school.accountId,moduleId,state:'ACTIVE',startsAt:'2026-01-01T00:00:00.000Z',endsAt:null,expectedVersion:0,manifestVersion:1,limits:{},key:randomUUID(),reason:'Synthetic admissions test entitlement'});
  const preview=await tenancy.preview(actor,school.organizationId,school.schoolId,[...released]);
  await tenancy.confirm(actor,school.organizationId,school.schoolId,{enabled:[...released],expectedVersions:preview.expectedVersions,previewHash:preview.previewHash,expectedInstitutionRevision:preview.institutionRevision,expectedBranchRevision:preview.branchRevision,key:randomUUID(),reason:'Synthetic admissions test activation'});
  return {school,actor};
}

beforeAll(async()=>{
  const a=await provision(),b=await provision();primary=a.school;identity=a.actor;foreignIdentity=b.actor;
  gradeId=randomUUID();cycleId=randomUUID();
  await db.gradeLevel.create({data:{id:gradeId,organizationId:primary.organizationId,schoolId:primary.schoolId,code:`ADM-${randomUUID().slice(0,6).toUpperCase()}`,name:'Grade 6',sortOrder:6,active:true,version:1}});
  await db.admissionCycle.create({data:{id:cycleId,organizationId:primary.organizationId,schoolId:primary.schoolId,code:`C-${randomUUID().slice(0,6).toUpperCase()}`,name:'2027 intake',opensOn:new Date('2026-10-01T00:00:00.000Z'),closesOn:new Date('2026-10-31T00:00:00.000Z'),state:'OPEN',version:1}});
});
afterAll(async()=>{await admissions.disconnect();await tenancy.disconnect();await access.disconnect();await db.$disconnect();});
const input=(key=randomUUID())=>({applicantName:'Nila Example',contactEmail:'nila@example.test',gradeId,cycleId,noticeProvided:true as const,key});

describe('SA-38 PostgreSQL inquiry and application start',()=>{
  it('creates purpose-bound intake records atomically and replays only the exact command',async()=>{
    const peopleBefore=await db.person.count({where:{organizationId:primary.organizationId}}),studentsBefore=await db.student.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId}}),key=randomUUID(),command=input(key);
    expect(await admissions.context(identity,primary.organizationId,primary.schoolId)).toMatchObject({cycles:[expect.objectContaining({id:cycleId})],grades:[expect.objectContaining({id:gradeId})]});
    const created=await admissions.start(identity,primary.organizationId,primary.schoolId,command);
    expect(created).toMatchObject({state:'STARTED',version:1,nextAction:'Checklist review',replayed:false,reference:expect.stringMatching(/^APP-/)});
    expect(await admissions.start(identity,primary.organizationId,primary.schoolId,command)).toMatchObject({applicationId:created.applicationId,replayed:true});
    await expect(admissions.start(identity,primary.organizationId,primary.schoolId,{...command,applicantName:'Different Applicant'})).rejects.toMatchObject({code:'IDEMPOTENCY_CONFLICT'});
    expect(await db.person.count({where:{organizationId:primary.organizationId}})).toBe(peopleBefore);
    expect(await db.student.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId}})).toBe(studentsBefore);
    expect(await db.admissionApplicant.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId}})).toBe(1);
    expect(await db.auditEntry.findFirst({where:{organizationId:primary.organizationId,schoolId:primary.schoolId,resourceId:created.applicationId}})).toMatchObject({module:'admissions',command:'AdmissionApplicationStarted'});
    const receipt=await db.commandReceipt.findFirstOrThrow({where:{organizationId:primary.organizationId,schoolId:primary.schoolId,command:'StartAdmissionApplication',key},select:{response:true}});
    expect(JSON.stringify(receipt.response)).not.toMatch(/Nila|nila@example/);
  });

  it('rejects duplicate candidates without leaving an orphan Applicant',async()=>{
    const before=await db.admissionApplicant.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId}});
    await expect(admissions.start(identity,primary.organizationId,primary.schoolId,input())).rejects.toMatchObject({code:'CONFLICT'});
    expect(await db.admissionApplicant.count({where:{organizationId:primary.organizationId,schoolId:primary.schoolId}})).toBe(before);
  });

  it('enforces current scope, release, module and open-cycle constraints',async()=>{
    await expect(admissions.context(foreignIdentity,primary.organizationId,primary.schoolId)).rejects.toMatchObject({code:'FORBIDDEN'});
    await expect(admissions.start(identity,primary.organizationId,primary.schoolId,{...input(),gradeId:randomUUID()})).rejects.toMatchObject({code:'CONFLICT'});
    const noRelease=createAdmissionsServices({databaseUrl:url,releasedModules:[],now:()=>new Date('2026-10-11T06:30:00.000Z')});
    try{await expect(noRelease.context(identity,primary.organizationId,primary.schoolId)).rejects.toMatchObject({code:'RELEASE_UNAVAILABLE'});}finally{await noRelease.disconnect();}
    const activation=await db.branchActivation.findUniqueOrThrow({where:{organizationId_schoolId_moduleId:{organizationId:primary.organizationId,schoolId:primary.schoolId,moduleId:'admissions'}}});
    await db.branchActivation.update({where:{id:activation.id},data:{state:'DISABLED',enabledAt:null,version:{increment:1}}});
    await expect(admissions.context(identity,primary.organizationId,primary.schoolId)).rejects.toMatchObject({code:'MODULE_DISABLED'});
    await db.branchActivation.update({where:{id:activation.id},data:{state:'ACTIVE',enabledAt:new Date(),version:{increment:1}}});
  });
});
