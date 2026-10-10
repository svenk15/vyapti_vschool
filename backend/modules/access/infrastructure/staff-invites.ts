import {createHash,randomUUID} from "node:crypto";
import type {Prisma,PrismaClient} from "../../../../generated/prisma/client";
import type {InviteRole,StaffInviteRepository} from "../application/password-reset";
import {AccessError} from "../domain/policy";
import type {VerifiedDatabaseContextPort} from '../../tenancy/contracts/verified-database-context';
import type {EmployeeAccessVerificationPort} from '../../people/contracts/employee-access';
import type {CommandEvidenceWriter} from '../../platform/contracts/command-evidence';
import type {ManagementResult} from '../../../../shared/contracts/access-management';

const safeFailure=(value:string|undefined)=>!value?null:value.toLowerCase().includes("reject")?"Mail provider rejected the message":"Mail provider unavailable";
const canonical=(value:unknown):string=>Array.isArray(value)?`[${value.map(canonical).join(',')}]`:value&&typeof value==='object'?`{${Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`:JSON.stringify(value);
const schoolDate=(instant:Date,timeZone:string)=>{const parts=new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(instant),part=(type:string)=>parts.find(item=>item.type===type)?.value??'';return `${part('year')}-${part('month')}-${part('day')}`;};
const ADVISORY_KEY_1=1448302674,ADVISORY_KEY_2=1;
export class PrismaStaffInviteRepository implements StaffInviteRepository{
 constructor(private readonly db:PrismaClient,private readonly databaseContext:VerifiedDatabaseContextPort,private readonly employeeAccess:EmployeeAccessVerificationPort,private readonly writer:(tx:Prisma.TransactionClient)=>CommandEvidenceWriter,private readonly now:()=>Date=()=>new Date()){}
 private async lock(tx:Prisma.TransactionClient){await tx.$executeRaw`SELECT pg_advisory_xact_lock(${ADVISORY_KEY_1},${ADVISORY_KEY_2})`;}
 private fail(error:unknown):never{if(error instanceof AccessError)throw error;const code=(error as {code?:string})?.code;if(code==="P2002")throw new AccessError("CONFLICT");throw new AccessError("UNAVAILABLE");}
 async issue(input:{email:string;organizationId:string;schoolId:string;inviterAccountId:string;inviterTokenVersion:number;roles:readonly InviteRole[];tokenHash:string;expiresAt:Date;requestId:string}){
  try{return await this.db.$transaction(async tx=>{
   await this.lock(tx);
   await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${input.inviterAccountId}::uuid FOR UPDATE`;
   await tx.$queryRaw`SELECT id FROM vs_access_organization WHERE id=${input.organizationId}::uuid FOR SHARE`;
   await tx.$queryRaw`SELECT id FROM vs_access_school WHERE organization_id=${input.organizationId}::uuid AND id=${input.schoolId}::uuid FOR UPDATE`;
   if(!await this.databaseContext.establish(tx,{accountId:input.inviterAccountId,tokenVersion:input.inviterTokenVersion,organizationId:input.organizationId,branchId:input.schoolId}))return null;
   const inviter=await tx.userAccount.findFirst({where:{id:input.inviterAccountId,status:"ACTIVE",tokenVersion:input.inviterTokenVersion,memberships:{some:{organizationId:input.organizationId,schoolId:input.schoolId,status:"ACTIVE",school:{status:"ACTIVE",organization:{status:"ACTIVE",trustMode:{in:["HYBRID","EMAIL"]}}},grants:{some:{code:"SCHOOL_ADMIN"}}}}}});
   const org=await tx.organization.findFirst({where:{id:input.organizationId,status:"ACTIVE",trustMode:{in:["HYBRID","EMAIL"]}}}),school=await tx.school.findFirst({where:{organizationId:input.organizationId,id:input.schoolId,status:"ACTIVE"}});
   if(!inviter||!org||!school)return null;
   const recent=await tx.accessInvite.count({where:{organizationId:org.id,schoolId:school.id,inviterAccountId:inviter.id,createdAt:{gte:new Date(this.now().getTime()-60*60_000)}}});if(recent>=20)return null;
   let account=await tx.userAccount.findUnique({where:{normalizedEmail:input.email}});
   if(account?.status==="DISABLED")return null;
   if(!account)account=await tx.userAccount.create({data:{id:randomUUID(),normalizedEmail:input.email,passwordHash:null,status:"PENDING",tokenVersion:1,failedAttempts:0,version:1,createdAt:this.now()}});
   let membership=await tx.schoolMembership.findUnique({where:{organizationId_schoolId_accountId:{organizationId:org.id,schoolId:school.id,accountId:account.id}},include:{grants:true}});
   if(membership&&membership.status!=="PENDING")return null;
   const now=this.now();let newlyCreated=false;
   if(!membership){membership=await tx.schoolMembership.create({data:{id:randomUUID(),organizationId:org.id,schoolId:school.id,accountId:account.id,status:"PENDING",version:1},include:{grants:true}});newlyCreated=true;}
   const roles=[...input.roles].sort();
   const previousRoles=membership.grants.map(g=>g.code).sort();
   if(previousRoles.join(",")!==roles.join(",")){
    if(!newlyCreated)membership=await tx.schoolMembership.update({where:{id:membership.id},data:{version:{increment:1}},include:{grants:true}});
    await tx.roleGrant.deleteMany({where:{organizationId:org.id,schoolId:school.id,membershipId:membership.id}});
    await tx.roleGrant.createMany({data:roles.map(code=>({id:randomUUID(),organizationId:org.id,schoolId:school.id,membershipId:membership!.id,code}))});
   }
   await tx.accessInvite.updateMany({where:{organizationId:org.id,schoolId:school.id,accountId:account.id,acceptedAt:null,revokedAt:null},data:{revokedAt:now}});
   const invite=await tx.accessInvite.create({data:{id:randomUUID(),accountId:account.id,organizationId:org.id,schoolId:school.id,inviterAccountId:inviter.id,tokenHash:input.tokenHash,proposedRoles:roles,membershipVersion:membership.version,organizationConfigurationVersion:org.configurationVersion,schoolConfigurationVersion:school.configurationVersion,deliveryStatus:"PENDING_DELIVERY",createdAt:now,expiresAt:input.expiresAt}});
   await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId:account.id,actorAccountId:inviter.id,kind:"STAFF_INVITE_ISSUED",decision:"ALLOW",safeReason:"INVITER_AUTHORIZED",policySnapshot:{organizationId:org.id,schoolId:school.id,trustMode:org.trustMode,organizationConfigurationVersion:org.configurationVersion,schoolConfigurationVersion:school.configurationVersion,roles},requestId:input.requestId,occurredAt:now}});
   return {id:invite.id,recipient:account.normalizedEmail,organizationId:org.id,schoolId:school.id};
  },{timeout:12000,maxWait:10000});}catch(error){return this.fail(error);}
 }
 async issueForEmployee(input:{employeeId:string;email:string;verificationReference:string;organizationId:string;schoolId:string;inviterAccountId:string;inviterTokenVersion:number;roles:readonly InviteRole[];tokenHash:string;expiresAt:Date;requestId:string;key:string}){
  try{return await this.db.$transaction(async tx=>{
   await this.lock(tx);
   await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${input.inviterAccountId}::uuid FOR UPDATE`;
   await tx.$queryRaw`SELECT id FROM vs_access_organization WHERE id=${input.organizationId}::uuid FOR SHARE`;
   await tx.$queryRaw`SELECT id FROM vs_access_school WHERE organization_id=${input.organizationId}::uuid AND id=${input.schoolId}::uuid FOR UPDATE`;
   if(!await this.databaseContext.establish(tx,{accountId:input.inviterAccountId,tokenVersion:input.inviterTokenVersion,organizationId:input.organizationId,branchId:input.schoolId}))return null;
   const now=this.now(),inviter=await tx.userAccount.findFirst({where:{id:input.inviterAccountId,status:'ACTIVE',tokenVersion:input.inviterTokenVersion,memberships:{some:{organizationId:input.organizationId,schoolId:input.schoolId,status:'ACTIVE',school:{status:'ACTIVE',organization:{status:'ACTIVE'}},grants:{some:{code:'SCHOOL_ADMIN'}}}}}}),org=await tx.organization.findFirst({where:{id:input.organizationId,status:'ACTIVE'}}),school=await tx.school.findFirst({where:{organizationId:input.organizationId,id:input.schoolId,status:'ACTIVE'}});
   if(!inviter||!org||!school)return null;
   const employee=await this.employeeAccess.findActiveEmployee(tx,{organizationId:org.id,schoolId:school.id,employeeId:input.employeeId,schoolDate:schoolDate(now,school.timezone)});
   if(!employee)throw new AccessError('NOT_FOUND');
   const roles=[...input.roles].sort(),hash=createHash('sha256').update(canonical({schemaVersion:1,organizationId:org.id,schoolId:school.id,employeeId:employee.employeeId,email:input.email,verificationReference:input.verificationReference,roles})).digest('hex'),command='GrantEmployeeAccess';
   const receipt=await tx.commandReceipt.findUnique({where:{organizationId_schoolId_actorAccountId_command_key:{organizationId:org.id,schoolId:school.id,actorAccountId:inviter.id,command,key:input.key}}});
   if(receipt){if(receipt.inputHash!==hash)throw new AccessError('IDEMPOTENCY_CONFLICT');const saved=receipt.response as ManagementResult;if(!saved.invitationId)return {id:saved.resourceId,recipient:input.email,organizationId:org.id,schoolId:school.id,replayed:true,activationPath:'OPERATOR_ACTIVATION' as const,deliveryStatus:'NOT_APPLICABLE' as const};const invite=await tx.accessInvite.findUnique({where:{id:saved.invitationId}});if(!invite)throw new AccessError('CONFLICT');return {id:invite.id,recipient:input.email,organizationId:org.id,schoolId:school.id,replayed:true,activationPath:'EMAIL_INVITATION' as const,deliveryStatus:invite.deliveryStatus as 'PENDING_DELIVERY'|'SENT'|'FAILED',...(invite.deliveryFailedAt?{deliveryFailedAt:invite.deliveryFailedAt.toISOString()}:{}),...(invite.deliveryFailureReason?{deliveryFailureReason:invite.deliveryFailureReason}:{})};}
   const recent=await tx.accessInvite.count({where:{organizationId:org.id,schoolId:school.id,inviterAccountId:inviter.id,createdAt:{gte:new Date(now.getTime()-60*60_000)}}});if(recent>=20)return null;
   let account=await tx.userAccount.findUnique({where:{normalizedEmail:input.email}});if(account?.status==='DISABLED')throw new AccessError('CONFLICT');
   if(!account)account=await tx.userAccount.create({data:{id:randomUUID(),normalizedEmail:input.email,passwordHash:null,status:'PENDING',tokenVersion:1,failedAttempts:0,version:1,createdAt:now}});
   const existingBinding=await tx.accountPersonBinding.findFirst({where:{organizationId:org.id,OR:[{accountId:account.id},{personId:employee.personId}]}});
   if(existingBinding&&(existingBinding.accountId!==account.id||existingBinding.personId!==employee.personId))throw new AccessError('CONFLICT');
   if(!existingBinding){await tx.accountPersonBinding.create({data:{id:randomUUID(),organizationId:org.id,accountId:account.id,personId:employee.personId,verifiedAt:now,verifiedBy:inviter.id}});await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId:account.id,actorAccountId:inviter.id,kind:'PERSON_BINDING_VERIFIED',decision:'ALLOW',safeReason:'IDENTITY_CHECK_RECORDED',policySnapshot:{schemaVersion:1,organizationId:org.id,schoolId:school.id,employeeId:employee.employeeId,personId:employee.personId,verificationReference:input.verificationReference},requestId:input.requestId,occurredAt:now}});}
   const duplicate=await tx.schoolMembership.findUnique({where:{organizationId_schoolId_accountId:{organizationId:org.id,schoolId:school.id,accountId:account.id}}});if(duplicate)throw new AccessError('CONFLICT');
   const membership=await tx.schoolMembership.create({data:{id:randomUUID(),organizationId:org.id,schoolId:school.id,accountId:account.id,status:'PENDING',version:1}});
   await tx.roleGrant.createMany({data:roles.map(code=>({id:randomUUID(),organizationId:org.id,schoolId:school.id,membershipId:membership.id,code}))});
   const invite=org.trustMode==='OPERATOR_CLI'?null:await tx.accessInvite.create({data:{id:randomUUID(),accountId:account.id,organizationId:org.id,schoolId:school.id,inviterAccountId:inviter.id,tokenHash:input.tokenHash,proposedRoles:roles,membershipVersion:membership.version,organizationConfigurationVersion:org.configurationVersion,schoolConfigurationVersion:school.configurationVersion,deliveryStatus:'PENDING_DELIVERY',createdAt:now,expiresAt:input.expiresAt}});
   const result:ManagementResult={resourceId:membership.id,version:membership.version,status:membership.status,roles,...(invite?{invitationId:invite.id}:{}),employeeId:employee.employeeId};
   await this.writer(tx).append({organizationId:org.id,schoolId:school.id,actorAccountId:inviter.id,command,key:input.key,inputHash:hash,response:result,before:{},after:{employeeId:employee.employeeId,status:membership.status,roles},requestId:input.requestId,occurredAt:now.toISOString(),resourceType:'SchoolMembership'});
   await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId:account.id,actorAccountId:inviter.id,kind:invite?'STAFF_INVITE_ISSUED':'STAFF_ACCESS_PENDING_OPERATOR',decision:'ALLOW',safeReason:'VERIFIED_EMPLOYEE_GRANTED',policySnapshot:{organizationId:org.id,schoolId:school.id,employeeId:employee.employeeId,trustMode:org.trustMode,roles},requestId:input.requestId,occurredAt:now}});
   return invite?{id:invite.id,recipient:account.normalizedEmail,organizationId:org.id,schoolId:school.id,replayed:false,activationPath:'EMAIL_INVITATION' as const,deliveryStatus:'PENDING_DELIVERY' as const}:{id:membership.id,recipient:account.normalizedEmail,organizationId:org.id,schoolId:school.id,replayed:false,activationPath:'OPERATOR_ACTIVATION' as const,deliveryStatus:'NOT_APPLICABLE' as const};
  },{timeout:12000,maxWait:10000});}catch(error){return this.fail(error);}
 }
 async finishDelivery(input:{id:string;status:"SENT"|"FAILED";failureReason?:string;requestId:string}){
  try{return await this.db.$transaction(async tx=>{
   await this.lock(tx);const invite=await this.databaseContext.findStaffInviteById(tx,input.id);if(!invite)return;
   const now=this.now(),result=await tx.accessInvite.updateMany({where:{id:input.id,deliveryStatus:"PENDING_DELIVERY",acceptedAt:null,revokedAt:null},data:{deliveryStatus:input.status,...(input.status==="FAILED"?{deliveryFailedAt:now,deliveryFailureReason:safeFailure(input.failureReason)}:{})}});
   if(result.count)await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId:invite.accountId,actorAccountId:invite.inviterAccountId,kind:input.status==="SENT"?"STAFF_INVITE_SENT":"STAFF_INVITE_DELIVERY_FAILED",decision:input.status==="SENT"?"ALLOW":"DENY",safeReason:input.status==="SENT"?"DELIVERY_ACCEPTED":"DELIVERY_FAILED",requestId:input.requestId,occurredAt:now}});
  },{timeout:10000,maxWait:10000});}catch(error){return this.fail(error);}
 }
 async accept(input:{tokenHash:string;initialPasswordHash?:string;requestId:string}){
  try{return await this.db.$transaction(async tx=>{
   await this.lock(tx);
   const candidate=await this.databaseContext.findStaffInviteByToken(tx,input.tokenHash);if(!candidate)return false;
   const accountIds=[...new Set([candidate.accountId,candidate.inviterAccountId])].sort();for(const id of accountIds)await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${id}::uuid FOR UPDATE`;
   await tx.$queryRaw`SELECT id FROM vs_access_organization WHERE id=${candidate.organizationId}::uuid FOR SHARE`;
   await tx.$queryRaw`SELECT id FROM vs_access_school WHERE organization_id=${candidate.organizationId}::uuid AND id=${candidate.schoolId}::uuid FOR UPDATE`;
   const now=this.now(),invite=await tx.accessInvite.findUnique({where:{id:candidate.inviteId}}),account=await tx.userAccount.findUnique({where:{id:candidate.accountId}}),org=await tx.organization.findUnique({where:{id:candidate.organizationId}}),school=await tx.school.findUnique({where:{id:candidate.schoolId}}),inviter=await tx.userAccount.findFirst({where:{id:candidate.inviterAccountId,status:"ACTIVE",memberships:{some:{organizationId:candidate.organizationId,schoolId:candidate.schoolId,status:"ACTIVE",school:{status:"ACTIVE",organization:{status:"ACTIVE",trustMode:{in:["HYBRID","EMAIL"]}}},grants:{some:{code:"SCHOOL_ADMIN"}}}}}});
   const membership=account?await tx.schoolMembership.findUnique({where:{organizationId_schoolId_accountId:{organizationId:candidate.organizationId,schoolId:candidate.schoolId,accountId:account.id}},include:{grants:true}}):null;
   const live=!!invite&&invite.deliveryStatus==="SENT"&&invite.acceptedAt===null&&invite.revokedAt===null&&invite.expiresAt>now&&!!account&&account.status!=="DISABLED"&&!!org&&org.status==="ACTIVE"&&org.trustMode!=="OPERATOR_CLI"&&org.configurationVersion===invite.organizationConfigurationVersion&&!!school&&school.status==="ACTIVE"&&school.configurationVersion===invite.schoolConfigurationVersion&&!!inviter&&inviter.id===invite.inviterAccountId&&!!membership&&membership.status==="PENDING"&&membership.version===invite.membershipVersion&&membership.grants.map(g=>g.code).sort().join(",")===[...invite.proposedRoles].sort().join(",")&&((account!.status==="ACTIVE"&&!!account!.passwordHash)||!!(account!.status==="PENDING"&&input.initialPasswordHash));
   if(!live){await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId:account?.id??candidate.accountId,kind:"STAFF_INVITE_ACCEPT_DENIED",decision:"DENY",safeReason:"INVITATION_INVALID",policySnapshot:{organizationId:candidate.organizationId},requestId:input.requestId,occurredAt:now}});return false;}
   const consumed=await tx.accessInvite.updateMany({where:{id:invite!.id,deliveryStatus:"SENT",acceptedAt:null,revokedAt:null,expiresAt:{gt:now}},data:{acceptedAt:now}});if(consumed.count!==1)return false;
   if(account!.status==="PENDING")await tx.userAccount.update({where:{id:account!.id},data:{status:"ACTIVE",passwordHash:input.initialPasswordHash!,emailVerifiedAt:now,failedAttempts:0,lockedUntil:null,tokenVersion:{increment:1},version:{increment:1}}});
   else await tx.userAccount.update({where:{id:account!.id},data:{emailVerifiedAt:now,version:{increment:1}}});
   await tx.schoolMembership.update({where:{id:membership!.id},data:{status:"ACTIVE",version:{increment:1}}});
   await tx.accessInvite.updateMany({where:{organizationId:candidate.organizationId,schoolId:candidate.schoolId,accountId:candidate.accountId,id:{not:invite!.id},acceptedAt:null,revokedAt:null},data:{revokedAt:now}});
   await tx.authSecurityEvent.create({data:{id:randomUUID(),accountId:account!.id,actorAccountId:inviter!.id,kind:"STAFF_INVITE_ACCEPTED",decision:"ALLOW",safeReason:"INVITER_REAUTHORIZED",policySnapshot:{organizationId:org!.id,schoolId:school!.id,trustMode:org!.trustMode,roles:invite!.proposedRoles},requestId:input.requestId,occurredAt:now}});
   return true;
  },{timeout:12000,maxWait:10000});}catch(error){return this.fail(error);}
 }
}
