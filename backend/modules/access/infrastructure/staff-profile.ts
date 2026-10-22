import type {PrismaClient} from '../../../../generated/prisma/client';
import type {Identity} from '../../../../shared/contracts/access';
import type {StaffProfileAccess} from '../../../../shared/contracts/people';
import type {VerifiedDatabaseContextPort} from '../../tenancy/contracts/index';
import type {StaffAccessProfilePort} from '../contracts/staff-profile';
import {AccessError,capabilitiesFor} from '../contracts/index';

export class PrismaStaffAccessProfile implements StaffAccessProfilePort{
 constructor(private readonly db:PrismaClient,private readonly databaseContext:VerifiedDatabaseContextPort,private readonly now:()=>Date=()=>new Date()){}
 async read(actor:Identity,input:{organizationId:string;schoolId:string;personId:string}):Promise<StaffProfileAccess>{try{return await this.db.$transaction(async tx=>{
  await this.databaseContext.establish(tx,{accountId:actor.accountId,tokenVersion:actor.tokenVersion,organizationId:input.organizationId,branchId:input.schoolId});
  const [account,organization,school,membership]=await Promise.all([
   tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}}),
   tx.organization.findFirst({where:{id:input.organizationId,status:'ACTIVE'},select:{id:true}}),
   tx.school.findFirst({where:{organizationId:input.organizationId,id:input.schoolId,status:'ACTIVE'},select:{id:true}}),
   tx.schoolMembership.findFirst({where:{organizationId:input.organizationId,schoolId:input.schoolId,accountId:actor.accountId,status:'ACTIVE'},select:{grants:{select:{code:true}}}}),
  ]);
  if(!account||account.status!=='ACTIVE'||account.tokenVersion!==actor.tokenVersion)throw new AccessError('UNAUTHENTICATED');
  if(!organization||!school)throw new AccessError('NOT_FOUND');
  if(!membership||!capabilitiesFor(membership.grants.map(grant=>grant.code as 'SCHOOL_ADMIN'|'TEACHER')).includes('user.manage'))throw new AccessError('FORBIDDEN');
  const binding=await tx.accountPersonBinding.findFirst({where:{organizationId:input.organizationId,personId:input.personId},select:{account:{select:{id:true,status:true,memberships:{where:{organizationId:input.organizationId,schoolId:input.schoolId},take:1,select:{id:true,status:true,version:true,grants:{select:{code:true}}}},accessInvites:{where:{organizationId:input.organizationId,schoolId:input.schoolId},orderBy:[{createdAt:'desc'},{id:'desc'}],take:1,select:{id:true,deliveryStatus:true,expiresAt:true,acceptedAt:true,revokedAt:true}}}}}});
  if(!binding)return {state:'NO_ACCOUNT',membershipId:null,membershipVersion:null,roles:[],invitation:null};
  const member=binding.account.memberships[0]??null,invite=binding.account.accessInvites[0]??null,roles=(member?.grants.map(grant=>grant.code).filter((code):code is 'SCHOOL_ADMIN'|'TEACHER'|'PRINCIPAL'=>code==='SCHOOL_ADMIN'||code==='TEACHER'||code==='PRINCIPAL')??[]).sort(),invitation=invite?{id:invite.id,state:(invite.revokedAt?'REVOKED':invite.acceptedAt?'CONSUMED':invite.expiresAt<=this.now()?'EXPIRED':invite.deliveryStatus==='FAILED'?'FAILED':invite.deliveryStatus==='SENT'?'SENT':'PENDING_DELIVERY') as 'PENDING_DELIVERY'|'SENT'|'FAILED'|'EXPIRED'|'CONSUMED'|'REVOKED',expiresAt:invite.expiresAt.toISOString()}:null;
  const state:StaffProfileAccess['state']=member?.status==='ACTIVE'&&binding.account.status==='ACTIVE'?'ACTIVE':member?.status==='SUSPENDED'?'SUSPENDED':member?.status==='REVOKED'?'REVOKED':member?.status==='PENDING'?'PENDING':'LINKED';
  return {state,membershipId:member?.id??null,membershipVersion:member?.version??null,roles,invitation};
 },{isolationLevel:'RepeatableRead',timeout:10000,maxWait:10000});}catch(error){if(error instanceof AccessError)throw error;throw new AccessError('UNAVAILABLE');}}
}
