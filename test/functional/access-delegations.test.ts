import {afterAll,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {createAccessServices} from '../../backend/composition/access';
import {createCommunicationServices} from '../../backend/composition/communication';
import {schoolInput,activeStaffFixture} from '../fixtures/access-management';

const url=process.env.TEST_DATABASE_URL??'';
if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated delegation PostgreSQL test DB required');
const modules=['academic_core','communication','family','student_core'] as const;
let clock=new Date('2026-10-18T02:00:00.000Z');
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]}),access=createAccessServices({databaseUrl:url,now:()=>clock}),communication=createCommunicationServices({databaseUrl:url,releasedModules:modules,now:()=>clock}),operator={operatorId:randomUUID(),verified:true as const};
afterAll(async()=>{await communication.disconnect();await access.disconnect();await db.$disconnect();});

it('issues exact temporary acting access and rechecks schedule, revocation, scope and expiry',async()=>{
  const school=await access.provisionSchool(schoolInput(),operator),staff=await activeStaffFixture(db,school,['TEACHER']),personId=randomUUID(),employeeId=randomUUID(),now=new Date(clock),from=new Date('2026-01-01T00:00:00.000Z');
  await db.$transaction(async tx=>{
    await tx.person.create({data:{id:personId,organizationId:school.organizationId,firstName:'Nila',lastName:'Acting',version:1,createdAt:now}});
    await tx.employee.create({data:{id:employeeId,organizationId:school.organizationId,schoolId:school.schoolId,personId,staffNumber:`ACT-${randomUUID().slice(0,8)}`,category:'TEACHING',employedFrom:from,status:'ACTIVE',version:1}});
    await tx.accountPersonBinding.create({data:{id:randomUUID(),organizationId:school.organizationId,accountId:staff.accountId,personId,verifiedAt:now,verifiedBy:school.accountId}});
    for(const moduleId of modules){await tx.organizationEntitlement.create({data:{id:randomUUID(),organizationId:school.organizationId,moduleId,state:'ACTIVE',startsAt:from,endsAt:null,limits:{},manifestVersion:1,version:1}});await tx.branchActivation.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,moduleId,state:'ACTIVE',version:1,enabledAt:now}});}
  });
  const key=randomUUID(),body={organizationId:school.organizationId,schoolId:school.schoolId,employeeId,startsAt:'2026-10-18T03:00:00.000Z',endsAt:'2026-10-20T03:00:00.000Z',actions:['leadership.read','communication.read_leadership'],reason:'Synthetic acting Principal cover',key};
  const scheduled=await access.issueDelegation(operator,body);expect(scheduled).toMatchObject({status:'SCHEDULED',replayed:false,actions:['communication.read_leadership','leadership.read']});
  await expect(access.issueDelegation(operator,body)).resolves.toMatchObject({delegationId:scheduled.delegationId,replayed:true});
  await expect(access.issueDelegation(operator,{...body,reason:'Changed payload'})).rejects.toThrow('IDEMPOTENCY_CONFLICT');
  await expect(access.getLeadershipHome(staff.identity,school.schoolId)).rejects.toThrow('NOT_FOUND');
  clock=new Date('2026-10-18T03:30:00.000Z');
  const home=await access.getLeadershipHome(staff.identity,school.schoolId);expect(home).toMatchObject({actingDelegation:{delegationId:scheduled.delegationId},capabilities:expect.arrayContaining(['leadership.read','communication.read_leadership'])});expect(home.capabilities).not.toContain('attendance.read_leadership');
  expect((await access.getContexts(staff.identity)).institutions[0].branches[0]).toMatchObject({delegatedLeadership:true,roles:['TEACHER']});
  await expect(communication.listLeadership(staff.identity,school.organizationId,school.schoolId)).resolves.toMatchObject({definitionVersion:'notice-coverage.v1',total:0});
  await expect(access.issueDelegation({operatorId:staff.accountId,verified:true},{...body,key:randomUUID()})).rejects.toThrow('FORBIDDEN');
  const revokeKey=randomUUID(),revoked=await access.revokeDelegation(operator,{organizationId:school.organizationId,schoolId:school.schoolId,delegationId:scheduled.delegationId,expectedVersion:1,reason:'Synthetic cover ended early',key:revokeKey});expect(revoked).toMatchObject({status:'REVOKED',version:2,replayed:false});
  await expect(access.revokeDelegation(operator,{organizationId:school.organizationId,schoolId:school.schoolId,delegationId:scheduled.delegationId,expectedVersion:1,reason:'Synthetic cover ended early',key:revokeKey})).resolves.toMatchObject({replayed:true});
  await expect(access.getLeadershipHome(staff.identity,school.schoolId)).rejects.toThrow('NOT_FOUND');
  await expect(communication.listLeadership(staff.identity,school.organizationId,school.schoolId)).rejects.toThrow('FORBIDDEN');
  const replacement=await access.issueDelegation(operator,{...body,key:randomUUID(),reason:'Synthetic replacement acting cover'});expect(replacement.status).toBe('ACTIVE');
  clock=new Date('2026-10-20T03:00:00.000Z');
  await expect(access.getLeadershipHome(staff.identity,school.schoolId)).rejects.toThrow('NOT_FOUND');
  await expect(communication.listLeadership(staff.identity,school.organizationId,school.schoolId)).rejects.toThrow('FORBIDDEN');
  const history=await access.listOwnDelegations(staff.identity);expect(history.map(item=>item.status)).toEqual(expect.arrayContaining(['EXPIRED','REVOKED']));
});
