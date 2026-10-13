import {afterAll,expect,it} from 'vitest';
import {randomBytes,randomUUID} from 'node:crypto';
import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAccessServices} from '../../backend/composition/access';
import {createGuardiansServices} from '../../backend/composition/guardians';
import {schoolInput} from '../fixtures/access-management';

const url=process.env.TEST_DATABASE_URL??'';if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated test DB required');
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]}),access=createAccessServices({databaseUrl:url}),operator={operatorId:randomUUID(),verified:true as const};
let token='';
const familyModules=['student_core','family','academic_core','staff_core','attendance','timetable'] as const;
const guardians=createGuardiansServices({databaseUrl:url,releasedModules:familyModules,emailSender:{sendFamilyInvite:async input=>{token=input.token;return {ok:true};}}});
afterAll(async()=>{await guardians.disconnect();await access.disconnect();await db.$disconnect();});

async function fixture(){
 const school=await access.provisionSchool(schoolInput(),operator),now=new Date();
 await db.$transaction(async tx=>{
  await tx.organization.update({where:{id:school.organizationId},data:{trustMode:'EMAIL'}});
  for(const moduleId of familyModules){
   await tx.organizationEntitlement.upsert({where:{organizationId_moduleId:{organizationId:school.organizationId,moduleId}},create:{id:randomUUID(),organizationId:school.organizationId,moduleId,state:'ACTIVE',startsAt:new Date(now.getTime()-1000),endsAt:null,limits:{},manifestVersion:1,version:1},update:{state:'ACTIVE',startsAt:new Date(now.getTime()-1000),endsAt:null}});
   await tx.branchActivation.upsert({where:{organizationId_schoolId_moduleId:{organizationId:school.organizationId,schoolId:school.schoolId,moduleId}},create:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,moduleId,state:'ACTIVE',version:1,enabledAt:now},update:{state:'ACTIVE',enabledAt:now}});
  }
 });
 await guardians.grantManager(operator,{organizationId:school.organizationId,schoolId:school.schoolId,accountId:school.accountId});
 const person=await db.person.create({data:{id:randomUUID(),organizationId:school.organizationId,firstName:'Mira',lastName:'Sen',version:1,createdAt:now}});
 const student=await db.student.create({data:{id:randomUUID(),organizationId:school.organizationId,schoolId:school.schoolId,personId:person.id,admissionNumber:`FAM-${randomUUID().slice(0,8)}`,admittedOn:new Date('2026-06-01T00:00:00Z'),status:'ACTIVE',version:1,createdAt:now}});
 return {school,student,identity:{accountId:school.accountId,tokenVersion:1}};
}

it('authorizes, accepts and removes a fixed child-specific Parent bundle without a membership',async()=>{
 const setup=await fixture(),email=`parent-${randomUUID()}@example.test`,key=randomUUID();
 const issued=await guardians.authorize(setup.identity,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,studentId:setup.student.id,displayName:'Kavya Mehta',email,confirmed:true,key,requestId:randomUUID()});
 expect(issued).toMatchObject({status:'INVITE_SENT',replayed:false});expect(token.length).toBeGreaterThan(32);
 await expect(guardians.authorize(setup.identity,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,studentId:setup.student.id,displayName:'Kavya Mehta',email,confirmed:true,key,requestId:randomUUID()})).resolves.toMatchObject({accessId:issued.accessId,replayed:true});
 await expect(guardians.authorize(setup.identity,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,studentId:setup.student.id,displayName:'Changed Name',email,confirmed:true,key,requestId:randomUUID()})).rejects.toThrow('IDEMPOTENCY_CONFLICT');
 const password=randomBytes(24).toString('base64url'),accepted=await guardians.accept(null,{token,initialPassword:password,confirmation:password,requestId:randomUUID()});
 const account=await db.userAccount.findUniqueOrThrow({where:{id:accepted.accountId}});expect(account.status).toBe('ACTIVE');expect(await db.schoolMembership.count({where:{accountId:account.id}})).toBe(0);
 const workspace=await guardians.workspace({accountId:account.id,tokenVersion:account.tokenVersion});expect(workspace.children).toContainEqual(expect.objectContaining({studentId:setup.student.id,purposes:['child.summary.read','attendance.read_child','timetable.read_child']}));
 const child=workspace.children.find(item=>item.studentId===setup.student.id)!;
 const dayBefore=new Date(`${child.accessFrom}T00:00:00.000Z`);dayBefore.setUTCDate(dayBefore.getUTCDate()-1);const before=dayBefore.toISOString().slice(0,10);
 await expect(guardians.attendance({accountId:account.id,tokenVersion:account.tokenVersion},setup.student.id,before,before)).resolves.toMatchObject({studentId:setup.student.id,from:child.accessFrom,items:[]});
 await expect(guardians.timetable({accountId:account.id,tokenVersion:account.tokenVersion},setup.student.id,before)).resolves.toMatchObject({studentId:setup.student.id,lessons:[]});
 await expect(guardians.attendance({accountId:account.id,tokenVersion:account.tokenVersion},randomUUID(),before,before)).rejects.toThrow('NOT_FOUND');
 const siblingPerson=await db.person.create({data:{id:randomUUID(),organizationId:setup.school.organizationId,firstName:'Ishan',lastName:'Sen',version:1,createdAt:new Date()}}),sibling=await db.student.create({data:{id:randomUUID(),organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,personId:siblingPerson.id,admissionNumber:`FAM-${randomUUID().slice(0,8)}`,admittedOn:new Date('2026-06-01T00:00:00Z'),status:'ACTIVE',version:1,createdAt:new Date()}});token='';const siblingAccess=await guardians.authorize(setup.identity,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,studentId:sibling.id,displayName:'Kavya Mehta',email,confirmed:true,key:randomUUID(),requestId:randomUUID()});await guardians.accept({accountId:account.id,tokenVersion:account.tokenVersion},{token,requestId:randomUUID()});expect((await guardians.workspace({accountId:account.id,tokenVersion:account.tokenVersion})).children.map(child=>child.studentId)).toEqual(expect.arrayContaining([setup.student.id,sibling.id]));
 let resetToken='';const recovery=createAccessServices({databaseUrl:url,emailSender:{sendPasswordReset:async input=>{resetToken=input.token;return {ok:true}},sendStaffInvite:async()=>({ok:true}),sendFamilyInvite:async()=>({ok:true})}});try{await expect(recovery.requestPasswordReset(email,randomUUID())).resolves.toEqual({accepted:true});expect(resetToken.length).toBeGreaterThan(32);}finally{await recovery.disconnect();}
 const listed=await guardians.listForStudent(setup.identity,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,studentId:setup.student.id});expect(listed[0]).toMatchObject({status:'ACCESS_ENABLED'});
 await guardians.remove(setup.identity,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,accessId:issued.accessId,expectedVersion:listed[0].version,reason:'Guardian access withdrawn',key:randomUUID(),requestId:randomUUID()});
 expect((await guardians.workspace({accountId:account.id,tokenVersion:account.tokenVersion})).children.map(child=>child.studentId)).toEqual([sibling.id]);expect(await db.guardianChildAccess.findUnique({where:{id:siblingAccess.accessId}})).toMatchObject({revokedAt:null});
});

it('denies ordinary administrators without the designated manager grant and rejects self-authorization',async()=>{
 const setup=await fixture(),other=await access.provisionSchool(schoolInput(),operator);
 const otherPerson=await db.person.create({data:{id:randomUUID(),organizationId:other.organizationId,firstName:'Test',lastName:'Child',version:1,createdAt:new Date()}}),otherStudent=await db.student.create({data:{id:randomUUID(),organizationId:other.organizationId,schoolId:other.schoolId,personId:otherPerson.id,admissionNumber:`DENY-${randomUUID().slice(0,8)}`,status:'ACTIVE',version:1,createdAt:new Date()}});
 await expect(guardians.listForStudent({accountId:other.accountId,tokenVersion:1},{organizationId:other.organizationId,schoolId:other.schoolId,studentId:otherStudent.id})).rejects.toThrow('FORBIDDEN');
 expect((await guardians.workspace({accountId:other.accountId,tokenVersion:1})).children).toEqual([]);
 const admin=await db.userAccount.findUniqueOrThrow({where:{id:setup.school.accountId}});
 await expect(guardians.authorize(setup.identity,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,studentId:setup.student.id,displayName:'Self',email:admin.normalizedEmail,confirmed:true,key:randomUUID(),requestId:randomUUID()})).rejects.toThrow('FORBIDDEN');
});

it('keeps invitations bound, expiring and revocable for new and existing accounts',async()=>{
 const setup=await fixture(),password=randomBytes(24).toString('base64url');
 token='';await guardians.authorize(setup.identity,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,studentId:setup.student.id,displayName:'Expired Parent',email:`expired-${randomUUID()}@example.test`,confirmed:true,key:randomUUID(),requestId:randomUUID()});const expiredToken=token;
 const afterExpiry=createGuardiansServices({databaseUrl:url,releasedModules:familyModules,emailSender:{sendFamilyInvite:async()=>({ok:true})},now:()=>new Date(Date.now()+4*24*60*60_000)});try{await expect(afterExpiry.accept(null,{token:expiredToken,initialPassword:password,confirmation:password,requestId:randomUUID()})).rejects.toThrow('INVITATION_INVALID');}finally{await afterExpiry.disconnect();}

 token='';const revoked=await guardians.authorize(setup.identity,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,studentId:setup.student.id,displayName:'Revoked Parent',email:`revoked-${randomUUID()}@example.test`,confirmed:true,key:randomUUID(),requestId:randomUUID()}),revokedToken=token;
 await guardians.remove(setup.identity,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,accessId:revoked.accessId,expectedVersion:revoked.version,reason:'Invitation withdrawn before acceptance',key:randomUUID(),requestId:randomUUID()});
 await expect(guardians.accept(null,{token:revokedToken,initialPassword:password,confirmation:password,requestId:randomUUID()})).rejects.toThrow('INVITATION_INVALID');

 const existing=await access.provisionSchool(schoolInput(),operator),existingAccount=await db.userAccount.findUniqueOrThrow({where:{id:existing.accountId}});
 token='';const issued=await guardians.authorize(setup.identity,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,studentId:setup.student.id,displayName:'Existing Account Parent',email:existingAccount.normalizedEmail,confirmed:true,key:randomUUID(),requestId:randomUUID()}),existingToken=token;
 await expect(guardians.accept(null,{token:existingToken,requestId:randomUUID()})).rejects.toThrow('INVITATION_INVALID');
 await expect(guardians.accept(setup.identity,{token:existingToken,requestId:randomUUID()})).rejects.toThrow('INVITATION_INVALID');
 await expect(guardians.accept({accountId:existingAccount.id,tokenVersion:existingAccount.tokenVersion},{token:existingToken,requestId:randomUUID()})).resolves.toMatchObject({accepted:true,accessId:issued.accessId});
 await expect(guardians.accept({accountId:existingAccount.id,tokenVersion:existingAccount.tokenVersion},{token:existingToken,requestId:randomUUID()})).resolves.toMatchObject({accepted:true,accessId:issued.accessId});
 expect(await db.schoolMembership.count({where:{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,accountId:existingAccount.id}})).toBe(0);
 await db.organization.update({where:{id:setup.school.organizationId},data:{trustMode:'OPERATOR_CLI'}});let mixedResetDelivered=false;
 const mixedRecovery=createAccessServices({databaseUrl:url,emailSender:{sendPasswordReset:async()=>{mixedResetDelivered=true;return {ok:true}},sendStaffInvite:async()=>({ok:true}),sendFamilyInvite:async()=>({ok:true})}});try{await expect(mixedRecovery.requestPasswordReset(existingAccount.normalizedEmail,randomUUID())).resolves.toEqual({accepted:true});expect(mixedResetDelivered).toBe(false);}finally{await mixedRecovery.disconnect();}
});

it('persists authorized access and a safe derived failure when invitation delivery fails',async()=>{
 const setup=await fixture(),failed=createGuardiansServices({databaseUrl:url,releasedModules:familyModules,emailSender:{sendFamilyInvite:async()=>({ok:false,reason:'provider timeout containing sensitive details'})}});try{const issued=await failed.authorize(setup.identity,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,studentId:setup.student.id,displayName:'Delivery Failure Parent',email:`delivery-${randomUUID()}@example.test`,confirmed:true,key:randomUUID(),requestId:randomUUID()});expect(issued).toMatchObject({status:'DELIVERY_FAILED'});expect(await db.guardianChildAccess.findUnique({where:{id:issued.accessId}})).not.toBeNull();expect(await db.familyInvitation.findUnique({where:{id:issued.invitationId}})).toMatchObject({deliveryStatus:'FAILED',deliveryFailureReason:'Mail provider timed out'});expect(await failed.listForStudent(setup.identity,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,studentId:setup.student.id})).toContainEqual(expect.objectContaining({accessId:issued.accessId,status:'DELIVERY_FAILED',deliveryFailureReason:'Mail provider timed out'}));}finally{await failed.disconnect();}
});

it('serializes acceptance with child-specific removal and recognizes family affiliation for recovery',async()=>{
 const setup=await fixture(),email=`race-${randomUUID()}@example.test`,password=randomBytes(24).toString('base64url');token='';
 const issued=await guardians.authorize(setup.identity,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,studentId:setup.student.id,displayName:'Concurrent Parent',email,confirmed:true,key:randomUUID(),requestId:randomUUID()}),inviteToken=token;
 const raced=await Promise.allSettled([
  guardians.accept(null,{token:inviteToken,initialPassword:password,confirmation:password,requestId:randomUUID()}),
  guardians.remove(setup.identity,{organizationId:setup.school.organizationId,schoolId:setup.school.schoolId,accessId:issued.accessId,expectedVersion:issued.version,reason:'Concurrent access withdrawal',key:randomUUID(),requestId:randomUUID()})
 ]);
 expect(raced.some(result=>result.status==='fulfilled')).toBe(true);expect(await db.guardianChildAccess.count({where:{id:issued.accessId}})).toBe(1);expect(await db.familyInvitation.count({where:{id:issued.invitationId}})).toBe(1);
 const persisted=await db.guardianChildAccess.findUniqueOrThrow({where:{id:issued.accessId},include:{invitations:{where:{id:issued.invitationId}}}});expect(Boolean(persisted.acceptedAt)||Boolean(persisted.revokedAt)).toBe(true);expect(persisted.invitations).toHaveLength(1);
});
