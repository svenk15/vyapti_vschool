import { it,expect,afterAll } from 'vitest';
import { randomUUID,randomBytes } from 'node:crypto';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { createAccessServices } from '../../backend/composition/access';
import { createActivationUseCases } from '../../backend/modules/access/application/activation';
import { PrismaActivationRepository } from '../../backend/modules/access/infrastructure/activation';
import { OpaqueActivationTokens } from '../../backend/modules/access/infrastructure/activation-tokens';
import { BcryptPasswords } from '../../backend/modules/access/infrastructure/passwords';
import { PrismaAccessSecurityEvidence } from '../../backend/modules/platform/infrastructure/access-security-evidence';
import { schoolInput,activeStaffFixture } from '../fixtures/access-management';
const url=process.env.TEST_DATABASE_URL??'';if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated test DB required');
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]}),service=createAccessServices({databaseUrl:url}),operator={operatorId:randomUUID(),verified:true as const};
afterAll(async()=>{await service.disconnect();await db.$disconnect();});
const password=()=>randomBytes(24).toString('base64url');
async function pending(){const school=await service.provisionSchool(schoolInput(),operator),identity={accountId:school.accountId,tokenVersion:1},email=`activation-${randomUUID()}@vschool.example`,member=await service.command(identity,'CreateMembership',{payload:{email,roles:['TEACHER']}},randomUUID());const account=await db.userAccount.findUniqueOrThrow({where:{normalizedEmail:email}});return {school,identity,email,member,account,input:{accountId:account.id,membershipIds:[member.resourceId],caseReference:'SYNTHETIC-CASE',reason:'Synthetic verified operator fixture'}};}
it('stores only token hashes, binds exact membership intent, and concurrent redemption wins once',async()=>{
 const fixture=await pending(),issued=await service.issueActivation(fixture.input,operator),secret=password();
 const row=await db.accountActivation.findUniqueOrThrow({where:{id:issued.activationId}});expect(row.tokenHash).toHaveLength(64);expect(row.tokenHash).not.toBe(issued.token);expect(row.createdBy).toBe(fixture.account.id);expect(row.operatorId).toBe(operator.operatorId);
 const results=await Promise.allSettled([service.activate(issued.token,secret,secret),service.activate(issued.token,secret,secret)]);expect(results.filter(r=>r.status==='fulfilled')).toHaveLength(1);expect((results.find(r=>r.status==='rejected') as PromiseRejectedResult).reason.code).toBe('INVALID_ACTIVATION');
 const account=await db.userAccount.findUniqueOrThrow({where:{id:fixture.account.id}});expect(account.status).toBe('ACTIVE');expect(account.tokenVersion).toBe(2);expect(account.passwordHash).not.toContain(secret);expect((await db.schoolMembership.findUniqueOrThrow({where:{id:fixture.member.resourceId}})).status).toBe('ACTIVE');expect(await service.authenticate(fixture.email,secret)).toEqual({accountId:account.id,tokenVersion:2});
 const history=JSON.stringify(await db.auditEntry.findMany({where:{resourceId:account.id}}));expect(history).not.toContain(secret);expect(history).not.toContain(issued.token);expect(history).not.toContain(row.tokenHash);
 await expect(service.activate(issued.token,password(),password())).rejects.toThrow('INVALID_ACTIVATION');
});
it('rejects foreign scope, changed intent, disabled subject and token replacement without partial activation',async()=>{
 const a=await pending(),b=await pending();await expect(service.issueActivation({...a.input,membershipIds:[b.member.resourceId]},operator)).rejects.toThrow('NOT_FOUND');await expect(service.issueActivation(a.input,({...operator,verified:false} as unknown as typeof operator))).rejects.toThrow('UNAUTHENTICATED');
 const old=await service.issueActivation(a.input,operator),fresh=await service.issueActivation(a.input,operator),secret=password();await expect(service.activate(old.token,secret,secret)).rejects.toThrow('INVALID_ACTIVATION');
 await service.command(a.identity,'UpdateMembership',{payload:{action:'SET_ROLES',roles:['TEACHER','SCHOOL_ADMIN'],reason:'Synthetic intent changed'},expectedVersion:1},randomUUID(),a.school.schoolId,a.member.resourceId);await expect(service.activate(fresh.token,secret,secret)).rejects.toThrow('INVALID_ACTIVATION');expect((await db.userAccount.findUniqueOrThrow({where:{id:a.account.id}})).passwordHash).toBeNull();
 await db.userAccount.update({where:{id:b.account.id},data:{status:'DISABLED',version:{increment:1}}});await expect(service.issueActivation(b.input,operator,true)).rejects.toThrow('NOT_FOUND');
 await expect(db.accountActivationMembership.create({data:{id:randomUUID(),activationId:fresh.activationId,accountId:a.account.id,organizationId:b.school.organizationId,schoolId:b.school.schoolId,membershipId:b.member.resourceId,expectedVersion:1}})).rejects.toMatchObject({code:'P2003'});
 await expect(db.accountActivationMembership.updateMany({where:{activationId:fresh.activationId},data:{expectedVersion:2}})).rejects.toThrow();
});
it('rolls consumption, credentials, membership and actual evidence back on enlisted writer failure',async()=>{
 const fixture=await pending(),issued=await service.issueActivation(fixture.input,operator);let appended=false;
 const faulty=createActivationUseCases(new PrismaActivationRepository(db,tx=>({append:async e=>{await new PrismaAccessSecurityEvidence(tx).append(e);appended=true;throw new Error('injected');}}),()=>new Date()),new BcryptPasswords(),new OpaqueActivationTokens(),()=>new Date()),secret=password();
 await expect(faulty.activate(issued.token,secret,secret)).rejects.toThrow('UNAVAILABLE');expect(appended).toBe(true);expect((await db.accountActivation.findUniqueOrThrow({where:{id:issued.activationId}})).consumedAt).toBeNull();expect((await db.userAccount.findUniqueOrThrow({where:{id:fixture.account.id}})).passwordHash).toBeNull();expect((await db.schoolMembership.findUniqueOrThrow({where:{id:fixture.member.resourceId}})).status).toBe('PENDING');expect(await db.auditEntry.count({where:{resourceId:fixture.account.id,command:'AccountActivated'}})).toBe(0);
});
it('recovery immediately invalidates old credentials/sessions in every branch and preserves suspended memberships',async()=>{
 const scopes=await Promise.all([service.provisionSchool(schoolInput(),operator),service.provisionSchool(schoolInput(),operator),service.provisionSchool(schoolInput(),operator)]),staff=await activeStaffFixture(db,scopes[0]);
 for(const [index,scope] of scopes.slice(1).entries()){const id=randomUUID();await db.schoolMembership.create({data:{id,organizationId:scope.organizationId,schoolId:scope.schoolId,accountId:staff.accountId,status:index===0?'ACTIVE':'SUSPENDED',version:1,grants:{create:{id:randomUUID(),code:'TEACHER'}}}});}
 const issued=await service.issueActivation({accountId:staff.accountId,membershipIds:[],caseReference:'RECOVERY-CASE',reason:'Synthetic identity verified'},operator,true);for(const scope of scopes)await expect(service.getAccountHome(staff.identity,scope.schoolId)).rejects.toThrow('UNAUTHENTICATED');expect(await service.authenticate(staff.email,staff.password)).toBeNull();
 const secret=password();await service.activate(issued.token,secret,secret);const identity=await service.authenticate(staff.email,secret);expect(identity?.tokenVersion).toBe(3);for(const scope of scopes.slice(0,2))expect((await service.getAccountHome(identity!,scope.schoolId)).scope.schoolId).toBe(scope.schoolId);await expect(service.getAccountHome(identity!,scopes[2].schoolId)).rejects.toThrow('NOT_FOUND');await expect(service.getAccountHome(staff.identity)).rejects.toThrow('UNAUTHENTICATED');expect(await db.auditEntry.count({where:{resourceId:staff.accountId,command:'RecoveryRequested'}})).toBe(3);
});
it('expiry boundary and five-account-attempt budget persist across new tokens, then recover after the window',async()=>{
 const fixture=await pending();let time=new Date();const timed=createAccessServices({databaseUrl:url,now:()=>time});
 try{const issued=await timed.issueActivation(fixture.input,operator),secret=password();time=new Date(issued.expiresAt);for(let i=0;i<6;i++)await expect(timed.activate(issued.token,secret,secret)).rejects.toThrow('INVALID_ACTIVATION');const fresh=await timed.issueActivation(fixture.input,operator);await expect(timed.activate(fresh.token,secret,secret)).rejects.toThrow('INVALID_ACTIVATION');time=new Date(time.getTime()+900001);expect(await timed.activate(fresh.token,secret,secret)).toEqual({activated:true});}finally{await timed.disconnect();}
});
it('rechecks expiry after waiting on the real School guard',async()=>{
 const fixture=await pending();let time=new Date(),release!:()=>void,locked!:()=>void;const name='activation_expiry_'+randomUUID(),connection=new URL(url);connection.searchParams.set('application_name',name);const timed=createAccessServices({databaseUrl:connection.href,now:()=>time});const released=new Promise<void>(r=>{release=r;}),ready=new Promise<void>(r=>{locked=r;});let guard:Promise<unknown>|undefined;
 try{const issued=await timed.issueActivation(fixture.input,operator),secret=password();time=new Date(new Date(issued.expiresAt).getTime()-1);guard=db.$transaction(async tx=>{await tx.$queryRaw`SELECT id FROM vs_access_school WHERE id=${fixture.school.schoolId}::uuid FOR UPDATE`;locked();await released;},{timeout:10000});await ready;
  const outcome=timed.activate(issued.token,secret,secret).then(()=> 'ACTIVATED',error=>error.code);let waiting=false;
  for(let i=0;i<100;i++){const rows=await db.$queryRaw<{waiting:boolean}[]>`SELECT EXISTS(SELECT 1 FROM pg_stat_activity WHERE application_name=${name} AND wait_event_type='Lock' AND query LIKE '%vs_access_school%') AS waiting`;if(rows[0].waiting){waiting=true;break;}await new Promise(r=>setTimeout(r,20));}
  expect(waiting).toBe(true);time=new Date(issued.expiresAt);release();expect(await outcome).toBe('INVALID_ACTIVATION');expect((await db.accountActivation.findUniqueOrThrow({where:{id:issued.activationId}})).consumedAt).toBeNull();expect((await db.userAccount.findUniqueOrThrow({where:{id:fixture.account.id}})).status).toBe('PENDING');
 }finally{release?.();await guard;await timed.disconnect();}
});
it('serialization retries preserve one consumption and stop after three rolled-back attempts',async()=>{
 for(const succeed of [true,false]){const fixture=await pending(),issued=await service.issueActivation(fixture.input,operator),secret=password();let attempts=0;const retrying=createActivationUseCases(new PrismaActivationRepository(db,tx=>({append:async e=>{await new PrismaAccessSecurityEvidence(tx).append(e);attempts++;if(!succeed||attempts<3)throw Object.assign(new Error('injected serialization abort'),{code:'P2034'});}}),()=>new Date()),new BcryptPasswords(),new OpaqueActivationTokens(),()=>new Date());
  if(succeed)expect(await retrying.activate(issued.token,secret,secret)).toEqual({activated:true});else await expect(retrying.activate(issued.token,secret,secret)).rejects.toThrow('UNAVAILABLE');expect(attempts).toBe(3);expect(await db.auditEntry.count({where:{resourceId:fixture.account.id,command:'AccountActivated'}})).toBe(succeed?1:0);expect((await db.accountActivation.findUniqueOrThrow({where:{id:issued.activationId}})).consumedAt!==null).toBe(succeed);
 }
});
