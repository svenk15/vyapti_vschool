import {randomUUID} from 'node:crypto';
import {Prisma,type PrismaClient} from '../../../../generated/prisma/client';
import type {Identity,OperatorPrincipal,RoleCode} from '../../../../shared/contracts/access';
import type {LeadershipBranchComparison,LeadershipBranchComparisonInput} from '../../../../shared/contracts/reporting';
import {moduleCatalog} from '../../../../shared/contracts/modules';
import {AccessError,capabilitiesFor} from '../../access/contracts/index';
import type {ReleaseManifest} from '../../tenancy/contracts/index';
import type {VerifiedDatabaseContextPort} from '../../tenancy/contracts/verified-database-context';
import type {LeadershipBranchComparisonRepository} from '../application/branch-comparison';
import {buildBranchComparison,type ComparisonSource} from '../domain/branch-comparison';

const metric='attendance-register-coverage.v1' as const;
const requiredModules=['attendance',...moduleCatalog.attendance.dependencies] as const;
type Scope=Readonly<{organizationId:string;schoolId:string}>;

function record(value:Prisma.JsonValue|undefined):Prisma.JsonObject|null{return value!==undefined&&value!==null&&!Array.isArray(value)&&typeof value==='object'?value:null;}
function wholeBranch(query:Prisma.JsonValue){
 const value=record(query),allowed=new Set(['date','sort','order','classId','status','teacherId']);
 return Boolean(value)&&Object.keys(value!).every(name=>allowed.has(name))&&['classId','status','teacherId'].every(name=>value![name]===undefined||value![name]===null);
}
function source(row:{schoolId:string;definitionVersion:string;schoolDate:Date;sourceAsOf:Date;payload:Prisma.JsonValue|null},branch:{id:string;name:string;timezone:string}):ComparisonSource|null{
 const payload=row.payload===null?null:record(row.payload),counts=payload?record(payload.counts):null;
 if(!payload||!counts||!wholeBranch(payload.query as Prisma.JsonValue)||payload.definitionVersion!=='register-coverage.v1'||row.definitionVersion!=='register-coverage.v1'||payload.duePolicy!=='SESSION_END_NO_GRACE'||typeof payload.timezone!=='string'||payload.schoolDate!==row.schoolDate.toISOString().slice(0,10))return null;
 const due=counts.due,received=counts.received,awaiting=counts.awaiting;if(![due,received,awaiting].every(value=>typeof value==='number'&&Number.isSafeInteger(value)&&value>=0)||Number(received)>Number(due))return null;
 return {branchId:row.schoolId,branchName:branch.name,timezone:payload.timezone,schoolDate:row.schoolDate.toISOString().slice(0,10),definitionVersion:row.definitionVersion,duePolicy:payload.duePolicy,sourceAsOf:row.sourceAsOf.toISOString(),counts:{due:Number(due),received:Number(received),awaiting:Number(awaiting)}};
}

export class PrismaLeadershipBranchComparisonRepository implements LeadershipBranchComparisonRepository {
 constructor(private readonly db:PrismaClient,private readonly manifest:ReleaseManifest,private readonly mode:'disabled'|'synthetic',private readonly now:()=>Date=()=>new Date(),private readonly context?:VerifiedDatabaseContextPort){}
 private run<T>(work:(tx:Prisma.TransactionClient)=>Promise<T>):Promise<T>{return this.db.$transaction(work,{isolationLevel:'RepeatableRead',timeout:20000,maxWait:10000}).catch(error=>{if(error instanceof AccessError)throw error;throw new AccessError('UNAVAILABLE');});}
 private async authorizeCurrent(tx:Prisma.TransactionClient,actor:Identity,scope:Scope){
  if(!this.context)throw new AccessError('UNAVAILABLE');await this.context.establish(tx,{accountId:actor.accountId,tokenVersion:actor.tokenVersion,organizationId:scope.organizationId,branchId:scope.schoolId});
  const account=await tx.userAccount.findUnique({where:{id:actor.accountId},select:{status:true,tokenVersion:true}});if(!account||account.status!=='ACTIVE'||account.tokenVersion!==actor.tokenVersion)throw new AccessError('UNAUTHENTICATED');
  const organization=await tx.organization.findFirst({where:{id:scope.organizationId,status:'ACTIVE'},select:{id:true}}),membership=await tx.schoolMembership.findFirst({where:{...scope,accountId:actor.accountId,status:'ACTIVE',school:{status:'ACTIVE'}},select:{grants:{select:{code:true}}}});if(!organization||!membership)throw new AccessError('NOT_FOUND');const roles=membership.grants.map(grant=>grant.code as RoleCode);if(!roles.includes('PRINCIPAL')||!capabilitiesFor(roles).includes('attendance.read_leadership'))throw new AccessError('FORBIDDEN');
 }
 private async targetEnabled(tx:Prisma.TransactionClient,organizationId:string,schoolId:string){
  const at=this.now();for(const moduleId of requiredModules){if(!this.manifest[moduleId])return false;const [entitlement,activation]=await Promise.all([tx.organizationEntitlement.findUnique({where:{organizationId_moduleId:{organizationId,moduleId}},select:{state:true,startsAt:true,endsAt:true}}),tx.branchActivation.findUnique({where:{organizationId_schoolId_moduleId:{organizationId,schoolId,moduleId}},select:{state:true}})]);if(!entitlement||entitlement.state!=='ACTIVE'||entitlement.startsAt>at||(entitlement.endsAt!==null&&entitlement.endsAt<=at)||!activation||activation.state!=='ACTIVE')return false;}return true;
 }
 async availability(actor:Identity,organizationId:string,currentSchoolId:string){return this.run(async tx=>{
  await this.authorizeCurrent(tx,actor,{organizationId,schoolId:currentSchoolId});if(this.mode!=='synthetic')return {enabled:false,metric,branches:[],reason:'REAL_DATA_POLICY_PENDING' as const};
  const grants=await tx.reportingComparisonGrant.findMany({where:{organizationId,accountId:actor.accountId,metric,revokedAt:null},select:{schoolId:true},orderBy:{schoolId:'asc'}}),schools=await tx.school.findMany({where:{organizationId,id:{in:grants.map(grant=>grant.schoolId)},status:'ACTIVE'},select:{id:true,name:true,timezone:true},orderBy:[{name:'asc'},{id:'asc'}]});const branches=[];for(const school of schools)if(await this.targetEnabled(tx,organizationId,school.id))branches.push(school);
  return {enabled:true,metric,branches,reason:branches.length?null:'NOT_DESIGNATED' as const};
 });}
 async compare(actor:Identity,organizationId:string,currentSchoolId:string,input:LeadershipBranchComparisonInput):Promise<LeadershipBranchComparison>{return this.run(async tx=>{
  await this.authorizeCurrent(tx,actor,{organizationId,schoolId:currentSchoolId});if(this.mode!=='synthetic')throw new AccessError('RELEASE_UNAVAILABLE');
  const grants=await tx.reportingComparisonGrant.findMany({where:{organizationId,accountId:actor.accountId,metric,revokedAt:null,schoolId:{in:[...input.branchIds]}},select:{schoolId:true}}),granted=new Set(grants.map(grant=>grant.schoolId)),schools=await tx.school.findMany({where:{organizationId,id:{in:[...granted]},status:'ACTIVE'},select:{id:true,name:true,timezone:true},orderBy:[{name:'asc'},{id:'asc'}]}),included=[];for(const school of schools)if(await this.targetEnabled(tx,organizationId,school.id))included.push(school);
  const includedIds=included.map(branch=>branch.id),snapshots=includedIds.length?await tx.reportingSnapshot.findMany({where:{organizationId,schoolId:{in:includedIds},reportType:metric,removedAt:null,schoolDate:{gte:new Date(`${input.fromDate}T00:00:00.000Z`),lte:new Date(`${input.toDate}T00:00:00.000Z`)}},select:{id:true,schoolId:true,definitionVersion:true,schoolDate:true,sourceAsOf:true,capturedAt:true,query:true,payload:true},orderBy:[{capturedAt:'desc'},{id:'desc'}]}):[];
  const latest=new Map<string,(typeof snapshots)[number]>();for(const snapshot of snapshots){const key=`${snapshot.schoolId}|${snapshot.schoolDate.toISOString().slice(0,10)}`;if(!latest.has(key)&&wholeBranch(snapshot.query))latest.set(key,snapshot);}
  const branchById=new Map(included.map(branch=>[branch.id,branch])),sources=[...latest.values()].flatMap(snapshot=>{const branch=branchById.get(snapshot.schoolId),parsed=branch?source(snapshot,branch):null;return parsed?[parsed]:[];}),built=buildBranchComparison(included,sources);
  return {metric,fromDate:input.fromDate,toDate:input.toDate,asOf:this.now().toISOString(),withheldBranchCount:input.branchIds.length-included.length,branches:built.rows,combined:built.combined,limitations:['Whole-branch retained snapshots only; no pupil, class, Teacher or subgroup comparison.','Combined coverage uses summed received and due counts only when source dates and definitions are compatible.','Snapshot cutoffs and branch timezones remain visible; unavailable or withheld branches do not contribute to totals.']};
 });}
 async grant(operator:OperatorPrincipal,input:Scope&{accountId:string}){if(operator.verified!==true)throw new AccessError('FORBIDDEN');return this.run(async tx=>{
  const [organization,school,account,principal]=await Promise.all([tx.organization.findFirst({where:{id:input.organizationId,status:'ACTIVE'},select:{id:true}}),tx.school.findFirst({where:{organizationId:input.organizationId,id:input.schoolId,status:'ACTIVE'},select:{id:true}}),tx.userAccount.findFirst({where:{id:input.accountId,status:'ACTIVE'},select:{id:true}}),tx.schoolMembership.findFirst({where:{organizationId:input.organizationId,accountId:input.accountId,status:'ACTIVE',grants:{some:{code:'PRINCIPAL'}}},select:{id:true}})]);if(!organization||!school||!account||!principal)throw new AccessError('NOT_FOUND');const at=this.now(),grant=await tx.reportingComparisonGrant.upsert({where:{organizationId_accountId_schoolId_metric:{organizationId:input.organizationId,accountId:input.accountId,schoolId:input.schoolId,metric}},create:{id:randomUUID(),...input,metric,grantedByOperatorId:operator.operatorId,grantedAt:at,version:1},update:{grantedByOperatorId:operator.operatorId,grantedAt:at,revokedAt:null,version:{increment:1}}});await tx.operatorAuditEntry.create({data:{id:randomUUID(),operatorId:operator.operatorId,command:'GrantReportingBranchComparison',resourceType:'ReportingComparisonGrant',resourceId:grant.id,occurredAt:at,details:{schemaVersion:1,organizationId:input.organizationId,schoolId:input.schoolId,accountId:input.accountId,metric}}});return {grantId:grant.id,version:grant.version};
 });}
 async revoke(operator:OperatorPrincipal,input:Scope&{accountId:string}){if(operator.verified!==true)throw new AccessError('FORBIDDEN');return this.run(async tx=>{const current=await tx.reportingComparisonGrant.findUnique({where:{organizationId_accountId_schoolId_metric:{organizationId:input.organizationId,accountId:input.accountId,schoolId:input.schoolId,metric}}});if(!current)throw new AccessError('NOT_FOUND');const at=this.now(),grant=await tx.reportingComparisonGrant.update({where:{id:current.id},data:{revokedAt:at,version:{increment:1}}});await tx.operatorAuditEntry.create({data:{id:randomUUID(),operatorId:operator.operatorId,command:'RevokeReportingBranchComparison',resourceType:'ReportingComparisonGrant',resourceId:grant.id,occurredAt:at,details:{schemaVersion:1,organizationId:input.organizationId,schoolId:input.schoolId,accountId:input.accountId,metric}}});return {grantId:grant.id,version:grant.version};});}
}
