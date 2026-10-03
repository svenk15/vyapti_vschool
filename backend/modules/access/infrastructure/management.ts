import { createHash,createHmac,randomUUID,timingSafeEqual } from "node:crypto";
import type { Prisma,PrismaClient } from "../../../../generated/prisma/client";
import type { Identity } from "../../../../shared/contracts/access";
import type { ManagementCommand,ManagementResult,MemberStatus,StaffMember } from "../../../../shared/contracts/access-management";
import type { ManagementRepository } from "../application/management";
import { AccessError,uuidPattern } from "../domain/policy";
import { guardLastAdmin,nextMembershipStatus } from "../domain/management";
import type { CommandEvidenceWriter } from "../../platform/contracts/command-evidence";
import type { ScheduledSessionQuery } from "../../attendance/contracts/scheduled-sessions";
type Scope={organizationId:string;schoolId:string};
type Reader=Pick<Prisma.TransactionClient,"userAccount"|"$queryRaw">;
function canonical(value:unknown):string {if(Array.isArray(value))return "["+value.map(canonical).join(",")+"]";if(value&&typeof value==="object")return "{"+Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>JSON.stringify(k)+":"+canonical(v)).join(",")+"}";return JSON.stringify(value);}
export class PrismaManagementRepository implements ManagementRepository {
 constructor(private readonly db:PrismaClient,private readonly writer:(tx:Prisma.TransactionClient)=>CommandEvidenceWriter,private readonly sessions:(tx:Prisma.TransactionClient)=>ScheduledSessionQuery,private readonly cursorSecret:string,private readonly now:()=>Date=()=>new Date()){}
 private async scope(db:Reader,identity:Identity,schoolId?:string):Promise<Scope>{
  const account=await db.userAccount.findUnique({where:{id:identity.accountId},select:{status:true,tokenVersion:true}});
  if(!account||account.status!=="ACTIVE"||account.tokenVersion!==identity.tokenVersion)throw new AccessError("UNAUTHENTICATED");
  const rows=await db.$queryRaw<Scope[]>`SELECT s.organization_id AS "organizationId",s.id AS "schoolId" FROM vs_access_school s JOIN vs_access_organization o ON o.id=s.organization_id JOIN vs_access_school_membership m ON m.organization_id=s.organization_id AND m.school_id=s.id JOIN vs_access_user_account a ON a.id=m.account_id WHERE a.id=${identity.accountId}::uuid AND a.status='ACTIVE' AND a.token_version=${identity.tokenVersion} AND o.status='ACTIVE' AND s.status='ACTIVE' AND m.status='ACTIVE' AND (${schoolId??null}::uuid IS NULL OR s.id=${schoolId??null}::uuid) AND EXISTS(SELECT 1 FROM vs_access_role_grant g WHERE g.organization_id=m.organization_id AND g.school_id=m.school_id AND g.membership_id=m.id AND g.code='SCHOOL_ADMIN') ORDER BY s.id LIMIT 1`;
  if(!rows[0])throw new AccessError("NOT_FOUND");return rows[0];
 }
 private fail(error:unknown):never {if(error instanceof AccessError)throw error;if(typeof error==="object"&&error&&"code" in error&&error.code==="P2002")throw new AccessError("CONFLICT");throw new AccessError("UNAVAILABLE");}
 async settings(identity:Identity,schoolId?:string){try{return await this.db.$transaction(async tx=>{const scope=await this.scope(tx,identity,schoolId),school=await tx.school.findUniqueOrThrow({where:{id:scope.schoolId}}),campuses=await tx.campus.findMany({where:scope,orderBy:{code:"asc"},take:100});return {resourceId:school.id,organizationId:school.organizationId,schoolCode:school.code,name:school.name,timezone:school.timezone,status:school.status,version:school.version,campuses:campuses.map(c=>({resourceId:c.id,code:c.code,name:c.name,status:c.status,version:c.version}))};},{isolationLevel:"RepeatableRead"});}catch(error){return this.fail(error);}}
 private sign(value:string){return createHmac("sha256",this.cursorSecret).update(value).digest("base64url");}
 async members(identity:Identity,schoolId?:string,cursor?:string){try{return await this.db.$transaction(async tx=>{
  const scope=await this.scope(tx,identity,schoolId),binding=canonical({actor:identity.accountId,...scope,filter:"all",schemaVersion:1});let after:string|undefined;
  if(cursor){try{const [payload,signature,...extra]=cursor.split(".");const expected=this.sign(payload);if(extra.length||!signature||signature.length!==expected.length||!timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))throw new Error();const decoded=JSON.parse(Buffer.from(payload,"base64url").toString());if(decoded.binding!==binding||typeof decoded.after!=="string"||!uuidPattern.test(decoded.after))throw new Error();after=decoded.after;}catch{throw new AccessError("INVALID_CURSOR");}}
  const rows=await tx.schoolMembership.findMany({where:{...scope,...(after?{accountId:{gt:after}}:{})},orderBy:{accountId:"asc"},take:51,include:{account:{select:{id:true,normalizedEmail:true,status:true}},grants:{select:{code:true}}}});
  const items:StaffMember[]=rows.slice(0,50).map(m=>({resourceId:m.id,accountId:m.accountId,email:m.account.normalizedEmail,accountStatus:m.account.status,status:m.status as MemberStatus,version:m.version,roles:m.grants.map(g=>g.code as "SCHOOL_ADMIN"|"TEACHER")}));
  const payload=Buffer.from(JSON.stringify({binding,after:items.at(-1)?.accountId})).toString("base64url");return {items,nextCursor:rows.length>50?payload+"."+this.sign(payload):null};
 },{isolationLevel:"RepeatableRead"});}catch(error){return this.fail(error);}}
 async execute(identity:Identity,command:ManagementCommand,key:string,schoolId?:string):Promise<ManagementResult>{
  for(let attempt=0;attempt<3;attempt++)try{
   const scope=await this.scope(this.db,identity,schoolId);
   const candidate=command.kind==="UpdateMembership"?await this.db.schoolMembership.findFirst({where:{...scope,id:command.targetId},select:{accountId:true}}):null;
   if(command.kind==="UpdateMembership"&&!candidate)throw new AccessError("NOT_FOUND");
   const targetAccountId=candidate?.accountId??(command.kind==="CreateMembership"?command.payload.targetAccountId:undefined);
   const ids=[...new Set([identity.accountId,...(targetAccountId?[targetAccountId]:[])])].sort();
   return await this.db.$transaction(async tx=>{
    for(const id of ids)await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${id}::uuid FOR UPDATE`;
    await tx.$queryRaw`SELECT id FROM vs_access_organization WHERE id=${scope.organizationId}::uuid FOR SHARE`;
    await tx.$queryRaw`SELECT id FROM vs_access_school WHERE organization_id=${scope.organizationId}::uuid AND id=${scope.schoolId}::uuid FOR UPDATE`;
    await this.scope(tx,identity,scope.schoolId);
    const target=command.kind==="UpdateMembership"?await tx.schoolMembership.findFirst({where:{...scope,id:command.targetId},include:{account:{select:{status:true}},grants:true}}):null;
    if(command.kind==="UpdateMembership"&&(!target||target.accountId!==targetAccountId))throw new AccessError("NOT_FOUND");
    let existingAccount;
    if(command.kind==="CreateMembership"&&command.payload.targetAccountId){existingAccount=await tx.userAccount.findFirst({where:{id:command.payload.targetAccountId,memberships:{some:{organizationId:scope.organizationId}}},select:{id:true,status:true}});if(!existingAccount)throw new AccessError("NOT_FOUND");}
    const hash=createHash("sha256").update(canonical({schemaVersion:1,...scope,command})).digest("hex");
    const receipt=await tx.commandReceipt.findUnique({where:{organizationId_schoolId_actorAccountId_command_key:{...scope,actorAccountId:identity.accountId,command:command.kind,key}}});
    if(receipt){if(receipt.inputHash!==hash)throw new AccessError("IDEMPOTENCY_CONFLICT");return {...receipt.response as ManagementResult,replayed:true};}
    const now=this.now(),requestId=randomUUID();let result:ManagementResult,before:Record<string,unknown>={},after:Record<string,unknown>={},reason:string|undefined;
    if(command.kind==="UpdateSchool"){
     const school=await tx.school.findUniqueOrThrow({where:{id:scope.schoolId}});if(school.version!==command.expectedVersion)throw new AccessError("STALE_VERSION");
     if(school.timezone!==command.payload.timezone&&await this.sessions(tx).hasAny(scope.organizationId,scope.schoolId))throw new AccessError("TIMEZONE_IN_USE");
     const updated=await tx.school.update({where:{id:school.id},data:{...command.payload,version:{increment:1}}});before={name:school.name,timezone:school.timezone,version:school.version};after={...command.payload,version:updated.version};result={resourceId:updated.id,version:updated.version,status:updated.status,schoolCode:updated.code,...command.payload};
    }else if(command.kind==="CreateCampus"){
     if(await tx.campus.count({where:scope})>=100)throw new AccessError("CONFLICT");const campus=await tx.campus.create({data:{id:randomUUID(),...scope,...command.payload,status:"ACTIVE",version:1}});after={code:campus.code,name:campus.name};result={resourceId:campus.id,version:1,status:"ACTIVE",name:campus.name};
    }else if(command.kind==="CreateMembership"){
     const account=existingAccount??await tx.userAccount.create({data:{id:randomUUID(),normalizedEmail:command.payload.email!,status:"PENDING",passwordHash:null,tokenVersion:1,failedAttempts:0,version:1,createdAt:now}});
     const membership=await tx.schoolMembership.create({data:{id:randomUUID(),...scope,accountId:account.id,status:account.status==="ACTIVE"?"ACTIVE":"PENDING",version:1}});
     await tx.roleGrant.createMany({data:command.payload.roles.map(code=>({id:randomUUID(),...scope,membershipId:membership.id,code}))});after={status:membership.status,roles:command.payload.roles};result={resourceId:membership.id,version:1,status:membership.status,roles:command.payload.roles};
    }else{
     if(target!.version!==command.expectedVersion)throw new AccessError("STALE_VERSION");const oldRoles=target!.grants.map(g=>g.code),newRoles=command.payload.roles??oldRoles,status=nextMembershipStatus(command.payload.action,target!.account.status,target!.status as MemberStatus);
     const count=await tx.schoolMembership.count({where:{...scope,status:"ACTIVE",account:{status:"ACTIVE"},grants:{some:{code:"SCHOOL_ADMIN"}}}});
     guardLastAdmin(count,target!.status==="ACTIVE"&&target!.account.status==="ACTIVE"&&oldRoles.includes("SCHOOL_ADMIN"),status==="ACTIVE"&&target!.account.status==="ACTIVE"&&newRoles.includes("SCHOOL_ADMIN"));
     if(command.payload.action==="SET_ROLES"){await tx.roleGrant.deleteMany({where:{...scope,membershipId:target!.id}});await tx.roleGrant.createMany({data:command.payload.roles!.map(code=>({id:randomUUID(),...scope,membershipId:target!.id,code}))});}
     await tx.schoolMembership.update({where:{id:target!.id},data:{status,version:{increment:1}}});before={status:target!.status,roles:oldRoles,version:target!.version};after={status,roles:newRoles,version:target!.version+1};reason=command.payload.reason;result={resourceId:target!.id,version:target!.version+1,status,roles:newRoles as ("SCHOOL_ADMIN"|"TEACHER")[]};
    }
    await this.writer(tx).append({...scope,actorAccountId:identity.accountId,command:command.kind,key,inputHash:hash,response:result,before,after,reason,requestId,occurredAt:now.toISOString(),resourceType:command.kind.includes("Membership")?"SchoolMembership":command.kind==="CreateCampus"?"Campus":"School"});return {...result,replayed:false};
   },{timeout:10000,maxWait:10000});
  }catch(error){const record=error&&typeof error==="object"?error as {code?:string;meta?:{code?:string;driverAdapterError?:{cause?:{originalCode?:string}}}}:{};const codes=[record.code,record.meta?.code,record.meta?.driverAdapterError?.cause?.originalCode];if(codes.some(code=>["P2034","40001","40P01"].includes(code??""))&&attempt<2)continue;return this.fail(error);}
  throw new AccessError("UNAVAILABLE");
 }
}
