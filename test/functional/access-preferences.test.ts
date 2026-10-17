import {afterAll,expect,it} from 'vitest';
import {randomUUID} from 'node:crypto';
import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAccessServices} from '../../backend/composition/access';
import {schoolInput} from '../fixtures/access-management';

const url=process.env.TEST_DATABASE_URL??'';if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated test DB required');
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]}),service=createAccessServices({databaseUrl:url}),operator={operatorId:randomUUID(),verified:true as const};
afterAll(async()=>{await service.disconnect();await db.$disconnect();});
async function setup(){const input=schoolInput(),ids=await service.provisionSchool(input,operator),identity={accountId:ids.accountId,tokenVersion:1};return {input,ids,identity};}

it('persists only the authenticated account preferences with exact replay, stale checks and immutable evidence',async()=>{
 const first=await setup(),second=await setup(),key=randomUUID(),initial=await service.getOwnPreferences(first.identity);expect(initial).toEqual({density:'COMFORTABLE',reducedMotion:'SYSTEM',versions:{density:0,reducedMotion:0},updatedAt:null});
 const body={density:'COMPACT' as const,reducedMotion:'REDUCE' as const,expectedVersions:initial.versions},saved=await service.updateOwnPreferences(first.identity,body,key);expect(saved).toMatchObject({density:'COMPACT',reducedMotion:'REDUCE',versions:{density:1,reducedMotion:1},replayed:false});
 expect(await service.updateOwnPreferences(first.identity,body,key)).toMatchObject({...saved,replayed:true});
 await expect(service.updateOwnPreferences(first.identity,{...body,density:'COMFORTABLE'},key)).rejects.toThrow('IDEMPOTENCY_CONFLICT');
 await expect(service.updateOwnPreferences(first.identity,body,randomUUID())).rejects.toThrow('STALE_VERSION');
 expect(await service.getOwnPreferences(second.identity)).toEqual({density:'COMFORTABLE',reducedMotion:'SYSTEM',versions:{density:0,reducedMotion:0},updatedAt:null});
 expect(await db.accountPreference.findMany({where:{accountId:first.ids.accountId}})).toHaveLength(2);expect(await db.accountPreference.count({where:{accountId:second.ids.accountId}})).toBe(0);
 expect(await db.accountPreferenceReceipt.count({where:{accountId:first.ids.accountId}})).toBe(1);expect(await db.authSecurityEvent.count({where:{accountId:first.ids.accountId,kind:'PREFERENCES_UPDATED'}})).toBe(1);
 const evidence=await db.authSecurityEvent.findFirstOrThrow({where:{accountId:first.ids.accountId,kind:'PREFERENCES_UPDATED'},select:{policySnapshot:true}});expect(JSON.stringify(evidence)).not.toContain(first.input.adminEmail);
 const raced=await Promise.allSettled([service.updateOwnPreferences(first.identity,{density:'COMFORTABLE',reducedMotion:'SYSTEM',expectedVersions:saved.versions},randomUUID()),service.updateOwnPreferences(first.identity,{density:'COMFORTABLE',reducedMotion:'SYSTEM',expectedVersions:saved.versions},randomUUID())]);expect(raced.filter(value=>value.status==='fulfilled')).toHaveLength(1);expect((raced.find(value=>value.status==='rejected') as PromiseRejectedResult).reason.code).toBe('STALE_VERSION');
});

it('publishes trusted support through the School administrator guard and denies foreign or revoked readers',async()=>{
 const current=await setup(),foreign=await setup();await service.institutionOperation({kind:'SetBranchMembership',organizationId:current.ids.organizationId,schoolId:current.ids.schoolId,accountId:current.ids.accountId,status:'ACTIVE',roles:['SCHOOL_ADMIN','PRINCIPAL'],expectedVersion:1,key:randomUUID(),reason:'Authorize synthetic Principal support read'},operator);
 expect(await service.getSchoolSupport(current.identity,current.ids.organizationId,current.ids.schoolId)).toBeNull();
 const key=randomUUID(),payload={label:'Riverbank school office',email:'support@riverbank.example',phone:'',hours:'Weekdays 08:00–16:00',reason:'Publish approved synthetic support route'},published=await service.command(current.identity,'PublishSchoolSupport',{payload,expectedVersion:1},key,current.ids.schoolId);expect(published).toMatchObject({version:2,replayed:false});expect((await service.command(current.identity,'PublishSchoolSupport',{payload,expectedVersion:1},key,current.ids.schoolId)).replayed).toBe(true);
 expect(await service.getSchoolSupport(current.identity,current.ids.organizationId,current.ids.schoolId)).toMatchObject({label:payload.label,email:payload.email,phone:null,hours:payload.hours,timezone:current.input.timezone});
 await expect(service.getSchoolSupport(current.identity,foreign.ids.organizationId,foreign.ids.schoolId)).rejects.toThrow('NOT_FOUND');
 const audit=await db.auditEntry.findFirstOrThrow({where:{schoolId:current.ids.schoolId,command:'PublishSchoolSupport'},select:{before:true,after:true,reason:true}});expect(audit.reason).toBe(payload.reason);expect(JSON.stringify(audit)).not.toContain(payload.email);expect(JSON.stringify(audit)).not.toContain(payload.hours);
 await expect(db.school.update({where:{id:foreign.ids.schoolId},data:{supportLabel:'Incomplete'}})).rejects.toMatchObject({code:expect.any(String)});
 await db.schoolMembership.update({where:{id:current.ids.membershipId},data:{status:'SUSPENDED',version:{increment:1}}});await expect(service.getSchoolSupport(current.identity,current.ids.organizationId,current.ids.schoolId)).rejects.toThrow('NOT_FOUND');await expect(service.command(current.identity,'PublishSchoolSupport',{payload,expectedVersion:2},randomUUID(),current.ids.schoolId)).rejects.toThrow('NOT_FOUND');
});
